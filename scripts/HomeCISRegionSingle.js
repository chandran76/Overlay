define(function () {
	
	var controllerObject;
	
	return {
		Render: function(parentDiv) {
			var x = document.createElement("INPUT");
			x.setAttribute("type", "text");
			x.setAttribute("id", "NodeName");
			parentDiv.appendChild(x);
			
			var lbl = document.createElement("LABEL");
			var txt = document.createTextNode("Node Name: ");
			lbl.setAttribute("for", "NodeName");
			lbl.appendChild(txt);
			parentDiv.insertBefore(lbl,document.getElementById("NodeName"));
			
			var x = document.createElement("INPUT");
			x.setAttribute("type", "text");
			x.setAttribute("id", "UniqueName");
			parentDiv.appendChild(x);
			
			var lbl = document.createElement("LABEL");
			var txt = document.createTextNode("UniqueName: ");
			lbl.setAttribute("for", "UniqueName");
			lbl.setAttribute("id", "lblUniqueName")
			lbl.appendChild(txt);
			parentDiv.insertBefore(lbl,document.getElementById("UniqueName"));
			
			var linebreak = document.createElement("BR");
			parentDiv.insertBefore(linebreak, document.getElementById("lblUniqueName"));
			
			var linebreak = document.createElement("BR");
			parentDiv.insertBefore(linebreak, document.getElementById("lblUniqueName"));
			
			
			var btn = document.createElement("BUTTON");
			var txt = document.createTextNode("OK");
			btn.setAttribute("id", "OK");
			btn.onclick = OKClicked;
			btn.appendChild(txt);
			parentDiv.appendChild(btn);
			
			var linebreak = document.createElement("BR");
			parentDiv.insertBefore(linebreak, document.getElementById("OK"));
			var linebreak = document.createElement("BR");
			parentDiv.insertBefore(linebreak, document.getElementById("OK"));
			
		
			
			function OKClicked(){
				//$(parentDiv).hide();
				controllerObject.RequestFromRegion("GetRootNode");
			}
		},
		
		Controller: function(object){
			controllerObject = object;
		},
		
		MessageFromController: function(request, response){
			
			if (request == "GetRootNode")
			{
				alert("ResponseCode: " + response.ResponseCode + "\nServer Version: " + response.ServerVersion);
			}
			
		}
	
	};
	
		
	
});