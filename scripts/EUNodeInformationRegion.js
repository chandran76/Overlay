define(function () {
	
	var controllerObject;
	var thisRegion;

	return {
		Render: function(parentDiv) {
			
		    thisRegion = this;
			var tab = '<b-tabs selected="0"> \
						<b-tab for="nodeinfodiv">General Information</b-tab> \
						<b-tab for="stateinfodiv">State Information</b-tab> \
						</b-tabs>' 
			
			parentDiv.innerHTML = tab;
						
			var nodeinfodiv = document.createElement('div');
			nodeinfodiv.id = "nodeinfodiv";
			nodeinfodiv.className = "tab-content";
			parentDiv.appendChild(nodeinfodiv); 
			
			var tbl = '<u-table-column-toggle for="nodeinfo"></u-table-column-toggle> \
                <table is="u-table" id="nodeinfo" sortable class="table table-striped table-bordered table-hover dataTable" role="grid" aria-describedby="datatable3_info" style="width: 100%;" width="100%"> \
				<thead is="u-thead"> \
					<tr>	\
						<th data-key="contextidentifier" data-show="true"> \
						</th>	\
						<th data-key="contextvalue" data-show="true"> \
						</th> \
					</tr> \
				</thead> \
			</table>'
				
			//need to add EventListener for the 'table-initialize' event 
			//for the parent element of the webcomponent.
			//nodeinfodiv.addEventListener("table-initialize", PopulateNodeInfo);
			nodeinfodiv.innerHTML = tbl;
						
			var stateinfodiv = document.createElement('div');
			stateinfodiv.id = "stateinfodiv";
			stateinfodiv.className = "tab-content";
			parentDiv.appendChild(stateinfodiv); 
			
			var statetbl = '<u-table-column-toggle for="stateinfo"></u-table-column-toggle> \
                <table is="u-table" id="stateinfo" sortable class="table table-striped table-bordered table-hover dataTable" role="grid" aria-describedby="datatable3_info" style="width: 100%;" width="100%" > \
				<thead is="u-thead"> \
					<tr>	\
						<th data-key="contextidentifier" data-show="true"> \
							<button>Context Identifier</button> \
						</th>	\
						<th data-key="contextvalue" data-show="true"> \
							<button>Context Value</button> \
						</th> \
					</tr> \
				</thead> \
			</table>'
				
			//need to add EventListener for the 'table-initialize' event 
			//for the parent element of the webcomponent.
			//stateinfodiv.addEventListener("table-initialize", PopulateStateInfo);
			stateinfodiv.innerHTML = statetbl;
			//this line is needed to render the controls inside the tab properly.
			parentDiv.innerHTML = parentDiv.innerHTML;
			
			
		},
		
		Controller: function(object){
			controllerObject = object;
		},
		
		MesageFromParent: function (message, messageInfo) {

		    switch (message) {

		        case Resources.NODE_SELECTED_MESSAGE:
		            
		            var nodeInfo = [];
		            var info = {};

		            info["contextidentifier"] = "NodeId";
		            info["contextvalue"] = messageInfo.Content["NodeId"];
		            nodeInfo.push(info);

		            info = {};
		            info["contextidentifier"] = "NodeUniqueName";
		            info["contextvalue"] = messageInfo.Content["NodeUniqueName"];
		            nodeInfo.push(info);

		            info = {};
		            info["contextidentifier"] = "NodeDisplayName";
		            info["contextvalue"] = messageInfo.Content["NodeDisplayName"];
		            nodeInfo.push(info);

		            info = {};
		            info["contextidentifier"] = "NodeType";
		            info["contextvalue"] = messageInfo.Content["NodeTypeName"];
		            nodeInfo.push(info);

		            info = {};
		            info["contextidentifier"] = "NodeVersion";
		            info["contextvalue"] = messageInfo.Content["Version"];
		            nodeInfo.push(info);

		            PopulateNodeInformation(nodeInfo);
		            break;

		        case KnownMessages.SessionStateInfoAvailable:

		            if (messageInfo.RequestId == Resources.POPULATE_STATE_INFO)
		            {
		                PopulateStateInfo(messageInfo)
		            }
		            break;

		    }

		}
	
	};
	
	
	function PopulateNodeInformation(nodeInfo) {
	    
	    var table = document.getElementById('nodeinfo');
	    table.data = nodeInfo;
	    //table.data = [
        //    {
        //        "contextidentifier": "NodeId",
        //        "contextvalue": "9B88241B-2F03-4F4E-84BF-FCE4D7D51BDD"
        //    },
        //    {
        //        "contextidentifier": "Node Unique Name",
        //        "contextvalue": "VesselSpecificReq"
        //    },
        //    {
        //        "contextidentifier": "Node Display Name",
        //        "contextvalue": "Vessel Specific Req"
        //    },
        //    {
        //        "contextidentifier": "Node Activity",
        //        "contextvalue": "Activity"
        //    }
	    //];
	    

	};

	function PopulateStateInfo(ssAvailable) {
	    /* ssAvailable = xmlDOM object.
	    <item>
            <key><string>LoginName</string></key>
            <value><anyType>admin</anyType></value>
        </item>
        <item>
            <key><string>LoginPassword</string></key>
            <value><anyType>123</anyType></value>
        </item>
        */

	    var item, key, value;
	    var stateInfo = [];
	    var info = {};

	    for (j = 0; j < ssAvailable.results.getElementsByTagName("item").length; j++) {

	        key = "";
	        value = "";
	        item = ssAvailable.results.getElementsByTagName("item")[j];

	        if (item.getElementsByTagName("key")[0].getElementsByTagName("string")[0].childNodes.length > 0) {
	            key = item.getElementsByTagName("key")[0].getElementsByTagName("string")[0].childNodes[0].nodeValue;
	        }
	        
	        if (item.getElementsByTagName("value")[0].getElementsByTagName("anyType")[0].childNodes.length > 0) {
	            value = item.getElementsByTagName("value")[0].getElementsByTagName("anyType")[0].childNodes[0].nodeValue;
	        }
	        
	        

	        info = {};
	        info["contextidentifier"] = key;
	        info["contextvalue"] = value;
	        stateInfo.push(info);
	    }
	    
	    var statetable = document.getElementById('stateinfo');
	    statetable.data = stateInfo;

	};
	
});