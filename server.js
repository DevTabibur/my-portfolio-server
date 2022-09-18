const express = require("express");
const cors = require("cors");
const multer = require("multer");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;
const fs = require("file-system");

// middleware
app.use(cors());
app.use(express.json());

// file upload folder
const UPLOADS_FOLDER = "./uploads";

// multer way
const path = require("path");

// define the storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_FOLDER);
  },
  filename: (req, file, cb) => {
    // Important File.pdf => important-file-343345.pdf
    const fileExt = path.extname(file.originalname);
    const fileName =
      file.originalname
        .replace(fileExt, " ")
        .toLocaleLowerCase()
        .split(" ")
        .join("-") +
      "-" +
      Date.now();
    cb(null, fileName + fileExt);
  },
});

// prepare the final multer upload object
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5000000, // 5MB
  },
  fileFilter: (req, file, cb) => {
    // console.log('file', file)
    if (
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/jpg"
    ) {
      cb(null, true);
    } else {
      cb(new Error("Only .jpg .jpeg .png formats are allowed!"));
    }
  },
});

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
    const usersCollection = client.db("portfolio").collection("users");
    const projectsCollection = client.db("portfolio").collection("projects");
    const blogsCollection = client.db("portfolio").collection("blogs");
    const photosCollection = client.db("portfolio").collection("photo");


    // verify an ADMIN
    const verifyAdmin = async(req, res, next)=>{
      const requester = req.decoded.email;
      console.log('requester', requester);
    }

   

    // 1.a => load all user
    app.get("/user", async (req, res) => {
      const result = await usersCollection.find({}).toArray();
      res.send(result);
    });

    // send user info in db
    // app.post("/user", async (req, res) => {
    //   const user = req.body;
    //   const email = "tobiburrohman2@gmail.com";
    //   const password = "topu1842000";
    //   if (user.email === email && user.password === password) {
    //     const result = await usersCollection.insertOne(user);
    //     res.send({ code: 200, result });
    //   } else {
    //     res.send({ code: 400 });
    //   }
    // });

    // load project
    // app.get("/projects", async (req, res) => {
    //   const result = await projectsCollection.find().toArray();
    //   res.send(result);
    // });

    // // load blogs
    // app.get("/blogs", async (req, res) => {
    //   const result = await blogsCollection.find({}).toArray();
    //   res.send(result);
    // });

    // // load a single blog by _id
    // app.get("/blogs/:id([0-9a-fA-F]{24})", async (req, res)=>{
    //   const id = req.params.id;
    //   // console.log('id', id)
    //   const query = { _id: ObjectId(id) };
    //   // console.log('query', query)
    //   const result = await blogsCollection.findOne(query);
    //   res.send(result)
    // })  
    
    
    //  // for file upload with the help of multer
    //  app.post(
    //   "/upload-files",
    //   upload.single("photo"),
    //   async (req, res, next) => {
    //     const file = req.file;
    //     if (!file) {
    //       const error = new Error("Please upload a file");
    //       error.httpStatusCode = 400;
    //       return next(error);
    //     }
    //     const result = await photosCollection.insertOne(file);
    //     res.send(result);
    //   }
    // );

    // // load al upload-files data
    // app.get("/upload-files", async (req, res) => {
    //   const result = await photosCollection.find().toArray();
    //   res.send(result);
    // });

    // // get images by id
    // app.get("/upload-files/:id([0-9a-fA-F]{24})", async (req, res) => {
    //   const id = req.params.id;
    //   console.log("id", id);
    //   const query = { _id: ObjectId(id) };
    //   const result = await photosCollection.findOne(query);
    //   res.send(result)
    // });


    // // server png image
    // app.get("/image", (req, res) => {
    //   res.sendFile(path.join(__dirname, "./uploads/tamiz--1662997746605.jpg"));
    // });

    // 3.a => get all blogs
    app.get("/blogs", async(req, res)=>{
      const result = await blogsCollection.find({}).toArray();
      res.send(result);
    })

    // 3.b => post article in server to db
    app.post("/blogs", async(req, res)=>{
      const data = req.body;
      const result = await blogsCollection.insertOne(data);
      res.send(result);
    })

    // 3.c => get blogs load by id
    app.get("/blogs/:id", async(req, res)=>{
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await blogsCollection.findOne(query);
      res.send(result);
    })

    // 3.d => delete blog by id
    app.delete("/blogs/:id", async (req, res)=>{
      const id = req.params.id;
      console.log('id', id)
      const filter = {_id:ObjectId(id)}
      const result = await blogsCollection.deleteOne(filter);
      res.send(result);
    })
    
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
