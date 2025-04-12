import React, { useState, useEffect } from "react";
import axios from 'helper/axios'; // Assuming this is your Axios instance
import { useAuthContext } from "hooks/useAuthContext";
import Swal from "sweetalert2";
import Topbar from "components/Topbar";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Flag } from "lucide-react";


const AssessmentTabs = () => {
  const [activeTab, setActiveTab] = useState("active");
  const [lessons, setLessons] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [completedTests, setCompletedTests] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const { user }: any = useAuthContext();
  const navigate = useNavigate(); // Use the useNavigate hook
  const [timer, setTimer] = useState(30);
  const [markedForReview, setMarkedForReview] = useState([]);


  const fetchLessons = async () => {
    try {
      const response = await axios.get("/api/lesson_name-tests/get_all/for_student/", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      setLessons(response.data);
      setLoading(false);
    } catch (error) {
      // console.log(error);
      setError("Failed to fetch lessons");
      setLoading(false);
    }
  };

  const fetchQuestions = async (lessonId) => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/lesson_test_questions/new/${lessonId}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      setQuestions(response.data);
      setCurrentIndex(0);
      setSelectedAnswers({});
      setLoading(false);
      setTimer(30); // Reset timer when fetching new questions
    } catch (err) {
      setError("Failed to fetch questions");
      setLoading(false);
    }
  };

  const fetchCompletedTests = async () => {
    try {
      const response = await axios.get("/api/completed-tests/get_all/", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      setCompletedTests(response.data);
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: err?.response?.data?.detail || "Please try again later.",
        showConfirmButton: false,
        timer: 2100,
      });
    }
  };

  useEffect(() => {
    fetchLessons();
    fetchCompletedTests();
  }, [user.token]);

  //Timer logic here
  useEffect(() => {
    let interval;
    if (selectedLesson && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (timer === 0) {
      if (currentIndex === questions.length - 1) {
        submitAnswers(true);
      } else {
        nextQuestion();
      }
    }
    return () => clearInterval(interval);
  }, [selectedLesson, timer, currentIndex, questions.length]);

  const handleLessonSelect = async (lesson) => {
    const result = await Swal.fire({
      title: "Are you sure you want to start this test?",
      html: `
          <div class="text-left">
              <p>⚠️ Please note before starting:</p>
              <ul>
                  <li>Each question has a time limit</li>
                  <li>Once you start, you cannot go back to previous questions</li>
                  <li>Make sure you're ready before beginning</li>
              </ul>
          </div>
      `,
      icon: "warning",
      customClass: {
        icon: "swal-my-icon",
      },
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Start Test",
      cancelButtonText: "Not yet",
      width: '600px',
      allowOutsideClick: false,

    });
    if (result.isConfirmed) {
      setSelectedLesson(lesson);
      fetchQuestions(lesson.id);
      setMarkedForReview([]);
    }
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
      setTimer(30);
    } else {
      submitAnswers();
    }
  };

  const previousQuestion = () => {
    if (currentIndex > 0) {
      // setCurrentIndex(currentIndex - 1);
    }
  };

  const handleOptionSelect = (optionLetter) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentIndex]: optionLetter,
    }));
  };

  const toggleMarkForReview = () => {
    setMarkedForReview((prev) => {
      if (prev.includes(currentIndex)) {
        return prev.filter((index) => index !== currentIndex);
      } else {
        return [...prev, currentIndex];
      }
    });
  };

  const handleBackClick = () => {
    navigate(-1); // Navigate to the previous page
  };

  const submitAnswers = async (isAutoSubmit = false) => {
    if (!isAutoSubmit) {
      const result = await Swal.fire({
        title: "Are you sure you want to submit your Test?",
        icon: "warning",
        customClass: {
          icon: "swal-my-icon",
        },
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes",
        cancelButtonText: "No", 
      });
      if (!result.isConfirmed) {
        return;
      }
    }

    const answersToSubmit = Object.entries(selectedAnswers).map(([index, answer]) => ({
      question_id: questions[+index].id,
      user_answer: answer,
    }));
    try {
      const response = await axios.post(
        "/api/lesson-test-questions/student-answers/all/",
        answersToSubmit,

        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "application/json",
          },
        }

      );
      await Swal.fire({
        title: isAutoSubmit ? "Time's up! Test Submitted" : "Test Submitted Successfully",
        text: "Kindly wait for the result",
        icon: "success",
        confirmButtonColor: "#7066E0",
        confirmButtonText: "OK",
      });
      setSelectedAnswers({});
      setCurrentIndex(0);
      setSelectedLesson(null);
      fetchLessons();
      fetchCompletedTests();

    } catch (err) {
      Swal.fire({
        icon: "error",
        customClass: {
          icon: "swal-my-icon",
        },
        title: err?.response?.data?.detail || "Submission failed. Please try again later.",
        showConfirmButton: false,
        timer: 2100,
      });
    }
  };

  const renderOption = (optionText, optionImage, optionLetter) => (
    <div
      className={`flex items-center p-2 rounded-full mb-2 cursor-pointer ${selectedAnswers[currentIndex] === optionLetter ? 'bg-green-500 text-white' : 'hover:bg-gray-100'
        }`}
      onClick={() => handleOptionSelect(optionLetter)}
    >
      <div
        className={`w-6 h-6 flex items-center justify-center rounded-full border ${selectedAnswers[currentIndex] === optionLetter ? 'border-white' : 'border-gray-400'
          } mr-2`}
      >
        {optionLetter}
      </div>
      {optionImage ? (
        <img
          src={optionImage}
          alt={`Option ${optionLetter}`}
          className="ml-2 h-8 w-8 object-cover"
        />
      ) : (
        <span>{optionText}</span>
      )}
    </div>
  );

  const renderActiveTest = () => {
    if (loading) return <div className="text-center mt-8">Loading...</div>;
    if (error) return <div className="text-center mt-8 text-red-500">Error: {error}</div>;

    if (!selectedLesson) {
      const incompleteLessons = lessons.filter((lesson) => !lesson.is_test_completed);

      if (incompleteLessons.length === 0) {
        return (
          <div className="text-center p-6">
            <p className="text-gray-600 text-lg">No lessons available for test.</p>
          </div>
        );
      }

      return (
        <ul className="grid  gap-7 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 grid-cols-4 ">
          {incompleteLessons.map((lesson) => (
            <li
              key={lesson.id}
              onClick={() => handleLessonSelect(lesson)}
              className="w-96 mb-2 p-4 bg-white shadow-lg rounded-lg border border-gray-200 hover:bg-gray-50 transition duration-200 cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Lesson:</h3>
                  <p className="text-gray-600">{lesson.lesson_title}</p>
                </div>
                <span
                  className={`text-sm px-3 py-1 rounded-full ${lesson.is_test_completed ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}
                >
                  {lesson.is_test_completed ? 'Completed' : 'Incomplete'}
                </span>
              </div>
              <div className="mt-2 text-sm text-gray-500">
                Created on: {new Date(lesson.created_on).toLocaleDateString()}
              </div>
            </li>
          ))}
        </ul>
      );
    }

    if (questions.length === 0) return <div className="text-center mt-8">No questions available for this lesson.</div>;

    const currentQuestion = questions[currentIndex];

    return (
      <div className="max-w-4xl mx-auto mt-8 p-4 bg-white rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Lesson: {selectedLesson.lesson_title}</h2>
          <div className="flex items-center">
            <button
              className={`bg-gray-200 text-gray-700 px-2 py-1 rounded mr-2 flex items-center ${markedForReview.includes(currentIndex) ? 'bg-yellow-200' : ''
                }`}
              onClick={toggleMarkForReview}
            >
              <Flag size={16} className="mr-1" />
              {markedForReview.includes(currentIndex) ? 'Marked for Review' : 'Mark for Review'}
            </button>
            <div className="bg-blue-400 text-white px-3 py-1 rounded">{timer}s</div>
          </div>
        </div>

        <div className="flex">
          <div className="w-3/4 pr-4">
            <div className="bg-gray-100 p-4 rounded-lg mb-4">
              <p className="font-semibold mb-2">
                {currentIndex + 1}. {currentQuestion.question_text || "Image-based question"}
              </p>
              {currentQuestion.question_image && (
                <img src={currentQuestion.question_image} alt="Question" className="mb-4 max-w-full h-auto" />
              )}

              {renderOption(currentQuestion.option1_text, currentQuestion.option1_image, "A")}
              {renderOption(currentQuestion.option2_text, currentQuestion.option2_image, "B")}
              {renderOption(currentQuestion.option3_text, currentQuestion.option3_image, "C")}
              {renderOption(currentQuestion.option4_text, currentQuestion.option4_image, "D")}

              <div className="mt-4">
                <p>Difficulty: {currentQuestion.difficulty_level}</p>
                <p>Marks: {currentQuestion.per_question_marks}</p>
              </div>
            </div>
          </div>

          <div className="w-1/4">
            <div className="bg-gray-100 p-4 rounded-lg">
              <h3 className="font-bold mb-2">ANSWER STATUS</h3>
              <div className="grid grid-cols-6 gap-2">
                {questions.map((_, index) => (
                  <div
                    key={index}
                    className={`w-8 h-8 flex items-center justify-center rounded-full text-white text-sm ${markedForReview.includes(index)
                      ? "bg-yellow-500"  // Marked for review
                      : selectedAnswers[index] !== undefined
                        ? index === currentIndex
                          ? "bg-blue-400"   // Current question
                          : "bg-green-500"  // Answered
                        : "bg-orange-500"   // Unanswered
                      }`}
                  >
                    {index + 1}
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-4">
                <button
                  className="bg-green-500 text-white px-3 py-1 rounded"
                  onClick={previousQuestion}
                  disabled={currentIndex === 0}
                >
                  Previous
                </button>
                <button
                  className="bg-blue-400 text-white px-3 py-1 rounded"
                  onClick={nextQuestion}
                  disabled={currentIndex === questions.length - 1}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center mt-4">
          <div>
            <span className="text-green-500 font-bold">
              Answered: {Object.keys(selectedAnswers).length}
            </span>
          </div>
          <div>
            <span className="text-orange-500 font-bold">
              Unanswered: {questions.length - Object.keys(selectedAnswers).length}
            </span>
          </div>
          <div>
            <span className="text-yellow-500 font-bold">
              Marked for Review: {markedForReview.length}
            </span>
          </div>
          <div className="space-x-2">
            <button
              className="bg-green-500 text-white px-4 py-2 rounded"
              onClick={() => submitAnswers(false)}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderCompletedTests = () => {
    return (
      <div className="max-w-4xl mx-auto mt-8 p-4 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Completed Tests</h2>
        {completedTests.length === 0 ? (
          <p>No completed tests available.</p>
        ) : (
          <ul className="grid  gap-7 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 grid-cols-3">
            {completedTests.map((test, index) => (
              <li
                key={index}
                className=" mb-2 p-4 bg-white shadow-lg rounded-lg border border-gray-200 hover:bg-gray-50 transition duration-200"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">Lesson:</h3>
                    <p className="text-gray-600">{test.lesson_title}</p>
                  </div>
                  <span className="text-sm px-3 py-1 rounded-full bg-green-100 text-green-700">
                    Completed
                  </span>
                </div>
                <div className="mt-2 text-sm text-gray-500">
                  Created on: {new Date(test.created_on).toLocaleDateString()}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  };

  return (
    <>
      <Topbar heading="Assessment" />
      <div className="m-5 max-h-screen">
        <div className="flex mb-4">
          <button
            className={`mr-2 px-4 py-2 rounded ${activeTab === "active" ? "bg-teal-900 text-white-A700" : "bg-gray-200"
              }`}
            onClick={() => setActiveTab("active")}
          >
            Active Tests
          </button>
          <button
            className={`px-4 py-2 rounded ${activeTab === "completed" ? "bg-teal-900 text-white-A700" : "bg-gray-200"
              }`}
            onClick={() => setActiveTab("completed")}
          >
            Completed Tests
          </button>
        </div>
        {activeTab === "active" ? renderActiveTest() : renderCompletedTests()}
      </div>
    </>
  );
};

export default AssessmentTabs;