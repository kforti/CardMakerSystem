// Local Storage
var elements = [];
var currentPage = 0;

// retrieves all elements for a specific card and renders the page
async function getCardElements(card) {
    // TODO call handler for list of card elements

    // TODO put everything below this in response
    // REMOVE THIS AFTER creates temporary elements for card
    const e = new Element(4, card.cardId, 0, "text", "heyyyyy", "Arial", null, 200, 200, 200, 200);
    const e2 = new Element(7, card.cardId, 0, "text", "ah ha ha", "Arial", null, 300, 400, 200, 200);
    elements.push(e);
    elements.push(e2);
    renderCardPage();
}

// creates an element and re-renders the page
async function handleCreateElement() {
    var text_message = document.getElementById("text-message").value;
    var font = document.getElementById("font").value;
    var x_coord = parseInt(document.getElementById("x-coord").value);
    var y_coord = parseInt(document.getElementById("y-coord").value);
    // TODO add in width/height functionality (just to UI and to send to database - we dont have to use it when displaying)

    // TODO call create element handler

    // TODO put everything below in response so that element object has correct id
    // TODO add in functionality for pictures
    var element = new Element(0, 0, currentPage, "text", text_message, font, null, x_coord, y_coord, 0, 0);
    elements.push(element);
    renderCardPage();
}

// deletes all selected element and re-renders the page
async function handleDeleteElement() {
    var dataTable = document.getElementById('elements-table-body');
    var rows = dataTable.children;

    var new_elements = [];
    var deleted_ids = [];
    var deleted_elements = [];

    for (var i = 0; i < rows.length; i++) {
        if (rows[i].children[0].children[0].children[0].checked) {
            deleted_ids.push(rows[i].children[1].innerHTML);
        }
    }

    for (var element of elements) {
        if (deleted_ids.includes(element.element_id.toString())) {
            deleted_elements.push(element);
        } else {
            new_elements.push(element);
        }
    }

    elements = new_elements;
    for (var i = 0; i < deleted_elements.length; i++) {
        // TODO call delete element handler
    }
    renderCardPage(); // TODO put this in response
}

// TODO edits an element and re-renders the page
// async function handleEditElement()

// renders the elements of the current card page onto the canvas
function renderCardPage() {
    var c = document.getElementById("canvas");
    var ctx = c.getContext("2d");

    // clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // clear table
    var dataTable = document.getElementById('elements-table-body');
    dataTable.innerHTML =  "";

    // loop through all card elements
    for (var element of elements) {
        if (element.page_type === currentPage) {
            if (element.element_type === "text") {
                // add to canvas
                ctx.font = "30px " + element.text_font;
                ctx.fillText(element.text_message, element.x_coord, element.y_coord);

                // add to table
                var row = dataTable.insertRow(0);
                var cell0 = row.insertCell(0);
                var cell1 = row.insertCell(1);
                var cell2 = row.insertCell(2);
                var cell3 = row.insertCell(3);
                var cell4 = row.insertCell(4);

                cell0.innerHTML = '<div class="element-checkbox"><input id="checkbox" type="checkbox"></div>'
                cell1.innerHTML = element.element_id;
                cell2.innerHTML = element.text_message;
                cell3.innerHTML = element.x_coord;
                cell4.innerHTML = element.y_coord;
            } else {
                // TODO implement displaying image on canvas
            }
        }
    }
}

function handleFrontPage() {
    currentPage = 0;
    renderCardPage();
}

function handleLeftPage() {
    currentPage = 1;
    renderCardPage();
}

function handleRightPage() {
    currentPage = 2;
    renderCardPage();
}

function handleBackPage() {
    currentPage = 3;
    renderCardPage();
}

// Element Class
class Element {
        constructor(element_id, card_id, page_type, element_type, text_message, text_font, img_src, x_coord, y_coord, height, width) {
        this.element_id = element_id;
        this.card_id = card_id;
        this.page_type = page_type;
        this.element_type = element_type;
        this.text_message = text_message;
        this.text_font =  text_font;
        this.img_src = img_src;
        this.x_coord = x_coord;
        this.y_coord = y_coord;
        this.height =  height;
        this.width = width;
    }
}