import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./userDetails.css"; // ملف CSS لتنسيق الفورم

const UserDetails = () => {
    const params = useParams()
    const token = window.localStorage.getItem("accessToken");
    const navigate = useNavigate();

    const [userData, setUserDataa] = useState({
        name: "",
        phone: "",
        email: ""
    });

    const [isLoading, setIsLoading] = useState(true); // حالة تحميل البيانات

    const userId = params.id;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://147.79.101.225:8888/admin/users/users/${userId}`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                setUserDataa(response.data.user);
                setIsLoading(false);
            } catch (error) {
                console.error("Error fetching data", error);
            }
        };
        fetchData();
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault(); // منع تحميل الصفحة عند إرسال البيانات

        try {
            const response = await axios.put(
                `http://147.79.101.225:8888/admin/users/users/${userId}`,
                userData,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            window.location.reload()
        } catch (error) {
            console.error("Error updating data", error);
        }
    };

    const deleteUser = async (event) => {
        event.preventDefault(); // منع تحميل الصفحة عند إرسال البيانات

        try {
            const response = await axios.delete(
                `http://147.79.101.225:8888/admin/users/users/${userId}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            navigate("/dashboard/users");
        } catch (error) {
            console.error("Error Deleting data", error);
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setUserDataa((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }
    //
    return (
        <div>
            <h1 className="UserDetailsPage">{userData.name}</h1>
            <form onSubmit={handleSubmit} className="formForcustomer">
                <div className="div">
                <label className="labelForUser">اسم المستخدم </label>

                    <input
                        className="inputForUser2"
                        type="text"
                        name="name"
                        value={userData.name}
                        onChange={handleChange}
                    />
                </div>
                <div className="div">
                <label className="labelForUser">البريد الالكتروني</label>

                    <input
                        className="inputForUser2"
                        type="email"
                        name="email"
                        value={userData.email}
                        onChange={handleChange}
                    />

                </div>
                <div className="div">
                <label className="labelForUser">الهاتف</label>

                    <input
                        className="inputForUser2"
                        type="text"
                        name="phone"
                        value={userData.phone}
                        onChange={handleChange}
                    />

                </div>
                <br />
                <br />
                <div className="buttonForm">
                    <button type="submit" className="button" >تعديل البيانات</button>
                </div>
            </form>
            <form onSubmit={deleteUser} className="formForcustomer" >
                <div className="buttonForm">
                    <button type="submit" className="button" id="button">حذف المستخدم</button>
                </div>
            </form>
        </div>

    );
};

export default UserDetails;
