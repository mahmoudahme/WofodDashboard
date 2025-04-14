import React, { useState, useEffect } from "react";
import axios from "axios";
import "./BookingTrainRequests.css";
import { Link } from "react-router-dom";

const BookingTrainRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = window.localStorage.getItem("accessToken");

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get(
          "http://147.79.101.225:8888/admin/request/train",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setRequests(response.data.Requests);
      } catch (err) {
        setError("حدث خطأ أثناء جلب البيانات");
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [token]);
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://147.79.101.225:8888/admin/request/train/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // تحديث الحالة بعد الحذف لحذف الطلب من الواجهة مباشرةً
      setRequests((prevRequests) => prevRequests.filter((request) => request._id !== id));
    } catch (error) {
      console.error("خطأ أثناء حذف الطلب:", error);
    }
  };

  if (loading) return <p className="loading-text">جاري تحميل البيانات...</p>;
  if (error) return <p className="error-text">{error}</p>;

  return (
    <div className="requests-container">
      <h1 className="Requests_Page">طلبات حجز القطارات</h1>
      {requests.length === 0 ? (
        <p className="no-requests">لا توجد طلبات متاحة</p>
      ) : (
        <div className="requests-list">
          {requests.map((request) => (
            <div key={request._id} className="request-card">
              {/* صورة التذكرة */}
              <button className="delete-button" onClick={() => handleDelete(request._id)}>
                x
              </button>
              <div className="request-details">
                <h3>🚆 {request.serviceId.nameAr}</h3>
                <p><strong>الاسم:</strong> {request.firstName} {request.familyName}</p>
                <p><strong>رقم الهاتف:</strong> {request.phone}</p>
                <p><strong>من:</strong> {request.fromStation.nameAr}</p>
                <p><strong>إلى:</strong> {request.toStation.nameAr}</p>
                <p><strong>تاريخ المغادرة:</strong> {request.leaveDate}</p>
                <p><strong>عدد المسافرين:</strong> {request.numOfMember}</p>
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
      )}
    </div>
  );
};

export default BookingTrainRequests;
