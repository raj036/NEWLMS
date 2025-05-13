import React, { useState, useEffect } from 'react';
import axios from "helper/axios"; // Assuming this is your Axios instance
import { useAuthContext } from 'hooks/useAuthContext';
import Swal from 'sweetalert2';
import Topbar from 'components/Topbar';
import { Button } from 'components';
import { Link, useNavigate } from 'react-router-dom';

interface BulkQuestion {
  question_paper_id: string;
  question_text: string;
  question_images?: string | null;
  option1_text: string;
  option1_images?: string | null;
  option2_text: string;
  option2_images?: string | null;
  option3_text: string;
  option3_images?: string | null;
  option4_text: string;
  option4_images?: string | null;
  correct_ans_text: string;
  correct_ans_images?: string | null;
  difficulty_level: string;
  per_question_marks: number;
}
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
const { user }: any = useAuthContext();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [questions, setQuestions] = useState<any[]>([]);
  const [questionsList, setQuestionsList] = useState<any[]>([]);
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
  
  const uploadFile = async (file: File | null): Promise<string | null> => {
    if (!file) return null;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('/api/upload/', formData);
      return response.data.filePath;
    } catch (error) {
      console.error("Error uploading file:", error);
      return null;
    }
  };

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

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
    
  //   // Basic validation
  //   // if (!questionText || !questionPaperId || answers.some(answer => !answer) || !correctAnswer) {
  //   //   alert('Please fill in all required fields.');
  //   //   return;
  //   // }

  //   const formData = new FormData();
    
  //   formData.append('question_paper_id', questionPaperId); // Selected question paper ID
  //   formData.append('question_text', questionText);
    
  //   if (questionImages) {
  //     formData.append('question_images', questionImages); // Append question image if available
  //   }
    
  //   answers.forEach((answer, index) => {
  //     formData.append(`option${index + 1}_text`, answer);
  //     if (optionImages[index]) {
  //       formData.append(`option${index + 1}_images`, optionImages[index]);
  //     }
  //   });

  //   formData.append('correct_ans_text', correctAnswer);
  //   if (correctAnswerImage) {
  //     formData.append('correct_ans_images', correctAnswerImage);
  //   }
    
  //   formData.append('difficulty_level', difficultyLevel);
  //   formData.append('per_question_marks', perQuestionMarks ? perQuestionMarks.toString() : '0');
    
  //   try {
  //     const response = await axios.post("/api/lesson-test-questions/", formData, {
  //       headers: {
  //         Authorization: `Bearer ${user.token}`,
  //         'Content-Type': 'multipart/form-data',
  //       },
  //     });
  //     Swal.fire({
  //       title: "Test Created Successfully",
  //       icon: "success",
  //       confirmButtonColor: "#7066E0",
  //       confirmButtonText: "OK",
  //     });
       
  //     // Reset form fields
  //     resetForm();
  //   } catch (error) {
  //     Swal.fire({
  //       icon: "error",
  //       title: error?.response?.data?.detail || "Please try again later.",
  //       showConfirmButton: false,
  //       timer: 2100,
  //     });
  //     console.error('Error creating question:', error);
     
  //   }
  // };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    let updatedQuestions = [...questionsList]; // ✅ Declare here so it's accessible later
  
    if (isFormValid()) {
      const currentQuestion = {
        questionPaperId,
        questionText,
        questionImages,
        answers: [...answers],
        optionImages: [...optionImages],
        correctAnswer,
        correctAnswerImage,
        difficultyLevel,
        perQuestionMarks,
      };
  
      if (currentIndex < updatedQuestions.length) {
        updatedQuestions[currentIndex] = currentQuestion;
      } else {
        updatedQuestions.push(currentQuestion);
      }
  
      setQuestionsList(updatedQuestions);
    } else {
      return; // Exit early if form is not valid
    }
  
    // ✅ Now you can safely use updatedQuestions here
    const uploadPromises = updatedQuestions.map(async (q) => {
      const questionImagePath = await uploadFile(q.questionImages);
      const optionImagePaths = await Promise.all(
        q.optionImages.map(file => uploadFile(file))
      );
      const correctAnsImagePath = await uploadFile(q.correctAnswerImage);
  
      return {
        question_paper_id: q.questionPaperId,
        question_text: q.questionText,
        question_images: questionImagePath,
        option1_text: q.answers[0],
        option1_images: optionImagePaths[0],
        option2_text: q.answers[1],
        option2_images: optionImagePaths[1],
        option3_text: q.answers[2],
        option3_images: optionImagePaths[2],
        option4_text: q.answers[3],
        option4_images: optionImagePaths[3],
        correct_ans_text: q.correctAnswer,
        correct_ans_images: correctAnsImagePath,
        difficulty_level: q.difficultyLevel,
        per_question_marks: q.perQuestionMarks || 0,
      };
    });
  
    try {
      const bulkQuestions = await Promise.all(uploadPromises);
      const response = await axios.post("/api/lesson-test-questions/", bulkQuestions, {
        headers: {
          Authorization: `Bearer ${user.token}`,
          'Content-Type': 'application/json',
        },
      });
  
      Swal.fire({
        title: "Test Created Successfully",
        icon: "success",
        confirmButtonColor: "#7066E0",
        confirmButtonText: "OK",
      });
  
      setQuestionsList([]);
      setCurrentIndex(0);
      resetForm();
      console.log(response);
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

  const previousQuestion = () => {
    // Save the current question data before navigating away
    const currentQuestionData = {
      questionPaperId,
      questionText,
      questionImages,
      answers,
      optionImages,
      correctAnswer,
      correctAnswerImage,
      difficultyLevel,
      perQuestionMarks,
    };
  
    // Update the current question in the list
    const updatedQuestions = [...questionsList];
    if (currentIndex < updatedQuestions.length) {
      updatedQuestions[currentIndex] = currentQuestionData;
    } else {
      updatedQuestions.push(currentQuestionData);
    }
    setQuestionsList(updatedQuestions);
  
    // Now navigate to previous question
    if (currentIndex > 0) {
      const previousData = updatedQuestions[currentIndex - 1];
      if (previousData) {
        setQuestionPaperId(previousData.questionPaperId || '');
        setQuestionText(previousData.questionText || '');
        setQuestionImages(previousData.questionImages || null);
        setAnswers(previousData.answers || ['', '', '', '']);
        setOptionImages(previousData.optionImages || [null, null, null, null]);
        setCorrectAnswer(previousData.correctAnswer || '');
        setCorrectAnswerImage(previousData.correctAnswerImage || null);
        setDifficultyLevel(previousData.difficultyLevel || '');
        setPerQuestionMarks(previousData.perQuestionMarks || '');
      }
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const isFormValid = () => {
    // Check if all required fields are filled
    return (
      questionText.trim() !== '' &&
      answers.every((answer) => answer.trim() !== '') && // All answers should be filled
      difficultyLevel.trim() !== '' &&
      perQuestionMarks !== null && perQuestionMarks > 0
    );
  };


  const nextQuestion = (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!isFormValid()) {
      return; // Do nothing if the form is not valid
    }
    
    // Save current form data
    const questionData = {
      questionPaperId,
      questionText,
      questionImages,
      answers,
      optionImages,
      correctAnswer,
      correctAnswerImage,
      difficultyLevel,
      perQuestionMarks,
    };
  
    // Update the questionList
    const updatedQuestions = [...questionsList];
    if (currentIndex < updatedQuestions.length) {
      updatedQuestions[currentIndex] = questionData; // Update the current question
    } else {
      updatedQuestions.push(questionData); // If the current index is new, add to the list
    }
    setQuestionsList(updatedQuestions);
    
    // Check if we need to load an existing next question or create a new one
    if (currentIndex + 1 < updatedQuestions.length) {
      // Load the next question's data
      const nextData = updatedQuestions[currentIndex + 1];
      setQuestionPaperId(nextData.questionPaperId || '');
      setQuestionText(nextData.questionText || '');
      setQuestionImages(nextData.questionImages || null);
      setAnswers(nextData.answers || ['', '', '', '']);
      setOptionImages(nextData.optionImages || [null, null, null, null]);
      setCorrectAnswer(nextData.correctAnswer || '');
      setCorrectAnswerImage(nextData.correctAnswerImage || null);
      setDifficultyLevel(nextData.difficultyLevel || '');
      setPerQuestionMarks(nextData.perQuestionMarks || '');
    } else {
      // Reset form for a new question
      setQuestionText('');
      setQuestionImages(null);
      setAnswers(['', '', '', '']);
      setOptionImages([null, null, null, null]);
      setCorrectAnswer('');
      setCorrectAnswerImage(null);
      setDifficultyLevel('');
      setPerQuestionMarks(null);
    }
    
    // Move to the next question
    setCurrentIndex((prev) => prev + 1);
    console.log(updatedQuestions); // Log after saving data
  };

  useEffect(() => {
    console.log('Updated questionsList:', questionsList);
  }, [questionsList]); 

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
            required
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
            required
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
            required
          />
          {correctAnswerImage && (
              <img
                src={URL.createObjectURL(correctAnswerImage)}
                alt="Correct Answer Preview"
                className="mt-2 max-w-xs border rounded"
              />
            )}
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

       <div className='flex gap-4'>
            <button
            type='button'
              className={`bg-gray-400 text-gray-800 px-4 py-2 rounded ${currentIndex === 0 ? 'cursor-not-allowed opacity-50' : ''}`}
              onClick={previousQuestion}
              disabled={currentIndex > questionsList.length}
            >
              Previous
            </button>
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded"
              onClick={nextQuestion}
              disabled={!isFormValid()}
            >
              Next
            </button>

            <div className='flex w-full justify-end'>
              <button
                type="submit"
                className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Create Question
              </button>
            </div>
          </div>

      </form>
    </div>
    </>
  );
};

export default TestPaperCreate;
