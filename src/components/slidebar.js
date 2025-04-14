import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FaUserTie , FaDashcube, FaUserShield , FaServicestack, FaFly , FaCar ,FaPlane , FaRoad, FaCity, FaMandalorian, FaNetworkWired, FaRegUserCircle, FaHotel, FaTrain, FaRestroom, FaChartArea, FaJoomla} from "react-icons/fa";

const Sidebar = () => {
  const location = useLocation();
  const userRole = localStorage.getItem("role"); // الحصول على الرول من localStorage

  const styles = {
    sidebar: {
      margin: "-20px 20px",
      width: "350px",
      height: "auto",
      backgroundColor: "#252525",
      color: "#D4AF37",
      padding: "20px",
      borderRadius: "8px",
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-end",
      gap: "15px",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
      textAlign: "right"

    },
    menu: {
      listStyleType: "none",
      padding: 0,
      margin: "20px 0px",
      width: "100%",
      textAlign: "right"

    },
    menuItem: (isActive) => ({
      display: "flex",
      alignItems: "center",
      gap: "10px",
      padding: "10px",
      borderRadius: "10px",
      transition: "background-color 0.3s ease",
      backgroundColor: isActive ? "#D4AF37" : "transparent",
      color: isActive ? "#fff" : "#ecf0f1",
    }),
    link: {
      textDecoration: "none",
      color: "inherit",
      fontSize: "16px",
      fontWeight: "500",
      flex: 1,
    },
    icon: {
      fontSize: "20px",
      color: "inherit",
      textAlign: "right",
    },
    h4: {
      textDecoration: "underline",
      margin: "10px 0",    // إضافة مسافة من الأعلى والأسفل
      color: "#ecf0f1",    // التأكد من أن اللون يتناسب مع باقي النصوص
      textShadow: "2px 1px 0px #D4AF37",
      fontSize: "18px",    // تحديد حجم الخط
      fontWeight: "bold",  // تحديد وزن الخط
      textAlign: "right",   // محاذاة النص لليسار
      paddingLeft: "10px", // إضافة مسافة من الجهة اليسرى لجعل النص أكثر تميزًا
    },
  };

  // تحديد العناصر التي يجب عرضها بناءً على الرول
  const menuItems = [
    ...(userRole === "super_admin" || userRole === "user_Requests" || userRole === "application" ? [
      { to: "/dashboard", label: "الصفحه الرئسيه", icon: <FaDashcube /> },
    ] : []),
    ...(userRole === "super_admin" ? [
      { to: "/dashboard/admins", label: "الادمن", icon: <FaUserShield /> },
    ] : []),
    ...(userRole === "super_admin" || userRole === "user_Requests" ? [
      { label: "قسم المستخدمين" },
      { to: "/dashboard/users", label: "المستخدمين", icon: <FaUserTie /> },
      { to: "/dashboard/requests", label: "الطلبات", icon: <FaRegUserCircle /> },
      { to: "/dashboard/contact", label: "التواصل", icon: <FaChartArea /> },
    ] : []),
    ...(userRole === "super_admin" || userRole === "user_Requests" ? [
      { label: "قسم الاعضاء" },
      { to: "/dashboard/members", label: "اعضاء وفود", icon: <FaUserShield /> },
      { to: "/dashboard/applications", label: "طلبات التوظيف", icon: <FaJoomla /> },
      { to: "/dashboard/training", label: "طلبات التدريب", icon: <FaJoomla /> },


    ] : []),
    ...(userRole === "super_admin" || userRole === "application" ? [
      { label:"قسم الابلكيشن" },
      { to: "/dashboard/services", label: "الخدمات", icon: <FaServicestack /> },
      { label:"الطيران" },
      { to: "/dashboard/airports", label: "المطارات", icon: <FaFly /> },
      { to: "/dashboard/airline", label: "خطوط الطيران", icon: <FaPlane /> },
      { to: "/dashboard/arrivalhall", label: "صالات الوصول", icon: <FaRoad /> },
      { to: "/dashboard/class", label: "درجات الطيران", icon: <FaPlane /> },
      { label:"التنقل" },
      { to: "/dashboard/cars", label: "السيارات", icon: <FaCar /> },
      { label:"الفنادق" },
      { to: "/dashboard/hotels", label: "الفنادق", icon: <FaHotel /> },
      { to: "/dashboard/rooms", label: "الغرف", icon: <FaRestroom /> },
      { label:"القطارات" },
      { to: "/dashboard/city", label: "المدن", icon: <FaCity /> },
      { to: "/dashboard/stations", label: "محطات القطارات", icon: <FaTrain /> },
      { label:"الوظائف" },
      { to: "/dashboard/job", label: "وظائف", icon: <FaMandalorian /> },
      { to: "/dashboard/typeofwork", label: "انواع العماله", icon: <FaNetworkWired /> },

    ] : []),
  ];

  return (
    <div style={styles.sidebar}>
      <ul style={styles.menu}>
        {menuItems.map((item) => (
        item.to ? (
          <li key={item.to} style={styles.menuItem(location.pathname === item.to)}>
          
          <Link to={item.to} style={styles.link}>
              {item.label}
          </Link>
          {item.icon}
          </li>
        ) : (
          <h4 style={styles.h4}>{item.label}</h4>
        )
          
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
