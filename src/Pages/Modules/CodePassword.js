import React, { useState } from "react";
import Axios from "axios";

function CodePassword(props) {
    /**
     * Password const
     */
    const [password, setPassword] = useState("");

    /**
     * Toggle marker complete or not complete
     */
    const toggleMarker = () => {
        Axios.post("togglemarker", {
            id: props.id,
            code: props.code,
            password: password,
        }).then((response) => {
            props.setMarkerInfo(null);
        });
    };

    /**
     * Handle event change
     */
    const handleChange = (e) => {
        setPassword(e.target.value);
    };

    return (
        <div>
            Password: <input type="text" name="password" onChange={handleChange} /> <button onClick={() => toggleMarker()}>{props.text}</button>
        </div>
    );
}

export default CodePassword;