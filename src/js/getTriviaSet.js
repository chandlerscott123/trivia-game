
export default class TriviaSet {
  static getTriviaSet() {
    return new Promise(function(resolve, reject) {
      let request = new XMLHttpRequest();
      const url = `https://opentdb.com/api.php?amount=10&category=9&difficulty=easy&type=multiple`;
      request.addEventListener('loadend', function() {
        const response = JSON.parse(this.responseText);
        if(this.status === 200) {
          resolve(response);
        }
        else {
          reject([this, response]);
        }
      });
      request.open('GET', url, true);
      request.send();
    });
  }
}