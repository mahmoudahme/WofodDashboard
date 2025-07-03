import React, { useEffect, useState } from "react";
import { Grid, Paper, Typography, Snackbar, CircularProgress, Button, IconButton, List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import { Line, Bar, Pie } from "react-chartjs-2";
import { Chart as ChartJS, LineElement, BarElement, CategoryScale, LinearScale, PointElement, ArcElement } from "chart.js";
import axios from "axios";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Notifications, Warning, CheckCircle, Info } from "@mui/icons-material"; // أيقونات للإشعارات
import "./dashbord.css";
import { Delete } from "@mui/icons-material";
import { Login as LoginIcon, Payment as PaymentIcon } from '@mui/icons-material'; // استيراد الأيقونات
import { format } from 'date-fns'; // استيراد دالة التنسيق من date-fns

ChartJS.register(LineElement, BarElement, CategoryScale, LinearScale, PointElement, ArcElement);

// مكون خاص لعرض البطاقات مع التحريك


const Dashboard = () => {
  
  return (
    <div></div>
  );
};

export default Dashboard;