'use strict'

const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const knex = require('./db/knex');
const routes = require('./routes');

app.set('view engine', 'jade');
app.use(express.static(__dirname + '/public'));
app.use(morgan('tiny'));
app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', (req, res) => {
  res.render('home');
});

app.get('*', (req, res) => {
  res.status(404).render('error');
});

app.listen(3000, () => console.log("Server starting on port 3000"));

// API Call Example
// const strava = require('strava-v3');

// strava.athlete.get({id:12364},function(err,payload) {
//   if(!err) {
//       console.log(payload);
//   }
//   else {
//       console.log(err);
//   }
// });