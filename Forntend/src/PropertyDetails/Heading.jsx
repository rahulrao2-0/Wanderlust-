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
        <p className="location"><i class="fa-regular fa-heart"></i>{property.location}</p>
      </div>

      <div className="ratingDiv">
        <Rating
          name="read-only"
          value={property.rating || 0}
          readOnly
        />
        <span>{property.rating} / 5</span>
      </div>
    </div>
  );
}
