const express = require('express');
const Reservation = require('../models/m_reservation.js');
const bcrypt = require('bcrypt');
const ObjectId = require('mongodb').ObjectId;
const moment = require('moment');

const reservationRoutes = express.Router();

// This will help us connect to the database
const dbo = require('../db/conn');

//get all reservations
reservationRoutes.get('/reservations', async (req, res) => {
  try
  {
    let db_client = dbo.getClient();
    let data = await db_client.db('IR').collection('reservations').find({}).toArray();

    res.send(data);
  }
  catch(error)
  {
    res.status(500).json({message: error.message});
  }
})

// Add reservation route
reservationRoutes.route('/reservations/add/:uid/:lid').post(async (req, res) => {
  let db_client = dbo.getClient();
  let reserver_id = req.params.uid;
  let island_id = req.params.lid;
  // Get request body
  let { 
    startDate,
    endDate,
    amountPaid,
  } = req.body;

  // Moment gets local time
  const reservationDate = moment();
  // startDate check in time is 3pm
  startDate = moment(startDate).set('hour', 15);
  // endDate check out time is 12pm
  endDate = moment(endDate).set('hour', 12);
    
  // Check for edge case: If local time is 2:59PM and user books same day
  // but sends reservation in at 3:00PM, return error as they missed the
  // window to reserve
  if(reservationDate > startDate){
    return res
      .status(500)
      .json({message: 'Sorry, the reservation window for this booking has closed.'});
  }

  // Check if username or island exists in database
  let existingUser = await db_client.db('IR').collection('users').find({_id: ObjectId(reserver_id)}).toArray();
  let existingIsland = await db_client.db('IR').collection('islands').find({_id: ObjectId(island_id)}).toArray();
  //get list of reservations for the island the user is trying to reserve
  let islandsReservations = await db_client.db('IR').collection('reservations').find({island_id: ObjectId(island_id)}).toArray();
  let userReservations = await db_client.db('IR').collection('reservations').find({reserver_id: ObjectId(reserver_id)}).toArray();
  if (existingUser.length <= 0)
  {
    return res.status(409).json({message: 'User not found.'});
  } 
  else if (existingIsland.length <= 0) 
  {
    return res.status(409).json({message: 'Island not found'});
  }
  const user = existingUser[0];

  //check if the user has enough balance to pay for the reservation
  if (user.balance < amountPaid) {
    console.log('Sorry, your balance is not enough to reserve the island, please add money to your account!');
    return res
      .status(500)
      .json({message: 'Sorry, your balance is not enough to reserve the island, please add money to your account!'});
  }

//   for (let index = 0; index < islandsReservations.length; index++)
//   {
//     //if there is an existing reservation for the island that overlaps with the new reservation's time slot, reject it
//     if ((islandsReservations[index].endDate >= startDate && islandsReservations[index].endDate <= endDate) ||
//       (endDate >= islandsReservations[index].startDate && endDate <= islandsReservations[index].endDate))
//     {
//       return res
//         .status(500)
//         .json({message: 'Sorry, your selected reservations dates conflict with an existing reservation for this island.'});
//     }
//   }
  for (const reservation of islandsReservations) {
    //if there is an existing reservation for the island that overlaps with the new reservation's time slot, reject it
    if ((reservation.endDate >= startDate && reservation.endDate <= endDate) ||
      (endDate >= reservation.startDate && endDate <= reservation.endDate))
    {
      return res
        .status(500)
        .json({message: 'Sorry, your selected reservations dates conflict with an existing reservation for this island.'});
    }
  }

//   for (let index = 0; index < userReservations.length; index++)
//   {
//     //if the user has a reservation that overlaps with the new reservation's time slot, reject it
//     if ((userReservations[index].endDate >= startDate && userReservations[index].endDate <= endDate) ||
//       (endDate >= userReservations[index].startDate && endDate <= userReservations[index].endDate))
//     {
//       return res
//         .status(500)
//         .json({message: 'Sorry, your selected reservations dates conflict with one of your existing reservations.'});
//     }
//   }

  for (const reservation of userReservations) {
    //if the user has a reservation that overlaps with the new reservation's time slot, reject it
    if ((reservation.endDate >= startDate && reservation.endDate <= endDate) ||
      (endDate >= reservation.startDate && endDate <= reservation.endDate)) {
      return res
        .status(500)
        .json({message: 'Sorry, your selected reservations dates conflict with one of your existing reservations.'});
    }
  }

  //update user balance start ---------------------------
  const userQuery = { _id: ObjectId(reserver_id) };
  // Calculate updated balance
  const updatedBalance = user.balance - amountPaid;
  // MongoDB query to update user's balance
  const updateParameter = { $set: { balance: updatedBalance } };
  // Update user
  await db_client
    .db('IR')
    .collection('users')
    .updateOne(
      userQuery,
      updateParameter,
      { returnDocument: 'after' },
      (err, response) => {
        if (err) throw err;
      }
    );
  // update user balance end ---------------------------

  // Create reservation object to insert into database
  const reservation = new Reservation({
    reserver_id,
    island_id,
    amountPaid,
    reservationDate,
    startDate,
    endDate,
  });
  
  // Insert into database
  db_client
    .db('IR')
    .collection('reservations')
    .insertOne(reservation, (err) => {
      if (err) {
        // If insert fails, return 500 error status
        return res.status(500).json({message: 'Server Error. Failed to insert into database.'});
      }
      // Return reservation deatils in api call, automatically returns 200 success status
      return res.json(reservation);
    });
});

module.exports = reservationRoutes;