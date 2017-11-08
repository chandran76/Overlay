define(function () {
	
	var controllerObject;
	var thisRegion;
	var mv;
	var selectedNodeIdtoGetIndirectLinks;
	var indirectLinks;
	var localNodes;
	var _nodeSelectedFromTimeline = false;
	var traceIds, parentHierarchyIds, fullParentChildTree, fullParentChildTreeList;
	fullParentChildTree = "";


	return {
	    
		Render: function(parentDiv) {
			
		    thisRegion = this;
			/* var btn = document.createElement("BUTTON");
			var txt = document.createTextNode("Mapview");
			btn.setAttribute("id", "Mapview");
			btn.onclick = ButtonClicked;
			btn.appendChild(txt);
			parentDiv.appendChild(btn); */

			mv = document.createElement("u-mapview");
			parentDiv.appendChild(mv);

		    //add EventListener for all the mapview control's event 
			mv.addEventListener("nodeClicked", mvnodeClicked);
			mv.addEventListener("getDirectChildren", mvgetDirectChildren);
			mv.addEventListener("getIndirectLinks", mvgetIndirectLinks);
			mv.addEventListener("nodeColor", mvnodeColor);
			
			PostPredictivePatternRequest("Overlay", "Model", Resources.POPULATE_MODEL_INFO, false, "{00000000-0000-0000-0000-000000000000}");

			
		},
		
		Controller: function(object){
			controllerObject = object;
		},
		
		MesageFromParent: function(message, messageInfo) {
			
		    switch (message) {

		        case KnownMessages.PredictivePatternInfoAvailable:

		            if (messageInfo.RequestId == Resources.POPULATE_MODEL_INFO) {
		                PopulateModelInformation(messageInfo);
		            }
		            else if (messageInfo.RequestId == Resources.POPULATE_ROOT_NODE_INFO) {
		                AddRootNodeInMapView(messageInfo);
		            }
		            else if (messageInfo.RequestId == Resources.POPULATE_CHILD_NODES_AND_LINKS) {
		                AddChildNodesToSelectedMapViewNode(messageInfo);
		            }
		            else if (messageInfo.RequestId == Resources.POPULATE_CAUSAL_LINKS) {
		                AddIndirectLinks(messageInfo, "CausalLinks");
		            }
		            else if (messageInfo.RequestId == Resources.POPULATE_AFFECTED_LINKS) {
		                AddIndirectLinks(messageInfo, "AffectedLinks");
		            }
		            else if (messageInfo.RequestId == Resources.POPULATE_TIMELINE_INFO) {
		                PopulateTimelineInfo(messageInfo);
		            }
		            else if (messageInfo.RequestId == Resources.POPULATE_TRACKING_NODES) {
		                PopulateTracking(messageInfo);
		            }

		            break;

		        case Resources.TIMELINE_TONODEID_SELECT_INFO:

		            var timeLineToNodeId = messageInfo.Content["TimeLineToNodeId"];
		            _nodeSelectedFromTimeline = true;
		            mv.selectNode(timeLineToNodeId);
		            
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

	function PostRequestToPopulateNodeInformation(nodeId)
	{
	    var tempNode = localNodes.lNodes.find(function (n) { return n.NodeId == nodeId });
	    if (tempNode == null)
	    {
	        _nodeSelectedFromTimeline = false;
	        return;
	    }
        
	    var bdEventData = new BroadcastEventData();
	    tempNode["NodeSelectedFromTimeline"] = _nodeSelectedFromTimeline;
	    bdEventData.Content = tempNode;
	    PostRequest(thisRegion, Resources.NODE_SELECTED_MESSAGE, bdEventData);
	    _nodeSelectedFromTimeline = false;
	};

	function PopulateModelInformation(ppAvailable) {

	    var rootNodeId = null;
	    var results;

	    results = ppAvailable.Results.Results[0];

	    for (i = 0; i < results.length; i++) {
	        if (results[i].Key == "Model.RootNodeId") {
	            rootNodeId = results[i].Value;
	            break;
	        }
	    }

	    if (rootNodeId != null) {
	        PostPredictivePatternRequest("Overlay", "NodeInfo", Resources.POPULATE_ROOT_NODE_INFO, true, rootNodeId);
	    }

	};

	function AddRootNodeInMapView(ppAvailable) {

	    var rootNodeId, rootDisplayName, rootUniqueName, rootNodeTypeName, rootNodeVersion;
        var results;
	    var root = {
	        nodes: [],
	        edges: []
	    };
	    var node = {};
        
	    localNodes = {
	        lNodes: []
	    };
	    var lNode = {};
        
	    results = ppAvailable.Results.Results[0];
	    for (i = 0; i < results.length; i++) {

	        if (results[i].Key == "NodeInfo") {
	            rootNodeId = results[i].Value;
	        }

	        if (results[i].Key == "NodeInfo.DisplayName") {
	            rootDisplayName = results[i].Value;
	        }

	        if (results[i].Key == "NodeInfo.UniqueName") {
	            rootUniqueName = results[i].Value;
	        }

	        if (results[i].Key == "NodeInfo.NodeType") {
	            rootNodeTypeName = results[i].Value;
	        }

	        if (results[i].Key == "NodeInfo.Version") {
	            rootNodeVersion = results[i].Value;
	        }

	        node["id"] = rootNodeId;
	        node["title"] = rootDisplayName;
	        node["parentid"] = null;
	        node["type"] = rootNodeTypeName;

	        lNode["NodeId"] = rootNodeId;
	        lNode["ParentNodeId"] = "{00000000-0000-0000-0000-000000000000}";
	        lNode["LinkId"] = "{00000000-0000-0000-0000-000000000000}";
	        lNode["NodeDisplayName"] = rootDisplayName;
	        lNode["NodeUniqueName"] = rootUniqueName;
	        lNode["NodeTypeName"] = rootNodeTypeName;
	        lNode["Version"] = rootNodeVersion;

	    }

	    root.nodes.push(node);
	    localNodes.lNodes.push(lNode);

	    mv.showMapView(root);
	    mv.selectNode(rootNodeId);

	};

	function AddChildNodesToSelectedMapViewNode(ppAvailable) {

	    var results;
	    var root = {
	        nodes: [],
	        edges: []
	    };

	    var node = {};
	    var edge = {};
	    var useForTree;
	    var parentNodeId, childNodeId, childNodeDisplayName, childNodeUniqueName, childNodeTypeName, childNodeVersion, linkId;
	    var lNode = {};
	    
	    for (j = 0; j < ppAvailable.Results.Results.length; j++) {
	        results = ppAvailable.Results.Results[j];

	        node = {};
	        edge = {};
	        useForTree = false;
	        lNode = {};
	        for (i = 0; i < results.length; i++) {
	            
	            if (results[i].Key == "CausalInfo") {
	                parentNodeId = results[i].Value;
	            }

	            if (results[i].Key == "CausalInfo.NodeId") {
	                childNodeId = results[i].Value;
	            }

	            if (results[i].Key == "CausalInfo.NodeDisplayName") {
	                childNodeDisplayName = results[i].Value;
	            }

	            if (results[i].Key == "CausalInfo.NodeUniqueName") {
	                childNodeUniqueName = results[i].Value;
	            }
	            
	            if (results[i].Key == "CausalInfo.NodeType") {
	                childNodeTypeName = results[i].Value;
	            }

	            if (results[i].Key == "CausalInfo.LinkId") {
	                linkId = results[i].Value;
	            }

	            if (results[i].Key == "CausalInfo.UseForTree") {
	                useForTree = results[i].Value;
	            }

	            if (results[i].Key == "CausalInfo.Version") {
	                childNodeVersion = results[i].Value;
	            }

	            node["id"] = childNodeId;
	            node["title"] = childNodeDisplayName;
	            node["parentid"] = parentNodeId;
	            node["type"] = childNodeTypeName;
	            edge["id"] = linkId;
	            edge["source"] = childNodeId;
	            edge["target"] = parentNodeId;
	            
	            lNode["NodeId"] = childNodeId;
	            lNode["ParentNodeId"] = parentNodeId;
	            lNode["LinkId"] = linkId;
	            lNode["NodeDisplayName"] = childNodeDisplayName;
	            lNode["NodeUniqueName"] = childNodeUniqueName;
	            lNode["NodeTypeName"] = childNodeTypeName;
	            lNode["Version"] = childNodeVersion;

	        }

	        if (useForTree == true) {
	            root.nodes.push(node);
	            root.edges.push(edge);

	            var tempNode = localNodes.lNodes.find(function (n) { return n.NodeId == childNodeId });
	            if (tempNode == null) {
	                localNodes.lNodes.push(lNode);
	            }
	            
	        }
	    }

	    mv.loadChildren(root);
	};
    	
	function AddIndirectLinks(ppAvailable, type) {

	    var results;
	    var edge = {};
	    var useForTree;

	    for (j = 0; j < ppAvailable.Results.Results.length; j++) {
	        results = ppAvailable.Results.Results[j];

	        edge = {};
	        useForTree = false;
	        for (i = 0; i < results.length; i++) {

	            if (type == "CausalLinks") {

	                if (results[i].Key == "CausalInfo.LinkId") {
	                    edge["id"] = results[i].Value;
	                }

	                if (results[i].Key == "CausalInfo.NodeId") {
	                    edge["source"] = results[i].Value;
	                }

	                if (results[i].Key == "CausalInfo") {
	                    edge["target"] = results[i].Value;
	                }

	                if (results[i].Key == "CausalInfo.UseForTree") {
	                    useForTree = results[i].Value;
	                }
	            }
	            else if (type == "AffectedLinks") {

	                if (results[i].Key == "AffectedInfo.LinkId") {
	                    edge["id"] = results[i].Value;
	                }

	                if (results[i].Key == "AffectedInfo") {
	                    edge["source"] = results[i].Value;
	                }

	                if (results[i].Key == "AffectedInfo.NodeId") {
	                    edge["target"] = results[i].Value;
	                }

	                if (results[i].Key == "AffectedInfo.UseForTree") {
	                    useForTree = results[i].Value;
	                }
	            }

	        }

	        if (useForTree == false) {
	            indirectLinks.edges.push(edge);
	        }
	    }

	    if (type == "AffectedLinks") {
	        
	        mv.loadIndirectLinks(indirectLinks, selectedNodeIdtoGetIndirectLinks);
	    }
	    
	};

	function PopulateTimelineInfo(ppAvailable) {

	    var results;
	    var fromNodeId, toNodeId;
	    var info = {};
	    var temp;

	    traceIds = {
	        trace: []
	    };
            
	    
	    for (j = 0; j < ppAvailable.Results.Results.length; j++) {
	        results = ppAvailable.Results.Results[j];

	        fromNodeId = "";
	        toNodeId = "";
	        for (i = 0; i < results.length; i++) {

	            if (results[i].Key == "SessionTrace.FromNodeId") {
	                fromNodeId = results[i].Value;
	            }

	            if (results[i].Key == "SessionTrace.ToNodeId") {
	                toNodeId = results[i].Value;
	            }
	            
	        }

	        if (fromNodeId != "" && fromNodeId != "{00000000-0000-0000-0000-000000000000}" && fromNodeId != "00000000-0000-0000-0000-000000000000") {
	            info = {};
	            info["id"] = fromNodeId;
	            temp = traceIds.trace.find(function (n) { return n.id == fromNodeId });
	            if (temp == null) {
	                traceIds.trace.push(info);
	            }

	            info = {};
	            info["id"] = toNodeId;
	            temp = traceIds.trace.find(function (n) { return n.id == toNodeId });
	            if (temp == null) {
	                traceIds.trace.push(info);
	            }
	        }

	    }

	    //render trace
	    if (traceIds.trace.length == 0)
	    {
	        return;
	    }
	    parentHierarchyIds = [];
	    parentHierarchyIds.push(traceIds.trace[0]);
	    fullParentChildTree = traceIds.trace[0].id;
	    fullParentChildTreeList = {
	        path: []
	    };

	    PostPredictivePatternRequest("Overlay", "AffectedInfo", Resources.POPULATE_TRACKING_NODES, true, traceIds.trace[0].id);

	};
	
	function PopulateTracking(ppAvailable) {

	    var results;
	    var useForTree, tempParentNodeId, parentNodeId;
	    var info;

	    parentNodeId = "";
	    for (j = 0; j < ppAvailable.Results.Results.length; j++) {
	        results = ppAvailable.Results.Results[j];

	        useForTree = false;
	        for (i = 0; i < results.length; i++) {

	            if (results[i].Key == "AffectedInfo.UseForTree") {
	                useForTree = results[i].Value;
	            }

	            if (results[i].Key == "AffectedInfo.NodeId") {
	                tempParentNodeId = results[i].Value;
	            }

	        }

	        if (useForTree == true)
	        {
	            parentNodeId = tempParentNodeId;
	            fullParentChildTree = parentNodeId + "#" + fullParentChildTree;
                var temp = parentHierarchyIds.find(function (n) { return n.id == parentNodeId });
	            if (temp == null) {
	                info = {};
	                info["id"] = parentNodeId;
	                parentHierarchyIds.push(info);
	            }
	        }
	    }

	    if (parentNodeId != "") {
	        PostPredictivePatternRequest("Overlay", "AffectedInfo", Resources.POPULATE_TRACKING_NODES, true, parentNodeId);
	    }
	    else {
	        if (fullParentChildTree != "") {
	            info = {};
	            info["ids"] = fullParentChildTree;
	            fullParentChildTreeList.path.push(info);

	            //check whether all the tracing nodes are found in the hierarchy path.
	            var allFound = true;
	            var nodeId = "";
	            for(i = 0; i < traceIds.trace.length; i++)
	            {
	                if (parentHierarchyIds.find(function (n) { return n.id == traceIds.trace[i].id }) == null) {
	                    //not found so again get the path for this node.
	                    allFound = false;
	                    nodeId = traceIds.trace[i].id;
	                    break;
	                }
	            }

	            if (allFound == false) {
	                //all not found so again get the path for this node.
	                info = {};
	                info["id"] = nodeId;
	                parentHierarchyIds.push(info);
	                fullParentChildTree = nodeId;
	                PostPredictivePatternRequest("Overlay", "AffectedInfo", Resources.POPULATE_TRACKING_NODES, true, nodeId);

	            }
	            else {
	                //all found show the tracing in the mapview
	                if (fullParentChildTreeList.path.length > 0) {
	                    mv.highlightTrackingNodes(fullParentChildTreeList, traceIds);
	                }

	            }

	        }
	    }
	    
	};


	function mvnodeClicked(e) {
	    PostRequestToPopulateNodeInformation(e.detail.nodeId);
	};

	function mvgetDirectChildren(e) {

	    var nodeId = e.detail.nodeId;
	    if (nodeId != null && nodeId.length > 0)
	    {
	        PostPredictivePatternRequest("Overlay", "CausalInfo", Resources.POPULATE_CHILD_NODES_AND_LINKS, true, nodeId);
	    }
	    
	};

	function mvgetIndirectLinks(e) {
	    var nodeId = e.detail.nodeId;
	    if (nodeId != null && nodeId.length > 0) {
	        indirectLinks = {
	            edges: []
	        };

	        selectedNodeIdtoGetIndirectLinks = nodeId;
	        PostPredictivePatternRequest("Overlay", "CausalInfo", Resources.POPULATE_CAUSAL_LINKS, true, selectedNodeIdtoGetIndirectLinks);
	        PostPredictivePatternRequest("Overlay", "AffectedInfo", Resources.POPULATE_AFFECTED_LINKS, true, selectedNodeIdtoGetIndirectLinks);
	    }
	};

    
	function mvnodeColor(e) {
	    var retVal = "lightsteelblue";
	    var nodeType = e.detail.nodeType;

	    switch (nodeType.toLowerCase())
	    {
	        case "activity":
	            retVal = "lightsteelblue";
	            break;
	        case "context":
	            retVal = "#a5e862";
	            break;
	        case "attribute":
	            retVal = "#edb466";
	            break;
	        case "predictivepattern":
	            retVal = "#deb0c4";
	            break;
	        case "cis":
	            retVal = "#e9f36a";
	            break;
	        default:
	            retVal = "lightsteelblue";
	            break;
	    }
	    
	    e.detail.setColor = retVal;
	};

    
	
});