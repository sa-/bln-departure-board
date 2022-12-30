import './App.css';
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
  return (
    <div className="App">
      <DisplayBoard />
    </div>
  );
}

export default App;

