// let data = require('./yelp.json');
var lineReader = require("line-reader");
const MongoClient = require("mongodb").MongoClient;

const mongoUrl = "mongodb://localhost:27017";
const databaseName = "yelp";
const collectionName = "business";

let count = 0;
let amount = 1;
let infinite = true;
let data = [];
lineReader.eachLine("./yelp.json", function(line, last) {
  if (infinite) {
    data.push(JSON.parse(line));
  } else if (count < amount) {
    data.push(JSON.parse(line));
    count++;
  }
  if (last) {
    insertIntoDB(data, () => {
      console.log("finished...");
      process.exit();
    });
  }
});

insertIntoDB = (data, callback) => {
  MongoClient.connect(mongoUrl, { useNewUrlParser: true }, (err, client) => {
    if (!err) {
      console.log("We are connected");
    }
    let db = client.db(databaseName);

    let collection = db.collection(collectionName);
    // for (let i = 0; i < data.length; i++) {
    //   collection.save(data[i]).then(res => ;
    // }
    collection.insertMany(data).then(res => {
      client.close();
      callback();
    });
  });
};
