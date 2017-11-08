define(function () {
	
    var thisController;
	var launcherObject;
	var allRegions = [];
	
	return {
	    Launcher: function (object) {
	        thisController = this;
			launcherObject = object;
		},
		
		Region: function(object){
			allRegions.push({"RegionObject" : object});
		},
		
		MesageFromParent: function (message, messageInfo){
			
		    switch (message) {

		        case KnownMessages.PredictivePatternInfoAvailable:
		        case Resources.NODE_SELECTED_MESSAGE:
		        case KnownMessages.SessionStateInfoAvailable:
		        case Resources.TIMELINE_TONODEID_SELECT_INFO:
		        case Resources.NODE_ALERT_REGION_SELECTED_TAB:

		            allRegions.forEach(function (region) {

		                var regObject = region.RegionObject;
		                regObject.MesageFromParent(message, messageInfo);

		            });
		            break;

		    }
			
		}, 
		
		RequestFromChild: function (sender, requestName, requestDetails) {
			
		    switch (requestName) {
		        
		        case Resources.NODE_SELECTED_MESSAGE:
		        case Resources.TIMELINE_TONODEID_SELECT_INFO:
		        case Resources.NODE_ALERT_REGION_SELECTED_TAB:
		            PostBroadcastEventRequest(requestName, requestDetails);
		            break;

		        default:
		            PostRequest(thisController, requestName, requestDetails);
		            break;
		    }
			
			
		}
	
		
	};

	function PostRequest(sender, requestName, requestDetails) {
	    launcherObject.RequestFromController(sender, requestName, requestDetails);
	};

	function PostBroadcastEventRequest(eventName, requestInfo) {
	    var bdEventArg = new BroadcastEventArg();
	    bdEventArg.EventName = eventName;
	    bdEventArg.EventData = requestInfo;
	    PostRequest(thisController, KnownRequests.BroadcastEvent, bdEventArg);
	};

});
