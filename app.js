// requiring modules
const express = require("express");
const bp = require("body-parser");
const bodyParser = require("body-parser");
const _ = require("lodash");
const date = require(__dirname + "/date.js");
const app = express();
const mongoose = require("mongoose");
app.set("view engine", "ejs",);
app.use(bodyParser.urlencoded({extended : true}))
app.use(express.static("public"));

//connect mongodb
mongoose.connect("mongodb://localhost:27017/todoDB");

//create schema 
const itemsSchema = {
  name: String
}

const Item = mongoose.model("Item", itemsSchema);

const it1 = new Item ({
  name: "Hi"
})

const it2 = new Item({
  name: "Click on + to add items"
})

const it3 = new Item ({
  name: "Do laundry"
})

const defaultArr = [it1, it2, it3];

//listSchema creation

const listSchema = {
  name: String,
  items: [itemsSchema]
}

const List = mongoose.model("List", listSchema);

app.get("/", function (req, res) { 
    
   let day = date.getDate();

   Item.find({}, function (err, foundItems) { 
    if (foundItems.length === 0){
      Item.insertMany(defaultArr, function (err) { 
        if (err) {
          console.log(err);
        }
        else {
          console.log("successfully done, pog");
        }
       })
       res.redirect("/");
    }
    
    else {
      res.render("list", {listTitle : "Today", listItem : foundItems});
    }
   }) 
 })

app.get("/:customList", function (req, res) {
  let customList = _.capitalize(req.params.customList);

  List.findOne({name: customList}, function (err, foundList) { 
    if (!err){
      if(!foundList) {

        //creates custom list if doesnt exist

        const list = new List ({
          name: customList,
          items: defaultArr
        });

        list.save();
        res.redirect("/" + customList)

      }
      else {
        res.render("list", {listTitle : foundList.name, listItem : foundList.items})
      }
    }
   })

});

app.post("/", function (req, res) { 
   const itemName = req.body.newItem;
   const listName = req.body.btn;
   
  const item = new Item({
    name: itemName
  });

  if (listName === "Today") {
    item.save();
    res.redirect("/");
  }
  else {
    List.findOne({name: listName}, function (err, foundList) { 
      foundList.items.push(item);
      foundList.save();
      res.redirect("/" + listName);
     });
  }
 });


 //to delete an item

 app.post("/delete", function (req, res) { 
    const checkedItem = req.body.cb;
    const listName = req.body.listName;

    if (listName === "Today") {
      Item.findOneAndRemove(checkedItem, function (err) { 
        if(err){
          console.log(err);
        }
        else {
          console.log("deleted item with id: " + checkedItem);
        }
        res.redirect("/");
       })
    }
    else {
      
      List.findOneAndUpdate({name: listName},{$pull: {items: { _id: checkedItem}}}, function (err, foundList) {
        if(!err) {
          res.redirect("/" + listName);
        }
        
      });
      
    }

    
  })

 app.listen(3000, function () { 
    console.log("server is up, pog");
  })
