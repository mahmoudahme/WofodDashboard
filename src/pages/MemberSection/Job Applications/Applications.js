import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Applications.css";
import { FaTrash, FaUserTie, FaCity, FaEnvelope, FaPhone, FaLanguage } from "react-icons/fa";

const Applications = () => {
    const [applications, setApplications] = useState([]);
    const token = window.localStorage.getItem("accessToken");

    // استدعاء البيانات من API
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get("http://147.79.101.225:8888/admin/applications", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setApplications(response.data.Requests);
        } catch (error) {
            console.error("خطأ في جلب البيانات:", error.message);
        }
    };

    // دالة حذف المتقدم
    const handleDelete = async (id) => {
        if (!window.confirm("هل أنت متأكد من حذف هذا المتقدم؟")) return;

        try {
            await axios.delete(`http://147.79.101.225:8888/admin/applications/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            // تحديث القائمة بعد الحذف
            setApplications(applications.filter((applicant) => applicant._id !== id));
        } catch (error) {
            console.error("خطأ أثناء الحذف:", error.message);
            alert("فشل في حذف المتقدم، حاول مرة أخرى!");
        }
    };

    return (
        <div className="airport-container">
            <h2>المتقدمين على التوظيف</h2>

            {applications.length > 0 ? (
                <div className="applications-list">
                    {applications.map((applicant) => (
                        <div key={applicant._id} className="applicant-card">
                            <img src={`http://147.79.101.225:8888/uploads/Applications/${applicant.image}`} alt={applicant.name} className="applicant-image" />
                            <h3><FaUserTie /> {applicant.name}</h3>
                            <p><FaEnvelope /> {applicant.email}</p>
                            <p><FaPhone /> {applicant.phone}</p>
                            <p><FaCity /> {applicant.city.nameAr} - {applicant.city.nameEn}</p>
                            <p><FaLanguage /> {applicant.language.nameAr} ({applicant.language.nameEn})</p>
                            <p>الوظيفة: {applicant.job.nameAr} ({applicant.job.nameEn})</p>
                            <p>الحالة: {applicant.status.nameAr} ({applicant.status.nameEn})</p>
                            <p>العمر: {applicant.age} سنة</p>
                            <button className="delete-btn" onClick={() => handleDelete(applicant._id)}>
                                <FaTrash /> حذف
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <p>لا توجد بيانات متاحة</p>
            )}
        </div>
    );
};

export default Applications;
