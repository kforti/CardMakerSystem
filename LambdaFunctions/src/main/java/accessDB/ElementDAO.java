package accessDB;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Statement;

import models.Element;

public class ElementDAO
{

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
    
//    public boolean deleteCard(int cardID) throws Exception
//    {
//    	try {
//	    	PreparedStatement ps = connection.prepareStatement("DELETE FROM cards WHERE card_id = ?;");
//	    	ps.setInt(1, cardID);
//	    	// Returns num rows changed (deleted, in this case)
//	    	int numAffected = ps.executeUpdate();
//	        ps.close();
//        
//	        // Should only delete one single Schedule, so if numAffected isn't 1, there was a problem
//	        return (numAffected == 1);
//	
//	    } catch (Exception e) {
//	        throw new Exception("Failed to delete card: " + e.getMessage());
//	    }
//    }
    
//    public List<Card> getAllCards() throws Exception
//    {
//    	List<Card> cards = new ArrayList<>();
//		Statement statement;
//		ResultSet resultSet;
//    	 try{
//    		 statement = connection.createStatement();
//		 } catch (Exception e){
//			 throw new Exception("Failed in connecting to DB: " + e.getMessage());
//		 }
//    	 try{
//             String query = "SELECT * FROM cards";
//             resultSet = statement.executeQuery(query);
//		 } catch (Exception e){
//			 throw new Exception("Failed in Cards query: " + e.getMessage());
//		 }
//             
//		 while (resultSet.next())
//		 {
//			 Card card = generateCard(resultSet);
//			 cards.add(card);
//		 }
//
//		 resultSet.close();
//		 statement.close();
//		 return cards;
//             
//
//    }
//    
//    
//    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//    
//	private Card generateCard(ResultSet resultSet) throws Exception{
//		int cardID = resultSet.getInt("card_id");
//		String eventType = resultSet.getString("event_type");
//		String recipient = resultSet.getString("recipient");
//		String orientation = resultSet.getString("orientation");
//		
//		return new Card(cardID, eventType, recipient, orientation);
//	}
}
