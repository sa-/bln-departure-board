import './App.css';
import axios from 'axios';
import { useState } from 'react';
import DisplayBoard from './DisplayBoard'
import React from 'react';


class LatLong  {
  latitude: number;
  longitude: number;

  constructor(latitude: number, longitude: number) {
    this.latitude = latitude;
    this.longitude = longitude;
  }
}

function App() {
  let location = getLocation();

  return (
    <div className="App">
      <DisplayBoard />
      
    </div>
  );
}

function getLocation() {
  return new LatLong(52.5066846400927, 13.44972267216406)
}

export default App;

