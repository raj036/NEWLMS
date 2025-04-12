import React, { useState, useEffect } from "react";
import Topbar from "components/Topbar";
import { DataTable } from "./d-table";
import { columns } from "./columns";
import { useAuthContext } from "hooks/useAuthContext";
import axios from "helper/axios";
import Swal from "sweetalert2";
import Loader from "components/Loader";
import { Helmet } from "react-helmet";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trash2 } from "lucide-react";

interface AddVideoData {
  course_name: any;
  subject_name: any;
  standard_name: any;
  name: any;
  video_file: any;
}

const Enquiry = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user }: any = useAuthContext();

  useEffect(() => {
    fetchEnquiry();
  }, [user]);

  const fetchEnquiry = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/demoformfill/`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      });
      setData(response.data);
    } catch (error) {
      // console.error("Error fetching enquiry data", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        customClass: {
          icon: "swal-my-icon",
        },
        text: error?.response?.data?.detail || "Failed to fetch enquiry data",
        showConfirmButton: true,
        confirmButtonColor: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="container mx-auto p-5 bg-white shadow-lg rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Enquiry List</h2>
          <DataTable columns={columns} data={data} />
        </div>
      )}
    </>
  );
};

const Courses = () => {
  const { user }: any = useAuthContext();
  const [courseData, setCourseData] = useState([]);
  const [videoData, setVideoData] = useState([]);
  const [addVideo, setAddVideo] = useState<AddVideoData>({
    course_name: "",
    subject_name: "",
    standard_name: "",
    name: "",
    video_file: null,
  });
  const [loading, setLoading] = useState(false);
  const [isDialogue, setIsDialogue] = useState(false);

  const [selectedCourse, setSelectedCourse] = useState({ id: "", name: "" });
  const [selectedStandard, setSelectedStandard] = useState({
    id: "",
    name: "",
  });
  const [selectedSubject, setSelectedSubject] = useState({ id: "", name: "" });

  const [courses, setCourses] = useState([]);
  const [standards, setStandards] = useState([]);
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get("api/courses_all/");
        setCourses(response.data.course_list);
        setLoading(false);
        // console.log(response.data.course_list)
      } catch (error) {
        // console.error("Error fetching courses:", error);
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleCourseChange = (e) => {
    const courseId = e.target.value;
    const course = courses.find((c) => c.course_id.toString() === courseId);
    setSelectedCourse({ id: courseId, name: course.course_name });
    setSelectedStandard({ id: "", name: "" });
    setSelectedSubject({ id: "", name: "" });
    setStandards(course ? course.standards : []);
    setSubjects([]);
    setAddVideo(prev => ({ ...prev, course_name: course.course_name }));
  };

  const handleStandardChange = (e) => {
    const standardId = e.target.value;
    const standard = standards.find((s) => s.standard_id.toString() === standardId);
    setSelectedStandard({ id: standardId, name: standard.standard_name });
    setSelectedSubject({ id: "", name: "" });
    setSubjects(standard ? standard.subjects : []);
    setAddVideo(prev => ({ ...prev, standard_name: standard.standard_name }));
  };

  const handleSubjectChange = (e) => {
    const subjectId = e.target.value;
    const subject = subjects.find((s) => s.subject_id.toString() === subjectId);
    setSelectedSubject({ id: subjectId, name: subject.subject_name });
    setAddVideo(prev => ({ ...prev, subject_name: subject.subject_name }));
  };

  const fetchVideoData = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/videos", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      setVideoData(response.data);
      // console.log(response)
    } catch (error) {
      // console.error("Error fetching video data", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        customClass: {
          icon: "swal-my-icon",
        },
        text: error?.response?.data?.message || "Failed to fetch video data",
        showConfirmButton: true,
        confirmButtonColor: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (fieldName: any, e: any) => {
    const value =
      fieldName === "video_file" ? e.target.files[0] : e.target.value;
    setAddVideo((prevData) => ({
      ...prevData,
      [fieldName]: value,
    }));
  };

  const handleSubmit = async (e:any) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('course_name', addVideo.course_name);
      formData.append('subject_name', addVideo.subject_name);
      formData.append('standard_name', addVideo.standard_name);
      formData.append('name', addVideo.name);
      formData.append('video_file', addVideo.video_file);

      const response = await axios.post("/api/videos/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${user.token}`,
        },
      });
      setIsDialogue(false);
      setLoading(false);
      fetchVideoData();
      // console.log(response);
    } catch (error) {
      // console.error("Error uploading video", error);
      // Handle error...
    }
  };

  const deleteContent = async (id: any) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        customClass: {
          icon: "swal-my-icon",
        },
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });

      if (result.isConfirmed) {
        const response = await axios.delete(`/api/videos/${id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        });
        if (response.status === 200) {
          await Swal.fire(
            "Deleted!",
            "Your content has been deleted.",
            "success"
          );
          fetchVideoData();
        } else {
          throw new Error("Failed to delete Content");
        }
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Your content was not deleted.",
        icon: "error",
        customClass: {
          icon: "swal-my-icon",
        },
        timer: 2000, // Timer in milliseconds (3000ms = 3 seconds)
        timerProgressBar: true, // Shows a progress bar for the timer
        showConfirmButton: false, // Optionally hide the confirm button
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
      setCourseData(response?.data?.unique_courses || []);
    } catch (error) {
      // console.error("Error fetching course data", error);
    }
  };

  useEffect(() => {
    getCourseData();
    fetchVideoData();
  }, [user]);

  return (
    <div className="container mx-auto p-5 bg-[white] shadow-lg rounded-lg">
      {/* <h2 className="text-2xl font-semibold mb-4">Upload New Video</h2> */}
      <Dialog open={isDialogue} onOpenChange={setIsDialogue}>
        <div className="flex justify-end">
          <DialogTrigger asChild>
            <Button className="bg-teal-900 hover:!bg-blue-900 text-[white]">
              Upload Video
            </Button>
          </DialogTrigger>
        </div>
        <DialogContent>
          <DialogHeader>Upload Video</DialogHeader>
          <form onSubmit={handleSubmit} className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="course_name" className="text-right">
                Course
              </Label>
              <select
                id="course_name"
                name="course_name"
                required
                className="col-span-3 p-4 bg-gray-500 border border-teal-90 text-white-A700 text-sm rounded-md focus:ring-white-A700 focus:border-white-A700 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                value={selectedCourse.id}
                onChange={handleCourseChange}
              >
                <option value="">Select a course...</option>
                  {courses.map((course) => (
                    <option key={course.course_id} value={course.course_id}>
                      {course.course_name}
                    </option>
                  ))}
              </select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="standard_name" className="text-right">
                Standard Name
              </Label>
              <select
                id="standard_name"
                name="standard_name"
                required
                className="col-span-3 p-4 bg-gray-500 border border-teal-90 text-white-A700 text-sm rounded-md focus:ring-white-A700 focus:border-white-A700 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                value={selectedStandard.id}
                onChange={handleStandardChange}
                disabled={!standards.length}
              >
                <option value="">Select a standard...</option>
                  {standards.map((std) => (
                    <option key={std.standard_id} value={std.standard_id}>
                      {std.standard_name}
                    </option>
                  ))}
              </select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="subject_name" className="text-right">
                Subject Name
              </Label>
              <select
                id="subject_name"
                name="subject_name"
                required
                className="col-span-3 p-4 bg-gray-500 border border-teal-90 text-white-A700 text-sm rounded-md focus:ring-white-A700 focus:border-white-A700 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                value={selectedSubject.id}
                onChange={handleSubjectChange}
                disabled={!subjects.length}
              >
                <option value="">Select a Subject...</option>
                  {subjects.map((sub) => (
                    <option key={sub.subject_id} value={sub.subject_id}>
                      {sub.subject_name}
                    </option>
                  ))}
              </select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Video Name
              </Label>
              <Input
                id="name"
                name="name"
                required
                type="text"
                className="col-span-3 border-gray-300"
                onChange={(e) => handleChange("name", e)}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="video_file" className="text-right">
                Video File
              </Label>
              <Input
                id="video_file"
                name="video_file"
                required
                type="file"
                className="col-span-3 border-gray-300"
                onChange={(e) => handleChange("video_file", e)}
              />
            </div>
            <DialogFooter>
              <Button
                type="submit"
                className="bg-teal-900 hover:!bg-blue-900 text-[white]"
              >
                {loading ? "Uploading..." : "Upload"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <div className="mt-10">
        <h2 className="text-2xl font-semibold mb-4">Video List</h2>
        {loading ? (
          <Loader />
        ) : (
          <>
            {videoData && videoData.length > 0 ? (
              <Table className="w-full">
                <TableHeader>
                  <TableRow>
                    {/* <TableHead className="w-1/3">Name</TableHead> */}
                    <TableHead className="w-1/3">Course</TableHead>
                    <TableHead className="w-1/3">Subject</TableHead>
                    <TableHead className="w-1/3">Std</TableHead>
                    <TableHead className="w-1/3">URL</TableHead>
                    {/* <TableHead className="w-1/3">Actions</TableHead> */}
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {videoData.map((video) => (
                    <TableRow key={video.id}>
                      <TableCell>{video.course_name}</TableCell>
                      <TableCell>{video.subject_name}</TableCell>
                      <TableCell>{video.standard_name}</TableCell>
                      <TableCell>
                        <a
                          href={video.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600"
                        >
                          {video.name}
                        </a>
                      </TableCell>
                      <TableCell>
                        <button
                          className=""
                          onClick={() => deleteContent(video.id)}
                        >
                          <Trash2 className=" hover:text-[black] text-[red]" />
                        </button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="w-full text-center">No videos was uploaded</div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

const TabsDemo = () => {
  // State to track the active tab
  const [activeTab, setActiveTab] = useState("enquiry");

  return (
    <>
      <Helmet>
        <title>Demo page</title>
      </Helmet>
      <Topbar heading={"Demo"} />
      <Tabs defaultValue={activeTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mt-8 p-0">
          <TabsTrigger
            value="enquiry"
            onClick={() => setActiveTab("enquiry")}
            className={`py-2 px-4 rounded-t-lg text-gray-700 border-b-2 border-transparent hover:bg-gray-200 focus:bg-teal-900 focus:text-[white] ${
              activeTab === "enquiry" ? "bg-teal-900 text-[white]" : ""
            }`}
          >
            Enquiry
          </TabsTrigger>
          <TabsTrigger
            value="demo-video"
            onClick={() => setActiveTab("demo-video")}
            className={`py-2 px-4 rounded-t-lg text-gray-700 border-b-2 border-transparent hover:bg-gray-200 focus:bg-teal-900 focus:text-[white] ${
              activeTab === "demo-video" ? "bg-teal-900 text-[white]" : ""
            }`}
          >
            Demo Video
          </TabsTrigger>
        </TabsList>
        <TabsContent
          value="enquiry"
          className="p-4 bg-[white] shadow-md rounded-b-lg mt-4"
        >
          <Enquiry />
        </TabsContent>
        <TabsContent
          value="demo-video"
          className="p-4 bg-[white] shadow-md rounded-b-lg mt-4"
        >
          <Courses />
        </TabsContent>
      </Tabs>
    </>
  );
};

export default TabsDemo;
