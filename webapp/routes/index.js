var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'DankRecs' });
});

router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Login' });
});

router.get('/signup', function(req, res, next) {
  res.render('signup', { title: 'Sign Up For DankRecs' });
});

router.post('/search', function(req, res, next) {
  var searchTerm = req.body.searchterm;
  
  res.render('search', { title: 'Dank Search Results: ' + searchTerm });
});

module.exports = router;
