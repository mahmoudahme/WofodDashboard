import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./BookingHotelsRequestDetails.css"; // ملف CSS للتنسيق

const BookingHotelsRequestDetails = () => {
    const [request, setRequest] = useState(null);
    const [extraData, setExtraData] = useState({
        memberId: "",
        status: "",
    });
    const [requestsList, setRequestsList] = useState([]); // تخزين قائمة الطلبات
    const [loading, setLoading] = useState(true);
    const [membersList, setmembersList] = useState([]);
    const [error, setError] = useState(null);
    const params = useParams();
    const token = window.localStorage.getItem("accessToken");

    const requestId = params.id;

    useEffect(() => {
        const fetchData = async () => {
            try {
                // جلب بيانات الطلب الأساسي
                const response = await axios.get(
                    `http://147.79.101.225:8888/admin/request/hotel/${requestId}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setRequest(response.data.request);
                setRequestsList(response.data.AnotherRequests); // تخزين الطلبات في القائمة
                setLoading(false);

                const response2 = await axios.get("http://147.79.101.225:8888/admin/users/members", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setmembersList(response2.data.Members);
            } catch (error) {
                setError("حدث خطأ أثناء جلب البيانات");
                setLoading(false);
            }
        };
        fetchData();
    }, [requestId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setExtraData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        const updatedFields = {};

        if (extraData.memberId && extraData.memberId !== request.memberId?._id) {
            updatedFields.memberId = extraData.memberId;
        }

        if (extraData.status && extraData.status !== request.status) {
            updatedFields.status = extraData.status;
        }

        if (Object.keys(updatedFields).length === 0) {
            alert("لم يتم تعديل أي بيانات");
            return;
        }

        try {
            await axios.put(
                `http://147.79.101.225:8888/admin/request/hotel/${requestId}`,
                updatedFields,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            await axios.post("http://147.79.101.225:8888/admin/send-notification", { memberId: extraData.memberId },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                })
            alert("تم حفظ التعديلات بنجاح");
        } catch (error) {
            alert("حدث خطأ أثناء الحفظ");
        }
    };

    if (loading) return <p className="loading-text">جاري تحميل البيانات...</p>;
    if (error) return <p className="error-text">{error}</p>;
    console.log(requestsList)
    return (
        <div className="request-container">
            <h1 className="title">تفاصيل طلب المرافقه</h1>

            <div className="request-details">
                {request && (
                    <div className="request-details">
                        <p><strong>الاسم:</strong> {request.firstName} {request.familyName}</p>
                        <p><strong>رقم الهاتف:</strong> {request.phone}</p>
                        <p><strong>الجنسية:</strong> {request.nationality}</p>
                        <p><strong>الفندق:</strong> {request.hotel?.nameAr || "غير متوفر"}</p>
                        <p><strong>الخدمة:</strong> {request.serviceId?.nameAr || "غير متوفر"}</p>
                        <p><strong>وقت الدخول:</strong> {request.enteryDate}</p>
                        <p><strong>وقت المغادرة:</strong> {request.leaveingDate}</p>
                        <p><strong>نوع الغرفه:</strong> {request.typeOfRoom.nameAr}</p>
                        <p><strong>عدد الليالي:</strong> {request.numOfNigths}</p>
                        <p><strong>عدد الأفراد:</strong> {request.numOfMember}</p>
                        <p><strong>حالة الطلب:</strong> {request.status === "pending" ? "قيد الانتظار" : request.status}</p>
                    </div>
                )}
            </div>

            {/* إضافة قائمة منسدلة لتحديث البيانات */}
            <div className="extra-data">
                <h2>تحديث بيانات إضافية</h2>
                <label>اختيار العضو:</label>
                <select name="memberId" value={extraData.memberId} onChange={handleChange}>
                    <option value={request.memberId ? `${request.memberId.name}` : ""} >{request.memberId ? `${request.memberId.name}` : ""}</option>
                    {membersList
                        .filter((member) => member.serviceId === "67bc47087fb0c49df85a6d83")
                        .map((req) => (
                            <option key={req._id} value={req._id}>
                                {req.name} - {req.typeOfUser.nameAr}
                            </option>
                        ))}
                </select>

                <label>تعديل حالة الطلب</label>
                <select name="status" value={extraData.status} onChange={handleChange}>
                    <option value={request.status}>
                        {request.status === "pending"
                            ? "قيد المراجعة"
                            : request.status === "ended"
                                ? "انتهت"
                                : "نشطة"}
                    </option>
                    <option value="pending">قيد المراجعة</option>
                    <option value="active">نشطه</option>
                    <option value="ended">انتهت</option>
                </select>
                <button onClick={handleSave}>حفظ التعديلات</button>
            </div>
        </div>
    );
};

export default BookingHotelsRequestDetails;
