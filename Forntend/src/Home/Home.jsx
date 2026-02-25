import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Home.css"

import Navbar from "./Navbar.jsx";
import Searchbar from "./Searchbar.jsx";
import AllListings from "../AllListings/AllListings.jsx";
import Filterbar from "./Filterbar.jsx";
import { useNavigate, useLocation } from "react-router-dom";

function Home() {

  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = (results) => {
    setSearchResults(results);
  };

  console.log("Search results in Home component:", searchResults);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handlePopState = () => {
      if (location.pathname === "/") {
        // Leave site
        window.location.href = "about:blank";
      }
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [location]);


  return (
    <div className="Homediv">
      <Navbar />
      <Searchbar onSearch={handleSearch} />
      <Filterbar />
      <AllListings searchResults={searchResults} />

    </div>
  );
}

export default Home;
