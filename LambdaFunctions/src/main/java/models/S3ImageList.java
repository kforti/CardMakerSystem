package models;

import java.net.URL;
import java.util.List;

public class S3ImageList {
	List<String> fileNames;
	List<URL> urls;
	
	public S3ImageList(List<String> fileNames, List<URL> urls){
		this.fileNames = fileNames;
		this.urls = urls;
	}
}
