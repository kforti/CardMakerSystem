
function Card(id, event, recipient, orientation) {
    this.cardId = id;
    this.eventType = event;
    this.recipient = recipient;
    this.orientation = orientation;

    this.selected = false;
    this.toJSON = () => {
        return JSON.stringify(
            {
                "cardId": parseInt(this.cardId),
                "recipient": this.recipient,
                "eventType": this.eventType,
                "orientation": this.orientation
        }
        )
    };
    this.fromJSON = (json) => {
        this.cardId = json.cardId;
        this.recipient = json.recipient;
        this.eventType = json.eventType;
        this.orientation = json.orientation;
        return this;
    }
}

function Element (element_id, card_id, page_type, element_type, text_message, 
                 text_font, img_src, x_coord, y_coord, height, width) {
    if (text_font) {
        var ss = text_font.split(" ")
        this.fontStyle = ss[1]
        this.fontSize = ss[0]
    }
    this.elementId = element_id;
    this.cardId = card_id;
    this.pageType = page_type;
    this.elementType = element_type;
    this.textMessage = text_message;
    this.textFont =  text_font;
    this.imgSrc = img_src || null;
    this.xCoord = x_coord;
    this.yCoord = y_coord;
    this.height =  height;
    this.width = width;
    
    this.fontStyle;
    this.fontSize;
    this.fontSizeOptions = ["20px", "30px", "40px"]
    this.fontStyleOptions = ["serif", "times", "Arial"]
    this.selected = false;

    this.setTextFont = () => {
        this.textFont = this.fontSize + " " + this.fontStyle;
    }

    this.setWidthHeight = () => {
        var base_width;
        var base_height;

        if (this.fontSize === "20px"){
            base_width = 10;
            base_height = 10;
        }
        else if (this.fontSize === "30px"){
            mult_factor = 3;
            base_width = 50;
            base_height = 40;
        }
        else if (this.fontSize === "40px"){
            mult_factor = 3;
            base_width = 70;
            base_height = 40;
        }
        this.width = this.textMessage.length * base_width;
        this.height = base_height;
    }

    this.inBoundary = (x_pos, y_pos) => {
        if ((x_pos >= this.xCoord && x_pos <= (this.xCoord + this.width) ) && ( y_pos <= this.yCoord && y_pos >= (this.yCoord - this.height) )) {
            return true;
        } else {
            return false;
        }
    }

    this.isCompleted = () => {
        console.log("checking element")
        console.log(this)
        var dims = false;
        var attrs = false;
        if (this.elementType === "text") {
            dims = this.checkDimensions()
            attrs = this.checkTextAttributes()

        } else if (this.elementType === "image") {
            dims = this.checkDimensions()
            attrs = this.checkImageAttributes()
        } 
        console.log(this)
        console.log(dims)
        console.log(attrs)
        if (dims && attrs) {
            return true
        } 
        return false
    }

    this.checkDimensions = () => {
        if (!this.xCoord && !this.yCoord) {return false}
        if ( (this.xCoord && this.yCoord) && (!this.width && !this.height) ){
            this.setWidthHeight();
        }
        if (this.width && this.height) { return true}
    }

    this.checkImageAttributes = () => {
        if (this.elementType != "image" || !this.pageType || !this.imgSrc){
            return false;
        } else {return true}
    }

    this.checkTextAttributes = () => {
        if (this.fontSize && this.fontStyle && !this.textFont) {
            this.setTextFont();
        } else if (!this.fontSize && !this.fontStyle) {return false}
        if (this.elementType != "text" || !this.pageType || !this.textMessage || this.textMessage === ""){
            return false;
        } else {return true}
    }

    this.getImageHTML = () => {
        if (this.elementType != "image"){
            return null;
        }
        var img = new Image(this.fileName, "", this.imgSrc)
        return img.toHTML()

    }

    this.toJSON = () => {
        return JSON.stringify({ 
            "cardId": this.cardId,
            "elementId": this.elementId,
            "pageType": this.pageType,
            "elementType": this.elementType,
            "textMessage": this.textMessage,
            "textFont": this.textFont,
            "imgSrc": this.imgSrc,
            "xCoord": this.xCoord,
            "yCoord": this.yCoord,
            "height": this.height,
            "width": this.width } )
    }
}

function Page(id) {
    this.id = id;
    this.elements = [];
    this.addElement = (el) => {this.elements.push(el)}
    this.updateElement = (element) => {
        for (var i = 0; i < this.elements.length; i++) {
            if (this.elements[i].elementId === element.elementId) {
                this.elements[i] = element;
                return;
            }
        }
    }
}

function Image(file_name, encoding, url) {
    this.fileName = file_name;
    this.encoding = encoding;
    this.url = url;

    this.toJSON = () => {
        return JSON.stringify({
            "fileName": this.fileName,
            "base64EncodedImage": this.encoding
        })
    }

    this.toHTML = () => {
        var img_element = document.createElement("img");
        img_element.src = this.url;
        img_element.alt = this.fileName;
        img_element.className = "img-fluid optional-image";
        return img_element;
    }


}
