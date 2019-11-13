package models;

public class Element {
    int element_id;
    int card_id;
    String page_type;
    String element_type;
    String text_message;
    String text_font;
    String img_src;
    int x_coord;
    int y_coord;
    int height;
    int width;

    //Constructor for create element handler
    public void Element(int card_id, String page_type, String element_type, String text_message,
            String text_font, String img_src, int x_coord, int y_coord, int height, int width) {
		this.card_id = card_id;
		this.page_type = page_type;
		this.element_type = element_type;
		this.text_message = text_message;
		this.text_font = text_font;
		this.img_src = img_src;
		this.x_coord = x_coord;
		this.y_coord = y_coord;
		this.height = height;
		this.width = width;
	}
    
    //Constructor for update element handler
    public void Element(int element_id, int card_id, String page_type, String element_type, String text_message,
                        String text_font, String img_src, int x_coord, int y_coord, int height, int width) {
        this.element_id = element_id;
        this.card_id = card_id;
        this.page_type = page_type;
        this.element_type = element_type;
        this.text_message = text_message;
        this.text_font = text_font;
        this.img_src = img_src;
        this.x_coord = x_coord;
        this.y_coord = y_coord;
        this.height = height;
        this.width = width;
    }
    
    
    //Constructor for delete element handler
    public void Element(int element_id) {
		this.element_id = element_id;
    }
    
}
