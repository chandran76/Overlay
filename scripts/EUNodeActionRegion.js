define(function () {
	
	var controllerObject;
	
	return {
		Render: function(parentDiv) {
			
			/* var btn = document.createElement("BUTTON");
			var txt = document.createTextNode("Node Action Region");
			btn.setAttribute("id", "NodeActionRegion");
			btn.onclick = ButtonClicked;
			btn.appendChild(txt);
			parentDiv.appendChild(btn); */
			
			var acchtml = '<b-accordion target=".collapsible-toggle" selected="0"> \
							<button class="collapsible-toggle">Select Vessel</button> \
							<b-collapsible> \
								<div id = "selectvessel" class="collapsible-content"> \
								</div> \
							</b-collapsible> \
							<button class="collapsible-toggle">Select Sparepart</button> \
							<b-collapsible> \
								<div id = "selectspare" class="collapsible-content"> \
								</div> \
							</b-collapsible> \
							<button class="collapsible-toggle">Requisition Details</button> \
							<b-collapsible> \
								<div id = "reqdetails" class="collapsible-content"> \
								</div> \
							</b-collapsible> \
						</b-accordion>'
			parentDiv.innerHTML = acchtml;
			//select vessel
			var x = document.createElement("INPUT");
			x.setAttribute("type", "text");
			x.setAttribute("id", "vessel");
			var vesseldiv = document.getElementById("selectvessel");
			if (vesseldiv != undefined && vesseldiv != null){
				vesseldiv.appendChild(x);
			}
									
			var lbl = document.createElement("LABEL");
			var txt = document.createTextNode("Vessel Name: ");
			lbl.setAttribute("for", "vessel");
			lbl.appendChild(txt);
			vesseldiv.insertBefore(lbl,document.getElementById("vessel"));
			
			//select sparepart
			x = document.createElement("INPUT");
			x.setAttribute("type", "text");
			x.setAttribute("id", "spare");
			var sparediv = document.getElementById("selectspare");
			if (sparediv != undefined && sparediv != null){
				sparediv.appendChild(x);
			}
			
			var lbl = document.createElement("LABEL");
			var txt = document.createTextNode("Sparepart Description: ");
			lbl.setAttribute("for", "spare");
			lbl.appendChild(txt);
			sparediv.insertBefore(lbl,document.getElementById("spare"));
			
			//Requisition Details
			x = document.createElement("INPUT");
			x.setAttribute("type", "text");
			x.setAttribute("id", "reqno");
			var reqdiv = document.getElementById("reqdetails");
			if (reqdiv != undefined && reqdiv != null){
				reqdiv.appendChild(x);
			}
			
			var lbl = document.createElement("LABEL");
			var txt = document.createTextNode("Requisition Number: ");
			lbl.setAttribute("for", "reqno");
			lbl.appendChild(txt);
			reqdiv.insertBefore(lbl,document.getElementById("reqno"));
			
			//qty
			x = document.createElement("INPUT");
			x.setAttribute("type", "text");
			x.setAttribute("id", "qty");
			reqdiv.appendChild(x);
						
			var lbl = document.createElement("LABEL");
			var txt = document.createTextNode("Requisition Quantity: ");
			lbl.setAttribute("for", "qty");
			lbl.setAttribute("id", "lblqty");
			lbl.appendChild(txt);
			reqdiv.insertBefore(lbl,document.getElementById("qty"));
			
			var linebreak = document.createElement("BR");
			reqdiv.insertBefore(linebreak, document.getElementById("lblqty"));
			
			
			
			function ButtonClicked(){
				//controllerObject.RequestFromRegion("GetRootNode");
				alert("Node Action Region Clicked");
			}
		},
		
		Controller: function(object){
			controllerObject = object;
		},
		
		MesageFromParent: function (message, messageInfo) {
			
			/* if (request == "GetRootNode")
			{
				alert("ResponseCode: " + response.ResponseCode + "\nServer Version: " + response.ServerVersion);
			} */
			
		}
	
	};
	
		
	
});