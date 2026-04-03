import "./PropertyDetails.css";
import Heading from "./Heading.jsx";
import ImageSection from "./ImageSection.jsx";
import InfoSection from "./InfoSection.jsx";
import Map from "./Map.jsx"
import ReviewCard from "./Review.jsx";
import { useParams } from "react-router-dom";
// MyContext.js
import { createContext, useState, useEffect } from 'react';

import MyContext from "../MyContext.jsx";
export default function PropertyDetails() {
  const [propertyId, setPropertyId] = useState("")
  const { id } = useParams();
  const [property, setProperty] = useState("");
  useEffect(() => {
    fetch(`http://localhost:5000/api/properties/${propertyId}`)
      .then(res => res.json())
      .then(data => setProperty(data));
  }, [propertyId]);


  useEffect(() => {
    setPropertyId(id)
  }, [propertyId]);
  console.log(id)

  const ProviderValues = {
    property, setProperty,
    propertyId, setPropertyId

  }

  return (
    <MyContext.Provider value={ProviderValues}>
      <div className="Container">
        <Heading />
        <ImageSection />
        <InfoSection />
      </div>
    </MyContext.Provider>
  );
}
