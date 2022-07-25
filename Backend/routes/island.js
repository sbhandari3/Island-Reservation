const express = require('express');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
uuidv4();
// userRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const islandRoutes = express.Router();

// This will help us connect to the database
const dbo = require('../db/conn');

// This help convert the id from string to ObjectId for the _id.
const ObjectId = require('mongodb').ObjectId;

const Island = require('../models/m_island.js');
const DIR = './public/';
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, DIR);
  },
  filename: (req, file, cb) => {
      const fileName = file.originalname.toLowerCase().split(' ').join('-');
      console.log('filename:', fileName)
      cb(null, uuidv4() + '-' + fileName)
  }
});

let upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
      if (file.mimetype == 'image/png' || file.mimetype == 'image/jpg' || file.mimetype == 'image/jpeg') {
          cb(null, true);
      } else {
          cb(null, false);
          return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
      }
  }
});

//get a list of all islands
islandRoutes.get('/islands', async (req, res) => {
  try
  {
    // console.log('got inside');
    let db_client = dbo.getClient();
    let data = await db_client.db('IR').collection('islands').find({}, 
      {projection: {name: 1, location: 1, land_size: 1, islandImg: 1, rating: 1, price: 1, latitude: 1, longitude: 1}})
        .toArray();

    res.send(data);
  }
  catch(error)
  {
    res.status(500).json({message: error.message});
  }
})

//get a specific island's info by _id
//send in a _id as a url parameter
//ex: localhost:5000/island?id=627c579e955e61bdfe61df69 --> parameter id = 627c579e955e61bdfe61df69
islandRoutes.get('/island', async (req, res) => {
  try
  {
    const id_obj = new ObjectId(req.query.id);
    let db_client = dbo.getClient();
    let island_data = await db_client.db('IR').collection('islands').find({_id: id_obj}).toArray();

    res.send(island_data[0]);
  }
  catch(error)
  {
    res.status(500).json({message: error.message});
  }
})

//return a list of sorted islands according to the arguments passed in
//parameter - the island attribute to sort by 
//order - ascending (asc) or descending (desc)
async function getSortedIslands(parameter, order) {
  let db_client = dbo.getClient();
  let all_islands = await db_client.db('IR').collection('islands').find({}).toArray();
    
  let map = new Map();
  let map_sorted = new Map();
  let sorted_data = new Array();

  //fill a map with the island as the key and the specified attribute as the value
  // for (let island = 0; island < all_islands.length; island++)
  // {
  //   map.set(all_islands[island], all_islands[island][parameter]);
  // }
  for (let island of all_islands) {
    map.set(island, island[parameter]);
  }

  //from code found on StackOverflow
  //sort the map by the values (the specified attribute)
  if (order == 'asc')
    map_sorted = new Map([...map.entries()].sort((val1, val2) => val1[1] - val2[1]));
  //descending
  else map_sorted = new Map([...map.entries()].sort((val1, val2) => val2[1] - val1[1]));

  //fill the sorted_data array with the sorted elements of the map in the right order
  for (let island of map_sorted.keys())
  {
    sorted_data.push(island);
  }

  return sorted_data;
}

//returns a list of islands sorted by ascending land_size
islandRoutes.get('/islands/land_size/asc', async (req, res) => {
  try
  {
    const result = await getSortedIslands('land_size', 'asc');
    res.send(result);
  }
  catch(error)
  {
    res.status(500).json({message: error.message});
  }
})

//returns a list of islands sorted by descending land_size
islandRoutes.get('/islands/land_size/desc', async (req, res) => {
  try
  {
    const result = await getSortedIslands('land_size', 'desc');
    res.send(result);
  }
  catch(error)
  {
    res.status(500).json({message: error.message});
  }
})

//returns a list of islands sorted by ascending price
islandRoutes.get('/islands/price/asc', async (req, res) => {
  try
  {
    const result = await getSortedIslands('price', 'asc');
    res.send(result);
  }
  catch(error)
  {
    res.status(500).json({message: error.message});
  }
})

//returns a list of islands sorted by descending price
islandRoutes.get('/islands/price/desc', async (req, res) => {
  try
  {
    const result = await getSortedIslands('price', 'desc');
    res.send(result);
  }
  catch(error)
  {
    res.status(500).json({message: error.message});
  }
})

//returns a list of islands sorted by ascending rating
islandRoutes.get('/islands/rating/asc', async (req, res) => {
  try
  {
    const result = await getSortedIslands('rating', 'asc');
    res.send(result);
  }
  catch(error)
  {
    res.status(500).json({message: error.message});
  }
})

//returns a list of islands sorted by descending rating
islandRoutes.get('/islands/rating/desc', async (req, res) => {
  try
  {
    const user_lat = req.query.latitude;
    const user_long = req.query.longitude;
    const result = await getSortedIslands('rating', 'desc');
    res.send(result);
  }
  catch(error)
  {
    res.status(500).json({message: error.message});
  }
})

//function taken from https://www.geodatasource.com/developers/javascript
//latitude and longitude in meters
function distance(lat1, lon1, lat2, lon2) {
	if ((lat1 == lat2) && (lon1 == lon2)) {
		return 0;
	}
	else {
		let radlat1 = Math.PI * lat1/180;
		let radlat2 = Math.PI * lat2/180;
		let theta = lon1-lon2;
		let radtheta = Math.PI * theta/180;
		let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
		if (dist > 1) {
			dist = 1;
		}
		dist = Math.acos(dist);
		dist = dist * 180/Math.PI;
		dist = dist * 60 * 1.1515;
		dist = dist * 1609.344; //in meters
		return dist;
	}
}

//take in user latitude and longitude and return a list of islands sorted by ascending distance
islandRoutes.get('/islands/distance', async (req, res) => {
  try
  {
    const user_lat = req.query.latitude;
    const user_long = req.query.longitude;
    let db_client = dbo.getClient();
    let all_islands = await db_client.db('IR').collection('islands').find({}).toArray();

    // for (let index = 0; index < all_islands.length; index++) {
    //   all_islands[index].dist_from_user = await distance(user_lat, user_long, 
    //     all_islands[index].latitude, all_islands[index].longitude);
    // }
    for (let island of all_islands) {
      island.dist_from_user = await distance(user_lat, user_long, 
        island.latitude, island.longitude);
    }

    let map = new Map();
    let map_sorted = new Map();
    let sorted_data = new Array();

    // for (let island = 0; island < all_islands.length; island++) {
    //   map.set(all_islands[island], all_islands[island].dist_from_user);
    // }
    for (let island of all_islands) {
      map.set(island, island.dist_from_user);
    }

    map_sorted = new Map([...map.entries()].sort((val1, val2) => val1[1] - val2[1]));

    for (let island of map_sorted.keys()) {
      sorted_data.push(island);
    }

    res.send(sorted_data);
  }
  catch(error)
  {
    res.status(500).json({message: error.message});
  }
})


// adding an island
islandRoutes.route('/islands/add').post(upload.single('islandImg'), async (req, res) => {
  let db_client = dbo.getDb();
  // Get request body
  const name = req.body.name;
  const location = req.body.location;
  const land_size = req.body.land_size;
  const details = req.body.details;
  const rating = req.body.rating;
  const price = req.body.price;
  const is_available = req.body.is_available;
  const latitude = req.body.latitude;
  const longitude = req.body.longitude;
  const owner_id = new ObjectId(req.body.owner_id);
  
  const url = req.protocol + '://' + req.get('host');
  const islandImg = url + '/public/' + req.file.filename;

  // Create object to insert into database
  const island = new Island({
    name,
    location,
    land_size,
    details,
    price,
    rating,
    islandImg,
    is_available,
    latitude,
    longitude,
    owner_id,
  });
 
  // Insert into database
  db_client.collection('islands').insertOne(island, (err) => {
    if (err) {
      // If insert fails, return 500 error status
      res.status(500).send('Server Error: Failed to insert into database.');
      throw err;
    }
    // Return user input in api call, automatically returns 200 success status
    return res.status(200).json(island);
  });
});

//update island information (island name, location, land_size, details, price, latitude, longitude, islandImg)
//pass in the island id as a url parameter
islandRoutes.post('/island/update', upload.single('islandImg'), async (req, res) => {
  let db_client = dbo.getDb();
  const islandID = new ObjectId(req.query.id);

  const { name, location, land_size, details, price, latitude, longitude } = req.body;

  const updateJSON = {};
  if (name != null)
    updateJSON['name'] = name;

  if (location != null)
    updateJSON['location'] = location;

  if (land_size != null)
    updateJSON['land_size'] = land_size;

  if (details != null)
    updateJSON['details'] = details;

  if (price != null)
    updateJSON['price'] = parseInt(price);

  if (latitude != null)
    updateJSON['latitude'] = latitude;

  if (longitude != null)
    updateJSON['longitude'] = longitude;

  try {
    const url = req.protocol + '://' + req.get('host');
    const islandImg = url + '/public/' + req.file.filename;
    console.log('img', islandImg);
    updateJSON['islandImg'] = islandImg;
  }
  catch {
    console.log('not updating island image');
  }

  //get the island based on the passed in island id
  const island = await db_client
    .collection('islands')
    .findOne({ _id: ObjectId(islandID) });

  //make sure the island exists in the database
  if (!island) {
    // If user not found return error message
    return res
      .status(500)
      .json({message: 'Island doesn\'t exist in our records.' });
  } 
  else {
    const myquery = { _id: islandID };
    const newvalues = { $set: updateJSON};
    // Update island
    await db_client
      .collection('islands')
      .findOneAndUpdate(myquery, newvalues, {returnDocument: 'after'}, (err, response) => {
        if (err) throw err;
        // Return updated island JSON
        res.status(200).json(response.value);
      });
  }
});


module.exports = islandRoutes;