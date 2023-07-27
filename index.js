const config = require("config");
const express = require("express");
const bodyParser = require("body-parser");

const activities = require("./routes/activities");
const attendances = require("./routes/attendances");
const users = require("./routes/users");
var cors = require("cors");

const app = express();
const mongoose = require("mongoose");
const uri =
  "mongodb+srv://mattmsun:82128689@attendance.6jt9j8b.mongodb.net/?retryWrites=true&w=majority";
app.use("/public", express.static("public"));
app.use(cors());
// app.use(express.json());
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.use("/api/activities", activities);
app.use("/api/attendances", attendances);
app.use("/api/users", users);

//configeration
console.log("app name :" + config.get("name"));

async function connect() {
  try {
    await mongoose.connect(uri);
    console.log("connected to mongodb");
  } catch (error) {
    console.log(error);
  }
}

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const BlogPost = new Schema({
  author: { type: String, required: true },
  title: String,
  body: String,
  date: { type: Date, default: Date.now },
});
const Blog = mongoose.model("Blog", BlogPost);

async function createBlog() {
  const blog = new Blog({
    // author: "Ming Sun",
    title: "hellow",
    body: "hellow world",
  });
  try {
    const result = await blog.save();
    console.log(result);
  } catch (error) {
    console.log(error.message);
  }
}

async function getBlogs() {
  const blogs = await Blog.find({ author: "Ming" });
  console.log(blogs);
}
async function updateBlog(id) {
  const blog = await Blog.findById(id);
  if (!blog) return;
  blog.author = "melody";
  try {
    const result = await blog.save();
    console.log(result);
  } catch (error) {
    console.log(error.message);
  }
}
async function updateBlog2(id) {
  const result = await Blog.findByIdAndUpdate(
    id,
    {
      $set: {
        author: "Mosh",
      },
    },
    { new: true }
  );
  console.log(result);
}

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
connect();
console.log(config.get("appId"));
console.log(config.get("key"));
