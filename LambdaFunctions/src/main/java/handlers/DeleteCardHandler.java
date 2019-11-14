package handlers;

import accessDB.CardsDAO;
import accessDB.ElementDAO;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestStreamHandler;
import com.google.gson.Gson;

import models.Card;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

import java.io.*;

/**
 * Handler for requests to Lambda function.
 */
public class DeleteCardHandler implements RequestStreamHandler {

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
        ElementDAO elementDao = new ElementDAO();
		CardsDAO cardDao = new CardsDAO();
		Card card;
		boolean card_deleted = false;

		try {
			//Parse input body
			JSONObject event = (JSONObject) parser.parse(reader);
			card = new Gson().fromJson(event.get("body").toString(), Card.class);

			//modify databases by deleting elements in card first then the card itself
			card_deleted = elementDao.deleteElementsInCard(card.getCardID());
			card_deleted = cardDao.deleteCard(card.getCardID());

			//Successful execution
			status = 200;

		} catch (ParseException pe) {
        	err = true;
        	error = pe.toString();
			status = 500;
		} catch (Exception e) {
        	err = true;
        	error = e.toString();
			status = 501;
		}

        //Produce output response
        if(err) {
        	responseJson.put("body", new Gson().toJson(error));
        }
        else {
        	responseJson.put("body", new Gson().toJson(card_deleted));
        }
        responseJson.put("statusCode", status);
        OutputStreamWriter writer = new OutputStreamWriter(outputStream, "UTF-8");
        writer.write(responseJson.toJSONString());
        writer.close();
	}
}
