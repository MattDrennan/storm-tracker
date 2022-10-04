import { useForm, Controller } from "react-hook-form";
import React, { useState, useEffect } from "react";
import Axios from "axios";
import moment from 'moment';
import DateTimePicker from 'react-datetime-picker';
import Map from "./Modules/Map";

function Search(props) {
    const { register, handleSubmit, control, formState: { errors } } = useForm();

    /**
     * Search results
     */
    const [searchResults, setSearchResults] = useState([]);

    /**
     * Datetimepicker start const
     */
    const [value, onChange] = useState(new Date());

    /**
     * Datetimepicker end const
     */
    const [value2, onChange2] = useState(new Date());

    const submitSearch = (e) => {
        setSearchResults([]);
        props.setMarkers([]);

        Axios.get("search", {
            params: {
                dateStart: moment(new Date(value)).format("YYYY-MM-DD HH:mm:ss"),
                dateEnd: moment(new Date(value2)).format("YYYY-MM-DD HH:mm:ss"),
                code: e.code,
                damageName: e.damageName,
                address: e.address,
                lat: e.lat,
                lng: e.lng,
            }
        }).then((response) => {
            if (response.data.result) {
                for (let i = 0; i <= response.data.result.length - 1; i++) {
                    let object = {
                        id: response.data.result[i].id,
                        date: response.data.result[i].date,
                        text: response.data.result[i].damageName,
                        image: response.data.result[i].image,
                        lat: response.data.result[i].lat,
                        lng: response.data.result[i].lng,
                    };

                    setSearchResults(searchResults => [...searchResults, object]);

                    props.createMarker(response.data.result[i].id, response.data.result[i].date, response.data.result[i].damageName, response.data.result[i].image, response.data.result[i].lat, response.data.result[i].lng);
                }
            }
        });
    };

    /**
       * On page load
      */
    useEffect(() => {
        props.setPage("search");
    }, []);

    return (
        <div>
            <div className="space">
            </div>

            <div className="block-content-top">
                <form method="POST" onSubmit={handleSubmit(submitSearch)}>
                    <div className="form-text">
                        Date/Time Start:
                    </div>

                    <Controller
                        control={control}
                        name="dateStart"
                        rules={{ required: "Please enter a date." }}
                        defaultValue={new Date()}
                        render={() => (
                            <DateTimePicker
                                onChange={onChange}
                                value={value}
                            />
                        )}
                    />

                    <div className="form-text">
                        Date/Time End:
                    </div>

                    <Controller
                        control={control}
                        name="dateEnd"
                        rules={{ required: "Please enter a date." }}
                        defaultValue={new Date()}
                        render={() => (
                            <DateTimePicker
                                onChange={onChange2}
                                value={value2}
                            />
                        )}
                    />

                    <div className="paragraph">
                        <div className="form-text">
                            Code:
                        </div>


                        <input type="text" {...register("code")} />
                    </div>

                    <div className="paragraph">
                        <div className="form-text">
                            Name:
                        </div>


                        <input type="text" {...register("damageName")} />
                    </div>

                    <div className="paragraph">
                        <div className="form-text">
                            Address:
                        </div>

                        <input type="text" {...register("address")} />
                    </div>

                    <div className="paragraph">
                        <div className="form-text">
                            Latitude:
                        </div>

                        <input type="text" {...register("lat")} />
                    </div>

                    <div className="paragraph">
                        <div className="form-text">
                            Longitude:
                        </div>

                        <input type="text" {...register("lng")} />
                    </div>

                    <input type="submit" value="Search!" />
                </form>
            </div>

            <Map markers={props.markers} Marker={props.Marker} coordinates={props.coordinates} setCoordinates={props.setCoordinates} savedCoordinates={props.savedCoordinates} setSavedCoordinates={props.setSavedCoordinates} setShowDamageForm={props.setShowDamageForm} />

            <div className="block-content">
                {props.markerInfo}
            </div>

            <div className="block-content">
                <ol>
                    {searchResults.map(function (object, i) {
                        return <li key={object.id}>
                            <a href={"/view?id=" + object.id}>{object.text}</a>
                        </li>;
                    })}
                </ol>
            </div>
        </div>
    );
}

export default Search;