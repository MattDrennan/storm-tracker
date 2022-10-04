import { useForm } from "react-hook-form";
import React, { useState } from "react";
import Geocode from "react-geocode";

function AddressSearch(props) {
    const { register, handleSubmit, formState: { errors } } = useForm();

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
                props.setCoordinates({
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
        <div>
            <form method="POST" onSubmit={handleSubmit(submitSearch)}>
                Address: <input type="text" {...register("addressSearch")} />
                <input type="submit" value="Search!" />
            </form>
        </div>
    );
}

export default AddressSearch;