/*
d3: 
saveAs:
Blob:
graphData:	FORMAT { nodes[{id:,title:,parentid:}....],edges[{id:,source;,target:}....]}
svgContainer: 
*/
function MapView(d3, saveAs, Blob, graphData, svgContainer, mapviewHandler) {
    "use strict";

	var tree_root;
	var base_svg =  null;


	
	if (svgContainer) {
		base_svg =  svgContainer;
	} else  {
		
		// size of the diagram
		var docEl = document.documentElement,
		bodyEl = document.getElementsByTagName('body')[0];
			
		var width = window.innerWidth || docEl.clientWidth || bodyEl.clientWidth,
		height = window.innerHeight || docEl.clientHeight || bodyEl.clientHeight;
		
		// define the baseSvg, attaching a class for styling and the zoomListener
		base_svg = d3.select("body").append("svg").attr("id", "mapview").attr("width", width).attr("height", height);
	}

			
	var graphCreator_Options = {};
	
	graphCreator_Options.svgContainer = svgContainer;
	graphCreator_Options.menu = [
										{
												title: 'Rename node',
												action: function(elm, d, i) {
														console.log('Rename node');
														$("#RenameNodeName").val(d.name);
														rename_node_modal_active = true;
														node_to_rename = d
														$("#RenameNodeName").focus();
														$('#RenameNodeModal').foundation('reveal', 'open');
												}
										},
										{
												title: 'Delete node',
												action: function(elm, d, i) {
														console.log('Delete node');
														delete_node(d);
												}
										},
										{
												title: 'Create child node',
												action: function(elm, d, i) {
														console.log('Create child node');
														create_node_parent = d;
														create_node_modal_active = true;
														$('#CreateNodeModal').foundation('reveal', 'open');
														$('#CreateNodeName').focus();
												}
										}
								]
	
	
	var Graph = new GraphCreator(d3, saveAs, Blob, base_svg, graphCreator_Options, mapviewHandler);
	var tree_data = Graph.ConvertGraphDataToTreeData(graphData);
	Graph.loadGraph(tree_data);
	return Graph; 
};