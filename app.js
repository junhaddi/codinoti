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

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/" + "index.html");
});

app.post("/token", function(req, res) {
  var data = req.body.token;
  tokenList.push(data);
  console.log(`token register: ${data}`);
  res.send({ result: "submit token" });
});

var server = app.listen(8000, function() {
  var port = server.address().port;
  console.log(`app listening on port ${port}`);
});

// 푸시 메시지
var tokenList = [];

setInterval(function() {
  if (tokenList.length > 0) {
    var message = {
      notification: {
        body: "Background Message",
        title: "BG Title"
      },
      data: {
        title: "FG Title",
        message: "Foreground Message"
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
}, 3000);
