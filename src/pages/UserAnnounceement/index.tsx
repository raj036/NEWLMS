import Topbar from "components/Topbar";
import React, { useEffect, useState } from "react";
import { useAuthContext } from "hooks/useAuthContext";
import axios from "helper/axios";
import { format } from "date-fns";
import Zoom from "react-medium-image-zoom";

const StudentAnnouncements = () => {
  const { user }: any = useAuthContext();
  const [announcementData, setAnnouncementData] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

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
    } catch (error) {}
  };

  useEffect(() => {
    getAnnouncementData();
  }, []);

  return (
    <>
      <Topbar heading={"Announcements"} />
      <div className="sm:w-[190%]">
        {announcementData.length > 0 ? (
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

export default StudentAnnouncements;
