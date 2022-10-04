import { useForm, Controller } from "react-hook-form";
import React, { useState, useEffect } from "react";
import Axios from "axios";
import moment from 'moment';
import DateTimePicker from 'react-datetime-picker';

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
        // Insert marker into database
        Axios.post("marker", {
            date: moment(new Date(value)).format("YYYY-MM-DD HH:mm:ss"),
            damageName: e.damageName,
            image: e.iconPick,
            comments: e.comments,
            lat: props.savedCoordinates.lat,
            lng: props.savedCoordinates.lng,
        }).then((response) => {
            console.log(response);
        });

        props.createMarker(moment(new Date(value)).format("YYYY-MM-DD HH:MM:ss"), e.damageName, e.iconPick, props.savedCoordinates.lat, props.savedCoordinates.lng);
        props.setShowDamageForm(false);
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
        <div>
            <form method="POST" onSubmit={handleSubmit(damageSubmit)}>
                Date:
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

                Damage Name: <input type="text" maxLength="20" {...register("damageName", { required: "Please enter the type of damage.", maxLength: { value: 20, message: "Too many characters." } })} />

                {errors.damageName && <span role="form-error">{errors.damageName.message}</span>}

                Damage Comments (Optional): <textarea {...register("comments")}></textarea>

                Icon:

                {icons}

                {errors.iconPick && <span role="form-error">{errors.iconPick.message}</span>}

                <input type="submit" value="Add" />
                <button onClick={cancelForm}>Cancel</button>
            </form>
        </div>
    );
}

export default DamageForm;