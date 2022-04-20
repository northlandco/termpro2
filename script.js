

// set up the map center and zoom level
var map = L.map('map', {
  center: [42, -92],
  zoom: 4, 
  zoomControl: false, 
  scrollWheelZoom: true
});

// link to view source code
map.attributionControl
.setPrefix('View <a href="http://github.com/jackdougherty/leaflet-map">code on GitHub</a>, created with <a href="http://leafletjs.com" title="A JS library for interactive maps">Leaflet</a>');

L.Control.geocoder({position: "topleft"}).addTo(map);

L.control.scale().addTo(map);

// Zoom Label
L.control.zoomLabel({position: "topright"}).addTo(map);

// Reposition zoom control
L.control.zoom({position: "topright"}).addTo(map);

//add legend to toggle any baselayers and/or overlays
// global variable with (null, null) allows indiv layers to be added inside functions below
var controlLayers = L.control.layers( null, null, {
  position: "bottomright", // suggested: bottomright for CT (in Long Island Sound); topleft for Hartford region
  collapsed: false // false = open by default
}).addTo(map);

//Coordinate Control for map construction
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



/* POINT OVERLAYS */
// ways to load point map data from different sources: coordinates in the code, GeoJSON in local directory, remote GeoJSON and JSON
// load point geojson data from local directory, using jQuery function (symbolized by $)
// modify icon source and styling
// modify pointToLayer marker bindPopup function to display GeoJSON data in info window
// option to insert '.addTo(map)' to display layer by default
// insert controlLayers.addOverlay(geoJsonLayer, 'InsertYourTitle') to add to legend

// All Airports
$.getJSON("src/Airports464.geojson", function (data){
  var iconStyle = L.icon({
    iconUrl: "src/airportlogo.png",
    iconRetinaUrl: 'src/hospital-18@2x.png',
    iconSize: [18, 18]
  });
  var geoJsonLayer = L.geoJson(data, {
    pointToLayer: function( feature, latlng) {
      var marker = L.marker(latlng,{icon: iconStyle});
      marker.bindPopup(feature.properties.coordinates); // replace 'Location' with properties data label from your GeoJSON file
      return marker;
    }
  }); // insert ".addTo(map)" to display layer by default
  controlLayers.addOverlay(geoJsonLayer, 'Airports');
});

// International Airports (Python Computed)
$.getJSON("src/internationalairports.geojson", function (data){
  var iconStyle = L.icon({
    iconUrl: "src/internationalairportlogo.png",
    iconRetinaUrl: 'src/internationalairportlogo.png',
    iconSize: [18, 18]
  });
  var geoJsonLayer = L.geoJson(data, {
    pointToLayer: function( feature, latlng) {
      var marker = L.marker(latlng,{icon: iconStyle});
      marker.bindPopup(feature.properties.coordinates); // replace 'Location' with properties data label from your GeoJSON file
      return marker;
    }
  }); // insert ".addTo(map)" to display layer by default
  controlLayers.addOverlay(geoJsonLayer, 'Intl. Airports');
});

// General Hospitals (Python Computed)
$.getJSON("src/generalhospitals.geojson", function (data){
  var iconStyle = L.icon({
    iconUrl: "src/hospital-18.png",
    iconRetinaUrl: 'src/hospital-18@2x.png',
    iconSize: [18, 18]
  });
  var geoJsonLayer = L.geoJson(data, {
    pointToLayer: function( feature, latlng) {
      var marker = L.marker(latlng,{icon: iconStyle});
      marker.bindPopup(feature.properties.facility_name); // replace 'Location' with properties data label from your GeoJSON file
      return marker;
    }
  }); // insert ".addTo(map)" to display layer by default
  controlLayers.addOverlay(geoJsonLayer, 'General Hospitals');
});

// Private Schools (Python Computed)
$.getJSON("src/privateschools.geojson", function (data){
  var iconStyle = L.icon({
    iconUrl: "src/publicschoollogo.png",
    iconRetinaUrl: 'src/publicschoollogo.png',
    iconSize: [12, 12]
  });
  var geoJsonLayer = L.geoJson(data, {
    pointToLayer: function( feature, latlng) {
      var marker = L.marker(latlng,{icon: iconStyle});
      marker.bindPopup(feature.properties.Facility_Name); 
      return marker;
    }
  }); // insert ".addTo(map)" to display layer by default
  controlLayers.addOverlay(geoJsonLayer, 'Private Schools');
});

// NHL Arenas (Python Computed --> Shp to Geojson)
$.getJSON("src/NHLarenas.geojson", function (data){
  var iconStyle = L.icon({
    iconUrl: "src/nhlarenalogo.png",
    iconRetinaUrl: 'src/nhlarenalogo.png',
    iconSize: [15, 15]
  });
  var geoJsonLayer = L.geoJson(data, {
    pointToLayer: function( feature, latlng) {
      var marker = L.marker(latlng,{icon: iconStyle});
      marker.bindPopup(feature.properties.coordinates); 
      return marker;
    }
  }); // insert ".addTo(map)" to display layer by default
  controlLayers.addOverlay(geoJsonLayer, 'NHL Arenas');
});

// First Nations (OpenCanada) (Python Computed --> Shp to Geojson)
$.getJSON("src/firstnations.geojson", function (data){
  var iconStyle = L.icon({
    iconUrl: "src/firstnationlogo.png",
    iconRetinaUrl: 'src/firstnationlogo.png',
    iconSize: [12, 12]
  });
  var geoJsonLayer = L.geoJson(data, {
    pointToLayer: function( feature, latlng) {
      var marker = L.marker(latlng,{icon: iconStyle});
      marker.bindPopup(feature.properties.coordinates); 
      return marker;
    }
  }); // insert ".addTo(map)" to display layer by default
  controlLayers.addOverlay(geoJsonLayer, 'First Nations');
});

// NFL Stadiums (Python Computed --> CSV to GeoJson)
$.getJSON("src/nflstadiums.geojson", function (data){
  var iconStyle = L.icon({
    iconUrl: "src/nflstadiumlogo.png",
    iconRetinaUrl: 'src/nflstadiumlogo.png',
    iconSize: [12, 12]
  });
  var geoJsonLayer = L.geoJson(data, {
    pointToLayer: function( feature, latlng) {
      var marker = L.marker(latlng,{icon: iconStyle});
      marker.bindPopup(feature.properties.Team); 
      return marker;
    }
  }); // insert ".addTo(map)" to display layer by default
  controlLayers.addOverlay(geoJsonLayer, 'NFL Stadiums');
});

// Mining68 (Python Computed --> Shp to Geojson)
$.getJSON("src/mining68.geojson", function (data){
  var iconStyle = L.icon({
    iconUrl: "src/nhlarenalogo.png",
    iconRetinaUrl: 'src/mininglogo.png',
    iconSize: [15, 15]
  });
  var geoJsonLayer = L.geoJson(data, {
    pointToLayer: function( feature, latlng) {
      var marker = L.marker(latlng,{icon: iconStyle});
      marker.bindPopup(feature.properties.coordinates); 
      return marker;
    }
  }); // insert ".addTo(map)" to display layer by default
  controlLayers.addOverlay(geoJsonLayer, 'Mining Sites');
});







/* POLYGON and POLYLINE OVERLAYS */
// Ways to load geoJSON polygon layers from local directory or remote server
// Different options for styling and interactivity

//National Parks
$.getJSON("src/newnationalparks.geojson", function (data){
  var geoJsonLayer = L.geoJson(data, {
    style: function (feature) {
      return {
        'color': 'purple',
        'weight': 2,
      }
    },
    onEachFeature: function( feature, layer) {
      layer.bindPopup(feature.properties.NAME_E) // change to match your geojson property labels
    }
  });  
  controlLayers.addOverlay(geoJsonLayer, 'National Parks');
});

//CMA Boundaries
$.getJSON("src/CMABoundary.geojson", function (data) {   // insert pathname to your local directory file
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
      layer.bindPopup(feature.properties.CMA_NAME) // change 'Town' to match your geojson property labels
    }
  });  // insert ".addTo(map)" to display layer by default
  controlLayers.addOverlay(geoJsonLayer, 'CMA Boundary'); 
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
