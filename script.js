

// set up the map center and zoom level
var map = L.map('map', {
  center: [42, -92],
  zoom: 4, 
  zoomControl: false, 
  scrollWheelZoom: true
});

// optional : customize link to view source code; add your own GitHub repository
map.attributionControl
.setPrefix('View <a href="http://github.com/jackdougherty/leaflet-map">code on GitHub</a>, created with <a href="http://leafletjs.com" title="A JS library for interactive maps">Leaflet</a>');

L.Control.geocoder({position: "topleft"}).addTo(map);

L.control.scale().addTo(map);

// optional Zoom Label for map construction
L.control.zoomLabel({position: "topright"}).addTo(map);

// Reposition zoom control other than default topleft
L.control.zoom({position: "topright"}).addTo(map);

// optional: add legend to toggle any baselayers and/or overlays
// global variable with (null, null) allows indiv layers to be added inside functions below
var controlLayers = L.control.layers( null, null, {
  position: "bottomright", // suggested: bottomright for CT (in Long Island Sound); topleft for Hartford region
  collapsed: false // false = open by default
}).addTo(map);

// optional Coordinate Control for map construction
var c = new L.Control.Coordinates();
c.addTo(map);
map.on('click', function(e) {
	c.setCoordinates(e);
});

/* BASELAYERS */
// use common baselayers below, delete, or add more with plain JavaScript from http://leaflet-extras.github.io/leaflet-providers/preview/
// .addTo(map); -- suffix displays baselayer by default
// controlLayers.addBaseLayer (variableName, 'label'); -- adds baselayer and label to legend; omit if only one baselayer with no toggle desired
var lightAll = new L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
	subdomains: 'abcd',
	maxZoom: 19
}).addTo(map); // adds layer by default
controlLayers.addBaseLayer(lightAll, 'CartoDB LightAll');

// Esri satellite map from http://leaflet-extras.github.io/leaflet-providers/preview/
// OR use esri-leaflet plugin and esri basemap name https://esri.github.io/esri-leaflet/examples/switching-basemaps.html
var Esri_WorldImagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
   attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
});
controlLayers.addBaseLayer(Esri_WorldImagery, 'Esri World Imagery');

// tileLayer.WMS as a baselayer - see http://leafletjs.com/reference.html#tilelayer-wms
// UConn MAGIC WMS settings (currently http, not https) - see http://geoserver.lib.uconn.edu:8080/geoserver/web/?wicket:bookmarkablePage=:org.geoserver.web.demo.MapPreviewPage
var aerial1934 = new L.tileLayer.wms("http://geoserver.lib.uconn.edu:8080/geoserver/MAGIC/wms?", {
  layers: 'MAGIC:1934 Connecticut Aerial Photography',
  attribution: '1934 <a href="http://magic.library.uconn.edu">MAGIC UConn</a> and <a href="http://cslib.org">CSL</a>'
});
controlLayers.addBaseLayer(aerial1934, 'CT Aerial 1934');

// tileLayer.WMS as a baselayer - see http://leafletjs.com/reference.html#tilelayer-wms
// UConn MAGIC WMS settings (currently http, not https) - see http://geoserver.lib.uconn.edu:8080/geoserver/web/?wicket:bookmarkablePage=:org.geoserver.web.demo.MapPreviewPage
var hartfordCounty1855 = new L.tileLayer.wms("http://geoserver.lib.uconn.edu:8080/geoserver/MAGIC/wms?", {
  layers: 'MAGIC:HartfordCounty_Woodford_1855',
  attribution: '1855 <a href="http://magic.library.uconn.edu">MAGIC UConn</a>'
});
controlLayers.addBaseLayer(hartfordCounty1855, 'Hartford County 1855');

var map1842wms = new L.tileLayer.wms("http://maps.nypl.org/warper/maps/wms/7363?", {
  attribution: '1842 <a href="http://maps.nypl.org/warper/">NYPL Map Warper</a>'
});
controlLayers.addBaseLayer(map1842wms, '1842 NYPL WMS');

var map1842tile = new L.tileLayer("http://mapwarper.net/maps/tile/14781/{z}/{x}/{y}.png", {
  attribution: '1842 <a href="http://maps.nypl.org/warper/">NYPL Map Warper</a>'
});
controlLayers.addBaseLayer(map1842tile, '1842 NYPL Tile');

/* POINT OVERLAYS */
// ways to load point map data from different sources: coordinates in the code, GeoJSON in local directory, remote GeoJSON and JSON

// load one point from coordinates in code, icon from local directory, no interactive legend button
// places a star on state capital of Hartford, CT
// * TO DO: test whether placement of this code affects its display order, on top of other icons?
var starIcon = L.icon({
  iconUrl: 'src/star-18.png',
  iconRetinaUrl: 'src/star-18@2x.png',
  iconSize: [18, 18]
});
L.marker([41.7646, -72.6823], {icon: starIcon}).addTo(map);

// load point geojson data from local directory, using jQuery function (symbolized by $)
// modify icon source and styling
// modify pointToLayer marker bindPopup function to display GeoJSON data in info window
// option to insert '.addTo(map)' to display layer by default
// insert controlLayers.addOverlay(geoJsonLayer, 'InsertYourTitle') to add to legend


// load GeoJSON point data and clickable circles from local directory
$.getJSON("src/points.geojson", function (data){
  var geoJsonLayer = L.geoJson(data, {
    pointToLayer: function( feature, latlng) {
      var circle = L.circleMarker(latlng, {
        radius: 8,
        fillColor: "#ccccff",
        color: "#0000cc",
        weight: 2,
        opacity: 1,
        fillOpacity: 0.7
      });
      circle.bindPopup(feature.properties.Location); // replace 'Location' with properties data label from your GeoJSON file
      return circle;
    }
  }); // insert ".addTo(map)" to display layer by default
  controlLayers.addOverlay(geoJsonLayer, 'Circles');
});

// load GeoJSON point data and clickable icons from local directory, using jQuery function (symbolized by $)
$.getJSON("src/points.geojson", function (data){
  var iconStyle = L.icon({
    iconUrl: "src/hospital-18.png",
    iconRetinaUrl: 'src/hospital-18@2x.png',
    iconSize: [18, 18]
  });
  var geoJsonLayer = L.geoJson(data, {
    pointToLayer: function( feature, latlng) {
      var marker = L.marker(latlng,{icon: iconStyle});
      marker.bindPopup(feature.properties.Location); // replace 'Location' with properties data label from your GeoJSON file
      return marker;
    }
  }); // insert ".addTo(map)" to display layer by default
  controlLayers.addOverlay(geoJsonLayer, 'Hospitals');
});



/* POLYGON and POLYLINE OVERLAYS */
// Ways to load geoJSON polygon layers from local directory or remote server
// Different options for styling and interactivity

$.getJSON("src/lines.geojson", function (data){
  var geoJsonLayer = L.geoJson(data, {
    style: function (feature) {
      return {
        'color': 'green',
        'weight': 4,
      }
    },
    onEachFeature: function( feature, layer) {
      layer.bindPopup(feature.properties.name) // change to match your geojson property labels
    }
  });  // insert ".addTo(map)" to display layer by default
  controlLayers.addOverlay(geoJsonLayer, 'Lines');  // insert your 'Title' to add to legend
});

$.getJSON("src/parks.geojson", function (data){
  var geoJsonLayer = L.geoJson(data, {
    style: function (feature) {
      return {
        'color': 'purple',
        'weight': 2,
      }
    },
    onEachFeature: function( feature, layer) {
      layer.bindPopup(feature.properties.PARK_NAME) // change to match your geojson property labels
    }
  });  // insert ".addTo(map)" to display layer by default
  controlLayers.addOverlay(geoJsonLayer, 'Parks');  // insert your 'Title' to add to legend
});


// load GeoJSON polyline data
$.getJSON("src/bus-routes.geojson", function (data){
  var geoJsonLayer = L.geoJson(data, {
    style: function (feature) {
      return {
        'color': 'red',
        'weight': 2,
      }
    },
    onEachFeature: function( feature, layer) {
      layer.bindPopup(feature.properties.LineName) // change to match your geojson property labels
    }
  });  // insert ".addTo(map)" to display layer by default
  controlLayers.addOverlay(geoJsonLayer, 'Bus Routes');  // insert your 'Title' to add to legend
});

// load polygon data with clickable features from local directory
$.getJSON("src/polygons.geojson", function (data) {   // insert pathname to your local directory file
  var geoJsonLayer = L.geoJson(data, {
    style: function (feature) {
      return {
        'color': 'red',
        'weight': 2,
        'fillColor': '#fff',
        'fillOpacity': 0
      }
    },
    onEachFeature: function( feature, layer) {
      layer.bindPopup(feature.properties.Town) // change 'Town' to match your geojson property labels
    }
  });  // insert ".addTo(map)" to display layer by default
  controlLayers.addOverlay(geoJsonLayer, 'Polygons (CT towns)');  // insert your 'Title' to add to legend
});

// load polygon geojson, using data to define fillColor, from local directory
// *TO DO* rebuild file for pop density
// *TO DO* change from click to hover, and add legend to display colors and hover data
$.getJSON("src/polygons.geojson", function (data) {   // insert pathname to your local directory file
  var geoJsonLayer = L.geoJson(data, {
    style: function (feature) {
      var fillColor,
        population = feature.properties.Pop2010;
      if (population > 100000) fillColor = "#006837";
      else if (population > 50000) fillColor ="#31a354";
      else if (population > 15000) fillColor ="#78c679";
      else if (population > 5000) fillColor ="#c2e699";
      else if (population > 0) fillColor ="#ffffcc";
      else fillColor = "#f7f7f7"; // no data
      return {
        'color': 'red',
        'weight': 2,
        'fillColor': fillColor, // sorts by method above
        'fillOpacity': 0.8
      }
    },
    onEachFeature: function( feature, layer) {
      var popupText = "<b>" + feature.properties.Town + "</b>"   // replace labels with those from your own geojson
         + "<br>Population 2010: " + "<br>" + feature.properties.Pop2010;
      layer.bindPopup(popupText);
    }
  });  // insert ".addTo(map)" to display layer by default
  controlLayers.addOverlay(geoJsonLayer, 'Polygons filled (CT Pop 2010)');  // insert your 'Title' to add to legend
});
