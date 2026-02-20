import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Home.css"

import Navbar from "./Navbar.jsx";
import Searchbar from "./Searchbar.jsx";
import AllListings from "../AllListings/AllListings.jsx";
import Filterbar from "./Filterbar.jsx";

function Home() {

  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = (results) => {
    setSearchResults(results);
  };

  console.log("Search results in Home component:", searchResults);


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
