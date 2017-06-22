//REQUIREMENTS & GLOBAL VARIABLES
//++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Requiring Inquirer
var inquirer = require("inquirer");
// Requiring fs to write to JSON file
var fs = require("fs");
// Requiring ./basicCard.js that has our basic card constructor exported
var BasicCard = require("./basicCard.js");

// Setting an empty array variable to hold the flash cards created by the user
var cardArray = [];
// Setting a variable to represent the index number of the questions in the array
var i = 0;
// Setting an empty array variable to hold the flashcards pulled from the "newCards.JSON" file
var studyArray = [];

//FUNCTIONS
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++

// Function createNewCard handles the making of new flashcards
function createNewCard(){
  inquirer.prompt([
    // Prompt for the Front of the Card
    {
      type:"input",
      message:"Enter the Card's Question Please:",
      name: "front"
    },
    // Prompt for the Answer
    {
      type:"input",
      message:"Enter the Card's Answer Please:",
      name: "back"
    }
  // Once that information has been received...
  ]).then(function(cardInfo){
    // A newCard object is then created using our BasicCard constructor
    var newCard = new BasicCard(
      cardInfo.front, cardInfo.back);
      // console.log(newCard);
    cardArray.push(newCard);
    // The newCard object is then appended to our JSON file
    fs.writeFile("newCards.JSON", JSON.stringify(cardArray, null, 2), function(error){
      if (error){
        console.log("There was an Error Completing your Card.");
      }
      else{
        // Console.log to let the user know they've successfully created a card!
        console.log("Congratulations! Your Card is Complete!")
      }
    });
    // The user is then asked if they want to create another card
    inquirer.prompt([
      {
        type:"list",
        message:"Create Another Card?",
        choices: ["Yes", "No"],
        name: "nextStep"
      }
    ]).then(function(directory){
      // If they do, the createNewCard function runs again
      if (directory.nextStep === "Yes"){
        createNewCard();
      }
      // If not, the initialPrompt function runs again and they are directed back to the main screen
      else if (directory.nextStep === "No"){
        initialPrompt();
      }
    });
  });
};

// This function reads the flash cards saved by the user
var studyCards = function(){
  // Read the newCards.JSON file that contains our flashcards
  fs.readFile("newCards.JSON", "utf8", function(error, data){
    if (error){
      console.log("There is an error fetching your flashcards")
    }
    // Convert the data back into an object
    var questions = JSON.parse(data);  
      // console.log(questions);
    // Loop through our object and Push that object into our empty array
    for(var index = 0; index < questions.length; index++){
      studyArray.push(questions[index]);
    }
    // Calling our function that displays the flashcards
    displayCards();
    
  });
}

function displayCards (){
  // If i is less than the length of studyArray...
  if (i < studyArray.length){
      // ....Ask the next question up
      inquirer.prompt([
        {
          "type":"input",
          "message": studyArray[i].front,
          "name":"question"
        }
      // .then Handles the Answer
      ]).then(function(answer){
        // If the user answer matches the flashcard answer..  
        var answerConverted = answer.question.toLowerCase();
        if (answerConverted === studyArray[i].back){
          console.log("Correct!");        }
        // Else..
        else{
          console.log("Incorrect! The correct answer was " + studyArray[i].back);
        }
        // Add 1 to i to call the next question when the displayCards function runs again
        i++;
        // Call the displayCards function
        displayCards();
        // studyCards();
      });
    }
    // If i is = or > the length of studyArray...
    else{
      console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
      console.log("That is the end of your deck. Choose 'Create a Card' to create a new deck to study!");
      console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
      // Call the initialPrompt function and go back to the home screen
      initialPrompt();
    }
}

// Function that handles the initial user direction/ Acts as the app "home page"
function initialPrompt(){
  inquirer.prompt([

    // Opening Question
    {
      type:"list",
      message:"Please Choose:",
      choices: ["Create a Card","Study My Cards"],
      name: "choice"
    }

  ]).then(function(choice){
    if(choice.choice === "Create a Card"){
      // console.log("Create a Card");
      createNewCard();
    }
    else{
      // console.log("Study My Cards");
      studyCards();
    }
  })
}

initialPrompt(); 