import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

function Home() {
  const [loggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loggedInUser = localStorage.getItem("loggedInUser");
    if (loggedInUser) {
      setLoggedIn(true);
    } else {
      setLoggedIn(false);
    }
  }, []);

  const handleStartQuiz = () => {
    if (!loggedIn) {
      alert("Bạn chưa đăng nhập!");
      navigate("/login"); // Điều hướng đến trang login nếu chưa đăng nhập
    } else {
      navigate("/quiz"); // Điều hướng đến trang quiz nếu đã đăng nhập
    }
  };

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-6 offset-md-3 text-center">
          <h1 className="mb-4">ÔN THI BẰNG LÁI XE</h1>
          <div className="mb-4">
            <button
              className="btn btn-primary btn-lg mr-3"
              onClick={handleStartQuiz}
            >
              Bắt đầu bài test
            </button>
            <Link to="/login">
              <button className="btn btn-secondary btn-lg">Login</button>
            </Link>
          </div>
          {!loggedIn && (
            <p className="alert alert-warning">
              Bạn chưa đăng nhập. Vui lòng đăng nhập để bắt đầu bài test.
            </p>
          )}
          <p className="lead">
            Chào mừng bạn đến với trang ôn thi bằng lái xe. Hãy chuẩn bị sẵn
            sàng và làm thử bài test ngay hôm nay!
          </p>
        </div>
      </div>
    </div>
  );
}

export default Home;
