import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import "./BookingHotelsRequestDetails.css"; // ملف CSS للتنسيق

const BookingHotelsRequestDetails = () => {
    const [request, setRequest] = useState(null);
    const [extraData, setExtraData] = useState({
        nextRequest: "",
        nextRequestModel: "",
        memberId: "",
        status: "",
    });
    const [requestsList, setRequestsList] = useState([]); // تخزين قائمة الطلبات
    const [loading, setLoading] = useState(true);
    const [membersList, setmembersList] = useState([]);
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
                    `http://147.93.53.128:8888/admin/request/hotel/${requestId}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setRequest(response.data.request);
                setRequestsList(response.data.AnotherRequests); // تخزين الطلبات في القائمة
                setLoading(false);

                const response2 = await axios.get("http://147.93.53.128:8888/admin/users/members", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setmembersList(response2.data.Members);
                const response3 = await axios.get(
                    `http://147.93.53.128:8888/admin/request/hotel`,
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
                `http://147.93.53.128:8888/admin/request/hotel/${requestId}`,
                updatedFields,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            await axios.post("http://147.93.53.128:8888/admin/send-notification", { memberId: extraData.memberId },
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
    const handleGenerateReport = async () => {
        try {
            await axios.post(
                `http://147.93.53.128:8888/admin/report/${requestId}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                }
            );

            const updatedRequest = await axios.get(
                `http://147.93.53.128:8888/admin/request/reception/${requestId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setRequest(updatedRequest.data.request);

            alert("تم إنشاء التقرير بنجاح");
        } catch (error) {
            console.log(error)
            alert("حدث خطأ أثناء إنشاء التقرير");
        }
    };
    if (loading) return <p className="loading-text">جاري تحميل البيانات...</p>;
    if (error) return <p className="error-text">{error}</p>;
    console.log(requestsList)
    return (
        <div className="request-container">
            <h1 className="title">تفاصيل حجز الفندق</h1>

            <div className="request-details">
                {request && (
                    <div className="request-details">
                        <p><strong>رقم الطلب:</strong> {request.ordernumber}</p>
                        <p><strong>الاسم:</strong> {request.firstName} {request.familyName}</p>
                        <p><strong>رقم الهاتف:</strong> {request.phone}</p>

                        <p><strong>المنصب:</strong> {request.position}</p>
                        <p><strong>طريقة التواصل المفضلة:</strong> {request.bestContactWay}</p>
                        <p><strong>الجنسية:</strong> {request.nationality}</p>
                        <p><strong>الفندق:</strong> {request.hotel?.nameAr || "غير متوفر"}</p>
                        <p><strong>الخدمة:</strong> {request.serviceId?.nameAr || "غير متوفر"}</p>
                        <p><strong>وقت الدخول:</strong> {request.enteryDate}</p>
                        <p><strong>وقت المغادرة:</strong> {request.leaveingDate}</p>
                        <p><strong>نوع الغرفه:</strong> {request.typeOfRoom.nameAr}</p>
                        <p><strong>عدد الليالي:</strong> {request.numOfNigths}</p>
                        <p><strong>عدد الأفراد:</strong> {request.numOfMember}</p>
                        {request.numOfMember > 1 && request.membersData?.length > 0 && (
                            <div className="members-data-table">
                                <h3 className="members-table-title">بيانات الوفد:</h3>
                                <table>
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>الاسم الأول</th>
                                            <th>اسم العائلة</th>
                                            <th>رقم الهاتف</th>
                                            <th>الوظيفه</th>
                                            <th>الجنسية</th>

                                        </tr>
                                    </thead>
                                    <tbody>
                                        {request.membersData.map((member, index) => (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>{member.firstName}</td>
                                                <td>{member.familyName}</td>
                                                <td>{member.phone || "غير متوفر"}</td>
                                                <td>{member.position || "غير متوفرة"}</td>

                                                <td>{member.nationality || "غير متوفرة"}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        <br></br>
                        <p><strong> معاد الخدمه :</strong> {request.dateOfRequest}</p>

                        <p><strong>حالة الطلب:</strong> {request.status === "pending" ? "قيد الانتظار" : request.status}</p>
                        <Link to={`/dashboard/tracking/${request._id}`}>عرض الخريطه</Link>
                        {request.status == "ended" ? (<div className="report-section">
                            <h2>التقرير</h2>
                            {request.reportName ? (
                                <a
                                    href={`http://147.93.53.128:8888/uploads/reports/${request.reportName}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="report-link"
                                >
                                    عرض التقرير
                                </a>
                            ) : (
                                <button onClick={handleGenerateReport}>إنشاء التقرير</button>
                            )}
                        </div>) : (<div> </div>)}
                    </div>
                )}
            </div>

            <div className="extra-data">
                <h2>تحديث بيانات إضافية</h2>
                <label>اختيار العضو:</label>
                <select name="memberId" value={extraData.memberId} onChange={handleChange}>
                    <option value={request.memberId ? `${request.memberId.name}` : ""} >{request.memberId ? `${request.memberId.name}` : ""}</option>
                    {membersList
                        .filter(member =>
                            member.serviceId === "67bc47087fb0c49df85a6d83" &&
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
