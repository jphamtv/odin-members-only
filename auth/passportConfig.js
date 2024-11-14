// auth/passportConfig.js
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const User = require('../models/user');

function initialize() {
  // Passport configuration
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        // Find user by username
        const user = await User.getByUsername(username);  
        if (!user) {
          return done(null, false, { message: 'Incorrect username' });
        }
        
        // Check if password matches
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
          return done(null, false, { message: 'Incorrect password' });
        }
  
        // If everything matches, return the user
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    })
  );
  
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.getById(id);
      console.log(user);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });
}

module.exports = initialize;
