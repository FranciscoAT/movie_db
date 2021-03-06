var express = require('express');
var router = express.Router();
var configDB = require('../config/database.js');
var pg = require('pg');


router.get('/admin',isAdmin,function(req,res,next){
    res.render('admin',{title: 'Dank Admin Console', user: req.user});
});

router.post('/admin',isAdmin,function(req,res,next){
    pg.connect(configDB.url, function(err, client, done){      
        client.query(req.body.query, function(err, result){
            console.log(result);
            console.log(err);
            if(err)
                res.render('admin',{title: 'Your Query Failed', user: req.user, error: err});
            else{
                res.render('admin',{title: 'Your Dank Query Succeeded', user: req.user, rows: result.rows, columns: result.fields});
            }
        });
        
        done();
    });
});

router.get('/seen',isLoggedIn,function(req,res,next){
    var watchesQuery = "SELECT M.imageurl, M.moviename, W.rating FROM movie M, watches W WHERE W.movieid = M.movieid AND W.id = " + req.user.id;
    pg.connect(configDB.url, function(err, client, done){      
        client.query(watchesQuery, function(err, result){
            console.log(result);
            var searchTerms=[];
            for(var i = 0; i<result.rowCount; i++){
                var moviename = result.rows[i].moviename
                searchTerms.push(moviename.replace(" ","+"));
            }
            if(!err)
                res.render('seen',{title: 'Your Dank Movies', user: req.user, rows: result.rows, search: searchTerms});
        });
        
        done();
    });
});

router.get('/profile', isLoggedIn, function(req, res, next){
   var profileQuery = 'SELECT * FROM profiles WHERE id = ' + req.user.id;
   var insertQuery = 'INSERT INTO profiles(id) VALUES(' + req.user.id + ')';
   
   pg.connect(configDB.url, function(err, client, done){
        var handleError = function(err){
            if(!err) return false;
            if(client){
                done();
                console.log("Disconnecting in <1s ...");
            }
            return console.error('error running query', err);
        };
        
        client.query(insertQuery, function(err, result){
            if(handleError(err)) return;
        });

        client.query(profileQuery, function(err, result){
            var profile = result.rows[0];
            console.log(profile);
            res.render('profile',{
                title: 'My Dank Profile',
                user : req.user,
                firstname: profile.first_name,
                lastname: profile.last_name,
                age: profile.age,
                gender: profile.gender,
                city: profile.city,
                province: profile.province,
                country: profile.country,
                description: profile.description                           
            });
        });
        
        done();
    });
});

router.post('/profile', isLoggedIn, function(req,res,next){
        var age;
        if(req.body.age!='')
          age = req.body.age;
        var newProfile = [req.body.firstname, 
                        req.body.lastname, 
                        age, 
                        req.body.gender,
                        req.body.city, 
                        req.body.province,
                        req.body.country,
                        req.body.description,
                        req.user.id];
        console.log(newProfile);
        var updateQuery = "UPDATE profiles SET first_name = $1, last_name = $2, age = $3, gender = $4, city = $5, province = $6, country = $7, description = $8 WHERE id = $9";
        var deleteQuery = "DELETE FROM users WHERE id = " + req.user.id;
        
        pg.connect(configDB.url, function(err, client, done){
            var handleError = function(err){
                if(!err) return false;
                if(client){
                    done();
                    console.log("Disconnecting in <1s ...");
                }
                return console.error('error running query', err);
            };
            if(req.body.delete != null){
                console.log('DELETE');
                req.logout();
                client.query(deleteQuery, function(err, result){
                    if(handleError(err)) 
                        return;
                    console.log('TEST');
                    res.redirect('/');
                });
            }else{
                client.query(
                    {text: updateQuery, 
                    values: newProfile}, 
                    function(err, result){
                        handleError(err);
                        console.log(result);
                        res.redirect('/profile');                        
                });
            }
            done();
        });
               
});

function isAdmin(req, res, next){
    if(req.user == null) 
        res.redirect('/login');
    else if(req.user.isAdmin == false)
        res.redirect('/');
    return next();
}

function isLoggedIn(req, res, next) {

    if (req.isAuthenticated())
        return next();

    res.redirect('/login');
}

module.exports = router;
