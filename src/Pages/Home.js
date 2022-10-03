import { Link, useNavigate, useLocation } from "react-router-dom";
import Axios from "axios";
import React, { useState } from "react";
import GoogleMapReact from 'google-map-react';
import Geocode from "react-geocode";
import { useForm } from "react-hook-form";

Geocode.setApiKey("AIzaSyA7xKwuH6YRjBDnJfq_GsqGaLxRgSa-WKc");

function Home(props) {
    const { register, handleSubmit, watch, setError, getValues, formState: { errors } } = useForm();

    // Navigation
    const navigate = useNavigate();
    const location = useLocation();

    const AnyReactComponent = ({ text }) => <div>{text}</div>;

    const [coordinates, setCoordinates] = useState({
        lat: 10.99835602,
        lng: 77.01502627
    });

    const defaultProps = {
        center: {
            lat: 10.99835602,
            lng: 77.01502627
        },
        zoom: 11
    };

    const locationArea = {
        address: '1126 Chelsea Park Drive Minneola, FL 34715',
    }

    /**
     * Handles search form submission
     * 
     * @param {*} e Gets event data
     */
    const submitSearch = (e) => {
        // Get latitude & longitude from address.
        Geocode.fromAddress(e.addressSearch).then(
            (response) => {
                const { lat, lng } = response.results[0].geometry.location;
                console.log(lat, lng);
                setCoordinates({
                    lat: lat,
                    lng: lng
                });
            },
            (error) => {
                console.error(error);
            }
        );
    };

    return (
        // Important! Always set the container height explicitly
        <div style={{ height: '50vh', width: '100%' }}>
            <GoogleMapReact
                bootstrapURLKeys={{ key: "AIzaSyA7xKwuH6YRjBDnJfq_GsqGaLxRgSa-WKc" }}
                defaultCenter={defaultProps.center}
                defaultZoom={defaultProps.zoom}
                center={coordinates}
                onClick={e => {
                    console.log(e);
                    console.log("latitide = ", e.lat);
                    console.log("longitude = ", e.lng);
                }}
            >
                <AnyReactComponent
                    lat={59.955413}
                    lng={30.337844}
                    text="My Marker"
                />
            </GoogleMapReact>

            <form method="POST" onSubmit={handleSubmit(submitSearch)}>
                <input type="text" {...register("addressSearch")} />
                <input type="submit" value="Search!" />
            </form>
        </div>
    );
}

export default Home;
