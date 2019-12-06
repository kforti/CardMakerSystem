
function Card(id, event, recipient, orientation) {
    this.cardId = id;
    this.event = event;
    this.recipient = recipient;
    this.orientation = orientation;

    this.selected = false;
    this.toJSON = () => {
        return JSON.stringify(
            {
                "cardId": parseInt(this.cardId),
                "recipient": this.recipient,
                "eventType": this.event,
                "orientation": this.orientation
        }
        )
    };
}

function Element (element_id, card_id, page_type, element_type, text_message, 
                 text_font, img_src, x_coord, y_coord, height, width) {
    this.elementId = element_id;
    this.cardId = card_id;
    this.pageType = page_type;
    this.elementType = element_type;
    this.textMessage = text_message;
    this.textFont =  text_font;
    this.imgSrc = img_src;
    this.xCoord = x_coord;
    this.yCoord = y_coord;
    this.height =  height;
    this.width = width;

    this.selected = false;

    this.toJSON = () => {
        return JSON.stringify({ 
            "cardId": this.card_id,
            "elementId": this.element_id,
            "pageType": this.page_type,
            "elementType": this.element_type,
            "textMessage": this.text_message,
            "textFont": this.text_font,
            "imgSrc": this.img_src,
            "xCoord": this.x_coord,
            "yCoord": this.y_coord,
            "height": this.height,
            "width": this.width } )
    }
}

function Page(id) {
    this.id = id;
    this.elements = [];
    this.addElement = (el) => {this.elements.push(el)}
}

function Image(file_name, encoding, url) {
    this.fileName = file_name;
    this.encoding = encoding;
    this.url = url;

    this.toJSON = () => {
        JSON.stringify({
            "fileName": this.fileName,
            "encoding": this.encoding,
            "url": this.url
        })
    }

}
