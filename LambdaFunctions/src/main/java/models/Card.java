package models;

import java.util.ArrayList;

public class Card {
	int cardId;
	String eventType;
	String recipient;
	String orientation;
	ArrayList<Element> elements;
	
	///////////////////////////////////////////////////////////////////////////////////////
	// Constructors //
	
	//Constructor for card only
	public Card(int cardId, String eventType, String recipient, String orientation) {
		this.cardId = cardId;
		this.eventType = eventType;
		this.recipient = recipient;
		this.orientation = orientation;
	}
	
	//Constructor for creating new card only
	public Card(String eventType, String recipient, String orientation) {
		this.eventType = eventType;
		this.recipient = recipient;
		this.orientation = orientation;
	}
	
	//Constructor for creating card with elements of that card
	public Card(int cardId, String eventType, String recipient, String orientation, ArrayList<Element> elements) {
		this.cardId = cardId;
		this.eventType = eventType;
		this.recipient = recipient;
		this.orientation = orientation;
		this.elements = elements;
	}
	
    //Constructor for delete card
    public void Card(int cardId) {
		this.cardId = cardId;
    }
		
	
	///////////////////////////////////////////////////////////////////////////////////////
	// Getters //
	
	public int getCardID() {
		return cardId;
	}
	
	public String getEventType() {
		return eventType;
	}
	
	public String getRecipient() {
		return recipient;
	}
	
	public String getOrientation() {
		return orientation;
	}

	public ArrayList<Element> getElements() {
		return elements;
	}
	
	
	///////////////////////////////////////////////////////////////////////////////////////
	// Setters //
	
	public void setCardID(int id) {
		cardId = id;
	}

	public void setEventType(String eventType) {
		this.eventType = eventType;
	}

	public void setRecipient(String recipient) {
		this.recipient = recipient;
	}

	public void setOrientation(String orientation) {
		this.orientation = orientation;
	}

	public void setElements(ArrayList<Element> elements) {
		this.elements = elements;
	}
	
	///////////////////////////////////////////////////////////////////////////////////////
	//EXTRA STUFF WE MAY NOT USE
	
	public String toGson() {
		return "nah";
	}
}
