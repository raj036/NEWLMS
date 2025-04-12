import Topbar from "components/Topbar";
import axios from "helper/axios";
import { useAuthContext } from "hooks/useAuthContext";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Swal from "sweetalert2";

const ParentProfile = () => {
  const { user }: any = useAuthContext();
  const [parentData, setParentData] = useState<any>({
    p_first_name: "",
    p_last_name: "",
    guardian: "",
    secondary_no: "",
    secondary_email: "",
    p_middle_name: "",
    primary_no: "",
    primary_email: "",
  });
  const [studUserId,setStudUserID] = useState("")

  const getParentData = async () => {
    try {
      const response = await axios.get(`api/parent/${user.user_id}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      setParentData(response?.data);
      setStudUserID(response?.data?.s_user_id)
    } catch (error) {
      // console.error("Error getting Profile", error);
    }
  };

  const handleChange = (fieldName: string, value: any) => {
    setParentData((prevParentData) => ({
      ...prevParentData,
      [fieldName]: value,
    }));
  };

  const UpdateParentData = async (e:any) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `/api/parent/${user.user_id}`,
        parentData,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "application/json",
          },
        }
      );
      Swal.fire({
        text: "Form updated Success Fully",
        icon: "success",
        confirmButtonColor: "#7066E0",
        customClass: {
          icon: "swal-my-icon",
        },
        confirmButtonText: "OK",
      });
    } catch (error) {
      Swal.fire({
        text: "Form not updated due to some issue",
        icon: "error",
        customClass: {
          icon: "swal-my-icon",
        },
        confirmButtonColor: "#7066E0",
        confirmButtonText: "OK",
      });
    }
  };

  useEffect(() => {
    getParentData();
  }, []);

  return (
    <>
      <Topbar heading={"Profile"} />
      <form onSubmit={UpdateParentData}>
        <div className="flex lg:flex-col">
          <div className="p-5 w-[40%] lg:w-[90%] sm:w-[170%]">
            <div className="font-semibold	text-[16px] mb-4 ml-1">
              Contact Details
            </div>
            <div className="h-full rounded-[10px] shadow-lg -w-[35%] p-4 text-[14px]">
              <div className="flex justify-between border-b-2 pb-2">
                <span className="font-semibold w-[30%] text-indigo-500 text-[18px]">
                  Name :
                </span>
                <input
                  className="w-[60%]"
                  type="text"
                  value={parentData?.p_first_name}
                  name="p_first_name"
                  onChange={(e) => handleChange("p_first_name", e.target.value)}
                />
              </div>
              <div className="flex justify-between border-b-2 py-2">
                <span className="font-semibold w-[30%] text-indigo-500 text-[18px]">
                  Primary Email :
                </span>
                <input
                  className="w-[60%]"
                  type="text"
                  value={parentData?.primary_email}
                  name="primary_email"
                  onChange={(e) =>
                    handleChange("primary_email", e.target.value)
                  }
                />
              </div>
              <div className="flex justify-between border-b-2 py-2">
                <span className="font-semibold w-[30%] text-indigo-500 text-[18px]">
                  Guardian :
                </span>
                <input
                  className="w-[60%]"
                  value={parentData?.guardian || "-"}
                  type="text"
                  name="guardian"
                  onChange={(e) => handleChange("guardian", e.target.value)}
                />
              </div>
              <div className="flex justify-between border-b-2 py-2">
                <span className="font-semibold w-[30%] text-indigo-500 text-[18px]">
                  Primary No :
                </span>
                <input
                  className="w-[60%]"
                  value={parentData?.primary_no}
                  type="text"
                  name="primary_no"
                  onChange={(e) => handleChange("primary_no", e.target.value)}
                />
              </div>
              <div className="mt-[30px] text-center">
                <Button
                  size="lg"
                  type="submit"
                  className="  font-bold max-w-[250px]   z-10 transition hover:bg-white-A700 border bg-deep_orange-500 hover:text-deep_orange-500 border-deep_orange-500"
                >
                  Update
                </Button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default ParentProfile;
