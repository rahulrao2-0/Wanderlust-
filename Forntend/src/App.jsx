import { Routes, Route } from "react-router-dom";
import Home from "./Home/Home";
import PropertyDetails from "./PropertyDetails/PropertyDetails";
import Login from "./Autherization/Login";
import Signup from "./Autherization/Signup";
import Host from "./Host";
import MainHostDashboard from "./HostDashboard/mainHostDashboard";
import AddListing from "./HostDashboard/AddListing";
import VerifyEmail from "./VerifyEmail";
import Settings from "./HostDashboard/Settings";
function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/property/:id" element={<PropertyDetails />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/host" element={<Host />} />
      <Route path="/host/dashboard" element={<MainHostDashboard />} />
      <Route path="/addListing" element={<AddListing />} />
      <Route path="/verify-email/:token" element={<VerifyEmail/>} />
      <Route path="/settings" element={<Settings/>} />

    </Routes>
  );
}

export default App;
