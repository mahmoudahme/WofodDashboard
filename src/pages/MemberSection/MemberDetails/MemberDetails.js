import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./MembersDetails.css"; // ملف CSS لتنسيق الفورم

const MemberDetails = () => {
  const params = useParams()
  const token = window.localStorage.getItem("accessToken");
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);

  const [memberData, setmemberDataa] = useState({
    name: "",
    phone: "",
    email: "",
    typeOfUser: "",
  });

  const [isLoading, setIsLoading] = useState(true); // حالة تحميل البيانات

  const memberId = params.id;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://147.93.53.128:8888/admin/users/members/${memberId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setmemberDataa(response.data.member);
        setIsLoading(false);

        const response2 = await axios.get("http://147.93.53.128:8888/admin/job", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setJobs(response2.data.jobs);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault(); // منع تحميل الصفحة عند إرسال البيانات

    try {
      const response = await axios.put(
        `http://147.93.53.128:8888/admin/users/members/${memberId}`,
        memberData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      window.location.reload()
    } catch (error) {
      console.error("Error updating data", error);
    }
  };

  const deletemember = async (event) => {
    event.preventDefault(); // منع تحميل الصفحة عند إرسال البيانات

    try {
      const response = await axios.delete(
        `http://147.93.53.128:8888/admin/users/members/${memberId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      navigate("/dashboard/members");
    } catch (error) {
      console.error("Error Deleting data", error);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
  
    if (name === "typeOfUser") {
      const selectedJob = jobs.find((job) => job._id === value);
  
      setmemberDataa((prevData) => ({
        ...prevData,
        typeOfUser: selectedJob, // نحفظ الكائن كله مش بس الـ id
        serviceId: selectedJob?.serviceId?._id || "", // نحدّث serviceId
      }));
    } else {
      setmemberDataa((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }
  //
  return (
    <div>
      <h1 className="memberDetailsPage">{memberData.name}</h1>

      <form onSubmit={handleSubmit} className="formForcustomer">
        <div className="div">
          <label className="labelFormember">اسم المستخدم </label>

          <input
            className="inputFormember2"
            type="text"
            name="name"
            value={memberData.name}
            onChange={handleChange}
          />
        </div>
        <div className="div">
          <label className="labelFormember">البريد الالكتروني</label>

          <input
            className="inputFormember2"
            type="email"
            name="email"
            value={memberData.email}
            onChange={handleChange}
          />

        </div>
        <div className="div">
          <label className="labelFormember">الهاتف</label>

          <input
            className="inputFormember2"
            type="text"
            name="phone"
            value={memberData.phone}
            onChange={handleChange}
          />

        </div>
        <div className="div">
          <label className="labelFormember">الوظيفه</label>
          <select
            className="inputFormember2"
            name="typeOfUser"
            value={memberData.typeOfUser}
            onChange={handleChange}

          >
            {jobs.map((job) => (
              <option key={job._id} value={job._id}>
                {job.nameAr} - {job.serviceId.nameAr}
              </option>
            ))}

          </select>
        </div>
        <br />
        <br />
        <div className="buttonForm">
          <button type="submit" className="button" >تعديل البيانات</button>
        </div>
      </form>
      <form onSubmit={deletemember} className="formForcustomer" >
        <div className="buttonForm">
          <button type="submit" className="button" id="button">حذف المستخدم</button>
        </div>
      </form>
    </div>

  );
};

export default MemberDetails;
