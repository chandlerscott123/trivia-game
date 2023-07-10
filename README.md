# Trivia Game
## Description
The Trivia Game is a fun and interactive project that quizzes users with trivia questions fetched from the Open Trivia Database API. The application is written in JavaScript and uses technologies like HTML, CSS, and Bootstrap for the user interface, and Jest, Babel, and Webpack for development.

## Setup and Installation
1. Clone the repository to your local machine.
```bash
$ git clone github.com/witherScript/trivia-game
```
2. Navigate to the project directory.
3. Install the dependencies with npm install.
4. Build the project with npm run build.
5. Start the development server with npm start.

## Usage
On loading the application, a placeholder card is displayed with a "start" button. Clicking this button triggers an API call to fetch a set of trivia questions which are then rendered to the user. The user can submit their answers, after which the score is calculated and displayed. The user can then opt to play again, which resets the game state.

## Project Structure
The project primarily consists of four JavaScript files:

- **index.js:** This is the entry point of the application. It controls the overall flow of the game and handles events like starting the game, submitting answers, and resetting the game.

- **gameState.js:** This module manages the state of the game, including the current questions, the user's answers, and the score.

- **UI.js:** This module provides methods for creating and manipulating HTML elements in the DOM.

- **getTriviaSet.js:** This module makes an API call to the Open Trivia Database API to fetch a set of trivia questions.

## Dependencies
The application uses the following dependencies:

- Bootstrap for styling the application.
- Babel for transpiling the code.
- Jest for testing.
- ESLint for linting.
- Webpack for bundling the code.

## Contributing
If you'd like to contribute, please fork the repository and make changes as you'd like. Pull requests are warmly welcome.

## Scripts
npm run build: Build the project.
npm start: Start the development server.
npm run lint: Lint the code.
npm run test: Run the tests.
