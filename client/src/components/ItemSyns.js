import React from 'react'
import './ItemSyns.css'
import { NavLink } from 'react-router-dom'

function ItemSyns({ data }) {

    function mothInfo(moth) {
        const info = `${moth.genus} ${moth.species} ${moth.author}, ${moth.year}`;
        return info;
      }

  return (
    <div className='container-syns'>
      <div className='container-title'>
        <span className='title'>Synonyms</span>
      </div>
      <ul className='list-syns'>
        {data.map(syn => (
            <li key={syn.id} className='syn-item'>
                <NavLink className='syn-link' to={`/catalog/${syn.id}`} state={{ data: syn}}> {mothInfo(syn)} </NavLink>
            </li>
        ))}
      </ul>
    </div> 
  )
}

export default ItemSyns
