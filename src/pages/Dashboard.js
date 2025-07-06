import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import axios from "axios";
const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalUsers: 0,
      totalMembers: 0,
      totalRequests: 0,
      activeRequests: 0
    },
    users: [],
    members: [],
    requests: {
      reception: [],
      complete: [],
      accompanying: [],
      travel: [],
      hotel: [],
      train: [],
      transport: []
    },
    requestsChart: [],
    usersChart: []
  });
  const [error, setError] = useState(null);

  // Base API URL
  const API_BASE = "http://147.79.101.225:8888/admin";
  const token = window.localStorage.getItem("accessToken");

  // Fetch all data
  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch users
      // Fetch users
      const usersResponse = await axios.get(`${API_BASE}/users/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const usersData = usersResponse.data;

      // Fetch members
      const membersResponse = await axios.get(`${API_BASE}/users/members`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const membersData = membersResponse.data.Members;

      // Fetch all request types
      const requestTypes = ['reception', 'complete', 'accompanying', 'travel', 'hotel', 'train', 'transport'];
      const requestsData = {};
      let totalRequests = 0;

      for (const type of requestTypes) {
        try {
          const response = await axios.get(`${API_BASE}/request/${type}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const data = response.data.Requests;
          requestsData[type] = Array.isArray(data) ? data : [];
          totalRequests += requestsData[type].length;
        } catch (err) {
          console.error(`Error fetching ${type} requests:`, err);
          requestsData[type] = [];
        }
      }

      // Process data for charts
      const requestsChart = requestTypes.map(type => ({
        name: getRequestTypeName(type),
        value: requestsData[type].length,
        color: getRequestTypeColor(type)
      }));
      // دالة للحصول على آخر 12 شهر فقط (بدلاً من كل الشهور)
      function processUsersChartDataLast12Months(usersData) {
        // التحقق من وجود البيانات
        if (!usersData || !Array.isArray(usersData)) {
          console.error('usersData is not an array or is null/undefined');
          return [];
        }

        const monthsInArabic = {
          0: 'يناير',
          1: 'فبراير',
          2: 'مارس',
          3: 'أبريل',
          4: 'مايو',
          5: 'يونيو',
          6: 'يوليو',
          7: 'أغسطس',
          8: 'سبتمبر',
          9: 'أكتوبر',
          10: 'نوفمبر',
          11: 'ديسمبر'
        };

        const last12Months = [];
        const today = new Date();

        // إنشاء آخر 12 شهر
        for (let i = 11; i >= 0; i--) {
          const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
          const monthName = monthsInArabic[date.getMonth()];
          const year = date.getFullYear();

          last12Months.push({
            month: monthName,
            year: year,
            key: `${year}-${String(date.getMonth() + 1).padStart(2, '0')}`, // إضافة padding للشهر
            users: 0
          });
        }

        // تجميع المستخدمين حسب الشهر والسنة
        usersData.forEach(user => {
          try {
            if (user && user.createdAt) {
              const createdDate = new Date(user.createdAt);

              // التحقق من صحة التاريخ
              if (isNaN(createdDate.getTime())) {
                console.warn('Invalid date for user:', user);
                return;
              }

              const monthKey = `${createdDate.getFullYear()}-${String(createdDate.getMonth() + 1).padStart(2, '0')}`;

              const monthIndex = last12Months.findIndex(month => month.key === monthKey);
              if (monthIndex !== -1) {
                last12Months[monthIndex].users++;
              }
            }
          } catch (error) {
            console.error('Error processing user:', user, error);
          }
        });

        // تحويل إلى صيغة المخطط البياني
        return last12Months.map(month => ({
          month: `${month.month} ${month.year}`,
          users: month.users
        }));
      }

      try {
        console.log('usersData:', usersData); // للتحقق من البيانات
        console.log('usersData.allUsers:', usersData.allUsers);

        const usersChart = processUsersChartDataLast12Months(usersData.allUsers || []);
        console.log('Generated usersChart:', usersChart);
        let activeRequests = 0;

        // تكرار على جميع أنواع الطلبات
        for (const type of requestTypes) {
          if (requestsData[type] && Array.isArray(requestsData[type])) {
            // عد الطلبات التي لها status = "active"
            activeRequests += requestsData[type].filter(request => request.status === "active").length;
          }
        }
        setDashboardData({
          stats: {
            totalUsers: usersData.allUsers?.length || 0,
            totalMembers: Array.isArray(membersData) ? membersData.length : 0,
            totalRequests: totalRequests,
            activeRequests: activeRequests
          },
          users: usersData.allUsers || [],
          members: Array.isArray(membersData) ? membersData : [],
          requests: requestsData,
          requestsChart,
          usersChart
        });
      } catch (error) {
        console.error('Error in dashboard data processing:', error);
      }


      const usersChart = processUsersChartDataLast12Months(usersData.allUsers);
      // حساب عدد الطلبات النشطة من جميع أنواع الطلبات
      let activeRequests = 0;

      // تكرار على جميع أنواع الطلبات
      for (const type of requestTypes) {
        if (requestsData[type] && Array.isArray(requestsData[type])) {
          // عد الطلبات التي لها status = "active"
          activeRequests += requestsData[type].filter(request => request.status === "active").length;
        }
      }

      // أو يمكن استخدام reduce للحصول على نتيجة أكثر إيجازاً
      const activeRequestsCount = Object.values(requestsData).reduce((count, requests) => {
        if (Array.isArray(requests)) {
          return count + requests.filter(request => request.status === "active").length;
        }
        return count;
      }, 0);

      // تحديث setDashboardData
      setDashboardData({
        stats: {
          totalUsers: usersData.allUsers?.length || 0,
          totalMembers: Array.isArray(membersData) ? membersData.length : 0,
          totalRequests: totalRequests,
          activeRequests: activeRequests // أو activeRequestsCount
        },
        users: usersData.allUsers || [],
        members: Array.isArray(membersData) ? membersData : [],
        requests: requestsData,
        requestsChart,
        usersChart
      });
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('حدث خطأ في تحميل البيانات');
    } finally {
      setLoading(false);
    }
  };

  const getRequestTypeName = (type) => {
    const names = {
      reception: 'الاستقبال',
      complete: 'استكمال اجراءات السفر',
      accompanying: 'المرافقة الوفود',
      travel: 'حجز السفر',
      hotel: 'حجز فندق',
      train: 'حجز قطار',
      transport: 'وسائل النقل'
    };
    return names[type] || type;
  };

  const getRequestTypeColor = (type) => {
    const colors = {
      reception: '#D4AF37',
      complete: '#1c1c1c',
      accompanying: '#4caf50',
      travel: '#2196f3',
      hotel: '#ff9800',
      train: '#9c27b0',
      transport: '#f44336'
    };
    return colors[type] || '#666';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'غير محدد';
    try {
      return new Date(dateString).toLocaleDateString('ar-EG');
    } catch {
      return 'غير محدد';
    }
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        // background: 'linear-gradient(135deg, #D4AF37 0%, #1c1c1c 100%)',
        flexDirection: 'column',
        color: 'white'
      }}>
        <div style={{
          width: '50px',
          height: '50px',
          border: '4px solid rgba(255,255,255,0.3)',
          borderTop: '4px solid #D4AF37',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <p style={{ marginTop: '20px', fontSize: '18px' }}>جاري تحميل البيانات...</p>
        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        // background: 'linear-gradient(135deg, #D4AF37 0%, #1c1c1c 100%)',
        flexDirection: 'column',
        color: 'white'
      }}>
        <div style={{ fontSize: '48px', marginBottom: '20px' }}>⚠️</div>
        <p style={{ fontSize: '18px', textAlign: 'center' }}>{error}</p>
        <button
          onClick={fetchAllData}
          style={{
            marginTop: '20px',
            padding: '10px 20px',
            background: '#D4AF37',
            color: '#1c1c1c',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold'
          }}
        >
          إعادة المحاولة
        </button>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      // background: 'linear-gradient(135deg, #D4AF37 0%, #1c1c1c 100%)',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* عنوان الصفحة */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ color: '#1c1c1c', fontSize: '36px', marginBottom: '10px' }}>
            لوحة التحكم الإدارية
          </h1>
          <p style={{ color: '#1c1c1c', fontSize: '16px' }}>
            مرحباً بك في لوحة التحكم الخاصة بالإدارة
          </p>
        </div>

        {/* البطاقات الإحصائية */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px',
          marginBottom: '40px'
        }}>
          {/* بطاقة المستخدمين */}
          <div style={{
            background: 'white',
            borderRadius: '15px',
            padding: '25px',
            boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
            transition: 'transform 0.3s ease'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ color: '#666', margin: '0 0 10px 0', fontSize: '14px' }}>إجمالي المستخدمين</h3>
                <h2 style={{ color: '#1c1c1c', margin: '0 0 10px 0', fontSize: '32px' }}>
                  {dashboardData.stats.totalUsers.toLocaleString()}
                </h2>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ color: '#4caf50', fontSize: '14px' }}>
                    👥 نشط
                  </span>
                </div>
              </div>
              <div style={{
                background: '#D4AF37',
                borderRadius: '50%',
                width: '60px',
                height: '60px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                color: 'white'
              }}>
                👥
              </div>
            </div>
          </div>

          {/* بطاقة الأعضاء */}
          <div style={{
            background: 'white',
            borderRadius: '15px',
            padding: '25px',
            boxShadow: '0 8px 25px rgba(0,0,0,0.1)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ color: '#666', margin: '0 0 10px 0', fontSize: '14px' }}>إجمالي الأعضاء</h3>
                <h2 style={{ color: '#1c1c1c', margin: '0 0 10px 0', fontSize: '32px' }}>
                  {dashboardData.stats.totalMembers.toLocaleString()}
                </h2>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ color: '#4caf50', fontSize: '14px' }}>
                    🎖️ عضو
                  </span>
                </div>
              </div>
              <div style={{
                background: '#1c1c1c',
                borderRadius: '50%',
                width: '60px',
                height: '60px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                color: 'white'
              }}>
                🎖️
              </div>
            </div>
          </div>

          {/* بطاقة الطلبات */}
          <div style={{
            background: 'white',
            borderRadius: '15px',
            padding: '25px',
            boxShadow: '0 8px 25px rgba(0,0,0,0.1)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ color: '#666', margin: '0 0 10px 0', fontSize: '14px' }}>إجمالي الطلبات</h3>
                <h2 style={{ color: '#1c1c1c', margin: '0 0 10px 0', fontSize: '32px' }}>
                  {dashboardData.stats.totalRequests.toLocaleString()}
                </h2>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ color: '#4caf50', fontSize: '14px' }}>
                    📋 طلب
                  </span>
                </div>
              </div>
              <div style={{
                background: '#4caf50',
                borderRadius: '50%',
                width: '60px',
                height: '60px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                color: 'white'
              }}>
                📋
              </div>
            </div>
          </div>

          {/* بطاقة الطلبات النشطة */}
          <div style={{
            background: 'white',
            borderRadius: '15px',
            padding: '25px',
            boxShadow: '0 8px 25px rgba(0,0,0,0.1)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ color: '#666', margin: '0 0 10px 0', fontSize: '14px' }}>الطلبات النشطة</h3>
                <h2 style={{ color: '#1c1c1c', margin: '0 0 10px 0', fontSize: '32px' }}>
                  {dashboardData.stats.activeRequests.toLocaleString()}
                </h2>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ color: '#ff9800', fontSize: '14px' }}>
                    🔄 نشط
                  </span>
                </div>
              </div>
              <div style={{
                background: '#ff9800',
                borderRadius: '50%',
                width: '60px',
                height: '60px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                color: 'white'
              }}>
                🔄
              </div>
            </div>
          </div>
        </div>

        {/* الرسوم البيانية */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '20px',
          marginBottom: '40px'
        }}>
          {/* مخطط المستخدمين الجدد */}
          <div style={{
            background: 'white',
            borderRadius: '15px',
            padding: '25px',
            boxShadow: '0 8px 25px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ color: '#333', marginBottom: '20px', fontSize: '18px' }}>
              المستخدمين الجدد هذا الشهر
            </h3>
            <div style={{ height: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dashboardData.usersChart}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="month"
                    angle={-45}
                    textAnchor="end"
                    height={60}
                    interval={0}
                  />
                  <YAxis />
                  <Tooltip
                    formatter={(value) => [value, 'عدد المستخدمين']}
                    labelFormatter={(label) => `الشهر: ${label}`}
                  />
                  <Legend />
                  <Bar
                    dataKey="users"
                    fill="#D4AF37"
                    name="عدد المستخدمين"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* مخطط الطلبات */}
          <div style={{
            background: 'white',
            borderRadius: '15px',
            padding: '25px',
            boxShadow: '0 8px 25px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ color: '#333', marginBottom: '20px', fontSize: '18px' }}>توزيع الطلبات</h3>
            <div style={{ height: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={dashboardData.requestsChart}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {dashboardData.requestsChart.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* المستخدمين الحاليين */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '20px',
          marginBottom: '40px'
        }}>
          {/* المستخدمين */}
          <div style={{
            background: 'white',
            borderRadius: '15px',
            padding: '25px',
            boxShadow: '0 8px 25px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ color: '#333', marginBottom: '20px', fontSize: '18px' }}>المستخدمين الحاليين</h3>
            <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
              {dashboardData.users.slice(0, 5).map((user) => (
                <div key={user._id} style={{
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  padding: '15px',
                  marginBottom: '10px',
                  backgroundColor: '#fafafa',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{
                      marginRight: '10px',
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: '#D4AF37',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '16px'
                    }}>
                      {user.name?.charAt(0)?.toUpperCase() || '👤'}
                    </div>
                    <div>
                      <p style={{ margin: '0 0 5px 0', fontWeight: 'bold' }}>{user.name}</p>
                      <p style={{ margin: '0', color: '#666', fontSize: '12px' }}>{user.email}</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '12px', color: '#666' }}>
                      {formatDate(user.createdAt)}
                    </span>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      backgroundColor: '#4caf50',
                      color: 'white'
                    }}>
                      نشط
                    </span>
                  </div>
                </div>
              ))}
              {dashboardData.users.length === 0 && (
                <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                  <div style={{ fontSize: '48px', marginBottom: '10px' }}>👥</div>
                  <p>لا يوجد مستخدمين</p>
                </div>
              )}
            </div>
          </div>

          {/* إحصائيات الطلبات */}
          <div style={{
            background: 'white',
            borderRadius: '15px',
            padding: '25px',
            boxShadow: '0 8px 25px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ color: '#333', marginBottom: '20px', fontSize: '18px' }}>إحصائيات الطلبات</h3>
            <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
              {dashboardData.requestsChart.map((request, index) => (
                <div key={index} style={{
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  padding: '15px',
                  marginBottom: '10px',
                  backgroundColor: '#fafafa',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      backgroundColor: request.color,
                      marginRight: '10px'
                    }}></div>
                    <span style={{ fontWeight: 'bold' }}>{request.name}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontWeight: 'bold', color: request.color }}>
                      {request.value}
                    </span>
                    <span style={{ color: '#666', fontSize: '12px' }}>طلب</span>
                  </div>
                </div>
              ))}
              {dashboardData.requestsChart.length === 0 && (
                <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                  <div style={{ fontSize: '48px', marginBottom: '10px' }}>📋</div>
                  <p>لا توجد طلبات</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* زر تحديث البيانات */}
        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <button
            onClick={fetchAllData}
            style={{
              padding: '12px 24px',
              background: '#D4AF37',
              color: '#1c1c1c',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 'bold',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.target.style.background = '#1c1c1c';
              e.target.style.color = '#D4AF37';
            }}
            onMouseOut={(e) => {
              e.target.style.background = '#D4AF37';
              e.target.style.color = '#1c1c1c';
            }}
          >
            🔄 تحديث البيانات
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;