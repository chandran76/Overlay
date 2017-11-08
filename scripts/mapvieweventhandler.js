//mapview event handler class
function MapViewEventHandler(instanceMapviewControl){
	
	var thisMapViewEventHandler = this;
	var Mode;
	var NodeInformationChanged;
	var mvControl = instanceMapviewControl;
	
	MapViewEventHandler.prototype.nodeClick = function(nodeId){
		
	    mvControl.nodeClicked(nodeId);

	}
	
	MapViewEventHandler.prototype.getDirectChildren = function(nodeId){
		
	    mvControl.getDirectChildren(nodeId);
	}
	
	MapViewEventHandler.prototype.getIndirectLinks = function(nodeId){
		
	    mvControl.getIndirectLinks(nodeId);
	}
	
	MapViewEventHandler.prototype.linkClick = function(linkId){
		
		
	}
	
	MapViewEventHandler.prototype.deleteAffectedLink = function(linkId){
		
		
	}
	
	MapViewEventHandler.prototype.createAffectedLink = function(parentId, childId){
		
		
	}
	
	MapViewEventHandler.prototype.reParentNode = function(childId, oldParentId, newParentId){
		
		
	}
	
	MapViewEventHandler.prototype.getNodeColor = function(nodeType){

	    return mvControl.nodeColor(nodeType);
	}
	
	MapViewEventHandler.prototype.getmvMode = function(){
		
		
	}
	
	Object.defineProperty(this, "mode", {
		get: function(){
			return (thisMapViewEventHandler.Mode);
		},
		
		set: function(value){
			thisMapViewEventHandler.Mode = value;
		}
	});
	
	Object.defineProperty(this, "nodeInformationChanged", {
		get: function(){
			return (thisMapViewEventHandler.NodeInformationChanged);
		},
		
		set: function(value){
			thisMapViewEventHandler.NodeInformationChanged = value;
		}
	});
	
}