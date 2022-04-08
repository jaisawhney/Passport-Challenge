const express = require('express');
const router = express.Router();
const connectEnsureLogin = require('connect-ensure-login');
const passport = require('passport');

// Index
router.get('/',
    (req, res) => {
        res.render('home', {user: req.user});
    });

// Login (form)
router.get('/login',
    (req, res) => {
        res.render('login');
    });

// Login (post)
router.post('/login',
    passport.authenticate('local', {failureRedirect: '/login'}),
    (req, res) => {
        res.redirect('/');
    });

// Logout
router.get('/logout',
    (req, res) => {
        req.logout();
        return res.redirect("/");
    });


// Show profile
router.get('/profile',
    connectEnsureLogin.ensureLoggedIn(),
    (req, res) => {
        res.render('profile', {user: req.user});
    });

// Auth with github
router.get('/auth/github',
    passport.authenticate('github'), () => {
    });

// Auth callback
router.get('/auth/github/callback',
    passport.authenticate('github', {failureRedirect: '/login'}),
    (req, res) => {
        return res.redirect("/");
    });

module.exports = router;