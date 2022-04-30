"use strict";

var LocalStrategy = require("passport-local").Strategy;

var bcrypt = require("bcrypt");

function initialize(passport, getUserByEmail, getUserById) {
  var authenticateUser = function authenticateUser(email, password, done) {
    var user;
    return regeneratorRuntime.async(function authenticateUser$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            user = getUserByEmail(email);

            if (!(user == null)) {
              _context.next = 3;
              break;
            }

            return _context.abrupt("return", done(null, false, {
              message: "No user with that email"
            }));

          case 3:
            _context.prev = 3;
            _context.next = 6;
            return regeneratorRuntime.awrap(bcrypt.compare(password, user.password));

          case 6:
            if (!_context.sent) {
              _context.next = 10;
              break;
            }

            return _context.abrupt("return", done(null, user));

          case 10:
            return _context.abrupt("return", done(null, false, {
              message: "Password incorrect"
            }));

          case 11:
            _context.next = 16;
            break;

          case 13:
            _context.prev = 13;
            _context.t0 = _context["catch"](3);
            return _context.abrupt("return", done(_context.t0));

          case 16:
          case "end":
            return _context.stop();
        }
      }
    }, null, null, [[3, 13]]);
  };

  passport.use(new LocalStrategy({
    usernameField: "email"
  }, authenticateUser));
  passport.serializeUser(function (user, done) {
    return done(null, user.id);
  });
  passport.deserializeUser(function (id, done) {
    return done(null, getUserById(id));
  });
}

module.exports = initialize;