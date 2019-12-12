
async function loadShowCard() {
    
}

async function handleCardDisplay(id) {
    console.log(this)
    var state = fetchState()
    var card = state.currentCard
    card.cardId = id.value
    console.log(card)
    if (state.currentCard.orientation.toLowerCase() === "portrait") {
        canvas.width = 600;
        canvas.heigth = 900;
    } else if (state.currentCard.orientation.toLowerCase() === "landscape") {
        canvas.width = 900;
        canvas.height = 600;
    }
    setPageNav(state);
    loadCard(state)
    // card = await getCard(card)
    // renderElements(card.elements)
}