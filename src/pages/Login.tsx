// src/pages/Login.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("http://34.64.57.155:5500/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
        credentials: "include", // 세션 쿠키 저장을 위해 필요
      });

      const result = await res.json();

      if (res.ok && result.success) {
        alert("로그인 성공: " + result.message);
        navigate("/");
      } else {
        alert("로그인 실패: " + result.message);
      }
    } catch (error) {
      console.error("로그인 중 오류 발생:", error);
      alert("로그인 요청 실패");
    }
  };

  return (
    <div className="login-container">
      <h2>로그인</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <div className="input-group">
          <input
            type="text"
            placeholder="아이디"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="input-field"
          />
        </div>
        <div className="input-group">
          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-field"
          />
        </div>
        <button type="submit" className="login-btn">로그인</button>
      </form>
      <p className="register-link">
        계정이 없으신가요? <a href="/register">회원가입</a>
      </p>
    </div>
  );
};

export default Login;