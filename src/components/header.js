import React, { useState } from "react";
import logo from "../pages/Sign/wofod.svg";
import { useNavigate } from "react-router-dom";
import { FaUserTie } from "react-icons/fa";
import { width } from "@mui/system";

const Header = () => {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const Fullname = localStorage.getItem("Fullname");
  const userRole = localStorage.getItem("role");

  const handleLogout = () => {
    setShowModal(true);
  };

  const confirmLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userName");
    localStorage.removeItem("role");
    navigate("/");
    setShowModal(false);
  };

  const cancelLogout = () => {
    setShowModal(false);
  };

  const styles = {
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: "#252525", // الأزرق الغامق
      color: "#ECF0F1", // الرمادي الفاتح
      padding: "15px 25px",
      boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
      borderRadius: "8px",
      margin: "10px 20px",
    },
    image: {
      width: "120px",
      marginLeft: "30px"
    },
    userInfo: {
      display: "flex",
      alignItems: "center",
      width : "350px" // لمحاذاة اسم المستخدم وزر تسجيل الخروج في نفس الصف
    },
    username: {
      fontSize: "16px",
      color: "#ECF0F1", // الرمادي الفاتح
      marginRight: "20px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center", 
      width:"161px"// المسافة بين اسم المستخدم وزر تسجيل الخروج
    },
    logoutButton: {
      width: "150px",
      padding: "10px 20px",
      backgroundColor: "#D4AF37", // الأخضر الزيتونيD
      color: "#2C3E50", // الأزرق الغامق
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      fontSize: "16px",
      transition: "all 0.3s ease",
      fontFamily: "Arial, sans-serif",
    },
    logoutButtonHover: {
      backgroundColor: "#A3B18A", // الذهبي الناعم
      boxShadow: "0px 4px 10px rgba(212, 175, 55, 0.5)", // الذهبي الناعم
    },
    modalOverlay: {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000,
    },
    modal: {
      backgroundColor: "#ECF0F1", // الرمادي الفاتح
      borderRadius: "10px",
      padding: "20px",
      width: "500px",
      textAlign: "center",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
      color: "#2C3E50", // الأزرق الغامق
    },
    modalActions: {
      margin: "20px",
      display: "flex",
      justifyContent: "space-around",
    },
    confirmButton: {
      backgroundColor: "#A3B18A", // الأخضر الزيتوني
      color: "#2C3E50", // الأزرق الغامق
      border: "none",
      padding: "10px 20px",
      borderRadius: "5px",
      cursor: "pointer",
      fontSize: "16px",
      transition: "0.3s",
      width: "45%"
    },
    cancelButton: {
      backgroundColor: "#D4AF37", // الذهبي الناعم
      color: "#2C3E50", // الأزرق الغامق
      border: "none",
      padding: "10px 20px",
      borderRadius: "5px",
      cursor: "pointer",
      fontSize: "16px",
      transition: "0.3s",
      width: "45%"
    },
    icon: {
      fontSize: "20px",
      color: "#ECF0F1", // الرمادي الفاتح
      margin: "5px",
    },
  };

  return (
    <header style={styles.header}>

      <div style={styles.userInfo}>
        <div style={{display : "flex" , justifyContent:"space-between"}}>
          <button
            onClick={handleLogout}
            style={styles.logoutButton}
            onMouseOver={(e) =>
              (e.target.style.backgroundColor = styles.logoutButtonHover.backgroundColor)
            }
            onMouseOut={(e) =>
              (e.target.style.backgroundColor = styles.logoutButton.backgroundColor)
            }
          >
            تسجيل خروج
          </button>
          <div style={styles.username}>
            <FaUserTie style={styles.icon} />
            {Fullname}
          </div>

        </div>


      </div>
      <img src={logo} alt="Logo" style={styles.image} />


      {showModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h2>هل انت متاكد من تسجيل الخروج </h2>
            <div style={styles.modalActions}>
            <button onClick={cancelLogout} style={styles.cancelButton}>
                لا
              </button>
              <button onClick={confirmLogout} style={styles.confirmButton}>
                نعم
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;