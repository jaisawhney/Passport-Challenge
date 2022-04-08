const express = require('express');
const passport = require('passport');
const exphbs = require('express-handlebars');
const router = require('./routes')
const LocalStrategy = require('passport-local').Strategy;
const GithubStrategy = require('passport-github').Strategy;
const db = require('./model');

require('dotenv').config()


passport.use(new LocalStrategy((username, password, cb) => {
    db.findByUsername(username, (err, user) => {
        if (err) {
            return cb(err);
        }
        if (!user) {
            return cb(null, false);
        }
        if (user.password !== password) {
            return cb(null, false);
        }
        return cb(null, user)
    })
}));

passport.use(new GithubStrategy({
    clientID: process.env.github_clientID,
    clientSecret: process.env.github_clientSecret,
    callbackURL: process.env.github_callbackURL
}, (accessToken, refreshToken, profile, cb) => {
    process.nextTick(() => {
        return cb(null, profile);
    });
}));

passport.serializeUser((user, cb) => {
    return cb(null, user)
});

passport.deserializeUser((user, cb) => {
    /*db.findById(id, (err, user) => {
        if (err) {
            return cb(err);
        }
        cb(null, user);
    });*/
    cb(null, user);
});


// Create a new Express application.
const app = express();

// Configure view engine
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');


// Middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));

const expressSession = require('express-session')({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
});
app.use(expressSession);

app.use(passport.initialize({}));
app.use(passport.session({}));

app.use(router)


/* Error Handling */
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Resource not found.',
        possibleCauses: [
            'Maybe you got the URL wrong',
            '...',
        ],
    });
});


// eslint-disable-next-line no-unused-vars
/*app.use((err, req, res, next) => {
    res.status(500).json({
        err,
    });
});*/

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`App listening on port ${port}`));