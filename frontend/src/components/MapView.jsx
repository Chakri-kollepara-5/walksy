import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

// Fix for default marker icons in React Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const MapView = ({ tasks, onAccept, userLocation }) => {
    // Default to Bangalore if no user location
    const center = userLocation || [12.9716, 77.5946];

    return (
        <div className="h-[calc(100vh-200px)] w-full rounded-xl overflow-hidden shadow-lg border relative z-0">
            <MapContainer center={center} zoom={13} style={{ height: "100%", width: "100%" }}>
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                />

                {/* User Location Marker */}
                {userLocation && (
                    <Marker position={userLocation} icon={new L.Icon({
                        iconUrl: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
                        iconSize: [40, 40],
                        iconAnchor: [20, 20],
                        className: "rounded-full border-2 border-white shadow-lg"
                    })}>
                        <Popup>
                            <div className="text-center font-bold">You are here</div>
                        </Popup>
                    </Marker>
                )}

                {/* Task Markers */}
                {tasks.map(task => (
                    <Marker
                        key={task.id}
                        position={[task.location.lat, task.location.lng]}
                    >
                        <Popup>
                            <div className="p-2 min-w-[200px]">
                                <h3 className="font-bold text-lg mb-1">{task.title}</h3>
                                <p className="text-sm text-muted-foreground mb-2">{task.description}</p>
                                <div className="flex justify-between items-center mb-3">
                                    <span className="font-bold text-primary">₹{task.reward}</span>
                                    <span className="text-xs bg-secondary px-2 py-1 rounded">{task.distance} km</span>
                                </div>
                                <Button
                                    size="sm"
                                    className="w-full"
                                    onClick={() => onAccept(task.id)}
                                >
                                    Accept Task
                                </Button>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
};

export default MapView;
