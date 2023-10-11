import React from 'react'
import { useLoadScript } from '@react-google-maps/api';
import './ItemMap.css';
import Map from './Map';

function ItemMap({ data }) {

  const {isLoaded} = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  })
  
  if (!isLoaded) return <div>Loading...</div>
  return (
    <div className='container-map'>
        <Map data={ data }/>
    </div>
  )
}

export default ItemMap
