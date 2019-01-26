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

  app.get("/login", function(req, res) {
    // If the user already has an account send them to the members page
    if (req.user) {
      res.redirect("/home");
    }
    res.sendFile(path.join(__dirname, "../public/login.html"));
  });

  app.get("/userexists", function(req, res) {
    res.render("userexists");
  });

  // Here we've add our isAuthenticated middleware to this route.
  // If a user who is not logged in tries to access this route they will be
  // redirected to the signup page

  // Load index page if authenticated
  app.get("/home", isAuthenticated, function(req, res) {
    db.Snippet.findAll({}).then(function(dbSnippets) {
      res.render("index", {
        snippets: dbSnippets
      });
    });
  });

  app.get("/test", isAuthenticated, function(req, res) {
    db.Snippet.findAll({}).then(function(dbSnippets) {
      res.render("test", {
        snippets: dbSnippets
      });
    });
  });

  app.get("/newsnippet", isAuthenticated, function(req, res) {
    db.Snippet.findAll({}).then(function(dbSnippets) {
      res.render("newsnippet", {
        snippets: dbSnippets
      });
    });
  });

  app.get("/categories", isAuthenticated, function(req, res) {
    res.render("categories");
  });

  //For search bar functionality
  app.get("/search", isAuthenticated, function(req, res) {
    var category = req.query.category;
    var search = req.query.term;

    if (category === "") {
      db.Snippet.findAll({
        where: {
          title: { like: `%${search}%` }
        }
      }).then(function(dbSnippets) {
        res.render("index", {
          snippets: dbSnippets
        });
      });
    } else {
      db.Snippet.findAll({
        where: {
          category: category,
          title: { like: `%${search}%` }
        }
      }).then(function(dbSnippets) {
        res.render("index", {
          snippets: dbSnippets
        });
      });
    }
  });

  // Load snippet page and pass in an snippet by id
  app.get("/snippet/:id", isAuthenticated, function(req, res) {
    db.Snippet.findOne({ where: { id: req.params.id } }).then(function(
      dbSnippets
    ) {
      res.render("snippet", {
        snippet: dbSnippets
      });
    });
  });

  app.get("/snippet/update/:id", isAuthenticated, function(req, res) {
    db.Snippet.findOne({ where: { id: req.params.id } }).then(function(
      dbSnippets
    ) {
      res.render("updatesnippet", {
        snippet: dbSnippets
      });
    });
  });

  // Render 404 page for any unmatched routes
  app.get("*", function(req, res) {
    res.render("404");
  });
};
