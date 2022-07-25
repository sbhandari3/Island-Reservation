//if this doesn't work and the mongoose module can't be found, type npm install mongoose into terminal
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// create island schema & model
const islandSchema = new Schema({
  name: {
    type: String
  },
  location: {
    type: String
  },
  land_size: {
	type: Number
  },
  details: {
    type: String
  },
  price: {
    type: Number
  },
  rating: {
    type: Number
  },
  islandImg: {
    type: String
  },
  is_available: {
    type: Boolean
  },
  latitude: {
    type: Number
  },
  longitude: {
    type: Number
  },
  //id must be found in the users collection under an _id
  owner_id: {
    type: mongoose.Schema.Types.ObjectId
  }
});

const Island = mongoose.model('island', islandSchema);

module.exports = Island;