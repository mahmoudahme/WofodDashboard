import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./ArrivalHallDetails.css";

const ArrivalHallDetails = () => {
    const params = useParams();
    const navigate = useNavigate();
    const [arrivalhall, setArrivalhall] = useState({
        nameAr: "",
        nameEn: "",
    });
    const [formData, setFormData] = useState({
        nameAr: "",
        nameEn: "",
    });

    const token = window.localStorage.getItem("accessToken");
    const arrivalhallId = params.id;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://147.79.101.225:8888/admin/arrivalhall/${arrivalhallId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setArrivalhall(response.data.arrivalHall);
                setFormData({
                    nameAr: response.data.arrivalHall.nameAr,
                    nameEn: response.data.arrivalHall.nameEn,
                });
            } catch (error) {
                console.error(error.message);
            }
        };
        fetchData();
    }, [arrivalhallId]);

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
            await axios.put(`http://147.79.101.225:8888/admin/arrivalhall/${arrivalhallId}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            toast.success("تم تحديث الخط الجوي بنجاح!");
            navigate("/dashboard/arrivalhall"); // إعادة التوجيه إلى صفحة المطارات
        } catch (error) {
            console.error(error.message);
            toast.error("حدث خطأ أثناء التحديث");
        }
    };

    return (
        <div className="airport-details-container">
            <ToastContainer />
            <h2>تعديل صالة الوصول</h2>
            <form onSubmit={handleSubmit} className="airport-form">
                <div className="form-group">
                    <label htmlFor="nameAr">اسم صالة الوصول بالعربية :</label>
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
                    <label htmlFor="nameEn">اسم صالة الوصول بالإنجليزية :</label>
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

export default ArrivalHallDetails;
