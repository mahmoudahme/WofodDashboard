import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Services.css";
import { Link } from "react-router-dom";

const Services = () => {
    const [services, setServices] = useState([]);
    const [formData, setFormData] = useState({
        nameAr: "",
        nameEn: "",
        descriptionAr: "",
        descriptionEn: "",
        price: "",
        image: null,
    });

    const [showConfirm, setShowConfirm] = useState(false);
    const [serviceToDelete, setServiceToDelete] = useState(null);

    const token = window.localStorage.getItem("accessToken");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("http://147.79.101.225:8888/admin/services", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setServices(response.data.Services);
            } catch (error) {
                console.error(error.message);
            }
        };
        fetchData();
    }, []);

    const handleChange = (e) => {
        if (e.target.name === "image") {
            setFormData({ ...formData, image: e.target.files[0] });
        } else {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formDataToSend = new FormData();
        formDataToSend.append("nameAr", formData.nameAr);
        formDataToSend.append("nameEn", formData.nameEn);
        formDataToSend.append("descriptionAr", formData.descriptionAr);
        formDataToSend.append("descriptionEn", formData.descriptionEn);
        formDataToSend.append("price", formData.price);
        formDataToSend.append("image", formData.image);

        try {
            const response = await axios.post("http://147.79.101.225:8888/admin/services", formDataToSend, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            setServices([...services, response.data.service]);
            setFormData({ nameAr: "", nameEn: "", descriptionAr: "", descriptionEn: "", price: "", image: null });
        } catch (error) {
            console.error(error.message);
        }
    };

    const handleDeleteClick = (serviceId) => {
        setServiceToDelete(serviceId);
        setShowConfirm(true);
    };

    const handleConfirmDelete = async () => {
        try {
            await axios.delete(`http://147.79.101.225:8888/admin/services/${serviceToDelete}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setServices(services.filter(service => service._id !== serviceToDelete));
            setShowConfirm(false);
            setServiceToDelete(null);
        } catch (error) {
            console.error("Error deleting service:", error.message);
        }
    };

    return (
        <div className="services-container">
            <h2>قائمة الخدمات</h2>

            {services.length > 0 ? (
                <div className="services-list">
                    {services.map((service) => (
                        <div className="service-card" key={service._id}>
                            <img src={`http://147.79.101.225:8888/uploads/Services/${service.image}`} alt={service.nameEn} className="service-image" />
                            <Link to={`${service._id}`}><h2>{service.nameAr} - {service.nameEn}</h2></Link>
                            <p>{service.descriptionAr}</p>
                            <p>{service.descriptionEn}</p>
                            <h5>ريال {service.price}</h5>
                            <button className="delete-btn" onClick={() => handleDeleteClick(service._id)}>حذف</button>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="loading">جاري تحميل الخدمات...</p>
            )}

            <form className="service-form" onSubmit={handleSubmit}>
                <h2>إضافة خدمة جديدة</h2>
                <input type="text" name="nameAr" placeholder="اسم الخدمة بالعربية" value={formData.nameAr} onChange={handleChange} required />
                <input type="text" name="nameEn" placeholder="اسم الخدمة بالإنجليزية" value={formData.nameEn} onChange={handleChange} required />
                <textarea name="descriptionAr" placeholder="وصف الخدمة بالعربية" value={formData.descriptionAr} onChange={handleChange} required />
                <textarea name="descriptionEn" placeholder="وصف الخدمة بالإنجليزية" value={formData.descriptionEn} onChange={handleChange} required />
                <input type="number" name="price" placeholder="سعر الخدمه" value={formData.price} onChange={handleChange} required />

                <input type="file" name="image" accept="image/*" onChange={handleChange} required />
                <button type="submit">إضافة الخدمة</button>
            </form>

            {showConfirm && (
                <div className="confirm-modal">
                    <div className="confirm-box">
                        <p>هل أنت متأكد أنك تريد حذف هذه الخدمة؟</p>
                        <button className="confirm-btn" onClick={handleConfirmDelete}>تأكيد</button>
                        <button className="cancel-btn" onClick={() => setShowConfirm(false)}>إلغاء</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Services;
