package handlers;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestStreamHandler;
import com.google.gson.Gson;

import models.Card;
import accessDB.CardsDAO;

import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

import java.io.*;

/**
 * Handler for requests to Lambda function.
 */
public class CreateCardHandler implements RequestStreamHandler {

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
		Card card;
		int card_id;

		try {
			//Parse input body
			JSONObject event = (JSONObject) parser.parse(reader);
			card = new Gson().fromJson(event.get("body").toString(), Card.class);

			//modify data from the databases
			card_id = cardDao.addCard(card);

			//update the card with generated id and return it
			card.setCardID(card_id);

			//Successful execution
			status = 200;

        } catch (ParseException pe) {
        	err = true;
        	error = pe.toString();
        	card = null;
            status = 500;
        } catch (Exception e) {
        	err = true;
        	error = e.toString();
        	card = null;
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
