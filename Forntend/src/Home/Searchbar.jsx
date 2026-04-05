import "./Searchbar.css";
import { useEffect, useState, useRef } from "react";

export default function Searchbar({ onSearch }) {
  const [query, setQuery] = useState("");
  const cardRef = useRef();

  // 🔍 API search (same logic)
  useEffect(() => {
    if (!query) return;

    const Timer = setTimeout(async () => {
      const result = await fetch(
        `https://wanderlust-1-s261.onrender.com/api/search?query=${query}`,
        { method: "GET", credentials: "include" }
      );

      const res = await result.json();

      if (result.ok) {
        onSearch(res.results);
      }
    }, 500);

    return () => clearTimeout(Timer);
  }, [query]);

  // 🔥 3D Mouse Move Effect
  const handleMouseMove = (e) => {
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const midX = rect.width / 2;
    const midY = rect.height / 2;

    const rotateX = ((y - midY) / midY) * 8;
    const rotateY = ((x - midX) / midX) * 8;

    cardRef.current.style.transform = `rotateX(${-rotateX}deg) rotateY(${rotateY}deg)`;
  };

  const resetTransform = () => {
    cardRef.current.style.transform = "rotateX(0deg) rotateY(0deg)";
  };

  return (
    <div className="searchbar">
      <div
        className="input-group"
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={resetTransform}
      >
        <span className="input-icon">
          <i className="fa-solid fa-magnifying-glass"></i>
        </span>

        <input
          type="text"
          placeholder="Search place, destination, or location..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="input-field"
        />
      </div>
    </div>
  );
}