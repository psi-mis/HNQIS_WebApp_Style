
// -------------------------------------------
// -- Utility Class/Methods

function Util() {}



// ----------------------------------
// Seletet Tag Populate, Etc Related

Util.findItemFromList = function( listData, searchProperty, searchValue )
{
	var foundData;

	$.each( listData, function( i, item )
	{
		if ( item[ searchProperty ] == searchValue )
		{
			foundData = item;
			return foundData;
		}
	});

	return foundData;
};


Util.getParameterByName = function( name, url ) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
};


Util.Pinger_ping = function(ip, callback) 
{

  if(!this.inUse) {

    this.inUse = true;
    this.callback = callback
    this.ip = ip;

    var _that = this;

    this.img = new Image();

    this.img.onload = function() {_that.good();};
    this.img.onerror = function() {_that.good();};

    this.start = new Date().getTime();
    this.img.src = ip;
    this.timer = setTimeout(function() { _that.bad();}, 1500);

  }
}




// -----------------------------------------------------------------------------
// Date

Util.MONTHS = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct" ,"Nov", "Dec" ];

Util.formatDate = function( strDate )
{
	var year = strDate.substring(0, 4);
	var month = eval( strDate.substring(5, 7) ) - 1;
	var date = strDate.substring(8, 10);

	return Util.MONTHS[month] + " " + date + " " + year;
};



