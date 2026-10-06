import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../CSS/AdminLogin.css";

import { setAdminOnline } from "../utils/adminPresence";

function AdminLogin() {

  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const ADMINS = [
    {
      username: "PHAYU",
      password: "PHAYU01",
    },
    {
      username: "MAFAI",
      password: "MAFAI02",
    },
    {
      username: "X-RAY",
      password: "X-RAY03",
    },
  ];


  const handleLogin = (e) => {

    e.preventDefault();

    const admin = ADMINS.find(
      (item) =>
        item.username === username &&
        item.password === password
    );


    if (admin) {

      // จำสถานะ Login
      localStorage.setItem(
        "m9-admin-login",
        "true"
      );

      localStorage.setItem(
        "m9-admin-user",
        admin.username
      );


      // ตั้งสถานะ Online
      setAdminOnline(admin.username);


      // ไปหน้า Admin
      navigate("/admin");

    } else {

      setError(
        "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง"
      );

    }
  };


  return (

    <div className="admin-login-page">

      <div className="admin-login-card">

        <div className="admin-logo">
          M9
        </div>


        <span className="admin-label">
          MNINEGANG / ADMIN
        </span>


        <h1>
          ADMIN LOGIN
        </h1>


        <p className="admin-subtitle">
          เข้าสู่ระบบสำหรับผู้ดูแลเว็บไซต์
        </p>


        <form onSubmit={handleLogin}>

          <div className="input-group">

            <label>
              USERNAME
            </label>

            <input
              type="text"
              placeholder="กรอกชื่อผู้ใช้"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setError("");
              }}
            />

          </div>


          <div className="input-group">

            <label>
              PASSWORD
            </label>

            <input
              type="password"
              placeholder="กรอกรหัสผ่าน"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
            />

          </div>


          {error && (

            <div className="login-error">
              {error}
            </div>

          )}


          <button
            type="submit"
            className="login-button"
          >
            LOGIN ADMIN
          </button>

        </form>


        <button
          className="back-button"
          onClick={() => navigate("/")}
        >
          ← กลับหน้าหลัก
        </button>

      </div>

    </div>

  );
}

export default AdminLogin;