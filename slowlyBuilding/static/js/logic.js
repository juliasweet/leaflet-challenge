// Store our API endpoint inside queryUrl (can add something else here? make it?)
var springsData = "https://raw.githubusercontent.com/juliasweet/TheThrilloftheChase/master/TreasureMap/convertcsv.geojson?token=ALYAINPOB5KHRY5NWL2M4GC5YIZWE";
// Update to separate hot and warm? 
// Add a layer with oil wells
// Add a layer with mines
// // Perform a GET request to the query URL
d3.json(springsData, function(data) {
    // Once we get a response, send the data.features object to the createFeatures function
    createFeatures(data.features);
});


function createFeatures(springsData) {
    // Define a function we want to run once for each feature in the features array
    // Give each feature a popup with name and state of spring
    function onEachFeature(feature, layer) {
        layer.bindPopup("<h3>" + feature.properties.SpringName +
            "</h3><hr><p>" + feature.properties.State);
    }



    function style(feature, layer) {
        return {
            opacity: 0.5,
            radius: 5,
            weight: .5,
            color: "black",
            fillColor: "red",
            fillOpacity: 1
        }
    }
    // Create a GeoJSON layer containing the features array on the earthquakeData object
    // Run the onEachFeature function once for each piece of data in the array

    //todo: add "flare" layer
    var hotSprings = L.geoJSON(springsData, {
        pointToLayer: function(_geometry, coordinates) {
            return L.circleMarker(coordinates);
        },
        onEachFeature: onEachFeature,
        style: style
    });

    // Sending our hotSprings layer to the createMap function
    createMap(hotSprings);
}

function createMap(hotSprings) {

    var satellite = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openelevationmap.org/\">Openelevationmap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.satellite",
        accessToken: API_KEY
    });

    var pirates = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openelevationmap.org/\">Openelevationmap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.pirates",
        accessToken: API_KEY
    });

    var terrain = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openelevationmap.org/\">Openelevationmap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.mapbox-terrain-v2",
        accessToken: API_KEY
    });

    // Define a baseMaps object to hold our base layers
    var baseMaps = {
        // "Elevation Map": elevationmap,
        "Satellite": satellite,
        "Terrain": terrain,
        "Treasure": pirates
    };

    // Create overlay object to hold our overlay layer
    var overlayMaps = {
        "Hot Springs": hotSprings
    };

    // Create our map, giving it the satellite and hotSprings layers to display on load
    var myMap = L.map("map", {
        center: [
            37.09, -95.71
        ],
        zoom: 4,
        layers: [satellite, hotSprings]
    });


    // Create a layer control
    // Pass in our baseMaps and overlayMaps
    // Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);


    legend.addTo(myMap);
}