import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./ServicesDetails.css";

const ServiceDetails = () => {
    const params = useParams();
    const navigate = useNavigate();
    const [service, setService] = useState({
        nameAr: "",
        nameEn: "",
        descriptionAr: "",
        descriptionEn: "",
        image: null,
        price : 0
    });

    const token = window.localStorage.getItem("accessToken");
    const serviceId = params.id;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://147.93.53.128:8888/admin/services/${serviceId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setService(response.data.service);
            } catch (error) {
                console.error(error.message);
            }
        };
        fetchData();
    }, [serviceId]);

    const handleChange = (e) => {
        if (e.target.name === "image") {
            setService({ ...service, image: e.target.files[0] });
        } else {
            setService({ ...service, [e.target.name]: e.target.value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formDataToSend = new FormData();
        formDataToSend.append("nameAr", service.nameAr);
        formDataToSend.append("nameEn", service.nameEn);
        formDataToSend.append("descriptionAr", service.descriptionAr);
        formDataToSend.append("descriptionEn", service.descriptionEn);
        formDataToSend.append("price", service.price);
        if (service.image instanceof File) {
            formDataToSend.append("image", service.image);
        }

        try {
            await axios.put(`http://147.93.53.128:8888/admin/services/${serviceId}`, formDataToSend, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            toast.success("تم حفظ التعديلات بنجاح!", { position: "top-left", autoClose: 3000 });
            navigate(`/dashboard/services/${serviceId}`);
        } catch (error) {
            console.error(error.message);
            toast.error("حدث خطأ أثناء التحديث!", { position: "top-left", autoClose: 3000 });
        }
    };

    return (
        <div className="service-details-container">
            <ToastContainer />
            <h2>تعديل الخدمة</h2>
            <img src={`http://147.93.53.128:8888/uploads/Services/${service.image}`} alt="Service" className="service-image" />
            <form className="service-form" onSubmit={handleSubmit}>
                <label>اسم الخدمة بالعربية</label>
                <input type="text" name="nameAr" value={service.nameAr} onChange={handleChange} required />

                <label>اسم الخدمة بالإنجليزية</label>
                <input type="text" name="nameEn" value={service.nameEn} onChange={handleChange} required />

                <label>وصف الخدمة بالعربية</label>
                <textarea name="descriptionAr" value={service.descriptionAr} onChange={handleChange} required />

                <label>وصف الخدمة بالإنجليزية</label>
                <textarea name="descriptionEn" value={service.descriptionEn} onChange={handleChange} required />

                <label>سعر الخدمه</label>
                <input type="number" name="price" value={service.price} onChange={handleChange} required />

                <label>صورة الخدمة</label>
                <input type="file" name="image" accept="image/*" onChange={handleChange} />

                <button type="submit">حفظ التعديلات</button>
            </form>
        </div>
    );
};

export default ServiceDetails;
