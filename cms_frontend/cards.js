require('swagger_card_maker_system_api')
const URL_CARDS = "";


function getCards() {
    console.log("hello world!")
}

function createCard() {
    console.log(document.getElementById("event-field").value)

}

function deleteCard() {

}


var SwaggerCardMakerSystemApi = require('swagger_card_maker_system_api');

var api = new SwaggerCardMakerSystemApi.DefaultApi()

//var body = new SwaggerCardMakerSystemApi.Card(); // {Card} Card object that needs to be added


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
};
resp = api.getCards(callback);
console.log(resp.body)

getCards()