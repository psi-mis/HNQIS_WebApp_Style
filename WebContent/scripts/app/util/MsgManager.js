
// -- Quick Loading Message Util Class/Methods
// -------------------------------------------

function FormBlock() {}

FormBlock.block = function( block, msg, cssSetting, tag )
{
	var msgAndStyle = { message: msg, css: cssSetting };

	if ( tag === undefined )
	{
		if ( block ) $.blockUI( msgAndStyle );
		else $.unblockUI();
	}
	else
	{
		if ( block ) tag.block( msgAndStyle );
		else tag.unblock();
	}
}



// -------------------------------------
// -- Static Classes - Message Manager Class

function MsgManager() {}


// --- App block/unblock ---
MsgManager.cssBlock_Body = { 
	border: 'none'
	,padding: '15px'
	,backgroundColor: '#000'
	,'-webkit-border-radius': '10px'
	,'-moz-border-radius': '10px'
	,opacity: .5
	,color: '#fff'
	,width: '200px'
};

MsgManager.appBlock = function( msg )
{
	if ( msg === undefined ) msg = "Processing ..";

	FormBlock.block( true, msg, MsgManager.cssBlock_Body );
}

MsgManager.appUnblock = function()
{
	FormBlock.block( false );
}


// --- Messaging ---
MsgManager.divMsgAreaTag;
MsgManager.spanMsgAreaCloseTag;
MsgManager.btnMsgAreaCloseTag;
MsgManager.spanMsgAreaTextTag;

// TODO: Rename these as 'NetworkListMsg'
MsgManager.divNetworkListingMsgTag;
MsgManager.spanNetworkListingMsgTag;


MsgManager.initialSetup = function( divMsgAreaTag, spanMsgAreaCloseTag, btnMsgAreaCloseTag, spanMsgAreaTextTag )
{
	MsgManager.divMsgAreaTag = divMsgAreaTag;
	MsgManager.spanMsgAreaCloseTag = spanMsgAreaCloseTag;
	MsgManager.btnMsgAreaCloseTag = btnMsgAreaCloseTag;
	MsgManager.spanMsgAreaTextTag = spanMsgAreaTextTag;		

	MsgManager.btnMsgAreaCloseTag.click( function()
	{
		MsgManager.divMsgAreaTag.hide( 'fast' );
	});
}

MsgManager.msgAreaShow = function( msg )
{
	MsgManager.divMsgAreaTag.hide( 'fast' );
	MsgManager.spanMsgAreaTextTag.text( '' );

	MsgManager.spanMsgAreaTextTag.text( msg );
	MsgManager.divMsgAreaTag.show( 'medium' );
}

// -- End of Message Manager Class
// -------------------------------------
