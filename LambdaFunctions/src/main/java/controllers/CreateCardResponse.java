package controllers;

class CreateCardResponse {
	String message;
	int httpCode;
	
	public CreateCardResponse (String message, int code) {
		this.message = message;
		this.httpCode = code;
	}
	
	// 200 means success
	public CreateCardResponse (String message) {
		this.message = message;
		this.httpCode = 200;
	}
}
