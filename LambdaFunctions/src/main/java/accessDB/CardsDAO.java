package accessDB;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

import models.Card;

public class CardsDAO
{

	//Create connection to database to execute queries 
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
/////////Query Functions:
    
    public int addCard(Card card) throws Exception
    {
    	int card_id = 0;
    	try {
	    	PreparedStatement ps = connection.prepareStatement("INSERT INTO cards (event_type, recipient, orientation)"
					+ " values(?,?,?);", Statement.RETURN_GENERATED_KEYS);
	    	ps.setString(1,  card.getEventType());
	    	ps.setString(2,  card.getRecipient());
			ps.setString(3, card.getOrientation());
			ps.executeUpdate();
			ResultSet rs = ps.getGeneratedKeys();
			if (rs.next()) {
				card_id = rs.getInt(1);
			}
			ps.close();

			return card_id;
			
	    } catch (Exception e){
			throw new Exception("Failed to insert card: " + e.getMessage());
		}
    }
    
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
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
    
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
    public Card getCard(int card_id) throws Exception
    {
    	//initial local variables
    	Card card = new Card(0);
    	PreparedStatement ps;
    	ResultSet resultSet;
    	
    	//Try connection
    	try{
    		ps = connection.prepareStatement("SELECT * FROM cards WHERE card_id=?;");
    	} catch (Exception e){
    		throw new Exception("Failed in connecting to DB: " + e.getMessage());
    	}
    	
    	//Set up query and execute it
    	try{
    		ps.setInt(1,  card_id);
    		resultSet = ps.executeQuery();
    	} catch (Exception e){
    		throw new Exception("Failed in Cards query: " + e.getMessage());
    	}
    	
    	//Parse the result set
		 while (resultSet.next())
		 {
			 card = generateCard(resultSet);
		 }

    	//Close the query/connection and return result
    	resultSet.close();
    	ps.close();
    	return card;
    }
    
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
    public List<Card> getAllCards() throws Exception
    {
    	List<Card> cards = new ArrayList<>();
		Statement statement;
		ResultSet resultSet;
    	 try{
    		 statement = connection.createStatement();
		 } catch (Exception e){
			 throw new Exception("Failed in connecting to DB: " + e.getMessage());
		 }
    	 try{
             String query = "SELECT * FROM cards";
             resultSet = statement.executeQuery(query);
		 } catch (Exception e){
			 throw new Exception("Failed in Cards query: " + e.getMessage());
		 }
             
		 while (resultSet.next())
		 {
			 Card card = generateCard(resultSet);
			 cards.add(card);
		 }

		 resultSet.close();
		 statement.close();
		 return cards;
    }
    
    
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////Query Result Processors
    
	private Card generateCard(ResultSet resultSet) throws Exception{
		int cardID = resultSet.getInt("card_id");
		String eventType = resultSet.getString("event_type");
		String recipient = resultSet.getString("recipient");
		String orientation = resultSet.getString("orientation");
		
		return new Card(cardID, eventType, recipient, orientation);
	}
}
