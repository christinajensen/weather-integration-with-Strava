const express = require('express');
const router = express.Router({'mergeParams': true});
const knex = require('../db/knex');
const strava = require('strava-v3');

// index
router.get('/', (req, res) => {
  res.render('forecasts/index', {user_id: req.params.user_id});
});

module.exports = router;