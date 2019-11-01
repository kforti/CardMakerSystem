package handlers;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.IOException;
import java.net.URL;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import com.google.gson.Gson;

import accessDB.CardsDAO;
import models.Card;
import models.GatewayResponse;

/**
 * Handler for requests to Lambda function.
 */
public class GetCardsHandler implements RequestHandler<Object, Object> {

    public Object handleRequest(final Object input, final Context context) {
        Map<String, String> headers = new HashMap<>();
        headers.put("Content-Type", "application/json");
        headers.put("X-Custom-Header", "application/json");

    	// get all cards stored in database using DAO
    	CardsDAO dao = new CardsDAO();
    	try {
			List<Card> cards = dao.getAllCards();
			Gson gson = new Gson();
			String json = gson.toJson(cards);
			
			// return response containing all cards
            final String pageContents = this.getPageContents("https://checkip.amazonaws.com");
            // change this to JSON
            String output = String.format("{ \"message\": \"%s\", \"location\": \"%s\" }", json, pageContents);
            return new GatewayResponse(json, headers, 200);
    	} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
            return new GatewayResponse("{}", headers, 500);
        }
    }

    private String getPageContents(String address) throws IOException{
        URL url = new URL(address);
        try(BufferedReader br = new BufferedReader(new InputStreamReader(url.openStream()))) {
            return br.lines().collect(Collectors.joining(System.lineSeparator()));
        }
    }
}
