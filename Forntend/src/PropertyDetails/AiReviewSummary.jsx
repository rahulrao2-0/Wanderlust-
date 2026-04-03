// src/components/AiReviewSummary.jsx
import { useState, useContext, useEffect } from "react";
import MyContext from "../MyContext";
import "./AiReviewSummary.css";

const tagColorMap = {
  good:      { bg: "#EAF3DE", color: "#27500A", border: "#C0DD97" },
  excellent: { bg: "#E1F5EE", color: "#085041", border: "#9FE1CB" },
  average:   { bg: "#FAEEDA", color: "#633806", border: "#FAC775" },
  poor:      { bg: "#FCEBEB", color: "#501313", border: "#F7C1C1" },
};

function getTagStyle(value = "") {
  return tagColorMap[value.toLowerCase()] || tagColorMap.average;
}

export default function AiReviewSummary() {
  const [summary, setSummary]   = useState(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(false);
  const { property }            = useContext(MyContext);

  useEffect(() => {
    if (!property?._id) return;

    const fetchData = async () => {
      setLoading(true);
      setError(false);
      try {
        const res = await fetch(
          `https://wanderlust-1-s261.onrender.com/api/ai/ReviewSummary/${property._id}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
          }
        );
        const data = await res.json();
        setSummary(data);
      } catch (err) {
        console.error("AI summary fetch failed:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [property?._id]);

  // ── Loading state ──────────────────────────────────────────
  if (loading) {
    return (
      <div className="ai-summary-card">
        <div className="ai-summary-header">
          <div className="ai-summary-icon">
            <SparkleIcon />
          </div>
          <div>
            <p className="ai-summary-title">AI Review Summary</p>
            <p className="ai-summary-subtitle">Analysing guest reviews…</p>
          </div>
        </div>
        <div className="ai-skeleton">
          <div className="ai-skeleton-line wide" />
          <div className="ai-skeleton-line" />
          <div className="ai-skeleton-line medium" />
        </div>
      </div>
    );
  }

  // ── Error state ────────────────────────────────────────────
  if (error || !summary) {
    return (
      <div className="ai-summary-card">
        <div className="ai-summary-header">
          <div className="ai-summary-icon">
            <SparkleIcon />
          </div>
          <p className="ai-summary-title">AI Review Summary</p>
        </div>
        <p className="ai-error-text">Could not load AI summary. Please try again later.</p>
      </div>
    );
  }

  const { summary: text, positives = [], concerns = [], tags = {} } = summary;

  // ── Main render ────────────────────────────────────────────
  return (
    <div className="ai-summary-card">

      {/* Header */}
      <div className="ai-summary-header">
        <div className="ai-summary-icon">
          <SparkleIcon />
        </div>
        <div>
          <p className="ai-summary-title">AI Review Summary</p>
          <p className="ai-summary-subtitle">Generated from guest reviews</p>
        </div>
      </div>

      {/* Summary text */}
      <div className="ai-summary-text-box">
        <p className="ai-summary-text">{text}</p>
      </div>

      {/* Positives + Concerns */}
      <div className="ai-two-col">

        <div className="ai-positives-box">
          <p className="ai-box-label">Positives</p>
          {positives.length > 0 ? (
            <ul className="ai-list">
              {positives.map((item, i) => (
                <li key={i} className="ai-list-item positive">
                  <span className="ai-check">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          ) : (
            <p className="ai-empty">None noted</p>
          )}
        </div>

        <div className="ai-concerns-box">
          <p className="ai-box-label">Concerns</p>
          {concerns.length > 0 ? (
            <ul className="ai-list">
              {concerns.map((item, i) => (
                <li key={i} className="ai-list-item concern">
                  <span className="ai-dash">–</span>
                  {item}
                </li>
              ))}
            </ul>
          ) : (
            <p className="ai-empty">No concerns noted</p>
          )}
        </div>

      </div>

      {/* Tags */}
      {Object.keys(tags).length > 0 && (
        <div className="ai-tags-grid">
          {Object.entries(tags).map(([key, value]) => {
            const style = getTagStyle(value);
            return (
              <div key={key} className="ai-tag-cell">
                <p className="ai-tag-label">{key}</p>
                <span
                  className="ai-tag-badge"
                  style={{
                    background: style.bg,
                    color:      style.color,
                    border:     `0.5px solid ${style.border}`,
                  }}
                >
                  {value}
                </span>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}

// Small sparkle / AI icon
function SparkleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
      stroke="white" strokeWidth="2.5" strokeLinecap="round">
      <path d="M12 2L2 7l10 5 10-5-10-5z"/>
      <path d="M2 17l10 5 10-5"/>
      <path d="M2 12l10 5 10-5"/>
    </svg>
  );
}