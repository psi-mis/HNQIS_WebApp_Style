package psi.hnqis.imci.service;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.DataOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.io.PrintWriter;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.util.Date;
import java.util.Map;

import javax.net.ssl.HttpsURLConnection;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang3.time.DateUtils;
import org.apache.tomcat.util.codec.binary.Base64;
import org.json.JSONArray;
import org.json.JSONObject;

public final class Util
{
    // -------------------------------------------------------------------------
    // UIDs
    // -------------------------------------------------------------------------

    
    // Supper DHIS account
    public static String ACCESS_SERVER_USERNAME = "hnqis.webapp";
    public static String ACCESS_SERVER_PASSWORD = "Qwertyuiop1!";
   
    // -------------------------------------------------------------------------
    // Key words
    // -------------------------------------------------------------------------
    
    // Login page
    public static final String KEY_EVENTID = "eventId";
    public static final String KEY_SERVER = "server";
    
    public static final String REQUEST_TYPE_GET = "GET";
    

    // --------------------------------------------------------------------------------------------------------------
    // HTTPS GET/POST/PUT request
    // --------------------------------------------------------------------------------------------------------------

    // Convert InputStream to String
    public static JSONObject getJsonFromInputStream( InputStream is )
    {
        BufferedReader br = null;
        StringBuilder sb = new StringBuilder();

        String line;
        try
        {
            br = new BufferedReader( new InputStreamReader( is ) );
            while ( (line = br.readLine()) != null )
            {
                sb.append( line );
            }
        }
        catch ( IOException e )
        {
            e.printStackTrace();
        }
        finally
        {
            if ( br != null )
            {
                try
                {
                    br.close();
                }
                catch ( IOException e )
                {
                    e.printStackTrace();
                }
            }
        }

        JSONObject jsonData = new JSONObject( sb.toString() );
        return jsonData;
    }

    public static ResponseInfo sendRequest( String requestType, String url, JSONObject jsonData,
        Map<String, Object> params )
        throws Exception, IOException
    {

        System.out.println( "\n\n ====== \n requestUrl : " + url );

        String username = Util.ACCESS_SERVER_USERNAME;
        String password = Util.ACCESS_SERVER_PASSWORD;
        
        ResponseInfo responseInfo = new ResponseInfo();
        StringBuffer responseMsg = new StringBuffer();

        // 2. Open HttpsURLConnection and Set Request Type.
        URL obj = new URL( url );

        try
        {
            if ( obj.getProtocol().equals( "https" ) )
                responseInfo = Util.sendRequestHTTPS( responseInfo, responseMsg, requestType, url, jsonData, params,
                    username, password );
            else
                responseInfo = Util.sendRequestHTTP( responseInfo, responseMsg, requestType, url, jsonData, params,
                    username, password );
        }
        catch ( Exception ex )
        {
            responseMsg = new StringBuffer( "{ \"httpStatusCode\": \"" + responseInfo.responseCode + "\" }" );
        }

        responseInfo.output = responseMsg.toString();

        return responseInfo;
    }

    private static ResponseInfo sendRequestHTTP( ResponseInfo responseInfo, StringBuffer responseMsg,
        String requestType, String url, JSONObject jsonData, Map<String, Object> params, String username,
        String password )
        throws Exception, IOException
    {
        // responseInfo.sendStr = bodyMessage;
        responseInfo.data = jsonData;

        // 2. Open HttpsURLConnection and Set Request Type.
        URL obj = new URL( url );
        // Since HttpsURLConnection extends HttpURLConnection, we can use this
        // for both HTTP & HTTPS?
        HttpURLConnection con = (HttpURLConnection) obj.openConnection();

        // add Request header
        con.setRequestMethod( requestType );

        con.setRequestProperty( "User-Agent",
            "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.11 (KHTML, like Gecko) Chrome/23.0.1271.95 Safari/537.11" );
        con.setRequestProperty( "Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8" );
        con.setRequestProperty( "Accept-Language", "en-US,en;q=0.5" );
        con.setRequestProperty( "Content-Type", "application/json; charset=utf-8" );
        
        String userpass = username + ":" + password;
        String basicAuth = "Basic " + new String( new Base64().encode( userpass.getBytes() ) );
        con.setRequestProperty( "Authorization", basicAuth );

        // 3. Body Message Received Handle
        if ( jsonData != null && jsonData.length() > 0 )
        {
            // Send post request
            con.setDoOutput( true );
            /* DataOutputStream wr = new DataOutputStream( con.getOutputStream() );
            wr.writeBytes( jsonData.toString() );
            wr.flush();
            wr.close(); */
            
            BufferedWriter bw = new BufferedWriter(new OutputStreamWriter(con.getOutputStream(), "UTF-8"));
            bw.write(jsonData.toString());
            bw.flush();
            bw.close();
        }

        if ( params != null && !params.isEmpty() )
        {
            StringBuilder postData = new StringBuilder();
            for ( Map.Entry<String, Object> param : params.entrySet() )
            {
                if ( postData.length() != 0 )
                    postData.append( '&' );

                postData.append( URLEncoder.encode( param.getKey(), "UTF-8" ) );
                postData.append( '=' );
                postData.append( URLEncoder.encode( String.valueOf( param.getValue() ), "UTF-8" ) );
            }

            byte[] postDataBytes = postData.toString().getBytes( "UTF-8" );

            con.setDoOutput( true );

            DataOutputStream wr = new DataOutputStream( con.getOutputStream() );
            wr.write( postDataBytes );
            wr.flush();
            wr.close();
        }

        // 4. Send and get Response
        responseInfo.responseCode = con.getResponseCode();

        // 5. Other response info
        if ( con.getResponseCode() == HttpURLConnection.HTTP_OK ) 
        {
            BufferedReader in = new BufferedReader( new InputStreamReader( con.getInputStream(), "UTF-8" ) );

            String inputLine;
            while ( (inputLine = in.readLine()) != null )
            {
                responseMsg.append( inputLine );
            }

            in.close();
            
        } else 
        {
             String json = Util.readStream(con.getErrorStream());
             responseMsg.append( json );
        }

        responseInfo.data = new JSONObject( responseMsg.toString() );

        return responseInfo;
    }

    private static ResponseInfo sendRequestHTTPS( ResponseInfo responseInfo, StringBuffer responseMsg,
        String requestType, String url, JSONObject jsonData, Map<String, Object> params, String username,
        String password )
        throws Exception, IOException
    {
        // responseInfo.sendStr = bodyMessage;
        responseInfo.data = jsonData;

        // 2. Open HttpsURLConnection and Set Request Type.
        URL obj = new URL( url );
        // Since HttpsURLConnection extends HttpURLConnection, we can use this
        // for both HTTP & HTTPS?
        HttpsURLConnection con = (HttpsURLConnection) obj.openConnection();

        // add Request header
        con.setRequestMethod( requestType );

        con.setRequestProperty( "User-Agent",
            "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.11 (KHTML, like Gecko) Chrome/23.0.1271.95 Safari/537.11" );
        con.setRequestProperty( "Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8" );
        con.setRequestProperty( "Accept-Language", "en-US,en;q=0.5" );
        con.setRequestProperty( "Content-Type", "application/json; charset=utf-8" );
        
        String userpass = username + ":" + password;
        String basicAuth = "Basic " + new String( new Base64().encode( userpass.getBytes() ) );
        con.setRequestProperty( "Authorization", basicAuth );

        
        // 3. Body Message Received Handle
        if ( jsonData != null && jsonData.length() > 0 )
        {
            // Send post request
            con.setDoOutput( true );
            
            BufferedWriter bw = new BufferedWriter(new OutputStreamWriter(con.getOutputStream(), "UTF-8"));
            bw.write(jsonData.toString());
            bw.flush();
            bw.close();
        }

        if ( params != null && !params.isEmpty() )
        {
            StringBuilder postData = new StringBuilder();
            for ( Map.Entry<String, Object> param : params.entrySet() )
            {
                if ( postData.length() != 0 )
                    postData.append( '&' );

                postData.append( URLEncoder.encode( param.getKey(), "UTF-8" ) );
                postData.append( '=' );
                postData.append( URLEncoder.encode( String.valueOf( param.getValue() ), "UTF-8" ) );
            }

            byte[] postDataBytes = postData.toString().getBytes( "UTF-8" );

            con.setDoOutput( true );

            DataOutputStream wr = new DataOutputStream( con.getOutputStream() );
            wr.write( postDataBytes );
            wr.flush();
            wr.close();
        }

        // 4. Send and get Response
        responseInfo.responseCode = con.getResponseCode();

        // 5. Other response info
        if ( con.getResponseCode() == HttpURLConnection.HTTP_OK ) 
        {
            BufferedReader in = new BufferedReader( new InputStreamReader( con.getInputStream(), "UTF-8" ) );

            String inputLine;
            while ( (inputLine = in.readLine()) != null )
            {
                responseMsg.append( inputLine );
            }

            in.close();
            
        } else 
        {
             String json = Util.readStream(con.getErrorStream());
             responseMsg.append( json );
        }

        responseInfo.data = new JSONObject( responseMsg.toString() );

        return responseInfo;
    }

    private static String readStream(InputStream stream) throws Exception {
        StringBuilder builder = new StringBuilder();
        try (BufferedReader in = new BufferedReader(new InputStreamReader(stream))) {
            String line;
            while ((line = in.readLine()) != null) {
                builder.append(line); // + "\r\n"(no need, json has no line breaks!)
            }
            in.close();
        }
        
        return builder.toString();
    }
    
    public static void respondMsgOut( ResponseInfo responseInfo, HttpServletResponse response )
        throws IOException, Exception
    {
        response.setContentType( "application/json; charset=utf-8" );
        response.setStatus( responseInfo.responseCode );
        
        PrintWriter out = response.getWriter();
        out.print( responseInfo.outMessage );
        out.flush();
    }

    // --------------------------------------------------------------------------------------------------------------
    // Util Data
    // --------------------------------------------------------------------------------------------------------------

    private static Date getCurrentDateObj()
    {
        ZonedDateTime now = ZonedDateTime.now( ZoneOffset.UTC );
        Date date = new Date( now.getYear() - 1900, now.getMonthValue() - 1, now.getDayOfMonth(), now.getHour(), now.getMinute(), now.getSecond() );
        return date;
    }
    
    public static String getCurrentDate()
    {
        return Util.formatDate( Util.getCurrentDateObj() );
    }

    public static String getCurrentDateTime()
    {
       return Util.formatDateTime( Util.getCurrentDateObj() );
    }

    public static String getXLastDate( int noDays )
    {
        Date date = DateUtils.addDays( Util.getCurrentDateObj(), -noDays);        
        return formatDate( date );
    }

    public static String getXLastMonth( int noMonths )
    {
        Date now = Util.getCurrentDateObj();
        Date date = DateUtils.addMonths( now, -noMonths );
        return formatDate( date );
    }

    public static String formatDate( Date date )
    {
        int year = date.getYear() + 1900;
        int month = date.getMonth() + 1;
        int day = date.getDate();

        String monthStr = (month < 10) ? "0" + month : "" + month;
        String dayStr = (day < 10) ? "0" + day : "" + day;

        return year + "-" + monthStr + "-" + dayStr;
    }

    public static String formatDateTime( Date date )
    {
        int hours = date.getHours();
        int minutes = date.getMinutes();
        int seconds = date.getSeconds();

        String hoursStr = (hours < 10) ? "0" + hours : "" + hours;
        String minutesStr = (minutes < 10) ? "0" + minutes : "" + minutes;
        String secondsStr = (seconds < 10) ? "0" + seconds : "" + seconds;
        
        return Util.formatDate( date ) + "T" + hoursStr + ":" + minutesStr + ":" + secondsStr;
    }

    // --------------------------------------------------------------------------------------------------------------
    // Utilitizes
    // --------------------------------------------------------------------------------------------------------------

    public static String outputImportResult( String output, String summaryType )
    {
        String referenceId = "";

        JSONObject rec = null;

        JSONObject recTemp = new JSONObject( output );

        if ( summaryType != null && summaryType.equals( "importSummaries" ) )
        {
            if ( recTemp.has( "response" ) )
            {
                JSONObject response = recTemp.getJSONObject( "response" );

                if ( response.has( "importSummaries" ) )
                {
                    JSONArray importSummaries = response.getJSONArray( "importSummaries" );
                    rec = importSummaries.getJSONObject( 0 );
                }
            }
        }
        else
        {
            if ( recTemp.has( "response" ) )
            {
                rec = recTemp.getJSONObject( "response" );
            }
        }

        if ( rec != null && rec.has( "status" ) && rec.getString( "status" ).equals( "SUCCESS" ) )
        {
            JSONObject importCount = rec.getJSONObject( "importCount" );

            // NOTE: In "importSummaries" case, it shows up as 0 for 'imported'
            if ( (importCount.getInt( "imported" ) >= 1 || importCount.getInt( "updated" ) >= 1)
                || summaryType.equals( "importSummaries" ) )
            {
                if ( rec.has( "reference" ) )
                {
                    referenceId = rec.getString( "reference" );
                }
            }
        }

        return referenceId;
    }

    public static void processResponseMsg( ResponseInfo responseInfo, String importSummaryCase )
    {
        if ( responseInfo.responseCode != 200 )
        {
            // If error occured, display the output as it is (received from
            // DHIS).
            // Set return Msg
            responseInfo.outMessage = responseInfo.output;
        }
        else
        {
            // Set return Msg
            responseInfo.referenceId = Util.outputImportResult( responseInfo.output, importSummaryCase );
            responseInfo.outMessage = "{ \"id\": \"" + responseInfo.referenceId + "\" }";
        }
    }
    
}
