import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./userDetails.css"; // ملف CSS لتنسيق الفورم

const UserDetails = () => {
    const params = useParams()
    const token = window.localStorage.getItem("accessToken");
    const navigate = useNavigate();

    const [userData, setUserDataa] = useState({
        name: "",
        phone: "",
        email: ""
    });

    const [isLoading, setIsLoading] = useState(true); // حالة تحميل البيانات
    const [reportDate, setReportDate] = useState(""); // حالة تاريخ التقرير

    const userId = params.id;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://147.79.101.225:8888/admin/users/users/${userId}`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                setUserDataa(response.data.user);
                setIsLoading(false);
            } catch (error) {
                console.error("Error fetching data", error);
                setIsLoading(false);
            }
        };
        fetchData();
    }, [userId, token]);

    const handleSubmit = async (event) => {
        event.preventDefault(); // منع تحميل الصفحة عند إرسال البيانات

        try {
            const response = await axios.put(
                `http://147.79.101.225:8888/admin/users/users/${userId}`,
                userData,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            alert("تم تعديل البيانات بنجاح");
            window.location.reload()
        } catch (error) {
            console.error("Error updating data", error);
            alert("حدث خطأ أثناء تعديل البيانات");
        }
    };

    const deleteUser = async (event) => {
        event.preventDefault(); // منع تحميل الصفحة عند إرسال البيانات

        const confirmDelete = window.confirm("هل أنت متأكد من حذف هذا المستخدم؟");
        if (!confirmDelete) return;

        try {
            const response = await axios.delete(
                `http://147.79.101.225:8888/admin/users/users/${userId}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            alert("تم حذف المستخدم بنجاح");
            navigate("/dashboard/users");
        } catch (error) {
            console.error("Error Deleting data", error);
            alert("حدث خطأ أثناء حذف المستخدم");
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setUserDataa((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleReportSubmit = async (event) => {
        event.preventDefault();

        if (!reportDate) {
            alert("يرجى اختيار التاريخ");
            return;
        }

        try {
            const response = await axios.post(
                `http://147.79.101.225:8888/admin/report/user/${userId}`,
                { dateOfRequest: reportDate },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            alert("تم إنشاء التقرير بنجاح");
            console.log("Report response:", response.data);
            setReportDate(""); // إعادة تعيين التاريخ بعد النجاح
        } catch (error) {
            console.error("فشل إنشاء التقرير:", error.message);
            alert("حدث خطأ أثناء إنشاء التقرير");
        }
    };

    if (isLoading) {
        return <div className="loading-container">جاري تحميل البيانات...</div>;
    }

    return (
        <div className="user-details-container">
            {/* قسم معلومات المستخدم */}
            <div className="user-info-section">
                <h1 className="page-title">تفاصيل المستخدم: {userData.name}</h1>
                
                {/* فورم تعديل البيانات */}
                <form onSubmit={handleSubmit} className="user-form">
                    <h2 className="form-title">تعديل بيانات المستخدم</h2>
                    
                    <div className="form-group">
                        <label className="form-label">اسم المستخدم</label>
                        <input
                            className="form-input"
                            type="text"
                            name="name"
                            value={userData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    
                    <div className="form-group">
                        <label className="form-label">البريد الإلكتروني</label>
                        <input
                            className="form-input"
                            type="email"
                            name="email"
                            value={userData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    
                    <div className="form-group">
                        <label className="form-label">رقم الهاتف</label>
                        <input
                            className="form-input"
                            type="text"
                            name="phone"
                            value={userData.phone}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    
                    <div className="form-actions">
                        <button type="submit" className="btn btn-primary">
                            تعديل البيانات
                        </button>
                    </div>
                </form>

                {/* فورم حذف المستخدم */}
                <form onSubmit={deleteUser} className="delete-form">
                    <div className="form-actions">
                        <button type="submit" className="btn btn-danger">
                            حذف المستخدم
                        </button>
                    </div>
                </form>
            </div>

            {/* قسم إنشاء التقرير */}
            <div className="report-section">
                <h2 className="section-title">إنشاء تقرير</h2>
                
                <form onSubmit={handleReportSubmit} className="report-form">
                    <div className="form-group">
                        <label className="form-label" htmlFor="date-input">
                            اختر التاريخ:
                        </label>
                        <input
                            id="date-input"
                            className="form-input"
                            type="date"
                            value={reportDate}
                            onChange={(e) => setReportDate(e.target.value)}
                            required
                        />
                    </div>
                    
                    <div className="form-actions">
                        <button type="submit" className="btn btn-success">
                            إنشاء التقرير
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserDetails;