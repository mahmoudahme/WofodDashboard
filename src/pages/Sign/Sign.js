import React, { useState } from "react";
import "./styles.css";
import logo from "./wofod.svg";
import SignInForm from "./SignIn";


export default function Sign() {
  const [type, setType] = useState("signIn");
  const handleOnClick = text => {
    if (text !== type) {
      setType(text);
      return;
    }
  };
  const containerClass =
    "container " + (type === "signUp" ? "right-panel-active" : "");
  return (
    <div className="App">
      {/* <img src={logo} style={{width:"150px"}} fill='red'></img> */}
      <h2 className="Hello" style={{ color: "white" }}>التسجيل الخاص بلوحة التحكم</h2>
      <br />
      <div className={containerClass} id="container">
        <SignInForm />
        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-right">
              <img src={logo} style={{ width: "150px" }}></img>
              <h1 className="Hello" >مرحبا بعودتك ايها المسئول</h1>
              <p>تابع عملائك و طلباتاتهم  و يمكنك التحكم في الطلبات الخاصه بالعملاء و يمكنك التحكم في الداتا الخاصه بالتطبيق</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
