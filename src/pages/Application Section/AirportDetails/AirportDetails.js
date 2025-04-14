import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./AirportDetails.css";

const AirportDetails = () => {
    const params = useParams();
    const navigate = useNavigate();
    const [airport, setAirport] = useState({
        nameAr: "",
        nameEn: "",
    });
    const [formData, setFormData] = useState({
        nameAr: "",
        nameEn: "",
    });

    const token = window.localStorage.getItem("accessToken");
    const airportId = params.id;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://147.79.101.225:8888/admin/airport/${airportId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setAirport(response.data.airport);
                setFormData({
                    nameAr: response.data.airport.nameAr,
                    nameEn: response.data.airport.nameEn,
                });
            } catch (error) {
                console.error(error.message);
            }
        };
        fetchData();
    }, [airportId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://147.79.101.225:8888/admin/airport/${airportId}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            toast.success("تم تحديث المطار بنجاح!");
            navigate("/dashboard/airports"); // إعادة التوجيه إلى صفحة المطارات
        } catch (error) {
            console.error(error.message);
            toast.error("حدث خطأ أثناء التحديث");
        }
    };

    return (
        <div className="airport-details-container">
            <ToastContainer />
            <h2>تعديل المطار</h2>
            <form onSubmit={handleSubmit} className="airport-form">
                <div className="form-group">
                    <label htmlFor="nameAr">اسم المطار بالعربية :</label>
                    <input
                        type="text"
                        id="nameAr"
                        name="nameAr"
                        value={formData.nameAr}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="nameEn">اسم المطار بالإنجليزية :</label>
                    <input
                        type="text"
                        id="nameEn"
                        name="nameEn"
                        value={formData.nameEn}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit" className="save-btn">حفظ التعديلات</button>
            </form>
        </div>
    );
};

export default AirportDetails;
