package handlers;

import java.io.*;

import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.junit.Assert;
import org.junit.Test;

public class DuplicateCardHandlerTest {
	private static final String 
	SAMPLE_INPUT_STRING = "{\"body\":{\"cardId\": \"0000000061\", \"eventType\": \"Birthday\", \"recipient\": \"Mary\", \"orientation\": \"Landscape\"}}";
	private static final String 
	RESULT = "200";
	@Test
	public void testCalculatorHandler() throws IOException, ParseException {
	        DuplicateCardHandler handler = new DuplicateCardHandler();
	        InputStream input = new ByteArrayInputStream(SAMPLE_INPUT_STRING.getBytes());
	        OutputStream output = new ByteArrayOutputStream();
	        handler.handleRequest(input, output, null);
	        
	        JSONParser parser = new JSONParser();
	        JSONObject OutputNode = (JSONObject) parser.parse(output.toString());
	        
	        System.out.println(OutputNode.get("statusCode"));
	        
	        Assert.assertEquals(RESULT, OutputNode.get("statusCode").toString());
	    }
	}

