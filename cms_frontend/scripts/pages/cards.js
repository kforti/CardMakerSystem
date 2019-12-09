const BASE_PAGES_URL = "http://127.0.0.1:5500"; // "https://52pv4r6pe5.execute-api.us-east-2.amazonaws.com/development";//"https://52pv4r6pe5.execute-api.us-east-2.amazonaws.com/beta"; 

var STATE = new State();

/////////////////////////
/// Launch Page
///////////////

cardPage();

async function cardPage() {
    var cards = await getCards();
    console.log(cards);
    for (var i = 0; i < cards.length; i++){
        renderCard(cards[i])
    }
    
}

function renderCard(card) {
    var dataTable = document.getElementById('data-table-body');

    var row = dataTable.insertRow(0);
    row.id = `card-row-${card.cardId}`
    var cell0 = row.insertCell(0);
    var cell1 = row.insertCell(1);
    var cell2 = row.insertCell(2);
    var cell3 = row.insertCell(3);
    var cell4 = row.insertCell(4);

    cell0.innerHTML = `
        <div class="card-checkbox">
            <i id="checkbox-${card.cardId}" class="material-icons md-18">
                check_circle
            </i>
        </div>`;
    cell0.style.visibility = "hidden";
                //<input id="checkbox-${card.cardId}" type=checkbox></div>`
    cell1.innerHTML = card.cardId;
    cell2.innerHTML = card.recipient;
    cell3.innerHTML = card.eventType;
    cell4.innerHTML = card.orientation;
    
    // cell0.addEventListener("click", () => { handleCardSelector(card) });
    row.addEventListener("click", () => { handleCardSelector(card) })
        
}


////////////////////////////////////////
/////// Handlers
////////////////


function handleCardSelector(card) {
    // Add or remove check mark
    
    if (STATE.currentCard && card.selected) {
        document.getElementById("delete-card-button").disabled = true;
        document.getElementById("edit-card-button").disabled = true;
        //delete_button.addEventListener("click", () => { handleDeleteCard(card) })
        
        document.getElementById(`checkbox-${card.cardId}`).style.visibility = "hidden"
        card.selected = false;
        STATE.currentCard = false

    } else if (!card.selected) {
        var prev_select_card = STATE.currentCard;
        if (prev_select_card) {
            prev_select_card.selected = false;
            document.getElementById(`checkbox-${prev_select_card.cardId}`).style.visibility = "hidden"
        } else if (!prev_select_card) {
            var delete_button = document.getElementById("delete-card-button")
            delete_button.disabled = false;
        }

        card.selected = true
        STATE.currentCard = card;

        //delete_button.addEventListener("click", () => { handleDeleteCard(card) })

        document.getElementById("edit-card-button").disabled = false;
        
        document.getElementById(`checkbox-${card.cardId}`).style.visibility = "visible"
    }
    
    console.log(JSON.stringify(card))
}


async function handleRefreshCards(){
    var new_tbody = document.createElement('tbody');
    new_tbody.setAttribute("id", "data-table-body")
    var old_tbody = document.getElementById('data-table-body');
    old_tbody.parentNode.replaceChild(new_tbody, old_tbody)
    await cardPage();
}

async function handleDeleteCard(card) {
    var deleted = await deleteCard(card)
    console.log(deleted)
    if (deleted === true) {
        document.getElementById(`card-row-${card.cardId}`).remove()
    }
    document.getElementById("delete-card-button").disabled = true;
    document.getElementById("edit-card-button").disabled = true;
}

async function handleCreateCard() {
    var recipient = document.getElementById("recipient-field").value;
    var eventType = document.getElementById("event-field").value;
    var portrait = document.getElementById("portrait-option");
    var landscape = document.getElementById("landscape-option");
    var orientation;
    if(landscape.checked){
        orientation = "landscape";
    }
    else if(portrait.checked) {
        orientation = "portrait";
    }
    var card = new Card(0, eventType, recipient, orientation)
    
    if (!card.checkPass) {
        
    }
    card = await createCard(card);

    if (card) {
        STATE.currentCard = card;
        localStorage.setItem('state', JSON.stringify(STATE));
        location.href = BASE_PAGES_URL + "/edit-page.html";
    }
    
}

async function handleEditCard(state) {
    localStorage.setItem('state', JSON.stringify(state));
    location.href = BASE_PAGES_URL + "/edit-page.html";


}

