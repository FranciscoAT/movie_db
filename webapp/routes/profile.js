var express = require('express');
var router = express.Router();


router.get('/profile', isLoggedIn, function(req, res, next){
   res.render('profile',{title: 'My Dank Profile',
       user : req.user
   });
});

function isLoggedIn(req, res, next) {

    if (req.isAuthenticated())
        return next();

    res.redirect('/login');
}

module.exports = router;
