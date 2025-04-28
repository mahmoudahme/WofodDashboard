import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ArrivalHall.css";
import { FaPlane, FaRoad, FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import { FaUserTie , FaDashcube, FaUserShield , FaServicestack, FaFly , FaCar} from "react-icons/fa";

const ArrivalHall = () => {
    const [arrivalhalls, setArrivalhalls] = useState([]);
    const [formData, setFormData] = useState({ nameAr: "", nameEn: "" });

    const [showConfirm, setShowConfirm] = useState(false);
    const [arrivalhallToDelete, setArrivalhallToDelete] = useState(null);
    const token = window.localStorage.getItem("accessToken");

    // ** جلب بيانات المطارات **
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("http://147.79.101.225:8888/admin/arrivalhall", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setArrivalhalls(response.data.ArrivalHalls);
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
                "http://147.79.101.225:8888/admin/arrivalhall",
                formData,
                { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
            );

            setArrivalhalls([...arrivalhalls, response.data.arrivalHall]);
            setFormData({ nameAr: "", nameEn: "" }); 
        } catch (error) {
            console.error("Error adding airport:", error.message);
        }
    };

    const handleDeleteClick = (id) => {
        setArrivalhallToDelete(id);
        setShowConfirm(true);
    };

    const handleConfirmDelete = async () => {
        try {
            await axios.delete(`http://147.79.101.225:8888/admin/arrivalhall/${arrivalhallToDelete}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setArrivalhalls(arrivalhalls.filter(arrivalHall => arrivalHall._id !== arrivalhallToDelete));
            setShowConfirm(false);
            setArrivalhallToDelete(null);
        } catch (error) {
            console.error("Error deleting service:", error.message);
        }
    };

    return (
        <div className="airport-container">
            <h2>قائمة صالات الوصول </h2>
            <div className="airport-list">
                {arrivalhalls.map((arrivalHall) => (
                    <div key={arrivalHall._id} className="airport-card">

                        <div className="airport-info">
                            <strong><Link to={`${arrivalHall._id}`}>{arrivalHall.nameAr}</Link></strong> - {arrivalHall.nameEn}
                        </div>
                        <FaTrash className="delete-icon" onClick={() => handleDeleteClick(arrivalHall._id)} />
                    </div>
                ))}
            </div>


            <form onSubmit={handleSubmit} className="airport-form">
                <h2>إضافة صالة وصول جديد</h2>
                <label>: اسم صالة الوصول بالعربية</label>
                <input type="text" name="nameAr" value={formData.nameAr} onChange={handleChange} required />

                <label> : اسم صالة الوصول بالإنجليزية</label>
                <input type="text" name="nameEn" value={formData.nameEn} onChange={handleChange} required />

                <button type="submit">إضافة صالة الوصول <FaRoad /></button>
            </form>

            {showConfirm && (
                <div className="confirm-modal">
                    <div className="confirm-box">
                        <p>هل أنت متأكد أنك تريد حذف هذه صالة الوصول ؟</p>
                        <button className="confirm-btn" onClick={handleConfirmDelete}>تأكيد</button>
                        <button className="cancel-btn" onClick={() => setShowConfirm(false)}>إلغاء</button>
                    </div>
                </div>
            )}
        </div>

        
    );
};

export default ArrivalHall;
