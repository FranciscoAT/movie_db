var express = require('express');
var router = express.Router();
var configDB = require('../config/database.js');
var pg = require('pg');


router.get('/profile', isLoggedIn, function(req, res, next){
   pg.connect(configDB.url, function(err, client, done){
                    var handleError = function(err){
                        if(!err) return false;
                        if(client){
                            done();
                            console.log("Disconnecting in <1s ...");
                        }
                        return console.error('error running query', err);
                    };
                    client.query('SELECT id FROM USERS', function(err, result){
                        console.log('QUERY SHIT');
                        console.log(req.user.isadmin);
                        console.log(req.user.id);
                           res.render('profile',{title: 'My Dank Profile',
                            user : req.user
                            });
                        });
                    
                    done();
                });
});

router.post('/profile',function(req,res,next){
    
});

function queryDB(pg, conString,queryText){
        pg.connect(conString, function(err, client, done){
                    var handleError = function(err){
                        if(!err) return false;
                        if(client){
                            done();
                            console.log("Disconnecting in <1s ...");
                        }
                        return console.error('error running query', err);
                    };
                    client.query(queryText, function(err, result){
                        });
                    
                    done();
                });
    }

function isLoggedIn(req, res, next) {

    if (req.isAuthenticated())
        return next();

    res.redirect('/login');
}

module.exports = router;
