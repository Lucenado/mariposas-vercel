import React, { useEffect, useState } from 'react'
import './ItemInfo.css';
import ModalDesc from './ModalDesc';
import ModalColls from './ModalColls';

function ItemInfo({ mainData, collData}) {

  const [info, setInfo] = useState({
    country: "",
    gender: "",
    location: "",
    host_plant: "",
    ref: ""
  });

  const [typeData, setTypeData] = useState([]);
  const [descModalOpen, setDescModalOpen] = useState(false);
  const [collsModalOpen, setCollsModalOpen] = useState(false);

  useEffect(() => {
    const fetchTypeData = () => {
      collData && collData.length > 0 ? collData.map((o) => (o.type !== "" && o.type !== null) && setTypeData(typeData => [...typeData, o])) : setTypeData([]);
    };

    fetchTypeData();
  }, [collData]);

  useEffect(() => {
    const fetchInfo = () => {
      const country = [...new Set(typeData.map((o) => o.country))].join(', ');
      const gender = [...new Set(typeData.map((o) => o.sex === 'M' ? 'Male' : (o.sex === 'F') && 'Female'))].join(', ');
      const location = [...new Set(typeData.map((o) => o.museum_coll))].join(', ');
      const host_plant = mainData.host_plant;
      const ref = mainData.desc_reference;

      setInfo({
        country: country,
        gender: gender,
        location: location,
        host_plant: host_plant,
        ref: ref
      });
    };

    fetchInfo();
  }, [typeData, mainData]);

  useEffect(() => {
    const scrollBarCompensation = window.innerWidth - document.body.offsetWidth;
    if (descModalOpen || collsModalOpen) {
      document.body.style.overflow = 'hidden' 
      document.body.style.paddingRight = `${scrollBarCompensation}px`
    } else {
      document.body.style.overflow = '';
      document.body.style.paddingRight = `0`
    }
  }, [descModalOpen, collsModalOpen])

  return (
    <div className='container-info'>
      <div className='item-info'>
        <div className='row-info'>
          <div className='info-title'>Type locality </div> <div className='info'>{ info.country }</div>
        </div>
        <div className='row-info'>
          <div className='info-title'>Type gender </div> <div className='info'>{ info.gender }</div>
        </div>
        <div className='row-info'>
          <div className='info-title'>Location of type </div> <div className='info'>{ info.location }</div>
        </div>
        <div className='row-info'>
          <div className='info-title'>Host plants </div> <div className='info'>{ info.host_plant }</div>
        </div>
        <div className='row-info'>
          <div className='info-title'>Reference </div> <div className='info'>{ info.ref }</div>
        </div>
      </div>
      <div className='container-buttons'>
        <button onClick={() => setDescModalOpen(!descModalOpen)} className='button-description'>Description</button>
        <button onClick={() => setCollsModalOpen(!collsModalOpen)} className='button-collections'>Collections</button>
      </div>
        { descModalOpen && <ModalDesc setDescModalOpen={() => setDescModalOpen(!descModalOpen)} id={ mainData.id } /> }
        { collsModalOpen && <ModalColls setCollsModalOpen={() => setCollsModalOpen(!collsModalOpen)} data={ collData }/> }
    </div>
  )
}

export default ItemInfo
