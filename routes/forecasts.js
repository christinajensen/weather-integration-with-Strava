const express = require('express');
const router = express.Router();
const knex = require('../db/knex');
const strava = require('strava-v3');

// index
router.get('/', (req, res) => {
  // API Call Example
  // strava.segments.explore({bounds: "37.821362,-122.505373,37.842038,-122.465977"},function(err,payload) {
  // strava.routes.get({route_id: 5775778},function(err, payload) {
  // strava.streams.activity({id: 644320693, types: "latlng", resolution: "low"},function(err, payload) {
  //   if(!err) {
  //     var stream = payload[0].data;
  //     res.render('forecasts/index', {stream});
  //   }
  //   else {
  //     console.log(err);
  //   }
  // });
  res.render('forecasts/index');

});

module.exports = router;