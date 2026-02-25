import "./Searchbar.css"
import { useEffect, useState } from "react";

export default function Searchbar({ onSearch }) {
  const [country, setCountry] = useState("");
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!query) return; // Guard: don't search if query is empty
    const Timer = setTimeout(async () => {

      const result = await fetch(`http://localhost:5000/api/search?query=${query}`, { method: "GET", credentials: "include" })
      const res = await result.json();
      console.log("Search API response:", res.results);
      if (result.status === 404 || res.results.length === 0) {
        console.log("No results found:", res);
      }
      if (result.ok) {
        onSearch(res.results);
      }
    }, 500)
    return () => clearTimeout(Timer);
  }, [query]);


  return (
    <div className="searchbar">

      {/* Search Input */}
      <div className="input-group">
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
