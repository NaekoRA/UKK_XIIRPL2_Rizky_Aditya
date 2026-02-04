import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./pages/users/navbar"; // Sidebar sudah ada Outlet
import Home from "./pages/users/home";
import Login from "./auth/login";
import Register from "./auth/register";
import ProfilePage from "./pages/users/profil";
import PrivateRoute from "./auth/Private"; // import PrivateRoute yang kamu buat

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<Sidebar />}>
            <Route index element={<Home />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
