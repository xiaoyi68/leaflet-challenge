//map object
 var map = L.map("map", {
    center: [40, -94],
    zoom: 5
 });

//tile layer
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
}).addTo(map);

//geoJSON data
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson", function (data) {


    //return the style data
    function styleInfo(feature) {
        return {
            opacity: 1,
            fillOpacity: 1,
            fillColor: getColor(feature.properties.mag),
            color: "white",
            radius: getRadius(feature.properties.mag),
            stroke: true,
            weight: 0.5
        };
    }

    //color of the marker based on the earthquake.
    function getColor(magnitude) {
        switch (true) {
            case magnitude > 5:
                return "purple";
            case magnitude > 3:
                return "red";
            case magnitude > 1:
                return "pink";
            default:
                return "yellow";
        }
    }

    //earthquake marker based on magnitude.
    function getRadius(magnitude) {
        if (magnitude === 0) {
            return 1;
        }
        return magnitude * 4;
    }

    L.geoJson(data, {

        //circleMarker on the map.
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng);
        },
        //styleInfo function.
        style: styleInfo,
            //marker to display the magnitude and location
        onEachFeature: function(feature, layer) {
        layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
      }

    }).addTo(map);

  //legend control
  var legend = L.control({
    position: "bottomright"
  });
   //add legend details
   legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");

    var grades = [0, 1, 2, 3];
    var colors = [
      "yellow",
      "pink",
      "red",
      "purple"
    ];

    return div;
  };
    //add legend.
    legend.addTo(map);
});
