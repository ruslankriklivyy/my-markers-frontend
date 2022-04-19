import React from 'react';
import Header from './components/header';
import MapComp from './components/map';
import 'mapbox-gl/dist/mapbox-gl.css';

function App() {
  return (
    <>
      <Header />
      <MapComp />
    </>
  );
}

export default App;
