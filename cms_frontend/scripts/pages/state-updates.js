
function createCardState(id, value, state) {
    if (id === "recipient-field") {
        state.createCardState.recipient = value;
    } else if (id === "event-field") {
        state.createCardState.event = value
    }

    if (state.createCardState.recipient !== "" && state.createCardState.event !== "") {
        document.getElementById("create-card-button").disabled = false
    } else if (state.createCardState.recipient === "" || state.createCardState.event === "") {
        document.getElementById("create-card-button").disabled = true
    }

}

function createTextElementState(style) {

}

function createImgElementState(state) {

}