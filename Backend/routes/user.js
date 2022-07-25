const express = require('express');
const User = require('../models/m_user.js');
const Review = require('../models/m_review.js');
const bcrypt = require('bcrypt');

// userRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /user.
const userRoutes = express.Router();

// This will help us connect to the database
const dbo = require('../db/conn');
const e = require('express');

// This help convert the id from string to ObjectId for the _id.
const ObjectId = require('mongodb').ObjectId;

//get all users
userRoutes.get('/users', async (req, res) => {
  try {
    let db_client = dbo.getClient();
    let data = await db_client.db('IR').collection('users').find({}).toArray();
    res.send(data);
  } 
  catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//get a specific user by _id
//send in a _id as a url parameter
//ex: localhost:5000/user?id=628310e922fae0e05a9b10ef --> parameter id = 628310e922fae0e05a9b10ef
userRoutes.get('/user', async (req, res) => {
  try {
    const id_obj = new ObjectId(req.query.id);
    let currentDate = new Date();
    let db_client = dbo.getClient();

    //get user
    let user_data = await db_client
      .db('IR')
      .collection('users')
      .find({ _id: id_obj })
      .toArray();

    //get all of the user's reservations
    let all_reservations = await db_client
      .db('IR')
      .collection('reservations')
      .find({ reserver_id: id_obj })
      .toArray();

    //for every reservation, get the associated island's name and image
    // for (let index = 0; index < all_reservations.length; index++) {
    //   const island = await db_client
    //     .db('IR')
    //     .collection('islands')
    //     .findOne({ _id: all_reservations[index].island_id }, {});

    //   all_reservations[index].island_name = island.name;
    //   all_reservations[index].island_img = island.islandImg;
    // }
    for (let reservation of all_reservations) {
      const island = await db_client
        .db('IR')
        .collection('islands')
        .findOne({ _id: reservation.island_id }, {});

      reservation.island_name = island.name;
      reservation.island_img = island.islandImg;
    }

    let past_reservations = [];
    let active_reservations = [];
    //split reservations into past and present/active
    // for (let resIndex = 0; resIndex < all_reservations.length; resIndex++) {
    //   if (all_reservations[resIndex].startDate > currentDate ||
    //     all_reservations[resIndex].endDate > currentDate) {
    //     active_reservations.push(all_reservations[resIndex]);
    //   } 
    //   else {
    //     past_reservations.push(all_reservations[resIndex]);
    //   }
    // }
    for (let reservation of all_reservations) {
      if (reservation.startDate > currentDate || reservation.endDate > currentDate) {
        active_reservations.push(reservation);
      } 
      else {
        past_reservations.push(reservation);
      }
    }


    //return user and user's reservations info
    res.status(200).json({
      user_info: user_data[0],
      active_res_count: active_reservations.length,
      past_res_count: past_reservations.length,
      active_reservations: active_reservations,
      past_reservations: past_reservations,
    });
  } 
  catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Sign up route
userRoutes.route('/user/signup').post(async (req, res) => {
  let db_client = dbo.getDb();

  // Get request body
  const { firstname, lastname, email, password } = req.body;

  //the password has to be at least 8 characters long
  if (password.length < 8) {
    return res
      .status(410)
      .json({ message: 'Password must be at least 8 characters long.' });
  }

  //email must have a valid format
  if (email.indexOf('@') == -1 || email.indexOf('.') == -1) {
    return res.status(410).json({ message: 'Not a valid email.' });
  }

  //hash the password
  const hash = await bcrypt.hash(password, 12);

  // Check if email already exists
  let existingEmail = await db_client
    .collection('users')
    .find({ email: email })
    .toArray();
  if (existingEmail.length != 0) {
    // If email exists, send 409 error code with an error message
    return res.status(409).json({ message: 'Email is already in use.' });
  } 

  // Create user object to insert into database
  const user = new User({
    firstname,
    lastname,
    email,
    password: hash,
    balance: 0,
    isAdmin: false,
  });

  // Insert into database
  db_client.collection('users').insertOne(user, (err) => {
    if (err) {
      // If insert fails, return 500 error status
      return res
        .status(500)
        .json({ message: 'Server Error. Failed to insert into database.' });
    }
    // Return user input in api call, automatically returns 200 success status
    return res.json(user);
  });
});

//logging in a user
userRoutes.post('/user/signin', async (req, res) => {
  let db_client = dbo.getDb(); //IR DB
  const { email, password } = req.body;

  //get user
  const user = await db_client
    .collection('users')
    .findOne({ email: email }, {});

  //check if user exists
  if (!user) {
    return res
      .status(500)
      .json({ message: `${email} doesn't exist in our records.` });
  } else {
    console.log(user);

    //check if the password matches what's in the database
    const validPassword = await bcrypt.compare(password, user.password);
    if (validPassword) {
      console.log('successful login');
      // if a successful login, store user id in session
      console.log(`user id: ${user._id.toString()}`);

      //admin path
      if (user.isAdmin) {
        const allCustomers = await User.find({ isAdmin: false });
        const allAdmins = await User.find({ isAdmin: true });
        res.status(200).json(user);
      //regular user path
      } 
      else {
        let db_client = dbo.getClient();
        const id_obj = new ObjectId(user._id.toString());
        let currentDate = new Date();
        //get user's reservations
        let all_reservations = await db_client
          .db('IR')
          .collection('reservations')
          .find({ reserver_id: id_obj })
          .toArray();
        let past_reservations = [];
        let active_reservations = [];
        //sort reservations by past and present/active
        // for (let resIndex = 0; resIndex < all_reservations.length; resIndex++) {
        //   if (
        //     all_reservations[resIndex].startDate > currentDate ||
        //     all_reservations[resIndex].endDate > currentDate
        //   ) {
        //     active_reservations.push(all_reservations[resIndex]);
        //   } else {
        //     past_reservations.push(all_reservations[resIndex]);
        //   }
        // }
        for (let reservation of all_reservations) {
          if (reservation.startDate > currentDate || reservation.endDate > currentDate) {
            active_reservations.push(reservation);
          } 
          else {
            past_reservations.push(reservation);
          }
        }

        //return user and reservation info
        res.status(200).json({
          user_info: user,
          active_res_count: active_reservations.length,
          past_res_count: past_reservations.length,
          active_reservations: active_reservations,
          past_reservations: past_reservations,
        });
      }

    } 
    else {
      console.log('failed login');
      return res.status(500).json({ message: `failed login for: ${email}` });
    }
  }
});

// A route to add balance to user
userRoutes.post('/user/addcredit/:id', async (req, res) => {
  let db_client = dbo.getDb();
  // Get userID who we are adding credit to
  const userID = req.params.id;

  // This is the form data from Add Credit page, we don't do anything with it currently
  const { firstname, lastname, ccnumber, expr, cvc, addamount } = req.body;

  // Make sure user exists in database
  const user = await db_client
    .collection('users')
    .findOne({ _id: ObjectId(userID) });

  if (!user) {
    // If user not found return error message
    return res
      .status(500)
      .json({ message: 'User doesn\'t exist in our records.' });
  } else {
    // MongoDB query to find user
    const myquery = { _id: ObjectId(userID) };
    // Calculate updated balance
    const updatedBalance = parseInt(addamount) + parseInt(user.balance);
    // MongoDB query to update user's balance
    const newvalues = { $set: { balance: updatedBalance } };
    // Update user
    await db_client
      .collection('users')
      .findOneAndUpdate(
        myquery,
        newvalues,
        { returnDocument: 'after' },
        (err, response) => {
          if (err) throw err;
          // Return updated user info
          res.status(200).json(response.value);
        }
      );
  }
});

//update user information
userRoutes.post('/user/update', async (req, res) => {
  let db_client = dbo.getDb();
  const userID = new ObjectId(req.query.id);

  const { firstname, lastname, password } = req.body;

  //password must be at least 8 characters long
  if (password.length < 8) {
    return res
      .status(410)
      .json({ message: 'Password must be at least 8 characters long.' });
  }

  //get user
  const user = await db_client
    .collection('users')
    .findOne({ _id: ObjectId(userID) });

  // Make sure user exists in database
  if (!user) {
    // If user not found return error message
    return res
      .status(500)
      .json({message: 'User doesn\'t exist in our records.' });
  } 
  else {
    const myquery = { _id: userID };
    //hash the password
    const hashed_password = await bcrypt.hash(password, 12);

    const newvalues = { $set: { 'firstname': firstname, 'lastname': lastname, 'password': hashed_password } };
    // Update user
    await db_client
      .collection('users')
      .findOneAndUpdate(myquery, newvalues, {returnDocument: 'after'}, (err, response) => {
        if (err) throw err;
        // Return updated user info
        res.status(200).json(response.value);
      });
  }
});

//update user information (first name only)
userRoutes.post('/user/update/firstname', async (req, res) => {
  let db_client = dbo.getDb();
  const userID = new ObjectId(req.query.id);

  const { firstname} = req.body;

  // Make sure user exists in database
  const user = await db_client
    .collection('users')
    .findOne({ _id: ObjectId(userID) });

  if (!user) {
    // If user not found return error message
    return res
      .status(500)
      .json({ message: 'User doesn\'t exist in our records.' });
  } 
  else {
    const myquery = { _id: userID };
    const newvalues = { $set: { firstname: firstname }, };

    // Update user
    await db_client
      .collection('users')
      .findOneAndUpdate(
        myquery,
        newvalues,
        { returnDocument: 'after' },
        (err, response) => {
          if (err) throw err;
          // Return updated user info
          res.status(200).json(response.value);
        }
      );
  }
});

//update user information (last name only)
userRoutes.post('/user/update/lastname', async (req, res) => {
  let db_client = dbo.getDb();
  const userID = new ObjectId(req.query.id);

  const {lastname} = req.body;

  // Make sure user exists in database
  const user = await db_client
    .collection('users')
    .findOne({ _id: ObjectId(userID) });

  if (!user) {
    // If user not found return error message
    return res
      .status(500)
      .json({ message: 'User doesn\'t exist in our records.' });
  } 
  else {
    const myquery = { _id: userID };
    const newvalues = { $set: { lastname: lastname }, };

    // Update user
    await db_client
      .collection('users')
      .findOneAndUpdate(
        myquery,
        newvalues,
        { returnDocument: 'after' },
        (err, response) => {
          if (err) throw err;
          // Return updated user info
          res.status(200).json(response.value);
        }
      );
  }
});

//update user information (password only)
userRoutes.post('/user/update/password', async (req, res) => {
  let db_client = dbo.getDb();
  const userID = new ObjectId(req.query.id);

  const { password } = req.body;

  //password must be at least 8 characters
  if (password.length < 8) {
    return res
      .status(410)
      .json({ message: 'Password must be at least 8 characters long.' });
  }

  // Make sure user exists in database
  const user = await db_client
    .collection('users')
    .findOne({ _id: ObjectId(userID) });

  if (!user) {
    // If user not found return error message
    return res
      .status(500)
      .json({ message: 'User doesn\'t exist in our records.' });
  } else {
    const myquery = { _id: userID };
    const hashed_password = await bcrypt.hash(password, 12);

    const newvalues = { $set: { password: hashed_password }, };

    // Update user
    await db_client
      .collection('users')
      .findOneAndUpdate(
        myquery,
        newvalues,
        { returnDocument: 'after' },
        (err, response) => {
          if (err) throw err;
          // Return updated user info
          res.status(200).json(response.value);
        }
      );
  }
});

// A route to add balance to user
userRoutes.post('/user/reserve/:id', async (req, res) => {
  let db_client = dbo.getDb();
  // Get userID who we are adding credit to
  const userID = req.params.id;
  // This is the form data from Add Credit page, we don't do anything with it currently
  const { firstname, lastname, islandName } = req.body;
  // Make sure user exists in database
  const user = await db_client
    .collection('users')
    .findOne({ _id: ObjectId(userID) });
  if (!user) {
    // If user not found return error message
    return res
      .status(500)
      .json({ message: 'User doesn\'t exist in our records.' });
  } else {
    // found the user, now find the island based on its id
    const island = await db_client
      .collection('islands')
      .findOne({ name: islandName });

    if (!island) {
      console.log('Island was not found!');
      return res
        .status(500)
        .json({ message: 'Island was not found in the database' });
    } else {
      console.log(`Island named: ${islandName} was found!`);

      if (!island.is_available) {
        console.log(
          `Sorry! ${island.name} Island is already reserved by another client!`
        );
        //instead render an actual page
        return res
          .status(500)
          .json({ message: 'Island is already reserved by another client' });
      } else {
        //updat Availability of island (if it is already available)
        // MongoDB query to find island
        const myquery = { name: islandName };
        // Calculate updated balance
        const updatAvailability = false;
        // MongoDB query to update user's balance
        const newvalues = { $set: { is_available: updatAvailability } };
        // Update user
        await db_client
          .collection('islands')
          .findOneAndUpdate(
            myquery,
            newvalues,
            { returnDocument: 'after' },
            (err, response) => {
              if (err) throw err;
              // Return updated user info
              res.status(200).json(response.value);
            }
          );
      }
    }
  }
});


//get the islands that a user has uploaded
//send in a _id as a url parameter
//ex: localhost:5000/user/islands?id=628310e922fae0e05a9b10ef --> parameter id = 628310e922fae0e05a9b10ef
userRoutes.get('/user/islands', async (req, res) => {
  try {
    const id_obj = new ObjectId(req.query.id);
    let db_client = dbo.getClient();

    //get user
    let user_data = await db_client
      .db('IR')
      .collection('users')
      .find({ _id: id_obj })
      .toArray();

    //get the user's islands
    let user_islands = await db_client
      .db('IR')
      .collection('islands')
      .find({ owner_id: id_obj })
      .toArray();

    //return the user info and the user's islands
    res.status(200).json({
      user_info: user_data[0],
      user_islands: user_islands
    });
  } 
  catch (error) {
    res.status(500).json({ message: error.message });
  }
});

userRoutes.post('/user/review/:id/:Iid', async (req, res) => {
  let db_client = dbo.getDb();
  // get the reservation info from the reserve form
  const {  islandName, userReview, rating } = req.body;

  const island_id = req.params.Iid;
  const user_id = req.params.id;

  console.log('userid', user_id);
  // check if a review exist already
  const checkreviewed = await db_client
    .collection('reviews')
    .findOne({ user_id: ObjectId(user_id) , island_id: ObjectId(island_id)} );

  console.log('checked', checkreviewed);
  if(checkreviewed){
    console.log('You\'ve made a review for this island already!');
    return res
    .status(500)
    .json({ message: 'Review has been made already' });
  } 

  // Make sure user exists in database
  const user = await db_client
    .collection('users')
    .findOne({ _id: ObjectId(user_id) });
  if (!user) {
    // If user not found return error message
    return res
      .status(500)
      .json({ message: 'User doesn\'t exist in our records. (review form)' });
  } else {
    // found the user, now find the island based on its id
    const island = await db_client
      .collection('islands')
      .findOne({ _id: ObjectId(island_id) });

    if (!island) {
      console.log('Island was not found!');
      return res
        .status(500)
        .json({ message: 'Island was not found in the database' });
    } else {

      console.log(`Island named: ${island.name} was found!`);

      // now add review to reviews collections
      // Create object to insert into database
      const review = new Review({
        // review_id,
        user_id,
        island_id,
        islandName,
        userReview,
        rating,
      });

      // Insert into database
      db_client.collection('reviews').insertOne(review, (err) => {
        if (err) {
          // If insert fails, return 500 error status
          return res
            .status(500)
            .json({ message: 'Server Error. Failed to insert into database.' });
          // res.status(500).send('Server Error: Failed to insert into database.');
          throw err;
        }
      });
      console.log('REVIEW HAS BEEN ADDED !!!!!');
      console.log(`userReview: ${userReview}`);

      const numReviews = await db_client
        .collection('reviews')
        .count({island_id : ObjectId(island_id)});

      //update the rating of the island
      const myquery = { _id: ObjectId(island_id)};
      // Calculate updated balance
      // Fixed infinite rating bug when island has no reviews (divide by 0)
      const rateAvg = (numReviews > 0) ? ((rating - island.rating) * 1.0 / numReviews) : ((rating - island.rating) * 1.0 / 1);
      const updatedRating = island.rating + rateAvg;
      console.log(`island.rating: ${island.rating}`);
      console.log(`rating: ${rating}`);
      console.log(`updatedRating: ${updatedRating}`);

      const newvalues = { $set: { rating: updatedRating } };
      // Update user
      await db_client
        .collection('islands')
        .findOneAndUpdate(
          myquery,
          newvalues,
          { returnDocument: 'after' },
          (err, response) => {
            if (err) throw err;
            // Return updated user info
            res.status(200).json(response.value);
          }
        );
    }
  }
});

// get reviews for island by island_id
userRoutes.get('/user/review', async (req, res) => {
  try {
    const island_id = new ObjectId(req.query.id);
    let db_client = dbo.getClient();
    let reviews_data = await db_client
      .db('IR')
      .collection('reviews')
      .find({ island_id: island_id })
      .toArray();
    console.log(reviews_data);
    res.send(reviews_data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = userRoutes;
