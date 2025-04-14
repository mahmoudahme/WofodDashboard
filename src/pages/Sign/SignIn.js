import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"
function SignInForm() {
  const [state, setState] = useState({
    email: "",
    password: ""
  });
  const [message, setMessage] = useState("")
  const [show, setShow] = useState(false)
  const navigate = useNavigate();

  const handleChange = evt => {
    const value = evt.target.value;
    setState({
      ...state,
      [evt.target.name]: value
    });
  };

  const handleOnSubmit = async evt => {
    evt.preventDefault();

    try {
      const response = await axios.post("http://147.79.101.225:8888/admin/auth/login", state);

      if (response.status === 200) {
        // إذا كان الطلب ناجحاً
        navigate("/dashboard");
        window.localStorage.setItem("accessToken", response.data.token);
        window.localStorage.setItem("Fullname", response.data.details.name)
        window.localStorage.setItem("role", response.data.details.role);
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
          setMessage(error.response.data.Message);
          console.log(message)
        }
      } else {
        alert(error.message);
      }
    }
  };

  const showPassword = () => {
    if (show) {
     setShow(false)
    } else {
      setShow(true)
    }
  }
  return (
    <div className="form-container sign-in-container">
      <form onSubmit={handleOnSubmit} className="formsign">
        <h1 style={{ color: "#D4AF37" }}>تسجيل الدخول</h1>

        <span>استخدم الاكونت الخاص بك</span>
        <input
          type="email"
          placeholder="ادخل البريد الالكتروني الخاص بك "
          name="email"
          value={state.email}
          onChange={handleChange}
        />
        <input
          type= {show ? "text" : "password"}
          name="password"
          placeholder="ادخل كلمة المرور الخاصه بالبريد الالكتروني"
          value={state.password}
          onChange={handleChange}
        />
        <p onClick={showPassword} style={{display : "inline-flex"}}>show</p>
        {message && <h4 style={{ color: "#0268d4" }}>{message}</h4>}
        <button className = "button" style={{ backgroundColor: "#D4AF37" }}>تسجيل</button>
      </form>
    </div>
  );
}

export default SignInForm;
