import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./CarDetails.css";

const CarDetails = () => {
    const params = useParams();
    const navigate = useNavigate();
    const [car, setCar] = useState({
        nameAr: "",
        nameEn: "",
        durationAr: "",
        durationEn: "",
        image: null,
        price : 0
    });

    const token = window.localStorage.getItem("accessToken");
    const carId = params.id;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://147.79.101.225:8888/admin/cars/${carId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setCar(response.data.car);
            } catch (error) {
                console.error(error.message);
            }
        };
        fetchData();
    }, [carId]);

    const handleChange = (e) => {
        if (e.target.name === "image") {
            setCar({ ...car, image: e.target.files[0] });
        } else {
            setCar({ ...car, [e.target.name]: e.target.value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formDataToSend = new FormData();
        formDataToSend.append("nameAr", car.nameAr);
        formDataToSend.append("nameEn", car.nameEn);
        formDataToSend.append("durationAr", car.durationAr);
        formDataToSend.append("durationEn", car.durationEn);
        formDataToSend.append("price", car.price);
        if (car.image instanceof File) {
            formDataToSend.append("image", car.image);
        }

        try {
            await axios.put(`http://147.79.101.225:8888/admin/cars/${carId}`, formDataToSend, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            toast.success("تم حفظ التعديلات بنجاح!", { position: "top-left", autoClose: 3000 });
            navigate(`/dashboard/cars/${carId}`);
        } catch (error) {
            console.error(error.message);
            toast.error("حدث خطأ أثناء التحديث!", { position: "top-left", autoClose: 3000 });
        }
    };

    return (
        <div className="service-details-container">
            <ToastContainer />
            <h2>تعديل السياره</h2>
            <img src={`http://147.79.101.225:8888/uploads/Cars/${car.image}`} alt="Car" className="service-image" />
            <form className="service-form" onSubmit={handleSubmit}>
                <label>اسم السياره بالعربية</label>
                <input type="text" name="nameAr" value={car.nameAr} onChange={handleChange} required />

                <label>اسم السياره بالإنجليزية</label>
                <input type="text" name="nameEn" value={car.nameEn} onChange={handleChange} required />

                <label>مدة السياره بالعربية</label>
                <input type="text" name="durationAr" value={car.durationAr} onChange={handleChange} required />

                <label>مدة السياره بالإنجليزية</label>
                <input type="text" name="durationEn" value={car.durationEn} onChange={handleChange} required />

                <label>سعر السياره</label>
                <input type="number" name="price" value={car.price} onChange={handleChange} required />

                <label>صورة السياره</label>
                <input type="file" name="image" accept="image/*" onChange={handleChange} />

                <button type="submit">حفظ التعديلات</button>
            </form>
        </div>
    );
};

export default CarDetails;
