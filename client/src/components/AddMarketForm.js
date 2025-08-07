import React, { useState, useRef } from 'react';
import { MapContainer, TileLayer, FeatureGroup } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import L from 'leaflet';
import './AddMarketForm.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png',
});

const AddMarketForm = ({ onSubmit }) => {
  const [name, setName] = useState('');
  const [schedule, setSchedule] = useState([]);
  const [roadData, setRoadData] = useState([]);
  const featureGroupRef = useRef();

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const position = [37.9838, 23.7275]; // Centered on Athens

  const onCreated = (e) => {
  const { layer } = e;
  if (layer instanceof L.Polyline) {
    const coordinates = layer.getLatLngs().map(latLng => [latLng.lng, latLng.lat]);
    const newRoad = {
      roadName: 'Untitled Road', // TODO: Allow user to name roads or remove road names
      path: {
        type: 'LineString',
        coordinates,
      },
    };
    setRoadData(prev => [...prev, newRoad]);
  }
};

  const handleSubmit = (e) => {
    e.preventDefault();
    if (roadData.length > 0) {
      onSubmit({ name, schedule, roadData });
    } else {
      alert("Please draw at least one road and add a market location.");
    }
  };

  return (
    <div className="add-market-container">
      <h2>Add a New Street Market</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>
            Market Name:
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>
        </div>
        <div className="form-group">
          <label>Schedule:</label>
          <div className="schedule-options">
            {days.map(day => (
              <label key={day}>
                <input
                  type="checkbox"
                  value={day}
                  checked={schedule.includes(day)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSchedule([...schedule, day]);
                    } else {
                      setSchedule(schedule.filter(d => d !== day));
                    }
                  }}
                />
                {day}
              </label>
            ))}
          </div>
        </div>
        <div className="form-group map-drawing-area">
          <label>Draw Closed Roads and Place Market Pin:</label>
          <MapContainer
            center={position}
            zoom={13}
            className="map-container"
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            />
            <FeatureGroup ref={featureGroupRef}>
              <EditControl
                position="topright"
                onCreated={onCreated}
                draw={{
                  rectangle: false,
                  circle: false,
                  circlemarker: false,
                  polygon: false,
                }}
              />
            </FeatureGroup>
          </MapContainer>
        </div>
        <button type="submit">Submit Market</button>
      </form>
    </div>
  );
};

export default AddMarketForm;