import React, { useState, useEffect } from "react";
import GoogleMapReact from 'google-map-react';

function Map(props) {
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
                bootstrapURLKeys={{ key: "[CHANGE TO GOOGLE MAP API]" }}
                defaultCenter={defaultProps.center}
                defaultZoom={defaultProps.zoom}
                center={props.coordinates}
                onClick={e => {
                    props.setShowDamageForm(true);
                    props.setSavedCoordinates({
                        lat: e.lat,
                        lng: e.lng,
                    });

                    // Only show temp icon on dashboard
                    if (props.page == "home") {
                        props.setTempMarker({
                            show: true,
                            lat: e.lat,
                            lng: e.lng,
                        });
                    }
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

                {props.tempMarker.show && (
                    <props.Marker
                        lat={props.tempMarker.lat}
                        lng={props.tempMarker.lng}
                        text=""
                        image="tempicon.png"
                    />
                )}

            </GoogleMapReact>
        </div>
    );
}

export default Map;
