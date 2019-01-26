// Get references to page elements
var $snippetTitle = $("#snippet-title");
var $snippetCode = $("#snippet-code");
var $snippetComment = $("#snippet-comment");
var $snippetCategory = $("#snippet-category");

var $submitBtn = $("#submit");
var $confirmBtn = $("#confirm");
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
  },
  updateSnippet: function(id, snippet) {
    return $.ajax({
      url: "api/update/" + id,
      type: "POST",
      data: JSON.stringify(snippet)
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
};

//Post onsubmit actions for update page
var refreshUpdate = function() {
  API.getSnippets().then(function() {
    location.reload();
  });
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

var handleConfirmButtonClick = function(event) {
  event.preventDefault();

  var pathArray = window.location.pathname.split("/");
  var idToUpdate = pathArray.slice(3, 4);

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

  API.updateSnippet(idToUpdate, snippet).then(function() {
    refreshUpdate();
  });
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

// Add event listeners to the submit and delete buttons
$submitBtn.on("click", handleFormSubmit);
$snippetList.on("click", ".delete", handleDeleteBtnClick);
$confirmBtn.on("click", handleConfirmButtonClick);
