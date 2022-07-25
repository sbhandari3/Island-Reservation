const mongoose = require('mongoose');

// define the user schema
const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: [true, 'First Name cannot be blank'],
  },
  lastname: {
    type: String,
    required: [true, 'Last Name cannot be blank'],
  },
  email: {
    type: String,
    required: [true, 'Email cannot be blank'],
  },
  password: {
    type: String,
    required: [true, 'Password cannot be blank'],
  },
  balance: {
    type: Number,
    min: 0,
  },
  isAdmin: {
    type: Boolean,
    required: [true, 'Needs to specify if user is admin'],
  },
});

//make the model and export it
module.exports = mongoose.model('User', userSchema);
