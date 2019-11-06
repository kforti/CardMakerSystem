const BASE_URL = "https://52pv4r6pe5.execute-api.us-east-2.amazonaws.com/beta";

async function getCards() {
    const config = {
        method: 'GET',
        mode: 'cors',
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        },
        }
    var data;
    try {     
        const response = await fetch(BASE_URL + "/cards", config)
        const json = await response.json();
        data = JSON.parse(json.body);
        console.log(data);
    } catch(err) {
        console.error(`Error: ${err}`);
    }

    for (var i = 0; i < data.length; i++) {
        var card = new Card(data[i]["cardId"],
                data[i]["eventType"],
                data[i]["recipient"],
                data[i]["orientation"]);
        card.render(card);

    }

}

async function handleRefreshCards(){
    var new_tbody = document.createElement('tbody');
    new_tbody.setAttribute("id", "data-table-body")
    var old_tbody = document.getElementById('data-table-body');
    old_tbody.parentNode.replaceChild(new_tbody, old_tbody)
    await getCards();
}

async function handleDeleteCard() {
    const dataTable = document.getElementById('data-table-body');
    var rows = dataTable.children;
    var cards = [];
    for (var i = 0; i < rows.length; i++) {
        //console.log(rows[i].children[0].children[0].children[0])
        if (rows[i].children[0].children[0].children[0].checked){
            console.log(rows[i].children[1].innerHTML);

            var card = new Card(rows[i].children[1].innerHTML,
                rows[i].children[3].innerHTML,
                rows[i].children[2].innerHTML,
                rows[i].children[4].innerHTML);

            cards.push(card)
        }
    }

    for (var i = 0; i < cards.length; i++) {
        await cards[i].delete(cards[i]);
    }


}

async function handleCreateCard() {
    var recipient = document.getElementById("recipient-field").value;
    var event = document.getElementById("event-field").value;
    var portrait = document.getElementById("portrait-option");
    var landscape = document.getElementById("landscape-option");
    var orientation;
    if(landscape.checked){
        orientation = "landscape";
    }
    else if(portrait.checked) {
        orientation = "portrait";
    }
    console.log(recipient);
    console.log(event);
    console.log(orientation);
    const config = {
        method: 'POST',
        mode: 'cors',
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        },
        body: JSON.stringify(
            {
            "recipient":recipient,
            "eventType":event,
            "orientation":orientation
        }
        )
        }
        var data;
        try {     
            const response = await fetch(BASE_URL + "/card", config)
            console.log(response);
            data = await response.json();
            // console.log(json);
            // data = JSON.parse(json.body);
            //console.log('Completed!', data);
            var card = new Card(data["cardId"],
                data["eventType"],
                data["recipient"],
                data["orientation"]);
            card.render();
        } catch(err) {
            console.error(`Error: ${err}`);
        }
        
}

////// Card

function Card(id, event, recipient, orientation) {
    this.id = id;
    this.event = event;
    this.recipient = recipient;
    this.orientation = orientation;
    this.render = renderCard;
    this.delete = deleteCard;
}

function renderCard() {
    const dataTable = document.getElementById('data-table-body');

    var row = dataTable.insertRow(0);
    var cell0 = row.insertCell(0);
    var cell1 = row.insertCell(1);
    var cell2 = row.insertCell(2);
    var cell3 = row.insertCell(3);
    var cell4 = row.insertCell(4);
    var cell5 = row.insertCell(5);
    var cell6 = row.insertCell(6);

    cell0.innerHTML = '<div class="card-checkbox"><input id="checkbox" type="checkbox"></div>'
    cell1.innerHTML = this.id;
    cell2.innerHTML = this.recipient;
    cell3.innerHTML = this.event;
    cell4.innerHTML = this.orientation;
    cell5.innerHTML = "N/A";
    cell6.innerHTML = "N/A";
    
    cell0.addEventListener("click", cardSelector);

}

function cardSelector() {
    var delete_button = document.getElementById("delete-card-button")
    delete_button.disabled = false;
    delete_button.addEventListener("click", handleDeleteCard)

}

async function deleteCard(card) {
    const config = {
        method: 'DELETE',
        mode: 'cors',
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "cardId": parseInt(card.id),
            "recipient": card.recipient,
            "eventType": card.event,
            "orientation": card.orientation
        })
        }
        var data;
        try {     
            const response = await fetch(BASE_URL + "/card", config)
            data = await response.json();
            
        } catch(err) {
            console.error(`Error: ${err}`);
        }
        return data;
    }

//var card = new Card("9999", "birthday", "bill", "portrait");
// var card2 = new Card("0001", "birthday", "bill", "portrait");
//card.render(card);
// card2.render(card2);

getCards()