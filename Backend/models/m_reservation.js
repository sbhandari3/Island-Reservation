//if this doesn't work and the mongoose module can't be found, type npm install mongoose into terminal
const mongoose = require('mongoose');

// Define Reservation schema
const reservationSchema = new mongoose.Schema({
  //id must be found in the users collection under an _id 
  reserver_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  //id must be found in the islands collection under an _id
  island_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Island',
  },
  amountPaid: {
    type: Number,
  },
  //the date that the reservation was made
  reservationDate: {
    type: Date,
  },
  startDate: {
    type: Date,
  },
  endDate: {
    type: Date,
  },
});

const Reservation = mongoose.model('Reservation', reservationSchema);

module.exports = Reservation;