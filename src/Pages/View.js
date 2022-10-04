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
        Axios.get("marker", {
            params: {
                id: e,
            }
        }).then((response) => {
            if (response.data.result) {
                setMarkerInfo(
                    <div className="block-content-no-border">
                        <img src={"./images/" + response.data.result[0].image} />
                        <h4>{response.data.result[0].damageName}</h4>
                        <p>
                            {moment(new Date(response.data.result[0].date)).format("YYYY-MM-DD HH:mm:ss")}
                        </p>

                        <p>
                            {response.data.result[0].comments == undefined ? 'N/A' : response.data.result[0].comments}
                        </p>

                        <p>
                            {response.data.result[0].lat}, {response.data.result[0].lng}
                        </p>

                        <p>
                            {response.data.result[0].address}
                        </p>
                    </div>);
            }
        });
    };

    /**
       * On page load
      */
    useEffect(() => {
        loadMarker(searchParams.get('id'));
        props.setPage("view");
    }, []);

    return (
        <div>
            {markerInfo}
        </div>
    );
}

export default View;