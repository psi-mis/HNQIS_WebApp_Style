
jQuery( document ).ready( function() {

	new EventDetails();	
});

function EventDetails()
{
	var me = this;

	me.optionSet = [];
	
	me.PARAM_EVENTID = "@PARAM_EVENTID";
	me.PARAM_SERVER = "@PARAM_SERVER";
	me.PARAM_USERNAME = "@PARAM_USERNAME";
	me._query_EventDetails = "event?eventId=" + me.PARAM_EVENTID + "&server=" + me.PARAM_SERVER;
	me._query_EventUserDetails = "users/" + me.PARAM_USERNAME + ".json";
	
//	me.HEADER_COLOR_RANGE = ["#c2c2c2", "#d2d2d2", "#e6e6e6"];
//	me.COLOR_WHITE = "#f5f5f5";
//	me.BIG_FONT_SIZE = 18;
	
	me.DE_ID_AssessmentScheduled = "M93RYt47CMK";
	me.DE_ID_Competency = "KesgQ5NHkQW";
	me.DE_ID_Gap = "lI09tJv3h4z";
	me.DE_ID_ActionPlan = "Im5C86I2ObV";

	me.DE_ID_Action1_1 = "wRaxfSNz5Xb";
	me.DE_ID_ActionResponsible_1 = "hUXusK1q7qX";
	me.DE_ID_ActionDueDate_1 = "zAWljfTXSnZ";
	me.DE_ID_ActionCompletionDate_1 = "bu0dDZmEqb6";
	me.DE_ID_Action_2_1 = "uv22UMpXUA2";
	me.DE_ID_ActionResponsible_2 = "Qor2Meb1sNf";
	me.DE_ID_ActionDueDate_2 = "BtReGP2EMKA";
	me.DE_ID_ActionCompletionDate_2 = "ClN8h6d1C9o";
	me.DE_ID_Action_3_1 = "OJRW4LPDsdU";
	me.DE_ID_ActionResponsible_3 = "z9bskG067HE";
	me.DE_ID_ActionDueDate_3 = "bVPpgPm1hj0";
	me.DE_ID_ActionCompletionDate_3 = "LPFqIi0Ml4a";

	
	me.ATTR_ID_DeType = "IMVz39TtAHM";
	me.ATTR_ID_DeType_COMPOSITE_SCORE = "93";
	me.ATTR_ID_DeType_QUESTION = "92";
	me.ATTR_ID_CompositiveScoreValue = "k738RpAYLmz";
	me.ATTR_ID_QuestionOrder = "xf9iDHNFLgx";

	me.collapseAllLinkTag = $("#collapseAllLink");
	me.expandAllLinkTag = $("#expandAllLink");
	me.printLinkTag = $("#printLink");
	me.debugModeChkTag = $("#debugModeChk");
	me.expandAllTag = $("#expandAll");

	me.errorMsgTbTag = $("#errorMsgTb");
	me.errorMsgTag = $("#errorMsg");

	me.nextAssessmentTag = $("#nextAssessment");
	me.eventDataDivTag = $("#eventDataDiv");
	me.ouNameTag = $("#ouName");
	me.eventNameTag = $("#eventName");
	me.eventDateTag = $("#eventDate");
	me.showFailQuestionsTag = $("#showFailQuestions");
	me.eventDetailsTbTag = $("#eventDetailsTb");
	me.storedByTag = $("#storedBy");
	
	me.initialSetup = function()
	{
		MsgManager.appBlock( "Processing ..");
		me.setUp_Events();
		me.checkAndLoadEventDetails();
	};
	
	me.setUp_Events = function()
	{
		me.showFailQuestionsTag.change( function(){
			
			// Hide PASS questions
			if( $(this).prop("checked") )
			{
				me.eventDetailsTbTag.find("[isPass='true']").each(function(){
					var deId = $(this).attr("deId");
					$(this).hide();
					me.eventDetailsTbTag.find("tr[descripDeId='" + deId + "']" ).hide();
				});
			}
			else if( eval( me.expandAllTag.val() ) )
			{
				me.eventDetailsTbTag.find("tr[deId]").show();
			}
		});
		
		me.collapseAllLinkTag.click( function(){
			me.expandAllTag.val("false");
			me.eventDataDivTag.find("tr.question").hide();
			me.eventDataDivTag.find("tr[descripDeId]").hide();
			me.collapseAllLinkTag.hide();
			me.expandAllLinkTag.show();
		});
		
		me.expandAllLinkTag.click( function(){
			me.expandAllTag.val("true");
			me.eventDataDivTag.find("tr.question").show();
			me.showFailQuestionsTag.change();
			me.collapseAllLinkTag.show();
			me.expandAllLinkTag.hide();
		});
		
		me.debugModeChkTag.change( function(){
			var checked = me.debugModeChkTag.prop("checked");
			if( checked )
			{
				me.eventDataDivTag.find("span.deIdLink").show();
			}
			else
			{
				me.eventDataDivTag.find("span.deIdLink").hide();
			}
		});
		
		me.printLinkTag.click( function(){
			
			// Resolve display data
			var body = $("<div>" + $("body").html() + "</div>");
			
			// Hide description
			body.find("[deId]").show();
			body.find("[descripdeId]").hide(); 
			
			//Hide PRINT button and Hide the "Collapse All"/"Expand All" and "Only show failed questions"
			body.find(".controlBar").hide();
			body.find("#printLink").hide();
			
			// Hide data element ids
			body.find(".deIdLink").hide();
			
			// Hide debug mode control
			body.find("#debugModeChk").closest( "div" ).hide();
			
			// Print
			var mywindow = window.open('', 'PRINT', 'height=400,width=600');
			
			mywindow.document.write('<html><head>');
			mywindow.document.write('<link rel="stylesheet" href="css/style.css">');
			mywindow.document.write('</head><body >');
			mywindow.document.write( body.html() );
			mywindow.document.write('</body></html>');
			
			
			setTimeout(function () {
				
			
				
				mywindow.document.close(); // necessary for IE >= 10
				mywindow.focus(); // necessary for IE >= 10*/
				
				mywindow.print();
				mywindow.close();
	        }, 500);
			
		})
	};
	
	// --------------------------------------------------------------------------
	// Load data
	
	me.checkAndLoadEventDetails = function()
	{
		var eventId = Util.getParameterByName( "eventId" );
		
		// check eventId
		if( eventId == null || eventId == "" )
		{
			me.errorMsgTag.html("Event id is missing in URL");
			MsgManager.appUnblock();
		}
		else 
		{	
			me.loadEventDetails( eventId, me.getServerParam() );
		}
	};
	
	me.getServerParam = function()
	{
		var server = Util.getParameterByName( "server" );
		if( server == null || server === "" )
		{
			server = "https://data.psi-mis.org";
		}
		else if( server.lastIndexOf("/") == server.length - 1 )
		{
			server = server.substring(0, server.length - 1 );
		}
		
		return server;
	};
	
	me.loadEventDetails = function( eventId, server )
	{
		var url =  me._query_EventDetails;
		url = url.replace( me.PARAM_EVENTID, eventId );
		url = url.replace( me.PARAM_SERVER, server );
		
		RESTUtil.getAsyncData( url
			, function( json ){
				
				me.storedByTag.html( json.user.users[0].displayName );
				var programName = json.deList.program.name;
			
				// STEP 1. Populate orgunitName, program name, ...
				me.ouNameTag.html( json.ou.name );
				me.eventNameTag.html( programName );
//				document.title = programName;
				
				// STEP 2. Build event table
				me.buildEventDataTable( json.deList.programStageDataElements );
				
				// STEP 3. Populate event data
				me.populateEventData( json.event, me.optionSet );
				me.eventDataDivTag.show();
				me.errorMsgTbTag.hide();
				
				MsgManager.appUnblock();
			}, function( data, b ){
				
				if( data.responseText == "" )
				{
					me.errorMsgTag.html("Server " + server + " not found - server could be offline.");
				}
				else
				{
					var jsonResponse = JSON.parse( data.responseText )
				
					var statusCode = jsonResponse.httpStatusCode;
					if( statusCode == 404 ) // STATUS_EVENT_NOTEXIST
					{	
						me.errorMsgTag.html("Event " + eventId + " doesn’t exist in server " + server );
					}
					else if( statusCode == 401 ) // STATUS_ACCOUNT_ISSUE
					{	
						me.errorMsgTag.html("Failed to authenticate in server " + server );
					}
				}
				
				me.eventDataDivTag.show();
				MsgManager.appUnblock();
			}); 
	};
	
	me.buildEventDataTable = function( json_DataElements )
	{
		var data = me.resolveDataElements( json_DataElements );
		
		var compScoreList = data.compScoreList;
		var deList = data.deList;
		
		for( var i in compScoreList )
		{
			var compScoreKey = compScoreList[i];
			var comScoreDe = deList[compScoreKey];
			
			// STEP 1. Create row for TOP data element
			me.addDataRow( comScoreDe, compScoreKey, true );
			
			// STEP 2. Create the rows the SUB question if any
			var subQuestions = comScoreDe.subQuestions;
			if( subQuestions.length > 0  )
			{
				for( var j in subQuestions )
				{
					me.addDataRow( subQuestions[j], compScoreKey, false );
				}
			}
		}
	};
	
	me.resolveDataElements = function( json_DataElements )
	{
		var compScoreDeList = {};
		var compScoreList = [];
		
		for( var i in json_DataElements )
		{
			var dataElement = json_DataElements[i].dataElement;
			dataElement.compulsory = json_DataElements[i].compulsory;
			
			
			// Get option set if any
			if( dataElement.optionSet != undefined )
			{
				me.optionSet[dataElement.id] = dataElement.optionSet.options;
			}
			
			var attrValues = dataElement.attributeValues;
			for( var j in attrValues )
			{
				var attrValue = attrValues[j];
				
				// STEP 1. Get "Compositive Score" data elements
				if( attrValue.attribute.id == me.ATTR_ID_DeType && attrValue.value == me.ATTR_ID_DeType_COMPOSITE_SCORE )
				{
					var compScore = me.getAttribute( attrValues, me.ATTR_ID_CompositiveScoreValue ).value;

					// STEP 2. Save "Compositive Score" key in list
					compScoreList.push( compScore );
					
					// STEP 3. Add compScore in font of formName of data element if score is not "0"
					if( compScore !== "0")
					{
						dataElement.displayFormName = compScore + " " + dataElement.displayFormName;
					}
					
					//STEP 4. Get questions which belong to this TOP question
					dataElement.subQuestions = [];	
					dataElement.subQuestions = me.getQuestionsByCompScore( json_DataElements, compScore );
			
					//STEP 5. Add TOP question in result list
					compScoreDeList[compScore] = dataElement;
					
				}
			}
			
		}
		
		return {
			"compScoreList" : compScoreList.sort()
			,"deList": compScoreDeList
		};
	};
	
	me.addDataRow = function( dataElement, compScore, isCompScoreDE )
	{
		if( isCompScoreDE )
		{
			me.addCompScoreDERow( dataElement, compScore );
		}
		else
		{
			me.addDataValueRow( dataElement, compScore );
		}
		
		me.addDecriptionRow( dataElement );
	};
	
	me.addCompScoreDERow = function( dataElement, compScore )
	{
		var subHeaderLevel = compScore.split(".").length;
		var clazz = ( subHeaderLevel === 2 ) ? "table_details__subtitle" : "table_details__title";
		var server = me.getServerParam();
		var editDeLink = server + "/dhis-web-maintenance/#/edit/dataElementSection/dataElement/" + dataElement.id;
		var aLinkTag = "<span style='font-style:italic;display:none;' class='deIdLink'><a href='" + editDeLink +"' target='_blank'>(" + dataElement.id + ")</a></span>";
		
		
		var rowTag = $("<tr deId='" + dataElement.id + "' showed='true'></tr>");
		rowTag.append( "<td class='" + clazz + "'>" + dataElement.displayFormName + "<br>" + aLinkTag + "</td>" );
		rowTag.append( "<td class='" + clazz + "'></td>" );
		rowTag.append( "<td class='" + clazz + "'><span class='value' style='value scoreValue table_details__percent f_right'></span></td>" );
		
		me.eventDetailsTbTag.append( rowTag );
		
		me.setUp_CompScoreHeaderOnClick( rowTag, compScore );
	};
	
	me.setUp_CompScoreHeaderOnClick = function( rowTag, compScore )
	{
		if( compScore.indexOf(".") >= 0 )// Only apply onClick event for subHeader, such as 1.1, 1.2, 1.2.3, ...
		{
			rowTag.css("cursor", "pointer");
			rowTag.click( function(){
		
				var showed = eval( rowTag.attr("showed") );
				rowTag.attr( "showed", !showed );
				if( showed )
				{
					me.eventDetailsTbTag.find("tr[compScoreKey='" + compScore + "']").hide("fast");
				}
				else
				{
					me.eventDetailsTbTag.find("tr[compScoreKey='" + compScore + "']").show("fast");
				}
			});
		}
	};
	
	
	me.addDataValueRow = function( dataElement, compScore )
	{
		var server = me.getServerParam();
		var editDeLink = server + "/dhis-web-maintenance/#/edit/dataElementSection/dataElement/" + dataElement.id;
		var aLinkTag = "<span style='font-style:italic;display:none;' class='deIdLink'><a href='" + editDeLink +"' target='_blank'>(" + dataElement.id + ")</a></span>";
		var compulsoryTag = ( dataElement.compulsory ) ? "<span style='color:red;'> *</span>" : "";
		
		var rowTag = $("<tr compScoreKey='" + compScore + "' class='question' deId='" + dataElement.id + "' style='cursor:pointer;'  isPass='true'></tr>");
		rowTag.append( "<td class='table_details__child'><span class='deName'>" + dataElement.displayFormName + "</span>" + compulsoryTag + "<br>" + aLinkTag + "</td>" );
		rowTag.append( "<td class='value realValue table_details__child'></td>" );
		rowTag.append( "<td class='status table_details__child'></td>" );
		
		
		me.eventDetailsTbTag.append( rowTag );
		
		me.setUp_DecriptionRowToggle( rowTag );
	};
	

	me.addDecriptionRow = function( dataElement )
	{
		if( dataElement.description != undefined )
		{
			var rowTag = $("<tr style='display:none;' class='table_details__question' descripDeId='" + dataElement.id + "'></tr>");
			rowTag.append( "<td colspan='3'>" + dataElement.description + "</td>" );
			
			me.eventDetailsTbTag.append( rowTag );
		}
	};
	
	me.setUp_DecriptionRowToggle = function( rowTag ){
		rowTag.find("span.deName").click( function(){
			var deId = rowTag.attr("deId");
			me.eventDetailsTbTag.find( "tr[descripDeId='" + deId + "']" ).toggle();
		});
		
	};
	
	me.getQuestionsByCompScore = function( json_DataElements, compScore )
	{
		var list = [];
		for( var i in json_DataElements )
		{
			var dataElement = json_DataElements[i].dataElement;
			var attrValues = dataElement.attributeValues;
			
			var searched = me.getAttribute( attrValues, me.ATTR_ID_DeType );
			var isQuestion = ( searched !== undefined && searched.value == me.ATTR_ID_DeType_QUESTION ); // "Question" Data element
			
			if( isQuestion )
			{
				var deQuestion = me.getAttribute( attrValues, me.ATTR_ID_CompositiveScoreValue );
				
				if( deQuestion !== undefined && deQuestion.value == compScore )
				{
					list.push( dataElement );
				}
			}
		}
		
		return list;
	};
	
	me.getAttribute = function( attributeValues, attrId )
	{
		for( var i in attributeValues )
		{
			var attrValue = attributeValues[i];
			
			if( attrValue.attribute.id == attrId )
			{
				return attrValue;
			}
		}
		
		return;
	};
	
	// Populate event data values
	me.populateEventData = function( eventData, optionSet )
	{	
		// STEP 1. Populate eventDate
		me.eventDateTag.html( Util.formatDate( eventData.eventDate ) );
		
		// STEP 2. Populate data value
		var dataValues = eventData.dataValues;
		var nextAssessmentVal = "None";
		
		for( var i in dataValues )
		{
			var dataValue = dataValues[i];
			if( dataValue.dataElement == me.DE_ID_AssessmentScheduled  )
			{
				nextAssessmentVal = Util.formatDate( dataValue.value );
			}
			
			var valueTag = me.eventDataDivTag.find("[deId='" + dataValue.dataElement + "']").find(".value");
			
			if ( valueTag.length > 0 )
			{
				var value = dataValue.value;
				
				var optionList = optionSet[dataValue.dataElement];
				if( optionList != undefined )
				{
					var searched = Util.findItemFromList( optionList, "code", value );
					if( searched != undefined )
					{
						value = searched.name;
					}
				}
			
				if( valueTag.hasClass("realValue" ) )
				{
					value = ( value == 1 ) ? "Yes" : "No";
					valueTag.html( value );
					
					var statusValueTag = ( dataValue.value == "1" ) ? "<span class='status_pass f_right'>PASS</span>" : "<span class='status_fail f_right'>FAIL</span>";
					var statusTag = me.eventDetailsTbTag.find("tr[deId='" + dataValue.dataElement + "']").find(".status");
					statusTag.append( statusValueTag );
					statusTag.closest("tr").attr("isPass", ( dataValue.value == "1" ) );
				}
				else if( dataValue.dataElement == me.DE_ID_ActionDueDate_1 
						|| dataValue.dataElement == me.DE_ID_ActionCompletionDate_1 
						|| dataValue.dataElement == me.DE_ID_ActionDueDate_2 
						|| dataValue.dataElement == me.DE_ID_ActionCompletionDate_2 
						|| dataValue.dataElement == me.DE_ID_ActionDueDate_3 
						|| dataValue.dataElement == me.DE_ID_ActionCompletionDate_3 )
				{
					valueTag.html( Util.formatDate( value ) );
				}
				else if( dataValue.dataElement == me.DE_ID_Gap
						|| dataValue.dataElement == me.DE_ID_Competency 
						|| dataValue.dataElement == me.DE_ID_ActionPlan
						|| dataValue.dataElement == me.DE_ID_Action1_1 
						|| dataValue.dataElement == me.DE_ID_ActionResponsible_1 
						|| dataValue.dataElement == me.DE_ID_Action_2_1 
						|| dataValue.dataElement == me.DE_ID_ActionResponsible_2 
						|| dataValue.dataElement == me.DE_ID_Action_3_1 
						|| dataValue.dataElement == me.DE_ID_ActionResponsible_3 )
				{
					valueTag.html( value );
				}
				else
				{
					me.setScoreValueAndColor( valueTag, value );
				}
			}
		
			me.nextAssessmentTag.text( nextAssessmentVal );
			
		}
		
		// Add FAIL status for NULL data values
		me.eventDetailsTbTag.find(".status:empty").each(function(){
			$(this).append( "<span style='color:#bfb9b9;float:right;'>NA</span>" );
		});
		
	};
	
	me.setScoreValueAndColor = function( valueTag, value )
	{
		if( value != "" )
		{
			value = eval( value );
			var color = "";
			
			if( value >= 90 )
			{
				color = "c_green";
			}
			else if( value >= 80 )
			{
				color = "c_yellow";
			}
			else
			{
				color = "c_red";
			}
			
			valueTag.addClass("scoreValue", true);
			valueTag.addClass( color );
			valueTag.html( value + "%" );
		}
	}
	
	
	// --------------------------------------------------------------------------
	// RUN init method
	
	me.initialSetup();
	
}


