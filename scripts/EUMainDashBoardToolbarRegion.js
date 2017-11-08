define(function () {
	
	var controllerObject;
	var SelectedNodeId, SelectedNodeDisplayName, SelectedNodeUniqueName;
	var thisRegion;
    

	return {
		Render: function(parentDiv) {
			
			
		    thisRegion = this;
			var rb = document.createElement("u-ribbon");
			////File Menu
			//rb.addRibbonTab("File", "tabFile", 1);
			////File Group
			//rb.addTabPanelGroup("tabFile", "File Group", "fileGroup");
			//rb.addTabPanelGroupButton("fileGroup", "New", "butNew");
			//rb.addTabPanelGroupButton("fileGroup", "Open", "butOpen");
			//rb.addTabPanelGroupButton("fileGroup", "Save", "butSave");
			//rb.addTabPanelGroupButton("fileGroup", "Save As", "butSaveas");
			//rb.addTabPanelGroupButton("fileGroup", "Close", "butClose");
			////Print Settings Group
			//rb.addTabPanelGroup("tabFile", "Print Settings", "printSettings");
			//rb.addTabPanelGroupButton("printSettings", "Print Preview", "butPrintPreview");
			//rb.addTabPanelGroupButton("printSettings", "Paper Settings", "butPaperSettings");
			//rb.addTabPanelGroupButton("printSettings", "Print", "butPrint");
			
			////Edit Menu
			//rb.addRibbonTab("Edit", "tabEdit", 0);
			////General
			//rb.addTabPanelGroup("tabEdit", "General", "general");
			//rb.addTabPanelGroupButton("general", "Undo", "butUndo");
			//rb.addTabPanelGroupButton("general", "Redo", "butRedo");
			
			////ClipBoard
			//rb.addTabPanelGroup("tabEdit", "ClipBoard", "clipBoard");
			//rb.addTabPanelGroupButton("clipBoard", "Cut", "butCut");
			//rb.addTabPanelGroupButton("clipBoard", "Copy", "butCopy");
			//rb.addTabPanelGroupButton("clipBoard", "Paste", "butPaste");
			
			////Build Menu
			//rb.addRibbonTab("Build", "tabBuild", 0);
			////Build Settings
			//rb.addTabPanelGroup("tabBuild", "Build Settings", "buildSettings");
			//rb.addTabPanelGroupButton("buildSettings", "Build", "butBuild");
			//rb.addTabPanelGroupButton("buildSettings", "Rebuild", "butRebuild");
			//rb.addTabPanelGroupButton("buildSettings", "Clean", "butClean");
			
		    //Manage Model Menu
		    rb.addRibbonTab("Manage Model", "tabManageModel", 1);
		    //File Group
		    rb.addTabPanelGroup("tabManageModel", "Manage", "manageGroup");
		    rb.addTabPanelGroupButton("manageGroup", "Trigger Selected Node", "butTriggerNode");
			
			rb.addButtonEventListeners();
			rb.showActiveTab();
			
			parentDiv.appendChild(rb);
			
            
		    //add EventListener for the 'button click' event 
		    //for all the button elements of the webcomponent.
			rb.addEventListener("button-clicked", rbButtonClicked);

			function rbButtonClicked(e) {
			    //alert("rb button clicked for " + e.detail.id);

			    switch (e.detail.id) {

			        case "butTriggerNode":
			            //present the Node action cis
			            controllerObject.RequestFromChild(thisRegion, KnownRequests.PresentCIS, { cisUniqueName: "EUNodeActionCISController" });
			            break;

			    }
			}
			
			
		},
		
		Controller: function(object){
			controllerObject = object;
		},
		
	    MesageFromParent: function(message, messageInfo) {
			
	        switch (message) {

	            case Resources.NODE_SELECTED_MESSAGE:
	                
	                SelectedNodeId = messageInfo.Content["NodeId"];
	                SelectedNodeDisplayName = messageInfo.Content["NodeDisplayName"];
	                SelectedNodeUniqueName = messageInfo.Content["NodeUniqueName"];       
	                break;

	        }
			
	    }
	
	};
	
		
	
});