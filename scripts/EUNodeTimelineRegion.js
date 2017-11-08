define(function () {
	
    var controllerObject;
    var thisRegion;
    var rowSelectionDueToMapViewSelection = false;
    var dontRequestTimelineToNodeIdSelectInfo;
	
	return {
		Render: function(parentDiv) {

		    thisRegion = this;
						
			
		    var tbl = '<u-table-column-toggle for="timeline"></u-table-column-toggle> \
                <table is="u-table" id="timeline" sortable class="table table-striped table-bordered table-hover dataTable" role="grid" aria-describedby="datatable3_info" style="width: 100%;" width="100%"> \
				<thead is="u-thead"> \
					<tr>	\
						<th data-key="sessionId" data-show="false"> \
							<button>Session Id</button> \
						</th>	\
						<th data-key="fromNodeId" data-show="false"> \
							<button>From Node Id</button> \
						</th> \
						<th data-key="fromNodeDisplayName" data-show="true"> \
							<button>From Node Display Name</button> \
						</th> \
						<th data-key="toNodeId" data-show="false"> \
							<button>To Node Id</button> \
						</th> \
                        <th data-key="toNodeDisplayName" data-show="true"> \
							<button>To Node Display Name</button> \
						</th> \
                        <th data-key="stateInfoId" data-show="false"> \
							<button>State Info Id</button> \
						</th> \
                        <th data-key="transitionTime" data-show="true"> \
							<button>Transition Time</button> \
						</th> \
						<th data-key="isExternal" data-show="true"> \
							<button>External</button> \
						</th> \
                        <th data-key="fromNodeUniqueName" data-show="false"> \
							<button>From Node Unique Name</button> \
						</th> \
                        <th data-key="toNodeUniqueName" data-show="false"> \
							<button>To Node Unique Name</button> \
						</th> \
					</tr> \
				</thead> \
			</table>'

			
				
			//need to add EventListener for the 'table-initialize' event 
			//for the parent element of the webcomponent.
			//parentDiv.addEventListener("table-initialize", PopulateTimeline);
			parentDiv.innerHTML = tbl;
			
		    //timeline table click event handler
			$(document).on('click', '#timeline tbody tr', function () {
			    $(this).addClass('selected').siblings().removeClass('selected');

			    var selectedStateInfoId, selectedSessionId, selectedStateToNodeUniqueName, selectedTimelineToNodeId;
			    selectedStateInfoId = $(this).find('td').eq(5).text();
			    selectedSessionId = $(this).find('td').eq(0).text();
			    selectedStateToNodeUniqueName = $(this).find('td').eq(9).text();
			    selectedTimelineToNodeId = $(this).find('td').eq(3).text();
			    

			    if (selectedStateInfoId != null && selectedStateInfoId.length > 0) {
			        PopulateStateInformation(selectedStateInfoId, selectedSessionId, selectedStateToNodeUniqueName, selectedTimelineToNodeId);
			    }
			});
			
            //for some reason for the first time we need to hide the table. 
			var timeTable = document.getElementById('timeline');
			timeTable.style.display = "none";
			timeTable.data = [];
		},
		
		Controller: function(object){
			controllerObject = object;
		},
		
		MesageFromParent: function (message, messageInfo) {
			
		    switch (message) {

		        case KnownMessages.PredictivePatternInfoAvailable:

		            if (messageInfo.RequestId == Resources.POPULATE_TIMELINE_INFO) {
		                PopulateTimelineInfo(messageInfo);
		            }

		            break;
		        case Resources.NODE_SELECTED_MESSAGE:

		            selectedNodeId = messageInfo.Content["NodeId"];
		            var nodeSelectedFromTimeline = messageInfo.Content["NodeSelectedFromTimeline"];
		            if (nodeSelectedFromTimeline == true) {
		                return;
		            }

		            rowSelectionDueToMapViewSelection = true;
		            SelectedTimelineGridNode(selectedNodeId);
		            rowSelectionDueToMapViewSelection = false;
		            break;
		        		        
		        case Resources.NODE_ALERT_REGION_SELECTED_TAB:

		            var selectedTabInfo;
		            selectedTabInfo = messageInfo.Content["NodeAlertRegionSelectedTabName"];
                    
		            var timeTable = document.getElementById('timeline');

		            if (selectedTabInfo == "nodealerts" || selectedTabInfo == "sysalerts") {
		                timeTable.style.display = "none";
		            }
		            else {
		                timeTable.style.display = "table";
		               
		            }
                    		            
		            break;

		    }
			
		}
	
	};
	
	function SelectedTimelineGridNode(toNodeId)
	{
	    //select the row in the time line grid based on the passed in toNodeId
	    $('#timeline tbody td:nth-child(4)').filter(function () {
	        
	        if (this.textContent.trim() == toNodeId) {
	            this.click();
	        }
	    });
	    
	    
	};

	function PopulateTimelineInfo(ppAvailable) {

	    var results;
	    var sessionId, fromNodeId, fromNodeDisplayName, toNodeId, toNodeDisplayName, stateInfoId, transitionTime, isExternal;
	    var fromNodeUniqueName, toNodeUniqueName;
	    var timeInfo = [];
	    var info = {};

	    for (j = 0; j < ppAvailable.Results.Results.length; j++) {
	        results = ppAvailable.Results.Results[j];

	        sessionId = "";
	        for (i = 0; i < results.length; i++) {

	            if (results[i].Key == "SessionTrace") {
	                sessionId = results[i].Value;
	            }

	            if (results[i].Key == "SessionTrace.FromNodeId") {
	                fromNodeId = results[i].Value;
	            }

	            if (results[i].Key == "SessionTrace.FromNodeDisplayName") {
	                fromNodeDisplayName = results[i].Value;
	            }

	            if (results[i].Key == "SessionTrace.ToNodeId") {
	                toNodeId = results[i].Value;
	            }

	            if (results[i].Key == "SessionTrace.ToNodeDisplayName") {
	                toNodeDisplayName = results[i].Value;
	            }

	            if (results[i].Key == "SessionTrace.StateInfoId") {
	                stateInfoId = results[i].Value;
	            }

	            if (results[i].Key == "SessionTrace.TimeOfTransition") {
	                transitionTime = results[i].Value;
	            }

	            if (results[i].Key == "SessionTrace.IsExternal") {
	                isExternal = results[i].Value;
	            }

	            if (results[i].Key == "SessionTrace.FromNodeUniqueName") {
	                fromNodeUniqueName = results[i].Value;
	            }

	            if (results[i].Key == "SessionTrace.ToNodeUniqueName") {
	                toNodeUniqueName = results[i].Value;
	            }
	        }

	        if (sessionId != "") {

	            info = {};
	            info["sessionId"] = sessionId;
	            info["fromNodeId"] = fromNodeId;
	            info["fromNodeDisplayName"] = fromNodeDisplayName;
	            info["toNodeId"] = toNodeId;
	            info["toNodeDisplayName"] = toNodeDisplayName;
	            info["stateInfoId"] = stateInfoId;
	            info["transitionTime"] = JSONDateWithTime(transitionTime);
	            info["isExternal"] = isExternal;
	            info["fromNodeUniqueName"] = fromNodeUniqueName;
	            info["toNodeUniqueName"] = toNodeUniqueName;
	            timeInfo.push(info);
	        }

	    }

	    var timelineTable = document.getElementById('timeline');
	    timelineTable.data = timeInfo;

	    //select the first row if exists
	    var temp = $('#timeline tbody tr');
	    if (temp != null && temp.length > 0) {
	        //$('#timeline tbody tr')[0].trigger('click');
	        dontRequestTimelineToNodeIdSelectInfo = true;
	        $('#timeline tbody tr')[0].click();
	    }

	};

	function PostRequest(sender, requestName, requestDetails) {
	    controllerObject.RequestFromChild(sender, requestName, requestDetails);
	};

	function PopulateStateInformation(selectedStateInfoId, selectedSessionId, selectedStateToNodeUniqueName, selectedTimelineToNodeId) {
	    
	    if (selectedStateInfoId != null)
	    {
	        var getSessionStateInformationArg = new GetSessionStateInformationArg();
	        getSessionStateInformationArg.StateInfoId = selectedStateInfoId;
	        getSessionStateInformationArg.SessionId = selectedSessionId;
	        getSessionStateInformationArg.RequestId = Resources.POPULATE_STATE_INFO;
	        getSessionStateInformationArg.NodeUniqueName = selectedStateToNodeUniqueName;

	        PostRequest(thisRegion, KnownRequests.GetSessionStateInformation, getSessionStateInformationArg);

	        if (rowSelectionDueToMapViewSelection == true)
	        {
	            return;
	        }
	        
	        if (dontRequestTimelineToNodeIdSelectInfo != true) {
	            var bdEventData = new BroadcastEventData();
	            var temp = {};
	            temp["TimeLineToNodeId"] = selectedTimelineToNodeId;
	            bdEventData.Content = temp;
	            PostRequest(thisRegion, Resources.TIMELINE_TONODEID_SELECT_INFO, bdEventData);
            }
	        else {
	            dontRequestTimelineToNodeIdSelectInfo = false;
	        }
	        
	    }
	}
	
});