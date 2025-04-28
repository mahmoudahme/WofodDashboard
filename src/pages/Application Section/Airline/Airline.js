import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Airline.css";
import { FaPlane, FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import { FaUserTie , FaDashcube, FaUserShield , FaServicestack, FaFly , FaCar} from "react-icons/fa";

const Airline = () => {
    const [airlines, setAirline] = useState([]);
    const [formData, setFormData] = useState({ nameAr: "", nameEn: "" });

    const [showConfirm, setShowConfirm] = useState(false);
    const [airlineToDelete, setAirlineToDelete] = useState(null);
    const token = window.localStorage.getItem("accessToken");

    // ** جلب بيانات المطارات **
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("http://147.79.101.225:8888/admin/airline", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setAirline(response.data.airlines);
            } catch (error) {
                console.error(error.message);
            }
        };
        fetchData();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                "http://147.79.101.225:8888/admin/airline",
                formData,
                { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
            );

            setAirline([...airlines, response.data.airline]);
            setFormData({ nameAr: "", nameEn: "" }); 
        } catch (error) {
            console.error("Error adding airport:", error.message);
        }
    };

    const handleDeleteClick = (id) => {
        setAirlineToDelete(id);
        setShowConfirm(true);
    };

    const handleConfirmDelete = async () => {
        try {
            await axios.delete(`http://147.79.101.225:8888/admin/airline/${airlineToDelete}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setAirline(airlines.filter(airport => airport._id !== airlineToDelete));
            setShowConfirm(false);
            setAirlineToDelete(null);
        } catch (error) {
            console.error("Error deleting service:", error.message);
        }
    };

    return (
        <div className="airport-container">
            <h2>قائمة شركات الطيران</h2>
            {airlines.length > 0 ?<div className="airport-list">
                {airlines.map((airline) => (
                    <div key={airline._id} className="airport-card">
                        <div className="airport-info">
                            <strong><Link to={`${airline._id}`}>{airline.nameAr}</Link></strong> - {airline.nameEn}
                        </div>
                        <FaTrash className="delete-icon" onClick={() => handleDeleteClick(airline._id)} />
                    </div>
                ))}
            </div> : <p className="loading">جاري تحميل خطوط الطيران...</p>}


            <form onSubmit={handleSubmit} className="airport-form">
                <h2>إضافة شركة طيران جديد</h2>
                <label> : اسم شركة الطيران بالعربية </label>
                <input type="text" name="nameAr" value={formData.nameAr} onChange={handleChange} required />

                <label> : اسم شركة الطيران بالإنجليزية </label>
                <input type="text" name="nameEn" value={formData.nameEn} onChange={handleChange} required />

                <button type="submit">إضافة شركة الطيران <FaPlane /></button>
            </form>

            {showConfirm && (
                <div className="confirm-modal">
                    <div className="confirm-box">
                        <p>هل أنت متأكد أنك تريد حذف هذه شركة الطيران ؟</p>
                        <button className="confirm-btn" onClick={handleConfirmDelete}>تأكيد</button>
                        <button className="cancel-btn" onClick={() => setShowConfirm(false)}>إلغاء</button>
                    </div>
                </div>
            )}
        </div>

        
    );
};

export default Airline;
