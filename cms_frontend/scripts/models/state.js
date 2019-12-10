function State() {
    this.currentPage = null;
    this.currentCard = false;
    this.currentElement = false;
    this.createCardState = {
        recipient: "",
        eventType: ""
    }
    this.newElement = null;

    this.page0;
    this.page1;
    this.page2;
    this.page3;

    this.mouseDownDone = true;
    this.selectedImage = null;

    this.isTextElementChanged = () => {
        var fontSize = (this.newElement.fontSize === this.currentElement.fontSize);
        var fontStyle = (this.newElement.fontStyle === this.currentElement.fontStyle);
        var textMessage = (this.newElement.textMessage === this.currentElement.textMessage);

        if (fontSize && fontStyle && textMessage) {return true;} else {return false;}
    }

    this.isImageElementChanged = () => {
        try {
            var fileName = (this.newElement.image.fileName === this.currentElement.image.fileName);
            var imgSrc = (this.newElement.imgSrc === this.currentElement.imgSrc);
            var width = (this.newElement.width === this.currentElement.width);
            var height = (this.newElement.height === this.currentElement.height);
        } catch(exception) {
            return false;
        }

        if (fileName && imgSrc && width && height) {return true;} else {return false;}
        
    }

    this.fromJSON = (json) => {
        this.currentPage = json.currentPage;
        this.currentCard = json.currentCard;
        this.currentElement = json.currentElement;
        this.newElement = json.newElement;

    }

}
