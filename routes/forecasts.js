const express = require('express');
const router = express.Router();
const knex = require('../db/knex');
const strava = require('strava-v3');

// index
router.get('/', (req, res) => {
  res.render('forecasts/index');
});

module.exports = router;