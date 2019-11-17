package handlers;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.util.ArrayList;
import java.util.List;

import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestStreamHandler;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import com.amazonaws.services.s3.model.AmazonS3Exception;
import com.amazonaws.services.s3.model.ObjectListing;
import com.amazonaws.services.s3.model.S3ObjectSummary;
import com.google.gson.Gson;

public class GetImageListInS3Handler implements RequestStreamHandler {

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
        AmazonS3 imgS3;
        ObjectListing objList;
        List<S3ObjectSummary> objSummeryList;
        List<String> imgs = new ArrayList<String>();
        String bucketName = "cms-client-images";
        
        try {        	       	
        	//Make a connection to S3
        	imgS3 = AmazonS3ClientBuilder.defaultClient();
        	
        	//List images in the S3 bucket
        	objList = imgS3.listObjects(bucketName);
        	objSummeryList = objList.getObjectSummaries();
        	
        	//Parse the list for directory
        	for(S3ObjectSummary os: objSummeryList) {
        		imgs.add(os.getKey());
        	}
        	
            //Successful execution
            status = 200;

        } catch (AmazonS3Exception pe) {
        	err = true;
        	error = pe.toString();
            status = 500;
        } catch (Exception e) {
        	err = true;
        	error = e.toString();
        	status = 501;
        }
        
        //Produce output response
        if(err) {
        	responseJson.put("body", new Gson().toJson(error));
        }
        else {
        	responseJson.put("body", new Gson().toJson(imgs));
        }
        responseJson.put("statusCode", status);
        OutputStreamWriter writer = new OutputStreamWriter(outputStream, "UTF-8");
        writer.write(responseJson.toJSONString());
        writer.close();
    }
}
