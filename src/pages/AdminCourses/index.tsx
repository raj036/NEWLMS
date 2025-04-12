import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Topbar from "components/Topbar";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import { DialogTrigger } from "@radix-ui/react-dialog";
import Swal from "sweetalert2";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { BookOpenText } from "lucide-react";
import { useAuthContext } from "hooks/useAuthContext";
import axios from "helper/axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const Courses = () => {
  const { user }: any = useAuthContext();
  const [activeTab, setActiveTab] = useState(0);
  const [courseData, setCourseData] = useState([]);
  const [isDialogue, setIsDialogue] = useState(false);
  const [courseDetails, setCourseDetails] = useState([]);
  const [selectedTeacherId, setSelectedTeacherId] = useState(null);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [formData, setFormData] = useState({
    course_name: "",
    description: "",
    standards: [
      {
        standard_name: "",
        subjects: [
          {
            subject_name: "",
            modules: [
              {
                module_name: "",
              },
            ],
          },
        ],
      },
    ],
  });
  const [teacherData, setTeacherData] = useState<any>(null);

  const getCourseDetails = async (courseId: any) => {
    try {
      const response = await axios.get(`/api/course/admin/${courseId}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      setCourseDetails(response.data.related_course_details);
    } catch (error) {}
  };

  useEffect(() => {
    if (selectedCourseId) {
      getCourseDetails(selectedCourseId);
    }
  }, [selectedCourseId]);

  const handleInputChange = (fieldName: any, value: any) => {
    setFormData((prevData) => ({
      ...prevData,
      [fieldName]: value,
    }));
  };

  const handleStandardChange = (value: any) => {
    setFormData((prevData) => ({
      ...prevData,
      standards: [{ ...prevData.standards[0], standard_name: value }],
    }));
  };

  const handleSubjectChange = (value: any) => {
    setFormData((prevData) => ({
      ...prevData,
      standards: [
        {
          ...prevData.standards[0],
          subjects: [
            { ...prevData.standards[0].subjects[0], subject_name: value },
          ],
        },
      ],
    }));
  };

  const handleModuleChange = (value: any) => {
    setFormData((prevData) => ({
      ...prevData,
      standards: [
        {
          ...prevData.standards[0],
          subjects: [
            {
              ...prevData.standards[0].subjects[0],
              modules: [
                {
                  ...prevData.standards[0].subjects[0].modules[0],
                  module_name: value,
                },
              ],
            },
          ],
        },
      ],
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await axios.post("/api/courses_create/", formData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      });

      Swal.fire({
        icon: "success",
        title: `Course Created Successfully`,
        showConfirmButton: false,
        customClass: {
          icon: "swal-my-icon",
        },
        timer: 1500,
      });
      // Optionally, reset form or fetch updated course data
      getCourseData();
      setIsDialogue(false);
    } catch (error) {
      // console.error("Error Creating User", error);
      Swal.fire({
        icon: "error",
        title: "Error creating course.",
        text: error?.response?.data?.message || "Please try again later.",
        showConfirmButton: false,
        customClass: {
          icon: "swal-my-icon",
        },
        timer: 1500,
      });
    }
  };

  const getCourseData = async () => {
    try {
      const response = await axios.get("api/courses/unique", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      // console.log(response.data);
      setCourseData(response?.data);
    } catch (error) {
      // console.error(error);
    }
  };

  const getTeacherDetails = async () => {
    try {
      const response = await axios.get("/api/teachers/get_all", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      // console.log(response.data);
      setTeacherData(response.data);
    } catch (error) {
      // console.log(error);
    }
  };

  const handleCourseClick = (courseId: any) => {
    setSelectedCourseId(courseId);
  };

  useEffect(() => {
    getCourseData();
    getTeacherDetails();
  }, []);

  const [assignData, setAssignData] = useState({
    teacher_id: "",
    course_id: "",
    course_content_id: [""],
  });

  const handleTeacherSelect = (event, courseDetailId, courseId) => {
    const selectedTeacherId = event.target.value;
    setAssignData((prevData) => ({
      ...prevData,
      teacher_id: selectedTeacherId,
      course_id: courseId,
      course_content_id: courseDetailId,
    }));
  };

  const handleAssign = async (e: any) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `/api/teachers/assign_courses`,
        assignData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      Swal.fire({
        icon: "success",
        title: "Course assigned successfully",
        showConfirmButton: false,
        customClass: {
          icon: "swal-my-icon",
        },
        timer: 2000,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        customClass: {
          icon: "swal-my-icon",
          popup: "swal-txt",
        },
        text: error?.response?.data?.detail || "Please try again later.",
        showConfirmButton: false,
        timer: 4000,
      });
    }
  };

  return (
    <>
      <Topbar heading={"Courses"} />

        
          <div className="container py-5">
            <div className="flex space-x-4 w-full justify-center">
              <Link to="/fees" onClick={() => setIsDialogue(false)}>
                <Button className="w-[40rem] bg-teal-900 hover:bg-blue-900 flex">
                  Fees Create
                </Button>
              </Link>

              <Link
                to="/AdminAssignedCourses"
                onClick={() => setIsDialogue(false)}
              >
                <Button className="w-[40rem] bg-teal-900 hover:bg-blue-900 flex">
                  Assigned Courses
                </Button>
              </Link>
            </div>
            <Dialog open={isDialogue} onOpenChange={setIsDialogue}>
              <div className="flex justify-center">
                <DialogTrigger asChild>
                  <Button className="bg-teal-900 hover:!bg-blue-900 mt-6">
                    Create Course
                  </Button>
                </DialogTrigger>
              </div>
              <DialogContent className="overflow-scroll">
                <DialogHeader>Add courses here</DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="user_name" className="text-right">
                      Course
                    </Label>
                    <Input
                      id="user_name"
                      name="user_name"
                      type="text"
                      className="col-span-3"
                      value={formData.course_name}
                      onChange={(e) =>
                        handleInputChange("course_name", e.target.value)
                      }
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="standard_name" className="text-right">
                      Standard
                    </Label>
                    <Input
                      id="standard_name"
                      name="standard_name"
                      type="text"
                      className="col-span-3"
                      value={formData.standards[0].standard_name}
                      onChange={(e) => handleStandardChange(e.target.value)}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="subject_name" className="text-right">
                      Subject
                    </Label>
                    <Input
                      id="subject_name"
                      name="subject_name"
                      type="text"
                      className="col-span-3"
                      value={formData.standards[0].subjects[0].subject_name}
                      onChange={(e) => handleSubjectChange(e.target.value)}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="module_name" className="text-right">
                      Module
                    </Label>
                    <Input
                      id="module_name"
                      name="module_name"
                      type="text"
                      className="col-span-3"
                      value={
                        formData.standards[0].subjects[0].modules[0].module_name
                      }
                      onChange={(e) => handleModuleChange(e.target.value)}
                      required
                    />
                  </div>
                  <DialogFooter>
                    <Button type="submit">Add</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="ruby-disp">
            {courseData.map((tab, index) => (
              <div
                key={index}
                className="m-4 cursor-pointer rounded-lg"
                onClick={() => handleCourseClick(tab.id)}
              >
                <div
                  className={`flex rounded-[10px] items-center mb-2 bg-gray-100 p-3 w-[250px] border-[1px] ${
                    selectedCourseId === tab.id ? "bg-blue-200" : "bg-white"
                  }`}
                  onClick={() => setActiveTab(index)}
                >
                  <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                    <BookOpenText className="h-5 w-5 text-gray-600" />
                  </div>
                  <span className="text-gray-700 font-semibold  ">
                    {tab.name}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* course details */}
          {teacherData && teacherData.length > 0 ? (
          <div className="mt-20 px-11 ">
            {courseDetails.length > 0 ? (
              <Table className="">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px] bg-teal-900 text-white-A700">
                      Standard
                    </TableHead>
                    <TableHead className="text-center bg-teal-900 text-white-A700">
                      Subject
                    </TableHead>
                    <TableHead className="text-center bg-teal-900 text-white-A700">
                      Module
                    </TableHead>
                    <TableHead className="text-center bg-teal-900 text-white-A700">
                      Assign course
                    </TableHead>
                    <TableHead className="text-right bg-teal-900 text-white-A700">
                      Assign
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {courseDetails.map((ele, index) => (
                    <TableRow key={index}>
                      <TableCell className="w-[100px]">
                        {ele.standard_name}
                      </TableCell>
                      <TableCell className="text-center">
                        {ele.subject_name}
                      </TableCell>
                      <TableCell className="text-center">
                        {ele.module_name}
                      </TableCell>
                      <TableCell className="text-right flex mx-auto">
                        <select
                          name="course"
                          id="course"
                          className="p-4 mx-auto bg-teal-900 border border-teal-90 float-right text-white-A700 text-sm rounded-[20px] focus:ring-white-A700 focus:border-white-A700 block w-[60%] dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                          onChange={(event) =>
                            handleTeacherSelect(event, ele.id, selectedCourseId)
                          }
                          required
                        >
                          <option value="">Select teacher...</option>
                          {teacherData  && teacherData.map((ele) => (
                            <option key={ele.Teacher_id} value={ele.Teacher_id}>
                              {ele.name}
                            </option>
                          ))}
                        </select>
                      </TableCell>
                      <TableCell className="text-right">
                        <button
                          onClick={handleAssign}
                          className="border p-[6px] text-[white] z-10 transition hover:bg-white-A700 hover:text-deep_orange-500 border-deep_orange-500 bg-deep_orange-500"
                        >
                          Assign
                        </button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              ""
            )}
          </div>
      
      ) : (
        <div className="text-center text-[20px] my-[40px]">Currently no teacher was there</div>
      )}
    </>
  );
};

export default Courses;
