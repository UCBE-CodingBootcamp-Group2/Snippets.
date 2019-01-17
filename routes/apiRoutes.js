var db = require("../models");

module.exports = function(app) {
  // Get all examples
  app.get("/api/examples", function(req, res) {
    db.Example.findAll({}).then(function(dbExamples) {
      res.json(dbExamples);
    });
  });

  // Get route for returning posts of a specific category
  app.get("/api/examples/category/:category", function(req, res) {
    db.Post.findAll({
      where: {
        category: req.params.category
      }
    }).then(function(dbCat) {
      res.json(dbCat);
    });
  });

  // Create a new example
  app.post("/api/examples", function(req, res) {
    db.Example.create(req.body).then(function(dbCreate) {
      res.json(dbCreate);
    });
  });

  // Delete an example by id
  app.delete("/api/examples/:id", function(req, res) {
    db.Example.destroy({ where: { id: req.params.id } }).then(function(
      dbExample
    ) {
      res.json(dbExample);
    });
  });

  //update example by id
  app.put("/api/examples", function(req, res) {
    db.Post.update(req.body, {
      where: {
        id: req.body.id
      }
    }).then(function(dbUpdate) {
      res.json(dbUpdate);
    });
  });
};
