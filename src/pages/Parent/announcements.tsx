import Topbar from "components/Topbar";
import React, { useEffect, useState } from "react";
import { useAuthContext } from "hooks/useAuthContext";
import axios from "helper/axios";
import { format } from "date-fns";

const ParentAnnouncements = () => {
  const { user }: any = useAuthContext();
  const [announcementData, setAnnouncementData] = useState([]);

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

  useEffect(() => {
    getAnnouncementData();
  }, []);

  return (
    <>
      <Topbar heading={"Announcements"} />
      <div className="sm:w-[190%]">
        {announcementData.map((ele, index) => {
          return (
            <>
              <div className="flex flex-row p-6 ">
                <div className="text-lg pl-[5px]">
                  <h1>{format(ele.created_on,"mm/dd/yy")}</h1>
                </div>
                <div className="border-solid border-[#FF7008] border-2 mx-4"></div>
                <div className="flex justify-between w-[80%] gap-2">
                  <div>
                    <h1 className="text-[30px] text-[#002D51] font-semibold mb-2">
                      {ele.title}!{" "}
                    </h1>
                    <p className="text-[17px]">
                      {ele.announcement_text || "-"}
                    </p>
                  </div>
                  <div className="w-56 justify-items-end md:w-96 md:ml-[10px] h-[170px]">
                    <img
                    loading="lazy"
                      src={ele.announcement_images}
                      alt=""
                      className="w-full h-full"
                    />
                  </div>
                </div>
              </div>
            </>
          );
        })}
      </div>
    </>
  );
};

export default ParentAnnouncements;
