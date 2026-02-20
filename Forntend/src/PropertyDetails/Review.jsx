import { Rating } from "@mui/material";
import "./Review.css";

export default function ReviewCard({ review }) {
  return (
    <div className="reviewCard">
      <div className="reviewHeader">
        <div className="reviewAvatar">
          {review?.userName?.[0]?.toUpperCase() || "U"}
        </div>

        <div className="reviewUserInfo">
          <p className="reviewUserName">{review?.userName || "Guest"}</p>

          <div className="reviewRating">
            <Rating
              value={review?.rating || 5}
              precision={0.5}
              readOnly
              size="small"
            />
            <span>{review?.rating || 5}.0</span>
          </div>
        </div>
      </div>

      <p className="reviewComment">
        {review?.comment || "No comment provided"}
      </p>

      {review?.date && (
        <div className="reviewFooter">
          <p className="reviewDate">{new Date(review.date).toLocaleDateString()}</p>
          <div className="reviewActions">
            <button className="reviewActionBtn">Helpful</button>
            <button className="reviewActionBtn">Report</button>
          </div>
        </div>
      )}
    </div>
  );
}