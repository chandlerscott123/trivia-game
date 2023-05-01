//will store current game state, including the answers to the questions
//and the current question number


const gameState = {
  currentQuestion: 1,
  score: 0,
  questions: [],
  userAnswers: [],

  //this function will store the questions in the gameState object
  storeQuestionSet: function(response){
    const questionAnswers = response.results.map(function(result, index){
      
      const answers = result.incorrect_answers;
      answers.push(result.correct_answer);
      

      return {
        question: result.question,
        id: index+1,
        answers: answers,
        correctAnswer: result.correct_answer,
        isPlayerCorrect: false
      };
    });

    this.questions = questionAnswers;

  },

  //this method will reset the game state
  reset: function(){
    this.currentQuestion = 1;
    this.score = 0;
    this.questions.length=0;
  }



};