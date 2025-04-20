import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Sign from "./pages/Sign/Sign";
import Dashboard from "./pages/Dashboard";
import Sidebar from "./components/slidebar";
import Header from "./components/header"
import Admin from "./pages/Admin/Admin"
import Users from "./pages/users/Users"
import Members from "./pages/MemberSection/Members/Members";
import MemberDetails from "./pages/MemberSection/MemberDetails/MemberDetails";
import UserDetails from "./pages/UserDetails/UserDetails"
import Services from "./pages/Application Section/Services/Services"
import ServiceDetails from "./pages/Application Section/servicesDetails/ServiceDetails"
import Airport from "./pages/Application Section/AirPorts/Airport"
import AirportDetails from "./pages/Application Section/AirportDetails/AirportDetails"
import Cars from "./pages/Application Section/Cars/Cars"
import CarDetails from "./pages/Application Section/CarDetails/CarDetails"
import Airline from "./pages/Application Section/Airline/Airline"
import AirlineDetails from "./pages/Application Section/AirlineDetails/AirlineDetails"
import ArrivalHall from "./pages/Application Section/Arrival Hall/ArrivalHall"
import ArrivalHallDetails from "./pages/Application Section/ArrivalHallDetails/ArrivalHallDetails"
import City from "./pages/Application Section/City/City"
import CityDetails from "./pages/Application Section/CityDetails/CityDetails";
import Jobs from "./pages/Application Section/Jobs/Job";
import JobsDetials from "./pages/Application Section/JobsDetials/JobsDetials";
import TypeOfWork from "./pages/Application Section/TypeOfWork/TypeOfWork";
import TypeOfWorkDetails from "./pages/Application Section/TypeOfWorkDetails/TypeOfWorkDetails";
import PlaneClass from "./pages/Application Section/Class/PlaneClass";
import Request from "./pages/User Section/Requests/Request";
import LiveTracking from "./pages/MemberSection/LiveTracking/LiveTracking";

import ReceptionRequestDetails from "./pages/User Section/Reception Requests/ReceptionRequestDetails";
import ReceptionRequestOneDetails from "./pages/User Section/Details/ReceptionRequestDetails/ReceptionRequestDetails";

import CompleteTravelRequests from "./pages/User Section/Complete Travel Request/CompleteTravelRequests";
import CompleteTravelRequestDetails from "./pages/User Section/Details/CompleteTravelRequestDetails/CompleteTravelRequestDetails";

import TransportRequests from "./pages/User Section/Transport Requests/TransportRequests";
import TransportRequestDetails from "./pages/User Section/Details/TransportRequestDetails/TransportRequestDetails";

import AccompanyingRequest from "./pages/User Section/Accompanying Requests/AccompanyingRequest";
import AccompanyingRequestDetails from "./pages/User Section/Details/AccompanyingRequestDetails/AccompanyingRequestDetails";


import BookingTravelRequests from "./pages/User Section/Booking Travel Requests/BookingTravelRequests";
import BookingTravelRequestDetails from "./pages/User Section/Details/BookingTravelRequestDetails/BookingTravelRequestDetails";

import BookingHotelsRequest from "./pages/User Section/Booking Hotels Requests/BookingHotelsRequest";
import BookingHotelsRequestDetails from "./pages/User Section/Details/BookingHotelsRequestDetails/BookingHotelsRequestDetails";

import BookingTrainRequests from "./pages/User Section/Booking Train Requests/BookingTrainRequests";
import BookingTrainRequestDetails from "./pages/User Section/Details/BookingTrainRequestDetails/BookingTrainRequestDetails";

import FullProgramRequest from "./pages/User Section/Full Program Request/FullProgramRequest";
import FullProgramDetails from "./pages/User Section/Details/FullProgramDetails/FullProgramDetails";


import Hotels from "./pages/Application Section/Hotels/Hotels";
import Rooms from "./pages/Application Section/Rooms/Rooms";
import Station from "./pages/Application Section/Stations/Station";
import StationDetails from "./pages/Application Section/StationDetails/StationDetails";
import Contact from "./pages/User Section/ContactUs/Contact";
import ContactUsDetails from "./pages/User Section/ContactUsDetails/ContacatUsDetails";
import Applications from "./pages/MemberSection/Job Applications/Applications";
import TrainingApplication from "./pages/MemberSection/Training Application/TrainingApplication";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("accessToken");
  const userRole = localStorage.getItem("role");

  if (!token) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

const dashboardRoutes = [
  { path: "/", element: <Dashboard />, allowedRoles: ["super_admin", "application", "user_Requests"] },
  { path: "/admins", element: <Admin />, allowedRoles: ["super_admin"] },
  { path: "/users", element: <Users />, allowedRoles:  ["super_admin", "application", "user_Requests"] },
  { path: "/members", element: <Members />, allowedRoles:  ["super_admin", "application", "user_Requests"] },
  { path: "/members/:id", element: <MemberDetails />, allowedRoles:  ["super_admin", "application", "user_Requests"] },
  
  { path: "/users/:id", element: <UserDetails />, allowedRoles:  ["super_admin", "application", "user_Requests"] },
  { path: "/services", element: <Services />, allowedRoles:  ["super_admin", "application", "user_Requests"] },
  { path: "/services/:id", element: <ServiceDetails />, allowedRoles:  ["super_admin", "application", "user_Requests"] },
  { path: "/airports", element: <Airport />, allowedRoles: ["super_admin", "application", "user_Requests"] },
  { path: "/airports/:id", element: <AirportDetails />, allowedRoles:  ["super_admin", "application", "user_Requests"] },
  { path: "/cars", element: <Cars />, allowedRoles:  ["super_admin", "application", "user_Requests"] },
  { path: "/cars/:id", element: <CarDetails />, allowedRoles:  ["super_admin", "application", "user_Requests"] },
  { path: "/airline", element: <Airline />, allowedRoles:  ["super_admin", "application", "user_Requests"] },
  { path: "/airline/:id", element: <AirlineDetails />, allowedRoles:  ["super_admin", "application", "user_Requests"] },
  { path: "/arrivalhall", element: <ArrivalHall />, allowedRoles:  ["super_admin", "application", "user_Requests"] },
  { path: "/arrivalhall/:id", element: <ArrivalHallDetails />, allowedRoles:  ["super_admin", "application", "user_Requests"] },
  { path: "/city", element: <City />, allowedRoles:  ["super_admin", "application", "user_Requests"] },
  { path: "/city/:id", element: <CityDetails />, allowedRoles:  ["super_admin", "application", "user_Requests"] },
  { path: "/job", element: <Jobs />, allowedRoles:  ["super_admin", "application", "user_Requests"] },
  { path: "/job/:id", element: <JobsDetials />, allowedRoles:  ["super_admin", "application", "user_Requests"] },
  { path: "/typeofwork", element: <TypeOfWork />, allowedRoles:  ["super_admin", "application", "user_Requests"] },
  { path: "/typeofwork/:id", element: <TypeOfWorkDetails />, allowedRoles:  ["super_admin", "application", "user_Requests"] },
  { path: "/class", element: <PlaneClass />, allowedRoles:  ["super_admin", "application", "user_Requests"] },
  
  { path: "/requests", element: <Request />, allowedRoles:  ["super_admin", "application", "user_Requests"] },

  { path: "/requests/reception", element: <ReceptionRequestDetails />, allowedRoles:  ["super_admin", "application", "user_Requests"] },
  { path: "/requests/reception/:id", element: <ReceptionRequestOneDetails />, allowedRoles:  ["super_admin", "application", "user_Requests"] },

  
  { path: "/requests/complete", element: <CompleteTravelRequests />, allowedRoles:  ["super_admin", "application", "user_Requests"] },
  { path: "/requests/complete/:id", element: <CompleteTravelRequestDetails />, allowedRoles:  ["super_admin", "application", "user_Requests"] },
  
  { path: "/requests/transport", element: <TransportRequests />, allowedRoles:  ["super_admin", "application", "user_Requests"] },
  { path: "/requests/transport/:id", element: <TransportRequestDetails />, allowedRoles:  ["super_admin", "application", "user_Requests"] },

  { path: "/requests/accompanying", element: <AccompanyingRequest />, allowedRoles:  ["super_admin", "application", "user_Requests"] },
  { path: "/requests/accompanying/:id", element: <AccompanyingRequestDetails />, allowedRoles:  ["super_admin", "application", "user_Requests"] },

  
  { path: "/requests/travel", element: <BookingTravelRequests />, allowedRoles:  ["super_admin", "application", "user_Requests"] },
  { path: "/requests/travel/:id", element: <BookingTravelRequestDetails />, allowedRoles:  ["super_admin", "application", "user_Requests"] },

  
  { path: "/requests/hotel", element: <BookingHotelsRequest />, allowedRoles:  ["super_admin", "application", "user_Requests"] },
  { path: "/requests/hotel/:id", element: <BookingHotelsRequestDetails />, allowedRoles:  ["super_admin", "application", "user_Requests"] },

  { path: "/requests/train", element: <BookingTrainRequests />, allowedRoles:  ["super_admin", "application", "user_Requests"] },
  { path: "/requests/train/:id", element: <BookingTrainRequestDetails />, allowedRoles:  ["super_admin", "application", "user_Requests"] },


  { path: "/requests/program", element: <FullProgramRequest />, allowedRoles:  ["super_admin", "application", "user_Requests"] },
  { path: "/requests/program/:id", element: <FullProgramDetails />, allowedRoles:  ["super_admin", "application", "user_Requests"] },

  
  
  
  { path: "/hotels", element: <Hotels />, allowedRoles:  ["super_admin", "application", "user_Requests"] },
  { path: "/rooms", element: <Rooms />, allowedRoles:  ["super_admin", "application", "user_Requests"] },

  
  { path: "/stations", element: <Station />, allowedRoles:  ["super_admin", "application", "user_Requests"] },
  { path: "/stations/:id", element: <StationDetails />, allowedRoles:  ["super_admin", "application", "user_Requests"] },
  
  { path: "/contact", element: <Contact />, allowedRoles:  ["super_admin", "application", "user_Requests"] },
  { path: "/contact/:id", element: <ContactUsDetails />, allowedRoles:  ["super_admin", "application", "user_Requests"] },
  { path: "/applications", element: <Applications />, allowedRoles:  ["super_admin", "application", "user_Requests"] },
  { path: "/training", element: <TrainingApplication />, allowedRoles:  ["super_admin", "application", "user_Requests"] },
  { path: "/tracking/:id", element: <LiveTracking />, allowedRoles:  ["super_admin", "application", "user_Requests"] },

  
];

export default function App() {
  return (
    <div className="App2">
      <Router>
        <Routes>
          {/* صفحة تسجيل الدخول */}
          <Route path="/" element={<Sign />} />

          {/* لوحة التحكم */}
          <Route
            path="/dashboard/*"
            element={
              <ProtectedRoute allowedRoles={["super_admin", "application", "user_Requests"]}>
                <Header />
                <div style={{ display: "flex" }}>
                  <div style={{ padding: "20px", width: "100%" }}>
                    <Routes>
                      {dashboardRoutes.map((route, index) => (
                        <Route
                          key={index}
                          path={route.path}
                          element={
                            <ProtectedRoute allowedRoles={route.allowedRoles}>
                              {route.element}
                            </ProtectedRoute>
                          }
                        />
                      ))}
                    </Routes>
                  </div>
                  <Sidebar />
                </div>
              </ProtectedRoute>
            }
          />

          {/* صفحة تسجيل الدخول */}
          <Route path="/login" element={<Sign />} />
        </Routes>
      </Router>
    </div>
  );
}