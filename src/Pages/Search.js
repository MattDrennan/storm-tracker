import { useForm, Controller } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";
import React, { useState } from "react";
import Axios from "axios";
import moment from 'moment';
import DateTimePicker from 'react-datetime-picker';

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
                console.log(response);
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
                }
            }
        });
    };

    return (
        <div>
            <form method="POST" onSubmit={handleSubmit(submitSearch)}>
                Date/Time Start:
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

                Date/Time End:
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

                Code: <input type="text" {...register("code")} />

                Name: <input type="text" {...register("damageName")} />

                Address: <input type="text" {...register("address")} />

                Latitude: <input type="text" {...register("lat")} />

                Longitude: <input type="text" {...register("lng")} />

                <input type="submit" value="Search!" />
            </form>


            {searchResults.map(function (object, i) {
                return <div key={object.id}>
                    {object.text}
                </div>;
            })}
        </div>
    );
}

export default Search;