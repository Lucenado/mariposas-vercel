import React from 'react'
import './ItemRefs.css'

function ItemRefs({ data }) {
  
  return (
    <div className='container-refs'>
        <div className='refs-title'>
            <span className='title'>References</span>
        </div>
        <div className='refs-items'>
          <ul className='refs-list'>
            {data.map(ref => (
              <li key={ref.id} className='refs-item'>
                <a className='refs-link' rel="noreferrer" href={ref.ref_link} target="_blank">{ref.ref}</a>
              </li>
            ))}
          </ul>
        </div>
      
    </div>
  )
}

export default ItemRefs
