const express = require('express');
const router = express.Router();
// const user = require('../models/user');
const passport = require('passport');
const User = require('../models/user');


//Get the signup form
router.get('/register', async(req,res) => {
    res.render('auth/signup');
})

router.post('/register', async(req,res) => {
    try{
        const user = new User({username: req.body.username, email: req.body.email});
        const newuser = await User.register(user, req.body.password);
        req.flash('success','Registered successfully');
        res.redirect('/login');
    }
    catch (e) {
        req.flash('error', e.message);
        res.redirect('/register')
    }
});

//get the login form
router.get('/login', async (req, res) => {
    
    res.render('auth/login')
})

router.post('/login',
    passport.authenticate('local',
        {
            failureRedirect: '/login',
            failureFlash: true
        }
    ), (req, res) => {
        req.flash('success', `Welcome Back!! ${req.user.username}`)
        // console.log(req.user);
        res.redirect('/products');
});

//logout the user from current session
router.get('/logout',(req,res) => {
    req.logOut();
    req.flash('success','Logged Out successfully');
    res.redirect('/login');
})

module.exports = router;