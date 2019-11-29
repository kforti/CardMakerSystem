package handlers;

import accessDB.CardsDAO;
import accessDB.ElementDAO;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestStreamHandler;
import com.google.gson.Gson;

import models.Card;
import models.Element;

import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

import java.io.*;
import java.util.List;

/**
 * Handler for requests to Lambda function.
 */
public class DuplicateCardHandler implements RequestStreamHandler {

	@Override
	public void handleRequest(InputStream inputStream, OutputStream outputStream, Context context) throws IOException {
		
		//Setup the response json for output
		JSONObject responseJson = new JSONObject();

		JSONObject headerJson = new JSONObject();
		headerJson.put("Content-Type",  "application/json");  
		headerJson.put("Access-Control-Allow-Methods", "POST,DELETE,OPTIONS");
		headerJson.put("Access-Control-Allow-Origin",  "*");
		responseJson.put("headers", headerJson);

		//Initialize local variables
		JSONParser parser = new JSONParser();
		BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream));
        String error = "";
        boolean err = false;
		int status;
		CardsDAO cardDao = new CardsDAO();
        ElementDAO elementDao = new ElementDAO();
		Card cardGiven;
		Card card;
		Element element;
		List<Element> elementsList;
		int newCardID;
		int newElementID;
		int listSize;

		try {
			//Parse input body
			JSONObject event = (JSONObject) parser.parse(reader);
			cardGiven = new Gson().fromJson(event.get("body").toString(), Card.class);
			
			//Get the card by given card ID from database and update the recipient to new recipient for that retrieved card
			card = cardDao.getCard(cardGiven.getCardID());
			card.setRecipient(cardGiven.getRecipient());
			
			//add the updated card as a new card to database and update the cardID to the new generated ID
			newCardID = cardDao.addCard(card);
			card.setCardID(newCardID);
			
			//get list of the elements from database and its size for the card
			elementsList = elementDao.getElements(cardGiven.getCardID());
			listSize = elementsList.size();
			
			//Duplicate each element in the card one at a time
			for(int i=0; i<listSize; i++) {
				//Get the element from card's element list
				element = elementsList.get(i);
				
				//update the card id for the element to new (duplicated) card id
				element.setCard_id(newCardID);
				
				//add the updated element to the database as new element
				newElementID = elementDao.addElement(element);
				
				//update the id for the element to the new generated element ID and replace element with updated one in list
				element.setElement_id(newElementID);
				elementsList.set(i, element);
			}
			
			//add updated list of elements in card to the duplicated card
			card.setElements(elementsList);
			
			//Successful execution and return the duplicated card
			status = 200;

		} catch (ParseException pe) {
			card = null;
        	err = true;
        	error = pe.toString();
			status = 500;
		} catch (Exception e) {
			card = null;
        	err = true;
        	error = e.toString();
        	System.out.println(error);
			status = 501;
		}

        //Produce output response
        if(err) {
        	responseJson.put("body", new Gson().toJson(error));
        }
        else {
        	responseJson.put("body", new Gson().toJson(card));
        }
        responseJson.put("statusCode", status);
        OutputStreamWriter writer = new OutputStreamWriter(outputStream, "UTF-8");
        writer.write(responseJson.toJSONString());
        writer.close();
	}
}
