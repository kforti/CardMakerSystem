package handlers;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;

import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;

import com.amazonaws.regions.Regions;
import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestStreamHandler;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import com.amazonaws.services.s3.model.AmazonS3Exception;
import com.amazonaws.services.s3.model.ObjectListing;
import com.amazonaws.services.s3.model.S3ObjectSummary;
import com.google.gson.Gson;

import models.S3ImageList;

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
        List<S3ObjectSummary> objSummeryList;
        List<String> fileNames = new ArrayList<String>();
        List<URL> urls = new ArrayList<URL>();
        S3ImageList s3ImageList;
        String bucketName = "cms-client-images";
        
        try {        	       	
        	//Make a connection to S3
        	imgS3 = AmazonS3ClientBuilder.standard().withRegion(Regions.US_EAST_2).build();
        	
        	//List images in the S3 bucket
        	objSummeryList = imgS3.listObjects(bucketName).getObjectSummaries();
        	
        	//Parse the list for directory
        	for(S3ObjectSummary os: objSummeryList) {
        		fileNames.add(os.getKey());
        		urls.add(imgS3.getUrl(bucketName, os.getKey()));
        	}
        	
        	s3ImageList = new S3ImageList(fileNames, urls);
        	
            //Successful execution
            status = 200;

        } catch (AmazonS3Exception pe) {
        	s3ImageList = null;
        	err = true;
        	error = pe.toString();
            status = 500;
        } catch (Exception e) {
        	s3ImageList = null;
        	err = true;
        	error = e.toString();
        	status = 501;
        }
        
        //Produce output response
        if(err) {
        	responseJson.put("body", new Gson().toJson(error));
        }
        else {
        	responseJson.put("body", new Gson().toJson(s3ImageList));
        }
        responseJson.put("statusCode", status);
        OutputStreamWriter writer = new OutputStreamWriter(outputStream, "UTF-8");
        writer.write(responseJson.toJSONString());
        writer.close();
    }
}
