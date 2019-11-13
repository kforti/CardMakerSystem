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

	public int getElement_id() {
		return element_id;
	}
    
    
	///////////////////////////////////////////////////////////////////////////////////////
	
	// Getters //
	public int getCard_id() {
		return card_id;
	}

	public String getPage_type() {
		return page_type;
	}

	public String getElement_type() {
		return element_type;
	}

	public String getText_message() {
		return text_message;
	}

	public String getText_font() {
		return text_font;
	}

	public String getImg_src() {
		return img_src;
	}

	public int getX_coord() {
		return x_coord;
	}

	public int getY_coord() {
		return y_coord;
	}

	public int getHeight() {
		return height;
	}

	public int getWidth() {
		return width;
	}
	
	
	///////////////////////////////////////////////////////////////////////////////////////
	
	// Setters //
    public void setElement_id(int element_id) {
		this.element_id = element_id;
	}

	public void setCard_id(int card_id) {
		this.card_id = card_id;
	}

	public void setPage_type(String page_type) {
		this.page_type = page_type;
	}

	public void setElement_type(String element_type) {
		this.element_type = element_type;
	}

	public void setText_message(String text_message) {
		this.text_message = text_message;
	}

	public void setText_font(String text_font) {
		this.text_font = text_font;
	}

	public void setImg_src(String img_src) {
		this.img_src = img_src;
	}

	public void setX_coord(int x_coord) {
		this.x_coord = x_coord;
	}

	public void setY_coord(int y_coord) {
		this.y_coord = y_coord;
	}

	public void setHeight(int height) {
		this.height = height;
	}

	public void setWidth(int width) {
		this.width = width;
	}
}
