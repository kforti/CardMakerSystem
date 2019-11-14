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

public class GetCardHandler implements RequestStreamHandler {

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
        ElementDAO elementDao = new ElementDAO();
        CardsDAO cardDao = new CardsDAO();
        Card card;
        List<Element> elements;
        int status;
        
        try {        	
            //Parse input body
            JSONObject event = (JSONObject) parser.parse(reader);
            card = new Gson().fromJson(event.get("body").toString(), Card.class);

            //get the data from the databases
            card = cardDao.getCard(card.getCardID());
            elements = elementDao.getElements(card.getCardID());
            
            //update the card with elements
            card.setElements(elements);
            
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
