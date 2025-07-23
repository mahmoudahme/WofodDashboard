import React, { useState, useEffect, useRef } from "react";
import { 
  Box, 
  Typography, 
  Button, 
  TextField, 
  Card, 
  CardContent, 
  Avatar,
  CircularProgress,
  IconButton,
  Tooltip
} from "@mui/material";
import { motion } from "framer-motion";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { CheckCircle, RemoveRedEye, ArrowBack } from "@mui/icons-material";
import Image from '../../../components/8c98994518b575bfd8c949e91d20548b.jpg';
import "./contactusdetails.css";

const ContactUsDetails = () => {
  const params = useParams();
  const Messageid = params.id;
  const token = window.localStorage.getItem("accessToken");
  const username = localStorage.getItem("userName");
  const navigate = useNavigate();

  const [messageData, setMessageData] = useState({});
  const [userData, setUserData] = useState({});
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://147.93.53.128:8888/admin/contact/${Messageid}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setMessageData(response.data.Message);
        setUserData(response.data.Message.UserId);
      } catch (err) {
        console.error("حدث خطأ في جلب بيانات الرسالة:", err);
        setError("فشل تحميل تفاصيل الرسالة");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [Messageid, token]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messageData]);

  const handleReply = async () => {
    if (!message.trim()) return;
    
    try {
      setSending(true);
      const response = await axios.post(
        `http://147.93.53.128:8888/admin/contact/${Messageid}`,
        { message, email: userData.email },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessageData(prevState => ({
        ...prevState,
        message: [
          ...prevState.message,
          { messages: { message, Sender: "Admin" }, _id: Date.now() },
        ],
      }));

      setMessage("");
    } catch (error) {
      console.error("حدث خطأ في إرسال الرد:", error);
      setError("فشل إرسال الرد");
    } finally {
      setSending(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('ar-EG', options);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh" flexDirection="column">
        <Typography color="error" variant="h6" gutterBottom>
          {error}
        </Typography>
        <Button variant="contained" onClick={() => window.location.reload()}>
          إعادة المحاولة
        </Button>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        padding: { xs: "10px", md: "20px" },
        display: "flex",
        flexDirection: "column",
        minHeight: "75vh",
        backgroundColor: "#f7f9fc",
        direction: "rtl",
      }}
    >
      {/* <Box sx={{ mb: 2 }}>
        <Tooltip title="العودة إلى الرسائل">
          <IconButton onClick={() => navigate("/dashboard/contact")}>
            <ArrowBack />
          </IconButton>
        </Tooltip>
      </Box> */}

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card
          sx={{
            display: "flex",
            flexDirection: "column",
            width: { xs: "100%", md: "70%" },
            margin: "auto",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
            borderRadius: "15px",
            overflow: "hidden",
          }}
        >
          {/* رأس البطاقة بمعلومات المستخدم */}
          <Box
            sx={{
              backgroundColor: "#D4AF37",
              color: "white",
              padding: "16px",
              display: "flex",
              alignItems: "center",
              gap: "15px",
            }}
          >
            <Avatar 
              sx={{ 
                bgcolor: "white", 
                color: "#D4AF37",
                fontSize: "24px", 
                width: 56, 
                height: 56,
                border: "2px solid white"
              }}
            >
              {!userData?.image ? (
                userData?.name?.[0]?.toUpperCase()
              ) : (
                <img
                  src={`http://147.93.53.128:8080/uploads/LawyerData/${userData.image}`}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: "50%",
                  }}
                  alt="صورة المستخدم"
                />
              )}
            </Avatar>
            <Box>
              <Typography variant="h6" fontWeight="bold">
                {userData.name || "مستخدم غير معروف"}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                {userData.email}
              </Typography>
            </Box>
          </Box>

          {/* منطقة عرض الرسائل */}
          <CardContent
            sx={{
              padding: "16px",
              height: "400px",
              overflowY: "auto",
              backgroundImage: `url(${Image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundBlendMode: "lighten",
              backgroundColor: "rgba(255, 255, 255, 0.8)",
            }}
          >
            {messageData.message?.length > 0 ? (
              messageData.message.map((msg) => (
                <Box 
                  key={msg._id} 
                  sx={{ 
                    mb: 2,
                    display: "flex",
                    justifyContent: msg.messages.Sender === "Admin" ? "flex-end" : "flex-start",
                  }}
                >
                  <Box
                    sx={{
                      maxWidth: "80%",
                      padding: "12px 16px",
                      borderRadius: msg.messages.Sender === "Admin" 
                        ? "18px 18px 0 18px" 
                        : "18px 18px 18px 0",
                      backgroundColor: msg.messages.Sender === "Admin" 
                        ? "#D4AF37" 
                        : "#f0f0f0",
                      color: msg.messages.Sender === "Admin" ? "white" : "text.primary",
                      boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    <Typography variant="body1">
                      {msg.messages.message}
                    </Typography>
                    <Typography 
                      variant="caption" 
                      display="block" 
                      sx={{
                        color: msg.messages.Sender === "Admin" 
                          ? "rgba(255, 255, 255, 0.7)" 
                          : "text.secondary",
                        textAlign: "right",
                        mt: 0.5,
                      }}
                    >
                      {msg.messages.Sender === "Admin" ? "أنت" : userData.name}
                    </Typography>
                  </Box>
                </Box>
              ))
            ) : (
              <Typography textAlign="center" color="text.secondary">
                لا توجد رسائل
              </Typography>
            )}
            <div ref={messagesEndRef} />
          </CardContent>

          {/* تذييل البطاقة بحالة الرسالة */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "12px 16px",
              borderTop: "1px solid #eee",
              backgroundColor: "#f9f9f9",
            }}
          >
            <Typography variant="body2" color="text.secondary">
              {formatDate(messageData.Date)}
            </Typography>
            <Tooltip title={messageData.viewed ? "تمت المشاهدة" : "لم تتم المشاهدة بعد"}>
              {messageData.viewed ? (
                <CheckCircle color="success" />
              ) : (
                <RemoveRedEye color="disabled" />
              )}
            </Tooltip>
          </Box>

          {/* منطقة كتابة الرد */}
          <Box sx={{ padding: "16px", borderTop: "1px solid #eee" }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              اكتب ردك
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={3}
              variant="outlined"
              placeholder="اكتب رسالتك هنا..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              sx={{ mb: 2 }}
              disabled={sending}
            />
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={handleReply}
              disabled={sending || !message.trim()}
              startIcon={sending ? <CircularProgress size={20} color="inherit" /> : null}
              sx={{
                py: 1.5,
                fontWeight: "bold",
                textTransform: "none",
              }}
            >
              {sending ? "جاري الإرسال..." : "إرسال الرد"}
            </Button>
          </Box>
        </Card>
      </motion.div>
    </Box>
  );
};

export default ContactUsDetails;