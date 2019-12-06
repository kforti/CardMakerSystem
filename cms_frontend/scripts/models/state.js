function State() {
    this.pages = {
                "0": new Page("0"),
                "1": new Page("1"),
                "2": new Page("2"),
                "3": new Page("3")}
    this.currentPage = this.pages[this.page];
    this.currentCard = false;
    this.currentElement = false;
    this.createCardState = {
        recipient: "",
        event: ""
    }

    this.page = "0";

    this.selectedImage = null;

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