import React, { useState, useEffect } from "react";
import axios from "axios";
import "./TypeOfWork.css";
import { FaPlane, FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import { FaCity} from "react-icons/fa";

const TypeOfWork = () => {
    const [airlines, setAirline] = useState([]);
    const [formData, setFormData] = useState({ nameAr: "", nameEn: "" });

    const [showConfirm, setShowConfirm] = useState(false);
    const [airlineToDelete, setAirlineToDelete] = useState(null);
    const token = window.localStorage.getItem("accessToken");

    // ** جلب بيانات المطارات **
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("http://147.93.53.128:8888/admin/typeofwork", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setAirline(response.data.TypeOfWorks);
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
                "http://147.93.53.128:8888/admin/typeofwork",
                formData,
                { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
            );

            setAirline([...airlines, response.data.typeOfWork]);
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
            await axios.delete(`http://147.93.53.128:8888/admin/typeofwork/${airlineToDelete}`, {
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
            <h2>انواع العمل المتاحه</h2>
            <div className="airport-list">
                {airlines.map((airline) => (
                    <div key={airline._id} className="airport-card">
                        <div className="airport-info">
                            <strong><Link to={`${airline._id}`}>{airline.nameAr}</Link></strong> - {airline.nameEn}
                        </div>
                        <FaTrash className="delete-icon" onClick={() => handleDeleteClick(airline._id)} />
                    </div>
                ))}
            </div>


            <form onSubmit={handleSubmit} className="airport-form">
                <h2>إضافة نوع عمل جديده </h2>
                <label> : اسم نوع عمل بالعربية </label>
                <input type="text" name="nameAr" value={formData.nameAr} onChange={handleChange} required />

                <label> : اسم نوع عمل بالإنجليزية </label>
                <input type="text" name="nameEn" value={formData.nameEn} onChange={handleChange} required />

                <button type="submit">إضافة نوع عمل </button>
            </form>

            {showConfirm && (
                <div className="confirm-modal">
                    <div className="confirm-box">
                        <p>هل أنت متأكد أنك تريد حذف هذا نوع عمل ؟</p>
                        <button className="confirm-btn" onClick={handleConfirmDelete}>تأكيد</button>
                        <button className="cancel-btn" onClick={() => setShowConfirm(false)}>إلغاء</button>
                    </div>
                </div>
            )}
        </div>

        
    );
};

export default TypeOfWork;
