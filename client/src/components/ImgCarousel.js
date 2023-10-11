import React, { useState, useEffect, useRef } from 'react'
import './ImgCarousel.css';
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import scrollIntoView from 'scroll-into-view-if-needed';
import MyLoader from './MyLoader';

function ImgCarousel({ data }) {

    const [slide, setSlide] = useState(0);
    const [expand, setExpand] = useState(false);
    const handle = useFullScreenHandle();
    const [loading, setLoading] = useState(true);

    const ids = data.map(a => a.id)

    const ref = useRef([]);

    useEffect(() => {
        setSlide(ids[0]); 

        const imgRequire = async () => {
            data.forEach(img => {
                try{
                    img.file_path = require('../' + img.file_path.substring(1))

                } catch (e){
                    console.log('No images available in the database');
                    console.log(e);
                }  
            })
            
            setLoading(false);
        }

        imgRequire();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data]);

    function ImageCarousel (path, id) {
        return (
            <img loading='lazy' src={path} alt='moth' className={slide === id ? 'image' : 'image image-hidden'} key={id}/>
        ); 
    };

    function ImageDisplay (path, id) {
        return (
            <img loading='lazy' ref={el => ref.current[id] = el} src={path} alt='moth' className={slide === id ? 'display-image' : 'display-image image-notselected'} key={id} onClick={() => {selectImg(id)}}/>
        );
    };

    const nextSlide = () => {
        let i = ids.indexOf(slide);

        let next = i + 1;

        let nextSlide = next in ids ? ids[next] : ids[0];

        setSlide(nextSlide);

        scrollIntoView(ref.current[nextSlide], {
            scrollMode: 'if-needed',
            block: 'nearest',
            inline: 'center',
            behavior: 'smooth'
        })
    }

    const prevSlide = () => {
        let i = ids.indexOf(slide);

        let next = i - 1;

        let nextSlide = next in ids ? ids[next] : ids[ids.length-1];

        setSlide(nextSlide);

        scrollIntoView(ref.current[nextSlide], {
            scrollMode: 'if-needed',
            block: 'nearest',
            inline: 'center',
            behavior: 'smooth'
        })
    }

    const selectImg = (id) => {
        setSlide(id);

        scrollIntoView(ref.current[id], {
            scrollMode: 'if-needed',
            block: 'center',
            inline: 'center',
            behavior: 'smooth'
        })
    }

    return (
        <div className='carousel'>
            <div className='image-displayer'>
                <FullScreen handle={handle}>
                    {ids.length > 1 && <div className='container-arrow container-arrow-left' onClick={prevSlide}>
                        <i className='fa-solid fa-chevron-left arrow arrow-left fa-xl'></i>
                    </div>}
                    {handle.active && (
                        <div className='close-div' onClick={handle.exit}>
                            <i className="fa-solid fa-xmark fa-xl close-icon"></i>
                        </div>
                    )}
                    {loading ? <MyLoader /> : data.map(img => (
                        ImageCarousel(img.file_path, img.id)
                    ))}
                    {ids.length > 1 && <div className='container-arrow container-arrow-right' onClick={nextSlide}>
                        <i className="fa-solid fa-chevron-right arrow arrow-right fa-xl"></i>
                    </div>}
                </FullScreen>
                <div className='container-icon-fullscreen' onClick={handle.enter}>
                    <i className="fa-solid fa-expand fa-xl icon-fullscreen"></i>
                </div>
                
            </div>
            <div className={data.length > 6 ? (expand ? 'carousel-display scroll carousel-display-expanded' : 'carousel-display scroll') : 'carousel-display'}>
                {data.map(img => (
                    <div key={img.id} className='display-item'>
                        {ImageDisplay(img.file_path, img.id)}
                    </div>
                ))}
            </div>
            <div onClick={() => setExpand(!expand)} className={data.length > 6 ? (expand ? 'container-expand-icon expanded' : 'container-expand-icon') : 'container-expand-icon-none'}>
                <i className="fa-solid fa-caret-down fa-xl expand-icon"></i>
            </div>
        </div>
    )
}

export default ImgCarousel
