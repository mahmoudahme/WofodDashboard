import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Cars.css";
import { Link } from "react-router-dom";
import { FaCar } from "react-icons/fa";

const Cars = () => {
    const [cars, setCars] = useState([]);
    const [drivers, setDrivers] = useState([]); // السائقين فقط

    const [formData, setFormData] = useState({
        nameAr: "",
        nameEn: "",
        modelOfcar: "",
        image: null,
        plateNumber: "",
        driverName: "" ,
        driverPhone: "" ,

    });

    const [showConfirm, setShowConfirm] = useState(false);
    const [carsToDelete, setCarsToDelete] = useState(null);

    const token = window.localStorage.getItem("accessToken");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const carsResponse = await axios.get("http://147.93.53.128:8888/admin/cars", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setCars(carsResponse.data.cars);

                const membersResponse = await axios.get("http://147.93.53.128:8888/admin/users/members", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                // فقط السائقين من الأعضاء
                const driverMembers = membersResponse.data.Members.filter(
                    (member) =>
                        member.typeOfUser?.nameEn === "driver" ||
                        member.typeOfUser?.nameAr === "سائق"
                );

                setDrivers(driverMembers);

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
        formDataToSend.append("modelOfcar", formData.modelOfcar);
        formDataToSend.append("image", formData.image);
        formDataToSend.append("plateNumber", formData.plateNumber);
        formDataToSend.append("driverName", formData.driverName);
        formDataToSend.append("driverPhone", formData.driverPhone);

        try {
            const response = await axios.post("http://147.93.53.128:8888/admin/cars", formDataToSend, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            setCars([...cars, response.data.car]);
            setFormData({
                nameAr: "",
                nameEn: "",
                modelOfcar: "",
                image: null,
                plateNumber: "",
                driverName: "" ,
                driverPhone : ""
            });
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
            await axios.delete(`http://147.93.53.128:8888/admin/cars/${carsToDelete}`, {
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
            <br />
            {cars.length > 0 ? (
                <div className="cars-list">
                    {cars.map((car) => (
                        <div className="cars-card" key={car._id}>
                            <img
                                src={`http://147.93.53.128:8888/uploads/Cars/${car.image}`}
                                alt={car.nameEn}
                                className="cars-image"
                            />
                            <Link to={`${car._id}`}>
                                <h2>{car.nameAr} - {car.nameEn}</h2>
                            </Link>
                            <p>{car.modelOfcar}</p>
                            <p>{car.plateNumber}</p>
                            <p>{car.driverName}</p>
                            <p>{car.driverPhone}</p>
                            <button className="delete-btn" onClick={() => handleDeleteClick(car._id)}>حذف</button>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="loading">جاري تحميل الخدمات...</p>
            )}

            <br></br>
            <form className="cars-form" onSubmit={handleSubmit}>
                <h2>إضافة سيارة جديدة</h2>
                <input type="text" name="nameAr" placeholder="نوع السياره (اللغه العربيه)" value={formData.nameAr} onChange={handleChange} required />
                <input type="text" name="nameEn" placeholder="نوع السياره (اللغه الانجليزيه)" value={formData.nameEn} onChange={handleChange} required />
                <input type="text" name="modelOfcar" placeholder="الموديل" value={formData.modelOfcar} onChange={handleChange} required />
                <input type="text" name="plateNumber" placeholder="رقم اللوحه" value={formData.plateNumber} onChange={handleChange} required />
                <input type="text" name="driverName" placeholder="اسم السائق" value={formData.driverName} onChange={handleChange} required />
                <input type="text" name="driverPhone" placeholder="رقم هاتف السائق" value={formData.driverPhone} onChange={handleChange} required />

                <input type="file" name="image" accept="image/*" onChange={handleChange} required />

                <button type="submit">إضافة سيارة <FaCar /></button>
            </form>

            {showConfirm && (
                <div className="confirm-modal">
                    <div className="confirm-box">
                        <p>هل أنت متأكد أنك تريد حذف هذه السياره؟</p>
                        <button className="confirm-btn" onClick={handleConfirmDelete}>تأكيد</button>
                        <button className="cancel-btn" onClick={() => setShowConfirm(false)}>إلغاء</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cars;
