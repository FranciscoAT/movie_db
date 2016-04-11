var express = require('express');
var router = express.Router();
var configDB = require('../config/database.js');
var pg = require('pg');


var actorQuery = "SELECT A.firstname, A.lastname, " + 
                 "ARRAY(SELECT M.moviename FROM movie M, actorplays AP WHERE A.actorid = AP.actorid AND M.movieid = AP.movieid) AS featured, " + 
                 "ARRAY(SELECT R.name FROM role R WHERE A.actorid = R.actorid) AS roles " +
                 "FROM actor A";
                 
var directorQuery = "SELECT D.firstname, D.lastname, " + 
                 "ARRAY(SELECT M.moviename FROM movie M, directs DI WHERE DI.directorid = D.directorid AND M.movieid = DI.movieid) AS directed " + 
                 "FROM director D";
var studioQuery = "SELECT S.name, S.country, " + 
                 "ARRAY(SELECT M.moviename FROM movie M, sponsors SP WHERE S.studioid = SP.studioid AND M.movieid = SP.movieid) AS movies " + 
                 "FROM studio S";

router.get('/movies', function(req, res, next) {
    var movieQuery = "SELECT M.imageurl, M.moviename, M.date_release, AVG(W.rating) AS rating, " + 
                     "ARRAY(SELECT T.description FROM topics T, movietopics MT "+ 
                           "WHERE MT.movieid = M.movieid AND MT.topicid = T.topicid) AS topicArray " + 
                    "FROM movie M, watches W " + 
                    "WHERE M.movieid = W.movieid " +
                    "GROUP BY M.imageurl, M.moviename, M.date_release, topicArray";
                 
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
  pg.connect(configDB.url, function(err, client, done){      
        client.query(actorQuery, function(err, result){
            console.log(err);
            for (var i = 0; i < result.rowCount; i++){
                console.log(result.rows[i]);
            }
            if(!err)
                res.render('actors', { title: 'Dank Actors', user: req.user, rows: result.rows});
        });
        done();
    });
});

router.get('/directors', function(req, res, next) {
  pg.connect(configDB.url, function(err, client, done){      
        client.query(directorQuery, function(err, result){
            console.log(err);
            for (var i = 0; i < result.rowCount; i++){
                console.log(result.rows[i]);
            }
            if(!err)
                res.render('directors', { title: 'Dank Directors', user: req.user, rows: result.rows});
        });
        done();
    });
});

router.get('/studios', function(req, res, next) {
  pg.connect(configDB.url, function(err, client, done){      
        client.query(actorQuery, function(err, result){
            console.log(err);
            for (var i = 0; i < result.rowCount; i++){
                console.log(result.rows[i]);
            }
            if(!err)
                res.render('studios', { title: 'Dank Studios', user: req.user, rows: result.rows});
        });
        done();
    });
});

module.exports = router;