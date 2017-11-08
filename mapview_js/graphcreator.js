//constructor
function GraphCreator(d3, saveAs, Blob, baseSvg, options, mapviewHandler) {
    "use strict";
	
    var thisGraph = this;
    var mvEventHandler = mapviewHandler || mapVieweventHandler;

    var svgContainer;
			
    //user defined variables
    var menu = null; 

    // variables for drag/drop
    var SelectedNodeOnDrag_data = null;
    var draggingNode_data = null;
	

    var dblClickedNode = null;
    var tmpLinks = null;
    //var getchildrenFor = null;
	
    thisGraph.state = {
        root: null,
        selectedNode: null,
        selectedEdge: null,
        mode: thisGraph.consts.MODE_EDIT,
        nodeTrace: [],
        edgeTrace: [],		
        viewerWidth: 0,
        viewerHeight: 0,	
        svg: baseSvg,	
        svgGroup: null,
        multi_parent_nodes_data: [],
        getchildrenFor: [],
        tracking: [],
        mvHandler: mvEventHandler
    };

    var mvMode = thisGraph.state.mvHandler.getmvMode() || thisGraph.consts.DesignMode;
	
    var clickedOnce = false;
    var timer;

    thisGraph.event = {
        onNodeClick: function(node){
            if (clickedOnce) {
                run_node_double_click();
            } else {
                timer = setTimeout(run_node_click, 250);
                clickedOnce = true;
            }

            function run_node_click() {
                clickedOnce = false;
                console.log("run_node_click");

                if (thisGraph.state.mvHandler.nodeInformationChanged == true)
                {
                    if (thisGraph.state.selectedNode == node)
                    {
                        return;
                    }
                    alert("Information is changed.\nPlease apply or cancel the changes before changing the selection.");
                    return;
                }

                thisGraph.selectNode(node);
                thisGraph.state.mvHandler.nodeClick(node.id);
                
                if (thisGraph.state.mode == thisGraph.consts.MODE_BOWTIE){
                    thisGraph.state.nodeTrace.push(node);
	                
                    //get the link connecting the previous and current node in the nodeTrace
                    var currNode = node;
                    var prevNode = (thisGraph.state.nodeTrace.length > 1) ? thisGraph.state.nodeTrace[thisGraph.state.nodeTrace.length - 2] : null;
	                
                    var link = thisGraph.getConnectingLink(currNode,prevNode);
                    if (link) thisGraph.state.edgeTrace.push(link);
	                
                    thisGraph.showBowtieView(node);
                } 

                //check if we are in the tracking process or not. if yes show the tracking nodes
                if (thisGraph.state.tracking != [] && thisGraph.state.tracking != null)
                {
                    if (thisGraph.state.tracking.length > 0)
                    {
                        if (thisGraph.state.tracking[0].track == 1)
                        {
                            if (thisGraph.state.tracking[0].searchpath.path.length > 0)
                            {
                                var path = thisGraph.state.tracking[0].searchpath.path[0];
                                thisGraph.state.tracking[0].searchpath.path.splice(0, 1);

                                thisGraph.highlightSearchResultNode(path);
                            }
                            else
                            {
                                setTimeout(function(){

                                    if (thisGraph.state.tracking.length > 0)
                                    {
                                        thisGraph.showTrackingNodes(thisGraph.state.tracking[0].trackNodes);
                                    }

                                }, 500);	
                            }
                        }
                    }
                }
            }

            function run_node_double_click() {
                clickedOnce = false;
                clearTimeout(timer);
                console.log("run_node_double_click");
                thisGraph.event.onNodeDblclick.call(thisGraph,node);
            }
        },
			
        onColorNode: function(d) {
            
            var result = thisGraph.state.mvHandler.getNodeColor(d.type);

            if (result === "") {result = "lightsteelblue";}
            
            return result;

            //var result = "#fff";
            //if (d.synthetic == true) {
            //    result = (d._children || d.children) ? "darkgray" : "lightgray";
            //}
            //else {
            //    if (d.type == "USDA") {
            //        result = (d._children || d.children) ? "orangered" : "orange";
            //    } else if (d.type == "Produce") {
            //        result = (d._children || d.children) ? "yellowgreen" : "yellow";
            //    } else if (d.type == "RecipeIngredient") {
            //        result = (d._children || d.children) ? "skyblue" : "royalblue";
            //    } else {
            //        result = "lightsteelblue"
            //    }
            //}
            //return result;
        },
        onMouseover: function(node) {
            overCircle(node);
        },
        onMouseout: function(node) {
            outCircle(node);
        },
        onNodeMouseup: function(node){
            //thisGraph.selectNode(node);
		    
		    
        },
        
        OnKeyDown: function(){
		    
            switch (d3.event.keyCode) {
                case thisGraph.consts.DELETE_KEY:

                    //if (mvMode == thisGraph.consts.RunningMode) return;

                    if (thisGraph.state.selectedEdge != null)
                    {
                        //check whether the selected edge is affected link or not
                        //if (thisGraph.state.svgGroup.selectAll('path.affectedlink').classed(thisGraph.consts.selectedClass) == true)
                        if (thisGraph.state.selectedEdge.affected && thisGraph.state.selectedEdge.causal)
                        {
                            thisGraph.deleteAffectedLink(thisGraph.state.selectedEdge);
                        }
		                
                    }
		            
                    break;
                
            }
        },
        onNodeRightClick: function(node) {
            d3.event.preventDefault();
            thisGraph.nodeDoubleClick(node);
        },
        onNodeDblclick: function(node){
		    
            if (thisGraph.state.mvHandler.nodeInformationChanged == true)
            {
                if (thisGraph.state.selectedNode != node)
                {
                    alert("Information is changed.\nPlease apply or cancel the changes before changing the selection.");
                    return;    
                }
		        
            }
		    
            //if (d3.event != null)
            //{
            //    d3.event.stopPropagation();
            //}
		    
			
            if((thisGraph.state.mode == thisGraph.consts.MODE_EDIT || thisGraph.state.mode == thisGraph.consts.MODE_BOWTIE ) && thisGraph.state.selectedNode){

                //if (d3.event != null)
                //{
                //    if (d3.event.defaultPrevented) return; // click suppressed
                //}
						
                var d = toggleChildren(node);
                thisGraph.selectNode(node);
                thisGraph.state.mvHandler.nodeClick(node.id);

                if (d == null) {
                    thisGraph.state.mvHandler.getDirectChildren(node.id);
                } else {
                    UpdateNode(d);
                    
                    //the below call is to highlight the search results. this call should be here
                    //as the expand will be executed one by one for the search results.
                    if (thisGraph.state.getchildrenFor != [] && thisGraph.state.getchildrenFor != null)
                    {
                        if (thisGraph.state.getchildrenFor.length > 0)
                        {
                            thisGraph.getChildrenForSearchResults();
                        }
			            
                    }
                }
            }
        },
        onLinkDblclick: function(){},
        onLinkClick: function(edge){

            if (thisGraph.state.mvHandler.nodeInformationChanged == true)
            {
                if (thisGraph.state.selectedEdge == edge)
                {
                    return;
                }
                alert("Information is changed.\nPlease apply or cancel the changes before changing the selection.");
                return;
            }

            d3.event.stopPropagation();
            thisGraph.selectEdge(edge);
            thisGraph.state.mvHandler.linkClick(edge.id);

        }		
    };
	
		
    //graph listners
    thisGraph.zoomListener = null;
    thisGraph.dragListener = null;
	
    thisGraph.tree = null;
    thisGraph.nodes = [];
    thisGraph.links = [];

    // Toggle children function
    function toggleChildren(d) {
				
        if (!d.children && !d._children)return null;
				
        if (d.children) {
            d._children = d.children;
            d.children = null;
        } else if (d._children) {
            d.children = d._children;
            d._children = null;
        } 
				
        return d;
    }

    function UpdateNode(d){
        thisGraph.updateGraph(d);
        thisGraph.centerNode(d);
    }
    
    function initializeComponent(){		

        thisGraph.state.svg = baseSvg;
		
        // size of the diagram
        thisGraph.state.viewerWidth = thisGraph.state.svg.attr("width");
        thisGraph.state.viewerHeight = thisGraph.state.svg.attr("height");

        thisGraph.tree = d3.layout.tree().size([thisGraph.state.viewerHeight, thisGraph.state.viewerWidth]);

        thisGraph.state.svg.append("rect")
			.attr("width", "100%")
			.attr("height", "100%")
			.attr("fill", "white");
			
        thisGraph.state.svg.insert("svg:defs")
			.insert("svg:marker")    
			.attr("id", "start")
			.attr("viewBox", "0 -5 10 10")
			.attr("refX", 23)
			.attr("refY", 0)
			.attr("markerWidth", 6)
			.attr("markerHeight", 6)
			.attr("orient", "auto")
			.append("svg:path")
			.attr("d", "M0,-5L10,0L0,5");

        thisGraph.state.svg.insert("svg:defs")
			 .insert("svg:marker")    
			.attr("id", "end")
			.attr("viewBox", "0 -5 10 10")
			.attr("refX", -11)
			.attr("refY", 0)
			.attr("markerWidth", 6)
			.attr("markerHeight", 6)
			.attr("orient", "auto")
			.append("svg:path")
			.attr("d", "M10,-5L0,0L10,5");			
			
        // Append a group which holds all nodes and which the zoom Listener can act upon.
        thisGraph.state.svgGroup = thisGraph.state.svg.append("g");
	
        d3.select(window).on("keydown", thisGraph.event.OnKeyDown);
		

        // variables for drag/drop
        var dragStarted = false;
        var dragNodeChildren_data = null;
        var domNodeDragged = null;

        // panning variables
        var panTimer;

        // TODO: Pan function, can be better implemented.
        function pan(domNode, direction) {
            var speed = thisGraph.consts.PAN_SPEED;
            if (panTimer) {
                clearTimeout(panTimer);
                var translateCoords = d3.transform(thisGraph.state.svgGroup.attr("transform"));
                var translateX,translateY;
                if (direction == 'left' || direction == 'right') {
                    translateX = direction == 'left' ? translateCoords.translate[0] + speed : translateCoords.translate[0] - speed;
                    translateY = translateCoords.translate[1];
                } else if (direction == 'up' || direction == 'down') {
                    translateX = translateCoords.translate[0];
                    translateY = direction == 'up' ? translateCoords.translate[1] + speed : translateCoords.translate[1] - speed;
                }
				
                var scaleX = translateCoords.scale[0];
                var scaleY = translateCoords.scale[1];
                var scale = thisGraph.zoomListener.scale();
				
                thisGraph.state.svgGroup.transition().attr("transform", "translate(" + translateX + "," + translateY + ")scale(" + scale + ")");
                d3.select(domNode).select('g.node').attr("transform", "translate(" + translateX + "," + translateY + ")");
                thisGraph.zoomListener.scale(thisGraph.zoomListener.scale());
                thisGraph.zoomListener.translate([translateX, translateY]);
                panTimer = setTimeout(function() {
                    pan(domNode, speed, direction);
                }, thisGraph.consts.PAN_TIMEINTERVAL); 
            }
        }	
		
        // Define the zoom function for the zoomable tree
        function zoom() {
            thisGraph.state.svgGroup.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
        }

        // define the zoomListener which calls the zoom function on the "zoom" event constrained within the scaleExtents
        thisGraph.zoomListener = d3.behavior.zoom().scaleExtent([0.1, 3]).on("zoom", zoom);
        thisGraph.state.svg.call(thisGraph.zoomListener).on("dblclick.zoom", null); //disable doubleclick zoom

        function initiateDrag(nodedata, domNode,nodesChildrenData) {
			
            draggingNode_data = nodedata;
            d3.select(domNode).select('.ghostCircle').attr('pointer-events', 'none');
            d3.selectAll('.ghostCircle').attr('class', 'ghostCircle show');
            d3.select(domNode).attr('class', 'node activeDrag');

            thisGraph.state.svgGroup.selectAll("g.node").sort(function(a, b) { // select the parent and sort the path's
                if (a.id != draggingNode_data.id) return 1; // a is not the hovered element, send "a" to the back
                else return -1; // a is the hovered element, bring "a" to the front
            });
            // if nodes has children, remove the links and nodes
            if (nodesChildrenData.length > 1) {
				
                // remove link paths (parentchild links)
                var links = thisGraph.tree.links(nodesChildrenData);
                var nodePaths = thisGraph.state.svgGroup.selectAll("path.link")
					.data(links, function(d) {
					    return d.target.id;
					}).remove();
				
                // remove child nodes
                var nodesExit = thisGraph.state.svgGroup.selectAll("g.node")
					.data(nodesChildrenData, function(d) {
					    return d.id;
					}).filter(function(d, i) {
					    if (d.id == draggingNode_data.id) {
					        return false;
					    }
					    return true;
					}).remove();
            }

            // remove parent link
            var parentLink = thisGraph.tree.links(thisGraph.tree.nodes(draggingNode_data.parent));
            thisGraph.state.svgGroup.selectAll('path.link').filter(function(d, i) {
                if (d.target.id == draggingNode_data.id) {
                    return true;
                }
                return false;
            }).remove();

            // remove affected/causal link
            thisGraph.state.svgGroup.selectAll('path.affectedlink').remove();
			
            dragStarted = false;
        }

        //if (mvMode == thisGraph.consts.DesignMode) 
        //{

        
        // Define the drag listeners for drag/drop behaviour of nodes.
        thisGraph.dragListener = d3.behavior.drag()
			.on("dragstart", function(d) {
			    if (d == thisGraph.state.root) { return; }
				
			    dragStarted = true;
			    dragNodeChildren_data = thisGraph.tree.nodes(d);
			    d3.event.sourceEvent.stopPropagation();
			    // it's important that we suppress the mouseover event on the node being dragged. Otherwise it will absorb the mouseover event and the underlying node will not detect it d3.select(this).attr('pointer-events', 'none');
			})
			.on("drag", function(d) {
			    if (d == thisGraph.state.root) { return;}
				
			    domNodeDragged = this;
				
			    if (dragStarted) {
			        initiateDrag(d, domNodeDragged,dragNodeChildren_data);
			    }

			    // get coords of mouseEvent relative to svg container to allow for panning
			    var relCoords = d3.mouse(svgContainer[0][0]);
			    var panBoundary = thisGraph.consts.PAN_BOUNDARY;
			    if (relCoords[0] < panBoundary) {
			        panTimer = true;
			        pan(domNodeDragged, 'left');
			    } else if (relCoords[0] > (thisGraph.state.svg.attr('width') - panBoundary)) { 
			        panTimer = true;
			        pan(domNodeDragged, 'right');
			    } else if (relCoords[1] < panBoundary) {
			        panTimer = true;
			        pan(domNodeDragged, 'up');
			    } else if (relCoords[1] > (thisGraph.state.svg.attr('height') - panBoundary)) { 
			        panTimer = true;
			        pan(domNodeDragged, 'down');
			    } else {
			        try {
			            clearTimeout(panTimer);
			        } catch (e) {

			        }
			    }

			    d.x0 += d3.event.dy;
			    d.y0 += d3.event.dx;
				
			    var node = d3.select(domNodeDragged);
			    node.attr("transform", "translate(" + d.y0 + "," + d.x0 + ")");
			    updateTempConnector();
				
			})
			.on("dragend", function(d) {				
			    if (d == thisGraph.state.root) { return; }
				
			    domNodeDragged = this;
				
			    if (SelectedNodeOnDrag_data) {

			        if (d3.event.sourceEvent.shiftKey)
			        {
			            //shift key pressed while dragging so do the re-parent things

			            thisGraph.state.mvHandler.reParentNode(draggingNode_data.id, draggingNode_data.parent.id, SelectedNodeOnDrag_data.id);
			            var tLink = thisGraph.links.find(function(d) 
			            { return d.source == draggingNode_data.parent && d.target == draggingNode_data 
			            });
                        
			            // now remove the element from the parent, and insert it into the new elements children
			            var index = draggingNode_data.parent.children.indexOf(draggingNode_data);
			            if (index > -1) {
			                draggingNode_data.parent.children.splice(index, 1);
			            }
			            //if (typeof SelectedNodeOnDrag_data.children !== 'undefined' || typeof SelectedNodeOnDrag_data._children !== 'undefined') {
			            if ((typeof SelectedNodeOnDrag_data.children !== 'undefined' && SelectedNodeOnDrag_data.children != null) || (typeof SelectedNodeOnDrag_data._children !== 'undefined' && SelectedNodeOnDrag_data._children != null)) {
			                if (typeof SelectedNodeOnDrag_data.children !== 'undefined') {
			                    SelectedNodeOnDrag_data.children.push(draggingNode_data);
			                } else {
			                    SelectedNodeOnDrag_data._children.push(draggingNode_data);
			                }
			            } else {
			                SelectedNodeOnDrag_data.children = [];
			                SelectedNodeOnDrag_data.children.push(draggingNode_data);
			            }
			            // Make sure that the node being added to is expanded so user can see added node is correctly moved
			            thisGraph.expand(SelectedNodeOnDrag_data);
                        
			            //need to update the edge id in the links collection 
			            if (tLink != null)
			            {
			                var tEdge = thisGraph.links.find(function(d) 
			                { return d.source == SelectedNodeOnDrag_data && d.target == draggingNode_data});
			            
			                if (tEdge != null) 
			                {
			                    tEdge.id = tLink.id;
			                }
			            }

			            //thisGraph.sortTree();

				        
			        }
			        else
			        {
			            //shift key NOT pressed while dragging so create a affected link

			            //check whether the dragging node is dropped on its immediate natural parent. 
			            //if yes don't allow to do that as you can't have 2 links(natural parent and affected parent) for the same 2 nodes.
			            if (draggingNode_data.parent.id != SelectedNodeOnDrag_data.id)
			            {
			                thisGraph.state.mvHandler.createAffectedLink(SelectedNodeOnDrag_data.id, draggingNode_data.id);
			            }
                        
				        				        
			        }
			        endDrag();
			    } else {
			        endDrag();
			    }
			});

        function endDrag() {
            SelectedNodeOnDrag_data = null;
            d3.selectAll('.ghostCircle').attr('class', 'ghostCircle');
            d3.select(domNodeDragged).attr('class', 'node');
            // now restore the mouseover event or we won't be able to drag a 2nd time
            d3.select(domNodeDragged).select('.ghostCircle').attr('pointer-events', '');
            updateTempConnector();
            if (draggingNode_data !== null) {
                thisGraph.updateGraph(thisGraph.state.root);
                thisGraph.nodeClick(draggingNode_data);
                thisGraph.centerNode(draggingNode_data);
                draggingNode_data = null;

            }
        }		
        //}
    }
    function initializeVariables(){

        // variables for drag/drop
        //var selectedNode = null;
        //var draggingNode = null;
        //var dragStarted = false;
        //var domNodeDragged = null;
        //var nodeChildren = null;
		
        //user defined variables
        menu = options.menu;
        svgContainer = options.svgContainer;
    }
	
    function overCircle(d) {
        SelectedNodeOnDrag_data = d;
        updateTempConnector();
    };
    function outCircle(d) {
        SelectedNodeOnDrag_data = null;
        updateTempConnector();
    };

    // Function to update the temporary connector indicating dragging affiliation
    function updateTempConnector() {
        var data = [];
        if (draggingNode_data !== null && SelectedNodeOnDrag_data !== null) {
			
            // have to flip the source coordinates since we did this for the existing connectors on the original tree
            data = [{
                source: {
                    x: SelectedNodeOnDrag_data.y0,
                    y: SelectedNodeOnDrag_data.x0
                },
                target: {
                    x: draggingNode_data.y0,
                    y: draggingNode_data.x0
                }
            }];
        }
        var link = thisGraph.state.svgGroup.selectAll(".templink").data(data);

        link.enter().insert("path")
			.attr("class", "templink")
			.attr("d", d3.svg.diagonal())
			.attr('pointer-events', 'none');

        link.attr("d", d3.svg.diagonal());

        link.exit().remove();
    };						
	
    initializeVariables();
    initializeComponent();
}

//constants
GraphCreator.prototype.consts = {
    DEFAULT_ROOTNAME: 'Root',
    MODE_EDIT: 0,
    MODE_VIEW: 2,
    MODE_BOWTIE: 1,
		
    PAN_SPEED: 200,
    PAN_BOUNDARY: 20, // Within 20px from edges will pan when dragging.
    PAN_TIMEINTERVAL:50,
	
    ANIMATION_DURATION: 750,
	
    NODE_RADIUS: 10.5,
    NODE_GHOST_RADIUS: 30,
    NODE_SPACING: 70,
    NODE_LEVEL_SPACING: 280,
    NODE_LABEL_LEFT_SPACING: -13,
    NODE_LABEL_RIGHT_SPACING: 13,
	
    selectedClass: "selected",
    connectClass: "connect-node",
    circleGClass: "conceptG",
    graphClass: "graph",
    activeEditId: "active-editing",
    BACKSPACE_KEY: 8,
    DELETE_KEY: 46,
    ENTER_KEY: 13,
    L_KEY: 76,
    R_KEY: 82,
    SOURCE_PADDING_LEFT: 55,
    SOURCE_PADDING_RIGHT: 45,
    TARGET_PADDING_RIGHT: 55,
    TARGET_PADDING_LEFT: 45,
    NODE_COLLAPSED: 1,
    NODE_EXPANDED: 0,
    MODE_EDIT: 0,
    MODE_BOWTIE: 1,
    MODE_VIEW: 2,
    DesignMode: 0,
    RunningMode: 1
};
	
//get/set properties
GraphCreator.prototype.nodes = function(){
    var thisGraph = this;
    return thisGraph.nodes;
}
GraphCreator.prototype.edges = function(){
    var thisGraph = this;
    return thisGraph.links;	
}
GraphCreator.prototype.setMode = function(mode) {
	
    var thisGraph = this;
    if (mode < thisGraph.consts.MODE_EDIT || mode > thisGraph.consts.MODE_VIEW) return;
	
    //if (thisGraph.state.mode == thisGraph.consts.MODE_BOWTIE){
		
        thisGraph.state.svgGroup.selectAll("g.node")
			.data(thisGraph.nodes)
			.style("opacity", 1)
			.style("stroke-dasharray", 0)
			.style("fill", "")
			.style("stroke-width", 1);
			
        thisGraph.state.svgGroup.selectAll("path")
			.data(thisGraph.links)
			.style("opacity", 1)
			.style("stroke-dasharray", "0");
		
        thisGraph.state.nodeTrace = [];	
        thisGraph.state.edgeTrace = [];	
   // }

    thisGraph.state.mode = mode;
    thisGraph.state.mvHandler.mode = mode;
	
    //if (thisGraph.state.mode == thisGraph.consts.MODE_BOWTIE){ 
	    
        //remove all the graph artifacts
        thisGraph.state.svgGroup.selectAll('path.affectedlink').remove();
        thisGraph.state.svgGroup.selectAll('path.link').remove();
        thisGraph.state.svgGroup.selectAll('.node').remove();

        thisGraph.expand(thisGraph.state.root);

        if (thisGraph.state.selectedNode){
            thisGraph.selectNode(thisGraph.state.selectedNode);
            thisGraph.centerNode(thisGraph.state.selectedNode);

        }
    //}
    }
GraphCreator.prototype.getMode = function() {
    var thisGraph = this;
	
    return thisGraph.state.mode;
}

//public methods
GraphCreator.prototype.createNode = function(node){

    if (!node) return;
	
    var thisGraph = this;
    var create_node_parent = thisGraph.state.selectedNode;
	
    if (create_node_parent) {
        //call the dbl click event to populate its children
        thisGraph.nodeDoubleClick(create_node_parent);

        if (create_node_parent._children != null)  {
            create_node_parent.children = create_node_parent._children;
            create_node_parent._children = null;
        }
        if (create_node_parent.children == null) {
            create_node_parent.children = [];
        }
    }

    id = node.id || thisGraph.createGuid(); 
    /*new_node = { 'name': node.name, 
				 'id' :  "L" + id.replace(/\./gi, "_"),
				 'depth': (create_node_parent) ? create_node_parent.depth + 1 : 0,                           
				 'children': [], 
				 '_children':null,
				 'otherRelation': null	
	};*/
    new_node = { 'name': node.name, 
        'id' :  id,
        'depth': (create_node_parent) ? create_node_parent.depth + 1 : 0,                           
        'children': [], 
        '_children':null,
        'otherRelation': null	
    };
    console.log('Create Node name: ' + node.name);

    if (create_node_parent) {
        create_node_parent.children.push(new_node);
        thisGraph.updateGraph(create_node_parent);
    } else {
        thisGraph.updateGraph(new_node);
    }
	
    thisGraph.centerNode(new_node);
	
	
}

GraphCreator.prototype.updateNode = function(node){}
GraphCreator.prototype.linkNodes = function(){}
GraphCreator.prototype.deleteLink = function(node){}

GraphCreator.prototype.deleteAffectedLink = function(edge){
    
    var thisGraph = this;
    var sourceNode = thisGraph.nodes.find(function(n){ return n.id == edge.affected.id});
    var targetNode = thisGraph.nodes.find(function(n){ return n.id == edge.causal.id});

    //remove the edge from source node
    if (sourceNode != null)
    {
        if (sourceNode.otherRelation != null && sourceNode.otherRelation != {})
        {
            var tempEdge = sourceNode.otherRelation.edges.find(function(n){ return n.id == edge.id});
            if (tempEdge != null)
            {
                var index = sourceNode.otherRelation.edges.indexOf(tempEdge);
                if (index > -1)
                {
                    sourceNode.otherRelation.edges.splice(index, 1);
                }
            }
        }
    }

    //remove the edge from the target node
    if (targetNode != null)
    {
        if (targetNode.otherRelation != null && targetNode.otherRelation != {})
        {
            var tempEdge = targetNode.otherRelation.edges.find(function(n){ return n.id == edge.id});
            if (tempEdge != null)
            {
                var index = targetNode.otherRelation.edges.indexOf(tempEdge);
                if (index > -1)
                {
                    targetNode.otherRelation.edges.splice(index, 1);
                }
            }
        }
    }

    //remove the affected link from the multi_parent_nodes_data
    if (thisGraph.state.multi_parent_nodes_data[edge.id] != null)
    {
        delete thisGraph.state.multi_parent_nodes_data[edge.id];
    	    
        thisGraph.updateGraph(thisGraph.state.root);
        //raise the event to delete the selected affected link
        thisGraph.state.mvHandler.deleteAffectedLink(edge.id);

        if (sourceNode != null) 
        {
            thisGraph.nodeClick(sourceNode);
            thisGraph.centerNode(sourceNode);
        }
    }
}

GraphCreator.prototype.deleteNode = function(node){
	
    var thisGraph = this;
    var selectedNode = node || thisGraph.state.selectedNode;
    var selectedNodeParent = node.parent;
	
    thisGraph.visit(thisGraph.state.root, function(d) {
        if (d.children) {
            for (var child of d.children) {
                    if (child == selectedNode) {
                //d.children = _.without(d.children, child);
                var index = d.children.indexOf(child);
                if (index > -1) {
                    d.children.splice(index, 1);
                } 
                thisGraph.updateGraph(thisGraph.state.root);
                if (selectedNodeParent != null) 
                {
                    thisGraph.nodeClick(selectedNodeParent);
                }
                break;
            }
        } 
    }
    },
	function(d) {
	    return d.children && d.children.length > 0 ? d.children : null;
	});	
}
GraphCreator.prototype.showBowtieView = function(sourceNode){
    var thisGraph = this;
	
    sourceNode = sourceNode || thisGraph.state.selectedNode;
	
    if (!sourceNode) return;
	
    //Create an array logging what is connected to what
    var linkedByIndex = {};
    var neighbouringNode = [];
	
    neighbouringNode.push(sourceNode);
	
    //neighbouringNode =  childNode + affectedNode + causalNodes + parent
    //child nodes
    if (sourceNode.children) {
        for (var i = 0; i < sourceNode.children.length; i++) {
            neighbouringNode.push(sourceNode.children[i]);
        };	
    }
	
    //affectedNode + causalNodes
    for (var key in thisGraph.state.multi_parent_nodes_data) {
        var multiPair = thisGraph.state.multi_parent_nodes_data[key];
		
        var Node = null;
        if (multiPair.affected.id == sourceNode.id ){
            Node = thisGraph.nodes.find(function(n) { return n.id == multiPair.causal.id });
        } else if (multiPair.causal.id == sourceNode.id){
            Node = thisGraph.nodes.find(function(n) { return n.id == multiPair.affected.id });
        }
		
        if (Node) neighbouringNode.push(Node);
    }	
	
    //parent
    if (sourceNode.parent) neighbouringNode.push(sourceNode.parent);
	
    //Reduce the opacity of all but the neighbouring nodes
    thisGraph.state.svgGroup.selectAll('g.node').style("opacity", 0.1);
    thisGraph.state.svgGroup.selectAll('g.node').data(neighbouringNode, function(d){ return d.id;}).transition().duration(thisGraph.consts.ANIMATION_DURATION).style("opacity", 1);
			
    thisGraph.state.svgGroup.selectAll('path').transition().style("opacity", function (o) {
        return ((o.source && sourceNode.id==o.source.id) | (o.target && sourceNode.id==o.target.id) | (o.causal && sourceNode.id==o.causal.id) | (o.affected && sourceNode.id==o.affected.id)) ? 1 : 0.1;
    });
			
    thisGraph.state.svgGroup.selectAll('g.node')
	.data(thisGraph.state.nodeTrace, function(d) {return d.id;}).transition().duration(thisGraph.consts.ANIMATION_DURATION).style("stroke-dasharray", "10,3").style("stroke-width", 1).style("opacity",1).style("fill","#ff0000");	
    
    thisGraph.state.svgGroup.selectAll('path').data(thisGraph.state.edgeTrace, function(d) { return String(d.id);}).transition().duration(thisGraph.consts.ANIMATION_DURATION).style("stroke-dasharray", "10,3").style("opacity",1);
}

/*
	initializeTreeData : converts graphData to TreeData
	graphData:	FORMAT { nodes[{id:,title:,parentid:}....],edges[{id:,source;,target:}....]}
	TreeData: 	FORMAT  { 
							id: {id}, 
							name: {title},
							edge: null, //parent edge 
							children: [
								{
									id: {id},
									name:,
									edgeid:, //parent edge id
									children: [
										{
											id: {id},
											name:,
											edge: {id:}, //parent edge id
											children:[...],
											otherRelation: {
												nodes: [{id:,title:}....],
												edges[{id:,source;,target:}....]}
											}
										}
									....
									],
									otherRelation: {
										nodes: [{id:,title:}....],
										edges[{id:,source;,target:}....]}
									}
								}	
								...
							],
							otherRelation: {
								nodes: [{id:,title:}....],
								edges[{id:,source;,target:}....]}
							}
						}
*/	
GraphCreator.prototype.ConvertGraphDataToTreeData = function(graphData){
	
    var thisGraph = this;
	
    var treeData = {};
    var nodes = graphData.nodes;
    var edges = graphData.edges;
    var graphRoot = null;
    var treeRoot = null;
	
    //get the root (hint: parentid: null) 
    graphRoot = nodes.find(function(n) {
        return (n.parentid == null);
    });			
	
    treeRoot = { };
    treeRoot.id = (graphRoot) ? graphRoot.id : thisGraph.createGuid();
    treeRoot.name = (graphRoot) ? graphRoot.title : thisGraph.consts.DEFAULT_ROOTNAME;
    treeRoot.parentid = (graphRoot) ? graphRoot.parentid : null;
    treeRoot.children = [];
    treeRoot.otherRelation = null;
    treeRoot.type = (graphRoot) ? graphRoot.type : null;
	
    treeData = treeRoot;
	
    return treeData;
}
GraphCreator.prototype.createGuid = function(){
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
		  .toString(16)
		  .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}
GraphCreator.prototype.visit = function(nodeData, visitFn, childrenFn) {
    // A recursive helper function for performing some setup by walking through all nodes

    var thisGraph = this;
    if (!nodeData) return;

    visitFn(nodeData);

    var children = childrenFn(nodeData);
    if (children) {
        var count = children.length;
        for (var i = 0; i < count; i++) {
            thisGraph.visit(children[i], visitFn, childrenFn);
        }
    }
}
GraphCreator.prototype.sortTree = function() {
    // sort the tree according to the node names
    var thisGraph = this;
	
    if (!thisGraph.tree) return; 
	
    thisGraph.tree.sort(function(a, b) {
        return b.name.toLowerCase() < a.name.toLowerCase() ? 1 : -1;
    });
}
GraphCreator.prototype.updateGraph = function (node) {
    var thisGraph = this;
    var nodeToUpdate = node ||  thisGraph.state.root;
	
    // Compute the new height, function counts total children of root node and sets tree height accordingly.
    // This prevents the layout looking squashed when new nodes are made visible or looking sparse when nodes are removed
    // This makes the layout more consistent.
    var levelWidth = [1];
    var childCount = function(level, n) {

        if (n.children && n.children.length > 0) {
            if (levelWidth.length <= level + 1) levelWidth.push(0);

            levelWidth[level + 1] += n.children.length;
            n.children.forEach(function(d) {
                childCount(level + 1, d);
            });
        }
    };

    childCount(0, thisGraph.state.root);
    var newHeight = d3.max(levelWidth) * thisGraph.consts.NODE_SPACING; // 25 pixels per line (changes the spacing between nodes) 
    thisGraph.tree = thisGraph.tree.size([newHeight, thisGraph.state.viewerWidth]);

    tmpLinks = thisGraph.links;

    // Compute the new tree layout.
    thisGraph.nodes = thisGraph.tree.nodes(thisGraph.state.root).reverse(),
	thisGraph.links = thisGraph.tree.links(thisGraph.nodes);
	
    if (tmpLinks != null)
    {
        UpdateAllEdgeswithId();
    }
	

    function UpdateAllEdgeswithId()
    {
        //this will update the links collection with edge id
        tmpLinks.forEach(function(n) {
			            
            var tempEdge = thisGraph.links.find(function(d) 
            { return d.source == n.source && d.target == n.target});
			            
            if (tempEdge != null) 
            {
                tempEdge.id = n.id;
            }
        });
    }

	
    var nodes = thisGraph.nodes;
    var links = thisGraph.links;

    // Set widths between levels based on maxLabelLength.
    nodes.forEach(function(d) {
        //d.y = (d.depth * (maxLabelLength * 10)); //maxLabelLength * 10px
        // alternatively to keep a fixed scale one can set a fixed depth per level
        // Normalize for fixed-depth by commenting out below line
        d.y = (d.depth * thisGraph.consts.NODE_LEVEL_SPACING); //300 //500px per level. (changes the spacing between the level of nodes)
    });

    var i=0;
	
    // Update the nodes…
    var node = thisGraph.state.svgGroup.selectAll("g.node")
			.data(nodes, function(d) {
			    return d.id || (d.id = ++i);
			});

    // Enter any new nodes at the parent's previous position.
    var nodeEnter = node.enter().append("g")
			.call(thisGraph.dragListener)
			.attr("class", "node")
			.attr("id", function(d) {return "L" + d.id.replace(/\./gi, "_");})
            .attr("transform", function(d) {
                return "translate(" + nodeToUpdate.y0 + "," + nodeToUpdate.x0 + ")";
            })
        .on('click', thisGraph.event.onNodeClick)
        .on('contextmenu', thisGraph.event.onNodeRightClick)
    	.on('mouseup', thisGraph.event.onNodeMouseup); 

    //.on('click', thisGraph.event.onNodeClick)
    //.on('dblclick', thisGraph.event.onNodeDblclick)
    //.on('mouseup', thisGraph.event.onNodeMouseup); 

    nodeEnter.append("circle")
		.attr('class', 'nodeCircle')
		.attr("r", 0)
		.style("fill", thisGraph.event.onColorNode);

    nodeEnter.append("text")
		.attr("x", function(d) {
		    return d.children || d._children ? thisGraph.consts.NODE_LABEL_LEFT_SPACING : thisGraph.consts.NODE_LABEL_RIGHT_SPACING; //-10 : 10; (changes the spacing of the label)
		})
		.attr("dy", ".35em")
		.attr('class', 'nodeText')
		.attr("text-anchor", function(d) {
		    return d.children || d._children ? "end" : "start";
		})
		.text(function(d) {
		    return d.name;
		})
		.style("fill-opacity", 0);

    // phantom node to give us mouseover in a radius around it
    nodeEnter.insert("circle")
		.attr('class', 'ghostCircle')
		.attr("r", thisGraph.consts.NODE_GHOST_RADIUS)
		.attr("opacity", 0.2) // change this to zero to hide the target area
		.style("fill", "red")
		.attr('pointer-events', 'mouseover')
		.on("mouseover", thisGraph.event.onMouseover)
		.on("mouseout", thisGraph.event.onMouseout);

    // Update the text to reflect whether node has children or not.
    node.select('text')
		.attr("x", function(d) {
		    return d.children || d._children ? thisGraph.consts.NODE_LABEL_LEFT_SPACING : thisGraph.consts.NODE_LABEL_RIGHT_SPACING; //-10 : 10; (changes the spacing of the label)
		})
		.attr("text-anchor", function(d) {
		    return d.children || d._children ? "end" : "start";
		})
		.text(function(d) {
		    
		    var text = d.name;

		    if (d.children && text.length >= 15) {
		        text = (text.slice(0,14) + "...")
		    }
		    
		    return text;
		});

    // Change the circle fill depending on whether it has children and is collapsed
    node.select("circle.nodeCircle")
		.attr("r", thisGraph.consts.NODE_RADIUS)//4.5 //(changes the radius of the node)
		.style("fill", thisGraph.event.onColorNode);

    // Add a context menu
    //node.on('contextmenu', d3.contextMenu(thisGraph.menu));


    // Transition nodes to their new position.
    var nodeUpdate = node.transition()
		.duration(thisGraph.consts.ANIMATION_DURATION)
		.attr("transform", function(d) {
		    return "translate(" + d.y + "," + d.x + ")";
		});

    // Fade the text in
    nodeUpdate.select("text")
		.style("fill-opacity", 1);

    // Transition exiting nodes to the parent's new position.
    var nodeExit = node.exit().transition()
		.duration(thisGraph.consts.ANIMATION_DURATION)
		.attr("transform", function(d) {
		    return "translate(" + nodeToUpdate.y + "," + nodeToUpdate.x + ")";
		})
		.remove();

    nodeExit.select("circle")
		.attr("r", 0);

    nodeExit.select("text")
		.style("fill-opacity", 0);

    // Update the links…
    var link = thisGraph.state.svgGroup.selectAll("path.link")
			.data(links, function(d) {
			    return d.target.id;
			});

    // define a d3 diagonal projection for use by the node paths later on.
    var diagonal = d3.svg.diagonal()
		.projection(function(d) {
		    return [d.y, d.x];
		});

    // Enter any new links at the parent's previous position.
    link.enter().insert("path", "g")
		.attr("class", "link")
		.attr("id", function(d) {return d.id;})
		.attr("d", function(d) {
		    var o = {
		        x: nodeToUpdate.x0,
		        y: nodeToUpdate.y0
		    };
				
		    return diagonal({
		        source: o,
		        target: o
		    });
		}).style('marker-start', function(d) { return 'url(#end)'; }).on('click',thisGraph.event.onLinkClick)
	    

    // Transition links to their new position.
    link.transition()
		.duration(thisGraph.consts.ANIMATION_DURATION)
		.attr("d", diagonal);

    // Transition exiting nodes to the parent's new position.
    link.exit().transition()
		.duration(thisGraph.consts.ANIMATION_DURATION)
		.attr("d", function(d) {
		    var o = {
		        x: nodeToUpdate.x,
		        y: nodeToUpdate.y
		    };
				
		    return diagonal({
		        source: o,
		        target: o
		    });
		})
		.remove();

    // Stash the old positions for transition.
    nodes.forEach(function(d) {
        d.x0 = d.x;
        d.y0 = d.y;
    });
			
    //get the affected node links for the childrens
    if (nodeToUpdate.children){
        nodeToUpdate.children.forEach(function(c){
            if (!c.otherRelation){
                //getRelated(c);
                thisGraph.state.mvHandler.getIndirectLinks(c.id);
            }	
        });
    }			
			
    //draw the affected node links for the childrens
    renderAffectedLinks();			
		
    function renderAffectedLinks(){
        var affectedLinks = [];
		
        var nodes = thisGraph.tree.nodes(thisGraph.state.root).reverse();
		
        for (var key in thisGraph.state.multi_parent_nodes_data) {
            var multiPair = thisGraph.state.multi_parent_nodes_data[key];
			
            var affectedNode = nodes.find(function(n) { return n.id == multiPair.affected.id });
            var causalNode = nodes.find(function(n) { return n.id == multiPair.causal.id });
			
            if (causalNode && affectedNode) affectedLinks.push(multiPair);
        }
		
        //thisGraph.state.svgGroup.selectAll("path.affectedlink").remove();
				
        // Update the affectedlinks…
        var affectedlink = thisGraph.state.svgGroup.selectAll("path.affectedlink")
			.data(affectedLinks , function(d) {
			    return d.id;
			});

        // Enter any new links at the parent's previous position.
        affectedlink.enter().insert("path", "g")
			.attr("class", "affectedlink")
			.attr("id", function(d) {return d.id;})
			.attr("d", function(d) {
			    if (!d.affected || !d.causal) return;
			    var dx = d.affected.x0 - d.causal.x0,
                dy = d.affected.y0 - d.causal.y0,
                dr = Math.sqrt(dx * dx + dy * dy);
			    return "M" + d.causal.y0 + "," + d.causal.x0 + "A" + dr + "," + dr + " 0 0,0 " + d.affected.y0 + "," + d.affected.x0;
			})
			.style('marker-end', function(d) { return 'url(#start)'; })
			.on('click',thisGraph.event.onLinkClick);
            
        // Transition links to their new position.
        affectedlink.transition()
			.duration(thisGraph.consts.ANIMATION_DURATION)
			.attr("d", function(d) {
			    if (!d.affected || !d.causal) return;
			    var dx = d.affected.x0 - d.causal.x0,
                dy = d.affected.y0 - d.causal.y0,
                dr = Math.sqrt(dx * dx + dy * dy);
			    return "M" + d.causal.y0 + "," + d.causal.x0 + "A" + dr + "," + dr + " 0 0,0 " + d.affected.y0 + "," + d.affected.x0;
			});            
            
        // Transition exiting nodes to the parent's new position.
        affectedlink.exit().transition()
			.duration(thisGraph.consts.ANIMATION_DURATION)
			.attr("d", function(d) {
			    if (!d.affected || !d.causal) return;
			    var dx = d.affected.x0 - d.causal.x0,
                dy = d.affected.y0 - d.causal.y0,
                dr = Math.sqrt(dx * dx + dy * dy);
			    return "M" + d.causal.y0 + "," + d.causal.x0 + "A" + dr + "," + dr + " 0 0,0 " + d.affected.y0 + "," + d.affected.x0;
			})
			.remove();	
    }
    function UpdateRelated(sourceNode){
        var nodes = thisGraph.tree.nodes(thisGraph.state.root);
        sourceNode.otherRelation.edges.forEach(function(e){
			
            var affected = nodes.find(function(n){ return n.id == e.target });
            var causal = nodes.find(function(n){ return n.id == e.source });
			
            if (affected && causal) {
                thisGraph.state.multi_parent_nodes_data[e.id] = {id:e.id, causal: causal, affected: affected};
            }
        });
    }
    
    GraphCreator.prototype.getRelated = function (data, node){
        
        var thisGraph = this;
        var tempNode = thisGraph.nodes.find(function(n) { return n.id == node.id });

        if (!tempNode) return;
        
        if (!tempNode.otherRelation) tempNode.otherRelation = {};
        tempNode.otherRelation = data;
        UpdateRelated(tempNode);

        //draw the affected node links for the childrens
        renderAffectedLinks();	
    }
}
GraphCreator.prototype.loadGraph = function(treeData) {
	
    var thisGraph = this;
	
    //unload any existing graph
    thisGraph.unloadGraph();
	
    // Calculate total nodes, max label length
    var totalNodes = 0;
    var maxLabelLength = 0;	
	
    // Define the root
    thisGraph.state.root = treeData;
    thisGraph.state.root.x0 = thisGraph.state.viewerHeight / 2;
    thisGraph.state.root.y0 = 0;
	
    // Call visit function to establish maxLabelLength
    thisGraph.visit(treeData, function(d) {
        totalNodes++;
        maxLabelLength = Math.max(d.name.length, maxLabelLength);

    }, function(d) {
        return d.children && d.children.length > 0 ? d.children : null;
    });
	
    // Sort the tree initially incase the JSON isn't in a sorted order.
    //thisGraph.sortTree();	
		
    // Layout the tree initially and center on the root node.
    thisGraph.updateGraph(thisGraph.state.root);
    thisGraph.centerNode(thisGraph.state.root);	
}
GraphCreator.prototype.unloadGraph = function() {
	
    var thisGraph = this;

    //remove all the graph artifacts
    thisGraph.state.svgGroup.selectAll('path.affectedlink').remove();
    thisGraph.state.svgGroup.selectAll('path.link').remove();
    thisGraph.state.svgGroup.selectAll('.node').remove();

    //reset state variables
    thisGraph.state.root = null;
    thisGraph.state.selectedNode = null;
    thisGraph.state.draggingNode = null;
	
    thisGraph.state.multi_parent_nodes_data = [];
	
	
}
GraphCreator.prototype.collapse = function(sourceNode) {
    var thisGraph = this;
	
    if (sourceNode.children) {
        sourceNode._children = sourceNode.children;
        sourceNode._children.forEach(function(d){
            thisGraph.collapse(d);
        });
        sourceNode.children = null;
    }
	
    thisGraph.updateGraph(sourceNode);
    thisGraph.centerNode(sourceNode);
}									
GraphCreator.prototype.expand = function expand(sourceNode) {
    var thisGraph = this;
	
    if (sourceNode._children) {
        sourceNode.children = sourceNode._children;
        sourceNode.children.forEach(function(d){
            thisGraph.expand(d);
        });
        sourceNode._children = null;
    }
	
    thisGraph.updateGraph(sourceNode);
    thisGraph.centerNode(sourceNode);	
}	
GraphCreator.prototype.updateWindow = function () {
	
    var thisGraph = this;
    var docEl = document.documentElement,
		bodyEl = document.getElementsByTagName('body')[0];
    var x = window.innerWidth || docEl.clientWidth || bodyEl.clientWidth;
    var y = window.innerHeight || docEl.clientHeight || bodyEl.clientHeight;
    thisGraph.state.svg.attr("width", x).attr("height", y);
};

GraphCreator.prototype.getChildren = function(graphData,sourceNode){
    var thisGraph = this;
    var state = thisGraph.state;
    
    var srcNode = sourceNode || state.selectedNode;


    if (!srcNode.children) srcNode.children = [];
    graphData.nodes.forEach(function(n,i){
        srcNode.children.push({id:n.id,name:n.title,parentid:srcNode.id,children:[],otherRelation:null,type:n.type});
    });	
    srcNode._children = null;

    thisGraph.updateGraph(srcNode);
    thisGraph.centerNode(srcNode);

    UpdateEdgesId(graphData);

    //the below call is to highlight the search results. this call should be here
    //as the getchildren will be loaded one by one for the search results.
    if (thisGraph.state.getchildrenFor != [] && thisGraph.state.getchildrenFor != null)
    {
        if (thisGraph.state.getchildrenFor.length > 0)
        {
            thisGraph.getChildrenForSearchResults();
        }
    }


    function UpdateEdgesId(data)
    {
        //this will update the links collection with edge id
        data.edges.forEach(function(n) {
			            
            var tempEdge = thisGraph.links.find(function(d) 
            { return d.source.id == n.target && d.target.id == n.source});
			            
            if (tempEdge != null) 
            {
                tempEdge.id = n.id;
            }
        });
    }

}

GraphCreator.prototype.centerNode = function(sourceNode){
	
    // Function to center node when clicked/dropped so node doesn't get lost when collapsing/moving/searching with large amount of children.	
    var thisGraph = this;

    var scale = thisGraph.zoomListener.scale();
    var x = -sourceNode.y0;
    var y = -sourceNode.x0;
	
    x = x * scale + thisGraph.state.viewerWidth / 2;
    y = y * scale + thisGraph.state.viewerHeight / 2;
	
    d3.select('g').transition()
		.duration(thisGraph.consts.ANIMATION_DURATION)
		.attr("transform", "translate(" + x + "," + y + ")scale(" + scale + ")");
		
    thisGraph.zoomListener.scale(scale);
    thisGraph.zoomListener.translate([x, y]);
	
}
GraphCreator.prototype.searchNode = function (searchVal) {
    var thisGraph = this;
	
    var node = thisGraph.nodes;
	
    if (searchNode === "none") {
        thisGraph.state.svgGroup.selectAll("g.node")
			.data(thisGraph.nodes)
			.style("stroke", "white")
			.style("stroke-width", "1");
    } else {
        var MatchingNode = thisGraph.nodes.filter(function (d, i) {
            return d.name === searchVal;
        });
		
        if (MatchingNode.length > 0) thisGraph.centerNode(MatchingNode[0]);
    }
}	
GraphCreator.prototype.selectNode = function(node) {
    var thisGraph = this;
    var state = thisGraph.state;
	
    if (state.selectedEdge) {
        thisGraph.removeSelectFromEdge.call(thisGraph);
    }

    var prevNode = state.selectedNode;
    thisGraph.replaceSelectNode.call(thisGraph,node);

    //if (!prevNode || prevNode !== node) {
    //	thisGraph.replaceSelectNode.call(thisGraph,node);
    //} else {
    //thisGraph.removeSelectFromNode.call(thisGraph);
	    
    //}
    
}
GraphCreator.prototype.selectEdge = function(edge) {
    var thisGraph = this;
    var state = thisGraph.state;
	
    if (state.selectedNode) {
        thisGraph.removeSelectFromNode.call(thisGraph);
    }

    var prevEdge = state.selectedEdge;
    thisGraph.replaceSelectEdge.call(thisGraph,edge);

    //if (!prevEdge || prevEdge !== edge) {
    //	thisGraph.replaceSelectEdge.call(thisGraph,edge);
    //} else {
    //	thisGraph.removeSelectFromEdge.call(thisGraph);
    //}	
}
GraphCreator.prototype.replaceSelectEdge = function(edge){
    var thisGraph = this;
	
    if (thisGraph.state.selectedEdge) {
        thisGraph.removeSelectFromEdge.call(thisGraph);
    }
    var selectedObj =  thisGraph.state.svgGroup.selectAll('path');
    selectedObj.classed(thisGraph.consts.selectedClass, function(d) {
        return (edge.source && edge.target && d.source && d.target && edge.source.id == d.source.id && edge.target.id == d.target.id) || (edge.affected && edge.causal && d.affected && d.causal && edge.affected.id == d.affected.id && edge.causal.id == d.causal.id);
    });
	
    thisGraph.state.selectedEdge = edge;	
}
GraphCreator.prototype.replaceSelectNode = function(node) {
    var thisGraph = this;
	
    if (thisGraph.state.selectedNode) {
        thisGraph.removeSelectFromNode.call(thisGraph);
    }
	
    var selectedObj =  thisGraph.state.svgGroup.select('#L' + node.id.replace(/\./gi, "_"));
    selectedObj.classed(thisGraph.consts.selectedClass, true);
	
    thisGraph.state.selectedNode = node;	
}
GraphCreator.prototype.removeSelectFromNode = function() {
    var thisGraph = this;
    thisGraph.state.svgGroup.selectAll('g.node').classed(thisGraph.consts.selectedClass, false);
    thisGraph.state.selectedNode = null;
}
GraphCreator.prototype.removeSelectFromEdge = function() {
    var thisGraph = this;
    thisGraph.state.svgGroup.selectAll('path').classed(thisGraph.consts.selectedClass, false);
    thisGraph.state.selectedEdge = null;
}

GraphCreator.prototype.nodeClick = function(node){
    var thisGraph = this;
 
    thisGraph.event.onNodeClick.call(thisGraph,node);


}

GraphCreator.prototype.nodeClickbyId = function(node){
    var thisGraph = this;
    var tempNode = thisGraph.nodes.find(function(n) { return n.id == node.id });

    if (!tempNode) return;
 
    thisGraph.event.onNodeClick.call(thisGraph,tempNode);
}

GraphCreator.prototype.nodeDoubleClick = function(node){
    var thisGraph = this;
 
    thisGraph.event.onNodeDblclick.call(thisGraph,node);
}

GraphCreator.prototype.updateNode = function(node){

    var thisGraph = this;
    var tempNode = thisGraph.nodes.find(function(n) { return n.id == node.id });

    if (!tempNode) return;
    
    tempNode.name = node.title;

    thisGraph.updateGraph(tempNode);
 
}

GraphCreator.prototype.expandNodebyId = function(node){

    var thisGraph = this;
    var tempNode = thisGraph.nodes.find(function(n) { return n.id == node.id });

    if (!tempNode) return;
       
    thisGraph.expand(tempNode);
 
}

GraphCreator.prototype.collapseNodebyId = function(node){

    var thisGraph = this;
    var tempNode = thisGraph.nodes.find(function(n) { return n.id == node.id });

    if (!tempNode) return;
       
    thisGraph.collapse(tempNode);
 
}

GraphCreator.prototype.deleteNodebyId = function(node){

    var thisGraph = this;
    var tempNode = thisGraph.nodes.find(function(n) { return n.id == node.id });

    if (!tempNode) return;
       
    thisGraph.deleteNode(tempNode);
 
}

GraphCreator.prototype.centerNodebyId = function(node){

    var thisGraph = this;
    var tempNode = thisGraph.nodes.find(function(n) { return n.id == node.id });

    if (!tempNode) return;
       
    thisGraph.centerNode(tempNode);
 
}

GraphCreator.prototype.centerNodebyId = function(node){

    var thisGraph = this;
    var tempNode = thisGraph.nodes.find(function(n) { return n.id == node.id });

    if (!tempNode) return;
       
    thisGraph.centerNode(tempNode);
 
}

GraphCreator.prototype.updateGraphbyId = function(node){

    var thisGraph = this;
    var tempNode = thisGraph.nodes.find(function(n) { return n.id == node.id });

    if (!tempNode) return;
       
    thisGraph.updateGraph(tempNode);
 
}

GraphCreator.prototype.refreshAffectedLinks = function(edgesdata, node){
    var thisGraph = this;
    var tempNode = thisGraph.nodes.find(function(n) { return n.id == node.id });

    if (!tempNode) return;

    //delete all the affected links for the selected(causal) node.
    for (var key in thisGraph.state.multi_parent_nodes_data) {
        var multiPair = thisGraph.state.multi_parent_nodes_data[key];
		
        if (multiPair.causal.id == tempNode.id){
            delete thisGraph.state.multi_parent_nodes_data[key];
        }
    }	
    
    //add all the affected links into the multi_parent_nodes_data array.
    edgesdata.edges.forEach(function(e){
			
        var affected = thisGraph.nodes.find(function(n){ return n.id == e.target });
        var causal = thisGraph.nodes.find(function(n){ return n.id == e.source });
			
        if (affected && causal) {
            thisGraph.state.multi_parent_nodes_data[e.id] = {id:e.id, causal: causal, affected: affected};
        }
    });

    thisGraph.updateGraph(thisGraph.state.root);
    if (tempNode != null) 
    {
        thisGraph.nodeClick(tempNode);
        thisGraph.centerNode(tempNode);
    }

}

GraphCreator.prototype.highlightSearchResultNode = function(searchresult){
    //search result will contain the complete path of the node to be highlighted.
    //i.e GUID#GUID1#GUID1.1#GUID1.1.3 (here "GUID1.1.3" will be highlighted and 
    //the rest of GUIDs are its parent hierarchy till the top most node)
    
    var thisGraph = this;
    var resultids = searchresult.ids;
    var res = resultids.split("#");
    var nodeFoundAt = null; 
    for (var i = res.length - 1; i >= 0; i--)
    {
        var tempNode = thisGraph.nodes.find(function(n) { return n.id == res[i] });
        if (tempNode != null) 
        {
            nodeFoundAt = i;
            break;
        }
    }
    //expand all the nodes which are found
    for (var i = 0; i < nodeFoundAt; i++)
    {
        var tempNode = thisGraph.nodes.find(function(n) { return n.id == res[i] });
        if (tempNode != null)
        {
            if (tempNode._children) {
                tempNode.children = tempNode._children;
                tempNode._children = null;
            }
        }
    }

    thisGraph.state.getchildrenFor = [];
    for (var i = nodeFoundAt; i < res.length; i++)
    {
        thisGraph.state.getchildrenFor.push(res[i]);
    }
       
    thisGraph.getChildrenForSearchResults();

    
       

}

GraphCreator.prototype.getChildrenForSearchResults = function()
{
    var thisGraph = this;

    if (thisGraph.state.getchildrenFor != [] && thisGraph.state.getchildrenFor != null)
    {
        if (thisGraph.state.getchildrenFor.length > 1)
        {
            var tempNode = thisGraph.nodes.find(function(n) { return n.id == thisGraph.state.getchildrenFor[0] });
            if (tempNode != null)
            {
                //delete thisGraph.state.getchildrenFor[0];
                thisGraph.state.getchildrenFor.splice(0, 1);
                thisGraph.nodeDoubleClick(tempNode);
            }
        }
        else if (thisGraph.state.getchildrenFor.length = 1)
        {            
            var highlightNode = thisGraph.nodes.find(function(n) { return n.id == thisGraph.state.getchildrenFor[0] });
            thisGraph.state.getchildrenFor.splice(0, 1);
            if (highlightNode != null)
            {
                thisGraph.updateGraph(thisGraph.state.root);
                thisGraph.centerNode(highlightNode);
                thisGraph.nodeClick(highlightNode);

                
            }
        }
        
    }
}

GraphCreator.prototype.getConnectingLink = function(node1,node2) {
    
    if (!(node1 && node2)) return null;
    
    var thisGraph = this;
    var tLink = thisGraph.links.find(function(link) { 
        return ((link.source.id == node1.id || link.target.id == node1.id) && (link.source.id == node2.id || link.target.id == node2.id)) 
    });
    
    //check node1 and node2 otherRelation links
    if (!tLink ) {
        for (var key in thisGraph.state.multi_parent_nodes_data) {
            var link = thisGraph.state.multi_parent_nodes_data[key];
    		
            if ((link.affected.id == node1.id || link.causal.id == node1.id) && (link.affected.id == node2.id || link.causal.id == node2.id))
            {
                tLink = {};
                tLink.id = key;
                tLink.source = link.causal.id;
                tLink.target = link.affected.id;
                break;
            }    
        }	
    }

    /*
	if (!tLink && node1.otherRelation) {
	    tLink = node1.otherRelation.edges.find(function(link) { 
                    return (link.source == node2.id || link.target == node2.id) 
                });
	}
	    
	if (!tLink && node2.otherRelation) {
	    tLink = node2.otherRelation.edges.find(function(link) { 
                    return (link.source == node1.id || link.target == node1.id) 
                });
	}
    */
    
    return tLink;
}	

GraphCreator.prototype.highlightTrackingNodes = function(pathdata, tracedata){
    var thisGraph = this;
    

    thisGraph.setMode(thisGraph.consts.MODE_EDIT);

    //setTimeout(function() {
    //    //need to finish the search operation first. after that only we can highlight the tracking nodes.
    //    //for that we are storing the values and show the tracking later
    //    thisGraph.state.tracking = []
    //    thisGraph.state.tracking.push({track: 1, trackNodes: trackresult, trackTillNode: node});

    //    thisGraph.highlightSearchResultNode(trackresult);
    //},250);

    //setTimeout(function() {
        
        if (pathdata.path.length > 0)
        {
            var path = pathdata.path[0];
            pathdata.path.splice(0, 1);

            //need to finish the search operation first. after that only we can highlight the tracking nodes.
            //for that we are storing the values and show the tracking later
            thisGraph.state.tracking = []
            thisGraph.state.tracking.push({track: 1, trackNodes: tracedata, searchpath: pathdata});

            thisGraph.highlightSearchResultNode(path);
        }

   // },250);


}

GraphCreator.prototype.showTrackingNodes = function(trackresult){
    
    var thisGraph = this;
    //clear the node and edge trace first
    thisGraph.state.nodeTrace = [];	
    thisGraph.state.edgeTrace = [];	

    var selNode = null;
        
    for (var i = 0; i < trackresult.trace.length; i++)
    {
        var tempNode = thisGraph.nodes.find(function(n) { return n.id == trackresult.trace[i].id });

        //take the first node and select that node after tracing
        if (i == 0)
        {
            selNode = tempNode;
        }
        

        if (tempNode != null) 
        {
            thisGraph.state.nodeTrace.push(tempNode);
	                
            //get the link connecting the previous and current node in the nodeTrace
            var currNode = tempNode;
            var prevNode = (thisGraph.state.nodeTrace.length > 1) ? thisGraph.state.nodeTrace[thisGraph.state.nodeTrace.length - 2] : null;
	                
            var link = thisGraph.getConnectingLink(currNode,prevNode);
            if (link) thisGraph.state.edgeTrace.push(link);
        }
    }

    thisGraph.state.svgGroup.selectAll('g.node')
	.data(thisGraph.state.nodeTrace, function(d) {return d.id;}).transition().duration(thisGraph.consts.ANIMATION_DURATION).style("stroke-dasharray", "10,3").style("stroke-width", 1).style("opacity",1).style("fill","#ff0000");	
    
    thisGraph.state.svgGroup.selectAll('path').data(thisGraph.state.edgeTrace, function(d) { return String(d.id);}).transition().duration(thisGraph.consts.ANIMATION_DURATION).style("stroke-dasharray", "10,3").style("opacity",1);
        
    thisGraph.state.tracking = [];
    //select the first node
    if (selNode != null)
    {
        //thisGraph.selectNode(selNode);
        thisGraph.nodeClick(selNode);
        thisGraph.centerNode(selNode);
    }

}