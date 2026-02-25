import "./ImageSection.css";
import MyContext from "../MyContext";
import { useContext } from "react";
import { FadeLoader } from "react-spinners";

export default function ImageSection() {
  const { property } = useContext(MyContext);

  // 🔥 SAFE IMAGE EXTRACTION
  const images = Array.isArray(property?.image)
    ? property.image
    : [];

  // 🔥 LOADING STATE (when property not loaded yet)
  if (!property) {
    return (
      <div className="loader-center">
        <FadeLoader height={35} width={4} />
      </div>
    );
  }

  if (images.length === 0) {
    return <p>No images available</p>;
  }

  return (
    <div className="imgDiv">

      {/* BIG IMAGE */}
      <div
        className="bigImage"
        style={{
          backgroundImage: `url(${images[0]?.url})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      ></div>

      {/* SMALL IMAGES */}
      <div className="smallImages">
        {images.slice(1, 4).map((img, index) => (
          <div
            key={index}
            className="s-image"
            style={{
              backgroundImage: `url(${img.url})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          ></div>
        ))}
      </div>

    </div>
  );
}