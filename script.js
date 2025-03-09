// Initialize the map
var map = L.map('map').setView([10.870909069588581, 76.92879177236355], 17); // Default center

// Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);


var locations = {
    "commerce": [10.870251, 76.928998],
    "aiml": [10.870100407271744, 76.92868984842394],
    "viscom": [10.87018996607278, 76.92879445457345],
    "basketball court": [10.871119795565662, 76.92789591457124],
    "ncpir": [10.87007143234795, 76.92776716853403],
    "criminology": [10.870100407271744, 76.92868984842394],
    "bba": [10.870708879772847, 76.9292101969616],
    "canteen": [10.869961, 76.928062]
};

// Get user location
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
        var userLat = position.coords.latitude;
        var userLng = position.coords.longitude;

        // Add user marker
        var userMarker = L.marker([userLat, userLng]).addTo(map)
            .bindPopup("You are here")
            .openPopup();
    }, function(error) {
        console.log("Geolocation error:", error);
    });
} else {
    alert("Geolocation is not supported by your browser.");
}

// Search function
document.getElementById("searchbutton").addEventListener("click", function() {
    var searchQuery = document.getElementById("searchbox").value.toLowerCase();
    
    if (locations[searchQuery]) {
        var destination = locations[searchQuery];

        // Move map to searched location
        map.setView(destination, 18);

        // Add marker for the searched department
        L.marker(destination).addTo(map)
            .bindPopup(searchQuery.charAt(0).toUpperCase() + searchQuery.slice(1))
            .openPopup();

        // If user location is available, show route
        navigator.geolocation.getCurrentPosition(function(position) {
            var userLat = position.coords.latitude;
            var userLng = position.coords.longitude;

            // Remove existing route if any
            if (window.routeControl) {
                map.removeControl(window.routeControl);
            }

            // Add routing from user to department
            window.routeControl = L.Routing.control({
                waypoints: [
                    L.latLng(userLat, userLng),
                    L.latLng(destination[0], destination[1])
                ],
                routeWhileDragging: true
            }).addTo(map);
        });
    } else {
        alert("Department not found. Please enter a valid department name.");
    }
});
