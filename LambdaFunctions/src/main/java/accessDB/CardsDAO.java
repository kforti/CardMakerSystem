package accessDB;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

import models.Card;

public class CardsDAO
{

	java.sql.Connection connection;

    public CardsDAO() {
    	try
    	{
    		connection = DatabaseConnect.connect();
    	} catch (Exception e) {
    		connection = null;
    	}
    }
    
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
    public boolean addCard(Card card) throws Exception
    {
    	try {
	    	PreparedStatement ps = connection.prepareStatement("INSERT INTO cards (event_type, recipient, orientation)"
					+ " values(?,?,?);");
	    	ps.setString(1,  card.getEventType());
	    	ps.setString(2,  card.getRecipient());
			ps.setString(3, card.getOrientation());
			ps.execute();
			ps.close();
			
			return true;
			
	    } catch (Exception e){
			throw new Exception("Failed to insert card: " + e.getMessage());
		}
    }
    
    public boolean deleteCard(int cardID) throws Exception
    {
    	try {
	    	PreparedStatement ps = connection.prepareStatement("DELETE FROM cards WHERE card_id = ?;");
	    	ps.setInt(1, cardID);
	    	// Returns num rows changed (deleted, in this case)
	    	int numAffected = ps.executeUpdate();
	        ps.close();
        
	        // Should only delete one single Schedule, so if numAffected isn't 1, there was a problem
	        return (numAffected == 1);
	
	    } catch (Exception e) {
	        throw new Exception("Failed to delete card: " + e.getMessage());
	    }
    }
    
    public List<Card> getAllCards() throws Exception
    {
    	List<Card> cards = new ArrayList<>();
    	 try{
    		 Statement statement = connection.createStatement();
             String query = "SELECT * FROM cards";
             ResultSet resultSet = statement.executeQuery(query);
             
             while (resultSet.next())
             {
                 Card card = generateCard(resultSet);
                 cards.add(card);
             }
           
             resultSet.close();
             statement.close();
             return cards;
             
         } catch (Exception e){
             throw new Exception("Failed in getting Schedules: " + e.getMessage());
         }
    }
    
    
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
	private Card generateCard(ResultSet resultSet) throws Exception{
		int cardID = resultSet.getInt("card_id");
		String eventType = resultSet.getString("event_type");
		String recipient = resultSet.getString("recipient");
		String orientation = resultSet.getString("orientation");
		
		return new Card(cardID, eventType, recipient, orientation);
	}
}