var models  = require('../models');
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'DankRecs', user: req.user });
});

router.get('/movies', function(req, res, next) {
  res.render('movies', { title: 'Dank Movies', user: req.user });
});

router.get('/actors', function(req, res, next) {
  res.render('actors', { title: 'Dank Actors', user: req.user });
});

router.get('/directors', function(req, res, next) {
  res.render('directors', { title: 'Dank Directors', user: req.user });
});

router.get('/studios', function(req, res, next) {
  res.render('studios', { title: 'Dank Studios', user: req.user });
});

router.post('/search', function(req, res, next) {
  var searchTerm = req.body.searchterm;
  
  res.render('search', { title: 'Dank Search Results: ' + searchTerm, user: req.user });
});

module.exports = router;
