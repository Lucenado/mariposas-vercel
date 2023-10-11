import React from 'react'
import { useState, useEffect, lazy, Suspense } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import './CatalogItem.css';
import ImgCarousel from '../components/ImgCarousel';
import ItemInfo from '../components/ItemInfo';
import ItemRefs from '../components/ItemRefs';

const ItemSyns = lazy(() => import('../components/ItemSyns'))
const ItemMap = lazy(() => import('../components/ItemMap'))

function CatalogItem() {
  const [mothMain, setMothMain] = useState([]);
  const [mothSyns, setMothSyns] = useState([]);
  const [mothImgs, setMothImgs] = useState([]);
  const [mothColls, setMothColls] = useState([]);
  const [mothRefs, setMothRefs] = useState([]);
  const [markers, setMarkers] = useState([]);
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {

    const fetchMain = () => {
      return fetch(`http://mariposas-vercel-api.vercel.app/MainMoths/mainMoths_get/${id}`, { 
            method: 'get', 
            headers: {
                'my_token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2VtYWlsIjoicGVkcm9sdWNlbmFkb0BnbWFpbC5jb20iLCJpYXQiOjE2ODQ4NzYwODJ9.qt-zB7qLuhUY1xc2XwjQNdNBHc2zR7B3SnTD_z_htcg'
            } 
          })
          .then(res => res.json())
          .then(data => {
            if(data.data === 'Not Found'){
              navigate('/catalog')
            }else{
              setMothMain(data.data)
            }
          })
    };

    const fetchSyns = () => {
      return fetch(`http://mariposas-vercel-api.vercel.app/MainMoths/mainMoths_getSyns/${id}`, { 
            method: 'get', 
            headers: {
                'my_token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2VtYWlsIjoicGVkcm9sdWNlbmFkb0BnbWFpbC5jb20iLCJpYXQiOjE2ODQ4NzYwODJ9.qt-zB7qLuhUY1xc2XwjQNdNBHc2zR7B3SnTD_z_htcg'
            } 
          })
          .then(res => res.json())
          .then(data => setMothSyns(data.data))
    };

    location.state?.data ? setMothMain(location.state?.data) : fetchMain();

    location.state?.syns ? (location.state?.syns.includes(parseInt(id)) && fetchSyns()) : fetchSyns();

    const fetchImgs = () => {
      return fetch(`http://mariposas-vercel-api.vercel.app/MothImgs/imageMoths_getSomeId/${id}`, { 
        method: 'get', 
        headers: {
            'my_token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2VtYWlsIjoicGVkcm9sdWNlbmFkb0BnbWFpbC5jb20iLCJpYXQiOjE2ODQ4NzYwODJ9.qt-zB7qLuhUY1xc2XwjQNdNBHc2zR7B3SnTD_z_htcg'
        } 
      })
      .then(res => res.json())
      .then(data => setMothImgs(data.data))
    };

    const fetchColls = () => {
      return fetch(`http://mariposas-vercel-api.vercel.app/MothCollection/collectionMoths_filter_main/${id}`, { 
        method: 'get', 
        headers: {
            'my_token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2VtYWlsIjoicGVkcm9sdWNlbmFkb0BnbWFpbC5jb20iLCJpYXQiOjE2ODQ4NzYwODJ9.qt-zB7qLuhUY1xc2XwjQNdNBHc2zR7B3SnTD_z_htcg'
        } 
      })
      .then(res => res.json())
      .then(data => {
        setMothColls(data.data)

        data.data.forEach(el => {
          (el.lat && el.long) && setMarkers( markers => [...markers, {key: el.id_collection, lat: el.lat_hem === 'S' ? -Math.abs(parseFloat(el.lat)) : parseFloat(el.lat), lng: el.long_hem === 'W' ? -Math.abs(el.long) : el.long}])
        })
      })
    };

    const fetchRefs = () => {
      return fetch(`http://mariposas-vercel-api.vercel.app/MothRefs/refMoths_get/${id}`, { 
        method: 'get', 
        headers: {
            'my_token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2VtYWlsIjoicGVkcm9sdWNlbmFkb0BnbWFpbC5jb20iLCJpYXQiOjE2ODQ4NzYwODJ9.qt-zB7qLuhUY1xc2XwjQNdNBHc2zR7B3SnTD_z_htcg'
        } 
      })
      .then(res => res.json())
      .then(data => setMothRefs(data.data))
    };

    fetchImgs();
    fetchColls();
    fetchRefs();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);
  
  return (
    <div className='catalog-item'>
      <div className='catalog-item-header'>
        <div className='catalog-item-name'>
          <span>{mothMain.genus} {mothMain.species}</span> <span>{mothMain.author}, {mothMain.year}</span>
        </div>
      </div>
      <div className='catalog-carousel'>
        <ImgCarousel data={ mothImgs }/>
      </div>
      <div className='catalog-item-info'>
        <ItemInfo mainData={ mothMain } collData={ mothColls }/>
      </div>
      <div className='catalog-map'>
        {markers.length ? 
          <Suspense fallback={<div>Loading...</div>}>
            <ItemMap data={ markers }/> 
          </Suspense>
        : <span>No coordinates data found</span>}
      </div>
      {mothSyns.length > 0 &&
      <div className='catalog-syns'>
        <Suspense fallback={<div>Loading...</div>}>
          <ItemSyns data={ mothSyns } />
        </Suspense>
      </div>}
      <div className='catalog-references'>
        <ItemRefs data={ mothRefs }/>
      </div>
    </div>
  )
}

export default CatalogItem