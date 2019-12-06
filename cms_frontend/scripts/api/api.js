const BASE_URL = "http://127.0.0.1:5500"; //"https://52pv4r6pe5.execute-api.us-east-2.amazonaws.com/beta";


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
        var json = await response.json();
        //console.log(json)
        return json;
    } catch(err) {
        console.error(`Error: ${err}`);
    }
    
}

// General API calls

async function getCards() {

    var json = await apiCall('GET', '/cards');
    var data = JSON.parse(json.body);

    var cards = [];
    for (var i = 0; i < data.length; i++) {
        var card = new Card(data[i]["cardId"],
                data[i]["eventType"],
                data[i]["recipient"],
                data[i]["orientation"]);
        // Add card to cards obj
        cards.push(card);
    }
    return cards;
}

// Card API calls

async function createCard(card) {
    var body = card.toJSON()
    var json = await apiCall('POST', '/card', body);
    card.cardId = json["cardId"]
    
    return card;
}

async function deleteCard(card) {
    var body = card.toJSON()
    
    var json = await apiCall('DELETE', '/card', body)
    
    console.log(json)
    return json
}

async function getElements(card) {
    var body = card.toJSON()
    var data = await apiCall('POST', '/card/elements', body)
    // console.log(json)
    // var data = JSON.parse(json.body);
    try {
        data = data["elements"]
    } catch (exception) {
        return null;
    }
    
    var elements = [];
    for (var i = 0; i < data.length; i++) {
        var el = new Element(data[i]["elementId"],
                            data[i]["cardId"],
                            data[i]["pageType"],
                            data[i]["elementType"],
                            data[i]["textMessage"],
                            data[i]["textFont"],
                            data[i]["imgSrc"],
                            data[i]["xCoord"],
                            data[i]["yCoord"],
                            data[i]["height"],
                            data[i]["width"]);
        // Add card to cards obj
        elements.push(el);
    }
    return elements;
}

async function createElement(element) {
    var body = element.toJSON()

    var json = await apiCall('POST', '/card/element', body)
    element.element_id = json["elementId"]
    return element;
}

async function deleteElement(element) {
    var body = element.toJSON()

    var json = await apiCall('DELETE', '/card/element', body)
    console.log(json)
}

async function updateElement(element) {
    var body = element.toJSON()
}

async function uploadImage(img) {
    var body = img.toJSON()
}
