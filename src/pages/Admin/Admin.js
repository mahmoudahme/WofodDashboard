import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./Admin.css"
const Admins = () => {
  const [admin, setAdmin] = useState([]);
  const [state, setState] = useState({
    name:"" ,
    email: "",
    password: "",
    role: "" // لتخزين العنصر الذي يختاره المستخدم
  });
  const [Message, setMessage] = useState(); // لتخزين الرسالة

  const token = window.localStorage.getItem("accessToken");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://147.93.53.128:8888/admin/users/admin", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAdmin(response.data.AllAdmins);
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
      [name]: value, // تحديث الحالة بناءً على الحقل الذي تم تغييره
    });
  };

  const handleOnSubmit = async (evt) => {
    evt.preventDefault();
    const { fisrtName, lastName, email, password, selectedElement } = state;

    try {
      const response = await axios.post("http://147.93.53.128:8888/admin/auth/register/", state);
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
      <h1 className="AdminPage">Admins Page</h1>
      <div className="table-wrapper">
        <table className="fl-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {admin.map((admin) => (
              <tr key={admin._id}>
                <td>
                  <Link to={`${admin._id}`}>{admin._id}</Link>
                </td>
                <td>{admin.name}</td>
                <td>{admin.email}</td>
                <td>{admin.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="container2">
        <form id="contact" onSubmit={handleOnSubmit}>
          <h3>Create New Admin</h3>
          <br />
          {Message && <h4 className="RegisteMessage">{Message}</h4>}
          <fieldset>
            <input
              type="text"
              name="name"
              value={state.name}
              onChange={handleChange}
              placeholder="Enter Your Last Name"
              tabIndex="1"
              required
            />
          </fieldset>
          <fieldset>
            <input
              type="email"
              name="email"
              value={state.email}
              onChange={handleChange}
              placeholder="Email"
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
              placeholder="Password"
              tabIndex="3"
              required
            />
          </fieldset>

          {/* حقل الاختيار الجديد الذي يحتوي على 3 عناصر */}
          <fieldset>
            <select
              name="role"
              value={state.role}
              onChange={handleChange}
              tabIndex="4"
              required
            >
              <option value="">Select Admin Role</option>
              <option value="super_admin">Super Admin</option>
              <option value="user_Requests">User Requests</option>
              <option value="application">Application</option>

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

export default Admins;
