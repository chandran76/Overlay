$(document).ready(function(){
	
	if ('serviceWorker' in navigator) {
		navigator.serviceWorker
             .register('./service-worker.js')
             .then(function() { console.log('Service Worker Registered'); });
	  /* Access all files under app 
	  .then(function(registration) {
		console.log('Registration successful, scope is:', registration.scope);
	  })
	  .catch(function(error) {
		console.log('Service worker registration failed, error:', error);
	  });
	  */
	}
});
