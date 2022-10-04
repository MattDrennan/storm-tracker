import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Axios from "axios";
import Home from "./Pages/Home";
import Search from "./Pages/Search";
import View from "./Pages/View";
import moment from 'moment';

function App() {
  /**
   * Page user is on
   */
  const [page, setPage] = useState("");

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
    <div className="d-flex" id="wrapper">
      <div className="border-end bg-white" id="sidebar-wrapper">
        <div className="sidebar-heading border-bottom bg-light">Storm Damage Map</div>
        <div className="list-group list-group-flush">
          <a className={page == "home" ? 'list-group-item list-group-item-action list-group-item-light p-3 active' : 'list-group-item list-group-item-action list-group-item-light p-3' } href="/">Dashboard</a>
          <a className={page == "search" ? 'list-group-item list-group-item-action list-group-item-light p-3 active' : 'list-group-item list-group-item-action list-group-item-light p-3' } href="/search">Search</a>
        </div>
      </div>
      <div id="page-content-wrapper">
        <nav className="navbar navbar-expand-lg navbar-light bg-light border-bottom">
          <div className="container-fluid">
            <button className="btn btn-primary" id="sidebarToggle">Toggle Menu</button>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
              data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false"
              aria-label="Toggle navigation"><span className="navbar-toggler-icon"></span></button>
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
              <ul className="navbar-nav ms-auto mt-2 mt-lg-0">
                <li className={page == "home" ? 'nav-item active' : 'nav-item' }><a className="nav-link" href="/">Dashboard</a></li>
                <li className={page == "search" ? 'nav-item active' : 'nav-item' }><a className="nav-link" href="/search">Search</a></li>
              </ul>
            </div>
          </div>
        </nav>
        <div className="container-fluid">
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home page={page} setPage={setPage} createMarker={createMarker} markerInfo={markerInfo} markers={markers} setMarkers={setMarkers} Marker={Marker} showDamageForm={showDamageForm} setShowDamageForm={setShowDamageForm} coordinates={coordinates} setCoordinates={setCoordinates} savedCoordinates={savedCoordinates} setSavedCoordinates={setSavedCoordinates} />} />
              <Route path="search" element={<Search page={page} setPage={setPage} createMarker={createMarker} markerInfo={markerInfo} markers={markers} setMarkers={setMarkers} Marker={Marker} showDamageForm={showDamageForm} setShowDamageForm={setShowDamageForm} coordinates={coordinates} setCoordinates={setCoordinates} savedCoordinates={savedCoordinates} setSavedCoordinates={setSavedCoordinates} />} />
              <Route path="view" element={<View page={page} setPage={setPage} />} />
            </Routes>
          </BrowserRouter>
        </div>
      </div>
    </div>
  );
}

export default App;
