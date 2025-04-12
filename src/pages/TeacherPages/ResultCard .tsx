import React, { useState, useEffect } from "react";
import axios from "helper/axios"; // Assuming this is your Axios instance
import { useAuthContext } from "hooks/useAuthContext";

const ResultCard = () => {
    const [results, setResults] = useState([]);
    const { user }: any = useAuthContext();

    useEffect(() => {
        // Fetch data from the API when the component mounts
        const fetchResults = async () => {
            try {
                const response = await axios.get("/api/student_result/",{
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                });
                setResults(response.data); // Update state with the fetched results
            } catch (error) {
                console.error("Error fetching results:", error);
            }
        };
        fetchResults();
    }, []);

    return (
        <div className="p-5 bg-gray-100 min-h-screen flex justify-center">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl">
                {/* Header */}
                <div className="bg-orange-500 text-white p-4 text-center rounded-t-lg">
                    <h1 className="text-xl font-bold">
                    ILATE Coaching Institute - Result 
                    </h1>
                    <p className="text-sm mt-1">
                    ILATE Coaching Institute - Examination Result 
                    </p>
                </div>

                {/* Result List */}
                <div className="p-4">
                    <h2 className="text-lg font-bold text-gray-700 border-b mb-2">
                        Marks Details
                    </h2>
                    {results.length > 0 ? (
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-gray-200 text-left">
                                    <th className="border px-2 py-1">Student Name</th>
                                    <th className="border px-2 py-1">lesson Name</th>
                                    <th className="border px-2 py-1">Total Questions</th>
                                    <th className="border px-2 py-1">Correct Answers</th>
                                    <th className="border px-2 py-1">Wrong Answers</th>
                                    <th className="border px-2 py-1">Total Marks</th>
                                    <th className="border px-2 py-1">Result Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {results.map((result, index) => (
                                    <tr key={index}>
                                        <td className="border px-2 py-1">{result.Student_name}</td>
                                        <td className="border px-2 py-1">{result.lesson_name}</td>
                                        <td className="border px-2 py-1">{result.total_questions}</td>
                                        <td className="border px-2 py-1">{result.total_correct_answer}</td>
                                        <td className="border px-2 py-1">{result.total_wrong_answer}</td>
                                        <td className="border px-2 py-1">{result.Total_marks}</td>
                                        <td className="border px-2 py-1">
                                            {result.Result_status ? "Pass" : "Fail"}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p className="text-gray-600">No results available</p>
                    )}
                </div>

                {/* Disclaimer */}
                {/* Disclaimer */}
                <div className="p-4 text-gray-500 text-sm border-t">
                    <h3 className="font-bold mb-2">Disclaimer</h3>
                    <ul className="list-decimal list-inside">
                        <li>
                            This is a Computer Generated Provisional Score Card. The results published
                            on this platform are for immediate information to the candidates. They
                            cannot be treated as original certificates. Original certificates will be
                            issued by ILATE Coaching Institute at a later date.
                        </li>
                        <li>
                            Data provided by ILATE Coaching Institute's Examination Board and
                            authorized personnel.
                        </li>
                        <li>
                            Neither ILATE Caching Institute nor its partners are responsible for any
                            unintentional error in the scorecard or results displayed on this platform.
                        </li>
                        <li>
                            For any clarifications, please contact the ILATE Coaching Institute's
                            support team.
                        </li>
                    </ul>
                </div>


                {/* Footer */}
                {/* <div className="flex justify-center gap-4 p-4 border-t text-blue-500">
                    <button className="hover:underline">New Search</button>
                    <button className="hover:underline">Print Result</button>
                </div> */}
            </div>
        </div>
    );
};

export default ResultCard;
