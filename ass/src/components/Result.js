import React, { useEffect } from "react";
import { Link } from "react-router-dom";

const Result = ({ results, onRetry }) => {
  const username = localStorage.getItem("loggedInUser") || "Ẩn Danh";

  // Lọc ra chỉ 5 câu hỏi đã làm từ results
  const answeredResults = results.slice(0, 10);

  const correctAnswers = answeredResults.filter(
    (result) => result.correct
  ).length;
  const score = correctAnswers * 1; // Mỗi câu đúng tính 1 điểm

  useEffect(() => {
    const history = JSON.parse(localStorage.getItem("quizHistory")) || [];
    const newResult = {
      date: new Date().toLocaleString(),
      score,
      results: answeredResults, // Lưu chỉ 5 câu hỏi đã làm vào lịch sử
      name: username, // Add user's name to the history entry
    };

    // Kiểm tra và chỉ thêm kết quả nếu nó chưa tồn tại trong lịch sử
    const lastResult = history[history.length - 1];
    if (
      !lastResult ||
      JSON.stringify(lastResult.results) !== JSON.stringify(answeredResults)
    ) {
      history.push(newResult);
      localStorage.setItem("quizHistory", JSON.stringify(history));
    }
  }, [score, answeredResults, username]);

  return (
    <div className="container mt-5">
      <div className="card">
        <div className="card-body">
          <h2 className="card-title">Kết quả</h2>
          <h3 className="card-subtitle mb-3">Xin chào, {username}</h3>{" "}
          {/* Hiển thị tên người dùng */}
          <p className="card-text">
            Bạn đã trả lời đúng {correctAnswers} trong số{" "}
            {answeredResults.length} câu hỏi.
          </p>
          <p className="card-text">Điểm số của bạn là: {score} Điểm</p>
          <ul className="list-group list-group-flush">
            {answeredResults.map((result, index) => (
              <li
                key={index}
                className={`list-group-item ${
                  result.correct ? "text-success" : "text-danger"
                }`}
              >
                <strong>{result.question}</strong> - Bạn chọn: {result.answer} -{" "}
                {result.correct ? (
                  <span className="text-success">Đúng</span>
                ) : (
                  <>
                    <span className="text-danger">Sai</span>
                    <br />
                    <span className="text-success">
                      Đáp án đúng là: {result.correctAnswer}
                    </span>
                  </>
                )}
              </li>
            ))}
          </ul>
          <div className="mt-3">
            <button className="btn btn-primary me-3" onClick={onRetry}>
              Làm lại
            </button>
            <Link to="/history" className="btn btn-secondary">
              Xem lịch sử
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Result;
