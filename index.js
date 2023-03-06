const express = require("express");
const cors = require("cors");
require("dotenv").config();
// const jwt = require("jsonwebtoken");
const { MongoClient, ServerApiVersion } = require("mongodb");

const port = process.env.PORT || 5000;

const app = express();

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.mongoDBuser}:${process.env.mongoDBpassword}@cluster0.xgu9cba.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

console.log(uri);

async function run() {
  try {
    const usersCollection = client.db("hard-com").collection("users");
    const productsCollection = client.db("hard-com").collection("all-products");
    app.post("/adduser", async (req, res) => {
      const user = req.body;
      console.log(user);
      const result = await usersCollection.insertOne(user);
      res.send(result);
    });
    app.get("/all-products", async (req, res) => {
      const query = {};
      const products = await productsCollection.find(query).toArray();
      res.send(products);
    });

    app.get("/category/keyboard", async (req, res) => {
      const query = { type: "keyboard" };
      const keyboards = await productsCollection.find(query).toArray();
      res.send(keyboards);
    });

    app.get("/category/monitor", async (req, res) => {
      const query = { type: "monitor" };
      const keyboards = await productsCollection.find(query).toArray();
      res.send(keyboards);
    });

    app.get("/category/motherboard", async (req, res) => {
      const query = { type: "motherboard" };
      const motherboards = await productsCollection.find(query).toArray();
      res.send(motherboards);
    });
    app.get("/category/cabinet", async (req, res) => {
      const query = { type: "cabinet" };
      const cabinets = await productsCollection.find(query).toArray();
      res.send(cabinets);
    });
  } catch (data) {
    console.log(data);
  }
}

run().catch((data) => console.log(data));

app.get("/", async (req, res) => {
  res.send("Server is running Properly");
});

app.listen(port, () => {
  console.log(`Hard-Com server is running on port: ${port}`);
});
