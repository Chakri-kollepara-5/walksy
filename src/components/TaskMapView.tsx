import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

interface Task {
  id: string;
  title: string;
  location: string;
  lat: number;
  lng: number;
}

interface TaskMapViewProps {
  tasks: Task[];
}

const TaskMapView: React.FC<TaskMapViewProps> = ({ tasks }) => {
  return (
    <div className="w-full h-[450px] rounded-lg overflow-hidden">
      <MapContainer
        center={[12.9716, 77.5946]} // Bangalore default
        zoom={13}
        className="w-full h-full"
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {tasks.map((task) => (
          <Marker key={task.id} position={[task.lat, task.lng]}>
            <Popup>
              <strong>{task.title}</strong>
              <br />
              {task.location}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default TaskMapView;
