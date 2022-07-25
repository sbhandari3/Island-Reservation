const { MongoClient } = require("mongodb");
const Db = process.env.ATLAS_URI;
const client = new MongoClient(Db, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
 
let IR_db;

async function listDatabases(client){
  databasesList = await client.db().admin().listDatabases();

  console.log("Databases:");
  databasesList.databases.forEach(db => console.log(` - ${db.name}`));
};
 
module.exports = {
  connectToServer: async function (callback) {
    await client.connect(async function (err, db) {
      // Verify we got a good "db" object
      if (db)
      {
        IR_db = db.db("IR");
        console.log("Successfully connected to MongoDB."); 
        // Print databases
        await listDatabases(client);
      }
      return callback(err);
    });
  },

  // Connects directly to IR database
  getDb: function () {
    return IR_db;
  },

  // Connects to entire mongodb cluster
  getClient: function () {
    return client;
  }
};