import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Axios from "axios";
import Home from "./Pages/Home";
import Search from "./Pages/Search";
import View from "./Pages/View";
import moment from 'moment';

function App() {
  /**
   * Is the user logged in
   */
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  /**
   * Is the user logged in
   */
  const [accountType, setAccountType] = useState(0);

  /**
   * Marker information
   */
  const [markerInfo, setMarkerInfo] = useState(null);

  /**
   * Change coordinates of the map
   */
  const [coordinates, setCoordinates] = useState({
    lat: 28.5361941,
    lng: -81.7153184
  });

  /**
   * Current saved coordinates of the map
   */
  const [savedCoordinates, setSavedCoordinates] = useState({
    lat: 0,
    lng: 0
  });

  /**
   * Marker Click Event
   */
  const clickMarker = (e) => {
    Axios.get("marker", {
      params: {
        id: e,
      }
    }).then((response) => {
      if (response.data.result) {
        setMarkerInfo(
          <div className="content">
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

            <button onClick={() => setMarkerInfo(null)}>Close</button>
          </div>);
      }
    });
  };

  /**
 * Make markers on map
 */
  const Marker = ({ id, text, image }) => <div onClick={() => clickMarker(id)}><img src={"./images/" + image} />{text}</div>;

  /**
   * Show Damage Form
   */
  const [showDamageForm, setShowDamageForm] = useState(false);

  /**
   * Array of markers
   */
  const [markers, setMarkers] = useState([]);

  /**
   * Create marker
   */
  const createMarker = (id, date, text, image, lat, lng) => {
    let object = {
      id: id,
      date: date,
      text: text,
      image: image,
      lat: lat,
      lng: lng,
    };

    // Object into array
    setMarkers(markers => [...markers, object]);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home createMarker={createMarker} markerInfo={markerInfo} markers={markers} setMarkers={setMarkers} Marker={Marker} showDamageForm={showDamageForm} setShowDamageForm={setShowDamageForm} coordinates={coordinates} setCoordinates={setCoordinates} savedCoordinates={savedCoordinates} setSavedCoordinates={setSavedCoordinates} />} />
        <Route path="search" element={<Search createMarker={createMarker} markerInfo={markerInfo} markers={markers} setMarkers={setMarkers} Marker={Marker} showDamageForm={showDamageForm} setShowDamageForm={setShowDamageForm} coordinates={coordinates} setCoordinates={setCoordinates} savedCoordinates={savedCoordinates} setSavedCoordinates={setSavedCoordinates} />} />
        <Route path="view" element={<View />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
