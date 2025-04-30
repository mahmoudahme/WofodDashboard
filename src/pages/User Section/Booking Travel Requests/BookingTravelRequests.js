import React, { useState, useEffect } from "react";
import axios from "axios";
import "./BookingTravelRequests.css";
import { Link } from "react-router-dom";

const BookingTravelRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = window.localStorage.getItem("accessToken");

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get(
          "http://147.79.101.225:8888/admin/request/travel",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setRequests(response.data.Requests);
        setLoading(false);
      } catch (err) {
        setError("حدث خطأ أثناء جلب البيانات");
        setLoading(false);
      }
    };

    fetchRequests();
  }, [token]);


  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://147.79.101.225:8888/admin/request/travel/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // تحديث الحالة بعد الحذف لحذف الطلب من الواجهة مباشرةً
      setRequests((prevRequests) => prevRequests.filter((request) => request._id !== id));
    } catch (error) {
      console.error("خطأ أثناء حذف الطلب:", error);
    }
  };


  if (loading) return <p>جاري تحميل البيانات......</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="requests-container">
      <h1 className="Requests_Page">طلبات حجز الطيران</h1>
      <div className="requests-list">
        {requests.map((request) => (
          <div key={request._id} className="request-card">
            <button className="delete-button" onClick={() => handleDelete(request._id)}>
              x
            </button>
            <div className="request-details">


              <h2>{request.firstName} {request.familyName}</h2>
              <p><strong>رقم الطلب:</strong> {request.ordernumber}</p>

              <p><strong>رقم الهاتف:</strong> {request.phone}</p>
              <p><strong>الجنسية:</strong> {request.nationality}</p>
              <p><strong>رقم الهوية / الجواز:</strong> {request.IDOrPassportNumber}</p>
              <p><strong>نوع السفر:</strong> {request.typeOfTravel}</p>
              <p><strong>المطار:</strong> {request.airport.nameAr}</p>
              <p><strong>تاريخ المغادرة:</strong> {request.leaveDate}</p>
              {
                request.typeOfTravel == "ذهاب وعودة" | "Round Trip" ? <p><strong>تاريخ العوده:</strong> {request.arravialDate}</p> : ""
              }

              <p><strong>الوجهة التالية:</strong> {request.country} - {request.city}</p>
              <p><strong>عدد الأفراد:</strong> {request.numOfMember}</p>
              <p><strong>الدرجة:</strong> {request.className.nameAr}</p>
              <p><strong>الخدمة:</strong> {request.serviceId.nameAr}</p>
              <p><strong>المستخدم:</strong> {request.userId.name} - {request.userId.phone}</p>
              <p><strong> معاد الخدمه :</strong> {request.dateOfRequest}</p>

              <p className={`status ${request.status.toLowerCase()}`}>
                {
                  request.status === "pending" ? "قيد المراجعة" :
                    request.status === "active" ? "نشط" :
                      request.status === "ended" ? "منتهي" :
                        "غير معروف"
                }
              </p>
            </div>
            <button className="request-link">
              <Link to={`${request._id}`} style={{ color: "white" }}>عرض الطلب</Link>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookingTravelRequests;
