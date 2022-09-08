const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello World!");
  });

// user: portfolio
// password: GoUYO0MogHl8NePW


const uri =
  "mongodb+srv://portfolio:GoUYO0MogHl8NePW@cluster0.hc4xz.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const projectsCollection = client.db("portfolio").collection("projects");
    const blogsCollection = client.db("portfolio").collection("blogs");

    // load project
    app.get("/projects", async (req, res) => {
      const result = await projectsCollection.find({}).toArray();
      res.send(result);
    });

    // load blogs
    // app.get("/blogs", async (req, res) => {
    //     const result = await blogsCollection.find({}).toArray();
    //     res.send(result);
    //   });


    // 1.a => load all user
    // app.get("/user",   async (req, res) => {
    //     const result = await usersCollection.find({}).toArray();
    //     res.send(result);
    //   });



  } finally {
    // await client.close();
  }
}
run().catch(console.dir);



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
