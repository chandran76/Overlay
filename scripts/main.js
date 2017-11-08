requirejs(["utility/pace"], function(pace) {
    //This function is called when scripts/helper/util.js is loaded.
    //If util.js calls define(), then this function is not fired until
    //util's dependencies have loaded, and the util argument will hold
    //the module value for "utility/pace".

	
		$(document).ready(function(){
			$.ajax({
					url: "/Overlay/json/handshake.json", //"http://10.20.0.65:8081/overlay.svc/Handshake",
					type: 'GET',
					contentType: "application/json; charset=utf-8",
					dataType: "json",
					async: false,
					success: function (data) {
						console.log(data.ClientSessionToken);
					    var token = encodeURIComponent(data.ClientSessionToken);
					    window.location = "login.html?token=" + token;
					},
					error: function (data) {
						console.log("Overlay Server not available!");
						
					}
				});				
		});	
		
});
