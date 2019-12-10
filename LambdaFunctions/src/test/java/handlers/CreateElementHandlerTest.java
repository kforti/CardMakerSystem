package handlers;

import java.io.*;

import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.junit.Assert;
import org.junit.Test;

public class CreateElementHandlerTest {
	private static final String 
	SAMPLE_INPUT_STRING = "{\"body\":{\"cardId\": \"100\", \"pageType\": \"front\",\"elementType\": \"text\""
			+ "\"textMessage\": \"textFont\", \"textFont\": \"textFont\", \"imgSrc\": \" \", "
			+ "\"xCoord\": \"100\", \"yCoord\": \"100\",\"height\": \"100\",\"width\": \"100\"}}";
	private static final String 
	RESULT = "200";
	@Test
	public void testCreateElementHandler() throws IOException, ParseException {
			CreateElementHandler handler = new CreateElementHandler();
	        InputStream input = new ByteArrayInputStream(SAMPLE_INPUT_STRING.getBytes());
	        OutputStream output = new ByteArrayOutputStream();
	        handler.handleRequest(input, output, null);
	        
	        JSONParser parser = new JSONParser();
	        JSONObject OutputNode = (JSONObject) parser.parse(output.toString());
	        
	        System.out.println(OutputNode.get("statusCode"));
	        
	        Assert.assertEquals(RESULT, OutputNode.get("statusCode").toString());
	    }
	}

