import React, { useState } from "react";
import logo from "../pages/Sign/wofod.svg";
import { useNavigate } from "react-router-dom";
import { FaUserTie, FaSignOutAlt } from "react-icons/fa";

const Header = () => {
  const [showModal, setShowModal] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  const Fullname = localStorage.getItem("Fullname");
  const userRole = localStorage.getItem("role");

  const handleLogout = () => {
    setShowModal(true);
  };

  const confirmLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userName");
    localStorage.removeItem("Fullname");
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
      backgroundColor: "#1c1c1c",
      color: "#ECF0F1",
      padding: "15px 25px",
      boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
      // borderRadius: "8px",
      // margin: "10px 20px",
      position: "relative",
      zIndex: 100,
      direction: "rtl"

    },
    logoContainer: {
      display: "flex",
      alignItems: "center",
    },
    logo: {
      width: "120px",
      height: "auto",
      objectFit: "contain",
    },
    userInfo: {
      display: "flex",
      alignItems: "center",
      gap: "20px",
    },
    userDetails: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      backgroundColor: "#1c1c1c",
      padding: "8px 15px",
      borderRadius: "25px",
      border: "2px solid #D4AF37",
    },
    username: {
      fontSize: "16px",
      color: "#ECF0F1",
      fontWeight: "500",
      whiteSpace: "nowrap",
    },
    userIcon: {
      fontSize: "20px",
      color: "#D4AF37",
    },
    logoutButton: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      padding: "10px 20px",
      backgroundColor: isHovered ? "#A3B18A" : "#D4AF37",
      color: "#1c1c1c",
      border: "none",
      borderRadius: "25px",
      cursor: "pointer",
      fontSize: "16px",
      fontWeight: "600",
      transition: "all 0.3s ease",
      fontFamily: "Arial, sans-serif",
      transform: isHovered ? "translateY(-2px)" : "translateY(0)",
      boxShadow: isHovered ? "0px 6px 12px rgba(212, 175, 55, 0.4)" : "0px 2px 4px rgba(0, 0, 0, 0.2)",
    },
    logoutIcon: {
      fontSize: "16px",
    },
    modalOverlay: {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0, 0, 0, 0.6)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000,
      backdropFilter: "blur(2px)",
    },
    modal: {
      backgroundColor: "#ECF0F1",
      borderRadius: "15px",
      padding: "30px",
      width: "450px",
      maxWidth: "90vw",
      textAlign: "center",
      boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)",
      color: "#2C3E50",
      border: "3px solid #D4AF37",
      animation: "slideIn 0.3s ease-out",
    },
    modalTitle: {
      fontSize: "20px",
      fontWeight: "bold",
      marginBottom: "20px",
      color: "#2C3E50",
    },
    modalActions: {
      display: "flex",
      justifyContent: "space-between",
      gap: "15px",
      marginTop: "25px",
    },
    confirmButton: {
      backgroundColor: "#A3B18A",
      color: "#2C3E50",
      border: "none",
      padding: "12px 25px",
      borderRadius: "8px",
      cursor: "pointer",
      fontSize: "16px",
      fontWeight: "600",
      transition: "all 0.3s ease",
      flex: 1,
    },
    cancelButton: {
      backgroundColor: "#D4AF37",
      color: "#2C3E50",
      border: "none",
      padding: "12px 25px",
      borderRadius: "8px",
      cursor: "pointer",
      fontSize: "16px",
      fontWeight: "600",
      transition: "all 0.3s ease",
      flex: 1,
    },
    // Responsive design
    "@media (max-width: 768px)": {
      header: {
        padding: "10px 15px",
        margin: "5px 10px",
      },
      logo: {
        width: "100px",
      },
      userDetails: {
        padding: "6px 10px",
      },
      username: {
        fontSize: "14px",
      },
      logoutButton: {
        padding: "8px 15px",
        fontSize: "14px",
      },
      modal: {
        width: "350px",
        padding: "20px",
      },
    },
  };

  // Add CSS keyframes for animation
  const keyframes = `
    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateY(-20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `;

  return (
    <>
      <style>{keyframes}</style>
      <header style={styles.header}>
        <div style={styles.logoContainer}>
          <img src={logo} alt="Logo" style={styles.logo} />
        </div>

        <div style={styles.userInfo}>
          <div style={styles.userDetails}>
            <FaUserTie style={styles.userIcon} />
            <span style={styles.username}>{Fullname || "مستخدم"}</span>
          </div>
          
          <button
            onClick={handleLogout}
            style={styles.logoutButton}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <FaSignOutAlt style={styles.logoutIcon} />
            تسجيل خروج
          </button>
        </div>
      </header>

      {showModal && (
        <div style={styles.modalOverlay} onClick={cancelLogout}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h2 style={styles.modalTitle}>تأكيد تسجيل الخروج</h2>
            <p>هل أنت متأكد من رغبتك في تسجيل الخروج؟</p>
            <div style={styles.modalActions}>
              <button 
                onClick={confirmLogout} 
                style={styles.confirmButton}
                onMouseEnter={(e) => e.target.style.transform = "translateY(-2px)"}
                onMouseLeave={(e) => e.target.style.transform = "translateY(0)"}
              >
                نعم، تسجيل خروج
              </button>
              <button 
                onClick={cancelLogout} 
                style={styles.cancelButton}
                onMouseEnter={(e) => e.target.style.transform = "translateY(-2px)"}
                onMouseLeave={(e) => e.target.style.transform = "translateY(0)"}
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;