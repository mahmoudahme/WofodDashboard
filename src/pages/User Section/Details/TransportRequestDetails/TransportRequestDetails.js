import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import "./TransportRequestDetails.css"; // ملف CSS للتنسيق

const TransportRequestDetails = () => {
    const [request, setRequest] = useState(null);
    const [extraData, setExtraData] = useState({
        nextRequest: "",
        nextRequestModel: "",
        memberId: "",
        status: "",
    });
    const [requestsList, setRequestsList] = useState([]); // تخزين قائمة الطلبات
    const [membersList, setmembersList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const params = useParams();
    const token = window.localStorage.getItem("accessToken");
    const [selectedRequest, setSelectedRequest] = useState([]);

    const requestId = params.id;

    useEffect(() => {
        const fetchData = async () => {
            try {
                // جلب بيانات الطلب الأساسي
                const response = await axios.get(
                    `http://147.79.101.225:8888/admin/request/transport/${requestId}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setRequest(response.data.request);
                setRequestsList(response.data.AnotherRequests); // تخزين الطلبات في القائمة
                setLoading(false);
                const response2 = await axios.get("http://147.79.101.225:8888/admin/users/members", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setmembersList(response2.data.Members);
                setLoading(false);
                const response3 = await axios.get(
                    `http://147.79.101.225:8888/admin/request/transport`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setSelectedRequest(response3.data.Requests);
                setLoading(false);
            } catch (error) {
                setError("حدث خطأ أثناء جلب البيانات");
                setLoading(false);
            }
        };
        fetchData();
    }, [requestId]);

    const serviceEnumMap = {
        "حجز الفنادق": "BookingHotels",
        "حجز القطارات": "BookingTrain",
        "حجز الطيران": "BookingTravel",
        "انهاء اجراءات السفر": "CompleteTravelProcedures",
        "الاستقبال": "ReceptionRequests",
        "وسائل نقل": "Transport",
        "مرافقة الوفود": "Accompanying"
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "nextRequest") {
            setExtraData((prev) => {
                const selectedReq = requestsList.find((r) => r.id === value);
                const nextRequestModel = selectedReq
                    ? serviceEnumMap[selectedReq.service.nameAr] || ""
                    : "";

                return {
                    ...prev,
                    nextRequest: value,
                    nextRequestModel,
                };
            });
        } else {
            setExtraData((prev) => ({ ...prev, [name]: value }));
        }
    }

    const handleSave = async () => {
        const updatedFields = {};

        if (extraData.memberId && extraData.memberId !== request.memberId?._id) {
            updatedFields.memberId = extraData.memberId;
        }

        if (extraData.status && extraData.status !== request.status) {
            updatedFields.status = extraData.status;
        }

        if (extraData.nextRequest && extraData.nextRequest !== request.nextRequest) {
            updatedFields.nextRequest = extraData.nextRequest;
            updatedFields.nextRequestModel = extraData.nextRequestModel;
        } else if (!extraData.nextRequest) {
            updatedFields.nextRequest = null;
            updatedFields.nextRequestModel = null;
        }

        if (Object.keys(updatedFields).length === 0) {
            alert("لم يتم تعديل أي بيانات");
            return;
        }

        try {
            await axios.put(
                `http://147.79.101.225:8888/admin/request/transport/${requestId}`,
                updatedFields,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            await axios.post("http://147.79.101.225:8888/admin/send-notification", { memberId: extraData.memberId},
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
    console.log(extraData)
    return (
        <div className="request-container">
            <h1 className="title">تفاصيل طلب النقل</h1>

            <div className="request-details">
                <p><strong>الإسم:</strong> {request.firstName} {request.familyName}</p>
                <p><strong>رقم الطلب:</strong> {request.ordernumber}</p>
                <p><strong>الهاتف:</strong> {request.phone}</p>
                <p><strong>الجنسية:</strong> {request.nationality}</p>
                <p><strong>المدينة:</strong> {request.city?.nameAr}</p>
                <p><strong>من :</strong> {request.from}  ..... <strong>الي :</strong>{request.to} </p>
                <p><strong>عدد الأفراد:</strong> {request.numOfMember}</p>
                <p><strong>السيارة:</strong> {request.carId?.nameAr}</p>
                <p><strong>الخدمة:</strong> {request.serviceId?.nameAr}</p>
                <p><strong>المستخدم:</strong> {request.userId?.name} ({request.userId?.phone})</p>
                <p><strong>الحالة:</strong> {request.status === "pending" ? "قيد المراجعة" : request.status}</p>
                <p><strong>التاريخ:</strong> {new Date(request.createdAt).toLocaleDateString()}</p>
                <Link to={`/dashboard/tracking/${request._id}`}>عرض الخريطه</Link>
            </div>

            {/* إضافة قائمة منسدلة لتحديث البيانات */}
            <div className="extra-data">
                <h2>تحديث بيانات إضافية</h2>
                <label>اختيار العضو:</label>
                <select name="memberId" value={extraData.memberId} onChange={handleChange}>
                    <option value={request.memberId ? `${request.memberId.name}` : ""} >{request.memberId ? `${request.memberId.name}` : ""}</option>
                    {membersList
                        .filter(member =>
                            member.serviceId === "67bc45cb7fb0c49df85a6d71" &&
                            !selectedRequest.some(req => req.memberId?._id === member._id && req.status === "active")
                        )
                        .map(memberer => (
                            <option key={memberer._id} value={memberer._id}>
                                {memberer.name} - {memberer.typeOfUser.nameAr}
                            </option>
                        ))}
                </select>
                {requestsList.length > 0 && (
                    <div className="next-request-container">
                        <label>اختيار الطلب القادم:</label>
                        <select name="nextRequest" value={extraData.nextRequest} onChange={handleChange}>
                            <option value={request.nextRequest ? `${request.nextRequest}` : ""} >{request.nextRequest ? `${request.nextRequest}` : ""}</option>
                            {requestsList.map((req) => (
                                <option key={req.id} value={req.id}>
                                    {req.service?.nameAr}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
                <label>تعديل حالة الطلب</label>
                <select name="status" value={extraData.status} onChange={handleChange}>
                    <option value={request.status}>
                        {
                            request.status === "pending" ? "قيد المراجعة" :
                                request.status === "active" ? "نشط" :
                                    request.status === "ended" ? "منتهي" :
                                        "غير معروف"
                        }
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

export default TransportRequestDetails;
