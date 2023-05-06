

/*
 * Describe: This Object Literal stores the state of the game, including the questions, 
   the user's answers, the score, and the current game instance (which is the number of times the user has reset the game).

*/
const gameState = {
  currentGameInstance: 1,
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

  setUserAnswers: function(answers) {
    this.userAnswers = answers;
  },

  incrementScore: function() {
    this.score++;
  },

  setPlayerCorrect: function(index) {
    this.questions[index].isPlayerCorrect = true;
  },

  getCorrectAnswers: function() {
    return this.questions.map(function(question) {
      return question.correctAnswer;
    });
  },

  //this method will increment the times user has reset the game
  incrementGameInstance: function(){
    this.currentGameInstance++;
  },


  //this method will reset the game state
  reset: function(){
    this.score = 0;
    this.questions.length=0;
    this.userAnswers.length=0;
  }
};

export default gameState;