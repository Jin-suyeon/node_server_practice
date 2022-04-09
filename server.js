const express = require("express");
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
const MongoClient = require("mongodb").MongoClient;
const methodOverride = require("method-override");
app.use(methodOverride("_method"));

app.set("view engine", "ejs");

app.use("/public", express.static("public"));

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
  res.render("index.ejs");
});

app.get("/write", (req, res) => {
  res.render("write.ejs");
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

app.put("/list", (req, res) => {
  console.log(req.body);
  db.collection("post").updateOne(
    { _id: parseInt(req.body.id) },
    { $set: { title: req.body.title, date: req.body.date } },
    (err, resp) => {
      res.redirect("/list");
    }
  );
});

app.get("/detail/:id", (req, res) => {
  db.collection("post").findOne(
    { _id: parseInt(req.params.id) },
    (err, resp) => {
      res.render("detail.ejs", { data: resp });
    }
  );
});

app.get("/edit/:id", (req, res) => {
  db.collection("post").findOne(
    { _id: parseInt(req.params.id) },
    (err, resp) => {
      res.render("edit.ejs", { data: resp });
    }
  );
});

const passport = require("passport");
const LocalStrategy = require("passport-local");
const session = require("express-session");
const { suppressDeprecationWarnings } = require("moment");

app.use(
  session({ secret: "비밀코드", resave: true, saveUninitialized: false })
);
app.use(passport.initialize());
app.use(passport.session());

app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.post(
  "/login",
  passport.authenticate("local", { failureRedirect: "/fail" }),
  (req, res) => {
    res.redirect("/");
  }
);

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      session: true,
      passReqToCallback: false,
    },
    function (입력한아이디, 입력한비번, done) {
      //console.log(입력한아이디, 입력한비번);
      db.collection("login").findOne(
        { id: 입력한아이디 },
        function (에러, 결과) {
          if (에러) return done(에러);

          if (!결과)
            return done(null, false, { message: "존재하지않는 아이디요" });
          if (입력한비번 == 결과.pw) {
            return done(null, 결과);
          } else {
            return done(null, false, { message: "비번틀렸어요" });
          }
        }
      );
    }
  )
);
