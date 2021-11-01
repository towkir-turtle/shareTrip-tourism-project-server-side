const express = require("express");
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vvjfl.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

console.log(uri);

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("shareTrip");
    const packageCollection = database.collection("packages");
    const bookingCollection = database.collection("bookings");

    //POST PACKAGE API
    app.post("/packages", async (req, res) => {
      const newPackage = req.body;
      const result = await packageCollection.insertOne(newPackage);
      console.log(result);
      res.json(result);
    });

    //POST BOOKING API
    app.post("/bookings", async (req, res) => {
      const bookedPackage = req.body;
      const result = await bookingCollection.insertOne(bookedPackage);
      console.log(result);
      res.json(result);
    });

    //GET PACKAGES API
    app.get("/packages", async (req, res) => {
      const cursor = packageCollection.find({});
      const packages = await cursor.toArray();
      res.send(packages);
    });

    //GET BOOKING API
    app.get("/bookings", async (req, res) => {
      const cursor = bookingCollection.find({});
      const bookings = await cursor.toArray();
      res.send(bookings);
    });

    //GET API FOR ALL PACKAGES
    app.get("/bookings/:byEmail", async (req, res) => {
      const email = req.params.byEmail;
      const query = { email };
      const cursor = bookingCollection.find(query);
      const myPackages = await cursor.toArray();
      res.json(myPackages);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Running shareTrip website server.");
});

app.listen(port, () => {
  console.log("listening port at", port);
});
