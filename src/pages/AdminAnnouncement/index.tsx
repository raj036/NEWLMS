import Topbar from "components/Topbar";
import React, { useEffect, useState } from "react";
import { useAuthContext } from "hooks/useAuthContext";
import axios from "helper/axios";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Swal from "sweetalert2";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import DelIcon from "/images/delete.png";

const AdminAnnouncements = () => {
  const { user }: any = useAuthContext();
  const [announcementData, setAnnouncementData] = useState([]);
  const [createAnnData, setCreateAnnData] = useState({
    announcement_images: "",
    title: "",
    announcement_text: "   ",
  });
  const [isLoaded, setIsLoaded] = useState(false);
  const [isDialogue, setIsDialogue] = useState(false);

  const handleImageLoad = () => {
    setIsLoaded(true);
  };

  const getAnnouncementData = async () => {
    try {
      const response = await axios.get(`/api/announcements`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      setAnnouncementData(response.data);
    } catch (error) {
      // console.log(error);
    }
  };

  const handleChange = (
    fieldName: string,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value =
      fieldName === "announcement_images"
        ? event.target.files[0]
        : event.target.value;
    setCreateAnnData((prevData) => ({
      ...prevData,
      [fieldName]: value,
    }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("title", createAnnData.title);
      formData.append("announcement_text", createAnnData.announcement_text);
      if (createAnnData.announcement_images) {
        formData.append(
          "announcement_images",
          createAnnData.announcement_images
        );
      }

      const response = await axios.post(`/api/announcement/`, formData, {
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setCreateAnnData(response.data);
      Swal.fire({
        title: "Announcement added",
        icon: "success",
        customClass: {
          icon: "swal-my-icon",
        },
        confirmButtonColor: "#7066E0",
        confirmButtonText: "OK",
      });
      setIsDialogue(false);
      getAnnouncementData();
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
        customClass: {
          icon: "swal-my-icon",
        },
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });

      if (result.isConfirmed) {
        const response = await axios.delete(`/api/announcement/${id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        });
        if (response.status === 200) {
          await Swal.fire({
            title:"Deleted!",
            text:"Your announcement has been deleted.",
            icon:"success",
            customClass: {
              icon: "swal-my-icon",
            },
          });
          getAnnouncementData();
          setAnnouncementData((prevData) =>
            prevData.filter((item) => item.id !== id)
          );
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

  useEffect(() => {
    getAnnouncementData();
  }, []);

  return (
    <>
      <Topbar heading={"Announcements"} />
      <div className="container py-5">
        <Dialog open={isDialogue} onOpenChange={setIsDialogue}>
          <div className="flex justify-end">
            <DialogTrigger asChild>
              <Button className="bg-teal-900 hover:!bg-blue-900">
                Create Announcement
              </Button>
            </DialogTrigger>
          </div>
          <DialogContent>
            <DialogHeader>Add courses here</DialogHeader>
            <form className="grid gap-4 py-4" onSubmit={handleSubmit}>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="user_name" className="text-right">
                  Title
                </Label>
                <Input
                  id="title"
                  name="title"
                  type="text"
                  className="col-span-3"
                  onChange={(e) => handleChange("title", e)}
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="standard_name" className="text-right">
                  Description
                </Label>
                <Input
                  id="announcement_text"
                  name="announcement_text"
                  type="text"
                  className="col-span-3"
                  onChange={(e) => handleChange("announcement_text", e)}
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="subject_name" className="text-right">
                  Upload Images
                </Label>
                <Input
                  id="announcement_images"
                  name="announcement_images"
                  type="file"
                  className="col-span-3"
                  onChange={(e) => handleChange("announcement_images", e)}
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
      <div className="sm:w-[190%]">
        {announcementData.length > 0 ? 
        (
          announcementData.map((ele, index) => {
            return (
              <div className="flex flex-row p-6 " key={index}>
                <div className="text-lg pl-[5px]">
                  <h1>{format(ele.created_on, "yyyy-MM-dd")}</h1>
                </div>
                <div className="border-solid border-[#FF7008] border-2 mx-4"></div>
                <div className="flex justify-between w-full gap-2">
                  <div>
                    <h1 className="text-[30px] text-[#002D51] font-semibold mb-2">
                      {ele.title}!{" "}
                    </h1>
                    <p className="text-[17px]">
                      {ele.announcement_text || "-"}
                    </p>
                  </div>

                  <Zoom>
                    <div className="w-56 justify-items-end md:w-96 md:ml-[10px] h-[170px]">
                      <img
                        loading="lazy"
                        src={ele.announcement_images}
                        alt="announcement images"
                        onLoad={handleImageLoad}
                        className={`w-full h-full ${
                          isLoaded ? "loaded" : "blur"
                        }`}
                      />
                    </div>
                  </Zoom>
                </div>
                <div
                  onClick={() => deleteContent(ele.id)}
                  className={`flex items-center mx-4 cursor-pointer`}
                >
                  <img
                    src={DelIcon}
                    alt="deleteIcon"
                    className="w-[24px] h-[24px] m-1 ml-5 cursor-pointer"
                  />
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-6">
            <h1 className="text-[24px] text-[#002D51] font-semibold">
              No announcements available.
            </h1>
          </div>
        )}
      </div>
    </>
  );
};

export default AdminAnnouncements;
