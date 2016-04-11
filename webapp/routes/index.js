var models  = require('../models');
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'DankRecs', user: req.user });
});

router.post('/search', function(req, res, next) {
  var searchTerm = req.body.searchterm;
  
  res.render('search', { title: 'Dank Search Results: ' + searchTerm, user: req.user });
});

module.exports = router;
