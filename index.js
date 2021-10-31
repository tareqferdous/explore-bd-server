const express = require("express");
const cors = require("cors");
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;
require("dotenv").config();

const app = express();
const port = 4000;

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello Explore BD Server!");
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qnprp.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  const Collection = client
    .db("exploreBD")
    .collection("packages");

    const orderCollection = client
    .db("exploreBD")
    .collection("orderCollection");

    app.post("/addPackage", (req, res) => {
        const package = req.body;
        Collection.insertOne(package).then((result) => {
          res.send(result.insertedCount > 0);
        });
      });

      app.get('/showPackages', (req, res) => {
        Collection.find()
        .toArray((err, result) => {
          console.log(err);
          console.log(result);
          res.send(result);
        })
      });

      app.get('/showPackages/:id', (req, res) => {
        const packageId = req.params.id
        Collection.find({_id:ObjectId(packageId)})
        .toArray((err, result) => {
          console.log(result)
          res.send(result);
        })
      });

      app.post('/placeOrder', (req, res) => {
        const info = req.body;
        orderCollection.insertOne(info)
        .then(result => {
          console.log(result);
          res.send(result.insertedCount > 0)
        })
      });

      app.get('/orderList', (req, res) => {
        orderCollection.find()
        .toArray((err, result) => {
          console.log(err);
          console.log(result);
          res.send(result);
        })
      });

      app.delete('/delete/:id', (req, res) =>{
        const serviceId = req.params.id
        orderCollection.deleteOne({_id:ObjectId(serviceId)})
        .then(response => {
          console.log(response)
          res.send(response.deletedCount > 0)
        })
      });

  
  console.log("database connect");
});

app.listen(process.env.PORT || port);
