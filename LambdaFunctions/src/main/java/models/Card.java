package models;

import java.util.HashMap;

public class Card {
	int cardId;
	String eventType;
	String recipient;
	String orientation;
	
	public Card(int cardId, String eventType, String recipient, String orientation) {
		this.cardId = cardId;
		this.eventType = eventType;
		this.recipient = recipient;
		this.orientation = orientation;
	}
	
	public Card(String eventType, String recipient, String orientation) {
		this.eventType = eventType;
		this.recipient = recipient;
		this.orientation = orientation;
	}
	
	public String toGson() {
		return "nah";
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
	///////////////////////////////////////////////////////////////////////////////////////

	// Setters //
	public void setCardID(int id) {
		cardId = id;
	}

	///////////////////////////////////////////////////////////////////////////////////////
	
}
