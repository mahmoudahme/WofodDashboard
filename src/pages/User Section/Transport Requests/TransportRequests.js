import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./TransportRequests.css";

const TransportRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = window.localStorage.getItem("accessToken");

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get(
          "http://147.79.101.225:8888/admin/request/transport",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setRequests(response.data.Requests); // تخزين البيانات في الحالة
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
      await axios.delete(`http://147.79.101.225:8888/admin/request/transport/${id}`, {
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
    <div className="travel-requests-wrapper">
      <h1 className="page-title">طلبات النقل</h1>
      <div className="requests-grid">
              {requests.map((request) => (
                <div key={request._id} className="request-item">
                  <button className="remove-btn" onClick={() => handleDelete(request._id)}>
                    ✕
                  </button>
                  <div className="request-info">
                    <h2 className="client-name">{request.firstName} {request.familyName}</h2>
                    <h4 className="client-name" style={{textAlign : "center"}}>{request.position}</h4>
                    <p className="order-number"><strong>رقم الطلب:</strong> {request.ordernumber}</p>
                    <p className="phone-number"><strong>رقم الهاتف:</strong> {request.phone}</p>
                    <p className="service-name"><strong>الخدمة:</strong> {request.serviceId.nameAr}</p>
                    <p className="request-date"><strong>تاريخ الطلب:</strong> {request.dateOfRequest}</p>
                    
                    <div className={`request-status ${request.status.toLowerCase()}`}>
                      {
                        request.status === "pending" ? "قيد المراجعة" :
                          request.status === "active" ? "نشط" :
                            request.status === "ended" ? "منتهي" :
                              "غير معروف"
                      }
                    </div>
                  </div>
                  <button className="view-details-btn">
                    <Link to={`${request._id}`} className="view-link">عرض التفاصيل</Link>
                  </button>
                </div>
              ))}
            </div>
    </div>
  );
};

export default TransportRequests;
