var admin = require("firebase-admin");
var serviceAccount = require("./fcm-cloud-messaging-test-e4860-firebase-adminsdk-20v2k-1a03eb9ec3.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://fcm-cloud-messaging-test-e4860.firebaseio.com"
});

var express = require("express");
var redirectToHTTPS = require("express-http-to-https").redirectToHTTPS;
var app = express();
app.use(redirectToHTTPS([/localhost:(\d{4})/], [/\/insecure/], 301));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));

// 라우팅 처리
app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.get("/contents", function(req, res) {
  var data = req.query.school;
  res.send(contents);
});

app.post("/token", function(req, res) {
  var data = req.body.token;
  if (tokens.indexOf(data) == -1) {
    tokens.push(data);
    console.log(`token register: ${data}`);
  }
  res.send({ result: "submit token" });
});

app.post("/push", function(req, res) {
  var data = req.body;
  contents.push({
    title: data.title,
    date: data.date,
    content: data.content
  });
  if (tokens.length > 0) {
    var message = {
      notification: {
        title: data.title,
        body: data.content
      },
      data: {
        title: data.title,
        date: data.date,
        content: data.content
      },
      tokens: tokens
    };
    admin
      .messaging()
      .sendMulticast(message)
      .then(response => {
        console.log(response.successCount + " messages were sent successfully");
      });
  }
  res.send({ result: "push message" });
});

// 서버 실행
var port = process.env.PORT || 8000;
var server = app.listen(port, function() {
  console.log(`server listening on port ${port}`);
});

// 데이터 임시저장 배열
// 차후 DB 연동 바람
var tokens = [];
var contents = [];
