//REQUIREMENTS
//++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Requiring Inquirer
var inquirer = require("inquirer");
// Requiring fs to write to JSON file
var fs = require("fs");
// Requiring ./basicCard.js that has our basic card constructor exported
// var BasicCard = require("./basicCard.js");

var cardArray = [];

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
      if (directory.nextStep == "Yes"){
        createNewCard();
      }
      // If not, the initialPrompt function runs again and they are directed back to the main screen
      else if (directory.nextStep == "No"){
        initialPrompt();
      }
    });
  });
};

// This function reads the flash cards saved by the user
function studyCards(){
  fs.readFile("newCards.JSON", "utf8", function(error, data){
    if (error){
      console.log("There is an error fetching your flashcards")
    }
  // Convert the data back into an object
  var questions = JSON.parse(data);
    // console.log(questions);
    inquirer.prompt([
      {
        type:"input",
        message: questions[0].front,
        name:"question"
      }
    ]).then(function(answer){
      if (answer.question == questions[0].back){
        console.log("Correct!");
        studyCards();
      }
      else{
        console.log("Incorrect! The correct answer was" + questions[0].back)
        studyCards();
      }
    });
  });
}




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