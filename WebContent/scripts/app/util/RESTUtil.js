
function RESTUtil() {}

RESTUtil.getAsyncData = function( url, actionSuccess, actionError, doneFunc ) 
{
	return $.ajax({
		type: "GET"
		,dataType: "json"
		,url: url
		,async: true
		,success: actionSuccess
		,error: actionError
	})
	.always( function( data ) {
		if ( doneFunc !== undefined ) doneFunc();
	});
}


// End of Data Retrieval Manager Class
// ------------------------------------------------------------
