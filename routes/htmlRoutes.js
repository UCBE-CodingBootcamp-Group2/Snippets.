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
    db.Example.findAll({}).then(function(dbExamples) {
      res.render("index", {
        msg: "Welcome!",
        examples: dbExamples
      });
    });
  });

  app.get("/login", function(req, res) {
    // If the user already has an account send them to the members page
    if (req.user) {
      res.redirect("/members");
    }
    res.sendFile(path.join(__dirname, "../public/login.html"));
  });

  // Here we've add our isAuthenticated middleware to this route.
  // If a user who is not logged in tries to access this route they will be
  // redirected to the signup page
  app.get("/members", isAuthenticated, function(req, res) {
    res.sendFile(path.join(__dirname, "../public/members.html"));

    app.get("/newsnippet", function(req, res) {
      db.Example.findAll({}).then(function(dbExamples) {
        res.render("newsnippet", {
          examples: dbExamples
        });
      });
    });

    app.get("/newcategory", function(req, res) {
      db.Example.findAll({}).then(function(dbExamples) {
        res.render("newcategory", {
          examples: dbExamples
        });
      });
    });

    app.get("/newtag", function(req, res) {
      db.Example.findAll({}).then(function(dbExamples) {
        res.render("newtag", {
          examples: dbExamples
        });
      });
    });

    // Load example page and pass in an example by id
    app.get("/example/:id", function(req, res) {
      db.Example.findOne({ where: { id: req.params.id } }).then(function(
        dbExample
      ) {
        res.render("example", {
          example: dbExamples
        });
      });
    });

    // Render 404 page for any unmatched routes
    app.get("*", function(req, res) {
      res.render("404");
    });
  });
};
