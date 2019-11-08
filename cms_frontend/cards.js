
/// Cards Page Component
function cardPage() {

    this.renderTable = renderCardTable;
    this.cards = getCards();
    
}

function renderCardTable() {
    var html = $('data-table-component')
}

async function handleRefreshCards(){
    var new_tbody = document.createElement('tbody');
    new_tbody.setAttribute("id", "data-table-body")
    var old_tbody = $('data-table-body');
    old_tbody.parentNode.replaceChild(new_tbody, old_tbody)
    await getCards();
}

async function handleDeleteCard() {
    const dataTable = $('data-table-body');
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
    var recipient = $("recipient-field").value;
    var event = $("event-field").value;
    var portrait = $("portrait-option");
    var landscape = $("landscape-option");
    var orientation;
    if(landscape.checked){
        orientation = "landscape";
    }
    else if(portrait.checked) {
        orientation = "portrait";
    }

    var card = await createCard(recipient, event, orientation);
    
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
    const dataTable = $('data-table-body');

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
    var delete_button = $("delete-card-button")
    delete_button.disabled = false;
    delete_button.addEventListener("click", handleDeleteCard)

}
