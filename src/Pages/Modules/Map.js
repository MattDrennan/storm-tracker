import { useForm } from "react-hook-form";
import React, { useState, useEffect } from "react";
import GoogleMapReact from 'google-map-react';
import { useGeolocated } from "react-geolocated";

function Map(props) {
    const { register, handleSubmit, formState: { errors } } = useForm();

    /**
     * Default properties for Google Maps
     */
    const defaultProps = {
        center: {
            lat: 0,
            lng: 0
        },
        zoom: 11
    };

    return (
        <div style={{ height: '50vh', width: '100%' }}>
            <GoogleMapReact
                bootstrapURLKeys={{ key: "AIzaSyA7xKwuH6YRjBDnJfq_GsqGaLxRgSa-WKc" }}
                defaultCenter={defaultProps.center}
                defaultZoom={defaultProps.zoom}
                center={props.coordinates}
                onClick={e => {
                    props.setShowDamageForm(true);
                    props.setSavedCoordinates({
                        lat: e.lat,
                        lng: e.lng,
                    });
                }}>

                {props.markers.map(function (object, i) {
                    return <props.Marker
                        id={object.id}
                        lat={object.lat}
                        lng={object.lng}
                        text={object.text}
                        image={object.image}
                        key={object.id}
                    />;
                })}

            </GoogleMapReact>
        </div>
    );
}

export default Map;