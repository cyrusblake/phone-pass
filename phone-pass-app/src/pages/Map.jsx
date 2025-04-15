

import { useState, useEffect } from "react"
import "../styles/components/map.css";

const Map = () => {

    const [name, setName] = useState('');

    function handleclick() {
        setName('Hello')
    }

    useEffect(() => {
        if(name === 'Hello') {
            setName('Cyrus')
        }
    })


    return(
        <>
            <div className="map-container">
                <h1>Map</h1>
                <button onClick={handleclick}></button>
                <p>{name}</p>
            </div>
            
            
        
        </>
    )



}

export default Map