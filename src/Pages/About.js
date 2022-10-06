import { useForm } from "react-hook-form";
import React, { useState, useEffect } from "react";

function About(props) {
    /**
       * On page load
      */
    useEffect(() => {
        props.setPage("about");
    }, []);

    return (
        <div>
            <h3>What is Storm Damage Map?</h3>
            <p>
                Storm Damage Map is a free web app that allows anyone to tag storm damage on a map. This allows first responders to easily locate, track, and handle all storm related incidents.
            </p>

            <p>
                Code words can be added to tagged damage to filter results and prevent unwanted results in searches. For example, a public saftey agency can use the code word "hurricane2022" and advise all its members to use it when tagging data. When incident command uses the search tool, they will add this code word in the search, and it will only show damage that used this code word.
            </p>

            <h3>Who can use Storm Damage Map?</h3>
            <p>
                Storm Damage Map is open for anyone to use and does not need an account to be used; allowing for ease of use on a large scale.
            </p>

            <h3>How to use Storm Damage Map?</h3>
            <p>
                To add storm damage to the map, simply navigate to the dashboard. You will see a map. Press on the map and a red flag will display where you pressed on the map. Above the map, you will see a form to input information about the damage. Once you complete the form, press "Add". The damage will now display on the map.
            </p>

            <p>
                To search storm damage, navigate to the search page. On the search page, fill in the form to narrow your search results. Not all fields need to be completed to search data.
            </p>

            <h3>Questions? Suggestions? Need Support?</h3>
            <p>
                Please e-mail us at: <a href="mailto: support@drennansoftware.com">support@drennansoftware.com</a>
            </p>
        </div>
    );
}

export default About;