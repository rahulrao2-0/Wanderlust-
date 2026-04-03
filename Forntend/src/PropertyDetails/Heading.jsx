import { useContext } from "react";
import "./Heading.css";
import MyContext from "../MyContext.jsx";
import Rating from "@mui/material/Rating";

export default function HeadingBar() {
  const { property } = useContext(MyContext);

  // Guard: property not loaded yet
  if (!property) return null;

  return (
    <div className="headingBar">
      <div
        className="propertyNameDiv"
        style={{ textTransform: "capitalize" }}
      >
        <div className="propertyName">{property.title}</div>
        <p className="location"><i className="fa-regular fa-heart"></i>{property.location}</p>
      </div>

    </div>
  );
}
