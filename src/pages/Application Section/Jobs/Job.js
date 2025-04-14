import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Job.css";
import { FaPlane, FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import { FaCity } from "react-icons/fa";

const Jobs = () => {
    const [airlines, setAirline] = useState([]);
    const [formData, setFormData] = useState({ nameAr: "", nameEn: "" , serviceId: "" });
  const [services, setServices] = useState([]);
    const [showConfirm, setShowConfirm] = useState(false);
    const [airlineToDelete, setAirlineToDelete] = useState(null);
    const token = window.localStorage.getItem("accessToken");

    // ** جلب بيانات المطارات **
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("http://147.79.101.225:8888/admin/job", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setAirline(response.data.jobs);
                const response3 = await axios.get("http://147.79.101.225:8888/admin/services", {
                    headers: { Authorization: `Bearer ${token}` },
                  });
                  setServices(response3.data.Services);
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
                "http://147.79.101.225:8888/admin/job",
                formData,
                { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
            );

            setAirline([...airlines, response.data.job]);
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
            await axios.delete(`http://147.79.101.225:8888/admin/job/${airlineToDelete}`, {
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
            <h2>قائمة الوظائف</h2>
            <div className="airport-list">
                {airlines.map((airline) => (
                    <div key={airline._id} className="airport-card">
                        <div className="airport-info">
                            <strong><Link to={`${airline._id}`}>{airline.nameAr}</Link></strong> - {airline.nameEn} - {airline.serviceId?.nameAr}
                        </div>
                        <FaTrash className="delete-icon" onClick={() => handleDeleteClick(airline._id)} />
                    </div>
                ))}
            </div>


            <form onSubmit={handleSubmit} className="airport-form">
                <h2>إضافة وظيفه جديده </h2>
                <label> : اسم الوظيفه بالعربية </label>
                <input type="text" name="nameAr" value={formData.nameAr} onChange={handleChange} required />

                <label> : اسم الوظيفه بالإنجليزية </label>
                <input type="text" name="nameEn" value={formData.nameEn} onChange={handleChange} required />
                <fieldset>
                    <select
                        name="serviceId"
                        value={formData.serviceId}
                        onChange={handleChange}
                        tabIndex="5"
                        required
                    >
                        {services.map((service) => (
                            <option key={service._id} value={service._id}>
                                {service.nameAr}
                            </option>
                        ))}

                    </select>
                </fieldset>

                <button type="submit">إضافة الوظيفه </button>
            </form>

            {showConfirm && (
                <div className="confirm-modal">
                    <div className="confirm-box">
                        <p>هل أنت متأكد أنك تريد حذف هذه الوظيفه ؟</p>
                        <button className="confirm-btn" onClick={handleConfirmDelete}>تأكيد</button>
                        <button className="cancel-btn" onClick={() => setShowConfirm(false)}>إلغاء</button>
                    </div>
                </div>
            )}
        </div>


    );
};

export default Jobs;
