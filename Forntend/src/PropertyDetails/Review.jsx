import { Rating } from "@mui/material";
import "./Review.css";

export default function ReviewCard({ review }) {
  console.log("Rendering ReviewCard with review:", review);
  return (
    <>
    <div className="reviewBox">
      {review.map((rev)=>(
      <div className="reviewCard">
      <div className="reviewHeader">
        <div className="reviewAvatar">
          {rev?.user?.name?.[0]?.toUpperCase() || "U"}
        </div>

        <div className="reviewUserInfo">
          <p className="reviewUserName">{rev?.user?.name || "Guest"}</p>

          <div className="reviewRating">
            <Rating
              value={rev?.rating || 5}
              precision={0.5}
              readOnly
              size="small"
            />
            <span>{rev?.rating || 5}.0</span>
          </div>
        </div>
      </div>

      <p className="reviewComment">
        {rev?.comment || "No comment provided"}
      </p>

      {rev?.date && (
        <div className="reviewFooter">
          <p className="reviewDate">{new Date(rev.date).toLocaleDateString()}</p>
          <div className="reviewActions">
            <button className="reviewActionBtn">Helpful</button>
            <button className="reviewActionBtn">Report</button>
          </div>
        </div>
      )}
    </div>
    ))}

    </div>
    </>
  );
}