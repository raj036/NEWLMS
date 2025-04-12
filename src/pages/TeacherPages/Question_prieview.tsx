import React, { useState, useEffect } from "react";
import axios from "helper/axios"; // Assuming this is your Axios instance
import { useAuthContext } from "hooks/useAuthContext";
import Swal from "sweetalert2";
import Topbar from "components/Topbar";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const QuestionPreview = () => {
    const [activeTab, setActiveTab] = useState("active");
    const [lessons, setLessons] = useState([]);
    const [selectedLesson, setSelectedLesson] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const { user }: any = useAuthContext();
    const navigate = useNavigate(); // Use the useNavigate hook

    const fetchLessons = async () => {
        try {
            const response = await axios.get("/api/lesson_name-tests/get_all/", {
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
        } catch (err) {
            setError("Failed to fetch questions");
            setLoading(false);
        }
    };

    const fetchCompletedTests = async () => {
        try {
            const response = await axios.get("/api/lesson_name-tests/get_all/", {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });
            // Handle completed tests if necessary
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

    const handleLessonSelect = (lesson) => {
        setSelectedLesson(lesson);
        fetchQuestions(lesson.id);
    };

    const nextQuestion = () => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const previousQuestion = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    const handleOptionSelect = (optionLetter) => {
        setSelectedAnswers((prev) => ({
            ...prev,
            [currentIndex]: optionLetter,
        }));
    };

    const handleBackClick = () => {
        navigate(-1); // Navigate to the previous page
    };

    const submitAnswers = async () => {
        const confirmSubmission = window.confirm("Are you sure you want to submit your Test?");
        if (!confirmSubmission) {
            return;
        }

        const answersToSubmit = Object.entries(selectedAnswers).map(([index, answer]) => ({
            question_id: questions[+index].id,
            user_answer: answer,
        }));

        try {
            await axios.post(
                "/api/lesson-test-questions/student-answers/all/",
                answersToSubmit,
                {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            Swal.fire({
                title: "Test Submitted Successfully",
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
                title: err?.response?.data?.detail || "Please try again later.",
                showConfirmButton: false,
                timer: 2100,
            });
        }
    };

    const renderOption = (optionText, optionImage, optionLetter) => (
        <div
            className={`flex items-center p-2 rounded-full mb-2 cursor-pointer ${selectedAnswers[currentIndex] === optionLetter ? 'bg-green-500 text-white' : 'hover:bg-gray-100'}`}
            onClick={() => handleOptionSelect(optionLetter)}
        >
            <div className={`w-6 h-6 flex items-center justify-center rounded-full border ${selectedAnswers[currentIndex] === optionLetter ? 'border-white' : 'border-gray-400'} mr-2`}>
                {optionLetter}
            </div>
            {optionImage ? (
                <img src={optionImage} alt={`Option ${optionLetter}`} className="ml-2 h-8 w-8 object-cover" />
            ) : (
                <span>{optionText}</span>
            )}
        </div>
    );

    const renderActiveTest = () => {
        if (loading) return <div className="text-center mt-8">Loading...</div>;
        if (error) return <div className="text-center mt-8 text-red-500">Error: {error}</div>;

        if (!selectedLesson) {
            return (
                <ul className="grid  gap-7 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 grid-cols-4">
                    {lessons.map((lesson) => (
                        <li
                            key={lesson.id}
                            onClick={() => handleLessonSelect(lesson)}
                            className="w-76 mb-2 p-4 bg-white shadow-lg rounded-lg border border-gray-200 hover:bg-gray-50 transition duration-200 cursor-pointer"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800">Lesson:</h3>
                                    <p className="text-gray-600">{lesson.lesson_title}</p>
                                </div>
                                <span
                                    className={`text-sm px-3 py-1 rounded-full ${lesson.is_test_completed ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
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
                        </div>

                        <div className="flex justify-between mt-4">
                            <button
                                className={`bg-gray-400 text-gray-800 px-4 py-2 rounded ${currentIndex === 0 ? 'cursor-not-allowed opacity-50' : ''}`}
                                onClick={previousQuestion}
                                disabled={currentIndex === 0}
                            >
                                Previous
                            </button>
                            <button
                                className={`bg-blue-600 text-white px-4 py-2 rounded ${currentIndex === questions.length - 1 ? 'hidden' : ''}`}
                                onClick={nextQuestion}
                            >
                                Next
                            </button>
                            {currentIndex === questions.length - 1 && (
                                <button
                                    className="bg-green-600 text-white px-4 py-2 rounded"
                                >
                                    Next
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <>
            <Topbar heading="Test paper" />
            <button
                onClick={handleBackClick}
                className="flex items-center space-x-2 text-teal-900 hover:text-blue-900"
            >
                <ArrowLeft className="w-6 h-6" />
                <span>Back</span>
            </button>
            <div className="flex flex-col min-h-screen">

                <div className="flex-grow p-6 bg-gray-100">
                    {renderActiveTest()}
                </div>
            </div>
        </>
    );
};

export default QuestionPreview;
