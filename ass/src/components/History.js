import React, { useEffect, useState } from "react";

const History = () => {
  const [history, setHistory] = useState([]);
  const username = localStorage.getItem("loggedInUser");

  useEffect(() => {
    const quizHistory = JSON.parse(localStorage.getItem("quizHistory")) || [];
    setHistory(quizHistory);
  }, []);

  const clearHistory = () => {
    localStorage.removeItem("quizHistory");
    setHistory([]);
  };

  return (
    <div className="container mt-5">
      <h2>Lịch sử bài kiểm tra</h2>
      <button className="btn btn-danger mb-3" onClick={clearHistory}>
        Xóa lịch sử
      </button>
      {history.length === 0 ? (
        <p>Không có lịch sử nào.</p>
      ) : (
        <ul className="list-group">
          {history.map((entry, index) => (
            <li key={index} className="list-group-item">
              <p>
                <strong>Ngày:</strong> {entry.date}
              </p>
              <p>
                <strong>Tên người làm bài:</strong> {entry.name || username}{" "}
                {/* Hiển thị tên người dùng hoặc tên từ lịch sử */}
              </p>
              <p>
                <strong>Điểm số:</strong> {entry.score}
              </p>
              <ul>
                {entry.results.map((result, idx) => (
                  <li
                    key={idx}
                    className={result.correct ? "text-success" : "text-danger"}
                  >
                    <strong>{result.question}</strong>: {result.answer} (
                    {result.correct ? "Đúng" : "Sai"})
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default History;
