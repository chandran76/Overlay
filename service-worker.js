'use strict';

var dataCacheName = 'Overlay-data';
var cacheName = 'Overlay-cachedata';
var filesToCache = [
	'/Overlay/',
	'/Overlay/index.html',
	'/Overlay/login.html',
	'/Overlay/main.html',
	'/Overlay/bosonic/dist/bosonic-runtime.js',
	'/Overlay/bosonic/dist/bosonic-runtime.min.js',
	'/Overlay/bosonic/lib/CustomEvent.js',
	'/Overlay/bosonic/lib/DOMTokenList.js',
	'/Overlay/bosonic/lib/importNode.js',
	'/Overlay/bosonic/lib/pep-0.4.1-pre.js',
	'/Overlay/bosonic/src/mixins/a11y.js',
	'/Overlay/bosonic/src/mixins/custom_attributes.js',
	'/Overlay/bosonic/src/mixins/dom.js',
	'/Overlay/bosonic/src/mixins/events.js',
	'/Overlay/bosonic/src/mixins/gestures.js',
	'/Overlay/bosonic/src/mixins/selection.js',
	'/Overlay/bosonic/src/platform/bootstrap.js',
	'/Overlay/bosonic/src/platform/ShadowDOM.js',
	'/Overlay/bosonic/src/runtime/base.js',
	'/Overlay/bosonic/src/runtime/bootstrap.js',
   	'/Overlay/bosonic/src/runtime/register.js',
	'/Overlay/css/app.css',
	'/Overlay/css/b-tree.css',
	'/Overlay/css/graph-creator.css',
	'/Overlay/css/jquery-ui.css',
	'/Overlay/css/OLDucomponents.css',
	'/Overlay/css/style.css',
	'/Overlay/css/ucomponents.css',
	'/Overlay/css/themes/bootstrap.css',
	'/Overlay/css/themes/pace_center_radar.css',
	'/Overlay/css/themes/pace_loading_bar.css',
	'/Overlay/css/themes/site.css',
	'/Overlay/dependencies/animate.css/animate.css',
	'/Overlay/dependencies/bootstrap/dist/css/bootstrap.css',
	'/Overlay/dependencies/bootstrap/dist/js/bootstrap.js',
	'/Overlay/dependencies/fontawesome/css/font-awesome.css',
	'/Overlay/dependencies/iCheck/icheck.js',
	'/Overlay/dependencies/jquery/dist/jquery.js',
	'/Overlay/dependencies/jquery-ui/jquery-ui.js',
	'/Overlay/dependencies/metisMenu/dist/metisMenu.css',
	'/Overlay/dependencies/metisMenu/dist/metisMenu.js',
	'/Overlay/dependencies/slimScroll/jquery.slimscroll.js',
	'/Overlay/fonts/pe-icon-7-stroke/css/helper.css',
	'/Overlay/fonts/pe-icon-7-stroke/css/pe-icon-7-stroke.css',
	'/Overlay/Icon/128.png',
	'/Overlay/Icon/144.png',
	'/Overlay/Icon/256.png',
	'/Overlay/Icon/48.png',
	'/Overlay/Icon/512.png',
	'/Overlay/Icon/64.png',
	'/Overlay/Icon/96.png',
	'/Overlay/images/powered-ulysses.png',
	'/Overlay/images/icons/bowtie-icon.png',
	'/Overlay/images/icons/clusterview-icon.png',
	'/Overlay/images/icons/clusterview2-icon.png',
	'/Overlay/images/icons/download-icon.png',
	'/Overlay/images/icons/edit-icon.png',
	'/Overlay/images/icons/highlight-icon.png',
	'/Overlay/images/icons/modelview-icon.png',
	'/Overlay/images/icons/modelview2-icon.png',
	'/Overlay/images/icons/newmodel-icon.png',
	'/Overlay/images/icons/nodeview-icon.png',
	'/Overlay/images/icons/search-icon.png',
	'/Overlay/images/icons/trash-icon.png',
	'/Overlay/images/icons/upload-icon.png',
	'/Overlay/mapview_js/d3.legend.js',
	'/Overlay/mapview_js/d3.v3.js',
	'/Overlay/mapview_js/FileSaver.min.js',
	'/Overlay/mapview_js/graphcreator.js',
	'/Overlay/mapview_js/jquery-3.1.0.js',
	'/Overlay/mapview_js/lasso.js',
	'/Overlay/mapview_js/lasso.min.js',
	'/Overlay/mapview_js/mapviewclass.js',
	'/Overlay/mapview_js/queue.v1.js',
	'/Overlay/ribbon/css/docs.css',
	'/Overlay/ribbon/css/metro-colors.css',
	'/Overlay/ribbon/css/metro-icons.css',
	'/Overlay/ribbon/css/metro-responsive.css',
	'/Overlay/ribbon/css/metro-rtl.css',
	'/Overlay/ribbon/css/metro-schemes.css',
	'/Overlay/ribbon/css/metro.css',
	'/Overlay/ribbon/images/Calendar-Next.png',
	'/Overlay/ribbon/images/Folder-Rename.png',
	'/Overlay/ribbon/images/Notebook-Save.png',
	'/Overlay/ribbon/js/docs.js',
	'/Overlay/ribbon/js/ga.js',
	'/Overlay/ribbon/js/jquery-2.1.3.min.js',
	'/Overlay/ribbon/js/metro - Copy.js',
	'/Overlay/ribbon/js/metro.js',
	'/Overlay/scripts/BroadcastEventArg.js',
	'/Overlay/scripts/BroadcastEventData.js',
	'/Overlay/scripts/EUMainDashboardCISController.js',
	'/Overlay/scripts/EUMainDashBoardToolbarRegion.js',
	'/Overlay/scripts/EUNodeActionCISController.js',
	'/Overlay/scripts/EUNodeActionRegion.js',
	'/Overlay/scripts/EUNodeAlertsRegion.js',
	'/Overlay/scripts/EUNodeInformationRegion.js',
	'/Overlay/scripts/EUNodesMapViewRegion.js',
	'/Overlay/scripts/EUNodesTreeViewRegion.js',
	'/Overlay/scripts/EUNodeTimelineRegion.js',
	'/Overlay/scripts/GetNodePredictivePatternInformationArg.js',
	'/Overlay/scripts/GetSessionStateInformationArg.js',
	'/Overlay/scripts/HomeCISController.js',
	'/Overlay/scripts/HomeCISRegionSingle.js',
	'/Overlay/scripts/jquery-3.1.0.js',
	'/Overlay/scripts/launcher.js',
	'/Overlay/scripts/layout.js',
	'/Overlay/scripts/app.js',
	'/Overlay/scripts/main.js',
	'/Overlay/scripts/mapvieweventhandler.js',
	'/Overlay/scripts/OLDEUNodeAlertsRegion.js',
	'/Overlay/scripts/OLDEUNodeInformationRegion.js',
	'/Overlay/scripts/OLDEUNodeTimelineRegion.js',
	'/Overlay/scripts/OLDlayout.js',
	'/Overlay/scripts/PredictivePatternInfoAvailableArg.js',
	'/Overlay/scripts/require.js',
	'/Overlay/scripts/SessionStateInfoAvailableArg.js',
	'/Overlay/scripts/startlauncher.js',
	'/Overlay/scripts/lib/b-accordion.html',
	'/Overlay/scripts/lib/b-collapsible.html',
	'/Overlay/scripts/lib/b-dialog.html',
	'/Overlay/scripts/lib/b-selectable.html',
	'/Overlay/scripts/lib/b-tabs.html',
	'/Overlay/scripts/lib/b-tree.html',
	'/Overlay/scripts/lib/hello-world.html',
	'/Overlay/scripts/lib/u-components.html',
	'/Overlay/scripts/lib/u-mapview.html',
	'/Overlay/scripts/lib/u-ribbon.html',
	'/Overlay/scripts/lib/webcomponents.js',
	'/Overlay/scripts/utility/pace.js',
	'/Overlay/webcis/CIS.csv',
	'/Overlay/webcis/BinaryMappings.csv',
	'/Overlay/webcis/EUMainDashboardCISController.xml'
];

self.addEventListener('install', function(e) {
  console.log('[ServiceWorker] Install');
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      console.log('[ServiceWorker] Caching app shell');
      return cache.addAll(filesToCache);
    })
  );
});

self.addEventListener('activate', function(e) {
  console.log('[ServiceWorker] Activate');
  e.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        if (key !== cacheName && key !== dataCacheName) {
          console.log('[ServiceWorker] Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );

  return self.clients.claim();
});

self.addEventListener('fetch', function(e) {
  console.log('[Service Worker] Fetch', e.request.url);
  var dataUrl = 'http://10.20.0.65:8081';
  if (e.request.url.indexOf(dataUrl) > -1) {

    e.respondWith(
      caches.open(dataCacheName).then(function(cache) {
        return fetch(e.request).then(function(response){
          cache.put(e.request.url, response.clone());
          return response;
        });
      })
    );
  } else {
	e.respondWith(
      caches.match(e.request).then(function(response) {
        return response || fetch(e.request);
      })
    );
  }
});
