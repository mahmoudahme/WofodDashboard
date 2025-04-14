import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./users.css"
const Users = () => {
  const [users, setUsers] = useState([]);

  const token = window.localStorage.getItem("accessToken");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://147.79.101.225:8888/admin/users/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(response.data.allUsers);
      } catch (error) {
        console.error(error.message);
      }
    };
    fetchData();
  }, []);


  return (
    <div>
      <h1 className="UsersPage">المستخدمين</h1>
      <div className="table-wrapper">
        <table className="fl-table">
          <thead>
            <tr>
              <th>رمز تعرفي</th>
              <th>اسم المستخدم</th>
              <th>البريد الالكتروني</th>
              <th>الهاتف</th>
              <th>مفعل</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>
                  <Link to={`${user._id}`}>{user._id}</Link>
                </td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.phone}</td>
                <td>{user.otp == user.recievedOTP ? "Verify" : "Not Verify"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Users;
