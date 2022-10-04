import Axios from "axios";
import React, { useState, useEffect } from "react";
import Geocode from "react-geocode";
import { useForm } from "react-hook-form";
import DamageForm from "./Modules/DamageForm";
import AddressSearch from "./Modules/AddressSearch";
import Map from "./Modules/Map";

Geocode.setApiKey("AIzaSyA7xKwuH6YRjBDnJfq_GsqGaLxRgSa-WKc");

function Home(props) {
    const { register, handleSubmit, watch, setError, getValues, formState: { errors } } = useForm();

    /**
     * Load markers from server
     */
    const loadMarkers = () => {
        Axios.get("markers").then((response) => {
            if (response.data.result) {
                for (let i = 0; i <= response.data.result.length - 1; i++) {
                    props.createMarker(response.data.result[i].id, response.data.result[i].date, response.data.result[i].damageName, response.data.result[i].image, response.data.result[i].lat, response.data.result[i].lng);
                }
            }
        });
    };

    /**
       * On page load
      */
    useEffect(() => {
        props.setPage("home");
        loadMarkers();
    }, []);

    return (
        <div>
            {props.showDamageForm ? <div className="top-content"><DamageForm createMarker={props.createMarker} savedCoordinates={props.savedCoordinates} setSavedCoordinates={props.setSavedCoordinates} setShowDamageForm={props.setShowDamageForm} /></div> : null}

            <div className="content">
                <Map markers={props.markers} Marker={props.Marker} coordinates={props.coordinates} setCoordinates={props.setCoordinates} savedCoordinates={props.savedCoordinates} setSavedCoordinates={props.setSavedCoordinates} setShowDamageForm={props.setShowDamageForm} />
            </div>

            <div className="content">
                <AddressSearch setCoordinates={props.setCoordinates} />
            </div>

            <div className="block-content">
                {props.markerInfo}
            </div>
        </div>
    );
}

export default Home;
