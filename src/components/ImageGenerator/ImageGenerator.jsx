import React, { useRef, useState } from 'react'
import './ImageGenerator.css'
import default_image from '../Assests/default_image.svg'

export const ImageGenerator = () => {
    const [image_url, setImage_url] = useState("/");
    let inputRef = useRef(null);
    const [loading, setLoading] = useState(false);

    const ImageGenerator = async () => {
        if(inputRef.current.value === ""){
            return 0;
        }
        setLoading(true);
        const response = await fetch(
            "https://api.openai.com/v1/images/generations",
            {
                method:"POST",
                headers:{
                    "Content-Type":"application/json",
                    Authorization:
                    `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
                    "User-Agent":"Chrome",
                },
                body:JSON.stringify({
                    prompt:`${inputRef.current.value}`,
                    n:1,
                    size:"512x512",
                }),
            }
        );
        let data = await response.json();
        let data_array = data.data;
        setImage_url(data_array[0].url);
        setLoading(false);
    }

    const downloadImage = () => {
        if (image_url !== "/") {
            const link = document.createElement('a');
            link.href = image_url;
            link.download = 'generated_image.png';
            link.click();
        }
    }
    return (
        <div>
            <div className="ai-image-generator">
                <div className="header">Ai image <span>generator</span></div>
                <div className="img-loading">
                    <div className="image">
                        <img src={image_url === "/" ? default_image : image_url} alt="" />
                    </div>
                    <div className="loading">
                        <div className={loading ? "loading-bar-full": "loading-bar"}>
                            <div className={loading ? "loading-text": "display-none"}>Loading....</div>
                        </div>
                    </div>
                </div>
                <div className="search-box">
                    <input type="text" ref={inputRef} className='search-input' placeholder='Describe What You Want To See'/>
                    {image_url !== "/" && (
                        <div className="download-btn" onClick={downloadImage}>Download</div>
                    )}
                    <div className="generate-btn" onClick={() => {ImageGenerator()}}>Generate</div>
                </div>
            </div>
        </div>
    )
}