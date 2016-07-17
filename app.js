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

app.use('/forecasts', routes.forecasts);

app.get('*', (req, res) => {
  res.status(404).render('error');
});

app.listen(3000, () => console.log("Server starting on port 3000"));

module.exports = {
  app
};