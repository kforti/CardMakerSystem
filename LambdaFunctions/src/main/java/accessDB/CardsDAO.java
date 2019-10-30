package accessDB;

import java.sql.Date;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Statement;
import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;
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
    
    //public boolean addCard(Card card) throws Exception
    {
    	
    }
    
    //public List<Card> getAllCards() throws Exception
    {

    }
    
    //public boolean deleteCard(int cardID) throws Exception
    {

    }
}
