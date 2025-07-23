import React, { useState, useEffect } from "react";
import axios from "axios";
import "./TrainingApplication.css";
import { FaTrash, FaUserTie, FaCity, FaEnvelope, FaPhone, FaLanguage } from "react-icons/fa";

const TrainingApplication = () => {
    const [applications, setApplications] = useState([]);
    const token = window.localStorage.getItem("accessToken");

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get("http://147.93.53.128:8888/admin/traning", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setApplications(response.data.Requests);
        } catch (error) {
            console.error("خطأ في جلب البيانات:", error.message);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("هل أنت متأكد من حذف هذا المتقدم؟")) return;

        try {
            await axios.delete(`http://147.93.53.128:8888/admin/traning/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setApplications(applications.filter((applicant) => applicant._id !== id));
        } catch (error) {
            console.error("خطأ أثناء الحذف:", error.message);
            alert("فشل في حذف المتقدم، حاول مرة أخرى!");
        }
    };

    return (
        <div className="airport-container">
            <h2>المتقدمين على التدريب</h2>

            {applications.length > 0 ? (
                <div className="applications-list">
                    {applications.map((applicant) => (
                        <div key={applicant._id} className="applicant-card">
                            <h3><FaUserTie /> {applicant.name}</h3>
                            <p><FaEnvelope /> {applicant.email}</p>
                            <p><FaPhone /> {applicant.phone}</p>
                            <p><FaCity /> المدينة: {applicant.city.nameAr} _ {applicant.city.nameEn}</p>
                            <p>الحالة: {applicant.status}</p>
                            
                            {applicant.university && <p>الجامعة: {applicant.university}</p>}
                            {applicant.acadmicYear && <p>السنة الأكاديمية: {applicant.acadmicYear}</p>}
                            
                            {applicant.supervisorEmail && <p>📧 إيميل المشرف: {applicant.supervisorEmail}</p>}
                            {applicant.supervisorPhone && <p>📞 هاتف المشرف: {applicant.supervisorPhone}</p>}
                            
                            {applicant.learningQualification && <p>📚 المؤهل العلمي: {applicant.learningQualification}</p>}
                            {applicant.graduationYear && <p>🎓 سنة التخرج: {applicant.graduationYear}</p>}

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

export default TrainingApplication;
