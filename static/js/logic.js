// Store our API endpoint and json file inside queryUrl and variable, respectively
var queryUrl="https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
var geojson="GeoJSON/PB2002_boundaries.json";

// Perform a GET request to the query URL
d3.json(queryUrl, function(earthquakes) {
  d3.json(geojson,function(tectonicplatesData){
  // Once we get a response, send the data.features object to the createFeatures function
    createFeatures(earthquakes.features,tectonicplatesData.features)})
})


  // legend color. The a reference link:https://leafletjs.com/examples/choropleth

function getColor(d){
  return d > 5 ? '#d73027' :
         d > 4  ? '#fc8d59' :
         d > 3  ? '#fee08b' :
         d > 2  ? '#d9ef8b' :
         d > 1   ? '#91cf60' :
                 '#1a9850' 

}





  function createFeatures(earthquakeData,platesData) {

    // Define a function we want to run once for each feature in the features array
    // Give each feature a popup describing the place,time, magnitude and type of the earthquake
    function onEachFeature(feature, layer) {
      layer.bindPopup("<h2 align=center>" + feature.properties.place +
      "</h2><hr><h3>" + new Date(feature.properties.time) + "</h3>"+ `<h3>Mag:+${feature.properties.mag}</h3>`
      +`<h3>Type:+${feature.properties.type}</h3>`
      +`<h3>Rms:+${feature.properties.rms}</h3>`)
    }
  

    

    // Create a GeoJSON layer containing the features array on the earthquakeData and plateData objects
    // Run the onEachFeature function once for each piece of data in the array
    var earthquakes = L.geoJSON(earthquakeData, {
      onEachFeature: onEachFeature,

      pointToLayer: function (feature, latlng){
         var geojsonMarkerOptions={
          radius: (feature.properties.mag)*30000,
          fillColor:getColor(feature.properties.mag),
          color:"green",
          stroke: false,
          fillOpacity:1.0}

          return L.circle(latlng, geojsonMarkerOptions);
      }
    });

    var plates = L.geoJSON(platesData, {
        onEachFeature: onEachFeature,


         pointToLayer: function (feature, latlng){
    
              return L.Marker(latlng);
         }        
    })
    // Sending our earthquakes layer to the createMap function
    createMap(earthquakes,plates);
  }
  
  function createMap(earthquakes,plates) {
  
    // Define streetmap and darkmap layers
    var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "mapbox.streets",
      accessToken: API_KEY
    });
  
    var satellitesmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "mapbox.streets-satellite",
      accessToken: API_KEY
    });


    var outdoors = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.outdoors",
        accessToken: API_KEY
      });
  
    // Define a baseMaps object to hold our base layers
    var baseMaps = {
      "Street": streetmap,
      "Satellite": satellitesmap,
      "Outdoor": outdoors
    };
  
    // Create overlay object to hold our overlay layer
    var overlayMaps = {
      Earthquakes: earthquakes,
      TectonicPlates: plates
    };
  
    // Create our map, giving it the streetmap and earthquakes layers to display on load
    var myMap = L.map("map", {
      center: [
        37.09, -95.71
      ],
      zoom: 4,
      layers: [streetmap, earthquakes,plates]
    });
  
    // Create a layer control
    // Pass in our baseMaps and overlayMaps
    // Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
    }).addTo(myMap);
    
    var legend = L.control({position: 'bottomright'});

    legend.onAdd = function () {
    
        var div = L.DomUtil.create('div', 'info legend'),
            magnitudes = [0, 1, 2, 3, 4, 5];
    
        for (var i = 0; i < magnitudes.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(magnitudes[i] + 1) + '"></i> ' + 
        + magnitudes[i] + (magnitudes[i + 1] ? ' - ' + magnitudes[i + 1] + '<br>' : ' + ');
        }
    
        return div;
    };
    
    legend.addTo(myMap);
  
  }
  