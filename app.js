// requiring modules
const express = require("express");
const bp = require("body-parser");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const app = express();
const mongoose = reqyure("mongoose");

// let items = ["Groceries", "Car Cleaning"];

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended : true}))
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todoDB");

app.get("/", function (req, res) { 
    
   let day = date.getDate();

   res.render("list", {DayKind : day, listItem : items});
 })


app.post("/", function (req, res) { 
   let item = req.body.newItem;
   items.push(item);

   res.redirect("/");
 })

 app.listen(3000, function () { 
    console.log("server is up, pog");
  })