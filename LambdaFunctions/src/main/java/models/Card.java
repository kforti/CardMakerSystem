package models;

import java.util.HashMap;

public class Card {
	int cardId;
	String eventType;
	String recipient;
	String orientation;
	HashMap<Integer, Element> elements = new HashMap<Integer, Element>();
	
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
}
