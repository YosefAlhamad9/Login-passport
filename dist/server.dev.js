"use strict";

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

var express = require("express");

var app = express();

var bcrypt = require("bcrypt");

var passport = require("passport");

var flash = require("express-flash");

var session = require("express-session");

var methodOverride = require("method-override");

var initializePassport = require("./passport-config");

initializePassport(passport, function (email) {
  return users.find(function (user) {
    return user.email === email;
  });
}, function (id) {
  return users.find(function (user) {
    return user.id === id;
  });
});
var users = [];
app.set("view-engine", "ejs");
app.use(express.urlencoded({
  extended: false
}));
app.use(flash());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"));
app.get("/", checkAuthenticated, function (req, res) {
  res.render("index.ejs", {
    name: req.user.name
  });
});
app.get("/login", checkNotAuthenticated, function (req, res) {
  res.render("login.ejs");
});
app.post("/login", checkNotAuthenticated, passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login",
  failureFlash: true
}));
app.get("/register", checkNotAuthenticated, function (req, res) {
  res.render("register.ejs");
});
app.post("/register", checkNotAuthenticated, function _callee(req, res) {
  var hashedPassword;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(bcrypt.hash(req.body.password, 10));

        case 3:
          hashedPassword = _context.sent;
          users.push({
            id: Date.now().toString(),
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
          });
          res.redirect("/login");
          _context.next = 11;
          break;

        case 8:
          _context.prev = 8;
          _context.t0 = _context["catch"](0);
          res.redirect("/register");

        case 11:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 8]]);
});
app["delete"]("/logout", function (req, res) {
  req.logOut();
  res.redirect("/login");
});

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  res.redirect("/login");
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/");
  }

  next();
}

var PORT = 3000 || process.env.PORT;
app.listen(PORT, function () {
  return console.log("listen on port ".concat(PORT));
});