'use strict'
require('dotenv').load();

const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const knex = require('./db/knex');
const routes = require('./routes');
const passport = require('passport');
const session = require('cookie-session');
const flash = require('connect-flash');
const StravaStrategy = require('passport-strava-oauth2').Strategy;

app.set('view engine', 'jade');
app.use(express.static(__dirname + '/public'));
app.use(morgan('tiny'));
app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({extended: true}));

// use session
app.use(session({
  secret: process.env.SECRET
}))

// use passport middleware
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// home page
app.get('/', (req, res) => {
  res.render('home', {"user_id": req.session.passport.user});
});

// routes
app.use('/users', routes.users);
app.use('/users/:user_id/forecasts', routes.forecasts);

// error page
app.get('*', (req, res) => {
  res.status(404).render('error');
});

app.listen(3000, () => console.log("Server starting on port 3000"));

module.exports = {
  app
};