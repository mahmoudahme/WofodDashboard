import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Cars.css";
import { Link } from "react-router-dom";
import { FaUserTie, FaDashcube, FaUserShield, FaServicestack, FaFly, FaCar } from "react-icons/fa";

const Cars = () => {
    const [cars, setCars] = useState([]);
    const [formData, setFormData] = useState({
        nameAr: "",
        nameEn: "",
        durationAr: "",
        durationEn: "",
        price: "",
        image: null,
    });

    const [showConfirm, setShowConfirm] = useState(false);
    const [carsToDelete, setCarsToDelete] = useState(null);

    const token = window.localStorage.getItem("accessToken");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("http://147.79.101.225:8888/admin/cars", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setCars(response.data.cars);
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
        formDataToSend.append("price", formData.price);
        formDataToSend.append("image", formData.image);

        try {
            const response = await axios.post("http://147.79.101.225:8888/admin/cars", formDataToSend, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            setCars([...cars, response.data.car]);
            setFormData({ nameAr: "", nameEn: "", price: "", image: null });
        } catch (error) {
            console.error(error.message);
        }
    };

    const handleDeleteClick = (carId) => {
        setCarsToDelete(carId);
        setShowConfirm(true);
    };

    const handleConfirmDelete = async () => {
        try {
            await axios.delete(`http://147.79.101.225:8888/admin/cars/${carsToDelete}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setCars(cars.filter(car => car._id !== carsToDelete));
            setShowConfirm(false);
            setCarsToDelete(null);
        } catch (error) {
            console.error("Error deleting service:", error.message);
        }
    };

    return (
        <div className="cars-container">
            <h2>قائمة السيارات</h2>
            <br></br>
            {cars.length > 0 ? (
                <div className="cars-list">
                    {cars.map((car) => (
                        <div className="cars-card" key={car._id}>
                            <img src={`http://147.79.101.225:8888/uploads/Cars/${car.image}`} alt={car.nameEn} className="cars-image" />
                            <Link to={`${car._id}`}><h2>{car.nameAr} - {car.nameEn}</h2></Link>
                            <p>ريال {car.price} </p>
                            <p> {car.durationAr} - {car.durationEn}</p>
                            <button className="delete-btn" onClick={() => handleDeleteClick(car._id)}>حذف</button>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="loading">جاري تحميل الخدمات...</p>
            )}

            <form className="cars-form" onSubmit={handleSubmit}>
                <h2>إضافة خدمة جديدة</h2>
                <input type="text" name="nameAr" placeholder="اسم السياره بالعربية" value={formData.nameAr} onChange={handleChange} required />
                <input type="text" name="nameEn" placeholder="اسم السياره بالإنجليزية" value={formData.nameEn} onChange={handleChange} required />
                <input type="number" name="price" placeholder="سعر السياره" value={formData.price} onChange={handleChange} required />
                <input type="file" name="image" accept="image/*" onChange={handleChange} required />
                <button type="submit">إضافة سياره <FaCar /></button>
            </form>

            {showConfirm && (
                <div className="confirm-modal">
                    <div className="confirm-box">
                        <p>هل أنت متأكد أنك تريد حذف هذه السياره</p>
                        <button className="confirm-btn" onClick={handleConfirmDelete}>تأكيد</button>
                        <button className="cancel-btn" onClick={() => setShowConfirm(false)}>إلغاء</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cars;
