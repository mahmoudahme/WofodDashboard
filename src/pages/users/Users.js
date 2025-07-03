import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./users.css";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [reportDate, setReportDate] = useState("2025-07-02");
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const token = window.localStorage.getItem("accessToken");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          "http://147.79.101.225:8888/admin/users/users",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const allUsers = response.data.allUsers;
        setUsers(allUsers);
        // Set the default selected user to the first user in the list
        if (allUsers.length > 0) {
          setSelectedUser(allUsers[0]._id);
        }
      } catch (error) {
        console.error("خطأ في تحميل البيانات:", error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [token]);

  // فلترة المستخدمين حسب البحث
  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.phone.includes(searchTerm)
  );

  const handleReportSubmit = async (event) => {
    event.preventDefault();

    if (!selectedUser) {
      alert("يرجى اختيار مستخدم");
      return;
    }

    if (!reportDate) {
      alert("يرجى اختيار التاريخ");
      return;
    }

    try {
      const response = await axios.post(
        `http://147.79.101.225:8888/admin/report/user/${selectedUser}`,
        { dateOfRequest: reportDate },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("تم إنشاء التقرير بنجاح");
      console.log("Report response:", response.data);
    } catch (error) {
      console.error("فشل إنشاء التقرير:", error.message);
      alert("حدث خطأ أثناء إنشاء التقرير");
    }
  };

  if (isLoading) {
    return (
      <div className="spinner-container">
        <div className="spinner-circle"></div>
        <p>جاري تحميل البيانات...</p>
      </div>
    );
  }

  return (
    <div className="main-container">
      {/* Header Section */}
      <div className="header-section">
        <h1 className="page-header">إدارة المستخدمين</h1>
        <div className="stats-container">
          <div className="info-card">
            <div className="card-number">{users.length}</div>
            <div className="card-text">إجمالي المستخدمين</div>
          </div>
          <div className="info-card">
            <div className="card-number">
              {users.filter(user => user.otp === user.recievedOTP).length}
            </div>
            <div className="card-text">المستخدمين المفعلين</div>
          </div>
          <div className="info-card">
            <div className="card-number">
              {users.filter(user => user.otp !== user.recievedOTP).length}
            </div>
            <div className="card-text">المستخدمين غير المفعلين</div>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="control-panel">
        <div className="search-box">
          <input
            type="text"
            placeholder="البحث عن مستخدم..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-field"
          />
          <span className="search-symbol"></span>
        </div>
      </div>
      {/* Table Section */}
      <div className="data-section">
        <div className="section-header">
          <h2 className="section-title">قائمة المستخدمين</h2>
          <span className="data-count">
            عرض {filteredUsers.length} من {users.length} مستخدم
          </span>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>الصورة</th>
                <th>الاسم</th>
                <th>البريد الإلكتروني</th>
                <th>رقم الهاتف</th>
                <th>الحالة</th>
                <th>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user, index) => (
                  <tr key={user._id} className={index % 2 === 0 ? "even-row" : "odd-row"}>
                    <td className="avatar-column">
                      <div className="profile-avatar">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                    </td>
                    <td className="name-column">{user.name}</td>
                    <td className="email-column">{user.email}</td>
                    <td className="phone-column">{user.phone}</td>
                    <td className="status-column">
                      <span className={`status-label ${user.otp === user.recievedOTP ? 'active-status' : 'inactive-status'}`}>
                        {user.otp === user.recievedOTP ? "مفعل" : "غير مفعل"}
                      </span>
                    </td>
                    <td className="actions-column">
                      <Link to={`${user._id}`} className="action-link details-btn">
                        عرض التفاصيل
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="empty-state">
                    لا توجد بيانات للعرض
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
            {/* Report Section */}
      <br></br>
      <div className="report-panel">
        <h2 className="panel-title">إنشاء تقرير</h2>
        <form onSubmit={handleReportSubmit} className="report-form-container">
          <div className="input-group">
            <label className="input-label">اختر المستخدم:</label>
            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="select-field"
            >
              <option value="">اختر مستخدم</option>
              {users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.name} - {user.email}
                </option>
              ))}
            </select>
          </div>
          <div className="input-group">
            <label className="input-label">اختر التاريخ:</label>
            <input
              type="date"
              value={reportDate}
              onChange={(e) => setReportDate(e.target.value)}
              className="date-field"
              required
            />
          </div>
          <button type="submit" className="submit-btn primary-btn">
            إنشاء التقرير
          </button>
        </form>
      </div>
    </div>
  );
};

export default Users;