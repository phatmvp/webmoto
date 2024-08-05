import React, { useState } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Admin from "./components/Admin";
import Login from "./components/Login";
import Quiz from "./components/Quiz";
import Result from "./components/Result";
import data from "./data/data.json";
import Home from "./components/Home";
import History from "./components/History";
import Register from "./components/Register";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    // Thực hiện logic đăng nhập tại đây
    setIsAuthenticated(true);
  };

  const [results, setResults] = useState(null);

  const handleQuizSubmit = (answers) => {
    const correctAnswers = data.questions.reduce((acc, question) => {
      acc[question.id] = question.correctAnswer;
      return acc;
    }, {});
  
    const result = data.questions.map((question) => ({
      question: question.questionText,
      answer: answers[question.id],
      correct: answers[question.id] === correctAnswers[question.id],
      correctAnswer: correctAnswers[question.id], // Thêm đáp án đúng vào kết quả
    }));
  
    setResults(result);
  };
  

  const handleRetry = () => {
    setResults(null);
  };

  return (
    <div>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/history" element={<History />} />
          <Route
            path="/quiz"
            element={
              <Quiz questions={data.questions} onSubmit={handleQuizSubmit} />
            }
          />
          <Route
            path="/result"
            element={
              results ? (
                <Result results={results} onRetry={handleRetry} />
              ) : (
                <Navigate to="/quiz" />
              )
            }
          />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/admin"
            element={isAuthenticated ? <Admin /> : <Navigate to="/" />}
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
