import { useForm } from "react-hook-form";
import React, { useState, useEffect } from "react";
import Axios from "axios";
import moment from 'moment';
import { useSearchParams } from 'react-router-dom';

function View(props) {
    /**
     * Marker information
     */
    const [markerInfo, setMarkerInfo] = useState(null);

    /**
     * Query URL string
     */

    const [searchParams, setSearchParams] = useSearchParams();

    /**
     * Load marker information
     */
    const loadMarker = (e) => {
        console.log(e);
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
                    </div>);
            }
        });
    };

    /**
       * On page load
      */
    useEffect(() => {
        loadMarker(searchParams.get('id'));
    }, []);

    return (
        <div>
            {markerInfo}
        </div>
    );
}

export default View;