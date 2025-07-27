/**
 * Simple Google Maps JavaScript API Example
 * API Key: AIzaSyDuSaYOV26dBzQpvWg-F6YF7ySmesPahwM
 * 
 * Usage:
 * 1. Include this script in your HTML
 * 2. Add a div with id="map" to your HTML
 * 3. Load the Google Maps API with your key
 */

// Global variables
let map;
let markers = [];
let infoWindow;

/**
 * Initialize the Google Map
 * This function is called when the Google Maps API is loaded
 */
function initMap() {
    // Map configuration
    const mapOptions = {
        center: { lat: 40.7128, lng: -74.0060 }, // New York City
        zoom: 13,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        
        // Custom styling (optional)
        styles: [
            {
                "featureType": "water",
                "elementType": "geometry",
                "stylers": [{"color": "#193341"}]
            },
            {
                "featureType": "landscape",
                "elementType": "geometry",
                "stylers": [{"color": "#2c5234"}]
            }
        ],
        
        // Map controls
        zoomControl: true,
        mapTypeControl: true,
        scaleControl: true,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: true
    };

    // Create the map
    map = new google.maps.Map(document.getElementById('map'), mapOptions);

    // Create info window for markers
    infoWindow = new google.maps.InfoWindow();

    // Add some example markers
    addExampleMarkers();

    console.log('Google Maps initialized successfully!');
}

/**
 * Add example markers to the map
 */
function addExampleMarkers() {
    const locations = [
        {
            lat: 40.7580,
            lng: -73.9855,
            title: 'Times Square',
            description: 'The heart of NYC',
            type: 'attraction'
        },
        {
            lat: 40.7061,
            lng: -73.9969,
            title: 'Brooklyn Bridge',
            description: 'Historic bridge connecting Manhattan and Brooklyn',
            type: 'landmark'
        },
        {
            lat: 40.7829,
            lng: -73.9654,
            title: 'Central Park',
            description: 'Large public park in Manhattan',
            type: 'park'
        }
    ];

    locations.forEach(location => {
        addMarker(location);
    });
}

/**
 * Add a marker to the map
 * @param {Object} location - Location object with lat, lng, title, description, type
 */
function addMarker(location) {
    // Create marker
    const marker = new google.maps.Marker({
        position: { lat: location.lat, lng: location.lng },
        map: map,
        title: location.title,
        animation: google.maps.Animation.DROP,
        
        // Custom icon (optional)
        icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: getMarkerColor(location.type),
            fillOpacity: 0.8,
            strokeColor: '#ffffff',
            strokeWeight: 2
        }
    });

    // Create info window content
    const infoContent = `
        <div style="padding: 10px; max-width: 200px;">
            <h3 style="margin: 0 0 10px 0; color: #333;">${location.title}</h3>
            <p style="margin: 0; color: #666;">${location.description}</p>
            <p style="margin: 10px 0 0 0; font-size: 12px; color: #999;">
                ${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}
            </p>
        </div>
    `;

    // Add click listener to marker
    marker.addListener('click', () => {
        infoWindow.setContent(infoContent);
        infoWindow.open(map, marker);
    });

    // Store marker reference
    markers.push(marker);

    return marker;
}

/**
 * Get marker color based on type
 * @param {string} type - Marker type
 * @returns {string} Color hex code
 */
function getMarkerColor(type) {
    const colors = {
        'attraction': '#ff4444',
        'landmark': '#ffaa00',
        'park': '#44ff44',
        'business': '#4444ff',
        'default': '#888888'
    };
    return colors[type] || colors.default;
}

/**
 * Clear all markers from the map
 */
function clearMarkers() {
    markers.forEach(marker => {
        marker.setMap(null);
    });
    markers = [];
    infoWindow.close();
}

/**
 * Add a marker at a random location near NYC
 */
function addRandomMarker() {
    const randomLat = 40.7128 + (Math.random() - 0.5) * 0.1;
    const randomLng = -74.0060 + (Math.random() - 0.5) * 0.1;
    
    const randomLocation = {
        lat: randomLat,
        lng: randomLng,
        title: `Random Location ${markers.length + 1}`,
        description: 'A randomly placed marker',
        type: 'default'
    };
    
    addMarker(randomLocation);
}

/**
 * Center the map on a specific location
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @param {number} zoom - Zoom level (optional)
 */
function centerMap(lat, lng, zoom = 13) {
    map.setCenter({ lat: lat, lng: lng });
    if (zoom) {
        map.setZoom(zoom);
    }
}

/**
 * Fit the map to show all markers
 */
function fitToMarkers() {
    if (markers.length === 0) return;
    
    const bounds = new google.maps.LatLngBounds();
    markers.forEach(marker => {
        bounds.extend(marker.getPosition());
    });
    map.fitBounds(bounds);
}

/**
 * Change map type
 * @param {string} type - Map type ('roadmap', 'satellite', 'hybrid', 'terrain')
 */
function changeMapType(type) {
    map.setMapTypeId(type);
}

/**
 * Load Google Maps API dynamically
 * Call this function to load the API if not already loaded
 */
function loadGoogleMapsAPI() {
    const script = document.createElement('script');
    script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyDuSaYOV26dBzQpvWg-F6YF7ySmesPahwM&callback=initMap&libraries=places,geometry';
    script.async = true;
    script.defer = true;
    
    script.onerror = () => {
        console.error('Failed to load Google Maps API');
    };
    
    document.head.appendChild(script);
}

/**
 * Handle API authentication failures
 */
window.gm_authFailure = function() {
    console.error('Google Maps API authentication failed');
    alert('Google Maps API authentication failed. Please check your API key.');
};

// Example usage:
// 1. Include this script in your HTML
// 2. Add a div with id="map" to your HTML:
//    <div id="map" style="height: 400px; width: 100%;"></div>
// 3. Load the API:
//    loadGoogleMapsAPI();
// 
// Or include the API script directly in HTML:
// <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDuSaYOV26dBzQpvWg-F6YF7ySmesPahwM&callback=initMap&libraries=places,geometry"></script>
