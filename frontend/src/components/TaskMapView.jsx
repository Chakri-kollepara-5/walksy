import React from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix Leaflet icon issue
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const TaskMapView = ({ pickup, drop, pickupTitle = "Pickup", dropTitle = "Drop" }) => {
    const [routePath, setRoutePath] = React.useState([]);

    // Default to a central point if coords missing (Bangalore)
    const center = [12.9716, 77.5946];

    // Parse coords
    // Safe coordinate extractor
    const getCoord = (loc, type) => {
        if (!loc) return null;

        // Handle { lat, lng } object
        if (typeof loc === 'object' && !Array.isArray(loc)) {
            if (type === 'lat' && 'lat' in loc) return parseFloat(loc.lat);
            if (type === 'lng' && 'lng' in loc) return parseFloat(loc.lng);
        }

        // Handle [lat, lng] array
        if (Array.isArray(loc) && loc.length >= 2) {
            if (type === 'lat') return parseFloat(loc[0]);
            if (type === 'lng') return parseFloat(loc[1]);
        }

        return null;
    };

    const pLat = getCoord(pickup, 'lat') || center[0];
    const pLng = getCoord(pickup, 'lng') || center[1];
    const dLat = getCoord(drop, 'lat') || center[0] + 0.01; // Default offset if missing
    const dLng = getCoord(drop, 'lng') || center[1] + 0.01;

    React.useEffect(() => {
        const fetchRoute = async () => {
            // Validate coordinates
            if (!pLat || !pLng || !dLat || !dLng) {
                console.warn("Invalid coordinates for routing:", { pLat, pLng, dLat, dLng });
                return;
            }

            // Check if coordinates are valid numbers
            if (isNaN(pLat) || isNaN(pLng) || isNaN(dLat) || isNaN(dLng)) {
                console.error("Coordinates are not valid numbers:", { pLat, pLng, dLat, dLng });
                setRoutePath([[pLat || center[0], pLng || center[1]], [dLat || center[0], dLng || center[1]]]);
                return;
            }

            // Check if pickup and drop are the same (or very close)
            const distance = Math.sqrt(Math.pow(dLat - pLat, 2) + Math.pow(dLng - pLng, 2));
            if (distance < 0.0001) {
                console.warn("Pickup and drop locations are too close or identical");
                setRoutePath([[pLat, pLng], [dLat, dLng]]);
                return;
            }

            try {
                // OSRM Public API (Demo server - usage limits apply)
                // Format: /route/v1/{profile}/{coordinates}
                // Coordinates format: {longitude},{latitude};{longitude},{latitude}
                const url = `https://router.project-osrm.org/route/v1/driving/${pLng},${pLat};${dLng},${dLat}?overview=full&geometries=geojson`;
                console.log("Fetching route from:", url);

                const res = await fetch(url);
                const data = await res.json();

                if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
                    const coords = data.routes[0].geometry.coordinates;
                    // GeoJSON is [lng, lat], Leaflet needs [lat, lng]
                    const latLngs = coords.map(c => [c[1], c[0]]);
                    setRoutePath(latLngs);
                    console.log("Route fetched successfully:", latLngs.length, "points");
                } else {
                    console.warn("OSRM routing failed:", data.message || "Unknown error");
                    // Fallback to straight line if routing fails
                    setRoutePath([[pLat, pLng], [dLat, dLng]]);
                }
            } catch (err) {
                console.error("Routing error:", err);
                // Fallback to straight line if routing fails
                setRoutePath([[pLat, pLng], [dLat, dLng]]);
            }
        };

        fetchRoute();
    }, [pLat, pLng, dLat, dLng]);

    // Create custom colored markers
    const pickupIcon = L.icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
        shadowUrl: iconShadow,
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34]
    });

    const dropIcon = L.icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
        shadowUrl: iconShadow,
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34]
    });

    return (
        <div className="h-[300px] w-full rounded-xl overflow-hidden shadow-inner border border-border">
            <MapContainer
                center={[(pLat + dLat) / 2, (pLng + dLng) / 2]}
                zoom={13}
                scrollWheelZoom={false}
                className="h-full w-full"
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[pLat, pLng]} icon={pickupIcon}>
                    <Popup className="font-semibold">
                        <div className="text-green-600 font-bold">📍 {pickupTitle}</div>
                        <div className="text-xs text-gray-600">{pLat.toFixed(4)}, {pLng.toFixed(4)}</div>
                    </Popup>
                </Marker>
                <Marker position={[dLat, dLng]} icon={dropIcon}>
                    <Popup className="font-semibold">
                        <div className="text-red-600 font-bold">🎯 {dropTitle}</div>
                        <div className="text-xs text-gray-600">{dLat.toFixed(4)}, {dLng.toFixed(4)}</div>
                    </Popup>
                </Marker>

                {/* Route Line */}
                {routePath.length > 0 && <Polyline positions={routePath} color="#3b82f6" weight={4} opacity={0.7} />}
            </MapContainer>
        </div>
    );
};

export default TaskMapView;
