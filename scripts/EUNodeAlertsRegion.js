define(function () {
	
	var controllerObject;
	var selectedNodeId;
	var thisRegion;
	var selectedSessionId;
	

	return {
		Render: function(parentDiv) {
				    

		    thisRegion = this;
		    //the buttons in the tab content events are not binding properly for some reason.
            //in order to work properly the below mutationObserver is needed.
		    var onAppend = function (elem, f) {
		        var observer = new MutationObserver(function (mutations) {
		            mutations.forEach(function (m) {
		                if (m.addedNodes.length) {
		                    f(m.addedNodes);
		                    observer.disconnect();
		                }
		            })
		        })
		        observer.observe(elem, { childList: true })
		    };

	

			var tab = '<b-tabs id = "alertTabs" selected="0"> \
						<b-tab for="nodealertdiv">Node Alerts</b-tab> \
						<b-tab for="trackingdiv">Tracking Info </b-tab> \
						<b-tab for="sysalertsdiv">System Alerts </b-tab> \
						</b-tabs>' 
			
			onAppend(parentDiv, function (added) {
			    var tabs = document.getElementById("alertTabs");
			    tabs.addEventListener("b-activate", tabActivated);
			    
			})

			parentDiv.innerHTML = tab;

			//Node Alerts
			var nodealertdiv = document.createElement('div');
			nodealertdiv.id = "nodealertdiv";
			nodealertdiv.className = "tab-content";
			parentDiv.appendChild(nodealertdiv);
	    
			
			var tbl = '<u-table-column-toggle for="nodealerts"></u-table-column-toggle> \
                <table is="u-table" id="nodealerts" sortable class="table table-striped table-bordered table-hover dataTable" role="grid" aria-describedby="datatable3_info" style="width: 100%;" width="100%"> \
					<thead is="u-thead"> \
						<tr>	\
							<th data-key="alerttime" data-show="true"> \
								<button>Alert Time</button> \
							</th>	\
							<th data-key="description" data-show="true"> \
								<button>Description</button> \
                            </th> \
                            <th data-key="sessionid" data-show="false"> \
								<button>SessionId</button> \
							</th> \
						</tr> \
					</thead> \
				</table>'
				
			//need to add EventListener for the 'table-initialize' event 
			//for the parent element of the webcomponent.
			//nodealertdiv.addEventListener("table-initialize", refreshAlert);
			nodealertdiv.innerHTML =  tbl + "<BR></BR>";
            
		    //Refresh button in Alerts tab
			var btn = document.createElement("BUTTON");
			var txt = document.createTextNode("Refresh");
			btn.setAttribute("id", "refreshalert");
			btn.appendChild(txt);
			onAppend(nodealertdiv, function (added) {
			    var btn = document.querySelector('#refreshalert');
			    btn.addEventListener('click', refreshAlert);
			})
            nodealertdiv.appendChild(btn);
			
			
			//tracking Info
			var trackingdiv = document.createElement('div');
			trackingdiv.id = "trackingdiv";
			trackingdiv.className = "tab-content";
			parentDiv.appendChild(trackingdiv); 
			
			var tracktbl = '<u-table-column-toggle for="tracking"></u-table-column-toggle> \
                <table is="u-table" id="tracking" sortable class="table table-striped table-bordered table-hover dataTable" role="grid" aria-describedby="datatable3_info" style="width: 100%;" width="100%"> \
				<thead is="u-thead"> \
					<tr>	\
						<th data-key="nodedisplayname" data-show="true"> \
							<button>Node Display Name</button> \
						</th>	\
						<th data-key="starttime" data-show="true"> \
							<button>Start Time</button> \
						</th> \
                        <th data-key="sessionid" data-show="false"> \
							<button>SessionId</button> \
						</th> \
					</tr> \
				</thead> \
			</table>'
				
			//need to add EventListener for the 'table-initialize' event 
			//for the parent element of the webcomponent.
			//trackingdiv.addEventListener("table-initialize", PopulateTrackingInfo);
			trackingdiv.innerHTML = tracktbl + "<BR></BR>";
			
		    //Refresh button in tracking info tab
			var btn = document.createElement("BUTTON");
			var txt = document.createTextNode("Refresh");
			btn.setAttribute("id", "refreshtrack");
			btn.appendChild(txt);
			onAppend(trackingdiv, function (added) {
			    var btn = document.querySelector('#refreshtrack');
			    btn.addEventListener('click', refreshTrackingInfo);
			})
			trackingdiv.appendChild(btn);

			


			//System Alerts
			var sysalertsdiv = document.createElement('div');
			sysalertsdiv.id = "sysalertsdiv";
			sysalertsdiv.className = "tab-content";
			parentDiv.appendChild(sysalertsdiv); 
			
			var sysalertstbl = '<u-table-column-toggle for="sysalerts"></u-table-column-toggle> \
                <table is="u-table" id="sysalerts" sortable class="table table-striped table-bordered table-hover dataTable" role="grid" aria-describedby="datatable3_info" style="width: 100%;" width="100%"> \
				<thead is="u-thead"> \
					<tr>	\
						<th data-key="alerttime" data-show="true"> \
							<button>Alert Time</button> \
						</th>	\
						<th data-key="description" data-show="true"> \
							<button>Description</button> \
						</th> \
                        <th data-key="sessionid" data-show="false"> \
							<button>SessionId</button> \
						</th> \
					</tr> \
				</thead> \
			</table>'
				
			//need to add EventListener for the 'table-initialize' event 
			//for the parent element of the webcomponent.
			//sysalertsdiv.addEventListener("table-initialize", PopulateSystemAlerts);
			sysalertsdiv.innerHTML = sysalertstbl + "<BR></BR>";
		    //Refresh button in system alerts tab
			var btn = document.createElement("BUTTON");
			var txt = document.createTextNode("Refresh");
			btn.setAttribute("id", "refreshsysalerts");
			btn.appendChild(txt);
			onAppend(sysalertsdiv, function (added) {
			    var btn = document.querySelector('#refreshsysalerts');
			    btn.addEventListener('click', refreshSystemAlerts);
			})
			sysalertsdiv.appendChild(btn);

			
			//this line is needed to render the controls inside the tab properly.
			parentDiv.innerHTML = parentDiv.innerHTML;
            //for hiding columns initially
			var alertTable = document.getElementById('nodealerts');
			alertTable.data = [];
			var trackTable = document.getElementById('tracking');
			trackTable.data = [];
			var sysalertTable = document.getElementById('sysalerts');
			sysalertTable.data = [];

			//tracking info table click event handler
		    //$("#tracking tbody tr").click(function () {
			$(document).on('click', '#tracking tbody tr', function () {
			    $(this).addClass('selected').siblings().removeClass('selected');
			    //var value = $(this).find('td')[1].textContent;
			    selectedSessionId = $(this).find('td').eq(2).text();
			    if (selectedSessionId != null && selectedSessionId.length > 0)
			    {
			        PostPredictivePatternRequest("Overlay", "SessionTrace", Resources.POPULATE_TIMELINE_INFO, true, selectedSessionId);
			    }
			});

		    

		},
		
		Controller: function(object){
			controllerObject = object;
		},
		
		MesageFromParent: function (message, messageInfo) {
			
		    switch (message) {

		        case KnownMessages.PredictivePatternInfoAvailable:

		            if (messageInfo.RequestId == Resources.POPULATE_NODE_ALERTS) {
		                PopulateAlerts(messageInfo, "nodealerts");
		            }
		            else if (messageInfo.RequestId == Resources.POPULATE_SYSTEM_ALERTS) {
		                PopulateAlerts(messageInfo, "sysalerts");
		            }
		            else if (messageInfo.RequestId == Resources.POPULATE_TRACKING_INFO) {
		                PopulateTrackingInfo(messageInfo);
		            }
		            
		            break;

		        case Resources.NODE_SELECTED_MESSAGE:

		            selectedNodeId = messageInfo.Content["NodeId"];  
		            PostPredictivePatternRequest("Overlay", "NodeAlert", Resources.POPULATE_NODE_ALERTS, true, selectedNodeId);
                    	            
		            break;

		    }
			
		}
	
	};
	
	function PostPredictivePatternRequest(nodeUniqueName, nodeContextLabel, requestId, rowFilterById, rowFilterId) {

	    var getPPArg = new GetNodePredictivePatternInformationArg();
	    getPPArg.NodeUniqueName = nodeUniqueName;
	    getPPArg.ContextLabelName = nodeContextLabel;
	    getPPArg.RequestId = requestId;
	    getPPArg.RowFilterById = rowFilterById;
	    getPPArg.RowFilterId = rowFilterId;

	    PostRequest(thisRegion, KnownRequests.GetNodePredictivePatternInformation, getPPArg);

	};

	function PostRequest(sender, requestName, requestDetails) {
	    controllerObject.RequestFromChild(sender, requestName, requestDetails);
	};

	function PopulateAlerts(ppAvailable, type) {

	    var results;
	    var sessionId, nodeUniqueName, alertTime, alertType, alertDescription, contextName;
	    var alertInfo = [];
	    var info = {};

	    for (j = 0; j < ppAvailable.Results.Results.length; j++) {
	        results = ppAvailable.Results.Results[j];

	        sessionId = "";
	        for (i = 0; i < results.length; i++) {

	            if (results[i].Key == "NodeAlert.SessionId") {
	                sessionId = results[i].Value;
	            }

	            if (results[i].Key == "NodeAlert.NodeUniqueName") {
	                nodeUniqueName = results[i].Value;
	            }

	            if (results[i].Key == "NodeAlert.TimeOfAlert") {
	                alertTime = results[i].Value;
	            }

	            if (results[i].Key == "NodeAlert.AlertType") {
	                alertType = results[i].Value;
	            }

	            if (results[i].Key == "NodeAlert.AlertDescription") {
	                alertDescription = results[i].Value;
	            }

	            if (results[i].Key == "NodeAlert.ContextName") {
	                contextName = results[i].Value;
	            }

	        }

	        if (sessionId != "") {
                
	            info = {};
	            info["alerttime"] = JSONDateWithTime(alertTime);
	            info["description"] = alertDescription;
	            info["sessionid"] = sessionId;
	            alertInfo.push(info);

	        }
	        
	    }

	    if (type.toLowerCase() == "nodealerts") {
	        var table = document.getElementById('nodealerts');
	        table.data = alertInfo;
	    }
	    else if (type.toLowerCase() == "sysalerts") {
	        var systable = document.getElementById('sysalerts');
	        systable.data = alertInfo;
	    }
	    

	};
    	
	function PopulateTrackingInfo(ppAvailable) {

	    var results;
	    var sessionId, nodeDisplayName, startTime;
	    var trackInfo = [];
	    var info = {};

	    for (j = 0; j < ppAvailable.Results.Results.length; j++) {
	        results = ppAvailable.Results.Results[j];

	        sessionId = "";
	        for (i = 0; i < results.length; i++) {

	            if (results[i].Key == "SessionsList") {
	                sessionId = results[i].Value;
	            }
                
	            if (results[i].Key == "SessionsList.NodeDisplayName") {
	                nodeDisplayName = results[i].Value;
	            }

	            if (results[i].Key == "SessionsList.TimeOfStart") {
	                startTime = results[i].Value;
	            }

	        }

	        if (sessionId != "") {

	            info = {};
	            info["nodedisplayname"] = nodeDisplayName;
	            info["starttime"] = JSONDateWithTime(startTime);
	            info["sessionid"] = sessionId;
	            trackInfo.push(info);

	        }

	    }

	    var trackTable = document.getElementById('tracking');
	    trackTable.data = trackInfo;

	    //select the first row
	    $('#tracking tbody td:first-child').eq(0).click();
	    

	};

	function refreshAlert() {
	    PostPredictivePatternRequest("Overlay", "NodeAlert", Resources.POPULATE_NODE_ALERTS, true, selectedNodeId);
	};

	function refreshTrackingInfo() {
	    PostPredictivePatternRequest("Overlay", "SessionsList", Resources.POPULATE_TRACKING_INFO, true, "{00000000-0000-0000-0000-000000000000}");
	};

	function refreshSystemAlerts() {
	    var _systemAlertId = "{D5832278-169A-4F6F-8450-724BB22EF596}";
	    PostPredictivePatternRequest("Overlay", "NodeAlert", Resources.POPULATE_SYSTEM_ALERTS, true, _systemAlertId);
	};
    	
	function tabActivated(e) {
	    
	    var pageName;

	    switch (e.detail.item) {
	        case 0:
	            pageName = "nodealerts";
	            break;
	        case 1:
	            pageName = "trackinginfo";
	            break;
	        case 2:
	            pageName = "sysalerts";
	            break;

	    }
        	    

	    var bdEventData = new BroadcastEventData();
	    var temp = {};
	    temp["NodeAlertRegionSelectedTabName"] = pageName;
	    bdEventData.Content = temp;
	    PostRequest(thisRegion, Resources.NODE_ALERT_REGION_SELECTED_TAB, bdEventData);


	};

	
});