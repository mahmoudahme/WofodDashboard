import React, { useState, useEffect, useRef } from "react";
import { useParams } from 'react-router-dom';
import axios from "axios";
import { io } from "socket.io-client";
import "./Chat.css";

const socket = io("http://147.79.101.225:8888"); // أو حسب URL السيرفر بتاعك

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [newMsg, setNewMsg] = useState("");
    const [isConnected, setIsConnected] = useState(false);
        const [error, setError] = useState(null);

    const params = useParams();
    const memberId = params.id;
    const token = window.localStorage.getItem("accessToken");
    const SUPER_ADMIN_ID = "6651e3c24335cc1b0c86d3af";
    const bottomRef = useRef(null);

    useEffect(() => {
        const roomIdPayload = {
            senderId: memberId,
            receiverId: SUPER_ADMIN_ID,
        };
        socket.on("connect", () => {
            setIsConnected(true);
            setError(null);
        });

        socket.on("disconnect", () => {
            setIsConnected(false);
        });
        socket.emit("joinChat", roomIdPayload)
        const fetchChat = async () => {
            try {
                const res = await axios.get(
                    `http://147.79.101.225:8888/admin/chat/${memberId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json"
                        }
                    }
                );
                setMessages(res.data.Chats.messages);
            } catch (error) {
                console.error("Error fetching chat:", error);
            }
        };

        fetchChat();

        socket.on("receiveMessage", (data) => {
            setMessages((prev) => [
                ...prev,
                {
                    sender: data.sender,
                    content: data.content,
                    timestamp: data.timestamp,
                }
            ]);
        });

        return () => {
            socket.off("receiveMessage");
        };
    }, [memberId, token]);

    useEffect(() => {
        if (bottomRef.current) {
            bottomRef.current.scrollTop = bottomRef.current.scrollHeight;
        }
    }, [messages]);



    const handleSend = async () => {
        if (!newMsg.trim()) return;

        const messageData = {
            senderId: "6651e3c24335cc1b0c86d3af",
            receiverId: memberId,
            message: newMsg,
        };

        socket.emit("sendMessage", messageData);

        await axios.post("http://147.79.101.225:8888/admin/send-message", { memberId: memberId, messageFromAdmin: messageData.message },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            })
        setNewMsg("");
    };

    console.log(messages);
    return (
        <div className="chat-container">
            <h2>
                الرسائل
                <span className={`connection-status ${isConnected ? 'connected' : 'disconnected'}`}>
                    {isConnected ? '🟢' : '🔴'}
                </span>
            </h2>
            <ul className="message-list" ref={bottomRef}>
                {messages.map((msg, index) => (
                    <li
                        key={index}
                        className={msg.sender === "6651e3c24335cc1b0c86d3af" ? "my-message" : "their-message"}
                    >
                        <p>{msg.content}</p>
                        <span className="timestamp">
                            {msg.timestamp}
                        </span>
                    </li>
                ))}

            </ul>


            <div className="send-box">
                <div className="input-wrapper">
                    <input
                        type="text"
                        value={newMsg}
                        onChange={(e) => setNewMsg(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                handleSend();
                            }
                        }}
                        placeholder="اكتب الرسالة..."
                    />
                </div>
                <div className="button-wrapper">
                    <button onClick={handleSend}>إرسال</button>
                </div>
            </div>

        </div>
    );
};

export default Chat;
