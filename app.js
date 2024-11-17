// app.js
const express = require('express');
const session = require('express-session');
const path = require('node:path');
const passport = require('passport');
const methodOverride = require('method-override');
const usersRouter = require('./routes/usersRouter');
const postsRouter = require('./routes/postsRouter');
const initializePassport = require('./auth/passportConfig');

const app = express();

// Enable EJS as view engine and look for templates in 'views' directory
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Enable static assets and look for assets in the 'public' directory
const assetsPath = path.join(__dirname, 'public');
app.use(express.static(assetsPath));

// Parses form payloads and sets it to the 'req.body'
app.use(express.urlencoded({ extended: false }));

// Overrides standard HTML GET/POST method in order to use DELETE method
app.use(methodOverride((req, res) => {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    return req.body._method;
  }
}));

// Session middleware (MUST come before passport middleware)
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));

// Initialize Passport
initializePassport();

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

// Routes
app.use('/', usersRouter);
app.use('/posts', postsRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
