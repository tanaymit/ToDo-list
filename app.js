const express = require("express");

const bp = require("body-parser");

const app = express();

app.set("view engine", "ejs");

var today = new Date();
var day = today.getDay();
var currDay = "";
app.get("/", function (req, res) { 
    if (day===6 || day === 0){
        currDay = "weekend";
        
    }
    else {
        currDay = "weekday";
    }

    res.render("list", {DayKind : day});
 })

 app.listen(3000, function () { 
    console.log("server is up, pog");
  })