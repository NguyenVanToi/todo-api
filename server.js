var express = require('express');
const TaskModel = require("./models/models");

var app = express(); // create our app w/ express
var mongoose = require('mongoose'); // mongoose for mongodb
var morgan = require('morgan'); // log requests to the console (express4)
var bodyParser = require('body-parser'); // pull information from HTML POST (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
var cors = require('cors');

// Configuration
try {
    mongoose.connect('mongodb+srv://toinv:nguyentoi96@cluster0.ykbmpab.mongodb.net/?retryWrites=true&w=majority', {
        useNewUrlParser: true,
        useFindAndModify: false,
        useUnifiedTopology: true
      });

    // check connection
    const db = mongoose.connection;

    db.on("error", console.error.bind(console, "connection error: "));
    db.once("open", function () {
      console.log("Connected successfully");
    });
    } catch (e) {
        console.log('e', e)
    }

app.use(morgan('dev')); // log every request to the console
app.use(bodyParser.urlencoded({ extended: 'true' })); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());
app.use(cors());
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'DELETE, PUT');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});
// Models
// var Tasks = mongoose.model('ListingsAndReviews', {
//   name: String,
//   description: String,
// });
// Routes
app.get('/api/tasks', async function (req, res) {
  console.log('fetching reviews');
  // use mongoose to get all reviews in the database
  const tasks = await TaskModel.find({});
  console.log('users', tasks)
  try {
    res.send(tasks);
  } catch (error) {
    res.status(500).send(error);
  }
});
// create review and send back all reviews after creation
app.post('/api/tasks', async function (req, res) {
  console.log('creating task');
  // create a review, information comes from request from Ionic
  const newTask = new TaskModel(req.body);
  try {
    await newTask.save();
    res.send(newTask);

  } catch (error) {
    res.status(500).send(error);
  }
});
// delete a review
app.delete('/api/tasks/:task_id', async function (req, res) {
  console.log('req.params.task_id', req.params.task_id)
  try {
    const response = await TaskModel.deleteOne(
      {
        _id: req.params.task_id,
      }
    );
    res.send(response);
  } catch (error) {
    res.status(500).send(error);
  }
});
// listen (start app with node server.js) ======================================
app.listen(8080);
console.log('App listening on port 8080');