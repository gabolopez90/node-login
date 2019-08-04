var express = require("express");
var app = express();
var basicAuth = require('basic-auth');
var users = require("./data/users.json");

var auth = function (req, res, next) {
  var user = basicAuth(req);
  if (!user || !user.name || !user.pass) {
    res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
    res.sendStatus(401);
  }else{
    var nm = users.find((o) =>{
      return o.username === user.name && o.password === user.pass;
    });
    if (nm !== undefined) {
      next();
    } else {
      res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
      res.sendStatus(401);
      return;
    }
  }
}


app.all("/*", auth);

app.get("/auth", auth, function (req, res) {
    res.send("This page is authenticated!")
});
app.get("/index", function(req,res){
  res.send("Working");
});
app.get('/logout', function (req, res) {
    res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
    return res.sendStatus(401);
});
app.listen(3030);
console.log("app running on localhost:3030");
