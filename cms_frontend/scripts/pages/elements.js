// const BASE_PAGES_URL = "http://127.0.0.1:5500";
// On page load
var STATE = fetchState()

if (location.href == BASE_PAGES_URL + "/show-card.html"){
   
} else {
    var STATE = loadCardEditor(STATE);
}


function fetchState() {
    var STATE = new State();
    var state = JSON.parse(localStorage.getItem('state'));
    
    var card = new Card()
    state.currentCard = card.fromJSON(JSON.parse(state.currentCard))
    
    STATE.fromJSON(state)
    console.log(STATE)
    return STATE;
    
}

async function loadCardEditor(state) {
    setCanvas(state);
    state = await loadCard(state)

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
    document.getElementById("page-id-field").innerText = "Front Page"

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
            console.log("MOUSE DOWN")
            console.log(element)
            if (element && element.elementType === "text") {
                stageTextElement(state, element);
                //console.log("element")
            } else if (element && element.elementType === "image") {
                console.log("IMAGE")
                stageImageElement(state, element);

            }else{console.log("NO Element")}
            }
        catch (Exception) {
            
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
    state.newElement.elementType = "text"
    state.newElement.pageType = state.currentPage.id;
    state.newElement.cardId = state.currentCard.cardId;

    // Add Event listener to text edit fields and edit, create and delete buttons
    document.getElementById("edit-text-element-button").addEventListener("click", () => {handleEditTextElement(state)})
    document.getElementById("create-text-element-button").addEventListener("click", (event) => {handleCreateElement(state)})
    document.getElementById("delete-text-element-button").addEventListener("click", (event) => {handleDeleteElement(state)})

    var text_field = document.getElementById("selected-text-message-field")
    text_field.addEventListener("change", (event) => {handleTextMessageChange(state, event)})

    var font_style = document.getElementById("font-style-select")
    font_style.addEventListener("change", (event) => {handleFontStyleChange(state, event)})

    var font_size = document.getElementById("font-size-select")
    font_size.addEventListener("change", (event) => {handleFontSizeChange(state, event)})

    // Add Event listener to image edit fields and edit, create and delete buttons
    document.getElementById("edit-image-element-button").addEventListener("click", (event) => {handleEditImageElement(state, event)})
    document.getElementById("create-image-element-button").addEventListener("click", (event) => {handleCreateElement(state, event)})
    document.getElementById("delete-image-element-button").addEventListener("click", (event) => {handleDeleteElement(state, event)})
    
    var name_field = document.getElementById("selected-image-name")
    name_field.addEventListener("change", (event) => {handleImageNameChange(state, event)})
    document.getElementById("selected-image-width").addEventListener("change", (event) => {handleImageWidthChange(state, event)})
    document.getElementById("selected-image-height").addEventListener("change", (event) => {handleImageHeightChange(state, event)})

    var images = await getImages()

    var img_holder = document.getElementById("uploaded-images")
    for (img of images) {
        var img_element = img.toHTML();
        img_element.addEventListener("click", (event) => {handleSelectImage(state, event)})
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
    element.xCoord = Math.round(cursor_pos.x_pos);
    element.yCoord = Math.round(cursor_pos.y_pos);
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
    handleTextOption(state)
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
    handleImageOption(state)
    
    document.getElementById("create-image-element-button").disabled = false;
    document.getElementById("delete-image-element-button").disabled = false;
    state.currentElement = el;
    state.newElement = el;
    
    var id_field = document.getElementById("selected-element-id-field")
    var name_field = document.getElementById("selected-image-name-field")
    var height_field = document.getElementById("selected-image-height")
    var width_field = document.getElementById("selected-image-width")
    id_field.value = el.elementId;
    //name_field.value = el.fileName;
    height_field.value = el.height;
    width_field.value = el.width;
    console.log("HERE")
    console.log(width_field)
}

function renderElements(elements) {
    console.log("ELEMENTS")
    console.log(elements)
    var c = document.getElementById("canvas");
    var ctx = c.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (var element of elements) {
        //console.log(element)
        if (element.elementType == "text") {
            console.log("drawing element")
            ctx.font = element.textFont;
            ctx.fillText(element.textMessage, element.xCoord, element.yCoord);
        }
        if (element.elementType == "image") {
            var imgHTML = element.getImageHTML();
            //console.log(imgHTML)
            imgHTML.element_x = element.xCoord
            imgHTML.element_y = element.yCoord
            imgHTML.onload = (event) => {renderElements(elements)}//ctx.drawImage(event.currentTarget, event.currentTarget.element_x, event.currentTarget.element_y);}
            ctx.drawImage(imgHTML, element.xCoord, element.yCoord, element.width, element.height)
        }
        
    }
}

function clearTextStage(state){
    document.getElementById("selected-element-id-field").value = "";
    document.getElementById("selected-text-message-field").value = "";
    document.getElementById("font-style-select").value = "";;
    document.getElementById("font-size-select").value = "";
    var newElement = new Element()
    state.newElement.xCoord = 200;
    state.newElement.yCoord = 200;
    state.newElement.elementType = "text"
    state.newElement.pageType = state.currentPage.id;
    state.newElement.cardId = state.currentCard.cardId;
    return state;
}

function clearImageStage(state){
    document.getElementById("selected-element-id-field").value = "";
    document.getElementById("selected-image-name").value = "";
    document.getElementById("selected-image-height").value = "";
    document.getElementById("selected-image-width").value = "";
    var newElement = new Element()
    state.newElement.xCoord = 200;
    state.newElement.yCoord = 200;
    state.newElement.elementType = "image"
    state.newElement.pageType = state.currentPage.id;
    state.newElement.cardId = state.currentCard.cardId;
    return state;
}

///////////////////////
/// Handlers
////////////

// creates an element and re-renders the page
async function handleCreateElement(state) {
    var page_id = document.getElementById('page-id-field').innerText;
    if (page_id == "Front Page") {
        state.newElement.pageType = "0";
    }
    else if (page_id == "Inner Left Page") {
        state.newElement.pageType = "1";
    }
    else if (page_id == "Inner Right Page") {
        state.newElement.pageType = "2";
    }
    else if (page_id == "Back Page") {
        state.newElement.pageType = "3";
    }
    
    element = await createElement(state.newElement)
    if (element) {
        state.currentPage.addElement(element)
    }
    renderElements(state.currentPage.elements)
    console.log(state.currentPage.elements)
    if (state.currentElement.elementType === "text"){
        state = clearTextStage(state);
    } else if (state.currentElement.elementType === "image"){
        state = clearImageStage(state);
    }
    return state;
}

function handleEditTextElement(state) {
    updateElement(state.newElement)
  
}

function handleEditImageElement(state) {
    updateElement(state.newElement)

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

function handleFontStyleChange(state, event) {
    for (el of document.getElementById("font-style-select").children) {
        if (el.selected) {
            state.newElement.fontStyle = el.value
            break
        }
    }
    
    console.log(state);
    checkTextElementStatus(state)
}

function handleFontSizeChange(state, event) {
    console.log(event)
    state.newElement.fontSize = event.target.value;
    checkTextElementStatus(state)
}

function handleTextMessageChange(state, event) {
    console.log(state)
    state.newElement.textMessage = document.getElementById("selected-text-message-field").value;
    checkTextElementStatus(state)
}

function checkTextElementStatus(state) {
    var element_changed = state.isTextElementChanged();
    if (element_changed) {
        document.getElementById("edit-text-element-button").disabled = false;
    } else if (!element_changed) {
        document.getElementById("edit-text-element-button").disabled = true;
    }

    var element_complete = state.newElement.isCompleted();
    if (element_complete) {
        document.getElementById("create-text-element-button").disabled = false;
    } else if (!element_complete) {
        document.getElementById("create-text-element-button").disabled = true;
    } 
}
// Selecting and Editing images
function handleImageNameChange(state, event) {
    console.log("FILENAMECHANGE")
    state.newElement.image.fileName = event.target.value;
    checkImageElementStatus(state)
}

function handleImageHeightChange(state, event) {
    state.newElement.height = event.target.value;
    checkImageElementStatus(state)
}

function handleImageWidthChange(state, event) {
    state.newElement.width = event.target.value;
    checkImageElementStatus(state)
}

function handleSelectImage(state, event) {
    console.log("IMAGE SELECTED");
    var img = event.target;
    
    var name_field = document.getElementById("selected-image-name")
    var width_field = document.getElementById("selected-image-width")
    var height_field = document.getElementById("selected-image-height")

    if (state.selectedImage === img) {
        state.selectedImage = null;
        var img_body = document.getElementById("selected-image");
        img_body.remove();
        event.target.style.border = "";
        name_field.value = "";
        id_field.value = ";"
        checkImageElementStatus(state)
        return;
    }

    else if (state.selectedImage) {
        var img_body = document.getElementById("selected-image");
        img_body.remove();
        state.selectedImage.style.border = "";

    }
    state.newElement.imgSrc = img.src;
    state.newElement.image = img;
    state.newElement.width = img.width;
    state.newElement.height = img.height;
    checkImageElementStatus(state)
    
    name_field.value = img.alt;
    width_field.value =state.newElement.width;
    height_field.value = state.newElement.height;

    state.selectedImage = img;
    var img = event.target.cloneNode(true);
    img.setAttribute("id", "selected-image")

    var img_body = document.getElementById("selected-image-body");
    img_body.appendChild(img);
    event.target.style.border = "3px solid red";  
    
}

function checkImageElementStatus(state) {
    var create_button = document.getElementById("create-image-element-button")
    var edit_button = document.getElementById("edit-image-element-button")
    console.log(state)
    var element_changed = state.isImageElementChanged();
    if (element_changed) {
        edit_button.disabled = false;
    } else if (!element_changed) {
        edit_button.disabled = true;
    }

    var element_complete = state.newElement.isCompleted();
    if (element_complete) {
        create_button.disabled = false;
    } else if (!element_complete) {
        create_button.disabled = true;
    } 
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

function handleDeleteElement(state) {
    deleteElement(state.currentElement)
}

function handleShowCard() {
    location.href = BASE_PAGES_URL + "/show-card.html";
}
