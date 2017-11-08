define(function () {
	
	var launcherObject;
	var allRegions = [];
	
	return {
		Launcher: function(object){
			launcherObject = object;
		},
		
		Region: function(object){
			allRegions.push({"RegionObject" : object});
		},
		
		MessageFromLauncher: function(request, response){
			
			/* if (request == "GetRootNode")
			{
				allRegions.forEach(function(region) {
					
					var regObject = region.RegionObject;
					regObject.MessageFromController(request, response);
						   
				});
			} */
			
		}, 
		
		RequestFromRegion: function(requestName, requestDetails){
			
			launcherObject.RequestFromController(this, requestName, requestDetails);
			
		}
	
		
	};
});
