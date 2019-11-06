package handlers;

import accessDB.CardsDAO;
import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import com.amazonaws.services.lambda.runtime.RequestStreamHandler;
import com.google.gson.Gson;

import com.google.gson.GsonBuilder;
import models.Card;
import models.GatewayResponse;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

import java.io.*;
import java.net.URL;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Handler for requests to Lambda function.
 */
public class DeleteCardHandler implements RequestStreamHandler {

    @Override
    public void handleRequest(InputStream inputStream, OutputStream outputStream, Context context) throws IOException {
        JSONObject headerJson = new JSONObject();
        headerJson.put("Content-Type",  "application/json");  // not sure if needed anymore?
        headerJson.put("Access-Control-Allow-Methods", "POST,DELETE,OPTIONS");
        headerJson.put("Access-Control-Allow-Origin",  "*");

        JSONObject responseJson = new JSONObject();
        responseJson.put("headers", headerJson);

        JSONParser parser = new JSONParser();
        BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream));
        CardsDAO dao = new CardsDAO();
        Card card;
        int status;
        JSONObject responseBody = new JSONObject();
        try {
            //final String pageContents = this.getPageContents("https://checkip.amazonaws.com");
            // Implement body here
            JSONObject event = (JSONObject) parser.parse(reader);
            card = new Gson().fromJson(event.get("body").toString(), Card.class);

            boolean card_deleted = dao.deleteCard(card.getCardID());
            responseBody.put("card_deleted", card_deleted);
            status = 200;

        } catch (ParseException pe) {
            status = 500;
        } catch (Exception e) {
            status = 501;
        }
        responseJson.put("body", responseBody.toJSONString());
        responseJson.put("statusCode", status);

        OutputStreamWriter writer = new OutputStreamWriter(outputStream, "UTF-8");

        writer.write(responseJson.toJSONString());
        writer.close();
    }

    private String getPageContents(String address) throws IOException{
        URL url = new URL(address);
        try(BufferedReader br = new BufferedReader(new InputStreamReader(url.openStream()))) {
            return br.lines().collect(Collectors.joining(System.lineSeparator()));
        }
    }


}
