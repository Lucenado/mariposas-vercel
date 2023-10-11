import './App.css';
import Navbar from './components/Navbar';
import { Routes, Route } from 'react-router-dom';
import NoMatch from './components/NoMatch';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Catalog from './pages/Catalog';
import CatalogItem from './pages/CatalogItem';

function App() {

  return (
    <>
      <Navbar />
      <div className='container'>
        <ScrollToTop>
          <Routes>
            <Route path='/' element={<Home />}></Route>
            <Route path='/catalog' element={<Catalog/>}></Route>
            <Route path='/catalog/:id' element={<CatalogItem/>}></Route>
            <Route path='/about' element={<About />}></Route>
            <Route path='/contact' element={<Contact />}></Route>
            <Route path='/login' element={<Login />}></Route>
            <Route path='*' element={<NoMatch />}></Route>
          </Routes>
        </ScrollToTop>
      </div>
      
    </>
  );
}

export default App;
