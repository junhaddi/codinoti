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
  console.log(`tokken register: ${data}`);
  res.send({ result: "submit tokken" });
});

var server = app.listen(8000, function() {
  var port = server.address().port;
  console.log(`app listening on port ${port}`);
});
