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
};

//CINDY's fx:
var createNewSnippet = function(data) {

var newSnippetCard = $("<div>").addClass("card border-secondary mb-3 rounded-0");
var cardHeading = $("<div>").addClass("card-header");
var categoryBtn = $("<button>").addClass("btn btn-sm c-button").attr("disabled", "disabled").text(data.category);
var btnList = $("<ul>").addClass("list-inline float-right m-0");
var updateLink = $("<a>").attr("href", `snippet/update/${data.id}`);
var updateLi = $("<li>").addClass("list-inline-item");
var updatebtn = $("<button>").addClass("btn btn-secondary btn-sm rounded-0").text("Update");
var deleteLi = $("<li>").addClass("list-inline-item");
var deletebtn = $("<button>").addClass("btn btn-danger btn-sm rounded-0 ml-2 delete").attr("data-id", data.id).html(`<i class="fas fa-times"></i>`);
var newSnippetBody = $("<div>").addClass("card-body text-secondary");
var cardTitle = $("<h5>").addClass("card-title");
var title = $("<a>").attr("href", `snippet/${data.id}`).text(data.title);
var code = $("<pre>").addClass("prettyprint p-2").text(data.code);

updateLi.append(updatebtn);
updateLink.append(updateLi);
deleteLi.append(deletebtn);
btnList.append(updateLink);
btnList.append(deleteLi);
cardHeading.append(categoryBtn);
cardHeading.append(btnList);
cardTitle.append(title);
newSnippetBody.append(cardTitle);
newSnippetBody.append(code);
newSnippetCard.append(cardHeading);
newSnippetCard.append(newSnippetBody);

return newSnippetCard;

}

var refreshCards = function() {
  API.getSnippets().then(function(data) {

    var cardContainer = $("#snippet-list");
    var snippetsToAdd = [];
    
    for (let i = 0; i < data.length; i++) {
      snippetsToAdd.push(createNewSnippet(data[i]));
    }

    cardContainer.empty();
    
    cardContainer.append(snippetsToAdd);

    });
}
//end CINDY's attempt

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
  var idToDelete = $(this).attr("data-id");

  API.deleteSnippet(idToDelete).then(function() {
    refreshCards();
  });
};

//handleSearch - dont need anymore
// var handleSearch = function() {
//   //select category where title contains XYZ, then refresh Cards
//   let category = $snippetCategory.val().trim();
//   let title = $searchTitle.val().trim();

//   API.searchSnippets(category, title).then(function() {
//     refreshCards();
//   })
// }

// Add event listeners to the submit and delete buttons
$submitBtn.on("click", handleFormSubmit);
$snippetList.on("click", ".delete", handleDeleteBtnClick);
// $searchBtn.on("click", handleSearch);