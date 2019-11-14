package accessDB;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

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
    	//initialize local variables
    	int element_id = 0;
    	
    	try {
        	//Try connection + set up query and execute it
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
			
			//Parse the result set
			if (rs.next()) {
				element_id = rs.getInt(1);
			}
			
			//Close the query/connection and return result
			ps.close();
			return element_id;
			
	    } catch (Exception e){
			throw new Exception("Failed to insert element: " + e.getMessage());
		}
    }
    
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
    public boolean updateElement(Element element) throws Exception
    {
    	try {
    		//Try connection + set up query and execute it
	    	PreparedStatement ps = connection.prepareStatement("UPDATE elements SET card_id = ?, page_type = ?, element_type = ?, text_message = ?, text_font = ?, img_src = ?, x_coord = ?, y_coord = ?, height = ?, width = ? "
	    			+ "WHERE element_id = ?;");
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
			ps.setInt(11, element.getElement_id());

        	//Execute the query and get the affected elements
            int numAffected = ps.executeUpdate();
			
			//Close the query/connection and return result
			ps.close();
			return (numAffected == 1);
			
	    } catch (Exception e){
			throw new Exception("Failed to update element: " + e.getMessage());
		}
    }
    
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
    public boolean deleteElement(int elementID) throws Exception
    {    	
    	try {
    		//Set up query and execute it
	    	PreparedStatement ps = connection.prepareStatement("DELETE FROM elements WHERE element_id = ?;");
	    	ps.setInt(1, elementID);
	    	int numAffected = ps.executeUpdate();
	        ps.close();
        
	        //Should only delete one item this given unique element id
	        return (numAffected == 1);
	
	    } catch (Exception e) {
	        throw new Exception("Failed to delete element: " + e.getMessage());
	    }
    }
    
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
    public boolean deleteElementsInCard(int cardID) throws Exception
    {
    	try {
        	//Set up query and execute it
	    	PreparedStatement ps = connection.prepareStatement("DELETE FROM elements WHERE card_id = ?;");
	    	ps.setInt(1, cardID);
	    	int numAffected = ps.executeUpdate();
	        ps.close();
        
	        //Should 0 or more elements in a given card
	        return (numAffected >= 0);
	
	    } catch (Exception e) {
	        throw new Exception("Failed to delete elements: " + e.getMessage());
	    }
    }
    
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
    public List<Element> getElements(int card_id) throws Exception
    {
    	//initialize local variables
    	List<Element> elements = new ArrayList<Element>();
    	PreparedStatement ps;
    	ResultSet resultSet;
    	
    	//Try connection
    	try{
    		ps = connection.prepareStatement("SELECT * FROM elements WHERE card_id=?;");
    	} catch (Exception e){
    		throw new Exception("Failed in connecting to DB: " + e.getMessage());
    	}
    	
    	//Set up query and execute it
    	try{
    		ps.setInt(1,  card_id);
    		resultSet = ps.executeQuery();
    	} catch (Exception e){
    		throw new Exception("Failed in element query: " + e.getMessage());
    	}
    	
    	//Parse the result set
    	while (resultSet.next())
    	{
    		Element element = generateElement(resultSet);
    		if(element.getCard_id() == card_id) {
    			elements.add(element);
    		}
    	}

    	//Close the query/connection and return result
    	resultSet.close();
    	ps.close();
    	return elements;
    }

    
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////Query Result Processors
    
	private Element generateElement(ResultSet resultSet) throws Exception{
	    int element_id = resultSet.getInt("element_id");
	    int card_id = resultSet.getInt("card_id");
	    String page_type = resultSet.getString("page_type");
	    String element_type = resultSet.getString("element_type");
	    String text_message = resultSet.getString("text_message");
	    String text_font = resultSet.getString("text_font");
	    String img_src = resultSet.getString("img_src");
	    int x_coord = resultSet.getInt("x_coord");
	    int y_coord = resultSet.getInt("y_coord");
	    int height = resultSet.getInt("height");
	    int width = resultSet.getInt("width");
		
		return new Element(element_id, card_id, page_type, element_type, text_message, text_font, img_src, x_coord, y_coord, height, width);
	}
      
}
