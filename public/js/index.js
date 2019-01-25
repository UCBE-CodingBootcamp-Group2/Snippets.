// Get references to page elements
var $snippetTitle = $("#snippet-title");
var $snippetCode = $("#snippet-code");
var $snippetComment = $("#snippet-comment");
var $snippetCategory = $("#snippet-category");

var $submitBtn = $("#submit");
var $snippetList = $("#snippet-list");

jQuery.fn.prettify = function() {
  this.html(prettyPrintOne(this.html()));
};

// The API object contains methods for each kind of request we'll make
var API = {
  saveSnippet: function(snippet) {
    return $.ajax({
      headers: {
        "Content-Type": "application/json"
      },
      type: "POST",
      url: "api/snippets",
      data: JSON.stringify(snippet)
    });
  },
  updateSnippet: function(id) {
    return $.ajax({
      type: "PUT",
      url: "api/snippets/" + id,
      data: JSON.stringify(snippet)
    });
  },
  getSnippets: function() {
    return $.ajax({
      url: "api/snippets",
      type: "GET"
    });
  },
  deleteSnippet: function(id) {
    return $.ajax({
      url: "api/snippets/" + id,
      type: "DELETE"
    });
  }
};

// refreshsnippets gets new snippets from the db and repopulates the list
var refreshSnippets = function() {
  API.getSnippets().then(function(data) {
    var $snippets = data.map(function(snippet) {
      var $a = $("<a>")
        .title(snippet.title)
        .attr("href", "/snippet/" + snippet.id);

      var $li = $("<li>")
        .attr({
          class: "list-group-item",
          "data-id": snippet.id
        })
        .append($a);

      var $button = $("<button>")
        .addClass("btn btn-danger float-right delete")
        .title("ｘ");

      $li.append($button);

      return $li;
    });

    $snippetList.empty();
    $snippetList.append($snippets);
  });
  location.reload();
};

// handleFormSubmit is called whenever we submit a new snippet
// Save the new snippet to the db and refresh the list
var handleFormSubmit = function(event) {
  event.preventDefault();

  var snippet = {
    title: $snippetTitle.val().trim(),
    code: $snippetCode.val().trim(),
    comment: $snippetComment.val().trim(),
    category: $snippetCategory.val().trim()
  };

  if (!(snippet.title && snippet.code && snippet.comment && snippet.category)) {
    alert("You must input something into all fields!");
    return;
  }

  API.saveSnippet(snippet).then(function() {
    refreshSnippets();
  });

  $snippetTitle.val("");
  $snippetCode.val("");
  $snippetComment.val("");
  $snippetCategory.val("");
};

// handleDeleteBtnClick is called when an snippet's delete button is clicked
// Remove the snippet from the db and refresh the list
var handleDeleteBtnClick = function() {
  var idToDelete = $(this)
    .parent()
    .attr("data-id");

  API.deleteSnippet(idToDelete).then(function() {
    refreshSnippets();
  });
};

// handleUpdateBtnClick is called when an snippet's update button is clicked
// Update the snippet in the db and refresh the list
var handleUpdateBtnClick = function() {
  event.preventDefault();

  var idToUpdate = $(this).attr("data-name");

  var snippet = {
    title: $snippetTitle.val().trim(),
    code: $snippetCode.val().trim(),
    comment: $snippetComment.val().trim(),
    category: $snippetCategory.val().trim()
  };

  if (!(snippet.title && snippet.code && snippet.comment && snippet.category)) {
    alert("You must input something into all fields!");
    return;
  }

  API.updateSnippet(idToUpdate).then(function() {
    refreshSnippets();
  });

  $snippetTitle.val("");
  $snippetCode.val("");
  $snippetComment.val("");
  $snippetCategory.val("");
};

// Add event listeners to the submit, delete, and update buttons
$submitBtn.on("click", handleFormSubmit);
$snippetList.on("click", ".delete", handleDeleteBtnClick);
$snippetList.on("click", ".update", handleUpdateBtnClick);
