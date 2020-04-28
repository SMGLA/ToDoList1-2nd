//jshint esversion: 6

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

// var items = ["Buy Food", "Cook Food", "Eat Food"];

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));

app.set('view engine', 'ejs');

mongoose.connect('mongodb+srv://shugla:PWdb2020@cluster0-zkf3k.mongodb.net/test?retryWrites=true&w=majority/todoListDB', {useNewUrlParser: true, useUnifiedTopology: true});

const itemsSchema = {
  name: String
};

const Item = mongoose.model('Item', itemsSchema);

const item1 = new Item ({
   name: 'Welcome to your To Do List'
});

const item2 = new Item ({
  name: 'Hit the + button to add a new task'
});

const item3 = new Item ({
  name: '<-- Hit the checkbox to delete the task'
});

const defaultItems = [item1, item2, item3];


app.get('/', (req, res) => {
  // res.write('<h1>Hello</h1>');
  // res.write('<h1>World</h1>');
  // res.send();
  // res.send('Server is working');
  var today = new Date();
  var currentDay = today.getDay();
  var options = {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'};
  var date = today.toLocaleDateString("ja-JA", options);
  var day = "";

  if (currentDay == 6 || currentDay == 0) {
    // res.sendFile(__dirname + '/weekend.html');
    day = 'Weekend';
  } else {
    // res.sendFile(__dirname + '/weekday.html');
    day = 'Weekday';
  }

  // res.sendFile(__dirname+'/index.html');
Item.find({}, (err, foundItems) => {
if (foundItems.length === 0){
  Item.insertMany(defaultItems, (err) => {
    if (err){
      console.log(err);
    } else {
      res.redirect('/');
    }
  });
  res.redirect('/');
} else {
  res.render('list',{dateToday: date, day: day, newListItems: foundItems});
  console.log('Successfully added default items in the database');
  console.log(date);
}
});
});

app.post('/', (req, res) => {
  const itemName = req.body.newItem;
  const item = new Item ({
    name: itemName
  });
if (itemName.length == 0) {
  res.redirect('/');
} else {
  // items.push(item);
  item.save();
  res.redirect('/');
  console.log(item);
}
});

app.post('/delete', (req,res) => {
  const checkedItemId = req.body.checkbox;
  Item.findByIdAndRemove(checkedItemId, (err) => {
    if(!err){
      console.log('Successfully Deleted');
      res.redirect('/');
    }
  });
});


app.listen(3000, () => {
  console.log('Server started on port 3000');
});
