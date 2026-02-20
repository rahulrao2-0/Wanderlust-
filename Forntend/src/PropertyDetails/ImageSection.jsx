import "./ImageSection.css";
import MyContext from "../MyContext";
import { useContext, useEffect, useState } from "react";
import {ScaleLoader , FadeLoader} from "react-spinners"

export default function ImageSection() {
  const { property } = useContext(MyContext);
  
  const[loading,setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    setLoading(true)
    // Add a safety check to prevent undefined errors
    if (property && property.image) {
      setImageUrl(property.image);
      setLoading(false)
    } else{
      setLoading(false)
    }
    
  }, [property]);

  // Debug: See the actual structure
//   console.log("Full property:", property);
//   console.log("Image data:", imageUrl);
//   console.log("Type of imageUrl:", typeof imageUrl);

  return (
    <div className="imgDiv">
      <div 
        className="bigImage"
        style={{
          backgroundImage: imageUrl ? `url(${imageUrl.url})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Show loader when loading OR when no image */}
        {(loading || !imageUrl) && (
          <div className="loader-center">
             <FadeLoader height={35} width={4} />
          </div>
        )}
      </div>

      <div className="smallImages">
        <div className="s-image">s1</div>
        <div className="s-image">s2</div>
        <div className="s-image">s3</div>
      </div>
    </div>
  );
}