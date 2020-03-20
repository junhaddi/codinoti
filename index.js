var admin = require("firebase-admin");
var serviceAccount = require("./fcm-cloud-messaging-test-e4860-firebase-adminsdk-20v2k-1a03eb9ec3.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://fcm-cloud-messaging-test-e4860.firebaseio.com"
});

var express = require("express");
var app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));

// 라우팅 처리
app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.post("/token", function(req, res) {
  var data = req.body.token;
  if (tokenList.indexOf(data) == -1) {
    tokenList.push(data);
    console.log(`token register: ${data}`);
  }
  res.send({ result: "submit token" });
});

app.post("/pushMessage", function(req, res) {
  var data = req.body;
  if (tokenList.length > 0) {
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
      tokens: tokenList
    };
    admin
      .messaging()
      .sendMulticast(message)
      .then(response => {
        console.log(response.successCount + " messages were sent successfully");
      });
  }
  console.log("push message");
  res.send({ result: "push message" });
});

// 서버 실행
var port = process.env.PORT || 8000;
var server = app.listen(port, function() {
  console.log(`server listening on port ${port}`);
});

// 데이터 배열
// DB 붙이면 코드 복잡해짐
var tokenList = [];
