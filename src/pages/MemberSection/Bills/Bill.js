import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Bill.css";

const Bill = () => {
    const [bills, setBills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [deleteLoading, setDeleteLoading] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [billToDelete, setBillToDelete] = useState(null);
    
    const token = window.localStorage.getItem("accessToken");
    
    useEffect(() => {
        fetchBills();
    }, []);

    const fetchBills = async () => {
        try {
            setLoading(true);
            const response = await axios.get("http://147.79.101.225:8888/admin/bill", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setBills(response.data.memberBills);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setError("حدث خطأ أثناء تحميل الفواتير");
            setLoading(false);
        }
    };

    const handleDeleteClick = (bill) => {
        setBillToDelete(bill);
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = async () => {
        if (!billToDelete) return;
        
        try {
            setDeleteLoading(billToDelete._id);
            
            // استبدل هذا الـ URL بالـ API endpoint الصحيح للحذف
            await axios.delete(`http://147.79.101.225:8888/admin/bill/${billToDelete._id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            
            setBills(bills.filter(bill => bill._id !== billToDelete._id));
            setShowDeleteModal(false);
            setBillToDelete(null);
            setDeleteLoading(null);
            
        } catch (err) {
            console.error(err);
            setError("حدث خطأ أثناء حذف الفاتورة");
            setDeleteLoading(null);
        }
    };

    const handleDeleteCancel = () => {
        setShowDeleteModal(false);
        setBillToDelete(null);
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>جارٍ التحميل...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
                <div className="error-message">
                    <span className="error-icon">⚠️</span>
                    <p>{error}</p>
                    <button onClick={fetchBills} className="retry-btn">
                        إعادة المحاولة
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bill-page">
            <div className="page-header">
                <h1>إدارة الفواتير</h1>
                <p>عدد الفواتير: {bills.length}</p>
            </div>

            <div className="bill-container">
                {bills.map((bill) => (
                    <div key={bill._id} className="bill-card">
                        <div className="bill-image-container">
                            <img 
                                src={`http://147.79.101.225:8888/uploads/Bills/${bill.image}`} 
                                alt="bill" 
                                className="bill-image"
                                onError={(e) => {
                                    e.target.src = '/placeholder-bill.jpg'; // صورة بديلة
                                }}
                            />
                            <div className="bill-overlay">
                                <button 
                                    onClick={() => handleDeleteClick(bill)}
                                    className="delete-btn"
                                    disabled={deleteLoading === bill._id}
                                >
                                    {deleteLoading === bill._id ? (
                                        <span className="loading-spinner"></span>
                                    ) : (
                                        <>
                                            <span className="delete-icon">🗑️</span>
                                            حذف
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                        
                        <div className="bill-info">
                            <div className="member-info">
                                <h3 className="member-name">
                                    {bill.memberId ? bill.memberId.name : "عضو محذوف"}
                                </h3>
                                <div className="contact-info">
                                    <p className="phone">
                                        <span className="icon">📞</span>
                                        {bill.memberId ? bill.memberId.phone : "غير متاح"}
                                    </p>
                                    <p className="email">
                                        <span className="icon">📧</span>
                                        {bill.memberId ? bill.memberId.email : "غير متاح"}
                                    </p>
                                </div>
                            </div>
                            
                            <div className="bill-date">
                                <span className="icon">🕒</span>
                                <span className="date-text">
                                    {new Date(bill.createdAt).toLocaleDateString('ar-EG', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {bills.length === 0 && !loading && (
                <div className="empty-state">
                    <div className="empty-icon">📄</div>
                    <h3>لا توجد فواتير</h3>
                    <p>لم يتم العثور على أي فواتير في النظام</p>
                </div>
            )}

            {/* Modal للتأكيد على الحذف */}
            {showDeleteModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>تأكيد الحذف</h3>
                        </div>
                        <div className="modal-body">
                            <p>هل أنت متأكد من حذف فاتورة العضو:</p>
                            <strong>{billToDelete?.memberId?.name || "عضو محذوف"}</strong>
                            <p className="warning-text">هذا الإجراء لا يمكن التراجع عنه!</p>
                        </div>
                        <div className="modal-footer">
                            <button 
                                onClick={handleDeleteCancel}
                                className="cancel-btn"
                            >
                                إلغاء
                            </button>
                            <button 
                                onClick={handleDeleteConfirm}
                                className="confirm-delete-btn"
                                disabled={deleteLoading}
                            >
                                {deleteLoading ? "جارٍ الحذف..." : "تأكيد الحذف"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Bill;