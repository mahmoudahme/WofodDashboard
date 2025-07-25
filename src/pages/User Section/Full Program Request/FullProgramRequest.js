import React, { useState, useEffect } from "react";
import axios from "axios";
import "./FullProgramRequest.css";
import { Link } from "react-router-dom";

const AccompanyingRequest = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = window.localStorage.getItem("accessToken");

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get(
          "http://147.93.53.128:8888/admin/request/program",
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
      await axios.delete(`http://147.93.53.128:8888/admin/request/program/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

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
            <button className="delete-button" onClick={() => handleDelete(request._id)}>
            x
            </button>
            <div className="request-details">
              <h2>{request.firstName} {request.familyName}</h2>
              <p><strong>رقم الطلب:</strong> {request.ordernumber}</p>
              <p><strong>رقم الهاتف:</strong> {request.phone}</p>
              <p><strong>الجنسية:</strong> {request.nationality}</p>
              <p><strong>عدد الأفراد:</strong> {request.numOfMember}</p>
              <p><strong>الخدمة:</strong> {request.serviceId?.nameAr || "غير متاح"}</p>
              <p><strong>المستخدم:</strong> {request.userId?.name} - {request.userId?.phone}</p>
              <p className={`status ${request.status.toLowerCase()}`}>
                {request.status === "pending" ? "قيد الانتظار" : "مكتمل"}
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

export default AccompanyingRequest;
