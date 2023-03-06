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
    const productsCollection = client.db("hard-com").collection("all-products");

    app.get("/all-products", async (req, res) => {
      const query = {};
      const products = await productsCollection.find(query).toArray();
      res.send(products);
    });

    app.get("/category/keyboard", async (req, res) => {
      const query = { type: "keyword" };
      const keyboards = await productsCollection.find(query).toArray();
      res.send(keyboards);
    });

    app.get("/category/monitor", async (req, res) => {
      const query = { type: "monitor" };
      const keyboards = await productsCollection.find(query).toArray();
      res.send(keyboards);
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