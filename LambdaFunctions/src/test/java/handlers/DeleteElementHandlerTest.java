package handlers;

import java.io.*;

import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.junit.Assert;
import org.junit.Test;

public class DeleteElementHandlerTest { 
	private static final String RESULT = "200";
	
	@Test
	public void testDeleteElementHandler() throws IOException, ParseException {
		
		//create and element first
		String SAMPLE_INPUT_STRING = "{\"body\":{\"cardId\": \"2\", \"pageType\": \"front\",\"elementType\": \"text\""
				+ "\"textMessage\": \"Test2\", \"textFont\": \"New Romen\", \"imgSrc\": \"null\", "
				+ "\"xCoord\": \"100\", \"yCoord\": \"100\",\"height\": \"100\",\"width\": \"100\"}}";
		
		CreateElementHandler handler = new CreateElementHandler();
        InputStream input = new ByteArrayInputStream(SAMPLE_INPUT_STRING.getBytes());
        OutputStream output = new ByteArrayOutputStream();
        handler.handleRequest(input, output, null);
        
        JSONParser parser = new JSONParser();
        JSONObject OutputNode = (JSONObject) parser.parse(output.toString());
        
        String elmID = OutputNode.get("body").toString().split(":")[1].split(",")[0];
        
        Assert.assertEquals(RESULT, OutputNode.get("statusCode").toString());
		

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        
        //delete the created element above with its element id
        String SAMPLE_INPUT_STRING2 = "{\"body\":{\"elementId\": " + elmID + "}}";
    	
        DeleteElementHandler handler2 = new DeleteElementHandler();
        InputStream input2 = new ByteArrayInputStream(SAMPLE_INPUT_STRING2.getBytes());
        OutputStream output2 = new ByteArrayOutputStream();
        handler2.handleRequest(input2, output2, null);
        JSONParser parser2 = new JSONParser();
        JSONObject OutputNode2 = (JSONObject) parser2.parse(output2.toString());
        
        Assert.assertEquals(RESULT, OutputNode2.get("statusCode").toString());
    }
}

