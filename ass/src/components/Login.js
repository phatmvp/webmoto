import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login({ onLogin }) {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    const defaultAdmin = { username: "phatmvp", password: "123" };
    const users = JSON.parse(localStorage.getItem("users")) || [];

    // Kiểm tra thông tin đăng nhập cho admin mặc định
    if (
      username === defaultAdmin.username &&
      password === defaultAdmin.password
    ) {
      localStorage.setItem("loggedInUser", username); // Lưu tên người dùng vào localStorage
      onLogin(username); // Gọi callback để thông báo đã đăng nhập thành công và truyền username
      navigate("/admin");
      return;
    }

    // Kiểm tra thông tin đăng nhập cho người dùng đăng ký
    const user = users.find(
      (user) => user.username === username && user.password === password
    );

    if (user) {
      localStorage.setItem("loggedInUser", username); // Lưu tên người dùng vào localStorage
      onLogin(username); // Gọi callback để thông báo đã đăng nhập thành công và truyền username
      navigate("/");
    } else {
      alert("Username hoặc Password không đúng!");
    }
  };

  const handleRegister = () => {
    navigate("/register");
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title text-center">Login</h2>
              <form>
                <div className="form-group">
                  <label htmlFor="username">Username</label>
                  <input
                    type="text"
                    id="username"
                    className="form-control"
                    placeholder="Enter username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    id="password"
                    className="form-control"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <button
                  type="button"
                  onClick={handleLogin}
                  className="btn btn-primary btn-block mt-3"
                >
                  Login
                </button>
                <button
                  type="button"
                  onClick={handleRegister}
                  className="btn btn-secondary btn-block mt-3"
                >
                  Register
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
