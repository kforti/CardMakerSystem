
async function loadShowCard() {
    
}

async function handleCardDisplay(id) {
    console.log(this)
    var card = new Card()
    card.cardId = id.value
    console.log(card)
    card = await getCard(card)
    renderElements(card.elements)
}