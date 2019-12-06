package models;

public class ImageUpload {
	String fileName;
	String base64EncodedImage;
	
	//Constructors
	ImageUpload(String fileName, String base64EncodedImage){
		this.fileName = fileName;
		this.base64EncodedImage = base64EncodedImage;
	}

	//Getters
	public String getFileName() {
		return fileName;
	}
	
	public String getBase64EncodedImage() {
		return base64EncodedImage;
	}
}
