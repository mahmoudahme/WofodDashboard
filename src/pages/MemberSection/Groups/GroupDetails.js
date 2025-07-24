import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import io from "socket.io-client";
import { useParams, useNavigate } from "react-router-dom";

const GroupDetails = () => {
    const [group, setGroup] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [error, setError] = useState("");
    const [socket, setSocket] = useState(null);

    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    const accessToken = localStorage.getItem("accessToken");
    const adminId = localStorage.getItem("id");
    const adminName = localStorage.getItem("name") || "Admin";
    const params = useParams()

    // استخراج groupId من URL
    const groupId = params.id;
    useEffect(() => {
        fetchGroupDetails();

        const newSocket = io("http://147.93.53.128:8888", {
            auth: {
                token: accessToken
            }
        });

        newSocket.on('connect', () => {
            console.log('متصل بالسيرفر');
            newSocket.emit('joinGroup', groupId);
        });

        newSocket.on('newMessageFromGroup', (data) => {
            console.log('رسالة جديدة:', data);
            if (data.groupId === groupId) {
                setMessages(prev => [...prev, {
                    sender: data.sender,
                    senderModel: data.senderModel,
                    content: data.content,
                    timestamp: data.timestamp
                }]);
            }
        });

        newSocket.on('errorMessage', (error) => {
            setError(error);
            setTimeout(() => setError(""), 3000);
        });

        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, [groupId, accessToken]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // const initializeSocket = () => {
    //     const newSocket = io("http://147.93.53.128:8888", {
    //         auth: {
    //             token: accessToken
    //         }
    //     });

    //     newSocket.on('connect', () => {
    //         console.log('متصل بالسيرفر');
    //         newSocket.emit('joinGroup', groupId);
    //     });

    //     newSocket.on('newMessageFromGroup', (data) => {
    //         console.log('رسالة جديدة:', data);
    //         if (data.groupId === groupId) {
    //             setMessages(prev => [...prev, {
    //                 sender: data.sender,
    //                 senderModel: data.senderModel,
    //                 content: data.content,
    //                 timestamp: data.timestamp
    //             }]);
    //         }
    //     });

    //     newSocket.on('errorMessage', (error) => {
    //         setError(error);
    //         setTimeout(() => setError(""), 3000);
    //     });

    //     setSocket(newSocket);
    // };

    const fetchGroupDetails = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`http://147.93.53.128:8888/admin/groups/${groupId}`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });

            setGroup(res.data.group);
            setMessages(res.data.group.messages || []);
        } catch (err) {
            console.error("خطأ في جلب تفاصيل الجروب", err);
            setError("فشل في تحميل بيانات الجروب");
        } finally {
            setLoading(false);
        }
    };

    const sendMessage = () => {
        if (!newMessage.trim() || !socket || sending) return;

        setSending(true);

        socket.emit('sendMessageFromGroup', {
            groupId: groupId,
            sender: adminId,
            content: newMessage.trim(),
            senderModel: 'Admin'
        });

        setNewMessage("");
        setSending(false);
        inputRef.current?.focus();
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
            const token = localStorage.getItem("accessToken");
            group.members.map(async(member) => {
                await axios.post("http://147.93.53.128:8888/admin/send-group/", {groupName: group.name, memberId: member._id, messageFromAdmin: newMessage.trim()},
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    })
                    .then(() => {
                        console.log("Notification sent successfully");
                    })
                    .catch((error) => {
                        console.error("Error sending notification:", error);
                    });
            });

        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const formatTime = (timestamp) => {
        return new Date(timestamp).toLocaleString('ar-EG', {
            hour: '2-digit',
            minute: '2-digit',
            day: '2-digit',
            month: '2-digit'
        });
    };

    const getSenderInfo = (message) => {
        if (message.senderModel === 'Admin') {
            return {
                name: group?.admin?.name || 'المدير',
                image: group?.admin?.image || '/default-admin.png'  // ضع صورة افتراضية إذا مفيش صورة
            };
        }

        const member = group?.members?.find(m => m._id === message.sender);
        return {
            name: member?.name || 'عضو',
            image: member?.image || '/default-member.png'  // صورة افتراضية للعضو
        };
    };


    if (loading) {
        return (
            <div style={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #1c1c1c 0%, #2a2a2a 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#D4AF37',
                fontSize: '1.5rem'
            }}>
                جاري التحميل...
            </div>
        );
    }

    if (!group) {
        return (
            <div style={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #1c1c1c 0%, #2a2a2a 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#e74c3c',
                fontSize: '1.5rem'
            }}>
                الجروب غير موجود
            </div>
        );
    }

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #1c1c1c 0%, #2a2a2a 100%)',
            fontFamily: 'Arial, sans-serif'
        }}>
            {/* Header */}
            <div style={{
                background: 'rgba(28, 28, 28, 0.95)',
                borderBottom: '2px solid #D4AF37',
                padding: '20px',
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.3)'
            }}>
                <div style={{
                    maxWidth: '1200px',
                    margin: '0 auto',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <div>
                        <h1 style={{
                            color: '#D4AF37',
                            fontSize: '2rem',
                            margin: '0 0 10px 0',
                            fontWeight: 'bold'
                        }}>
                            {group.name}
                        </h1>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '20px',
                            color: 'white',
                            fontSize: '1rem'
                        }}>
                            <span style={{

                                color: 'white',
                            }}>👨‍💼 المدير: {group.admin.name}</span>
                            <span style={{
                                color: 'white',
                            }}>👥 الأعضاء: {group.members.length}</span>
                            <span style={{
                                color: 'white',
                            }}>💬 الرسائل: {messages.length}</span>
                        </div>
                    </div>

                    <div style={{
                        background: socket?.connected ? 'rgba(76, 175, 80, 0.2)' : 'rgba(244, 67, 54, 0.2)',
                        color: socket?.connected ? '#4CAF50' : '#f44336',
                        padding: '8px 16px',
                        borderRadius: '20px',
                        fontSize: '0.9rem',
                        fontWeight: 'bold',
                        border: `1px solid ${socket?.connected ? 'rgba(76, 175, 80, 0.5)' : 'rgba(244, 67, 54, 0.5)'}`
                    }}>
                        {socket?.connected ? '🟢 متصل' : '🔴 غير متصل'}
                    </div>
                </div>
            </div>

            {/* Chat Container */}
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                display: 'flex',
                flexDirection: 'column',
                height: 'calc(100vh - 120px)'
            }}>

                {/* Messages Area */}
                <div style={{
                    flex: 1,
                    padding: '20px',
                    overflowY: 'auto',
                    background: 'rgba(28, 28, 28, 0.3)'
                }}>

                    {/* Members List */}
                    <div style={{
                        background: 'rgba(212, 175, 55, 0.1)',
                        borderRadius: '15px',
                        padding: '15px',
                        marginBottom: '20px',
                        border: '1px solid rgba(212, 175, 55, 0.3)'
                    }}>
                        <h3 style={{
                            color: '#D4AF37',
                            fontSize: '1.1rem',
                            margin: '0 0 10px 0'
                        }}>
                            أعضاء الجروب:
                        </h3>
                        <div style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '8px'
                        }}>
                            <span style={{
                                background: 'rgba(212, 175, 55, 0.3)',
                                color: '#D4AF37',
                                padding: '4px 12px',
                                borderRadius: '15px',
                                fontSize: '0.9rem',
                                fontWeight: 'bold',
                                border: '1px solid rgba(212, 175, 55, 0.5)'
                            }}>
                                👨‍💼 {group.admin.name} (مدير)
                            </span>
                            {group.members.map((member) => (
                                <span
                                    key={member._id}
                                    style={{
                                        background: 'rgba(212, 175, 55, 0.2)',
                                        color: '#D4AF37',
                                        padding: '4px 12px',
                                        borderRadius: '15px',
                                        fontSize: '0.9rem',
                                        border: '1px solid rgba(212, 175, 55, 0.3)'
                                    }}
                                >
                                    <img
                                        src={`http://147.93.53.128:8888/uploads/MemberImages/${member.image}`}
                                        alt={member.name}
                                        style={{
                                            width: '28px',
                                            height: '28px',
                                            borderRadius: '50%',
                                            objectFit: 'cover',
                                            border: '1px solid #ccc'
                                        }}
                                    /> {member.name}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Messages */}
                    <div style={{ minHeight: '400px' }}>
                        {messages.length === 0 ? (
                            <div style={{
                                textAlign: 'center',
                                color: 'rgba(212, 175, 55, 0.6)',
                                fontSize: '1.2rem',
                                padding: '60px 20px',
                                background: 'rgba(28, 28, 28, 0.3)',
                                borderRadius: '15px',
                                border: '2px dashed rgba(212, 175, 55, 0.3)'
                            }}>
                                💬 لا توجد رسائل بعد، ابدأ المحادثة!
                            </div>
                        ) : (
                            messages.map((message, index) => {
                                const isAdmin = message.senderModel === 'Admin';
                                const isMyMessage = message.sender === adminId;

                                return (
                                    <div
                                        key={index}
                                        style={{
                                            display: 'flex',
                                            justifyContent: isMyMessage ? 'flex-end' : 'flex-start',
                                            marginBottom: '15px'
                                        }}
                                    >
                                        <div style={{
                                            maxWidth: '70%',
                                            background: isMyMessage
                                                ? 'linear-gradient(135deg, #D4AF37, #f4d03f)'
                                                : 'rgba(60, 60, 60, 0.8)',
                                            color: isMyMessage ? '#1c1c1c' : '#ffffff',
                                            padding: '12px 16px',
                                            borderRadius: isMyMessage
                                                ? '20px 20px 5px 20px'
                                                : '20px 20px 20px 5px',
                                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
                                            border: isMyMessage
                                                ? 'none'
                                                : '1px solid rgba(212, 175, 55, 0.2)'
                                        }}>
                                            <div style={{
                                                fontSize: '0.8rem',
                                                opacity: 0.8,
                                                marginBottom: '5px',
                                                fontWeight: 'bold'
                                            }}>
                                                {(() => {
                                                    const sender = getSenderInfo(message);
                                                    return (
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                            <img
                                                                src={`http://147.93.53.128:8888/uploads/MemberImages/${sender.image}`}
                                                                alt={sender.name}
                                                                style={{
                                                                    width: '28px',
                                                                    height: '28px',
                                                                    borderRadius: '50%',
                                                                    objectFit: 'cover',
                                                                    border: '1px solid #ccc'
                                                                }}
                                                            />
                                                            <span style={{ color: isMyMessage ? '#1c1c1c' : '#ffffff' }}>{sender.name}</span>
                                                        </div>
                                                    );
                                                })()}
                                            </div>

                                            <div style={{
                                                fontSize: '1rem',
                                                marginBottom: '5px',
                                                lineHeight: '1.4'
                                            }}>
                                                {message.content}
                                            </div>

                                            <div style={{
                                                fontSize: '0.75rem',
                                                opacity: 0.7,
                                                textAlign: isMyMessage ? 'left' : 'right'
                                            }}>
                                                {formatTime(message.timestamp)}
                                            </div>
                                        </div>

                                    </div>
                                );
                            })
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                </div>

                {/* Message Input */}
                <div style={{
                    background: 'rgba(28, 28, 28, 0.95)',
                    padding: '20px',
                    borderTop: '2px solid rgba(212, 175, 55, 0.3)'
                }}>
                    <div style={{
                        display: 'flex',
                        gap: '15px',
                        alignItems: 'flex-end'
                    }}>
                        <textarea
                            ref={inputRef}
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="اكتب رسالتك هنا... (اضغط Enter للإرسال)"
                            style={{
                                flex: 1,
                                minHeight: '50px',
                                maxHeight: '120px',
                                padding: '12px 16px',
                                border: '2px solid rgba(212, 175, 55, 0.3)',
                                borderRadius: '12px',
                                background: 'rgba(28, 28, 28, 0.8)',
                                color: '#ffffff',
                                fontSize: '1rem',
                                resize: 'vertical',
                                outline: 'none',
                                fontFamily: 'inherit'
                            }}
                            onFocus={(e) => {
                                e.target.style.borderColor = '#D4AF37';
                                e.target.style.boxShadow = '0 0 10px rgba(212, 175, 55, 0.3)';
                            }}
                            onBlur={(e) => {
                                e.target.style.borderColor = 'rgba(212, 175, 55, 0.3)';
                                e.target.style.boxShadow = 'none';
                            }}
                        />
                        <button
                            onClick={sendMessage}
                            style={{
                                padding: '12px 24px',
                                background: (!newMessage.trim() || !socket?.connected || sending)
                                    ? 'rgba(212, 175, 55, 0.3)'
                                    : 'linear-gradient(135deg, #D4AF37, #f4d03f)',
                                color: (!newMessage.trim() || !socket?.connected || sending)
                                    ? 'rgba(255, 255, 255, 0.5)'
                                    : '#1c1c1c',
                                border: 'none',
                                borderRadius: '12px',
                                fontSize: '1rem',
                                fontWeight: 'bold',
                                cursor: (!newMessage.trim() || !socket?.connected || sending)
                                    ? 'not-allowed'
                                    : 'pointer',
                                transition: 'all 0.3s ease',
                                width: "70px"
                            }}
                            onMouseEnter={(e) => {
                                if (newMessage.trim() && socket?.connected && !sending) {
                                    e.target.style.transform = 'translateY(-2px)';
                                    e.target.style.boxShadow = '0 5px 15px rgba(212, 175, 55, 0.4)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (newMessage.trim() && socket?.connected && !sending) {
                                    e.target.style.transform = 'translateY(0)';
                                    e.target.style.boxShadow = 'none';
                                }
                            }}
                        >
                            {sending ? '⏳' : '📤'} إرسال
                        </button>
                    </div>

                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div style={{
                    position: 'fixed',
                    top: '20px',
                    right: '20px',
                    background: 'rgba(244, 67, 54, 0.9)',
                    color: 'white',
                    padding: '15px 20px',
                    borderRadius: '10px',
                    boxShadow: '0 5px 15px rgba(244, 67, 54, 0.3)',
                    zIndex: 1000,
                    fontWeight: 'bold'
                }}>
                    ❌ {error}
                </div>
            )}
        </div>
    );
};

export default GroupDetails;