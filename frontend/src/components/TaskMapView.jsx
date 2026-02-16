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
            if (!pLat || !pLng || !dLat || !dLng) return;

            try {
                // OSRM Public API (Demo server - usage limits apply)
                const url = `https://router.project-osrm.org/route/v1/driving/${pLng},${pLat};${dLng},${dLat}?overview=full&geometries=geojson`;
                const res = await fetch(url);
                const data = await res.json();

                if (data.routes && data.routes.length > 0) {
                    const coords = data.routes[0].geometry.coordinates;
                    // GeoJSON is [lng, lat], Leaflet needs [lat, lng]
                    const latLngs = coords.map(c => [c[1], c[0]]);
                    setRoutePath(latLngs);
                }
            } catch (err) {
                console.error("Routing error:", err);
                // Fallback to straight line if routing fails
                setRoutePath([[pLat, pLng], [dLat, dLng]]);
            }
        };

        fetchRoute();
    }, [pLat, pLng, dLat, dLng]);

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
                <Marker position={[pLat, pLng]}>
                    <Popup className="font-semibold">{pickupTitle}</Popup>
                </Marker>
                <Marker position={[dLat, dLng]}>
                    <Popup className="font-semibold">{dropTitle}</Popup>
                </Marker>

                {/* Route Line */}
                {routePath.length > 0 && <Polyline positions={routePath} color="blue" weight={4} opacity={0.7} />}
            </MapContainer>
        </div>
    );
};

export default TaskMapView;
