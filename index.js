const express = require("express");
const cors = require("cors");
require("dotenv").config();
const stripe = require("stripe")(process.env.secret_key);

// const jwt = require("jsonwebtoken");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

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
    const categoryCollections = client.db("hard-com").collection("category");
    const bookingCollection = client.db("hard-com").collection("bookings");
    const paymentsCollection = client.db("hard-com").collection("payments");
    app.post("/adduser", async (req, res) => {
      const user = req.body;
      console.log(user);
      const result = await usersCollection.insertOne(user);
      res.send(result);
    });

    app.delete("/users/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await usersCollection.deleteOne(query);
      res.send(result);
    });

    app.get("/users/buyer", async (req, res) => {
      const query = {
        role: "buyer",
      };
      const users = await usersCollection.find(query).toArray();
      res.send(users);
    });
    app.get("/users/seller", async (req, res) => {
      const query = {
        role: "seller",
      };
      const users = await usersCollection.find(query).toArray();
      res.send(users);
    });

    app.get("/users/admin/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email };
      const user = await usersCollection.findOne(query);
      res.send({ isAdmin: user?.role === "admin" });
    });

    app.get("/users/seller/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email };
      const user = await usersCollection.findOne(query);
      res.send({ isSeller: user?.role === "seller" });
    });

    app.get("/all-products", async (req, res) => {
      const query = {};
      const products = await productsCollection.find(query).toArray();
      res.send(products);
    });

    app.get("/product/popular", async (req, res) => {
      const query = { popular: true };
      const products = await productsCollection.find(query).toArray();
      res.send(products);
    });

    app.get("/product/latest", async (req, res) => {
      const query = { latest: true };
      const products = await productsCollection.find(query).toArray();
      res.send(products);
    });

    app.post("/all-products", async (req, res) => {
      const products = req.body;
      const result = await productsCollection.insertOne(products);
      res.send(result);
    });

    app.get("/category", async (req, res) => {
      const query = {};
      const categories = await categoryCollections.find(query).toArray();
      res.send(categories);
    });
    app.post("/category", async (req, res) => {
      const category = req.body;
      console.log(category);
      const result = await categoryCollections.insertOne(category);
      res.send(result);
    });

    app.get("/category/type/:type", async (req, res) => {
      const type = req.params.type;
      const query = {
        type: type,
      };
      const result = await productsCollection.find(query).toArray();
      return res.send(result);
    });

    app.get("/product/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await productsCollection.find(query).toArray();
      return res.send(result);
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
    // app.get("/search/:key", async (req, res) => {
    //   let data = await productsCollection.find({
    //     $or: [{ name: { $regex: req.params.key } }],
    //   });
    //   res.send(data);
    // });
    app.post("/bookings", async (req, res) => {
      const booking = req.body;
      const result = await bookingCollection.insertOne(booking);
      res.send(result);
    });

    app.get("/bookings", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const bookings = await bookingCollection.find(query).toArray();
      res.send(bookings);
    });

    app.get("/bookings/:id", async (req, res) => {
      // const email = req.query.email;
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const bookings = await bookingCollection.findOne(query);
      res.send(bookings);
    });
    app.post("/create-payment-intent", async (req, res) => {
      const booking = req.body;
      const price = booking.newPrice;
      const amount = price * 100;

      const paymentIntent = await stripe.paymentIntents.create({
        currency: "inr",
        amount: amount,
        payment_method_types: ["card"],
      });
      res.send({
        clientSecret: paymentIntent.client_secret,
      });
    });

    app.post("/payments", async (req, res) => {
      const payment = req.body;
      const result = await paymentsCollection.insertOne(payment);
      const id = payment.bookingId;
      const filter = { _id: new ObjectId(id) };
      const updatedDoc = {
        $set: {
          paid: true,
          transactionId: payment.transactionId,
        },
      };
      const updateResult = await bookingCollection.updateOne(
        filter,
        updatedDoc
      );
      res.send(result);
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
