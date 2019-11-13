package accessDB;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Statement;

import models.Element;

public class ElementDAO
{
	
	//Create connection to database to execute queries 
	java.sql.Connection connection;

    public ElementDAO() {
    	try
    	{
    		connection = DatabaseConnect.connect();
    	} catch (Exception e) {
    		connection = null;
    	}
    }
    
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////Query Functions:
    
    public int addElement(Element element) throws Exception
    {
    	int element_id = 0;
    	try {
	    	PreparedStatement ps = connection.prepareStatement("INSERT INTO elements (card_id, page_type, element_type, text_message, text_font, img_src, x_coord, y_coord, height, width)"
					+ " values(?,?,?,?,?,?,?,?,?,?);", Statement.RETURN_GENERATED_KEYS);
	    	ps.setInt(1, element.getCard_id());
	    	ps.setString(2, element.getPage_type());
			ps.setString(3, element.getElement_type());
	    	ps.setString(4, element.getText_message());
	    	ps.setString(5, element.getText_font());
			ps.setString(6, element.getImg_src());
	    	ps.setInt(7, element.getX_coord());
	    	ps.setInt(8, element.getY_coord());
			ps.setInt(9, element.getHeight());
			ps.setInt(10, element.getWidth());
			ps.executeUpdate();
			ResultSet rs = ps.getGeneratedKeys();
			if (rs.next()) {
				element_id = rs.getInt(1);
			}
			ps.close();

			return element_id;
			
	    } catch (Exception e){
			throw new Exception("Failed to insert element: " + e.getMessage());
		}
    }
    
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////Query Result Processors
    
    
}
