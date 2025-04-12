import Topbar from "components/Topbar";
import React, { useEffect, useState } from "react";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import axios from "helper/axios";
import { useAuthContext } from "hooks/useAuthContext";
import Swal from "sweetalert2";
import Loader from "components/Loader";
import { Helmet } from "react-helmet";

const Teachers = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageNum, setPageNum] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const { user }: any = useAuthContext();

  useEffect(() => {
    fetchUsers();
  }, [user, pageNum, pageSize]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      let url = `/api/read/lms_user?page_num=${pageNum}&page_size=${pageSize}&user_type=teacher`;

      const response = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      });

      const data = response.data;
      if (data.status_code === 404) {
        setData([]);
        throw new Error("Users not found");
      } else {
        setTotal(data.total);
        const updatedData = data.data.map(
          (item: { user_details: any }) => item.user_details
        );
        setData(updatedData);
        setLoading(false);
      }
    } catch (error) {
      // console.error("Error fetching User Data", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error?.response?.data?.detail,
        showConfirmButton: true,
        confirmButtonColor: "red",
        customClass: {
          icon: "swal-my-icon",
        },
      });
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Teachers</title>
      </Helmet>
      <Topbar heading={"All Teachers"} />
      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="container">
            <div className="mx-auto">
              <DataTable
                  columns={columns}
                  data={data}
                  setPageNum={setPageNum}
                  setPageSize={setPageSize}
                  pageNum={pageNum}
                  pageSize={pageSize}
                  total={total} userId={undefined} setUserId={undefined} userType={undefined} setUserType={undefined}              />
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Teachers;
