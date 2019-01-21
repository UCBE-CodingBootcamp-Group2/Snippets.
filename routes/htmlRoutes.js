var db = require("../models");
var path = require("path");
var passport = require("../config/passport");

// Requiring our custom middleware for checking if a user is logged in
var isAuthenticated = require("../config/middleware/isAuthenticated");

module.exports = function(app) {
  // Require passport verification
  app.post(
    "/login",
    passport.authenticate("local", {
      successRedirect: "/",
      failureRedirect: "/login"
    })
  );

  app.get("/", function(req, res) {
    // If the user already has an account send them to the members page
    if (req.user) {
      res.redirect("/home");
    }
    res.sendFile(path.join(__dirname, "../public/signup.html"));
  });

  // Load index page
  app.get("/home", function(req, res) {
    db.Snippet.findAll({}).then(function(dbSnippets) {
      res.render("index", {
        msg: "Welcome!",
        snippets: dbSnippets
      });
    });
  });

  app.get("/login", function(req, res) {
    // If the user already has an account send them to the members page
    if (req.user) {
      res.redirect("/home");
    }
    res.sendFile(path.join(__dirname, "../public/login.html"));
  });

  // Here we've add our isAuthenticated middleware to this route.
  // If a user who is not logged in tries to access this route they will be
  // redirected to the signup page
  app.get("/home", isAuthenticated, function(req, res) {
    res.redirect("/home");
  });

  app.get("/newsnippet", function(req, res) {
    db.Snippet.findAll({}).then(function(dbSnippets) {
      res.render("newsnippet", {
        snippets: dbSnippets
      });
    });
  });

  // Load snippet page and pass in an snippet by id
  app.get("/snippet/:id", function(req, res) {
    db.Snippet.findOne({ where: { id: req.params.id } }).then(function(
      dbSnippets
    ) {
      res.render("snippet", {
        snippet: dbSnippets
      });
    });
  });

  // Render 404 page for any unmatched routes
  app.get("*", function(req, res) {
    res.render("404");
  });
};
