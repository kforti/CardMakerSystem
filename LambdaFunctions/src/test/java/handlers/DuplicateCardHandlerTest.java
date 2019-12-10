package handlers;

import java.io.*;

import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.junit.Assert;
import org.junit.Test;

public class DuplicateCardHandlerTest {
	private static final String RESULT = "200";
	
	@Test
	public void testDuplicateCardHandler() throws IOException, ParseException {
		//create a card to duplicate first
		String SAMPLE_INPUT_STRING = "{\"body\":{\"eventType\": \"Test\", \"recipient\": \"not Duplicate Card\", \"orientation\": \"Test\"}}";
		
        CreateCardHandler handler = new CreateCardHandler();
        InputStream input = new ByteArrayInputStream(SAMPLE_INPUT_STRING.getBytes());
        OutputStream output = new ByteArrayOutputStream();
        handler.handleRequest(input, output, null);
        JSONParser parser = new JSONParser();
        JSONObject OutputNode = (JSONObject) parser.parse(output.toString()); 
        
        String cardID = OutputNode.get("body").toString().split(":")[1].split(",")[0];
        
        Assert.assertEquals(RESULT, OutputNode.get("statusCode").toString());
	        
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        
        //delete the created element above with its element id
        String SAMPLE_INPUT_STRING2 = "{\"body\":{\"cardId\": " + cardID + ", \"recipient\": \"Duplicate Card\"}}";
    	
        DuplicateCardHandler handler2 = new DuplicateCardHandler();
        InputStream input2 = new ByteArrayInputStream(SAMPLE_INPUT_STRING2.getBytes());
        OutputStream output2 = new ByteArrayOutputStream();
        handler2.handleRequest(input2, output2, null);
        JSONParser parser2 = new JSONParser();
        JSONObject OutputNode2 = (JSONObject) parser2.parse(output2.toString());
        
        Assert.assertEquals(RESULT, OutputNode2.get("statusCode").toString());
    }
}

