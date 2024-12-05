// Initialize the map
var map = L.map('map').setView([0, 0], 2);

// Add a tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Fetch earthquake data
d3.json('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson').then(data => {
    // Function to determine marker size based on magnitude
    function markerSize(magnitude) {
        return magnitude ? magnitude * 4 : 1;
    }

    // Function to determine marker color based on depth
    function markerColor(depth) {
        return depth > 90 ? '#d73027' :
               depth > 70 ? '#fc8d59' :
               depth > 50 ? '#fee08b' :
               depth > 30 ? '#d9ef8b' :
               depth > 10 ? '#91cf60' :
                            '#1a9850';
    }

    // Add GeoJSON layer to the map
    L.geoJSON(data, {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, {
                radius: markerSize(feature.properties.mag),
                fillColor: markerColor(feature.geometry.coordinates[2]),
                color: '#000',
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            });
        },
        onEachFeature: function (feature, layer) {
            layer.bindPopup(`
                <strong>Location:</strong> ${feature.properties.place}<br>
                <strong>Magnitude:</strong> ${feature.properties.mag}<br>
                <strong>Depth:</strong> ${feature.geometry.coordinates[2]} km<br>
                <strong>Time:</strong> ${new Date(feature.properties.time)}
            `);
        }
    }).addTo(map);
});

// Add legend to the map
var legend = L.control({ position: 'bottomright' });

legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend');
    var depths = [-10, 10, 30, 50, 70, 90];
    var labels = [];

    div.innerHTML += '<strong>Depth (km)</strong><br>';

    for (var i = 0; i < depths.length; i++) {
        div.innerHTML +=
            '<i style="background:' + markerColor(depths[i] + 1) + '"></i> ' +
            depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + '<br>' : '+');
    }

    return div;
};

legend.addTo(map);
