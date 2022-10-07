import { useForm } from "react-hook-form";
import React, { useState, useEffect } from "react";
import Axios from "axios";

function Codes(props) {
    const { register, handleSubmit, setError, control, formState: { errors } } = useForm();

    /**
     * If form submitted, show different data
     */
    const [formSubmitted, setFormSubmitted] = useState(false);

    /**
     * Checks if a code exists in database and returns error
     */
    const checkCodeExist = (e) => {
        Axios.get("checkcode", {
            params: {
                code: e.code,
            }
        }).then((response) => {
            if (response.data.result) {
                setError('code', { type: 'custom', message: 'Code already taken!' });
            } else {
                codeSubmit(e);
            }
        });
    }

    /**
     * Initiates a check form to check values in server before processing data
     */
    const checkForm = (e) => {
        checkCodeExist(e);
    }

    /**
     * Handle Damage Form Submit
     */
    const codeSubmit = (e) => {
        // Insert code into database
        Axios.post("code", {
            code: e.code,
            password: e.password,
        }).then((response) => {
            setFormSubmitted(true);
        });
    };

    /**
       * On page load
      */
    useEffect(() => {
        props.setPage("codes");
    }, []);

    return (
        <div>
            {!formSubmitted && (
                <form method="POST" onSubmit={handleSubmit(checkForm)}>
                    <div className="paragraph">
                        <div className="form-text">
                            Code:
                        </div>

                        <input type="text" {...register("code", { required: "Please enter a code." })} />

                        {errors.code && <span role="form-error">{errors.code.message}</span>}
                    </div>

                    <div className="paragraph">
                        <div className="form-text">
                            Password:
                        </div>

                        <input type="text" {...register("password", { required: "Please enter a password." })} />

                        {errors.password && <span role="form-error">{errors.password.message}</span>}
                    </div>

                    <input type="submit" value="Register" />
                </form>
            )}

            {formSubmitted && (
                <div>
                    Code registered successfully!
                </div>
            )}
        </div>
    );
}

export default Codes;