import React, { useState, useEffect, useRef } from "react";
import { Box, Typography, Button, TextField, Card, CardContent, Avatar } from "@mui/material";
import { motion } from "framer-motion";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { CheckCircle, RemoveRedEye } from "@mui/icons-material";
import Image from '../../../components/8c98994518b575bfd8c949e91d20548b.jpg'; // Import using relative path
import "./contactusdetails.css";

const ContactUsDetails = () => {
  const params = useParams();
  const Messageid = params.id;
  const token = window.localStorage.getItem("accessToken");
  const username = localStorage.getItem("userName");
  const navigate = useNavigate();

  const [messageData, setMessageData] = useState({});
  const [userData, setUserData] = useState({});
  const [message, setMessage] = useState(""); // النص الذي سيتم إرساله كـ رد
  const [sending, setSending] = useState(false); // حالة الإرسال
  const messagesEndRef = useRef(null); // Reference to scroll to the bottom

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(
        `http://147.79.101.225:8888/admin/contact/${Messageid}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMessageData(response.data.Message);
      setUserData(response.data.Message.UserId);
    };
    fetchData();
  }, [Messageid]);

  useEffect(() => {
    // Scroll to the bottom when messages are updated or page is loaded
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messageData]); // Re-run this whenever messageData changes (i.e., new message)

  const handleReply = async () => {
    try {
      setSending(true);
      const response = await axios.post(
        `http://147.79.101.225:8888/admin/contact/${Messageid}`,
        { message, email: userData.email },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("Reply sent successfully:", response.data);

      // بعد إرسال الرسالة بنجاح، أضف الرسالة الجديدة إلى الرسائل
      setMessageData(prevState => ({
        ...prevState,
        message: [
          ...prevState.message,
          { messages: { message, Sender: "Admin" }, _id: Date.now() }, // أضف الرسالة الجديدة هنا
        ],
      }));

      setMessage(""); // إعادة تعيين حقل الرسالة بعد الإرسال
      navigate(`/dashboard/contact/${Messageid}`);
    } catch (error) {
      console.error("Error sending reply:", error);
    } finally {
      setSending(false);
    }
  };

  return (
    <Box
      sx={{
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        minHeight: "75vh",
        backgroundColor: "#f7f9fc",
        direction: "rtl", // إضافة الاتجاه هنا
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "70%",
            margin: "auto",
            boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);",
            borderRadius: "15px",
            padding: "20px",
          }}
        >
          {/* User info at the top */}
          <CardContent sx={{ paddingBottom: "0" }}>
            <Box display="flex" alignItems="center" gap="15px" marginBottom="20px">
              <Avatar sx={{ bgcolor: "#1976d2", fontSize: "24px", width: 56, height: 56 }}>
                {
                  !userData?.image ? ( // Safely check if `image` exists
                    userData?.name?.[0]
                  ) : (
                    <img
                      src={`http://147.79.101.225:8080/uploads/LawyerData/${userData.image}`}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover", // Make the image cover the avatar area
                        borderRadius: "50%",
                      }}
                      alt="User Avatar"
                    />
                  )
                }
              </Avatar>
              <Box>
                <Typography variant="h6">
                {userData.name}
                </Typography>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{ wordBreak: "break-word" }}
                >
                  {userData.email}
                </Typography>
              </Box>
            </Box>
          </CardContent>

          {/* Message container with scroll */}
          <CardContent
            sx={{
              paddingTop: "0",
              paddingBottom: "0",
              height: "400px", // Maximum height for the messages area
              overflowY: "auto", // Enable scrolling if messages overflow
              flexGrow: 1, // Allow the messages section to expand and contract
              backgroundImage: `url(${Image})`, // أو رابط الصورة
              backgroundSize: '',
              backgroundPosition: 'center',

            }}
          >
            {/* Displaying messages as a chat */}
            {messageData.message?.map((msg) => (
              <Box key={msg._id} sx={{ marginBottom: "10px", display: "flex" }}>
                <Typography
                  variant="body2"
                  sx={{
                    padding: "10px",
                    borderRadius: "10px",
                    backgroundColor: msg.messages.Sender === "Admin" ? "#1976d2" : "#f0f0f0",
                    color: msg.messages.Sender === "Admin" ? "white" : "black",
                    textAlign: msg.messages.Sender === "Admin" ? "right" : "left",
                    maxWidth: "80%",
                    margin: msg.messages.Sender === "Admin" ? "5px 0 5px auto" : "5px auto 5px 0",
                    direction: msg.messages.Sender === "Admin" ? "rtl" : "ltr",  // إضافة الاتجاه هنا
                  }}
                >
                  {msg.messages.message}
                </Typography>
              </Box>
            ))}
            <div ref={messagesEndRef} /> {/* Empty div to scroll to the bottom */}
          </CardContent>

          {/* Footer with message status */}
          <CardContent sx={{ paddingTop: "0" }}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="body2" color="textSecondary">
                Sent on: {messageData.Date}
              </Typography>
              {messageData.viewed ? (
                <CheckCircle color="success" fontSize="large" />
              ) : (
                <RemoveRedEye color="action" fontSize="large" />
              )}
            </Box>
          </CardContent>

          {/* Reply section */}
          <CardContent>
            <Typography variant="h6" marginBottom="10px">
              Reply to Message
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={4}
              variant="outlined"
              placeholder="Write your reply here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              sx={{ marginBottom: "20px" }}
            />
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={handleReply}
              disabled={sending || !message.trim()}
            >
              {sending ? "Sending..." : "Send Reply"}
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </Box>
  );
};

export default ContactUsDetails;
