package handlers;

import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.net.URL;

import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

import com.amazonaws.regions.Regions;
import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestStreamHandler;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import com.amazonaws.services.s3.model.AmazonS3Exception;
import com.amazonaws.services.s3.model.CannedAccessControlList;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.google.gson.Gson;

import models.ImageUpload;

public class UploadImageToS3Handler implements RequestStreamHandler {

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
        String bucketName = "cms-client-images";
        ImageUpload file;
        byte[] imageByte;
        InputStream imgStream;
        ObjectMetadata metadata;
        URL uploadedImageUrl;
        
        try {
        	//Parse input body
        	JSONObject event = (JSONObject) parser.parse(reader);
        	file = new Gson().fromJson(event.get("body").toString(), ImageUpload.class);
        	
        	//Make a connection to S3 bucket
        	imgS3 = AmazonS3ClientBuilder.standard().withRegion(Regions.US_EAST_2).build();
        	
        	//Convert base64 string to image
        	imageByte = java.util.Base64.getDecoder().decode(file.getBase64EncodedImage());
        	imgStream = new ByteArrayInputStream(imageByte);
        	
        	//Setup the image file upload data format
        	metadata = new ObjectMetadata();
        	metadata.setContentLength(imageByte.length);
//        	metadata.setContentType("image/jpg");
        	
        	//Upload the image and set the access to image public
        	imgS3.putObject(bucketName, file.getFileName(), imgStream, metadata);
        	imgS3.setObjectAcl(bucketName, file.getFileName(), CannedAccessControlList.PublicRead);
        	
        	//get the uploaded image's url
        	uploadedImageUrl = imgS3.getUrl(bucketName, file.getFileName());
        	
        	//Close steams
        	imgStream.close();
        	
            //Successful execution
            status = 200;

        } catch (AmazonS3Exception ae) {
        	uploadedImageUrl = null;
        	err = true;
        	error = ae.toString();
            status = 503;
        } catch (ParseException pe) {
        	uploadedImageUrl = null;
        	err = true;
        	error = pe.toString();
            status = 500;
        } catch (Exception e) {
        	uploadedImageUrl = null;
        	err = true;
        	error = e.toString();
        	status = 501;
        }
        
        //Produce output response
        if(err) {
        	responseJson.put("body", new Gson().toJson(error));
        }
        else {
        	responseJson.put("body", new Gson().toJson(uploadedImageUrl));
        }
        responseJson.put("statusCode", status);
        OutputStreamWriter writer = new OutputStreamWriter(outputStream, "UTF-8");
        writer.write(responseJson.toJSONString());
        writer.close();
    }
}
