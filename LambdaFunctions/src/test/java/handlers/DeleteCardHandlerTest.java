package handlers;

import java.io.*;

import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.junit.Assert;
import org.junit.Test;

public class DeleteCardHandlerTest {
	private static final String RESULT = "200";
	
	@Test
	public void testDeleteCardHandler() throws IOException, ParseException {
		
		//create a card first to delete later
		String SAMPLE_INPUT_STRING1 = "{\"body\":{\"eventType\": \"Birthday\", \"recipient\": \"Mary\", \"orientation\": \"Landscape\"}}";
		
		CreateCardHandler handler = new CreateCardHandler();
        InputStream input = new ByteArrayInputStream(SAMPLE_INPUT_STRING1.getBytes());
        OutputStream output = new ByteArrayOutputStream();
        handler.handleRequest(input, output, null);
        JSONParser parser = new JSONParser();
        JSONObject OutputNode = (JSONObject) parser.parse(output.toString());
   
    	String cardId = OutputNode.get("body").toString().split(":")[1].split(",")[0];
        
        Assert.assertEquals(RESULT, OutputNode.get("statusCode").toString());
		
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        
        //Delete the card created above with the above card ID
    	String SAMPLE_INPUT_STRING = "{\"body\":{\"cardId\":" + cardId + "}}";
    	
        DeleteCardHandler handler2 = new DeleteCardHandler();
        InputStream input2 = new ByteArrayInputStream(SAMPLE_INPUT_STRING.getBytes());
        OutputStream output2 = new ByteArrayOutputStream();
        handler2.handleRequest(input2, output2, null);
        JSONParser parser2 = new JSONParser();
        JSONObject OutputNode2 = (JSONObject) parser2.parse(output2.toString());
        
        Assert.assertEquals(RESULT, OutputNode2.get("statusCode").toString());
	    }
}

