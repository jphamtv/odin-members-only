// app.js
const express = require('express');
const session = require('express-session');
const path = require('node:path');
const passport = require('passport');
const passportConfig = require('./auth/passportConfig');

const app = express();

// Views middleware
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Session middleware - MUST come before passport middleware
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Middleware to get req.body values
app.use(express.urlencoded({ extended: false }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
