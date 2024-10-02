import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import 'admin-lte/dist/css/adminlte.min.css'; // Thêm CSS AdminLTE
import 'admin-lte/dist/js/adminlte.min.js'; // Import JS của AdminLTE
import 'bootstrap/dist/css/bootstrap.min.css';
import 'overlayscrollbars/css/OverlayScrollbars.css'; // Import OverlayScrollbars
import 'apexcharts/dist/apexcharts.css'; // Import ApexCharts
import 'admin-lte/dist/css/adminlte.css'; // Import AdminLTE custom CSS
import 'bootstrap-icons/font/bootstrap-icons.min.css'
import 'font-awesome/css/font-awesome.min.css'
import '@fortawesome/fontawesome-free/css/all.min.css'
// Import JS (nếu cần sử dụng tính năng JS)

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
      <App />
  </React.StrictMode>
);