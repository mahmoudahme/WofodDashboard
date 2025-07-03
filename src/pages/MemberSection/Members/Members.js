import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./Members.css"
import { FiMessageCircle } from 'react-icons/fi'; // حطها فوق في الاستيرادات
const Members = () => {
  const [members, setMembers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [state, setState] = useState({
    typeOfUser: "",
    name: "",
    phone: "",
    password: "",
  });
  const [Message, setMessage] = useState(); // لتخزين الرسالة

  const token = window.localStorage.getItem("accessToken");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://147.79.101.225:8888/admin/users/members", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMembers(response.data.Members);

        const response2 = await axios.get("http://147.79.101.225:8888/admin/job", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setJobs(response2.data.jobs);

      } catch (error) {
        console.error(error.message);
      }
    };
    fetchData();
  }, []);

  const handleChange = (evt) => {
    const { name, value } = evt.target;
    setState({
      ...state,
      [name]: value,
    });
  };

  const handleOnSubmit = async (evt) => {
    evt.preventDefault();
    try {
      const response = await axios.post("http://147.79.101.225:8888/member/auth/create", state, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      if (response.status === 200) {
        setMessage(response.data.Message);
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 500) {
          setMessage("Email Is Used Before");
        }
      } else {
        console.log("Connection Error:", error.message);
        alert(error.message);
      }
    }
  };
  return (
    <div>
      <h1 className="AdminPage"> موظفين وفود</h1>
      <div className="table-wrapper">
        <table className="fl-table">
          <thead>
            <tr>
              <th>الدردشه</th>
              <th>رمز تعريفي</th>
              <th>الاسم</th>
              <th>الوظيفه</th>
              <th>رقم الهاتف</th>
              <th>الايميل</th>
              <th>الجهاز IP</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member) => (
              <tr key={member._id}>
                <td>
                  {member.deviceIP == "" ? "" : <Link to={`/dashboard/chat/${member._id}`} className="chat-link">
                      <FiMessageCircle size={20} color="black" />
                    </Link>}
                </td>
                <td>
                  <Link to={`${member._id}`}>{member._id}</Link>
                </td>
                <td>{member.name}</td>
                <td>{member.typeOfUser?.nameAr}</td>
                <td>{member.phone}</td>
                <td>{member.email}</td>
                <td>{member.deviceIP == "" ? "Not Registered" : "Registered"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="container2">
        <form id="contact" onSubmit={handleOnSubmit}>
          <h3>انشاء حساب عضو جديد</h3>
          <br />
          {Message && <h4 className="RegisteMessage">{Message}</h4>}
          <fieldset>
            <input
              type="text"
              name="name"
              value={state.name}
              onChange={handleChange}
              placeholder="اسم العضو"
              tabIndex="1"
              required
            />
          </fieldset>
          <fieldset>
            <input
              type="text"
              name="phone"
              value={state.phone}
              onChange={handleChange}
              placeholder="رقم هاتف العضو"
              tabIndex="2"
              required
            />
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
            />
          </fieldset>

          <fieldset>
            <select
              name="typeOfUser"
              value={state.typeOfUser}
              onChange={handleChange}
              tabIndex="4"
              required
            >
              {jobs.map((job) => (
                <option key={job._id} value={job._id}>
                  {job.nameAr} - {job.serviceId.nameAr}
                </option>
              ))}

            </select>
          </fieldset>

          <fieldset>
            <button name="submit" type="submit" id="contact-submit" data-submit="...Sending">
              Create
            </button>
          </fieldset>

        </form>
      </div>
    </div>
  );
};

export default Members;

