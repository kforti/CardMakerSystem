package models;

public class Element {
    int elementId;
    int cardId;
    String pageType;
    String elementType;
    String textMessage;
    String textFont;
    String imgSrc;
    int xCoord;
    int yCoord;
    int height;
    int width;

    
	///////////////////////////////////////////////////////////////////////////////////////
	// Constructors //
    
    //Constructor for delete element and get element by id
    public Element(int elementId) {
		this.elementId = elementId;
    }
    
    //Constructor for create new element only
    public Element(int cardId, String pageType, String elementType, String textMessage,
            String textFont, String imgSrc, int xCoord, int yCoord, int height, int width) {
		this.cardId = cardId;
		this.pageType = pageType;
		this.elementType = elementType;
		this.textMessage = textMessage;
		this.textFont = textFont;
		this.imgSrc = imgSrc;
		this.xCoord = xCoord;
		this.yCoord = yCoord;
		this.height = height;
		this.width = width;
	}

	//Constructor for general element
    public Element(int elementId, int cardId, String pageType, String elementType, String textMessage,
                        String textFont, String imgSrc, int xCoord, int yCoord, int height, int width) {
        this.elementId = elementId;
        this.cardId = cardId;
        this.pageType = pageType;
        this.elementType = elementType;
        this.textMessage = textMessage;
        this.textFont = textFont;
        this.imgSrc = imgSrc;
        this.xCoord = xCoord;
        this.yCoord = yCoord;
        this.height = height;
        this.width = width;
    }
    
    
	///////////////////////////////////////////////////////////////////////////////////////
	// Getters //
    
	public int getElementId() {
		return elementId;
	}
	
	public int getCardId() {
		return cardId;
	}

	public String getPageType() {
		return pageType;
	}

	public String getElementType() {
		return elementType;
	}

	public String getTextMessage() {
		return textMessage;
	}

	public String getTextFont() {
		return textFont;
	}

	public String getImgSrc() {
		return imgSrc;
	}

	public int getxCoord() {
		return xCoord;
	}

	public int getyCoord() {
		return yCoord;
	}

	public int getHeight() {
		return height;
	}

	public int getWidth() {
		return width;
	}
	
	
	///////////////////////////////////////////////////////////////////////////////////////
	// Setters //
	
    public void setElementId(int elementId) {
		this.elementId = elementId;
	}

	public void setCardId(int cardId) {
		this.cardId = cardId;
	}

	public void setPageType(String pageType) {
		this.pageType = pageType;
	}

	public void setElementType(String elementType) {
		this.elementType = elementType;
	}

	public void setTextMessage(String textMessage) {
		this.textMessage = textMessage;
	}

	public void setTextFont(String textFont) {
		this.textFont = textFont;
	}

	public void setImgSrc(String imgSrc) {
		this.imgSrc = imgSrc;
	}

	public void setxCoord(int xCoord) {
		this.xCoord = xCoord;
	}

	public void setyCoord(int yCoord) {
		this.yCoord = yCoord;
	}

	public void setHeight(int height) {
		this.height = height;
	}

	public void setWidth(int width) {
		this.width = width;
	}
}
