// On page load
var STATE = fetchState()

var STATE = loadCardEditor(STATE);


function fetchState() {
    var STATE = JSON.parse(localStorage.getItem('state'));
    console.log(STATE)
    var card = new Card()
    STATE.currentCard = card.fromJSON(JSON.parse(STATE.currentCard))
    
    return STATE;
}

async function loadCardEditor(state) {
    state = await loadCard(state)
    setCanvas(state);
    setPageNav(state);
    state = await buildCardEditor(state)
}

async function loadCard(state) {
    if (!state.page0) {
        state.page0 = new Page("0");
    }
    if (!state.page1) {
        state.page1 = new Page("1");
    }
    if (!state.page2) {
        state.page2 = new Page("2");
    }
    if (!state.page3) {
        state.page3 = new Page("3");
    }
    state.currentPage = state.page0;

    var elements = [];

    if (state.currentCard !== null) {
        elements = await getElements(state.currentCard);
        if (!elements) {
            return
        }

        for (var el of elements) {
            if (el.pageType == "0") {
                state.page0.addElement(el);
            }
            else if (el.pageType == "1") {
                state.page1.addElement(el);
            }
            else if (el.pageType == "2") {
                state.page2.addElement(el);
            }
            else if (el.pageType == "3") {
                state.page3.addElement(el);
            }
        }
    }
    renderElements(state.currentPage.elements)
    return state;
}

async function buildCardEditor(state) {
    document.getElementById("show-card-button").addEventListener("click", () => {handleShowCard(state)})
    await setElementStage(state);

    document.getElementById('card-id-field').innerText = state.currentCard.cardId;
    document.getElementById('card-recipient-field').innerText = state.currentCard.recipient;
    document.getElementById('card-event-field').innerText = state.currentCard.eventType;
    return state;
}


function setCanvas(state) {
    const canvas = document.querySelector('canvas')
    console.log(state.currentCard.orientation.toLowerCase())
    // Set Width and Height
    if (state.currentCard.orientation.toLowerCase() === "portrait") {
        canvas.width = 600;
        canvas.heigth = 900;
    } else if (state.currentCard.orientation.toLowerCase() === "landscape") {
        canvas.width = 900;
        canvas.height = 600;
    }
    
    // Set Event Listeners
    canvas.addEventListener('mousedown', (e) => {
        state.mouseDownDone = false;
        try {
            var cursor_position = getCursorPosition(canvas, e);
            element = checkElement(state, cursor_position.x_pos, cursor_position.y_pos);
            if (element && element.elementType === "text") {
                stageTextElement(state, element);
                //console.log("element")
            } else if (element && element.elementType === "image") {
                stageImageElement(state, element);

            }else{console.log("NO Element")}
            }
        catch (Exception) {
            state.mouseDownDone = true;
        }
        state.mouseDownDone = true;
    })
    canvas.addEventListener('mouseup', (e) => {
        var cursor_position = getCursorPosition(canvas, e);

        var iters = 0;
        while (!state.mouseDownDone) {
            iters += 1;
            if (iters == 10000) {
                console.log("10000 iters")
                return
            }
        }
        //console.log(state)
        if (state.currentElement){
            moveElement(state, cursor_position);
            //console.log("MOUSE UP: " + cursor_position.x_pos + "," +cursor_position.y_pos)
        } 
    })
}

async function setElementStage(state) {

    // Text/Image Nav
    document.getElementById("text-option-clickable").addEventListener("click", () => {handleTextOption(state)})
    document.getElementById("image-option-clickable").addEventListener("click", () => {handleImageOption(state)})

    // Initialize new element at (200, 200)
    state.newElement = new Element()
    state.newElement.xCoord = 200;
    state.newElement.yCoord = 200;
    state.newElement.pageType = state.currentPage.id;
    state.newElement.cardId = state.currentCard.cardId;

    // Add Event listener to text edit fields and edit, create and delete buttons
    document.getElementById("edit-text-element-button").addEventListener("click", () => {handleEditTextElement(state)})
    document.getElementById("create-text-element-button").addEventListener("click", (event) => {handleCreateTextElement(state)})
    document.getElementById("delete-text-element-button").addEventListener("click", (event) => {handleDeleteTextElement(state)})

    var text_field = document.getElementById("selected-text-message-field")
    text_field.addEventListener("change", (event) => {handleElementFieldChange(event, state)})

    var font_style = document.getElementById("font-style-select")
    font_style.addEventListener("change", (event) => {handleElementFieldChange(event, state)})

    var font_size = document.getElementById("font-size-select")
    font_size.addEventListener("change", (event) => {handleElementFieldChange(event, state)})

    // Add Event listener to image edit fields and edit, create and delete buttons
    document.getElementById("edit-image-element-button").addEventListener("click", () => {handleEditImageElement(state)})
    document.getElementById("create-image-element-button").addEventListener("click", () => {handleCreateImageElement(state)})
    document.getElementById("delete-image-element-button").addEventListener("click", () => {handleDeleteImageElement(state)})
    
    var name_field = document.getElementById("selected-image-name")
    name_field.addEventListener("change", (event) => {handleElementFieldChange(event, state)})

    var images = await getImages()

    var img_holder = document.getElementById("uploaded-images")
    for (img of images) {
        var img_element = img.toHTML();
        img_element.addEventListener("click", (event) => {handleSelectImage(state, event, img)})
        img_holder.appendChild(img_element)
    }
    
}

function setPageNav(state) {
    var page_buttons = document.getElementsByClassName("page-nav-button")
    console.log(page_buttons)
    for (button of page_buttons) {
        button.addEventListener("click", (event) => {handlePageChange(state, event)})
    }
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

async function moveElement(state, cursor_pos) {
    var element = state.currentElement;
    if (element.inBoundary(cursor_pos.x_pos, cursor_pos.y_pos)) {
        console.log("NOT MOVED")
        return
    }
    element.xCoord = cursor_pos.x_pos;
    element.yCoord = cursor_pos.y_pos;
    await updateElement(element)
    state.currentPage.updateElement(element)
    renderElements(state.currentPage.elements)

}

function checkElement(state, x_pos, y_pos) {
    console.log(x_pos, y_pos)
    console.log(state.currentPage.elements)
    for (var el of state.currentPage.elements) {
        if (el.inBoundary(x_pos, y_pos)) {
            return el;
        }
        
    }
    return false;
}

function stageTextElement(state, el) {
    state.currentElement = el;
    state.newElement = el;
    document.getElementById("create-text-element-button").disabled = false;
    document.getElementById("delete-text-element-button").disabled = false;
    
    var styles = document.getElementById("font-style-select")
    var sizes = document.getElementById("font-size-select")
    for (var i = 0; i < styles.length; i++){
        console.log("style")
        console.log(styles.options[i].value)
        console.log(el.fontStyle)
        if (styles.options[i].value == el.fontStyle) {
            styles.selectedIndex = i;
        }
    }
    for (var i = 0; i < sizes.length; i++){
        if (sizes.options[i].value == el.fontSize) {
            sizes.selectedIndex = i;
        }
    }
    
    var id_field = document.getElementById("selected-element-id-field")
    var text_field = document.getElementById("selected-text-message-field")
    id_field.value = el.elementId;
    text_field.value = el.textMessage;
    console.log(id_field)

    //document.getElementById("edit-element-button").disabled = false;
}

function stageImageElement(state, el) {
    state.currentElement = el;
    state.newElement = el;

    var id_field = document.getElementById("selected-element-id-field")
    var name_field = document.getElementById("selected-image-name-field")
    var height_field = document.getElementById("selected-image-height-field")
    var width_field = document.getElementById("selected-image-width-field")
    id_field.value = el.elementId;
    name_field.value = el.image.fileName;
    height_field = el.height;
    width_field = el.width;
}

function renderElements(elements) {
    var c = document.getElementById("canvas");
    var ctx = c.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (var element of elements) {
        console.log(element)
        if (element.elementType == "text") {
            ctx.font = element.textFont;
            var t = ctx.fillText(element.textMessage, element.xCoord, element.yCoord);
        }
        else if (element.elementType == "image") {
            var imgHTML = element.getImageHTML();
            console.log(imgHTML);
            ctx.drawImage(imgHTML, element.xCoord, element.yCoord, element.width, element.height);
        }
        
    }
}

///////////////////////
/// Handlers
////////////

// creates an element and re-renders the page
async function handleCreateElement(state) {
    
    element = await createElement(state.newElement)
    if (element) {
        state.currentPage.addElement(element)
    }
    renderElements(state.currentPage.elements)
    console.log(element)
}

function handleEditElement(state) {
    if (state.currentElement.elementType === "text") {
        var id_field = document.getElementById("selected-card-id-field").value
        var text_field = document.getElementById("selected-text-message-field").value
        var font_style = document.getElementById("font-style-select").value
        var font_size = document.getElementById("font-size-select").value
        state.currentElement.cardId = id_field;
        state.currentElement.textMessage = text_field;
        state.currentElement.fontStyle = font_style;
        state.currentElement.fontSize = font_size;
        state.currentElement.setTextFont();
        state.currentElement.setWidthHeight();
        // console.log(font_size)
        // console.log(id_field)
        // console.log(text_field)
        // console.log(font_style)
    

    } else if (state.currentElement.elementType === "image") {
        
    }

}

function handlePageChange(state, event) {
    var page_id = event.srcElement.innerText
    var page_id_field = document.getElementById('page-id-field');
    if (page_id == "Front Page") {
        state.currentPage = state.page0;
    }
    else if (page_id == "Inner Left Page") {
        state.currentPage = state.page1;
    }
    else if (page_id == "Inner Right Page") {
        state.currentPage = state.page2;
    }
    else if (page_id == "Back Page") {
        state.currentPage = state.page3;
    }
    renderElements(state.currentPage.elements)
    page_id_field.innerText = page_id;

}

// Navigating Text and Image Elements

function handleTextOption(state) {
    console.log("TEXT")
    state.newElement.elementType = "text"
    document.getElementById("text-window").hidden = false;
    document.getElementById("image-window").hidden = true;
}

function handleImageOption(state) {
    console.log("Image")
    state.newElement.elementType = "image"
    document.getElementById("text-window").hidden = true;
    document.getElementById("image-window").hidden = false;
}

// Editing Text Element

function handleFontStyleChange(el, state) {
    state.newElement.fontStyle = el.value;
    checkTextElementStatus(state)
}

function handleFontSizeChange(el, state) {
    state.newElement.fontSize = el.value;
    checkTextElementStatus(state)
}

function handleTextMessageChange(el, state) {
    state.newElement.textMessage = el.value
    checkTextElementStatus(state)
}

function checkTextElementStatus(state) {
    var element_changed = state.isElementTextChanged();
    if (element_changed) {
        document.getElementById("edit-text-element-button").disabled = false;
    } else if (!element_changed) {
        document.getElementById("edit-text-element-button").disabled = true;
    }

    var element_complete = el.isCompleted();
    if (element_complete) {
        document.getElementById("create-text-element-button").disabled = false;
    } else if (!element_complete) {
        document.getElementById("create-text-element-button").disabled = true;
    } 
}
// Selecting and Editing images
function handleImageNameChange(el, state) {
    state.newElement.image.fileName = el.value;
}

function handleSelectImage(state, event, img) {
    console.log("IMAGE SELECTED");
    console.log(img);
    
    var name_field = document.getElementById("selected-image-name")
    var create_button = document.getElementById("create-element-button")

    if (state.selectedImage === img) {
        create_button.disabled = true;
        state.selectedImage = null;
        var img_body = document.getElementById("selected-image");
        img_body.remove();
        event.target.style.border = "";
        name_field.value = "";
        id_field.value = ";"
        return;
    }

    else if (state.selectedImage) {
        var img_body = document.getElementById("selected-image");
        img_body.remove();
        state.selectedImage.style.border = "";

    }
    state.newElement.imgSrc = img.url;
    state.newElement.fileName = img.fileName;

    create_button.disabled = false;
    name_field.value = img.fileName;
    state.selectedImage = img;
    var img = event.target.cloneNode(true);
    img.setAttribute("id", "selected-image")

    var img_body = document.getElementById("selected-image-body");
    img_body.appendChild(img);
    event.target.style.border = "3px solid red";  
    
}

function checkImageElementStatus(state) {
    
}


/// Upload Image
function handleUploadButton() {
    document.getElementById("upload-file").click()
}

function handleUploadImage(el) {
    console.log(el.files);
    var reader = new FileReader();
    var image_holder = document.getElementById("uploaded-images");
    var img_file = el.files[0];

    reader.addEventListener("load", async function () {
        console.log(reader.result.split(',')[1])
        var image = new Image(img_file.name, reader.result.split(',')[1])
        await uploadImage(image)

        var img = document.createElement('img')
        img.addEventListener("click", () => { handleSelectImage(img)});
        img.setAttribute("class", "img-fluid optional-image");
        img.src = reader.result;
        image_holder.appendChild(img);

        
      }, false);
    reader.readAsDataURL(img_file);
    
}

function handleElementFieldChange(event, state) {
    console.log("new element")
    console.log(state.newElement)

    // Set element to either Text or Image
    if (document.getElementById("text-option").checked){
        if (state.newElement.elementType != "text") {
            state.newElement.elementType = "text";
        }
        
    } else if (document.getElementById("image-option").checked) {
        if (state.newElement.elementType != "image") {
            state.newElement.elementType = "image";
        }
    }
    
    // set other element attributes
    state.newElement.pageType = state.currentPage.id
    if (event.target.id === "selected-text-message-field") {
        state.newElement.textMessage = event.target.value;

    } else if (event.target.id === "font-style-select") {
        state.newElement.fontStyle = event.target.value;
        
    } else if (event.target.id === "font-size-select") {
        state.newElement.fontSize = event.target.value;
        
    } else if (event.target.id === "selected-image-name") {
        state.newElement.fileName = event.target.value;
        
    }
    var elementComplete = state.newElement.isCompleted();
    if (elementComplete){
        document.getElementById("edit-element-button").disabled = false;
        document.getElementById("create-element-button").disabled = false;
    } else if (!elementComplete) {
        document.getElementById("edit-element-button").disabled = true;
    }
    
}


function handleShowCard(state) {
    
}
