import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";

const Home = lazy(() => import("./Home/Home"));
const PropertyDetails = lazy(() => import("./PropertyDetails/PropertyDetails"));
const Login = lazy(() => import("./Autherization/Login"));
const Signup = lazy(() => import("./Autherization/Signup"));
const Host = lazy(() => import("./Host"));
const MainHostDashboard = lazy(() => import("./HostDashboard/MainHostDashboard"));
const AddListing = lazy(() => import("./HostDashboard/AddListing"));
const Settings = lazy(() => import("./HostDashboard/Settings"));
const OTP = lazy(() => import("./Autherization/OTP"));
const NotFound = lazy(() => import("./NotFound"));
const AdminDashboard = lazy(() => import("./AdminPannel/AdminDashboard"));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/property/:id" element={<PropertyDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/host" element={<Host />} />
        <Route path="/host/dashboard" element={<MainHostDashboard />} />
        <Route path="/addListing" element={<AddListing />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/otp" element={<OTP />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

export default App;