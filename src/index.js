import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/styles.css';
import gameState from './js/gameState.js';
import UI from './js/UI.js';



/* 
  * Describe: This function will make an API call to the Open Trivia Database API and store a set 
    of questions, answers, and correct answers in the gameState object.
  
  * type: void
  * @param {object} UIobject - the UI object

  * NOTE: For more information on the Open Trivia Database API, visit https://opentdb.com/api_config.php
  * See README.md for more information on the project.


*/

function getQuestions(event, UIobject){
  event.preventDefault();
  console.log('scope: getQuestions');
  console.log(UIobject instanceof UI); // check if UIobject is an instance of the UI class
  
  let request = new XMLHttpRequest();
  const url ='https://opentdb.com/api.php?amount=1&difficulty=easy&type=multiple';

  request.addEventListener('loadend', function(){
    const response = JSON.parse(this.responseText);
    if(this.status === 200){

      gameState.storeQuestionSet(response);
      printGame(UIobject);
    }
    else{
      printError(response, UIobject);
    }
  });
  request.open('GET', url, true);
  request.send();
}

/*
  * Describe: This function will handle the user submitting their answers to the questions.
  * type: void
  * @param {object} event - the event object
  * @param {object} UIobject - the UI object
  * 

*/
function printGame(UIobject){

  console.log(UIobject instanceof UI); // check if UIobject is still an instance of the UI class
  console.log('scope: printGame');

  //create the questions form using UI class
  UIobject.createDiv('container', 'questions-container', '');
  const questionsContainer = document.querySelector('#questions-container');
  const questionsForm = UIobject.createQuestionsForm() //('form', 'questions-form'+`${gameState.currentGameInstance}`, '');

  //render the questions in the DOM
  gameState.questions.forEach(function(questionSet){
    const question = questionSet.question;
    const answers = questionSet.answers;

    const questionElement = UIobject.createDiv('card question', 'question', '');
    questionElement.setAttribute('id', 'Q-'+`${questionSet.id}`);

    const questionText = UIobject.createDiv('card-header', 'question-text', question);
    questionElement.append(questionText);

    const questionBody = document.createElement('div');
    questionBody.setAttribute('class', 'card-body');

    const answerList = UIobject.createList('list-group list-group-flush', 'answer-list');
    

    //populate the answers as radio buttons
    answers.forEach(function(answer){
      const answerInput = UIobject.createInput('radio', question, answer.replace(/\s+/g, '-'), 'A-'+ answer.replace(/\s+/g, '-')+'-input', 'form-check-input');
      const answerLabel = UIobject.createLabel('form-check-label', 'A-'+ answer.replace(/\s+/g, '-'), 'A-'+ answer.replace(/\s+/g, '-'), answer);
      const answerItem = UIobject.createListItem('form-check', '');
      answerItem.innerHTML = answerInput.outerHTML + answerLabel.outerHTML;
      const listElement = UIobject.createListItem('list-group-item', '');
      listElement.append(answerItem);
      answerList.append(listElement);

    });

    questionBody.append(answerList);
    questionElement.append(questionBody);
    questionsContainer.append(questionElement);
  });

  const submitButton = UIobject.createButton('submit', 'btn btn-primary', 'submit', 'Submit Answers');
  questionsForm.append(questionsContainer);
  questionsForm.append(submitButton);
  
  document.body.append(questionsForm);

  //hide the start button
  const startButton = document.querySelector('#start');
  startButton.setAttribute('class', 'hidden');

  //hide the placeholder card
  const placeholderCard = document.querySelector('#placeholder');
  placeholderCard.setAttribute('class', 'hidden');

  questionsForm.addEventListener('submit', (event) => handleAnswerSubmit(event, UIobject));

}

/*The API appends a "Response Code" to each API Call to help tell developers what the API is doing.

Code 0: Success Returned results successfully.
Code 1: No Results Could not return results. The API doesn't have enough questions for your query. (Ex. Asking for 50 Questions in a Category that only has 20.)
Code 2: Invalid Parameter Contains an invalid parameter. Arguements passed in aren't valid. (Ex. Amount = Five)
Code 3: Token Not Found Session Token does not exist.
Code 4: Token Empty Session Token has returned all possible questions for the specified query. Resetting the Token is necessary.
*/

/*
Describe Error Handling: this function will print an error message to the DOM if the API call returns an error code
  * type: void
  * @param {object} response - the response object from the API call
  * @param {object} UIobject - the UI object
  */

function printError(response, UIobject){
  

  let errorText;

  if(response.response_code === 1){
    errorText = 'No Results. The API doesn\'t have enough questions for your query.';
  }
  else if(response.response_code === 2){
    errorText = 'Invalid Parameter. Arguements passed in aren\'t valid.';
  }
  else if(response.response_code === 3){
    errorText = 'Token Not Found. Session Token does not exist.';

  }
  else if(response.response_code === 4){
    errorText = 'Token Empty. Session Token has returned all possible questions for the specified query. Resetting the Token is necessary.';
  }
  else{ 
    errorText = 'Unknown Error. Please try again.';
  }
  
  //add reset button and error message to DOM
  UIobject.printTryAgain();
  const errorElement = UIobject.createCard('card', 'error', errorText);
  document.body.append(errorElement);

  const tryAgainButton = document.querySelector('#game-reset');
  tryAgainButton.addEventListener('click', (event) => reset(event, UIobject));
}

/*
 * Describe: This function will reset the game state and UI to the initial state.
  * type: void
  * @param {object} event - the event object
  * @param {object} UIobject - the UI object
*/
//stores answers and checks if they are correct, correct answer colored green
function checkAnswers(UIobject){
  const answers = document.querySelectorAll('input[type=radio]:checked');
  const answerValues = Array.from(answers).map(function(answer) {
    return answer.value;
  });

  // Reset the score before checking the answers
  gameState.resetScore();

  // Set user answers in the gameState object
  gameState.setUserAnswers(answerValues);

  //check if the answers are correct
  gameState.userAnswers.forEach(function(answer, index){
    if(answer === gameState.questions[index].correctAnswer){
      gameState.incrementScore();
      gameState.setPlayerCorrect(index);
    }
  });

  //color text of correct answer green, bold and add checkmark icon
  UIobject.colorCorrectAnswers(gameState.questions);

}

/*
 * Describe: This function will print the user's score to the DOM.
  * type: void
  * @param {object} UIobject - the UI object

*/

function printScore(UIobject){
  const questionsContainer = document.querySelector('#questions-container');
  const score = gameState.score;
  const totalQuestions = gameState.questions.length;
  const scoreElement = UIobject.createCard('card', 'score', '');
  const scoreText = UIobject.createCard('card-header', 'score-text', `You got ${score} out of ${totalQuestions} correct!`);
  scoreElement.append(scoreText);
  questionsContainer.append(scoreElement);
}

/*
  * Describe: This function will handle the user submitting their answers to the questions.
  * type: void
  * @param {object} event - the event object
  * @param {object} UIobject - the UI object
*/

function handleAnswerSubmit(event, UIobject){
  event.preventDefault();
  console.log('submitted');

  checkAnswers(UIobject);
  printScore(UIobject);
  UIobject.printTryAgain(UIobject);

  const tryAgainButton = document.querySelector('#game-reset');
  tryAgainButton.addEventListener('click', (event) => reset(event, UIobject));
}


/*
  * Describe: This function will print a placeholder card to the DOM.
  * type: void
  * @param {object} UIobject - the UI object
*/

function printPlaceholder(UIobject){
  const questionsContainer = document.querySelector('#questions-container');
  const placeholderCard = UIobject.createCard('card', 'placeholder', '');
  const placeholderHeader = UIobject.createCard('card-header', 'placeholder-text', 'Welcome to the Trivia Game!');
  const placeholderBody = UIobject.createCard('card-body', 'placeholder-body', 'Click the button below to start the game!');

  placeholderCard.append(placeholderHeader, placeholderBody);
  questionsContainer.append(placeholderCard);
}

/*
  * Describe: This function will reset the gameState and UI to the initial state, incrementing gameState's 
    currentGameInstance by 1.
  * type: void
  * @param {object} event - the event object
  * @param {object} UIobject - the UI object
*/
function reset(event, UIobject){
  event.preventDefault();
  if(document.querySelector('#error')){
    document.querySelector('#error').remove();
    gameState.incrementGameInstance();
    gameState.reset();
  }
  else {
    console.log('scope: reset');
    console.log(UIobject instanceof UI); // check if UIobject is still an instance of the UI class
    gameState.reset();
    document.querySelector('#questions-form'+`${gameState.currentGameInstance}`).remove();

    // Recreate questionsContainer
    const questionsContainer = UIobject.createDiv('container', 'questions-container', '');
    document.body.appendChild(questionsContainer);


    printPlaceholder(UIobject);

    //show start button
    const startButton = document.querySelector('#start');
    startButton.setAttribute('class', 'btn btn-primary');
    gameState.incrementGameInstance();
  }
}



//gameFlow
/*

1. User clicks start button
2. API call is made
3. Questions are rendered in the DOM
4. User clicks submit button
5. Answers are checked
6. Score is printed
7. User clicks try again or Reset button
8. Game state is reset

*/



/*
  DOM Load Event Listener: 
    * UI object is instantiated and placeholder card is printed to the DOM
    * Event listener is added to the start button
*/
window.addEventListener('load', function(){

  const UIobject = new UI();
  console.log(UIobject instanceof UI); // check if UIobject is an instance of the UI class
  //generate game event listener
  const generateGameButton = document.querySelector('#start');
  generateGameButton.addEventListener('click', (event) => getQuestions(event, UIobject));
});
