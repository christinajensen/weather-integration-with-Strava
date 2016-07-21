const express = require('express');
const router = express.Router();
const knex = require('../db/knex');
const passport = require('passport');
const StravaStrategy = require('passport-strava-oauth2').Strategy;

// strava id and secret
var STRAVA_CLIENT_ID = process.env.STRAVA_CLIENT_ID;
var STRAVA_CLIENT_SECRET = process.env.STRAVA_CLIENT_SECRET;

// configure strategy/setup passport
passport.use(new StravaStrategy({
    clientID: STRAVA_CLIENT_ID,
    clientSecret: STRAVA_CLIENT_SECRET,
    callbackURL: "http://127.0.0.1:3000/users/auth/strava/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    process.nextTick(function () {
      return done(null, profile);
    });
  }
));

// serialization 
passport.serializeUser(function(user, done) {
  done(null, user.id);
});
// deserialization
passport.deserializeUser(function(user, done) {
  done(null, user);
});

router.get('/auth/strava',
  passport.authenticate('strava', { scope: ['public'] }));

router.get('/auth/strava/callback', 
  passport.authenticate('strava', { failureRedirect: '/' }),
  function(req, res) {
    res.redirect('/forecasts');
  }); 

router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});







module.exports = router;