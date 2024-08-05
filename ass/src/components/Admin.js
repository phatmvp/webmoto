import React, { useState, useEffect } from "react";
import axios from "axios";
import "./style.css";

const apiUrl = "http://localhost:9999/questions";

function Admin() {
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState({
    questionText: "",
    options: ["", "", "", ""],
    correctAnswer: "",
  });
  
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const questionsPerPage = 5;

  const fetchQuestions = async () => {
    try {
      const response = await axios.get(apiUrl);
      if (Array.isArray(response.data)) {
        setQuestions(response.data);
      } else {
        console.error("Fetched data is not an array:", response.data);
      }
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  const confirmAction = (message, callback) => {
    if (window.confirm(message)) {
      callback();
    }
  };

  const addQuestion = async () => {
    confirmAction("Bạn có muốn thêm câu hỏi này không?", async () => {
      try {
        const response = await axios.post(apiUrl, newQuestion);
        setQuestions([...questions, response.data]);
        setNewQuestion({
          questionText: "",
          options: ["", "", "", ""],
          correctAnswer: "",
        });
      } catch (error) {
        console.error("Error adding question:", error);
      }
    });
  };

  const updateQuestion = async (id, updatedQuestion) => {
    confirmAction("Bạn có muốn cập nhật câu hỏi này không?", async () => {
      try {
        const response = await axios.put(`${apiUrl}/${id}`, updatedQuestion);
        setQuestions(
          questions.map((q) => (q.id === id ? { ...q, ...response.data } : q))
        );
        setEditingQuestion(null); // Reset editing state after update
      } catch (error) {
        console.error("Error editing question:", error);
      }
    });
  };

  const deleteQuestion = async (id) => {
    confirmAction("Bạn có muốn xóa câu hỏi này không?", async () => {
      try {
        await axios.delete(`${apiUrl}/${id}`);
        setQuestions(questions.filter((q) => q.id !== id));
      } catch (error) {
        console.error("Error deleting question:", error);
      }
    });
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleOptionChange = (index, value, question, setQuestion) => {
    const newOptions = [...question.options];
    newOptions[index] = value.replace(/_/g, " ");
    setQuestion({ ...question, options: newOptions });
  };

  const indexOfLastQuestion = currentPage * questionsPerPage;
  const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
  const currentQuestions = questions.slice(
    indexOfFirstQuestion,
    indexOfLastQuestion
  );

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(questions.length / questionsPerPage); i++) {
    pageNumbers.push(i);
  }

  const renderPageNumbers = pageNumbers.map((number) => (
    <li
      key={number}
      className={`page-item ${currentPage === number ? "active" : ""}`}
    >
      <button onClick={() => setCurrentPage(number)} className="page-link">
        {number}
      </button>
    </li>
  ));

  return (
    <div className="container">
      <h1 className="mb-5">Admin Panel</h1>
      <div className="mb-4">
        <h3>Add New Question</h3>
        <input
          type="text"
          className="form-control mb-2"
          placeholder="Question Text"
          value={newQuestion.questionText}
          onChange={(e) =>
            setNewQuestion({ ...newQuestion, questionText: e.target.value })
          }
        />
        {newQuestion.options.map((option, index) => (
          <input
            key={index}
            type="text"
            className="form-control mb-2"
            placeholder={`Option ${index + 1}`}
            value={option}
            onChange={(e) =>
              handleOptionChange(
                index,
                e.target.value,
                newQuestion,
                setNewQuestion
              )
            }
          />
        ))}
        <select
          className="form-control mb-2"
          value={newQuestion.correctAnswer}
          onChange={(e) =>
            setNewQuestion({ ...newQuestion, correctAnswer: e.target.value })
          }
        >
          <option value="">Select Correct Answer</option>
          {newQuestion.options.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
        <button className="btn btn-primary" onClick={addQuestion}>
          Add Question
        </button>
      </div>
      <div>
        <h3>Edit Questions</h3>
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Question</th>
              <th>Options</th>
              <th>Correct Answer</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentQuestions.map((q) => (
              <tr key={q.id}>
                {editingQuestion === q.id ? (
                  <>
                    <td>
                      <input
                        type="text"
                        className="form-control mb-2"
                        value={q.questionText}
                        onChange={(e) =>
                          setQuestions(
                            questions.map((question) =>
                              question.id === q.id
                                ? { ...question, questionText: e.target.value }
                                : question
                            )
                          )
                        }
                      />
                    </td>
                    <td>
                      {q.options.map((option, index) => (
                        <input
                          key={index}
                          type="text"
                          className="form-control mb-2"
                          value={option.replace(/_/g, " ")} // Hiển thị giá trị với dấu cách thay thế dấu "_"
                          onChange={(e) =>
                            handleOptionChange(
                              index,
                              e.target.value.replace(/ /g, "_"), // Chuyển đổi dấu cách thành "_"
                              q,
                              (updatedQuestion) =>
                                setQuestions(
                                  questions.map((question) =>
                                    question.id === q.id
                                      ? { ...question, ...updatedQuestion }
                                      : question
                                  )
                                )
                            )
                          }
                        />
                      ))}
                    </td>
                    <td>
                      <select
                        className="form-control mb-2"
                        value={q.correctAnswer}
                        onChange={(e) =>
                          setQuestions(
                            questions.map((question) =>
                              question.id === q.id
                                ? { ...question, correctAnswer: e.target.value }
                                : question
                            )
                          )
                        }
                      >
                        <option value="">Select Correct Answer</option>
                        {q.options.map((option, index) => (
                          <option key={index} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <button
                        className="btn btn-success"
                        onClick={() => updateQuestion(q.id, q)}
                      >
                        Update
                      </button>
                      <button
                        className="btn btn-secondary ml-2"
                        onClick={() => setEditingQuestion(null)}
                      >
                        Cancel
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{q.questionText}</td>
                    <td>{q.options.join(", ")}</td>
                    <td>{q.correctAnswer}</td>
                    <td>
                      <button
                        className="btn btn-warning"
                        onClick={() => setEditingQuestion(q.id)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-danger ml-2"
                        onClick={() => deleteQuestion(q.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
        <nav>
          <ul className="pagination">{renderPageNumbers}</ul>
        </nav>
      </div>
    </div>
  );
}

export default Admin;
