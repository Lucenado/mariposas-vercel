import React from 'react'
import { useState, useEffect, useRef } from 'react';
import './Catalog.css';
import { NavLink } from 'react-router-dom';

function Catalogue() {
  
  const [moths, setMoths] = useState([]);
  const [filteredMoths, setFilteredMoths] = useState([]);
  const [syns, setSyns] = useState([])
  const [query, setQuery] = useState("");
  const [showScroller, setShowScroller] = useState(false);

  const inputRef = useRef();
  const scrollRef = useRef([]);

  useEffect(() => {
    fetch('http://localhost:8000/MainMoths/mainMoths_getAll', { 
      method: 'get', 
      headers: {
          'my_token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2VtYWlsIjoicGVkcm9sdWNlbmFkb0BnbWFpbC5jb20iLCJpYXQiOjE2ODQ4NzYwODJ9.qt-zB7qLuhUY1xc2XwjQNdNBHc2zR7B3SnTD_z_htcg'
      } 
    })
    .then(res => res.json())
    .then(data => {
      setMoths(data.data)
      setFilteredMoths(
        sessionStorage.getItem("quickSearch") ? 
        data.data.filter(moth => `${moth.genus} ${moth.species} ${moth.author}, ${moth.year}`.toLowerCase().includes(sessionStorage.getItem("quickSearch").toLowerCase())) 
        : data.data
      )
    })

    fetch('http://localhost:8000/MainMoths/mainMoths_getAllSyns', { 
      method: 'get', 
      headers: {
          'my_token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2VtYWlsIjoicGVkcm9sdWNlbmFkb0BnbWFpbC5jb20iLCJpYXQiOjE2ODQ4NzYwODJ9.qt-zB7qLuhUY1xc2XwjQNdNBHc2zR7B3SnTD_z_htcg'
      } 
    })
    .then(res => res.json())
    .then(data => setSyns(data.data))

    window.addEventListener('scroll', controlScroller);

    return () => {
      window.removeEventListener('scroll', controlScroller);
    }

  }, []);

  useEffect(() => {
    if(filteredMoths.length > 0 && sessionStorage.getItem("itemSelected")) {
      scrollRef.current[sessionStorage.getItem("itemSelected")].scrollIntoView({
        block: 'center',
        inline: 'center'
      });
    }
  }, [filteredMoths]);

  const controlScroller = () => {
    window.scrollY > 100 ? setShowScroller(true) : setShowScroller(false);
  }

  function mothInfo(moth) {
    const info = `${moth.genus} ${moth.species} ${moth.author}, ${moth.year}`;
    return info;
  }

  const filterMoths = (param) => {
    setFilteredMoths(moths.filter(moth => mothInfo(moth).toLowerCase().includes(param.toLowerCase())))
  }

  const handleClick = () => {
    sessionStorage.removeItem("itemSelected")
    sessionStorage.setItem("quickSearch", query)
    filterMoths(query)
  }

  const handleKeyDown = (event) => {
    if(event.key === 'Enter') {
      handleClick();
    }
  }

  const handleFilterClear = () => {
    sessionStorage.removeItem("itemSelected")
    sessionStorage.removeItem("quickSearch")
    setFilteredMoths(moths)
    inputRef.current.value = ""
    setQuery("")
  }

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }

  return (
    <div className='catalog'>
      <div className={`catalog-up-btn ${showScroller && 'visible'}`} onClick={handleScrollToTop}><i className='fa-solid fa-chevron-up up-btn'></i></div>
      <h1 className='catalog-title'>Catalog</h1>
      <div className='search-container'>
        <div className='quick-search-container'>
          <span className='quick-search-span'>
              <input ref={inputRef} onChange={e => setQuery(e.target.value)} onKeyDown={handleKeyDown} type='text' placeholder='Quick search...' className='quick-search-input'></input>
              <button onClick={query ? handleClick : undefined} className='quick-search-btn'>
                <i className="fa-solid fa-magnifying-glass"></i>
              </button>
              {sessionStorage.getItem("quickSearch") && <button onClick={handleFilterClear} className='filter-clear-btn'>CLEAR FILTER</button>}
          </span>
        </div>
      </div>
      <div className='list-container'>
        <div className='list-records'>{filteredMoths.length} records found{sessionStorage.getItem("quickSearch") ? (" for \"" + sessionStorage.getItem("quickSearch") + "\".") : "."}</div>
        <ul className='list'>
          {filteredMoths.map(moth => (
            <li ref={el => (scrollRef.current[moth.id] = el)} className='list-item' key={moth.id}>
              <NavLink onClick={() => sessionStorage.setItem("itemSelected", moth.id)} className='list-link' to={`/catalog/${moth.id}`} state={{ data: moth, syns: syns }}> 
                <span><i className='list-text-italic'>{moth.genus} {moth.species}</i> {moth.author}, {moth.year}</span>
              </NavLink>
            </li>
          ))}
        </ul>
        </div>
      
    </div>
  )
}

export default Catalogue
