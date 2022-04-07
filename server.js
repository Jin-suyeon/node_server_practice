const express = require("express");
const app = express();
const bodyParser = require("body-parser");
app.unsubscribe(bodyParser.urlencoded({ extended: true }));

const MongoClient = require("mongodb").MongoClient;
MongoClient.connect(
  "mongodb+srv://admin:jin21479qw@cluster0.1lkoo.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
  (err, client) => {
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

app.post("/add", (req, res) => {
  res.send("전송완료");
});
