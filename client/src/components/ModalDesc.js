import React, { useEffect, useState, useRef } from 'react'
import './ModalDesc.css'

const handleModalClick = event => {
  event.stopPropagation();
}

function ModalDesc({ setDescModalOpen, id }) {

  const [descImg, setDescImg] = useState([]);
  const [copied, setCopied] = useState(false);
  const ref = useRef();

  useEffect(() => {

    const fetchDescImg = () => {

      fetch(`http://mariposas-vercel-api.vercel.app/MothImgs/imageMoths_getSomeType/${id}/1`, { 
        method: 'get', 
        headers: {
            'my_token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2VtYWlsIjoicGVkcm9sdWNlbmFkb0BnbWFpbC5jb20iLCJpYXQiOjE2ODQ4NzYwODJ9.qt-zB7qLuhUY1xc2XwjQNdNBHc2zR7B3SnTD_z_htcg'
        } 
      })
      .then(res => res.json())
      .then(data => {
        setDescImg(data.data);
      })
    }

    fetchDescImg();

  }, [id]);

  const handleCopyClick = () => {
    try{
      navigator.clipboard.writeText(ref.current?.innerText);
      setCopied(true);
    } catch (e) {
      console.log("Error: " + e)
    }
    

  };

  const path = descImg.map(img => img.file_path).join();
  const description = descImg.map(img => img.observations).join();

  return (
    <div className='modal-background' onClick={setDescModalOpen}>
        <div className='description-modal-container' onClick={handleModalClick}>
            <div className='description-image-display'>
              {descImg.length > 0 ? <img className='description-image' key={id} alt='description' src={require('../' + path.substring(1))}></img> : "No description image found"}
            </div>
            <div ref={ref} className='description'>{description ? description : "No description text found"} </div>
            <div className='copy-container'>
              <button className={`copy-button ${copied && "copy-button-expand"}`} onClick={handleCopyClick}>Copy <i className={`fa-regular fa-circle-check check-icon ${copied && "check-show"}`}></i></button>
            </div>
        </div>
        <button onClick={ setDescModalOpen } className='close-button'>Close</button>
    </div>
  )
}

export default ModalDesc
