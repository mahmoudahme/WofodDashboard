import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./FullProgramDetails.css"; // ملف CSS للتنسيق

const FullProgramDetails = () => {
    const [request, setRequest] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const params = useParams();
    const token = window.localStorage.getItem("accessToken");

    const requestId = params.id;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(
                    `http://147.93.53.128:8888/admin/request/program/${requestId}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setRequest(response.data.request);
                setLoading(false);
            } catch (error) {
                setError("حدث خطأ أثناء جلب البيانات");
                setLoading(false);
            }
        };
        fetchData();
    }, [requestId]);

    const handleStatusChange = async (newStatus) => {
        try {
            await axios.put(
                `http://147.93.53.128:8888/admin/request/program/${requestId}`,
                { status: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setRequest((prevRequest) => ({ ...prevRequest, status: newStatus }));
        } catch (error) {
            console.error("خطأ أثناء تحديث الحالة:", error);
        }
    };

    if (loading) return <p className="loading-text">جاري تحميل البيانات...</p>;
    if (error) return <p className="error-text">{error}</p>;

    const statusLabels = {
        pending: "قيد المراجعة",
        active: "نشط",
        ended: "منتهي"
    };

    const statusColors = {
        pending: "blue",
        active: "green",
        ended: "red"
    };

    const statusOptions = {
        pending: ["active", "ended"],
        active: ["pending", "ended"],
        ended: ["pending", "active"]
    };

    return (
        <div className="request-container">
            <h1 className="title">تفاصيل البرنامج المتكامل</h1>
            {request && (
                <div className="request-details">
                    <h2>{request.firstName} {request.familyName}</h2>
                    <p><strong>رقم الطلب:</strong> {request.ordernumber}</p>
                    <p><strong>رقم الهاتف:</strong> {request.phone}</p>
                    <p><strong>الجنسية:</strong> {request.nationality}</p>
                    <p><strong>عدد الأفراد:</strong> {request.numOfMember}</p>
                    <p><strong>الخدمة:</strong> {request.serviceId?.nameAr || "غير متاح"}</p>
                    <p><strong>المستخدم:</strong> {request.userId?.name} - {request.userId?.phone}</p>
                    <p><strong>الحالة:</strong> 
                        <span className={`status-label ${statusColors[request.status]}`}>
                            {statusLabels[request.status]}
                        </span>
                    </p>

                    <div className="status-buttons">
                        {statusOptions[request.status].map((status) => (
                            <button
                                key={status}
                                className={`status-btn ${statusColors[status]}`}
                                onClick={() => handleStatusChange(status)}
                            >
                                تعيين كـ "{statusLabels[status]}"
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default FullProgramDetails;
