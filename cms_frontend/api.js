const BASE_URL = "https://52pv4r6pe5.execute-api.us-east-2.amazonaws.com/beta";


// Base api call
async function apiCall(method, endpoint, req_body) {
    const config = {
        method: method,
        mode: 'cors',
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        },
        body: JSON.stringify(req_body)
        }

    var data;
    try {     
        const response = await fetch(BASE_URL + endpoint, config)
        const json = await response.json();
        data = JSON.parse(json.body);
    } catch(err) {
        console.error(`Error: ${err}`);
    }
    return data;
}

// General API calls

async function getCards() {

    var data = await apiCall('GET', '/cards');

    var cards = {};
    for (var i = 0; i < data.length; i++) {
        var card = new Card(data[i]["cardId"],
                data[i]["eventType"],
                data[i]["recipient"],
                data[i]["orientation"]);
        // Add card to cards obj
        cards[data[i]["cardId"]] = card;
    }
    return cards;
}

// Card API calls

async function createCard(card) {
    var body = {
        "recipient":card.recipient,
        "eventType":card.event,
        "orientation":card.orientation
    }
    var data = await apiCall('POST', '/card', body);
    card.cardId = data["cardId"]
    // var card = new Card(data["cardId"],
    //         data["eventType"],
    //         data["recipient"],
    //         data["orientation"]);
    return card;
}

async function deleteCard(card) {
    var body = {
        "cardId": parseInt(card.cardId),
        "recipient": card.Srecipient,
        "eventType": card.event,
        "orientation": card.orientation
    }
    var data = await apiCall('DELETE', '/card', body)
    if (this.rendered) {
        this.removeRenderedCard(card);
    }

}