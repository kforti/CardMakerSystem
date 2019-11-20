/// Cards Page Component
async function cardPage() {
    var cards = await getCards();
    console.log(cards);
    for (var i = 0; i < cards.length; i++){
        cards[i].render()
    }
    
}

async function handleRefreshCards(){
    var new_tbody = document.createElement('tbody');
    new_tbody.setAttribute("id", "data-table-body")
    var old_tbody = document.getElementById('data-table-body');
    old_tbody.parentNode.replaceChild(new_tbody, old_tbody)
    await cardPage();
}

async function handleDeleteCard() {
    var dataTable = document.getElementById('data-table-body');
    var rows = dataTable.children;
    var cards = [];
    for (var i = 0; i < rows.length; i++) {
        if (rows[i].children[0].children[0].children[0].checked){
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
    var card = new Card(0, event, recipient, orientation)
    
    if (card.checkPass)
    card = await createCard(card);

    // automatically go to edit page once card is created
    goToEditPage(card);
}

async function handleEditCard() {
    var dataTable = document.getElementById('data-table-body');
    var rows = dataTable.children;
    var card;

    // get first checked card in table
    for (var i = 0; i < rows.length; i++) {
        if (rows[i].children[0].children[0].children[0].checked){
            card = new Card(rows[i].children[1].innerHTML,
                rows[i].children[3].innerHTML,
                rows[i].children[2].innerHTML,
                rows[i].children[4].innerHTML);
                break;
        }
    }

    // if a card has been selected, edit it
    if (card) {
        goToEditPage(card);
    }
}

function goToEditPage(card) {
    // switch to edit mode
    document.getElementById('edit-page').style.display = '';
    document.getElementById('cards-page').style.display = 'none';

    // populate card information
    document.getElementById('card-id-field').innerHTML = card.cardId;
    document.getElementById('card-recipient-field').innerHTML = card.recipient;
    document.getElementById('card-event-field').innerHTML = card.event;
    // TODO set canvas height and width based on orientation
    // document.getElementById('canvas').width =

    getCardElements(card);
}

////// Card

function Card(id, event, recipient, orientation) {
    this.cardId = id;
    this.event = event;
    this.recipient = recipient;
    this.orientation = orientation;
    this.render = renderCard;
    this.delete = deleteCard;
}

function renderCard() {
    var dataTable = document.getElementById('data-table-body');

    var row = dataTable.insertRow(0);
    var cell0 = row.insertCell(0);
    var cell1 = row.insertCell(1);
    var cell2 = row.insertCell(2);
    var cell3 = row.insertCell(3);
    var cell4 = row.insertCell(4);
    var cell5 = row.insertCell(5);
    var cell6 = row.insertCell(6);

    cell0.innerHTML = '<div class="card-checkbox"><input id="checkbox" type="checkbox"></div>'
    cell1.innerHTML = this.cardId;
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

document.getElementById('edit-page').style.display = 'none';
cardPage();