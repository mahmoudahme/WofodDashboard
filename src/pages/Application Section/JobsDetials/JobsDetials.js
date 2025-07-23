import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./JobsDetials.css";

const JobsDetials = () => {
    const params = useParams();
    const navigate = useNavigate();
      const [services, setServices] = useState([]);
    
    const [airline, setAirline] = useState({
        nameAr: "",
        nameEn: "",
        serviceId : "",
    });
    const [formData, setFormData] = useState({
        nameAr: "",
        nameEn: "",
        serviceId : "",
    });

    const token = window.localStorage.getItem("accessToken");
    const airlineId = params.id;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://147.93.53.128:8888/admin/job/${airlineId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setAirline(response.data.job);
                setFormData({
                    nameAr: response.data.job.nameAr,
                    nameEn: response.data.job.nameEn,
                    serviceId: response.data.job.serviceId._id,
                });
                
                const response3 = await axios.get("http://147.93.53.128:8888/admin/services", {
                    headers: { Authorization: `Bearer ${token}` },
                  });
                  setServices(response3.data.Services);
            } catch (error) {
                console.error(error.message);
            }
        };
        fetchData();
    }, [airlineId]);

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
            await axios.put(`http://147.93.53.128:8888/admin/job/${airlineId}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            toast.success("تم تحديث الخط الجوي بنجاح!");
            navigate("/dashboard/job"); // إعادة التوجيه إلى صفحة المطارات
        } catch (error) {
            console.error(error.message);
            toast.error("حدث خطأ أثناء التحديث");
        }
    };
console.log(formData)
    return (
        <div className="airport-details-container">
            <ToastContainer />
            <h2>تعديل المدينه </h2>
            <form onSubmit={handleSubmit} className="airport-form">
                <div className="form-group">
                    <label htmlFor="nameAr">اسم الوظيفه   :</label>
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
                    <label htmlFor="nameEn">اسم الوظيفه    :</label>
                    <input
                        type="text"
                        id="nameEn"
                        name="nameEn"
                        value={formData.nameEn}
                        onChange={handleChange}
                        required
                    />
                </div>
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
                <button type="submit" className="save-btn">حفظ التعديلات</button>
            </form>
        </div>
    );
};

export default JobsDetials;
