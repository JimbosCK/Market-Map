import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import AddMarketForm from './components/AddMarketForm';
import { greenIcon, redIcon, orangeIcon } from './mapIcons';

// Leaflet icon fix
import L from 'leaflet';
import 'leaflet/dist/images/marker-shadow.png';
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png') 
});


function App() {
  const [markets, setMarkets] = useState([]);
  const [selectedMarket, setSelectedMarket] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showAddMarket, setShowAddMarket] = useState(false);
  const position = [37.9838, 23.7275];

  const fetchMarkets = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/markets`);
      setMarkets(response.data);
    } catch (error) {
      console.error('Error fetching markets:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMarkets();
  }, []);

  const getMarketIcon = (market) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const today = days[new Date().getDay()];
    const isActiveToday = market.schedule.includes(today);
    const isVerified = market.status === 'verified';

    if (isVerified && isActiveToday) {
      return redIcon;
    } else if (isVerified && !isActiveToday) {
      return orangeIcon;
    } else if (market.status === 'pending') {
      return greenIcon;
    }
    return greenIcon;
  };

  const handleMarkerClick = (market) => {
    setSelectedMarket(market);
  };
  
  const handleFormSubmit = async (formData) => {
    try {
      const location = {
        type: "Point",
        coordinates: formData.roadData[0].path.coordinates[0]
      };

      const payload = {
        name: formData.name,
        schedule: formData.schedule,
        closedRoads: formData.roadData,
        location: location
      };

      await axios.post(`${process.env.REACT_APP_API_URL}/api/markets`, payload);
      alert('Market submitted for review!');
      setShowAddMarket(false);
      fetchMarkets(); 

    } catch (error) {
      console.error('Error submitting market:', error);
      alert('Failed to submit market. Please try again.');
    }
  };

  return (
    <div className="App">
      <h1>Street Market Map</h1>
      <button
        className={`btn ${showAddMarket ? 'btn-secondary' : 'btn-primary'} mb-3`}
        onClick={() => setShowAddMarket((prev) => !prev)}
        style={{ minWidth: '180px', fontWeight: 500 }}
      >
        {showAddMarket ? 'Hide Add Market Form' : 'Add New Market'}
      </button>
      {showAddMarket && <AddMarketForm onSubmit={handleFormSubmit} />}
      {isLoading ? (
        <div className="loading-state">Loading map data...</div>
      ) : (
        <MapContainer center={position} zoom={13} style={{ height: '80vh', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          />
          {markets.map((market) => (
            <Marker
              key={market._id}
              position={[market.location.coordinates[1], market.location.coordinates[0]]}
              icon={getMarketIcon(market)}
              eventHandlers={{
                click: () => handleMarkerClick(market),
              }}
            >
              <Popup>
                <b>{market.name}</b>
                <p>Status: {market.status}</p>
                <p>Schedule: {market.schedule.join(', ')}</p>
              </Popup>
            </Marker>
          ))}
          {selectedMarket && selectedMarket.closedRoads.map((road, index) => {
            const pathCoordinates = road.path.coordinates.map(coord => [coord[1], coord[0]]);
            return (
              <Polyline
                key={index}
                positions={pathCoordinates}
                color="red"
                weight={5}
              />
            );
          })}
        </MapContainer>
      )}
    </div>
  );
}

export default App;