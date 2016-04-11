var models  = require('../models');
var express = require('express');
var router = express.Router();
var configDB = require('../config/database.js');
var pg = require('pg');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'DankRecs', user: req.user });
});

router.post('/search', function(req, res, next) {
  var searchTerm = req.body.searchterm;
  console.log(searchTerm);
  var movieQuery = "SELECT M.imageurl, M.moviename, M.date_release, AVG(W.rating) AS rating, " + 
                     "ARRAY(SELECT T.description FROM topics T, movietopics MT "+ 
                           "WHERE MT.movieid = M.movieid AND MT.topicid = T.topicid) AS topicArray " + 
                    "FROM movie M, watches W " + 
                    "WHERE M.movieid = W.movieid AND lower(M.moviename) = '" + searchTerm.toLowerCase() + "' " +
                    "GROUP BY M.imageurl, M.moviename, M.date_release, topicArray";
                 
    pg.connect(configDB.url, function(err, client, done){      
        client.query(movieQuery, function(err, result){
            console.log(err);
            if(!err)
                res.render('search', { title: 'Dank Search Results: ' + searchTerm, user: req.user, movie: result.rows[0]});
        });
        done();
    });
});

module.exports = router;
