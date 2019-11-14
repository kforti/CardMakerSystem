package handlers;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestStreamHandler;
import com.google.gson.Gson;

import accessDB.CardsDAO;
import models.Card;

import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

import java.io.*;
import java.util.List;

public class GetCardsHandler implements RequestStreamHandler{

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
        String error = "";
        boolean err = false;
        int status;
        CardsDAO cardDao = new CardsDAO();
        List<Card> cards;
        
    	try {
    		//get the data from the databases
			cards = cardDao.getAllCards();
			
        	//Successful execution
        	status = 200;
			
        } catch (ParseException pe) {
        	err = true;
        	error = pe.toString();
            status = 500;
            cards = null;
        } catch (Exception e) {
        	err = true;
        	error = e.toString();
        	status = 501;
        	cards = null;
        }
    	
        //Produce output response
        if(err) {
        	responseJson.put("body", new Gson().toJson(error));
        }
        else {
        	responseJson.put("body", new Gson().toJson(cards));
        }
        responseJson.put("statusCode", status);
        OutputStreamWriter writer = new OutputStreamWriter(outputStream, "UTF-8");
        writer.write(responseJson.toJSONString());
        writer.close();
    }
}
