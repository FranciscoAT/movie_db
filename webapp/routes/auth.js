var express = require('express');
var router = express.Router();
var passport = require('passport');
var flash = require('connect-flash');
var models = require("../models");

router.get('/login',checkNotLoggedIn, function(req, res, next) {
  res.render('login', { title: 'Login', pageType: 'login' });
});

router.post('/login',
  passport.authenticate('local-login', {failureRedirect: '/login'}),
  function(req, res) {
    console.log('redirecting');
    res.render('index',{title: 'DankRecs'});
  }
);

router.get('/signup',checkNotLoggedIn, function(req, res, next) {
  res.render('signup', { title: 'Sign Up For DankRecs',  });
});

router.post('/signup', function(req, res, next){
    var regemail = req.body.email;
    var password = req.body.password;
    models.Users.findOne({where: {email: regemail}}).then(function( user) {

            // check to see if theres already a user with that email
            if (user!=null) {
                req.flash('Error', 'That username is already taken!')
            } else {

                // if there is no user with that email
                // create the user
                models.Users.create({                  
                    // set the user's local credentials
                    email: regemail,
                    password: password
                }).then(function(user) {
                    console.log('Info: ' + 'after, the password is ' + user.password);
                    res.redirect('/login');
                });
            }

        });
});

router.get('/logout', function(req, res, next){
    
});

function checkNotLoggedIn(req, res, next) {

    if (req.isAuthenticated())
        res.redirect('/');

    return next();
}

module.exports = router;