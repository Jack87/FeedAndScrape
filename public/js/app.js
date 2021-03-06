// Grab the articles as a json
$.getJSON("/articles", function(data) {
  // For each one
  for (var i = 0; i < data.length; i++) {
    // Display the apropos information on the page
    // $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>");
    var articleCard = $("<div>")
    articleCard.addClass("articleCard col-sm-6 col-md-4 border-dark mb-2");
    articleCard.css({"width": "18rem","box-shadow": "0 2px 4px 0 rgba(0, 0, 0, 0.2), 0 3px 10px 0 rgba(0, 0, 0, 0.9)"});
    
    var cardImg = $("<img>")
    cardImg.addClass("card-img-top mt-3");
    cardImg.attr("src", data[i].imgURL);
    cardImg.attr("alt", data[i].title);
    cardImg.css({"height":"191px"});
    
    var cardBody = $("<div>");
    cardBody.addClass("card-body");

    var cardTitle = $("<h5>");
    cardTitle.addClass("card-title");
    cardTitle.text(data[i].title);


    var cardText = $("<p>");
    cardText.addClass("card-text");
    cardText.text(data[i].brief);

    var readBtn = $("<a>");
    readBtn.addClass("btn btn-primary");
    readBtn.attr("href", data[i].link);
    readBtn.attr("target", "_blank");
    readBtn.text("Read Article");

    var noteBtn = $("<button>");
    noteBtn.addClass("btn btn-success float-right");
    noteBtn.attr("data-toggle", "modal")
    noteBtn.attr("data-target", ".notes-list-modal")
    noteBtn.text("View Notes");

    var cardFooter = $("<div>");
    cardFooter.addClass("card-footer text-muted");
    cardFooter.text(data[i].date);

    $("#articles").append(articleCard);
    articleCard.append(cardImg).append(cardBody).append(cardFooter);
    cardBody.append(cardTitle).append(cardText).append(readBtn).append(noteBtn);
  }
});

// Whenever someone clicks a p tag
$(document).on("click", "p", function() {
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
      // $("#notes").append("<h2>" + data.title + "</h2>");
      // // An input to enter a new title
      // $("#notes").append("<input id='titleinput' name='title' >");
      // // A textarea to add a new note body
      // $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
      // // A button to submit a new note, with the id of the article saved to it
      // $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

      // If there's a note in the article
      if (data.note) {
        // Place the title of the note in the title input
        $("#titleinput").val(data.note.title);
        // Place the body of the note in the body textarea
        $("#bodyinput").val(data.note.body);
      }
    });
});

// When you click the savenote button
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
