import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./Members.css";
import { FiMessageCircle } from 'react-icons/fi';

const Members = () => {
  const [members, setMembers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [state, setState] = useState({
    typeOfUser: "",
    image: null,
    name: "",
    phone: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // success أو error

  const token = window.localStorage.getItem("accessToken");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [membersResponse, jobsResponse] = await Promise.all([
          axios.get("http://147.93.53.128:8888/admin/users/members", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://147.93.53.128:8888/admin/job", {
            headers: { Authorization: `Bearer ${token}` },
          })
        ]);

        setMembers(membersResponse.data.Members || []);
        setJobs(jobsResponse.data.jobs || []);
      } catch (error) {
        console.error("Error fetching data:", error);
        setMessage("حدث خطأ في تحميل البيانات");
        setMessageType("error");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchData();
    } else {
      setMessage("يرجى تسجيل الدخول أولاً");
      setMessageType("error");
      setLoading(false);
    }
  }, [token]);

  const handleChange = (evt) => {
    const { name, value, files } = evt.target;
    if (name === "image") {
      setState((prevState) => ({
        ...prevState,
        image: files[0],
      }));
    } else {
      setState((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const resetForm = () => {
    setState({
      typeOfUser: "",
      image: null,
      name: "",
      phone: "",
      password: "",
    });
    document.querySelector('input[name="image"]').value = null;
  };

  const validatePhone = (phone) => /^[0-9]{10,15}$/.test(phone);
  const validatePassword = (password) => password.length >= 6;

  const handleOnSubmit = async (evt) => {
    evt.preventDefault();
    setSubmitting(true);
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("name", state.name);
      formData.append("phone", state.phone);
      formData.append("password", state.password);
      formData.append("typeOfUser", state.typeOfUser);
      if (state.image) {
        formData.append("image", state.image);
      }

      const response = await axios.post(
        "http://147.93.53.128:8888/member/auth/create",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        setMessage(response.data.Message || "تم إنشاء الحساب بنجاح");
        setMessageType("success");
        resetForm();

        setTimeout(async () => {
          try {
            const membersResponse = await axios.get("http://147.93.53.128:8888/admin/users/members", {
              headers: { Authorization: `Bearer ${token}` },
            });
            setMembers(membersResponse.data.Members || []);
            setMessage("");
          } catch (error) {
            console.error("Error refreshing members:", error);
          }
        }, 2000);
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 500) {
          setMessage("البريد الإلكتروني مستخدم من قبل");
        } else if (error.response.status === 400) {
          setMessage("البيانات المدخلة غير صحيحة");
        } else {
          setMessage("حدث خطأ في الخادم");
        }
      } else {
        setMessage("خطأ في الاتصال بالخادم");
      }
      setMessageType("error");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <h2>جاري تحميل البيانات...</h2>
      </div>
    );
  }

  return (
    <div>
      <h1 className="AdminPage">موظفين وفود</h1>

      {message && <div className={`message ${messageType}`}>{message}</div>}

      <div className="table-wrapper">
        <table className="fl-table">
          <thead>
            <tr>
              <th>الدردشة</th>
              <th>رمز تعريفي</th>
              <th>الصوره</th>
              <th>الاسم</th>
              <th>الوظيفة</th>
              <th>رقم الهاتف</th>
              <th>الايميل</th>
              <th>حالة الجهاز</th>
            </tr>
          </thead>
          <tbody>
            {members.length > 0 ? (
              members.map((member) => (
                <tr key={member._id}>
                  <td>
                    {member.deviceIP ? (
                      <Link to={`/dashboard/chat/${member._id}`} className="chat-link">
                        <FiMessageCircle size={20} color="#007bff" />
                      </Link>
                    ) : (
                      <span className="no-chat">غير متاح</span>
                    )}
                  </td>
                  <td>
                    <Link to={`${member._id}`} className="member-link">
                      {member._id}
                    </Link>
                  </td>
                  <td>
                    {member.image ? (
                      <img
                        src={`http://147.93.53.128:8888/uploads/MemberImages/${member.image}`}
                        alt={member.name}
                        className="member-image"
                      />
                    ) : (
                      <span className="no-image">لا توجد صورة</span>
                    )}
                  </td>
                  <td>{member.name}</td>
                  <td>{member.typeOfUser?.nameAr || "غير محدد"}</td>
                  <td>{member.phone}</td>
                  <td>{member.email}</td>
                  <td>
                    <span className={`status ${member.deviceIP ? "registered" : "not-registered"}`}>
                      {member.deviceIP ? "مسجل" : "غير مسجل"}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="no-data">
                  لا توجد بيانات للعرض
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="container2">
        <form id="contact" onSubmit={handleOnSubmit}>
          <h3>إنشاء حساب عضو جديد</h3>
          <br />
          <fieldset>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
              placeholder="صورة العضو"
              tabIndex="5"
              required
            />
          </fieldset>
          <fieldset>
            <input
              type="text"
              name="name"
              value={state.name}
              onChange={handleChange}
              placeholder="اسم العضو"
              tabIndex="1"
              required
              minLength="2"
            />
          </fieldset>

          <fieldset>
            <input
              type="tel"
              name="phone"
              value={state.phone}
              onChange={handleChange}
              placeholder="رقم هاتف العضو"
              tabIndex="2"
              required
              pattern="[0-9]{10,15}"
              title="يجب أن يكون رقم الهاتف من 10 إلى 15 رقم"
            />
            {state.phone && !validatePhone(state.phone) && (
              <small className="error-text">رقم الهاتف غير صحيح</small>
            )}
          </fieldset>

          <fieldset>
            <input
              type="password"
              name="password"
              value={state.password}
              onChange={handleChange}
              placeholder="كلمة مرور حساب العضو"
              tabIndex="3"
              required
              minLength="6"
            />
            {state.password && !validatePassword(state.password) && (
              <small className="error-text">كلمة المرور يجب أن تكون 6 أحرف على الأقل</small>
            )}
          </fieldset>

          <fieldset>
            <select
              name="typeOfUser"
              value={state.typeOfUser}
              onChange={handleChange}
              tabIndex="4"
              required
            >
              <option value="">اختر الوظيفة</option>
              {jobs.map((job) => (
                <option key={job._id} value={job._id}>
                  {job.nameAr} - {job.serviceId?.nameAr || "غير محدد"}
                </option>
              ))}
            </select>
          </fieldset>

          <fieldset>
            <button
              name="submit"
              type="submit"
              id="contact-submit"
              disabled={submitting}
              className={submitting ? "loading" : ""}
            >
              {submitting ? "جاري الإنشاء..." : "إنشاء حساب"}
            </button>
          </fieldset>
        </form>
      </div>
    </div>
  );
};

export default Members;
