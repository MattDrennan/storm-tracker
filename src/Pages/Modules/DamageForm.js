import { useForm, Controller } from "react-hook-form";
import React, { useState, useEffect } from "react";
import Axios from "axios";
import moment from 'moment';
import DateTimePicker from 'react-datetime-picker';
import Geocode from "react-geocode";

function DamageForm(props) {
    const { register, handleSubmit, control, formState: { errors } } = useForm();

    /**
     * Datetimepicker const
     */
    const [value, onChange] = useState(new Date());

    /**
     * Handle Damage Form Submit
     */
    const damageSubmit = (e) => {
        // Get address from lat / lng
        Geocode.fromLatLng(props.savedCoordinates.lat, props.savedCoordinates.lng).then(
            (geoResponse) => {
                const address = geoResponse.results[0].formatted_address;

                // Insert marker into database
                Axios.post("marker", {
                    date: moment(new Date(value)).format("YYYY-MM-DD HH:mm:ss"),
                    damageName: e.damageName,
                    image: e.iconPick,
                    comments: e.comments,
                    lat: props.savedCoordinates.lat,
                    lng: props.savedCoordinates.lng,
                    address: address,
                }).then((response) => {
                    props.createMarker(response.data.response.insertId, moment(new Date(value)).format("YYYY-MM-DD HH:MM:ss"), e.damageName, e.iconPick, props.savedCoordinates.lat, props.savedCoordinates.lng);
                    props.setShowDamageForm(false);
                });
            },
            (error) => {
                console.error(error);
            }
        );
    };

    /**
     * List of icons
     */
    const [icons, setIcons] = useState([]);

    /**
     * Load icons from server
     */
    const loadIcons = () => {
        Axios.get("geticons").then((response) => {
            if (response.data.result) {
                for (let i = 0; i <= response.data.result.length - 1; i++) {
                    let array = [];

                    array.push((
                        <div key={i}>
                            <input type="radio" value={response.data.result[i].file} {...register("iconPick", { required: "Please pick an icon." })} />
                            <img src={"./images/" + response.data.result[i].file}></img>
                        </div>
                    ));

                    setIcons(icons => [...icons, array]);
                }
            }
        });
    };

    /**
     * Handle Damage Form Cancel
     */
    const cancelForm = (e) => {
        props.setShowDamageForm(false);
    };

    /**
     * On page load
    */
    useEffect(() => {
        loadIcons();
    }, []);

    return (
        <div className="block-content-top">
            <div className="content">
                <form method="POST" onSubmit={handleSubmit(damageSubmit)}>
                    <p>
                        <div className="form-text">
                            Date:
                        </div>
                        
                        <Controller
                            control={control}
                            name="date"
                            rules={{ required: "Please enter a date." }}
                            defaultValue={new Date()}
                            render={() => (
                                <DateTimePicker
                                    onChange={onChange}
                                    value={value}
                                />
                            )}
                        />

                        {errors.date && <span role="form-error">{errors.date.message}</span>}
                    </p>

                    <p>
                        <div className="form-text">
                            Damage Name:
                        </div>

                        <input type="text" maxLength="20" {...register("damageName", { required: "Please enter the type of damage.", maxLength: { value: 20, message: "Too many characters." } })} />

                        {errors.damageName && <span role="form-error">{errors.damageName.message}</span>}
                    </p>

                    <p>
                        <div className="form-text">
                            Damage Comments (Optional):
                        </div>

                        <textarea {...register("comments")}></textarea>
                    </p>

                    <p>
                        <div className="form-text">
                            Pick an icon:
                        </div>

                        {icons}

                        {errors.iconPick && <span role="form-error">{errors.iconPick.message}</span>}
                    </p>

                    <input type="submit" value="Add" />
                    <button onClick={cancelForm}>Cancel</button>
                </form>
            </div>
        </div>
    );
}

export default DamageForm;