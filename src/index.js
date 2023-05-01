import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/styles.css';




// API call structure

function getQuestions(){
  
  let request = new XMLHttpRequest();
  const url ='https://opentdb.com/api.php?amount=10&difficulty=easy&type=multiple';

  request.addEventListener('loadend', function(){
    const response = JSON.parse(this.responseText);
    if(this.status === 200){

      gameState.storeQuestionSet(response);
      printGame(response);
    }
    else{
      printError(this,response);
    }
  });
  request.open('GET', url, true);
  request.send();
}

function printGame(){

  const questionsContainer = document.querySelector('#questions-container');

  //render the questions in the DOM
  gameState.questions.forEach(function(questionSet){
    const question = questionSet.question;
    const answers = questionSet.answers;

    const questionElement = document.createElement('div');
    questionElement.setAttribute('class', 'card');
    questionElement.setAttribute('style, width: 18rem');

    const questionText = document.createElement('div');
    questionText.setAttribute('class', 'card-header');
    questionText.textContent = question;
    questionElement.append(questionText);

    const questionBody = document.createElement('div');
    questionBody.setAttribute('class', 'card-body');

    const answerList = document.createElement('ul');
    answerList.setAttribute('class', 'list-group list-group-flush');

    //populate the answers as radio buttons
    answers.forEach(function(answer){

      const answerItem = document.createElement('li');
      answerItem.setAttribute('class', 'list-group-item');

      const answerInput = document.createElement('input');
      answerInput.setAttribute('type', 'radio');
      answerInput.setAttribute('name', answer);
      answerInput.setAttribute('value', answer);
      answerInput.setAttribute('id', answer);

      const answerLabel = document.createElement('label');
      answerLabel.setAttribute('for', answer);
      answerLabel.textContent = answer;

      answerItem.append(answerInput, answerLabel);
      answerList.append(answerItem);
    });

    questionBody.append(answerList);
    questionElement.append(questionBody);
    
    
    questionsContainer.append(questionElement);
  });

  const submitButton = document.createElement('button');
  submitButton.setAttribute('type', 'button');
  submitButton.setAttribute('class', 'btn btn-primary');
  submitButton.textContent = 'Submit Answers';
  questionsContainer.append(submitButton);

}



/*The API appends a "Response Code" to each API Call to help tell developers what the API is doing.

Code 0: Success Returned results successfully.
Code 1: No Results Could not return results. The API doesn't have enough questions for your query. (Ex. Asking for 50 Questions in a Category that only has 20.)
Code 2: Invalid Parameter Contains an invalid parameter. Arguements passed in aren't valid. (Ex. Amount = Five)
Code 3: Token Not Found Session Token does not exist.
Code 4: Token Empty Session Token has returned all possible questions for the specified query. Resetting the Token is necessary.
*/

//conditional rendering of error messages
function printError(request, response){
  const errorElement = document.createElement('div');
  errorElement.setAttribute('class', 'card');
  errorElement.setAttribute('style, width: 18rem');

  const errorText = document.createElement('div');
  errorText.setAttribute('class', 'card-header');

  if(response.response_code === 1){
    errorText.textContent = 'No Results. The API doesn\'t have enough questions for your query.';
  }
  else if(response.response_code === 2){
    errorText.textContent = 'Invalid Parameter. Arguements passed in aren\'t valid.';
  }
  else if(response.response_code === 3){
    errorText.textContent = 'Token Not Found. Session Token does not exist.';

  }
  else if(response.response_code === 4){
    errorText.textContent = 'Token Empty. Session Token has returned all possible questions for the specified query. Resetting the Token is necessary.';
  }
  else{ 
    errorText.textContent = 'Unknown Error. Please try again.';
  }
  
  //resets the game state and removes the error message
  const errorButton = document.createElement('button');
  errorButton.setAttribute('type', 'button');
  errorButton.setAttribute('class', 'btn btn-primary');
  errorButton.textContent = 'Try Again';
  errorButton.addEventListener('click', function(){
    document.body.removeChild(errorElement);
    getQuestions();
    gameState.reset();
  });

  errorElement.append(errorText, errorButton);
  document.body.append(errorElement);
}


//stores answers and checks if they are correct, correct answer colored green
function checkAnswers(){

  const answers = document.querySelectorAll('input[type=radio]:checked');
  const answerValues = Array.from(answers).map(function(answer){
    return answer.value;
  });
  
  gameState.userAnswers = answerValues;

  const correctAnswers = gameState.questions.map(function(question){
    return question.correctAnswer;
  });


  //check if the answers are correct
  gameState.userAnswers.forEach(function(answer, index){
    if(answer === correctAnswers[index]){
      gameState.score++;
      gameState.questions[index].isPlayerCorrect = true;
    }
  });

  //color the correct answers green
  gameState.questions.forEach(function(question, index){
    const questionElement = document.querySelector(`#${question.correctAnswer}`);
    questionElement.setAttribute('class', 'list-group-item list-group-item-success');

  });

}


function handleAnswerSubmit(event){
  event.preventDefault();
  checkAnswers();
  const score = gameState.score;
  const totalQuestions = gameState.questions.length;
  const scoreElement = document.querySelector('#score');
  scoreElement.textContent = `You got ${score} out of ${totalQuestions} correct!`;

  //event listener for reset button
  const resetButton = document.querySelector('#game-reset');
  resetButton.addEventListener('click', function(){
    gameState.reset();
    scoreElement.textContent = '';
    const questionsContainer = document.querySelector('#questions-container');
    questionsContainer.innerHTML = '';
    getQuestions();
   });

}

window.addEventListener('load', function(){

  const questionsForm = document.querySelector('#questions-form');
  questionsForm.addEventListener('submit', handleAnswerSubmit);

});
