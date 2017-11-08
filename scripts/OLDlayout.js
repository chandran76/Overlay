//this will draw the layout in the passed in container object
//from the passed in layout file configuration and return all the regions.
function drawLayout(container, layoutFile){
	
	var regions = null;
	var layoutHTML = '';
	
	//get the layout xml file from the server and parse it
	$.ajax({
		url: "webcis/" + layoutFile + ".xml",
		type: 'GET',
		contentType: "text/xml; charset=utf-8",
		dataType: "xml",
		async: false,
		success: function (data) {
			regions = processLayoutData(data);
			//setControllerList(layoutFile, regions);
		},
		error: function (data) {
			console.log("Error while getting the layout file 'webcis/" + layoutFile + ".layout");
		}
	});		
	
	function processLayoutData(data){
			
		var regions = [];
		layoutHTML = '';
		$(data).find("Layout").each(function() {
			var lay = $(this);
			if (lay.attr("RegionUniqueName") != undefined){
				console.log(lay.attr("RegionUniqueName"));
				regions.push({"UniqueName" : lay.attr("RegionUniqueName")});
				
				layoutHTML+= '<div class="row" style="border: 1px solid;height: 100%;padding: 0;margin: 0;-moz-box-sizing: border-box;-webkit-box-sizing: border-box;-ms-box-sizing: border-box;box-sizing: border-box;">';
				layoutHTML+= '<div id = "' + lay.attr("RegionUniqueName") + '" class="col" style="border: 1px solid;width:100%;float:left;padding:0;margin:0;-moz-box-sizing: border-box;-webkit-box-sizing: border-box;-ms-box-sizing: border-box;box-sizing: border-box;height: 100%; overflow: auto;"></div>';
				layoutHTML+= '</div>';
				
			}
			else
			{
				processRowColLayout('Layout', lay, regions);
			}
		});
		return regions;
	}
		
	function processRowColLayout(parentNodeHierarchy, data, regions){
		
		/* var rowSize = 0;
		var rowSizeinPercent = false; */
		
		$(data).find(parentNodeHierarchy + " > Row").each(function() {
			var rowlay = $(this);
			if (rowlay.attr("Size") != undefined){
				layoutHTML+= '<div class="row" style="border: 1px solid;height:' + rowlay.attr("Size") + ';padding: 0;margin: 0;-moz-box-sizing: border-box;-webkit-box-sizing: border-box;-ms-box-sizing: border-box;box-sizing: border-box;">';
				
				/* if (rowlay.attr("Size").indexOf("%") >= 0){
					rowSize = rowSize + rowlay.attr("Size").replace("%", "");
					rowSizeinPercent=true;
				} */
				
				
			}
			else
			{	
				layoutHTML+= '<div class="row" style="border: 1px solid;padding: 0;margin: 0;-moz-box-sizing: border-box;-webkit-box-sizing: border-box;-ms-box-sizing: border-box;box-sizing: border-box;">';
				/* if (rowSizeinPercent == true){
					rowSize = 100 - rowSize;
					layoutHTML+= '<div class="row" style="border: 1px solid;height:' + rowSize + '%;padding: 0;margin: 0;">';
				}
				else
				{
					layoutHTML+= '<div class="row" style="border: 1px solid;padding: 0;margin: 0;">';
				} */
				
			}
			
			if (rowlay.attr("RegionUniqueName") != undefined){
				console.log(rowlay.attr("RegionUniqueName"));
				regions.push({"UniqueName" : rowlay.attr("RegionUniqueName")});
				
				layoutHTML+= '<div id = "' + rowlay.attr("RegionUniqueName") + '" class="col" style="border: 1px solid;width:100%;float:left;padding:0;margin:0;-moz-box-sizing: border-box;-webkit-box-sizing: border-box;-ms-box-sizing: border-box;box-sizing: border-box;height: 100%; overflow: auto;"></div>';
			}
			else
			{
				$(rowlay).find(parentNodeHierarchy + " > Row > Col").each(function() {
					var collay = $(this);
					
					if (collay.attr("Size") != undefined){
						if (collay.attr("RegionUniqueName") != undefined){
							layoutHTML+= '<div id = "' + collay.attr("RegionUniqueName") + '" class="col" style="border: 1px solid;width: ' + collay.attr("Size") + ';float: left;padding:0;margin:0;-moz-box-sizing: border-box;-webkit-box-sizing: border-box;-ms-box-sizing: border-box;box-sizing: border-box;height: 100%; overflow: auto;">';
						}
						else
						{
							layoutHTML+= '<div class="col" style="border: 1px solid;width: ' + collay.attr("Size") + ';float: left;padding:0;margin:0;-moz-box-sizing: border-box;-webkit-box-sizing: border-box;-ms-box-sizing: border-box;box-sizing: border-box;">';
						}
					}
					else
					{
						if (collay.attr("RegionUniqueName") != undefined){
							layoutHTML+= '<div id = "' + collay.attr("RegionUniqueName") + '" class="col" style="border: 1px solid;float: left;padding:0;margin:0;-moz-box-sizing: border-box;-webkit-box-sizing: border-box;-ms-box-sizing: border-box;box-sizing: border-box;height: 100%; overflow: auto;">';
						}
						else
						{
							layoutHTML+= '<div class="col" style="border: 1px solid;float: left;padding:0;margin:0;-moz-box-sizing: border-box;-webkit-box-sizing: border-box;-ms-box-sizing: border-box;box-sizing: border-box;">';
						}
					}
					
					
					if (collay.attr("RegionUniqueName") != undefined){
						console.log(collay.attr("RegionUniqueName"));
						regions.push({"UniqueName" : collay.attr("RegionUniqueName")});
					}
					else
					{
						processRowColLayout(parentNodeHierarchy + " > Row > Col", collay, regions);
					}
					
					layoutHTML+= '</div>';						
				});
			}
			
			layoutHTML+= '</div>';
		});
		
	}
	
	//display the layout
	if (layoutHTML != null && layoutHTML != ''){
		container.innerHTML  = layoutHTML;
	}
	
	
	
	return regions;
	
};