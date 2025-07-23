import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaTrash, FaEye, FaEyeSlash, FaUser } from "react-icons/fa";
import "./contact.css";

const Contact = () => {
    const token = window.localStorage.getItem("accessToken");
    const [messages, setMessages] = useState([]);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [deleteLoading, setDeleteLoading] = useState(null);

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await axios.get("http://147.93.53.128:8888/admin/contact", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setMessages(response.data.Messages || []);
            } catch (error) {
                console.error("Error fetching messages:", error);
                setSnackbarMessage("حدث خطأ في تحميل الرسائل");
                setOpenSnackbar(true);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [token]);

    const handleDelete = async (id) => {
        try {
            setDeleteLoading(id);
            const response = await axios.delete(`http://147.93.53.128:8888/admin/contact/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setMessages(messages.filter((msg) => msg._id !== id));
            setSnackbarMessage(response.data.Message || "تم حذف الرسالة بنجاح");
            setOpenSnackbar(true);
        } catch (error) {
            console.error("Error deleting message:", error);
            setSnackbarMessage("حدث خطأ في حذف الرسالة");
            setOpenSnackbar(true);
        } finally {
            setDeleteLoading(null);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "تاريخ غير معروف";
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('ar-EG', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch (error) {
            return "تاريخ غير صالح";
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                duration: 0.6,
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: 100 },
        visible: {
            opacity: 1,
            x: 0,
            transition: {
                duration: 0.5,
                ease: "easeOut"
            }
        },
        exit: {
            opacity: 0,
            x: -100,
            transition: {
                duration: 0.3
            }
        }
    };

    if (loading) {
        return (
            <div className="contact-container">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="loading-container"
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        minHeight: '50vh',
                        flexDirection: 'column'
                    }}
                >
                    <div className="spinner" style={{
                        width: '40px',
                        height: '40px',
                        border: '3px solid rgba(212, 175, 55, 0.3)',
                        borderTop: '3px solid #D4AF37',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                    }}></div>
                    <p style={{ color: '#D4AF37', marginTop: '20px', fontSize: '1.1rem' }}>
                        جاري تحميل الرسائل...
                    </p>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="contact-container">
            <motion.h1 
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="contact-title"
            >
                صفحة تواصل معنا
            </motion.h1>

            <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="messages-container"
            >
                {messages.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6 }}
                    >
                        <p className="no-messages">لا توجد رسائل بعد.</p>
                    </motion.div>
                ) : (
                    <AnimatePresence>
                        {messages.map((msg) => (
                            <motion.div
                                key={msg._id}
                                variants={itemVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                layout
                                whileHover={{ scale: 1.02 }}
                                className="message-box"
                            >
                                <div className="avatar-placeholder">
                                    <FaUser />
                                </div>
                                <div className="message-content">
                                    <Link to={`${msg._id}`} className="message-link">
                                        <h5>{msg.UserId?.name || "مستخدم غير معروف"}</h5>
                                    </Link>
                                    {msg.subject && (
                                        <p style={{ 
                                            color: '#888', 
                                            fontSize: '0.9rem',
                                            margin: '5px 0 0 0',
                                            fontStyle: 'italic' 
                                        }}>
                                            {msg.subject}
                                        </p>
                                    )}
                                </div>
                                <p className="message-date">{formatDate(msg.Date)}</p>
                                <div className="icons">
                                    <motion.div
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                    >
                                        {msg.viewed ? (
                                            <FaEye className="icon2 viewed-icon2" title="تم القراءة" />
                                        ) : (
                                            <FaEyeSlash className="icon2 not-viewed-icon" title="لم يتم القراءة" />
                                        )}
                                    </motion.div>
                                    <motion.div
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                    >
                                        <FaTrash 
                                            className="icon2 delete-icon2" 
                                            onClick={() => handleDelete(msg._id)}
                                            title="حذف الرسالة"
                                            style={{ 
                                                opacity: deleteLoading === msg._id ? 0.5 : 1,
                                                cursor: deleteLoading === msg._id ? 'not-allowed' : 'pointer'
                                            }}
                                        />
                                    </motion.div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                )}
            </motion.div>

            <AnimatePresence>
                {openSnackbar && (
                    <motion.div
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 100 }}
                        transition={{ duration: 0.3 }}
                        className="snackbar"
                        onClick={handleCloseSnackbar}
                    >
                        {snackbarMessage}
                    </motion.div>
                )}
            </AnimatePresence>

            <style jsx>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default Contact;