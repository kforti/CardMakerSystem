package accessDB;

import java.sql.Connection;
import java.sql.DriverManager;
//import com.mysql.jdbc.Driver;

public class DatabaseConnect
{
	//TODO: DO NOT USE AS IS
	// These are to be configured and NEVER stored in the code.
	// once you retrieve this code, you can update
	public final static String rdsMySqlDatabaseUrl = "database-2.cpwe1rxpzibp.us-east-2.rds.amazonaws.com";
	public final static String dbUsername = "admin_republic";
	public final static String dbPassword = "republic123"; //add in the password
		
	public final static String jdbcTag = "jdbc:mysql://";
	public final static String rdsMySqlDatabasePort = "3306";
	public final static String multiQueries = "?allowMultiQueries=true";
	   
	public final static String dbName = "card_maker_system";    // default created from MySQL WorkBench

	// pooled across all usages.
	static Connection conn;
 
	/**
	 * Singleton access to DB connection to share resources effectively across multiple accesses.
	 */
	protected static Connection connect() throws Exception
	{
		if (conn != null) { return conn; }
		
		try
		{
			//System.out.println("start connecting......");
			Class.forName("com.mysql.jdbc.Driver").newInstance();
			conn = DriverManager.getConnection(
					jdbcTag + rdsMySqlDatabaseUrl + ":" + rdsMySqlDatabasePort + "/" + dbName, dbUsername,
					dbPassword);
			//System.out.println("Database has been connected successfully.");
			return conn;
		} catch (Exception ex) {
			throw new Exception("Failed in database connection");
		}
	}
}
