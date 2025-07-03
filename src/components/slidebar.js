import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaUserTie, FaDashcube, FaUserShield, FaServicestack, FaFly, FaCar,
  FaPlane, FaRoad, FaCity, FaMandalorian, FaNetworkWired,
  FaRegUserCircle, FaHotel, FaTrain, FaRestroom, FaChartArea,
  FaJoomla, FaMoneyBill
} from "react-icons/fa";

const Sidebar = () => {
  const location = useLocation();
  const userRole = localStorage.getItem("role");

  const styles = {
    sidebar: {
      margin: "0 0 0 20px",
      width: "300px",
      height: "calc(100vh - 40px)",
      backgroundColor: "#1c1c1c",
      color: "#fff",
      padding: "20px",
      // borderRadius: "8px",
      display: "flex",
      flexDirection: "column",
      gap: "8px",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
      textAlign: "right",
      overflowY: "auto",
      position: "sticky",
      top: "20px",
      scrollbarWidth: "thin",
      scrollbarColor: "#D4AF37 #2c2c2c",
    },
    menu: {
      listStyleType: "none",
      padding: 0,
      margin: 0,
      width: "100%",
    },
    menuItem: (isActive) => ({
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "12px 15px",
      borderRadius: "8px",
      backgroundColor: isActive ? "#D4AF37" : "transparent",
      color: isActive ? "#1c1c1c" : "#ccc",
      transition: "all 0.3s ease",
      cursor: "pointer",
      marginBottom: "4px",
      border: isActive ? "2px solid #D4AF37" : "2px solid transparent",
    }),
    menuItemHover: {
      backgroundColor: "#2c2c2c",
      color: "#D4AF37",
      transform: "translateX(-2px)",
    },
    link: {
      textDecoration: "none",
      color: "inherit",
      fontSize: "15px",
      fontWeight: 500,
      flex: 1,
      textAlign: "right",
      display: "block",
      width: "100%",
    },
    icon: {
      fontSize: "18px",
      color: "inherit",
      marginLeft: "10px",
      minWidth: "18px",
    },
    sectionHeader: {
      borderBottom: "2px solid #D4AF37",
      paddingBottom: "8px",
      margin: "20px 0 10px",
      color: "#D4AF37",
      fontSize: "16px",
      fontWeight: "bold",
      textAlign: "right",
      background: "linear-gradient(90deg, transparent, #D4AF37, transparent)",
      backgroundSize: "100% 1px",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "bottom",
    },
  };

  const menuItems = [
    ...(userRole === "super_admin" || userRole === "user_Requests" || userRole === "application" ? [
      { to: "/dashboard", label: "الصفحة الرئيسية", icon: <FaDashcube /> },
    ] : []),
    ...(userRole === "super_admin" ? [
      { to: "/dashboard/admins", label: "الإدمن", icon: <FaUserShield /> },
    ] : []),
    ...(userRole === "super_admin" || userRole === "user_Requests" ? [
      { label: "قسم المستخدمين" },
      { to: "/dashboard/users", label: "المستخدمين", icon: <FaUserTie /> },
      { to: "/dashboard/requests", label: "الطلبات", icon: <FaRegUserCircle /> },
      { to: "/dashboard/contact", label: "التواصل", icon: <FaChartArea /> },
    ] : []),
    ...(userRole === "super_admin" || userRole === "user_Requests" ? [
      { label: "قسم الأعضاء" },
      { to: "/dashboard/members", label: "أعضاء وفود", icon: <FaUserShield /> },
      { to: "/dashboard/applications", label: "طلبات التوظيف", icon: <FaJoomla /> },
      { to: "/dashboard/training", label: "طلبات التدريب", icon: <FaJoomla /> },
      { to: "/dashboard/bill", label: "فواتير الأعضاء", icon: <FaMoneyBill /> },
    ] : []),
    ...(userRole === "super_admin" || userRole === "application" ? [
      { label: "قسم التطبيق" },
      { to: "/dashboard/services", label: "الخدمات", icon: <FaServicestack /> },
      { label: "الطيران" },
      { to: "/dashboard/airports", label: "المطارات", icon: <FaFly /> },
      { to: "/dashboard/airline", label: "خطوط الطيران", icon: <FaPlane /> },
      { to: "/dashboard/arrivalhall", label: "صالات الوصول", icon: <FaRoad /> },
      { to: "/dashboard/class", label: "درجات الطيران", icon: <FaPlane /> },
      { label: "التنقل" },
      { to: "/dashboard/cars", label: "السيارات", icon: <FaCar /> },
      { label: "الفنادق" },
      { to: "/dashboard/hotels", label: "الفنادق", icon: <FaHotel /> },
      { to: "/dashboard/rooms", label: "الغرف", icon: <FaRestroom /> },
      { label: "القطارات" },
      { to: "/dashboard/city", label: "المدن", icon: <FaCity /> },
      { to: "/dashboard/stations", label: "محطات القطارات", icon: <FaTrain /> },
      { label: "الوظائف" },
      { to: "/dashboard/job", label: "وظائف", icon: <FaMandalorian /> },
      { to: "/dashboard/typeofwork", label: "أنواع العمالة", icon: <FaNetworkWired /> },
    ] : []),
  ];

  return (
    <div style={styles.sidebar}>
      <ul style={styles.menu}>
        {menuItems.map((item, index) =>
          item.to ? (
            <li 
              key={index} 
              style={styles.menuItem(location.pathname === item.to)}
              onMouseEnter={(e) => {
                if (location.pathname !== item.to) {
                  Object.assign(e.target.style, styles.menuItemHover);
                }
              }}
              onMouseLeave={(e) => {
                if (location.pathname !== item.to) {
                  e.target.style.backgroundColor = "transparent";
                  e.target.style.color = "#ccc";
                  e.target.style.transform = "translateX(0)";
                }
              }}
            >
              <Link to={item.to} style={styles.link}>{item.label}</Link>
              <span style={styles.icon}>{item.icon}</span>
            </li>
          ) : (
            <h4 key={index} style={styles.sectionHeader}>{item.label}</h4>
          )
        )}
      </ul>
    </div>
  );
};

export default Sidebar;