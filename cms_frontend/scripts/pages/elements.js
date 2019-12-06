
// On page load

var STATE = fetchState()
loadPage()


function fetchState() {
    var STATE = JSON.parse(localStorage.getItem('state'));
    return STATE;
}

function loadPage() {
    // Get Stored Card
    var elements = [];

    // Set Canvas Event listener
    const canvas = document.querySelector('canvas')
    canvas.addEventListener('mousedown', (e) => {
        var cursor_position = getCursorPosition(canvas, e);
        element = checkElement(cursor_position.x_pos, cursor_position.y_pos);
        if (element) {
            stageElement();
        }
    })
    canvas.addEventListener('mouseup', (e) => {
        var cursor_position = getCursorPosition(canvas, e);
        moveElement(cursor_position);
        console.log("MOUSE UP: " + cursor_position.x_pos + "," +cursor_position.y_pos)
    })

    if (STATE !== null) {
        var card = STATE.currentCard;
        
        document.getElementById('card-id-field').innerHTML = card.cardId;
        document.getElementById('card-recipient-field').innerHTML = card.recipient;
        document.getElementById('card-event-field').innerHTML = card.event;
        
        //elements = getElements(card);
        elements = [new Element(55, 55, "0", "text", "text_message", 
            "times", "someurl", 50, 60, 23, 44)]

        if (!elements) {
            return
        }

        for (var el of elements) {
            var page = STATE.currentPage;
            console.log(page);
            page.elements.push(el);
        }
    }

    renderElements(STATE.currentPage.elements)
}

/////////////////////////////
/// Element Functions
/////////////////////

function getCursorPosition(canvas, event) {
    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    return {x_pos: x,
            y_pos: y}
}

function moveElement(cursor_pos) {

}

function checkElement(x_pos, y_pos) {
    console.log(x_pos, y_pos)
    for (var el of STATE.currentPage.elements) {
        if ( (x_pos >= el.xCoord && x_pos <= (el.xCoord + el.width) ) && ( y_pos <= el.yCoord && y_pos >= (el.yCoord - el.height) )) {
            stageElement(el)
        }
    }
}

function stageElement(el) {

}

function renderElements(elements) {
    var c = document.getElementById("canvas");
    var ctx = c.getContext("2d");

    for (var element of elements) {
        ctx.font = "50px sans-serif";
        var t = ctx.fillText(element.textMessage, element.xCoord, element.yCoord);
        console.log(ctx);
    }
}

///////////////////////
/// Handlers
////////////

// creates an element and re-renders the page
async function handleCreateElement() {
    var text_message = document.getElementById("text-message").value;
    var font_table_body = document.getElementById("font-table-body");
    var rows = font_table_body.children;
    var font = "";
    for (var i = 0; i < rows.length; i++) {
        if (rows[i].children[0].children[0].children[0].checked) {
            font = rows[i].children[1].innerHTML;
            break
        }
    }
    
    var current_card_id = parseInt(document.getElementById("card-id-field").innerHTML);
    var x_coord = parseInt(document.getElementById("x-coord").value);
    var y_coord = parseInt(document.getElementById("y-coord").value);
    var height = parseInt(document.getElementById("height-field").value);
    var width = parseInt(document.getElementById("width-field").value);
    
    // TODO add in width/height functionality (just to UI and to send to database - we dont have to use it when displaying)

    // TODO call create element handler

    // TODO put everything below in response so that element object has correct id
    // TODO add in functionality for pictures
    var element = new Element(0, current_card_id, currentPage, "text", text_message, font, "", x_coord, y_coord, height, width);
    element = await createElement(element)
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
        await deleteElement(deleted_elements[i])
    }
    renderCardPage(); // TODO put this in response
}

// renders the elements of the current card page onto the canvas
function renderCardPage() {
    var c = document.getElementById("canvas");
    var ctx = c.getContext("2d");

    // clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // clear table
    var dataTable = document.getElementById('elements-table-body');
    dataTable.innerHTML =  "";

    // // set current page
    // var page_id;
    // var page_id_field = document.getElementById('page-id-field');
    // if (currentPage == "0") {
    //     page_id = "front page"
    // }
    // else if (currentPage == "1") {
    //     page_id = "inner left page"
    // }
    // else if (currentPage == "2") {
    //     page_id = "inner right page"
    // }
    // else if (currentPage == "3") {
    //     page_id = "back page"
    // }
    // page_id_field.innerHTML = page_id;

    // loop through all card elements
    for (var element of elements) {
        
        if (element.elementType === "text") {
            // add to canvas
            ctx.font = "30px " + element.textFont;
            ctx.fillText(element.textMessage, element.xCoord, element.yCoord);

        } else {
            // TODO implement displaying image on canvas
        }
        
    }
}

function handlePageChange(page_id) {
    var page_id;
    var page_id_field = document.getElementById('page-id-field');
    if (page_id == "0") {
        page_id = "front page"
    }
    else if (page_id == "1") {
        page_id = "inner left page"
    }
    else if (page_id == "2") {
        page_id = "inner right page"
    }
    else if (page_id == "3") {
        page_id = "back page"
    }
    page_id_field.innerHTML = page_id;

}

function handleTextOption() {
    console.log("TEXT")
    document.getElementById("text-window").hidden = false;
    document.getElementById("image-window").hidden = true;
}

function handleImageOption() {
    console.log("Image")
    document.getElementById("text-window").hidden = true;
    document.getElementById("image-window").hidden = false;
}

function handleFontStyleChange(el, text_state) {
    console.log("FONT STYLE");
    console.log(el.value);
}

function handleFontSizeChange(el, text_state) {
    console.log("FONT Size");
    console.log(el.value);
}

function handleImageNameChange() {

}

function handleSelectImage(el) {
    console.log("IMAGE SELECTED");
    console.log(el);
    if (STATE.selectedImage === el) {
        img = STATE.selectedImage;
        STATE.selectedImage = null;
        var img_body = document.getElementById("selected-image");
        img_body.remove();
        el.style.border = "";
        return;
    }

    else if (STATE.selectedImage) {
        var img_body = document.getElementById("selected-image");
        img_body.remove();
        STATE.selectedImage.style.border = "";

    }

    var img = el.cloneNode(true);
    img.setAttribute("id", "selected-image")
    STATE.selectedImage = el;
    var img_body = document.getElementById("selected-image-body");
    img_body.appendChild(img);
    el.style.border = "3px solid red";  
    
}

function handleUploadButton() {
    document.getElementById("upload-file").click()
}

function handleUploadImage(el) {
    console.log(el.files);
    var reader = new FileReader();
    var image_holder = document.getElementById("uploaded-images");

    reader.addEventListener("load", function () {
        var img = document.createElement('img')
        img.addEventListener("click", () => { handleSelectImage(img)});
        img.setAttribute("class", "img-fluid optional-image");
        img.src = reader.result;
        image_holder.appendChild(img);
      }, false);

    reader.readAsDataURL( el.files[0]);
}


