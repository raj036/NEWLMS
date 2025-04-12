import React, { useEffect, useState } from "react";
import axios from "helper/axios";
import { useAuthContext } from "hooks/useAuthContext";
import Swal from "sweetalert2";
import Loader from "components/Loader";
import { Helmet } from "react-helmet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import DownloadIcon from "/images/download.png";
import EyeIcn from "/images/eye.png";

const AdminViewContent = () => {
  const [loading, setLoading] = useState(false);
  const [courseData, setCourseData] = useState<any>(null);
  const [detailId, setDetailId] = useState(null);
  const { user }: any = useAuthContext();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const detailId = queryParams.get("detailId");

    if (detailId) setDetailId(detailId);

    if (detailId) {
      getCourseDetails(detailId);
    }
  }, []);

  const getCourseDetails = async (detailId: any) => {
    try {
      const response = await axios.get(`/api/course_contents/${detailId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      });
      setCourseData(response.data);
    } catch (error) {
      // console.log(error);
    }
  };

  const deleteContent = async (id: any) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        customClass: {
          icon: "swal-my-icon",
        },
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });

      if (result.isConfirmed) {
        const response = await axios.delete(`/api/content_lesson/${id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        });

        if (response.status === 200) {
          Swal.fire("Deleted!", "Your content has been deleted.", "success");
          getCourseDetails(detailId);
        } else {
          throw new Error("Failed to delete Content");
        }
      }
    } catch (error) {
      // console.log(error);
    }
  };

  return (
    <>
      <Helmet>
        <title>View Content</title>
      </Helmet>
      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="container my-10">
            <div className="my-9 text-center text-[30px]">
              <h3>Course Details</h3>
            </div>
            {courseData && (
              <div className="mb-16 flex justify-center ">
                <table className="w-[50%]   shadow-xl rounded-lg">
                  <thead>
                    <tr className=" text-white">
                      <th className="p-4 bg-gradient-to-r from-[#fa9960] to-[#f6753b] ">
                        Course Name
                      </th>
                      <th className="p-4 bg-gradient-to-r from-[#fa9960] to-[#f6753b] ">
                        Subject Name
                      </th>
                      <th className="p-4 bg-gradient-to-r from-[#fa9960] to-[#f6753b] ">
                        Standard Name
                      </th>
                      <th className="p-4 bg-gradient-to-r from-[#fa9960] to-[#f6753b] ">
                        Module Name
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="bg-gradient-to-r from-gray-300 to-gray-500 text-gray-700">
                      <td className="p-4 bg-gradient-to-r from-gray-400 to-gray-500">
                        {courseData.course_name}
                      </td>
                      <td className="p-4 bg-gradient-to-r from-gray-400 to-gray-500">
                        {courseData.subject_name}
                      </td>
                      <td className="p-4 bg-gradient-to-r from-gray-400 to-gray-500">
                        {courseData.standard_name}
                      </td>
                      <td className="p-4 bg-gradient-to-r from-gray-400 to-gray-500">
                        {courseData.module_name}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
            <div className="px-[200px]">
              {courseData && (
                <Table className="border-[1px] px-[100px] ">
                  <TableHeader className="">
                    <TableRow className=" bg-[#f6753b] hover:bg-[#f6753b] text-black-900 font-bold">
                      <TableHead className="text-black-900 font-bold ">
                        Lesson
                      </TableHead>
                      <TableHead className="text-center text-black-900 font-bold">
                        Descripton
                      </TableHead>
                      <TableHead className="text-right text-black-900 font-bold"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {courseData.lessons.map((lesson) => (
                      <TableRow key={lesson.lesson_id}>
                        <TableCell className="">{lesson.title}</TableCell>
                        <TableCell className="text-center">
                          {lesson.content_info.map((content) => (
                            <div key={content.id}>{content.description}</div>
                          ))}
                        </TableCell>
                        <TableCell className="text-right">
                          {lesson.content_info.map(
                            (content: any, contentIndex: any) => (
                              <div key={content.id}>
                                {content.content_path.map(
                                  (path: any, pathIndex: any) => (
                                    <div
                                      key={pathIndex}
                                      className="flex justify-end"
                                    >
                                      <a
                                        href={path}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="mr-2"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          window.open(path, "_blank");
                                        }}
                                      >
                                        <img
                                          src={EyeIcn}
                                          alt="eyeimg"
                                          className="w-[24px] h-[24px] m-1"
                                        />
                                      </a>

                                      <div
                                        key={pathIndex}
                                        className="flex justify-end relative"
                                      >
                                        <a
                                          href={encodeURI(path)}
                                          onClick={(e) => {
                                            e.preventDefault();
                                            fetch(encodeURI(path))
                                              .then((response) =>
                                                response.blob()
                                              )
                                              .then((blob) => {
                                                const url =
                                                  window.URL.createObjectURL(
                                                    blob
                                                  );
                                                const a =
                                                  document.createElement("a");
                                                a.style.display = "none";
                                                a.href = url;
                                                a.download = `file_${contentIndex + 1
                                                  }`;
                                                document.body.appendChild(a);
                                                a.click();
                                                window.URL.revokeObjectURL(url);
                                              });
                                          }}
                                          className="ml-2 relative"
                                        >
                                          <img
                                            src={DownloadIcon}
                                            role="button"
                                            tabIndex={-3}
                                            alt="downloadIcon"
                                            className="w-[24px] h-[24px] m-1"
                                          />
                                        </a>
                                      </div>
                                    </div>
                                  )
                                )}
                              </div>
                            )
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default AdminViewContent;
