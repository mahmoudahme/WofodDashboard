import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Bill.css";

const Bill = () => {
    const [bills, setBills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const token = window.localStorage.getItem("accessToken");
    useEffect(() => {
        const fetchBills = async () => {
            try {
                const response = await axios.get("http://147.79.101.225:8888/admin/bill", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setBills(response.data.memberBills); // تحط الداتا في الستيت
                setLoading(false);
            } catch (err) {
                console.error(err);
                setError("حدث خطأ أثناء تحميل الفواتير");
                setLoading(false);
            }
        };

        fetchBills();
    }, []);

    if (loading) {
        return <div>جارٍ التحميل...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="bill-container">
            {bills.map((bill) => (
                <div key={bill._id} className="bill-card">
                    <img 
                        src={`http://147.79.101.225:8888/uploads/Bills/${bill.image}`} 
                        alt="bill" 
                        className="bill-image"
                    />
                    <div className="bill-info">
                        <h3>{bill.memberId.name}</h3>
                        <p>📞 {bill.memberId.phone}</p>
                        <p>📧 {bill.memberId.email}</p>
                        <p>🕒 {new Date(bill.createdAt).toLocaleString()}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Bill;
