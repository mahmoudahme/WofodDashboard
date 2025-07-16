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
    <div className="travel-requests-wrapper">
      <h1 className="page-title">طلبات استقبال</h1>
      <div className="requests-grid">
        {requests.map((request) => (
          <div key={request._id} className="request-item">
            {/* زر الحذف */}
            <button className="remove-btn" onClick={() => handleDelete(request._id)}>
              x
            </button>
            {
              request.image ? (
                <img
                  src={`http://147.79.101.225:8888/uploads/RequestData/${request.image}`}
                  alt="طلب"
                  className="request-image"
                />
              ) : (
                ""
              )
            }
            
            <div className="request-info">
              <h2 className="client-name">{request.firstName} {request.familyName}</h2>
              {request.position ? (<h4 className="client-name" style={{textAlign : "center"}}>{request.position}</h4>) : null}
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

