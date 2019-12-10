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
        var yCoord = (this.newElement.yCoord === this.currentElement.yCoord);
        var xCoord = (this.newElement.xCoord === this.currentElement.xCoord);

        if (fontSize && fontStyle && textMessage && yCoord && xCoord) {return true;} else {return false;}
    }

    this.isImageElementChnaged = () => {
        var fileName = ();
        var url = ();
    }

}

function CreateTextElementState() {
    this.font = "",
    this.type = "",
    this.xCoord = "",
    this.yCoord = "",
    this.height = "",
    this.width = "",
    this.text = "",
    this.imageName = ""
}

function CreateTextElementState() {
    this.font = "",
    this.type = "",
    this.xCoord = "",
    this.yCoord = "",
    this.height = "",
    this.width = "",
    this.text = "",
    this.imageName = ""
}