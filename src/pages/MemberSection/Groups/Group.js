import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Group = () => {
  const [members, setMembers] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [message, setMessage] = useState("");
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);

  const accessToken = localStorage.getItem("accessToken");
  const adminId = localStorage.getItem("id");

  useEffect(() => {
    fetchMembers();
    fetchGroups();
  }, []);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://147.93.53.128:8888/admin/users/members", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setMembers(res.data.Members);
    } catch (err) {
      console.error("خطأ في جلب الأعضاء", err);
      setMessage("❌ خطأ في جلب الأعضاء");
    } finally {
      setLoading(false);
    }
  };

  const fetchGroups = async () => {
    try {
      const res = await axios.get("http://147.93.53.128:8888/admin/groups", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setGroups(res.data.groups);
    } catch (err) {
      console.error("خطأ في جلب الجروبات", err);
      setMessage("❌ خطأ في جلب الجروبات");
    }
  };

  const handleCreateGroup = async () => {
    if (!groupName || !adminId || selectedMembers.length === 0) {
      setMessage("يرجى ملء كل الحقول");
      setTimeout(() => setMessage(""), 3000);
      return;
    }

    const groupData = {
      name: groupName,
      admin: adminId,
      members: selectedMembers,
      messages: [],
    };

    try {
      setLoading(true);
      await axios.post("http://147.93.53.128:8888/admin/groups/create", groupData, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      setMessage("✅ تم إنشاء الجروب بنجاح!");
      setGroupName("");
      setSelectedMembers([]);
      fetchGroups();
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error(error);
      setMessage("❌ حدث خطأ أثناء إنشاء الجروب");
      setTimeout(() => setMessage(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleMemberSelection = (e) => {
    setSelectedMembers(Array.from(e.target.selectedOptions, (opt) => opt.value));
  };

  const handleDeleteGroup = async (groupId) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا الجروب؟')) {
      return;
    }

    try {
      setLoading(true);
      await axios.delete(`http://147.93.53.128:8888/admin/groups/${groupId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      setMessage("✅ تم حذف الجروب بنجاح!");
      fetchGroups(); // تحديث القائمة
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("خطأ في حذف الجروب:", error);
      setMessage("❌ حدث خطأ أثناء حذف الجروب");
      setTimeout(() => setMessage(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        background: 'rgba(28, 28, 28, 0.95)',
        borderRadius: '20px',
        padding: '30px',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
        border: '1px solid rgba(212, 175, 55, 0.2)'
      }}>

        {/* Header Section */}
        <div style={{
          textAlign: 'center',
          marginBottom: '40px',
          borderBottom: '2px solid #D4AF37',
          paddingBottom: '20px'
        }}>
          <h2 style={{
            color: '#D4AF37',
            fontSize: '2.5rem',
            margin: '0',
            fontWeight: 'bold',
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)'
          }}>
            إنشاء جروب جديد
          </h2>
          <div style={{
            width: '100px',
            height: '4px',
            background: 'linear-gradient(90deg, #D4AF37, #f4d03f)',
            margin: '15px auto',
            borderRadius: '2px'
          }}></div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '40px',
          alignItems: 'start'
        }}>

          {/* Form Section */}
          <div style={{
            background: 'rgba(212, 175, 55, 0.05)',
            borderRadius: '15px',
            padding: '30px',
            border: '1px solid rgba(212, 175, 55, 0.3)'
          }}>
            <h3 style={{
              color: '#D4AF37',
              fontSize: '1.5rem',
              marginBottom: '25px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <span style={{
                background: '#D4AF37',
                color: '#1c1c1c',
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1rem',
                fontWeight: 'bold'
              }}>+</span>
              بيانات الجروب
            </h3>

            <div style={{ marginBottom: '25px' }}>
              <label style={{
                display: 'block',
                color: '#D4AF37',
                fontSize: '1.1rem',
                marginBottom: '8px',
                fontWeight: '600'
              }}>
                اسم الجروب:
              </label>
              <input
                type="text"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder="أدخل اسم الجروب"
                style={{
                  width: '100%',
                  padding: '12px 15px',
                  border: '2px solid rgba(212, 175, 55, 0.3)',
                  borderRadius: '10px',
                  background: 'rgba(28, 28, 28, 0.8)',
                  color: '#ffffff',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'all 0.3s ease',
                  boxSizing: 'border-box'
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
            </div>

            <div style={{ marginBottom: '30px' }}>
              <label style={{
                display: 'block',
                color: '#D4AF37',
                fontSize: '1.1rem',
                marginBottom: '8px',
                fontWeight: '600'
              }}>
                اختيار الأعضاء:
              </label>
              <select
                multiple
                value={selectedMembers}
                onChange={handleMemberSelection}
                style={{
                  width: '100%',
                  minHeight: '150px',
                  padding: '10px',
                  border: '2px solid rgba(212, 175, 55, 0.3)',
                  borderRadius: '10px',
                  background: 'rgba(28, 28, 28, 0.8)',
                  color: '#ffffff',
                  fontSize: '1rem',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#D4AF37';
                  e.target.style.boxShadow = '0 0 10px rgba(212, 175, 55, 0.3)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(212, 175, 55, 0.3)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                {members.map((member) => (
                  <option
                    key={member._id}
                    value={member._id}
                    style={{
                      padding: '8px',
                      background: selectedMembers.includes(member._id) ? '#D4AF37' : 'transparent',
                      color: selectedMembers.includes(member._id) ? '#1c1c1c' : '#ffffff'
                    }}
                  >
                    {member.name} - {member.typeOfUser.nameAr}
                  </option>
                ))}
              </select>
              <p style={{
                color: 'rgba(212, 175, 55, 0.7)',
                fontSize: '0.9rem',
                margin: '5px 0 0 0'
              }}>
                اضغط Ctrl + Click لاختيار عدة أعضاء
              </p>
            </div>

            <button
              onClick={handleCreateGroup}
              disabled={loading}
              style={{
                width: '100%',
                padding: '15px',
                background: loading ? 'rgba(212, 175, 55, 0.5)' : 'linear-gradient(135deg, #D4AF37 0%, #f4d03f 100%)',
                color: '#1c1c1c',
                border: 'none',
                borderRadius: '10px',
                fontSize: '1.2rem',
                fontWeight: 'bold',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 5px 15px rgba(212, 175, 55, 0.3)'
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 8px 25px rgba(212, 175, 55, 0.4)';
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 5px 15px rgba(212, 175, 55, 0.3)';
                }
              }}
            >
              {loading ? 'جاري الإنشاء...' : 'إنشاء الجروب'}
            </button>

            {message && (
              <div style={{
                marginTop: '20px',
                padding: '15px',
                borderRadius: '10px',
                background: message.includes('✅') ?
                  'rgba(76, 175, 80, 0.2)' :
                  'rgba(244, 67, 54, 0.2)',
                border: `1px solid ${message.includes('✅') ?
                  'rgba(76, 175, 80, 0.5)' :
                  'rgba(244, 67, 54, 0.5)'}`,
                color: message.includes('✅') ? '#4CAF50' : '#f44336',
                fontSize: '1rem',
                textAlign: 'center',
                fontWeight: '600'
              }}>
                {message}
              </div>
            )}
          </div>

          {/* Groups List Section */}
          <div style={{
            background: 'rgba(212, 175, 55, 0.05)',
            borderRadius: '15px',
            padding: '30px',
            border: '1px solid rgba(212, 175, 55, 0.3)',
            maxHeight: '600px',
            overflowY: 'auto'
          }}>
            <h3 style={{
              color: '#D4AF37',
              fontSize: '1.5rem',
              marginBottom: '25px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <span style={{
                background: '#D4AF37',
                color: '#1c1c1c',
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1rem',
                fontWeight: 'bold'
              }}>📋</span>
              الجروبات الحالية ({groups.length})
            </h3>

            {loading ? (
              <div style={{
                textAlign: 'center',
                color: '#D4AF37',
                fontSize: '1.1rem',
                padding: '40px'
              }}>
                جاري التحميل...
              </div>
            ) : groups.length === 0 ? (
              <div style={{
                textAlign: 'center',
                color: 'rgba(212, 175, 55, 0.7)',
                fontSize: '1.1rem',
                padding: '40px',
                background: 'rgba(28, 28, 28, 0.3)',
                borderRadius: '10px',
                border: '2px dashed rgba(212, 175, 55, 0.3)'
              }}>
                لا توجد جروبات حالياً
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {groups.map((group, index) => (
                  <div
                    key={group._id}
                    style={{
                      background: 'rgba(28, 28, 28, 0.6)',
                      border: '1px solid rgba(212, 175, 55, 0.3)',
                      borderRadius: '12px',
                      padding: '20px',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.borderColor = '#D4AF37';
                      e.target.style.boxShadow = '0 5px 15px rgba(212, 175, 55, 0.2)';
                      e.target.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.borderColor = 'rgba(212, 175, 55, 0.3)';
                      e.target.style.boxShadow = 'none';
                      e.target.style.transform = 'translateY(0)';
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '15px'
                    }}>
                      <Link to={`${group._id}`} className="group-link">
                        <h4 style={{
                          color: '#D4AF37',
                          fontSize: '1.3rem',
                          margin: '0',
                          fontWeight: 'bold'
                        }}>
                          {group.name}
                        </h4>
                      </Link>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{
                          background: 'rgba(212, 175, 55, 0.2)',
                          color: '#D4AF37',
                          padding: '4px 12px',
                          borderRadius: '20px',
                          fontSize: '0.9rem',
                          fontWeight: '600'
                        }}>
                          #{index + 1}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteGroup(group._id);
                          }}
                          disabled={loading}
                          style={{
                            background: 'linear-gradient(135deg, #e74c3c, #c0392b)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            padding: '8px 12px',
                            fontSize: '0.85rem',
                            fontWeight: 'bold',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            transition: 'all 0.3s ease',
                            opacity: loading ? 0.6 : 1,
                            boxShadow: '0 2px 8px rgba(231, 76, 60, 0.3)'
                          }}
                          onMouseEnter={(e) => {
                            if (!loading) {
                              e.target.style.transform = 'scale(1.05)';
                              e.target.style.boxShadow = '0 4px 12px rgba(231, 76, 60, 0.4)';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!loading) {
                              e.target.style.transform = 'scale(1)';
                              e.target.style.boxShadow = '0 2px 8px rgba(231, 76, 60, 0.3)';
                            }
                          }}
                        >
                          🗑️ حذف
                        </button>
                      </div>
                    </div>

                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '15px',
                      fontSize: '0.95rem'
                    }}>
                      <div>
                        <span style={{ color: 'rgba(212, 175, 55, 0.8)', fontWeight: '600' }}>
                          الأدمن:
                        </span>
                        <span style={{ color: '#ffffff', marginLeft: '5px' }}>
                          {group.admin.name}
                        </span>
                      </div>

                      <div>
                        <span style={{ color: 'rgba(212, 175, 55, 0.8)', fontWeight: '600' }}>
                          الرسائل:
                        </span>
                        <span style={{
                          color: '#ffffff',
                          marginLeft: '5px',
                          background: 'rgba(212, 175, 55, 0.2)',
                          padding: '2px 8px',
                          borderRadius: '10px'
                        }}>
                          {group.messages.length}
                        </span>
                      </div>
                    </div>

                    <div style={{ marginTop: '15px' }}>
                      <span style={{
                        color: 'rgba(212, 175, 55, 0.8)',
                        fontWeight: '600',
                        display: 'block',
                        marginBottom: '8px'
                      }}>
                        الأعضاء ({group.members.length}):
                      </span>
                      <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '8px'
                      }}>
                        {group.members.map((member, memberIndex) => (
                          <span
                            key={memberIndex}
                            style={{
                              background: 'rgba(212, 175, 55, 0.1)',
                              color: '#D4AF37',
                              padding: '4px 10px',
                              borderRadius: '15px',
                              fontSize: '0.85rem',
                              border: '1px solid rgba(212, 175, 55, 0.3)'
                            }}
                          >
                            {member.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Group;