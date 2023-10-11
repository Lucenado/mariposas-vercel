import React, { useMemo, useState, useCallback, useEffect } from 'react';
import './Map.css';
import { GoogleMap, MarkerF } from '@react-google-maps/api';

function Map({ data }) {

  const options = useMemo(() => ({
    mapId: "72f08c913a780fe4",
    disableDefaultUI: true,
    clickableIcons: false,
  }), []);

  const [center, setCenter] = useState({
    lat: 16,
    lng: -90
  });

  const [map, setMap] = useState();

  const onLoad = useCallback((map) => setMap(map), []);

  useEffect(() => {
    if (map) {

    const coordinates = {
      lat: [],
      lng: [],
    }

    const bounds = new window.google.maps.LatLngBounds();

    data.forEach(l => {
      coordinates.lat.push(parseFloat(l.lat))
      coordinates.lng.push(parseFloat(l.lng))

      bounds.extend({
        lat: l.lat,
        lng: l.lng,
      })
    })
  
    const averageLng = (Math.max(...coordinates.lng) + Math.min(...coordinates.lng)) / 2;
    const averageLat = (Math.max(...coordinates.lat) + Math.min(...coordinates.lat)) / 2;

    setCenter({lat: averageLat, lng: averageLng})
      
    map.fitBounds(bounds)

    var zoom = null;

    window.google.maps.event.addListenerOnce(map, "zoom_changed", function() {
      zoom = map.getZoom(); 
      map.setZoom(zoom > 6 ? 6 : zoom);
    });

    }

  }, [map, data])

  const handleMarkerClick = (marker) => {
    console.log('clicked')
    map.setZoom(8);
    map.setCenter({lat: marker.lat, lng: marker.lng})
  };

  return (
    <div className='map-container'>
      <GoogleMap
        zoom={3}
        center={center}
        mapContainerClassName='map'
        options={options}
        onLoad={onLoad}
      >
        {data.map(marker => <MarkerF onClick={handleMarkerClick.bind(this, marker)} title='Click to zoom' key={marker.key} position={{lat: marker.lat, lng: marker.lng}} />)}
      </GoogleMap> 
    </div>
  )
}

export default Map
