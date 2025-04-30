import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ReceptionRequestDetails.css";
import { Link } from "react-router-dom";

const ReceptionRequestDetails = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = window.localStorage.getItem("accessToken");

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get("http://147.79.101.225:8888/admin/request/reception", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRequests(response.data.Requests);
        setLoading(false);
      } catch (err) {
        setError("حدث خطأ أثناء جلب البيانات");
        setLoading(false);
      }
    };

    fetchRequests();
  }, [token]);

  // دالة لحذف الطلب بدون تأكيد
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://147.79.101.225:8888/admin/request/reception/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // تحديث الحالة بعد الحذف لحذف الطلب من الواجهة مباشرةً
      setRequests((prevRequests) => prevRequests.filter((request) => request._id !== id));
    } catch (error) {
      console.error("خطأ أثناء حذف الطلب:", error);
    }
  };

  if (loading) return <p>جاري تحميل البيانات...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="requests-container">
      <h1 className="Requests_Page">جميع الطلبات</h1>
      <div className="requests-list">
        {requests.map((request) => (
          <div key={request._id} className="request-card">
            {/* زر الحذف */}
            <button className="delete-button" onClick={() => handleDelete(request._id)}>
              x
            </button>
            {
              request.image ? <img
              src={`http://147.79.101.225:8888/uploads/RequestData/${request.image}`}
              alt="طلب"
              className="request-image"
            /> : ""
            }
            
            <div className="request-details">
              <h3>{request.firstName} {request.familyName}</h3>
              
              <p><strong>رقم الطلب:</strong> {request.ordernumber}</p>
              <p><strong>رقم الهاتف:</strong> {request.phone}</p>
              <p><strong>مدينة الوصول:</strong> {request.cityOfArrival.nameAr}</p>
              <p><strong>تاريخ الوصول:</strong> {request.arrivalDate}</p>
              <p><strong>وقت الوصول:</strong> {request.arrivalTime}</p>
              <p><strong>شركة الطيران:</strong> {request.airline.nameAr}</p>
              <p><strong>قاعة الوصول:</strong> {request.arrivalHall.nameAr}</p>
              <p><strong>عدد الأفراد:</strong> {request.numOfMember}</p>
              <p><strong> معاد الخدمه :</strong> {request.dateOfRequest}</p>
              <p className={`status ${request.status}`}>
              {
                    request.status === "pending" ? "قيد المراجعة" :
                        request.status === "active" ? "نشط" :
                            request.status === "ended" ? "منتهي" :
                                "غير معروف"
                }
              </p>
            </div>
            <Link to={`${request._id}`} style={{ color: "white" }}>
            <button className="request-link">
             عرض الطلب
            </button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReceptionRequestDetails;
