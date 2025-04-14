import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./Request.css"; 

const Services = () => {
  const [services, setServices] = useState([]);
  const [unviewedCountReception, setUnviewedCountReception] = useState(0);
  const [unviewedCountTravel, setUnviewedCountTravel] = useState(0);
  const [unviewedCountComplete, setUnviewedCountComplete] = useState(0);
  const [unviewedCountHotel, setUnviewedCountHotel] = useState(0);
  const [unviewedCountAccompanying, setUnviewedCountAccompanying] = useState(0);
  const [unviewedCountTransport, setUnviewedCountTransport] = useState(0);
  const [unviewedCountTrain, setUnviewedCountTrain] = useState(0);
  const [unviewedCountProgram, setUnviewedCountProgram] = useState(0);
  const token = window.localStorage.getItem("accessToken");

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get("http://147.79.101.225:8888/admin/services", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setServices(response.data.Services);
      } catch (error) {
        console.error("Error fetching services:", error.message);
      }
    };

    const fetchReceptionRequests = async () => {
      try {
        const response = await axios.get("http://147.79.101.225:8888/admin/request/reception", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // حساب عدد الطلبات غير المشاهدة
        const count = response.data.Requests.filter(req => req.viewed === false).length;
        setUnviewedCountReception(count);
      } catch (error) {
        console.error("Error fetching reception requests:", error.message);
      }
    };
    const fetchTransportationRequests = async () => {
      try {
        const response = await axios.get("http://147.79.101.225:8888/admin/request/transport", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // حساب عدد الطلبات غير المشاهدة
        const count = response.data.Requests.filter(req => req.viewed === false).length;
        setUnviewedCountTransport(count);
      } catch (error) {
        console.error("Error fetching reception requests:", error.message);
      }
    };
    const fetchCompleteTravelRequests = async () => {
      try {
        const response = await axios.get("http://147.79.101.225:8888/admin/request/complete", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // حساب عدد الطلبات غير المشاهدة
        const count = response.data.Requests.filter(req => req.viewed === false).length;
        setUnviewedCountComplete(count);
      } catch (error) {
        console.error("Error fetching reception requests:", error.message);
      }
    };
    const fetchAccompanyingRequests = async () => {
      try {
        const response = await axios.get("http://147.79.101.225:8888/admin/request/accompanying", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // حساب عدد الطلبات غير المشاهدة
        const count = response.data.Requests.filter(req => req.viewed === false).length;
        setUnviewedCountAccompanying(count);
      } catch (error) {
        console.error("Error fetching reception requests:", error.message);
      }
    };
    const fetchBookingTravelRequests = async () => {
      try {
        const response = await axios.get("http://147.79.101.225:8888/admin/request/travel", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // حساب عدد الطلبات غير المشاهدة
        const count = response.data.Requests.filter(req => req.viewed === false).length;
        setUnviewedCountTravel(count);
      } catch (error) {
        console.error("Error fetching reception requests:", error.message);
      }
    };
    const fetchBookingHotelsRequests = async () => {
      try {
        const response = await axios.get("http://147.79.101.225:8888/admin/request/hotel", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // حساب عدد الطلبات غير المشاهدة
        const count = response.data.Requests.filter(req => req.viewed === false).length;
        setUnviewedCountHotel(count);
      } catch (error) {
        console.error("Error fetching reception requests:", error.message);
      }
    };
    const fetchBookingTrainsRequests = async () => {
      try {
        const response = await axios.get("http://147.79.101.225:8888/admin/request/train", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // حساب عدد الطلبات غير المشاهدة
        const count = response.data.Requests.filter(req => req.viewed === false).length;
        setUnviewedCountTrain(count);
      } catch (error) {
        console.error("Error fetching reception requests:", error.message);
      }
    };
    const fetchFullProgramRequests = async () => {
      try {
        const response = await axios.get("http://147.79.101.225:8888/admin/request/program", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // حساب عدد الطلبات غير المشاهدة
        const count = response.data.Requests.filter(req => req.viewed === false).length;
        setUnviewedCountProgram(count);
      } catch (error) {
        console.error("Error fetching reception requests:", error.message);
      }
    };


    fetchServices();
    fetchReceptionRequests();
    fetchTransportationRequests();
    fetchCompleteTravelRequests();
    fetchAccompanyingRequests();
    fetchBookingTravelRequests();
    fetchBookingHotelsRequests();
    fetchBookingTrainsRequests();
    fetchFullProgramRequests();
  }, []);

  const serviceRoutes = {
    "Reception": "reception",
    "Distinctive transportation": "transport",
    "Complete travel procedures": "complete",
    "accompanying delegations": "accompanying",
    "Booking Travel": "travel",
    "Booking Hotels": "hotel",
    "Booking Trains": "train",
    "Integrated program": "program",
  };
  return (
    <div className="services-container">
      <h1 className="services-title">طلبات الخدمات المتاحة</h1>
      <div className="services-grid">
        {services.map((service) => (

          <Link
            to={serviceRoutes[service.nameEn] ? `${serviceRoutes[service.nameEn]}` : "#"}
            key={service._id}
            className="service-card"
          >
            <div className="image-container">
              <img
                src={`http://147.79.101.225:8888/uploads/Services/${service.image}`}
                alt={service.nameAr}
                className="service-image"
              />
              {service.nameEn.toLowerCase() === "reception" && unviewedCountReception > 0 && (
                <span className="notification-badge">{unviewedCountReception}</span>
              )}
              {service.nameEn.toLowerCase() === "distinctive transportation" && unviewedCountTransport > 0 && (
                <span className="notification-badge">{unviewedCountTransport}</span>
              )}
              {service.nameEn.toLowerCase() === "complete travel procedures" && unviewedCountComplete > 0 && (
                <span className="notification-badge">{unviewedCountComplete}</span>
              )}
              {service.nameEn.toLowerCase() === "accompanying delegations" && unviewedCountAccompanying > 0 && (
                <span className="notification-badge">{unviewedCountAccompanying}</span>
              )}
              {service.nameEn.toLowerCase() === "booking travel" && unviewedCountTravel > 0 && (
                <span className="notification-badge">{unviewedCountTravel}</span>
              )}
              {service.nameEn.toLowerCase() === "booking hotels" && unviewedCountHotel > 0 && (
                <span className="notification-badge">{unviewedCountHotel}</span>
              )}
              {service.nameEn.toLowerCase() === "booking trains" && unviewedCountTrain > 0 && (
                <span className="notification-badge">{unviewedCountTrain}</span>
              )}
              {service.nameEn.toLowerCase() === "integrated program" && unviewedCountProgram > 0 && (
                <span className="notification-badge">{unviewedCountProgram}</span>
              )}
            </div>
            <h3 className="service-name">طلبات {service.nameAr}</h3>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Services;
