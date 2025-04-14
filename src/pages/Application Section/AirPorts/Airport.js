import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Airport.css";
import { FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import { FaUserTie , FaDashcube, FaUserShield , FaServicestack, FaFly , FaCar} from "react-icons/fa";

const AirPort = () => {
    const [airports, setAirports] = useState([]);
    const [formData, setFormData] = useState({ nameAr: "", nameEn: "" });

    const [showConfirm, setShowConfirm] = useState(false);
    const [airportToDelete, setAirportToDelete] = useState(null);
    const token = window.localStorage.getItem("accessToken");

    // ** جلب بيانات المطارات **
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("http://147.79.101.225:8888/admin/airport", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setAirports(response.data.airports);
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
                "http://147.79.101.225:8888/admin/airport",
                formData,
                { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
            );

            setAirports([...airports, response.data.airport]);
            setFormData({ nameAr: "", nameEn: "" }); 
        } catch (error) {
            console.error("Error adding airport:", error.message);
        }
    };

    const handleDeleteClick = (id) => {
        setAirportToDelete(id);
        setShowConfirm(true);
    };

    const handleConfirmDelete = async () => {
        try {
            await axios.delete(`http://147.79.101.225:8888/admin/airport/${airportToDelete}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setAirports(airports.filter(airport => airport._id !== airportToDelete));
            setShowConfirm(false);
            setAirportToDelete(null);
        } catch (error) {
            console.error("Error deleting service:", error.message);
        }
    };

    return (
        <div className="airport-container">
            <h2>قائمة المطارات</h2>
            <div className="airport-list">
                {airports.map((airport) => (
                   
                    <div key={airport._id} className="airport-card">
                         <p>{airport._id}</p>
                        <div className="airport-info">
                            <strong><Link to={`${airport._id}`}>{airport.nameAr}</Link></strong> - {airport.nameEn}
                        </div>
                        <FaTrash className="delete-icon" onClick={() => handleDeleteClick(airport._id)} />
                    </div>
                ))}
            </div>


            <form onSubmit={handleSubmit} className="airport-form">
                <h2>إضافة مطار جديد</h2>
                <label> : اسم المطار بالعربية </label>
                <input type="text" name="nameAr" value={formData.nameAr} onChange={handleChange} required />

                <label> : اسم المطار بالإنجليزية </label>
                <input type="text" name="nameEn" value={formData.nameEn} onChange={handleChange} required />

                <button type="submit">إضافة المطار <FaFly /></button>
            </form>

            {showConfirm && (
                <div className="confirm-modal">
                    <div className="confirm-box">
                        <p>هل أنت متأكد أنك تريد حذف هذا المطار ؟</p>
                        <button className="confirm-btn" onClick={handleConfirmDelete}>تأكيد</button>
                        <button className="cancel-btn" onClick={() => setShowConfirm(false)}>إلغاء</button>
                    </div>
                </div>
            )}
        </div>

        
    );
};

export default AirPort;
