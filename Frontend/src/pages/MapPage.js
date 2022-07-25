import React from "react";
import Navbar from "../components/Navbar.js";
import Map from "../components/Map.js";

export default function MapPage() {    
    return (
        <div>
            <Navbar page="Map"/>
            <Map />
        </div>
    );
}
