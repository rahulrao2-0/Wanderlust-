import { Routes, Route } from "react-router-dom";
import Home from "./Home/Home";
import PropertyDetails from "./PropertyDetails/PropertyDetails";
import Login from "./Autherization/Login";
import Signup from "./Autherization/Signup";
import Host from "./Host";
import MainHostDashboard from "./HostDashboard/mainHostDashboard";
import AddListing from "./HostDashboard/AddListing";

import Settings from "./HostDashboard/Settings";
import OTP from "./Autherization/OTP";
import NotFound from "./NotFound";
import AdminDashboard from "./AdminPannel/AdminDashboard";
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
    
      <Route path="/settings" element={<Settings/>} />
      <Route path="/otp" element={<OTP/>} />
      <Route path="*" element={<NotFound />} /> 
      <Route path="/admin" element={<AdminDashboard />} /> 


    </Routes>
  );
}

export default App;
