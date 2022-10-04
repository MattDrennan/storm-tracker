import { Link, useNavigate, useLocation } from "react-router-dom";
import Axios from "axios";
import React, { useState, useEffect } from "react";
import GoogleMapReact from 'google-map-react';
import Geocode from "react-geocode";
import { useForm } from "react-hook-form";
import DamageForm from "./Modules/DamageForm";
import AddressSearch from "./Modules/AddressSearch";
import moment from 'moment';

Geocode.setApiKey("AIzaSyA7xKwuH6YRjBDnJfq_GsqGaLxRgSa-WKc");

function Home(props) {
    const { register, handleSubmit, watch, setError, getValues, formState: { errors } } = useForm();

    // Navigation
    const navigate = useNavigate();
    const location = useLocation();

    /**
     * Marker information
     */
    const [markerInfo, setMarkerInfo] = useState(null);

    /**
     * Marker Click Event
     */
    const clickMarker = (e) => {
        Axios.get("marker", {
            params: {
                id: e,
            }
        }).then((response) => {
            if (response.data.result) {
                setMarkerInfo(
                    <div>
                        <img src={"./images/" + response.data.result[0].image} />
                        <h4>{response.data.result[0].damageName}</h4>
                        {moment(new Date(response.data.result[0].date)).format("YYYY-MM-DD HH:mm:ss")}
                        {response.data.result[0].comments == undefined ? 'N/A' : response.data.result[0].comments}
                        {response.data.result[0].lat}, {response.data.result[0].lng}
                        {response.data.result[0].address}
                        <button onClick={() => setMarkerInfo(<div></div>)}>Close</button>
                    </div>);
            }
        });
    };

    /**
     * Make markers on map
     */
    const Marker = ({ id, text, image }) => <div onClick={() => clickMarker(id)}><img src={"./images/" + image} />{text}</div>;

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
    const createMarker = (id, date, text, image, lat, lng) => {
        let object = {
            id: id,
            date: date,
            text: text,
            image: image,
            lat: lat,
            lng: lng,
        };

        // Object into array
        setMarkers(markers => [...markers, object]);
    };

    /**
     * Load markers from server
     */
    const loadMarkers = () => {
        Axios.get("markers").then((response) => {
            if (response.data.result) {
                for (let i = 0; i <= response.data.result.length - 1; i++) {
                    createMarker(response.data.result[i].id, response.data.result[i].date, response.data.result[i].damageName, response.data.result[i].image, response.data.result[i].lat, response.data.result[i].lng);
                }
            }
        });
    };

    /**
       * On page load
      */
    useEffect(() => {
        loadMarkers();
    }, []);

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
                    }}>

                    {markers.map(function (object, i) {
                        return <Marker
                            id={object.id}
                            lat={object.lat}
                            lng={object.lng}
                            text={object.text}
                            image={object.image}
                            key={object.id}
                        />;
                    })}

                </GoogleMapReact>

                <AddressSearch setCoordinates={setCoordinates} />

                <a href="/search">Advanced Search</a>

                {markerInfo}
            </div>
        </div>
    );
}

export default Home;
