var express = require('express');
var router = express.Router();
var configDB = require('../config/database.js');
var pg = require('pg');

var movieQuery = "SELECT M.imageurl, M.moviename, M.date_release, AVG(W.rating) AS rating, topicArray" + 
                 "FROM movie M, watches W" + 
                 "WHERE M.movieid = W.movieid" + 
                 "ARRAY(SELECT description FROM topics T, movietopics MT WHERE  MT.movieid = M.movieid AND MT.topicid = T.topicid )"
                 "GROUP BY M.imageurl, M.movie_name, M.date_release, topicarray";
var actorQuery;
var directorQuery;
var studioQuery;

router.get('/movies', function(req, res, next) {
    pg.connect(configDB.url, function(err, client, done){      
        client.query(movieQuery, function(err, result){
            console.log(err);
            for (var i = 0; i < result.rowCount; i++){
                console.log(result.rows[i]);
            }
            if(!err)
                res.render('movies', { title: 'Dank Movies', user: req.user, rows: result.rows});
        });
        done();
    });
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

module.exports = router;