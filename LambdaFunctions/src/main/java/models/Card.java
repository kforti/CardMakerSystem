package models;

import java.util.List;

public class Card {
	int cardId;
	String eventType;
	String recipient;
	String orientation;
	List<Element> elements;
	
	
	///////////////////////////////////////////////////////////////////////////////////////
	// Constructors //
	
    //Constructor for delete card and get card by card ID
    public Card(int cardId) {
		this.cardId = cardId;
    }
    
	//Constructor for creating new card only
	public Card(String eventType, String recipient, String orientation) {
		this.eventType = eventType;
		this.recipient = recipient;
		this.orientation = orientation;
	}
	
	//Constructor for card only
	public Card(int cardId, String eventType, String recipient, String orientation) {
		this.cardId = cardId;
		this.eventType = eventType;
		this.recipient = recipient;
		this.orientation = orientation;
	}
	
	//Constructor for creating card with elements of that card
	public Card(int cardId, String eventType, String recipient, String orientation, List<Element> elements) {
		this.cardId = cardId;
		this.eventType = eventType;
		this.recipient = recipient;
		this.orientation = orientation;
		this.elements = elements;
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

	public List<Element> getElements() {
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

	public void setElements(List<Element> elements) {
		this.elements = elements;
	}
}
