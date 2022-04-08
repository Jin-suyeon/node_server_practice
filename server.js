const express = require("express");
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
const MongoClient = require("mongodb").MongoClient;
app.set("view engine", "ejs");

let db;
MongoClient.connect(
  "mongodb+srv://admin:jin21479qw@cluster0.1lkoo.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
  (err, client) => {
    if (err) return console.log(err);

    db = client.db("server_practice");

    app.listen(8080, () => {
      console.log("listening on 8080");
    });
  }
);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.get("/write", (req, res) => {
  res.sendFile(__dirname + "/write.html");
});

app.get("/list", (req, res) => {
  db.collection("post")
    .find()
    .toArray((err, resp) => {
      res.render("list.ejs", { posts: resp });
    });
});

app.delete("/list", (req, res) => {
  console.log(req.body);
  req.body._id = parseInt(req.body._id);
  db.collection("post").deleteOne(req.body, (err, resp) => {
    console.log("삭제완료");
  });
});

app.post("/list", (req, res) => {
  res.send("전송 완료");

  db.collection("counter").findOne({ name: "게시물갯수" }, (err, resp) => {
    let totalCnt = resp.totalPost;
    let param = {
      _id: totalCnt,
      title: req.body.title,
      date: req.body.date,
    };

    db.collection("post").insertOne(param, (err, res) => {
      console.log("저장완료");

      db.collection("counter").updateOne(
        { name: "게시물갯수" },
        { $inc: { totalPost: 1 } }
      );
    });
  });
});
