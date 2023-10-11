import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import logo from './imgs/logo.png'
import './Navbar.css';

function Navbar() {
  const [click, setClick] = useState(false);

  const handleClick = () => setClick(!click);
  const closeMobileMenu = () => setClick(false);
  
  return (
    <nav className='navbar'>
      <NavLink to='/' className='navbar-logo'>
        <img alt='LIMACODIDAE DATABASE' className='navbar-img' src={logo}></img>
      </NavLink>
      <div className='nav-content'>
        <ul className={click ? 'nav-menu active' : 'nav-menu'}>
          <li className='nav-item'>
            <NavLink to='/' className='nav-links' onClick={closeMobileMenu}>Home</NavLink>
          </li>
          <li className='nav-item'>
            <NavLink to='/catalog' className='nav-links' onClick={closeMobileMenu}>Catalog</NavLink>
          </li>
          <li className='nav-item'>
            <NavLink to='/about' className='nav-links' onClick={closeMobileMenu}>About</NavLink>
          </li>
          <li className='nav-item'>
            <NavLink to='/contact' className='nav-links' onClick={closeMobileMenu}>Contact</NavLink>
          </li>
          <li className='nav-item'>
            <NavLink to='/login' className='nav-links' onClick={closeMobileMenu}>Login</NavLink>
          </li>
        </ul>
      </div>
      <div className='menu-icon' onClick={handleClick}>
        <i className={click ? 'fas fa-times' : 'fas fa-bars'}></i>
      </div>
    </nav>
  )
}

export default Navbar
