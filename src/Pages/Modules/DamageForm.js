import { useForm } from "react-hook-form";
import React, { useState, useEffect } from "react";
import Axios from "axios";

function DamageForm(props) {
    const { register, handleSubmit, formState: { errors } } = useForm();

    /**
     * Handle Damage Form Submit
     */
    const damageSubmit = (e) => {
        console.log(e);
        props.createMarker(e.damageName, e.iconPick, props.savedCoordinates.lat, props.savedCoordinates.lng);
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
                            <input type="radio" value={response.data.result[i].file} {...register("iconPick", { required: "Please pick an icon."})} />
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
                Damage Name: <input type="text" maxLength="20" {...register("damageName", { required: "Please enter the type of damage.", maxLength: { value: 20, message: "Too many characters." } })} />

                {errors.damageName && <span role="form-error">{errors.damageName.message}</span>}

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