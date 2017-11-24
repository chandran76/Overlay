define(function (require) {
	new Launcher();
		
	function Launcher(){
		//"use strict";
		
		var thisLauncher = this;
		
		thisLauncher.state = {
			controllerList: [],
			cisInfo: [],
			JSFileMappingsInfo: []
			
		};
		//var getLayoutSuccess;
		//var layoutHTML;
			
				
		//get all the CIS from the CIS csv file.
		$.ajax({
				url: "webcis/cis.csv",
				type: 'GET',
				contentType: "text/csv; charset=utf-8",
				dataType: "text",
				async: false,
				success: function (data) {
					//console.log(data);
					processData(data);
					
				},
				error: function (data) {
					console.log("Error while reading cis info from cis.csv file!");
					
				}
			});		
		
		function processData(allText) {
			//process all the cis info and store it for later use
			
			var allTextLines = allText.split(/\r\n|\n/);
			var headers = allTextLines[0].split('|');
			var line = {};

			for (var i=1; i<allTextLines.length; i++) {
				var data = allTextLines[i].split('|');
				if (data.length == headers.length) {
					line = {};
					for (var j=0; j<headers.length; j++) {
						line[headers[j]] = data[j];
					}
					thisLauncher.state.cisInfo.push(line);
				}
			} 
			
		}
		
		//get all the JS file mappings(BinaryMappings.csv) from the BinaryMappings csv file.
		$.ajax({
				url: "webcis/BinaryMappings.csv",
				type: 'GET',
				contentType: "text/csv; charset=utf-8",
				dataType: "text",
				async: false,
				success: function (data) {
					//console.log(data);
					processJSMappingsData(data);
					
				},
				error: function (data) {
					console.log("Error while reading binary mappings info from BinaryMappings.csv file!");
					
				}
			});		
		
		function processJSMappingsData(allText) {
			//process all the JS file mappings info and store it for later use
			
			var allTextLines = allText.split(/\r\n|\n/);
			var headers = allTextLines[0].split('|');
			var line = {};

			for (var i=1; i<allTextLines.length; i++) {
				var data = allTextLines[i].split('|');
				if (data.length == headers.length) {
					line = {};
					for (var j=0; j<headers.length; j++) {
						line[headers[j]] = data[j];
					}
					thisLauncher.state.JSFileMappingsInfo.push(line);
				}
			} 
			
		}
			
		
		Launcher.prototype.getCIS = function(cisUniqueName){
			//get the cis info for the passed in cis unique name
			var thisLauncher = this;
			
			var cis = thisLauncher.state.cisInfo.find(function(n) { return n.UniqueName == cisUniqueName });
			return cis;
			
		}
		
		Launcher.prototype.getHomeCIS = function(){
			//get the home cis info 
			var thisLauncher = this;
			
			var cis = thisLauncher.state.cisInfo.find(function(n) { return n.IsHome == 1 });
			return cis;
			
		}
		
		// layout moved to layout.js
		/*
		Launcher.prototype.getLayout = function(layoutFile){
			//get the layout xml file from the server and parse it
			$.ajax({
				url: "webcis/" + layoutFile + ".xml",
				type: 'GET',
				contentType: "text/xml; charset=utf-8",
				dataType: "xml",
				async: false,
				success: function (data) {
					//console.log(data);
					var regions = processLayoutData(data);
					setControllerList(layoutFile, regions);
					getLayoutSuccess = true;
				},
				error: function (data) {
					console.log("Error while getting the layout file 'webcis/" + layoutFile + ".layout");
					getLayoutSuccess = false;
				}
			});		
		}
		
		function processLayoutData(data){
			
			var regions = [];
			layoutHTML = '';
			$(data).find("Layout").each(function() {
				var lay = $(this);
				if (lay.attr("RegionUniqueName") != undefined){
					console.log(lay.attr("RegionUniqueName"));
					regions.push({"UniqueName" : lay.attr("RegionUniqueName")});
				}
				else
				{
					processRowColLayout('Layout', lay, regions);
				}
			});
			
			
			// $(data).find("Row").each(function() {
				// var lay = $(this);
				// if (lay.attr("RegionUniqueName") != undefined){
					// console.log(lay.attr("RegionUniqueName"));
					// regions.push({"UniqueName" : lay.attr("RegionUniqueName")});
				// }
				
			// });
			
			// $(data).find("Col").each(function() {
				// var lay = $(this);
				// if (lay.attr("RegionUniqueName") != undefined){
					// console.log(lay.attr("RegionUniqueName"));
					// regions.push({"UniqueName" : lay.attr("RegionUniqueName")});
				// }
			// });
			
			
			return regions;
		}
		
		function processRowColLayout(parentNodeHierarchy, data, regions){
			
			$(data).find(parentNodeHierarchy + " > Row").each(function() {
				var rowlay = $(this);
				if (rowlay.attr("Size") != undefined){
					layoutHTML+= '<div class="row" style="border: 1px solid;height:' + rowlay.attr("Size") + ';padding: 0;margin: 0;">';
				}
				else
				{
					layoutHTML+= '<div class="row" style="border: 1px solid;padding: 0;margin: 0;">';
				}
				
				if (rowlay.attr("RegionUniqueName") != undefined){
					console.log(rowlay.attr("RegionUniqueName"));
					regions.push({"UniqueName" : rowlay.attr("RegionUniqueName")});
					
					layoutHTML+= '<div id = "' + rowlay.attr("RegionUniqueName") + '" class="col" style="border: 1px solid;width:100%;float:left;padding:0;margin:0;"></div>';
				}
				else
				{
					$(rowlay).find(parentNodeHierarchy + " > Row > Col").each(function() {
						var collay = $(this);
						
						if (collay.attr("Size") != undefined){
							if (collay.attr("RegionUniqueName") != undefined){
								layoutHTML+= '<div id = "' + collay.attr("RegionUniqueName") + '" class="col" style="border: 1px solid;width: ' + collay.attr("Size") + ';float: left;padding:0;margin:0;">';
							}
							else
							{
								layoutHTML+= '<div class="col" style="border: 1px solid;width: ' + collay.attr("Size") + ';float: left;padding:0;margin:0;">';
							}
						}
						else
						{
							if (collay.attr("RegionUniqueName") != undefined){
								layoutHTML+= '<div id = "' + collay.attr("RegionUniqueName") + '" class="col" style="border: 1px solid;float: left;padding:0;margin:0;">';
							}
							else
							{
								layoutHTML+= '<div class="col" style="border: 1px solid;float: left;padding:0;margin:0;">';
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
		*/
		
		
		
		function setControllerList(controllerName, regions){
			var tmpController = {};
			
			tmpController["ControllerName"] = controllerName;
			tmpController["ControllerJS"] = null;
			tmpController["ControllerObject"] = null;
			tmpController["ControllerLoaded"] = false;
			tmpController["Regions"] = regions;
			
			thisLauncher.state.controllerList.push(tmpController);
			
			
		}
		
		Launcher.prototype.InitializeCISandRender = function(cisUniqueName){
			//this function will get the js file mappings for the passed in
			//cis and initialize its controller and regions. Then it will render the cis.
			var thisLauncher = this;
			var mappings;
			var jsObject;
			var jsFilewithoutExt;
					
			var cis = thisLauncher.state.controllerList.find(function(n){ return n.ControllerName == cisUniqueName});
			if (!cis) return;
			
			//initialize controller
			mappings = thisLauncher.state.JSFileMappingsInfo.find(function(n) { return n.UniqueName == cis.ControllerName});
			if (!mappings) return;
			
			//jsFilewithoutExt = mappings.AssemblyName.substr(0, mappings.AssemblyName.lastIndexOf("."));
			jsFilewithoutExt = mappings.AssemblyName;
			cis["ControllerJS"] = mappings.AssemblyName + ".js";
			LoadJSScriptsandInitialize(jsFilewithoutExt);
			
			function LoadJSScriptsandInitialize(jsFile){
				
				require([jsFile], function(temp){
					jsObject = temp;
					//jsObject = eval("new " + jsFilewithoutExt + "()");
					//set the controller mappings and object into the main controllerList
					if (jsObject){
						cis["ControllerObject"] = jsObject;	
						cis["ControllerLoaded"] = true;
					}
					
					thisLauncher.renderCIS(cisUniqueName);
				});
			};
						
			//initialize regions
			cis.Regions.forEach(function(reg){
				
				mappings = thisLauncher.state.JSFileMappingsInfo.find(function(n) { return n.UniqueName == reg.UniqueName});
				if (mappings){
				    //jsFilewithoutExt = mappings.AssemblyName.substr(0, mappings.AssemblyName.lastIndexOf("."));
				    jsFilewithoutExt = mappings.AssemblyName;
					reg["RegionJS"] = mappings.AssemblyName + ".js";
					LoadJSScriptsandInitializeRegions(jsFilewithoutExt);
					
					function LoadJSScriptsandInitializeRegions(jsFile){
						
						require([jsFile], function(temp){
							jsObject = temp;
							//jsObject = eval("new " + jsFilewithoutExt + "()");
							//set the region mappings and object into the main controllerList
							if (jsObject){
								reg["RegionObject"] = jsObject;
								reg["RegionLoaded"] = true;
							}
							
							thisLauncher.renderCIS(cisUniqueName);
						});
					};
				}
			});
			
		}
		
		Launcher.prototype.renderCIS = function (cisUniqueName){
			//this function will check whether all the associated controller/regions object
			//are initialized or not. if yes, it will render its regions.
			var thisLauncher = this;
			var cis = thisLauncher.state.controllerList.find(function(n){ return n.ControllerName == cisUniqueName});
			if (!cis) return;
			
			if (cis.ControllerObject != null && cis.ControllerLoaded == true)
			{
				var allregLoaded = true;
				cis.Regions.forEach(function(reg){
					if (reg.RegionLoaded != true)
					{
						allregLoaded = false;
					}
				});
				
				if (allregLoaded == true)
				{
					/* var parentdiv = document.createElement('div');
					parentdiv.id = cisUniqueName;
					document.body.appendChild(parentdiv); */
					
					//set the launcher and allregions object to the controller
					var conObject = cis.ControllerObject;
					conObject.Launcher(this);
										
					//set the controller object to all the regions
					//call render method of all the regions
					cis.Regions.forEach(function(reg){
						var regObject = reg.RegionObject;
						if (regObject != null)
						{
							conObject.Region(regObject);		//set the region object to the controller
							regObject.Controller(conObject);
							
							var regDiv = document.getElementById(reg.UniqueName);
							if (regDiv != undefined && regDiv != null) {
								regObject.Render(regDiv);
							}
							
						}
					});
				}
			}
			
		}
		
		
		Launcher.prototype.presentCIS = function(cisUniqueName, container){
			//this function will show the passed in cis
			/* var thisLauncher = this;
			getLayoutSuccess = false;
			thisLauncher.getLayout(cisUniqueName);
			
			if (getLayoutSuccess == true){
				//thisLauncher.InitializeCISandRender(cisUniqueName);	
				var containerDiv = document.getElementById("container");
				if (containerDiv != undefined) {
					containerDiv.innerHTML  = layoutHTML;
				}
				
			} */
			
			var thisLauncher = this;
			var containerDiv = container || document.getElementById("container");
			if (containerDiv != undefined && containerDiv != null ) {
				var regions = drawLayout(containerDiv, cisUniqueName);
				if (regions != null && regions != []){
					setControllerList(cisUniqueName, regions);
					thisLauncher.InitializeCISandRender(cisUniqueName);	
				}
			}

		}
		
		Launcher.prototype.RequestFromController = function(sender, requestName, requestDetails){
			/*this function will get the request, requestDetails from the controller and 
			process/pass it to the overlay server. Then return the server response 
			to the sender object.
			*/
			
			var thisLauncher = this;
			
			switch (requestName) {
			    case KnownRequests.PresentCIS:
					
					if (requestDetails != null && requestDetails != undefined && requestDetails.cisUniqueName.length > 0){
						var cis = thisLauncher.getCIS(requestDetails.cisUniqueName);
						if (cis != null)
						{
							//create a div container for the cis and render the layout on it.
							var cisdiv = document.getElementById(cis.UniqueName);
							if (cisdiv != undefined && cisdiv != null){
								//found already might be created before so delete it and recreate.
								cisdiv.parentNode.removeChild(cisdiv);
							}
							/* cisdiv = document.createElement('div');
							cisdiv.id = cis.UniqueName;
							document.body.appendChild(cisdiv); 
							
							thisLauncher.presentCIS(cis.UniqueName, cisdiv); */
							//$("#" + cis.UniqueName).dialog();
							
							
							var dlgdiv = document.getElementById("dialogdiv");
							if (dlgdiv != undefined && dlgdiv != null){
								//found already might be created before so delete it and recreate.
								dlgdiv.parentNode.removeChild(dlgdiv);
							}
							
							dlgdiv = document.createElement('div');
							dlgdiv.id = "dialogdiv";
							document.body.appendChild(dlgdiv); 
							var dialoghtml = '<b-dialog id="simple-dialog"> \
								<b-dialog-content> \
									<div id = ' + cis.UniqueName + ' style = "height:100%; width: 100%"> </div> \
									<button data-dialog-dismiss>Close</button> \
								</b-dialog-content> \
							</b-dialog>'
							dlgdiv.innerHTML = dialoghtml;
							
							var cisdiv = document.getElementById(cis.UniqueName);
							thisLauncher.presentCIS(cis.UniqueName, cisdiv);
	
							dialog = document.getElementById('simple-dialog')
							dialog.showModal();
						}
					}
					
					break;

			    case KnownRequests.GetNodePredictivePatternInformation:
			        getNodePredictivePatternInformation(sender, requestDetails);
			        break;

			    case KnownRequests.BroadcastEvent:
			        broadcastEvent(sender, requestDetails);
			        break;

			    case KnownRequests.GetSessionStateInformation:
			        getSessionStateInformation(sender, requestDetails);
			        break;

			    case KnownRequests.GetContextLabelAttributes:
			        getContextLabelAttributes(sender, requestDetails);
			        break;

			}
			
			/* if (requestName == "GetRootNode")
			{
				//call the server to get the root node PP
				$.ajax({
					url: "overlay.svc/Handshake",
					type: 'GET',
					contentType: "application/json; charset=utf-8",
					dataType: "json",
					async: false,
					success: function (data) {
						//pass the data to the controller
						sender.MessageFromLauncher(request, data);
								
					},
					error: function (data) {
						console.log("Failed to process the request " + request);
						
					}
				});	
			} */

			function getPPUrl(token, pageSize, pageNo, nodeName, contextLabelName, attributeList, filterById, filterId) {

			    var url = "overlay.svc/GetNodeContextLabelPredictivePatternData ";
			    url = url + "?cs=" + token;
			    url = url + "&ps=" + pageSize;
			    url = url + "&pn=" + pageNo;
			    url = url + "&n=" + nodeName;
			    url = url + "&cl=" + contextLabelName;
			    url = url + "&al=" + attributeList;
			    url = url + "&fb=" + filterById;
			    url = url + "&f=" + filterId;
			    return url;

			}

			function getNodePredictivePatternInformation(sender, requestDetails) {

			    var ppUrl = getPPUrl(clientSessionToken, 0, 0, requestDetails.NodeUniqueName,
                            requestDetails.ContextLabelName, "", requestDetails.RowFilterById, requestDetails.RowFilterId);
			    
			    //call the overlay server
			    $.ajax({
			        url: ppUrl,
			        type: 'POST',
			        contentType: "application/json; charset=utf-8",
			        dataType: "json",
			        async: false,
			        success: function (data) {

			            if (data.GetNodeContextLabelPredictivePatternDataResult.RequestOK == true) {
			                clientSessionToken = encodeURIComponent(data.GetNodeContextLabelPredictivePatternDataResult.ClientSessionToken);

			                var ppAvailArg = new PredictivePatternInfoAvailableArg();
			                ppAvailArg.NodeUniqueName = requestDetails.NodeUniqueName;
			                ppAvailArg.ContextLabelName = requestDetails.ContextLabelName;
			                ppAvailArg.RequestId = requestDetails.RequestId;
			                ppAvailArg.RowFilterId = requestDetails.RowFilterId;
			                ppAvailArg.Results = data.GetNodeContextLabelPredictivePatternDataResult.Results;

			                if (requestDetails.BroadcastResults == true) {
			                    //broadcast the results all controllers
			                    thisLauncher.state.controllerList.forEach(function (controller) {

			                        var conObject = controller.ControllerObject;
			                        conObject.MesageFromParent(KnownMessages.PredictivePatternInfoAvailable, ppAvailArg);

			                    });
			                }
			                else {
			                    sender.MesageFromParent(KnownMessages.PredictivePatternInfoAvailable, ppAvailArg);
			                }
			                
			                
			            }
			            else {
			                console.log("Failed while getting predictive pattern information: " + data.GetNodeContextLabelPredictivePatternDataResult.Justification);
			            }

			        },
			        error: function (data) {
			            console.log("Error while fetching predictive pattern information from server! " + data);

			        }
			    });

			    
			};

			function broadcastEvent(sender, requestDetails) {
                //broadcast the request to all the controllers
			    		    
			    thisLauncher.state.controllerList.forEach(function (controller) {

			        var conObject = controller.ControllerObject;
			        conObject.MesageFromParent(requestDetails.EventName, requestDetails.EventData);
			        
			    });
			};

			function getSSUrl(token, sessionId, nodeName, stateInfoId) {

			    var url = "overlay.svc/GetSessionNodeState ";
			    url = url + "?cs=" + token;
			    url = url + "&sid=" + sessionId;
			    url = url + "&nun=" + nodeName;
			    url = url + "&stid=" + stateInfoId;

			    return url;

			};

			function getSessionStateInformation(sender, requestDetails) {

			    var ssUrl = getSSUrl(clientSessionToken, requestDetails.SessionId,
                            requestDetails.NodeUniqueName, requestDetails.StateInfoId);
			    
			    //call the overlay server
			    $.ajax({
			        url: ssUrl,
			        type: 'POST',
			        contentType: "application/json; charset=utf-8",
			        dataType: "json",
			        async: false,
			        success: function (data) {

			            if (data.GetSessionNodeStateResult.RequestOK == true) {
			                clientSessionToken = encodeURIComponent(data.GetSessionNodeStateResult.ClientSessionToken);

			                var ssAvailArg = new SessionStateInfoAvailableArg();
			                ssAvailArg.NodeUniqueName = requestDetails.NodeUniqueName;
			                ssAvailArg.RequestId = requestDetails.RequestId;
			                ssAvailArg.SessionId = requestDetails.SessionId;
			                ssAvailArg.StateInfoId = requestDetails.StateInfoId;

			                var xml = data.GetSessionNodeStateResult.StateInfoXml;
			                var xmlDOM = new DOMParser().parseFromString(xml, 'text/xml');
			                ssAvailArg.Results = xmlDOM;

			                if (requestDetails.BroadcastResults == true) {
			                    //broadcast the results all controllers
			                    thisLauncher.state.controllerList.forEach(function (controller) {

			                        var conObject = controller.ControllerObject;
			                        conObject.MesageFromParent(KnownMessages.SessionStateInfoAvailable, ssAvailArg);

			                    });
			                }
			                else {
			                    sender.MesageFromParent(KnownMessages.SessionStateInfoAvailable, ssAvailArg);
			                }


			            }
			            else {
			                console.log("Failed while getting session state information: " + data.Justification);
			            }

			        },
			        error: function (data) {
			            console.log("Error while fetching session state information from server! " + data);

			        }
			    });


			};

			function getContextLabelAttributesUrl(token, pageSize, pageNo, contextLabelId) {

			    var url = "overlay.svc/GetContextLabelAttributes ";
			    url = url + "?cs=" + token;
			    url = url + "&ps=" + pageSize;
			    url = url + "&pn=" + pageNo;
			    url = url + "&cli=" + contextLabelId;

			    return url;

			};

			function getContextLabelAttributes(sender, requestDetails) {

			    var clAttUrl = getContextLabelAttributesUrl(clientSessionToken, -1, 0, requestDetails.ContextLabelId);

			    //call the overlay server
			    $.ajax({
			        url: clAttUrl,
			        type: 'POST',
			        contentType: "application/json; charset=utf-8",
			        dataType: "json",
			        async: false,
			        success: function (data) {

			            if (data.GetContextLabelAttributesResult.RequestOK == true) {
			                clientSessionToken = encodeURIComponent(data.GetContextLabelAttributesResult.ClientSessionToken);

			                requestDetails.Results = data.GetContextLabelAttributesResult.Data.Results;

			            }
			            else {
			                console.log("Failed while getting context lable attributes information: " + data.GetContextLabelAttributesResult.Justification);
			            }

			        },
			        error: function (data) {
			            console.log("Error while fetching context lable attributes information from server! " + data);

			        }
			    });


			};

		}
		
		//var cis = thisLauncher.getCIS("EUNodeActionCISController");
		var homeCIS = thisLauncher.getHomeCIS();
		if (homeCIS != null)
		{
			thisLauncher.presentCIS(homeCIS.UniqueName);
		}
		


		
	};

});