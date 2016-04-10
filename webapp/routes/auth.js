var express = require('express');
var router = express.Router();
var passport = require('passport');

router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Login', pageType: 'login' });
});

router.post('/login',
  passport.authenticate('local', { successRedirect: '/', failureRedirect: '/login', failureFlash: true })
);

router.get('/signup', function(req, res, next) {
  res.render('signup', { title: 'Sign Up For DankRecs',  });
});

router.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

router.get('/logout', function(req, res, next){
    
});

module.exports = router;