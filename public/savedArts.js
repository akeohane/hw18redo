$(document).ready(function(){
  console.log("page loading")
  // $.getJSON("/articles", function(data) {
  //   // For each one

  //   var coolData = data.reverse();
  //   for (var i = 0; i < data; i++) {
  //     // Display the apropos information on the page
  //       console.log("data")
  //     var newSaveButton = $("<button type='button' id='saveButton'class='btn btn-default'>Save Article</button>")
  //     $("#articles").append("<p class='textText' data-id='" + coolData[i]._id + "'>" + coolData[i].title +  "</p><p class='textLinks' data-id='" + coolData[i]._id + "'>"  + coolData[i].link + "</p><button type='button' data-id='" + coolData[i]._id + "'id='saveButton'class='btn btn-default'>Save Article</button><br /><br />");
  //   }
  // });
});

function renderSavedArtices (){
  $.getJSON("/savedArticles", function(data) {
    // For each one

    var coolData = data.reverse();
    for (var i = 0; i < data.length; i++) {
      // Display the apropos information on the page
      $("#articles").append("<h4 class='textText' data-id='" + coolData[i]._id + "'>" + coolData[i].title +  "</h4><a class='textLinks' href='"+coolData[i].link+"'data-id='" + coolData[i]._id + "'>"  + coolData[i].link + "</a><br><button type='button' data-id='" + coolData[i]._id + "'id='deleteArticleButton'class='btn btn-default'>Delete Article</button><br><hr>");
      var newLineBreak = $("<br><hr><br>")
      $("articles").append(newLineBreak)
    }
  });
}



$(document).on("click", "#displayButton", function() {
  console.log("displaying")
renderSavedArtices()
});

$(document).on("click", "#deleteArticleButton", function() {
  console.log("button works!")
  var thisId = $(this).attr("data-id");
  console.log("Data: " + thisId)


  $.ajax({
    type: "POST",
    url: "/update2/" + thisId,
    dataType: "json",
    data: {
      // Value taken from title input
      saved: true
    }
  })

    // With that done
    .then(function(data) {
      // Log the response
      console.log(data);
      $("#articles").empty()
      renderSavedArtices()
    });
});

$(document).on("click", "h4", function() {
  // Empty the notes from the note section
  $("#notes").empty();
  // Save the id from the p tag
  var thisId = $(this).attr("data-id");

  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    // With that done, add the note information to the page
    .then(function(data) {
      console.log(data);
      // The title of the article
      $("#notes").append("<h2>" + data.title + "</h2>");
      // An input to enter a new title
      $("#notes").append("<input id='titleinput' name='title' >");
      // A textarea to add a new note body
      $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
      // A button to submit a new note, with the id of the article saved to it
      $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");
      $("#notes").append("<button data-id='" + data._id + "' id='deletenote'>Delete Note</button>");

      // If there's a note in the article
      if (data.note) {
        // Place the title of the note in the title input
        $("#titleinput").val(data.note.title);
        // Place the body of the note in the body textarea
        $("#bodyinput").val(data.note.body);
      }
    });
});
$(document).on("click", "#savenote", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // Value taken from title input
      title: $("#titleinput").val(),
      // Value taken from note textarea
      body: $("#bodyinput").val()
    }
  })
    // With that done
    .then(function(data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      $("#notes").empty();
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});


$(document).on("click", "#deletenote", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Make an AJAX GET request to delete the specific note
  // this uses the data-id of the p-tag, which is linked to the specific note
  $.ajax({
    type: "GET",
    url: "/delete/" + thisId,

    // On successful call
    success: function(response) {
      // Remove the p-tag from the DOM
   
      // Clear the note and title inputs
      $("#note").val("");
      $("#title").val("");
      // Make sure the #action-button is submit (in case it's update)
      $("#action-button").html("<button id='make-new'>Submit</button>");
    }
  });
});