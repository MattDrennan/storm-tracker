import { Link, useNavigate, useLocation } from "react-router-dom";
import Axios from "axios";
import React, { useState, useEffect } from "react";
import GoogleMapReact from 'google-map-react';
import Geocode from "react-geocode";
import { useForm } from "react-hook-form";
import DamageForm from "./Modules/DamageForm";
import AddressSearch from "./Modules/AddressSearch";

Geocode.setApiKey("AIzaSyA7xKwuH6YRjBDnJfq_GsqGaLxRgSa-WKc");

function Home(props) {
    const { register, handleSubmit, watch, setError, getValues, formState: { errors } } = useForm();

    // Navigation
    const navigate = useNavigate();
    const location = useLocation();

    /**
     * Make markers on map
     */
    const Marker = ({ text, image }) => <div><img src={"./images/" + image} />{text}</div>;

    /**
     * Change coordinates of the map
     */
    const [coordinates, setCoordinates] = useState({
        lat: 28.5361941,
        lng: -81.7153184
    });

    /**
     * Current saved coordinates of the map
     */
    const [savedCoordinates, setSavedCoordinates] = useState({
        lat: 0,
        lng: 0
    });

    /**
     * Show Damage Form
     */
    const [showDamageForm, setShowDamageForm] = useState(false);

    /**
     * Default properties for Google Maps
     */
    const defaultProps = {
        center: {
            lat: 28.5361941,
            lng: -81.7153184
        },
        zoom: 11
    };

    /**
     * Array of markers
     */
    const [markers, setMarkers] = useState([]);

    /**
     * Create marker
     */
    const createMarker = (text, image, lat, lng) => {
        setMarkers([...markers, {
            text: text,
            image: image,
            lat: lat,
            lng: lng,
        }]);

        console.log(markers);
    };

    /**
     * Track markers
    */
    useEffect(() => {
        console.log(markers);
    }, [markers]);

    return (
        <div>
            {showDamageForm ? <DamageForm createMarker={createMarker} savedCoordinates={savedCoordinates} setSavedCoordinates={setSavedCoordinates} setShowDamageForm={setShowDamageForm} /> : null}

            <div style={{ height: '50vh', width: '100%' }}>
                <GoogleMapReact
                    bootstrapURLKeys={{ key: "AIzaSyA7xKwuH6YRjBDnJfq_GsqGaLxRgSa-WKc" }}
                    defaultCenter={defaultProps.center}
                    defaultZoom={defaultProps.zoom}
                    center={coordinates}
                    onClick={e => {
                        setShowDamageForm(true);
                        setSavedCoordinates({
                            lat: e.lat,
                            lng: e.lng,
                        });
                        console.log(e);
                    }}>

                    {markers.map(function (object, i) {
                        return <Marker
                            lat={object.lat}
                            lng={object.lng}
                            text={object.text}
                            image={object.image}
                        />;
                    })}

                </GoogleMapReact>

                <AddressSearch setCoordinates={setCoordinates} />
            </div>
        </div>
    );
}

export default Home;
