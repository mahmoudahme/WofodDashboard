import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import "./contact.css";

const Contact = () => {
    const token = window.localStorage.getItem("accessToken");
    const [messages, setMessages] = useState([]);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    useEffect(() => {
        const fetchData = async () => {
            const response = await axios.get("http://147.79.101.225:8888/admin/contact", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setMessages(response.data.Messages);
        };
        fetchData();
    }, []);

    const handleDelete = async (id) => {
        try {
            const response = await axios.delete(`http://147.79.101.225:8888/admin/contact/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setMessages(messages.filter((msg) => msg._id !== id));

            setSnackbarMessage(response.data.Message);
            setOpenSnackbar(true);
        } catch (error) {
            console.log(error);
        }
    };

    console.log(messages)
    return (
        <div className="contact-container">
            <h1 className="contact-title">صفحة تواصل معنا</h1>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.5 }}>
                    <div className="messages-container">
                        {messages.length === 0 ? (
                            <p className="no-messages">لا توجد رسائل بعد.</p>
                        ) : (
                            messages.map((msg, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: 100 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.8, delay: index * 0.2 }}
                                >
                                    <div className="message-box">
                                        <div className="avatar-placeholder">👤</div>
                                        <div className="message-content">
                                            <Link to={`${msg._id}`} className="message-link">
                                                <h5>{msg.UserId.name}</h5>
                                            </Link>
                                        </div>
                                        <p className="message-date">{msg.Date || "تاريخ غير معروف"}</p>
                                        <div className="icons">
                                            {msg.viewed ? (
                                                <Visibility className="icon viewed-icon" />
                                            ) : (
                                                <VisibilityOff className="icon not-viewed-icon" />
                                            )}
                                            <FaTrash className="icon delete-icon" onClick={() => handleDelete(msg._id)} />
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </div>
                </motion.div>
            </motion.div>

            {openSnackbar && <div className="snackbar">{snackbarMessage}</div>}
        </div>
    );
};

export default Contact;
