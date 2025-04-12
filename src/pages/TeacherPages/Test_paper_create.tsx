import React, { useState, useEffect } from 'react';
import axios from "helper/axios"; // Assuming this is your Axios instance
import { useAuthContext } from 'hooks/useAuthContext';
import Swal from 'sweetalert2';
import Topbar from 'components/Topbar';
import { Button } from 'components';
import { Link, useNavigate } from 'react-router-dom';

const TestPaperCreate = () => {
  const [questionText, setQuestionText] = useState<string>('');
  const [answers, setAnswers] = useState<string[]>(['', '', '', '']); // Default 4 answers
  const [questionImages, setQuestionImages] = useState<File | null>(null);
  const [optionImages, setOptionImages] = useState<(File | null)[]>([null, null, null, null]); // 4 images for options
  const [correctAnswer, setCorrectAnswer] = useState<string>('');
  const [correctAnswerImage, setCorrectAnswerImage] = useState<File | null>(null);
  const [difficultyLevel, setDifficultyLevel] = useState<string>('');
  const [perQuestionMarks, setPerQuestionMarks] = useState<number | null>(null);
  const [questionPaperId, setQuestionPaperId] = useState<string>('');
  const [questionPapers, setQuestionPapers] = useState<any[]>([]); // Store fetched question papers here
  const { user } :any= useAuthContext(); // Get user context for authorization

  // Fetch question papers on component mount
  useEffect(() => {
    const fetchQuestionPapers = async () => {
      try {
        const response = await axios.get('/api/lesson_name-tests/get_all/', {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        setQuestionPapers(response.data);
      } catch (error) {
        console.error("Error fetching question papers:", error);
      }
    };

    fetchQuestionPapers();
  }, [user.token]);

  const handleAnswerChange = (index: number, value: string) => {
    const updatedAnswers = [...answers];
    updatedAnswers[index] = value;
    setAnswers(updatedAnswers);
  };

  const handleOptionImageChange = (index: number, file: File | null) => {
    const updatedImages = [...optionImages];
    updatedImages[index] = file;
    setOptionImages(updatedImages);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    // if (!questionText || !questionPaperId || answers.some(answer => !answer) || !correctAnswer) {
    //   alert('Please fill in all required fields.');
    //   return;
    // }

    const formData = new FormData();
    
    formData.append('question_paper_id', questionPaperId); // Selected question paper ID
    formData.append('question_text', questionText);
    
    if (questionImages) {
      formData.append('question_images', questionImages); // Append question image if available
    }
    
    answers.forEach((answer, index) => {
      formData.append(`option${index + 1}_text`, answer);
      if (optionImages[index]) {
        formData.append(`option${index + 1}_images`, optionImages[index]);
      }
    });

    formData.append('correct_ans_text', correctAnswer);
    if (correctAnswerImage) {
      formData.append('correct_ans_images', correctAnswerImage);
    }
    
    formData.append('difficulty_level', difficultyLevel);
    formData.append('per_question_marks', perQuestionMarks ? perQuestionMarks.toString() : '0');
    
    try {
      const response = await axios.post("/api/lesson-test-questions/", formData, {
        headers: {
          Authorization: `Bearer ${user.token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      Swal.fire({
        title: "Test Created Successfully",
        icon: "success",
        confirmButtonColor: "#7066E0",
        confirmButtonText: "OK",
      });
       
      // Reset form fields
      resetForm();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: error?.response?.data?.detail || "Please try again later.",
        showConfirmButton: false,
        timer: 2100,
      });
      console.error('Error creating question:', error);
     
    }
  };

  const resetForm = () => {
    setQuestionText('');
    setAnswers(['', '', '', '']);
    setQuestionImages(null);
    setOptionImages([null, null, null, null]);
    setCorrectAnswer('');
    setCorrectAnswerImage(null);
    setDifficultyLevel('');
    setPerQuestionMarks(null);
    setQuestionPaperId('');
  };

  return (
    <>
    <Topbar heading="Test paper Create" />
    <div className="p-6">
        <Button  variant="outline">
          <Link to="/dashboard/questionprieview">Preview Question Test Paper</Link>
        </Button>
      </div>

    <div className="p-6 bg-white shadow-md rounded-md">
      <form onSubmit={handleSubmit}>
        {/* Dropdown to select Question Paper */}
        <div className="mb-4">
          <label className="block text-lg font-medium mb-2">Select Lesson for create Test</label>
          <select
            className="w-full p-2 border border-gray-300 rounded-md"
            value={questionPaperId}
            onChange={(e) => setQuestionPaperId(e.target.value)}
          >
            <option value="">Select a Question Paper</option>
            {questionPapers.map((paper) => (
              <option key={paper.id} value={paper.id}>
                {paper.lesson_title}
              </option>
            ))}
          </select>
        </div>

        {/* Question Text */}
        <div className="mb-4">
          <label className="text-lg font-medium mb-2">Question Title</label>
          <textarea
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter the question text"
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
          ></textarea>
        </div>

        {/* Upload Question Image */}
        <div className="mb-4">
          <label className="block text-lg font-medium mb-2">Upload Question Image (optional)</label>
          <input
            type="file"
            onChange={(e) => setQuestionImages(e.target.files ? e.target.files[0] : null)}
          />
        </div>

        {/* Answer Options */}
        <div className="mb-4">
          <h3 className="text-lg font-medium mb-2">At least 4 options must be provided as mandatory</h3>
          {answers.map((answer, index) => (
            <div key={index} className="flex items-center mb-3">
              <input
                type="text"
                value={answer}
                onChange={(e) => handleAnswerChange(index, e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={`Answer ${index + 1}`}
              />
              <input
                type="file"
                className="ml-4"
                onChange={(e) => handleOptionImageChange(index, e.target.files ? e.target.files[0] : null)}
              />
            </div>
          ))}
          <button
            type="button"
            className="text-blue-500 underline"
            onClick={() => {
              if (answers.length < 6) { // Limit to 6 options
                setAnswers([...answers, '']);
                setOptionImages([...optionImages, null]); // Add corresponding image slot
              }
            }}
          >
            + Add Answer
          </button>
        </div>

        {/* Correct Answer */}
        <div className="mb-4">
          <label className="block text-lg font-medium mb-2">Correct Answer should be options A, B, C, D</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded-md"
            value={correctAnswer}
            onChange={(e) => setCorrectAnswer(e.target.value)}
            placeholder="Correct answer text"
          />
        </div>

        {/* Upload Correct Answer Image */}
        {/* <div className="mb-4">
          <label className="block text-lg font-medium mb-2">Upload Correct Answer Image (optional)</label>
          <input
            type="file"
            onChange={(e) => setCorrectAnswerImage(e.target.files ? e.target.files[0] : null)}
          />
        </div> */}

        {/* Difficulty Level */}
        <div className="mb-4">
          <label className="block text-lg font-medium mb-2">Difficulty Level</label>
          <select
            className="w-full p-2 border border-gray-300 rounded-md"
            value={difficultyLevel}
            onChange={(e) => setDifficultyLevel(e.target.value)}
            required
          >
            <option value="">Select Difficulty Level</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        {/* Marks per Question */}
        <div className="mb-4">
          <label className="block text-lg font-medium mb-2">Marks per Question</label>
          <input
            type="number"
            className="w-full p-2 border border-gray-300 rounded-md"
            value={perQuestionMarks || ''}
            onChange={(e) => setPerQuestionMarks(Number(e.target.value))}
            placeholder="Marks for this question"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Create Question
        </button>
      </form>
    </div>
    </>
  );
};

export default TestPaperCreate;
