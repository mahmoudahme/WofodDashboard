import React, { useState, useEffect } from "react";
import { FaTrash, FaUserTie, FaCity, FaEnvelope, FaPhone, FaLanguage, FaIdCard } from "react-icons/fa";
import axios from "axios";
import "./Applications.css";
const Applications = () => {
    const [applications, setApplications] = useState([]);
        const token = window.localStorage.getItem("accessToken");

    // Sample data for demonstration since we can't use localStorage or make actual API calls
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

    useEffect(() => {
        fetchData();
    }, []);

    const handleDelete = (id) => {
        if (!window.confirm("هل أنت متأكد من حذف هذا المتقدم؟")) return;
        setApplications(applications.filter((applicant) => applicant._id !== id));
    };

    return (
        <div className="employee-dashboard">
            <div className="dashboard-header">
                <FaIdCard className="header-icon" />
                <h2>بطاقات هوية المتقدمين علي الوظائف</h2>
                <div className="header-decoration"></div>
            </div>

            {applications.length > 0 ? (
                <div className="id-cards-grid">
                    {applications.map((applicant) => (
                        <div key={applicant._id} className="employee-id-card">
                            <div className="card-header">
                                <div className="company-logo">
                                    <FaIdCard />
                                </div>
                                <div className="card-number">#{applicant._id.padStart(4, '0')}</div>
                            </div>
                            
                            <div className="employee-photo-container">
                                <img 
                                    src={`http://147.79.101.225:8888/uploads/Applications/${applicant.image}`}
                                    alt={applicant.name} 
                                    className="employee-photo" 
                                />
                                <div className="photo-border"></div>
                            </div>

                            <div className="employee-info">
                                <h3 className="employee-name">{applicant.name}</h3>
                                <div className="job-title">{applicant.job.nameAr}</div>
                                
                                <div className="info-grid">
                                    <div className="info-item">
                                        <FaEnvelope className="info-icon" />
                                        <span>{applicant.email}</span>
                                    </div>
                                    <div className="info-item">
                                        <FaPhone className="info-icon" />
                                        <span>{applicant.phone}</span>
                                    </div>
                                    <div className="info-item">
                                        <FaCity className="info-icon" />
                                        <span>{applicant.city.nameAr}</span>
                                    </div>
                                    <div className="info-item">
                                        <FaLanguage className="info-icon" />
                                        <span>{applicant.language.nameAr}</span>
                                    </div>
                                </div>

                                <div className="employee-details">
                                    <div className="detail-badge age-badge">
                                        العمر: {applicant.age} سنة
                                    </div>
                                    <div className={`detail-badge status-badge status-${applicant.status.nameEn.toLowerCase().replace(' ', '-')}`}>
                                        {applicant.status.nameAr}
                                    </div>
                                </div>
                            </div>

                            <div className="card-footer">
                                <div className="barcode">
                                    <div className="barcode-lines">
                                        {Array.from({length: 12}, (_, i) => (
                                            <div key={i} className={`barcode-line ${i % 3 === 0 ? 'thick' : 'thin'}`}></div>
                                        ))}
                                    </div>
                                    <div className="barcode-number">ID: {applicant._id}2024</div>
                                </div>
                                
                                <button 
                                    className="remove-card-btn" 
                                    onClick={() => handleDelete(applicant._id)}
                                    title="حذف البطاقة"
                                >
                                    <FaTrash />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="empty-state">
                    <FaIdCard className="empty-icon" />
                    <p>لا توجد بطاقات متاحة</p>
                </div>
            )}
        </div>
    );
};

export default Applications;
