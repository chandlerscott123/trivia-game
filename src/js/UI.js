import gameState from './gameState.js';

class UI {

  //**Remove element from DOM**//
  clearElement(element) {
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
  }

  /*
  ******** Create HTMLElements **********
   * @param {string} elementType - type of element to create
   * @param {string} elementClass - class of element to create
   * @param {string} elementId - id of element to create
   * @param {string} elementText - text of element to create
   * @returns {HTMLElement} - returns element of type elementType
   *
   * Describe: This function will create an element of type elementType and return it to the caller.
  */
  createCard(cardClass, cardId, cardHeader) {
    const card = document.createElement('div');
    card.setAttribute('class', cardClass);
    card.setAttribute('id', cardId);
    card.setAttribute('style', 'width: 18rem');
    card.textContent = cardHeader;
    return card;
  }

  createListItem(listItemClass, listItemText) {
    const listItem = document.createElement('li');
    listItem.setAttribute('class', listItemClass);
    listItem.textContent = listItemText;
    return listItem;
  }

  createList(listClass, listId) {
    const list = document.createElement('ul');
    list.setAttribute('class', listClass);
    list.setAttribute('id', listId);
    return list;
  }

  createLabel(labelClass, labelId, labelFor, labelText) {
    const label = document.createElement('label');
    label.setAttribute('class', labelClass);
    label.setAttribute('id', labelId);
    label.setAttribute('for', labelFor);
    label.textContent = labelText;
    return label;
  }

  printTryAgain() {
    const tryAgainButton = this.createButton('button', 'btn btn-primary', 'game-reset', 'Try Again');
    const questionsContainer = document.querySelector('#questions-container');
    questionsContainer.append(tryAgainButton);
  }

  createQuestionsForm() {
    const questionsForm = document.createElement('form');
    questionsForm.setAttribute('id', 'questions-form' + `${gameState.currentGameInstance}`);
    document.body.append(questionsForm);
    return questionsForm;
  }

  createButton(type, btnClass, btnId, btnText) {
    const button = document.createElement('button');
    button.setAttribute('type', type);
    button.setAttribute('class', btnClass);
    button.setAttribute('id', btnId);
    button.textContent = btnText;
    return button;
  }

  createDiv(divClass, divId, divText) {
    const div = document.createElement('div');
    div.setAttribute('class', divClass);
    div.setAttribute('id', divId);
    div.textContent = divText;
    return div;
  }
  
  createInput(inputType, inputName, inputValue, inputId, inputClass) {
    const input = document.createElement('input');
    input.setAttribute('type', inputType);
    input.setAttribute('name', inputName);
    input.setAttribute('value', inputValue);
    input.setAttribute('id', inputId);
    input.setAttribute('class', inputClass);
  
    return input;
  
  }


  /*
  ******** Modify DOM Existing Content **********
    * Describe: This function will color the correct answers green and bold them.
    * @param {array} questions - array of question objects from gameState
  */
  colorCorrectAnswers(questions) {
    questions.forEach(function (question) {
      const questionElement = document.getElementById('A-' + `${question.correctAnswer.replace(/\s+/g, '-')}`);

      //color text of correct answer green, bold and add checkmark icon
      questionElement.setAttribute('style', 'color: green');
      questionElement.setAttribute('class', 'font-weight-bold');
      questionElement.textContent = questionElement.textContent + ' ✔️';
    });
  }

  hideElement(element) {
    element.setAttribute('class', 'hidden');
  }

  showElement(element) {
    element.setAttribute('class', 'btn btn-primary');
  }
}

export default UI;