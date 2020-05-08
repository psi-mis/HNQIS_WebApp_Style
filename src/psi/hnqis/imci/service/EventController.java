package psi.hnqis.imci.service;

import java.io.IOException;
import java.io.UnsupportedEncodingException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONObject;

public class EventController
    extends HttpServlet
{
    private static final long serialVersionUID = -8009460801270486913L;

    private static String DEFAULT_SERVER = "https://data.psi-mis.org";
    
    private static String PARAM_STAGE_ID = "@PARAM_STAGE_ID";
    private static String PARAM_EVENT_ID = "@PARAM_EVENT_ID";
    private static String PARAM_ORGUNIT_ID = "@PARAM_ORGUNIT_ID";
    private static String PARAM_USERNAME = "@PARAM_USERNAME";
    
    // -------------------------------------------------------------------------
    // URLs
    // -------------------------------------------------------------------------

    private static String URL_QUERY_DATA_ELEMENTS = "/api/programStages/" + EventController.PARAM_STAGE_ID + ".json?fields=program[name],programStageDataElements[compulsory,dataElement[id,displayFormName,description,optionSet[options[code,name]],attributeValues[value,attribute[id,name]]]";
    
    private static String URL_QUERY_EVENT_DETAILS = "/api/events/" + EventController.PARAM_EVENT_ID + ".json";
    private static String URL_QUERY_USER_DETAILS = "/api/users.json?fields=displayName&query=" + PARAM_USERNAME;
        
    private static String URL_QUERY_ORGANISATION_UNIT = "/api/organisationUnits/" + EventController.PARAM_ORGUNIT_ID + ".json?fields=name";
    
    
   // -------------------------------------------------------------------------
   // GET method
   // -------------------------------------------------------------------------
  
    protected void doGet( HttpServletRequest request, HttpServletResponse response )
        throws ServletException, IOException
    {
        ResponseInfo responseInfo = null;
        
        try
        {
            String eventId = request.getParameter( Util.KEY_EVENTID );
            String server = request.getParameter( Util.KEY_SERVER );
            server = ( server.toString().equals( "null" ) || server.equals( "" ) ) ? EventController.DEFAULT_SERVER : server;

            responseInfo = EventController.getEventDetails( eventId, server );
            
            String output = "\"event\":" + responseInfo.output + "";
   
            if( responseInfo.responseCode == 200 )
            {
                JSONObject eventData = new JSONObject(responseInfo.output);
                String programStageId = eventData.getString( "programStage" );
               
                ResponseInfo responseInfo_DeList = EventController.getDataElements( programStageId, server );
                if( responseInfo_DeList.responseCode == 200 )
                {
                    output += ",\"deList\":" + responseInfo_DeList.output + "";
                    
                    String orgUnitId = responseInfo.data.getString( "orgUnit" );
                    ResponseInfo responseInfo_OrgUnitName = EventController.getEventOrgunit( orgUnitId, server );
                    if( responseInfo_OrgUnitName.responseCode == 200 )
                    {
                        output += ",\"ou\":" + responseInfo_OrgUnitName.output + "";
//                        responseInfo.outMessage = "{" + output + "}";
                        
                        String storedBy = eventData.getString( "storedBy" );
                        ResponseInfo responseInfo_Username = EventController.getUserDetails( storedBy, server );
                        if( responseInfo_Username.responseCode == 200 )
                        {
                            output += ",\"user\":" + responseInfo_Username.output + "";
                            responseInfo.outMessage = "{" + output + "}";
                        }
                    }
                }
               
            }
            else
            {
                responseInfo.outMessage = responseInfo.output; 
            }

            Util.respondMsgOut( responseInfo, response );
        }
        catch ( IOException ex )
        {
            System.out.println( "IO Excpetion: " + ex.toString() );
        }
        catch ( Exception ex )
        {
            System.out.println( "Exception: " + ex.toString() );
        }
    }
    
    
    public static ResponseInfo getEventDetails( String eventId, String server )
        throws UnsupportedEncodingException, ServletException, IOException, Exception
    {
        ResponseInfo responseInfo = null;

        try
        {
            String requestUrl = server + EventController.URL_QUERY_EVENT_DETAILS;
            
            requestUrl = requestUrl.replace( EventController.PARAM_EVENT_ID, eventId );
            
            responseInfo = Util.sendRequest( Util.REQUEST_TYPE_GET, requestUrl, null, null );
        }
        catch ( Exception ex )
        {
            System.out.println( "Exception: " + ex.toString() );
        }

        return responseInfo;
    }
    
    public static ResponseInfo getUserDetails( String storedBy, String server )
        throws UnsupportedEncodingException, ServletException, IOException, Exception
    {
        ResponseInfo responseInfo = null;

        try
        {
            String requestUrl = server + EventController.URL_QUERY_USER_DETAILS;
            
            requestUrl = requestUrl.replace( EventController.PARAM_USERNAME, storedBy );
            
            responseInfo = Util.sendRequest( Util.REQUEST_TYPE_GET, requestUrl, null, null );
        }
        catch ( Exception ex )
        {
            System.out.println( "Exception: " + ex.toString() );
        }

        return responseInfo;
    }
    

    public static ResponseInfo getDataElements( String programStageId, String server )
        throws UnsupportedEncodingException, ServletException, IOException, Exception
    {
        ResponseInfo responseInfo = null;

        try
        {
            String requestUrl = server + EventController.URL_QUERY_DATA_ELEMENTS;
            requestUrl = requestUrl.replace( EventController.PARAM_STAGE_ID, programStageId );
            
            responseInfo = Util.sendRequest( Util.REQUEST_TYPE_GET, requestUrl, null, null );
        }
        catch ( Exception ex )
        {
            System.out.println( "Exception: " + ex.toString() );
        }

        return responseInfo;
    }
    
    public static ResponseInfo getEventOrgunit( String orgUnitId, String server )
        throws UnsupportedEncodingException, ServletException, IOException, Exception
    {
        ResponseInfo responseInfo = null;

        try
        {
            String requestUrl = server + EventController.URL_QUERY_ORGANISATION_UNIT;
            requestUrl = requestUrl.replace( EventController.PARAM_ORGUNIT_ID, orgUnitId );
            
            responseInfo = Util.sendRequest( Util.REQUEST_TYPE_GET, requestUrl, null, null );
        }
        catch ( Exception ex )
        {
            System.out.println( "Exception: " + ex.toString() );
        }

        return responseInfo;
    }
    
}
