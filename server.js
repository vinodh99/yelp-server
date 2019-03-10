var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var db = mongoose.connect(
  "mongodb://yelp:bhuvin99@ds039707.mlab.com:39707/yelp-mock-data"
);

var businessSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    body: { type: String }
  },
  { collection: "yelp" }
);

var business = mongoose.model("Article", businessSchema);

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,OPTIONS,DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, X-Auth-Token, Accept"
  );
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.listen(process.env.PORT || 3020, function() {
  console.log("swag shop API running on port 3020");
});

app.get("/restaurants", function(req, res) {
  var name = req.query.name;
  console.log(name);
  const limit = req.query.limit ? Number.parseInt(req.query.limit) : 20;
  const offset = req.query.offset ? Number.parseInt(req.query.offset) : 0;

  business.find(
    { city: new RegExp(name, "i") },
    null,
    { skip: offset, limit },
    function(err, products) {
      if (err) {
        res.send({ error: "could not display resturants in your city" });
      } else {
        res.send(products);
      }
    }
  );
});
