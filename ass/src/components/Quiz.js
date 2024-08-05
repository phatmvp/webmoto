import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

const Quiz = ({ questions, onSubmit }) => {
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(600);
  const navigate = useNavigate();
  const username = localStorage.getItem("loggedInUser"); // Lấy tên người dùng từ localStorage

  // Random lấy 5 câu hỏi từ danh sách 10 câu hỏi
  useEffect(() => {
    if (questions.length > 0) {
      const shuffledQuestions = questions.sort(() => 0.1 - Math.random());
      const selected = shuffledQuestions.slice(0, 10);
      setSelectedQuestions(selected);
    }
  }, [questions]);

  const handleSubmit = useCallback(() => {
    onSubmit(answers);
    navigate("/result"); // Điều hướng đến trang kết quả sau khi nộp bài
  }, [answers, onSubmit, navigate]);

  useEffect(() => {
    if (timeLeft === 0) {
      handleSubmit(); // Tự động nộp bài khi hết giờ
    }

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);

    return () => clearInterval(timer); // Clear interval on component unmount
  }, [timeLeft, handleSubmit]);

  const handleOptionChange = (questionId, option) => {
    setAnswers({
      ...answers,
      [questionId]: option,
    });
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  return (
    <div className="container mt-5">
      <div className="text-center mb-5">
        <h1 className="display-4">ÔN THI BẰNG LÁI XE</h1>
        <h2 className="text-primary">Xin chào {username}</h2>{" "}
        {/* Hiển thị tên người dùng */}
        <h2>Thời gian còn lại: {formatTime(timeLeft)}</h2>{" "}
        {/* Hiển thị thời gian đếm ngược */}
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        {selectedQuestions.map((question) => (
          <div key={question.id} className="card mb-4">
            <div className="card-body">
              <h5 className="card-title">{question.questionText}</h5>
              {question.options.map((option) => (
                <div key={option} className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name={`question-${question.id}`}
                    value={option}
                    checked={answers[question.id] === option} // Đánh dấu tùy chọn đã được chọn
                    onChange={() => handleOptionChange(question.id, option)} // Cập nhật câu trả lời khi thay đổi
                  />
                  <label className="form-check-label">{option}</label>
                </div>
              ))}
            </div>
          </div>
        ))}
        <button type="submit" className="btn btn-primary">
          Nộp bài
        </button>
      </form>
    </div>
  );
};

export default Quiz;
