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
const StatCard = ({ title, value, color, link, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, delay }}
  >
    <Grid item xs={12}>
      <Paper
        elevation={3}
        style={{
          margin: "20px",
          padding: "20px",
          backgroundColor: color,
          color: "#fff",
          borderRadius: "10px",
          textAlign: "center",
          width: "200px"
        }}
      >
        <Typography variant="h6">
          <Link to={link} style={{ color: "white", fontSize: "20px", fontWeight: "bold" }}>
            {title}
          </Link>
        </Typography>
        <Typography variant="h4" style={{ fontWeight: "bold", marginTop: "10px" }}>
          {value}
        </Typography>
      </Paper>
    </Grid>
  </motion.div>
);

const Dashboard = () => {
  const [lawyers, setLawyers] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [trainees, setTrainees] = useState([]);
  const [packages, setPackages] = useState([]);
  const [ads, setAds] = useState([]);
  const [messages, setMessages] = useState([]);
  const [packagePayments, setPackagePayments] = useState([]);
  const [adsPayments, setAdsPayments] = useState([]);
  const [packageTotal, setPackageTotal] = useState(0);
  const [adsTotal, setAdsTotal] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedYear, setSelectedYear] = useState(null); // السنة المحددة للمبيعات
  const [selectedUserYear, setSelectedUserYear] = useState(null); // السنة المحددة للمستخدمين
  const [visibleActivities, setVisibleActivities] = useState(2); // عدد الأنشطة المعروضة

  // وظيفة لعرض المزيد من الأنشطة
  // const toggleShowMore = () => {
  //   if (visibleActivities === 2) {
  //     setVisibleActivities(recentActivities.length); // عرض جميع الأنشطة
  //   } else {
  //     setVisibleActivities(2); // العودة لعرض أول نشاطين
  //   }
  // };
  const token = window.localStorage.getItem("accessToken");

  // بيانات المبيعات السنوية والشهرية
  const [yearlySalesData, setYearlySalesData] = useState({});
  // بيانات المستخدمين السنوية والشهرية
  const [yearlyUsersData, setYearlyUsersData] = useState({});

  // بيانات Recent Activities
  const [recentActivities, setRecentActivities] = useState([]);

  // بيانات System Health
  const [systemHealth, setSystemHealth] = useState({});


  // بيانات FAQs
  const [faqs, setFaqs] = useState([]);

  // بيانات Notifications
  const [notifications, setNotifications] = useState([]);

  // بيانات Trends
  const [trends, setTrends] = useState([]);

  // بيانات Goals
  const [goals, setGoals] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        // Fetch Lawyers
        const { data: lawyersData } = await axios.get("http://147.79.101.225:8080/api/user/lawyers", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLawyers(lawyersData.AllLawyers);

        // Fetch Customers
        const { data: customersData } = await axios.get("http://147.79.101.225:8080/api/user/customer", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCustomers(customersData.AllCustomer);

        // Fetch Trainees
        const { data: traineesData } = await axios.get("http://147.79.101.225:8080/api/user/trainee", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTrainees(traineesData.AllTrainee);

        // Fetch Packages
        const { data: packageData } = await axios.get("http://147.79.101.225:8080/api/package/admin", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPackages(packageData.Packages);

        // Fetch Ads
        const { data: AdsData } = await axios.get("http://147.79.101.225:8080/api/ads/admin", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAds(AdsData.Adss);

        // Fetch Messages
        const { data: Messagedata } = await axios.get("http://147.79.101.225:8080/api/contact", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessages(Messagedata.Messages);

        // Fetch Package Payments
        const { data: packagePaymentData } = await axios.get("http://147.79.101.225:8080/api/paypackage/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPackagePayments(packagePaymentData.Payments);
        const totalPackagePayments = packagePaymentData.Payments.reduce(
          (sum, payment) => sum + payment.packageID.price,
          0
        );
        setPackageTotal(totalPackagePayments);

        // Fetch Ads Payments
        const { data: adsPaymentData } = await axios.get("http://147.79.101.225:8080/api/payAds/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAdsPayments(adsPaymentData.Payments);
        const totalAdsPayments = adsPaymentData.Payments.reduce(
          (sum, payment) => sum + payment.AdsID.price,
          0
        );
        setAdsTotal(totalAdsPayments);

        // Process payments to get yearly and monthly data
        const allPayments = [...packagePaymentData.Payments, ...adsPaymentData.Payments];
        const salesData = {};

        allPayments.forEach((payment) => {
          const date = new Date(payment.createdAt);
          const year = date.getFullYear().toString();
          const month = date.getMonth(); // 0-11

          if (!salesData[year]) {
            salesData[year] = Array(12).fill(0); // Initialize array for 12 months
          }

          if (payment.AdsID) {
            salesData[year][month] += payment.AdsID.price;
          } else {
            salesData[year][month] += payment.packageID.price;
          }
        });

        setYearlySalesData(salesData);

        // Process users to get yearly and monthly data
        const allUsers = [...lawyersData.AllLawyers, ...customersData.AllCustomer, ...traineesData.AllTrainee];
        const usersData = {};

        allUsers.forEach((user) => {
          const date = new Date(user.createdAt);
          const year = date.getFullYear().toString();
          const month = date.getMonth(); // 0-11

          if (!usersData[year]) {
            usersData[year] = Array(12).fill(0); // Initialize array for 12 months
          }

          usersData[year][month] += 1;
        });

        setYearlyUsersData(usersData);

        //Fetch Recent Activities (مثال: يمكن استبدالها ب API)
        const activitiesResponse = await axios.get("http://147.79.101.225:8080/api/recent-activities", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const reversedActivities = [...activitiesResponse.data.Activites].reverse();
        setRecentActivities(reversedActivities);

        // Fetch System Health (مثال: يمكن استبدالها ب API)
        const healthResponse = await axios.get("http://147.79.101.225:8080/api/SystemHealth");
        setSystemHealth(healthResponse.data);

      } catch (error) {
        setError("Failed to fetch data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);
  const allUsers = lawyers.length + customers.length + trainees.length;
  const packa = packages.length;
  const Ads = ads.length;
  const totalPayments = packageTotal + adsTotal;
  const newMessages = messages.filter((msg) => { return msg.viewed === false });

  const handleDeleteNotification = (id) => {
    setNotifications((prevNotifications) =>
      prevNotifications.filter((notification) => notification.id !== id)
    );
  };

  const stats = [
    { title: "Lawyers", value: lawyers.length, color: "#002E60", link: "/dashboard/lawyers", delay: 0 },
    { title: "Customers", value: customers.length, color: "#0268d4", link: "/dashboard/customers", delay: 0.2 },
    { title: "Trainees", value: trainees.length, color: "#FFC107", link: "/dashboard/trainees", delay: 0.4 },
    { title: "Users", value: allUsers, color: "#333333  ", link: "/dashboard", delay: 0.6 },
    { title: "Packages", value: packa, color: "#039BE5 ", link: "/dashboard/packages", delay: 0.6 },
    { title: "Ads Packages", value: Ads, color: "#F4A100  ", link: "/dashboard/ads", delay: 0.6 },
    { title: "New messages", value: newMessages.length, color: "#E0E0E0   ", link: "/dashboard/contact", delay: 0.6 },
    { title: "Payments", value: `${totalPayments} SAR `, color: "#039BE5", link: "/dashboard/payments", delay: 0.8 },
  ];

  const pieData = {
    labels: ["Lawyers", "Customers", "Trainees"],
    datasets: [
      {
        data: [lawyers.length, customers.length, trainees.length],
        backgroundColor: ["#002E60", "#0268d4", "#FFC107"],
        hoverOffset: 10,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
    },
    scales: {
      x: { grid: { display: false } },
      y: { grid: { color: "#e0e0e0" } },
    },
  };

  // Chart data for sales (yearly and monthly)
  const salesChartData = {
    labels: selectedYear
      ? ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
      : Object.keys(yearlySalesData),
    datasets: [
      {
        label: selectedYear ? `Monthly Sales for ${selectedYear} (SAR)` : "Yearly Sales (SAR)",
        data: selectedYear ? yearlySalesData[selectedYear] || Array(12).fill(0) : Object.values(yearlySalesData).map((yearData) =>
          yearData.reduce((sum, monthData) => sum + monthData, 0)
        ),
        backgroundColor: selectedYear ? "#0268d4" : "#002E60",
      },
    ],
  };

  // Chart data for users (yearly and monthly)
  const usersChartData = {
    labels: selectedUserYear
      ? ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
      : Object.keys(yearlyUsersData),
    datasets: [
      {
        label: selectedUserYear ? `Monthly Users for ${selectedUserYear}` : "Yearly Users",
        data: selectedUserYear ? yearlyUsersData[selectedUserYear] || Array(12).fill(0) : Object.values(yearlyUsersData).map((yearData) =>
          yearData.reduce((sum, monthData) => sum + monthData, 0)
        ),
        backgroundColor: selectedUserYear ? "#FFC107" : "#0268d4",
      },
    ],
  };
  const getBackgroundColor = (status) => {
    return status === 'good' ? '#4CAF50' : '#FFC107'; // أخضر للـ good، أصفر للـ warning
  };
  return (
    <div style={{ padding: "20px", backgroundColor: "#f4f6f8", minHeight: "100vh" }}>
      {loading ? (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
          <CircularProgress />
        </div>
      ) : (
        <>
          <div className="grid">
            <Grid container spacing={3}>
              {stats.map((stat, index) => (
                <div className="grid3">
                  <StatCard key={index} {...stat} />
                </div>
              ))}
            </Grid>
          </div>

          <div className="grid">
            <Grid container spacing={2} style={{ marginTop: "30px" }}>
              <Grid item xs={12} md={6} sx={{ textAlign: "center", alignItems: "center", alignContent: "center" }}>
                <motion.div
                  initial={{ opacity: 0, x: -100 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 1 }}
                >
                  <Paper elevation={3} style={{ padding: "20px", borderRadius: "10px" }} sx={{ width: "500px" }}>
                    <Typography variant="h5" style={{ marginBottom: "20px" }}>
                      {selectedYear ? `Monthly Sales for ${selectedYear}` : "Yearly Sales"}
                    </Typography>
                    <Bar
                      data={salesChartData}
                      options={{
                        ...chartOptions,
                        onClick: (event, elements) => {
                          if (elements.length > 0 && !selectedYear) {
                            const clickedYear = Object.keys(yearlySalesData)[elements[0].index];
                            setSelectedYear(clickedYear);
                          }
                        },
                      }}
                    />
                    {selectedYear && (
                      <button
                        style={{ marginTop: "20px", padding: "10px 20px", backgroundColor: "#002E60", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" }}
                        onClick={() => setSelectedYear(null)}
                      >
                        Back to Yearly View
                      </button>
                    )}
                  </Paper>
                </motion.div>
              </Grid>

              <Grid item xs={12} md={6} sx={{ textAlign: "center", alignItems: "center", alignContent: "center" }}>
                <motion.div
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 1 }}
                >
                  <Paper elevation={3} style={{ padding: "20px", borderRadius: "10px" }} sx={{ width: "500px" }}>
                    <Typography variant="h5" style={{ marginBottom: "20px" }}>
                      {selectedUserYear ? `Monthly Users for ${selectedUserYear}` : "Yearly Users"}
                    </Typography>
                    <Bar
                      data={usersChartData}
                      options={{
                        ...chartOptions,
                        onClick: (event, elements) => {
                          if (elements.length > 0 && !selectedUserYear) {
                            const clickedYear = Object.keys(yearlyUsersData)[elements[0].index];
                            setSelectedUserYear(clickedYear);
                          }
                        },
                      }}
                    />
                    {selectedUserYear && (
                      <button
                        style={{ marginTop: "20px", padding: "10px 20px", backgroundColor: "#0268d4", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" }}
                        onClick={() => setSelectedUserYear(null)}
                      >
                        Back to Yearly View
                      </button>
                    )}
                  </Paper>
                </motion.div>
              </Grid>
            </Grid>
          </div>

          <div className="grid" style={{ marginTop: '30px' }}>
            <Paper elevation={3} style={{ padding: '20px', borderRadius: '15px', marginTop: '20px', width: "100%" }}>
              {/* عنوان القسم */}
              <Typography variant="h5" style={{ marginBottom: '20px', fontWeight: 'bold', color: '#002E60' }}>
                Recent Activities
              </Typography>

              {/* قائمة الأنشطة */}
              <List>
                {recentActivities.slice(0, visibleActivities).map((activity) => (
                  <ListItem key={activity._id} style={{ padding: '10px', borderBottom: '1px solid #e0e0e0' }}>
                    {/* أيقونة النشاط */}
                    <ListItemIcon
                      style={{
                        color:
                          activity.typeOfActivity === 'LogIn'
                            ? '#FFC107' // لون أصفر لتسجيل الدخول
                            : '#2196F3', // لون أزرق لأي نوع آخر
                      }}
                    >
                      {activity.typeOfActivity === 'LogIn' ? (
                        <LoginIcon /> // أيقونة تسجيل الدخول
                      ) : (
                        <PaymentIcon /> // أيقونة الدفع
                      )}
                    </ListItemIcon>

                    {/* تفاصيل النشاط */}
                    <ListItemText
                      primary={activity.UserId?.fullName || activity.UserId?.company || activity.UserId?.officeName || 'Unknown'}
                      secondary={
                        <>
                          <Typography variant="body2" style={{ color: '#666', fontWeight: "bold" }}>
                            {activity.typeOfActivity}
                          </Typography>
                          <Typography variant="body2" style={{ color: '#666' }}>
                            {activity.UserId?.email || 'No email'}
                          </Typography>
                          <Typography variant="body2" style={{ color: '#999', fontSize: '0.8rem' }}>
                            {format(new Date(activity.createdAt), 'dd MMM yyyy, h:mm a')}
                          </Typography>
                        </>
                      }
                      primaryTypographyProps={{ style: { fontWeight: 'bold', color: '#333' } }}
                    />
                  </ListItem>
                ))}
              </List>

              {/* زر "Show More" */}
              {recentActivities.length > 2 && (
                <Link to="/dashboard/userActivities">
                  <Button
                    variant="contained"
                    color="primary"
                    // onClick={toggleShowMore}
                    style={{ marginTop: '20px' }}
                  >
                    {visibleActivities === 2 ? 'Show More' : 'Show Less'}
                  </Button>
                </Link>

              )}
            </Paper>
          </div>

          <Paper elevation={3} style={{ padding: '20px', borderRadius: '15px', marginTop: '20px' }}>
            {/* عنوان البطاقة */}
            <Typography variant="h5" style={{ marginBottom: '20px', fontWeight: 'bold', color: '#002E60' }}>
              System Health
            </Typography>

            {/* شبكة لعرض Boxes */}
            <Grid container spacing={4}>
              {/* Box 1: حالة الذاكرة الحرة */}

              <Grid item xs={12} sm={6} md={4}>
                <Paper
                  elevation={4}
                  style={{
                    padding: '20px',
                    borderRadius: '15px',
                    backgroundColor: getBackgroundColor(systemHealth.MemoryStatus), // لون ثابت للإجمالي
                    color: '#fff',
                  }}
                >
                  <Typography variant="h6" style={{ fontWeight: 'bold', marginBottom: '10px' }}>
                    Storage Status
                  </Typography>
                  <Typography variant="h6" style={{ fontWeight: 'bold' }}>
                    {systemHealth.MemoryStatus.toUpperCase()}
                  </Typography>
                </Paper>
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <Paper
                  elevation={4}
                  style={{
                    padding: '20px',
                    borderRadius: '15px',
                    backgroundColor: '#2196F3',
                    color: '#fff',
                  }}
                >
                  <Typography variant="h6" style={{ fontWeight: 'bold', marginBottom: '10px' }}>
                    Free Memory
                  </Typography>
                  <Typography variant="h6" style={{ fontWeight: 'bold' }}>
                    {systemHealth.freeMemory} MB
                  </Typography>
                </Paper>
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <Paper
                  elevation={4}
                  style={{
                    padding: '20px',
                    borderRadius: '15px',
                    backgroundColor: '#2196F3',
                    color: '#fff',
                  }}
                >
                  <Typography variant="h6" style={{ fontWeight: 'bold', marginBottom: '10px' }}>
                    Total Memory
                  </Typography>
                  <Typography variant="h6" style={{ fontWeight: 'bold' }}>
                    {systemHealth.totalMemory.toUpperCase()} MB
                  </Typography>
                </Paper>
              </Grid>


              <Grid item xs={12} sm={6} md={4}>
                <Paper
                  elevation={4}
                  style={{
                    padding: '20px',
                    borderRadius: '15px',
                    backgroundColor: '#2196F3',
                    color: '#fff',
                  }}
                >
                  <Typography variant="h6" style={{ fontWeight: 'bold', marginBottom: '10px' }}>
                    Used Memory
                  </Typography>
                  <Typography variant="h6" style={{ fontWeight: 'bold' }}>
                    {systemHealth.usedMemory} MB
                  </Typography>
                </Paper>
              </Grid>

              {/* Box 4: حالة CPU */}
              <Grid item xs={12} sm={6} md={4}>
                <Paper
                  elevation={3}
                  style={{
                    padding: '20px',
                    borderRadius: '15px',
                    backgroundColor: getBackgroundColor(systemHealth.CPUStatus),
                    color: '#fff',
                  }}
                >
                  <Typography variant="h6" style={{ fontWeight: 'bold', marginBottom: '10px' }}>
                    CPU Status
                  </Typography>
                  <Typography variant="h6" style={{ fontWeight: 'bold' }}>
                    {systemHealth.CPUStatus.toUpperCase()}
                  </Typography>
                </Paper>
              </Grid>

              {/* Box 5: استخدام CPU */}
              <Grid item xs={12} sm={6} md={4}>
                <Paper
                  elevation={3}
                  style={{
                    padding: '20px',
                    borderRadius: '15px',
                    backgroundColor: getBackgroundColor(systemHealth.CPUStatus),
                    color: '#fff',
                  }}
                >
                  <Typography variant="h6" style={{ fontWeight: 'bold', marginBottom: '10px' }}>
                    CPU Usage
                  </Typography>
                  <Typography variant="h6" style={{ fontWeight: 'bold' }}>
                    {systemHealth.CPUS}
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </Paper>

        </>
      )}
    </div>
  );
};

export default Dashboard;