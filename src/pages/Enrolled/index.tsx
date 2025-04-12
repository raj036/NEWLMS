import Topbar from "components/Topbar";
import React, { useEffect, useState } from "react";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import axios from "helper/axios";
import { useAuthContext } from "hooks/useAuthContext";
import Swal from "sweetalert2";
import Loader from "components/Loader";
import { Helmet } from "react-helmet";

const Enrolled = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageNum, setPageNum] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [userId, setUserId] = useState(null);
  const { user }: any = useAuthContext();

  useEffect(() => {
    fetchUsers();
  }, [user, pageNum, pageSize, userId]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      let url = `api/read/lms_user?user_type=student&page_num=${pageNum}&page_size=${pageSize}`;

      if (userId !== null) {
        url += `&user_id=${userId}`;
      }
      const response = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      });
      const data = response.data;
      if (data.status_code === 404) {
        setData([]);
        Swal.fire({
          icon: "info",
          customClass: {
            icon: "swal-my-icon",
          },
          text: "No Student Found",
        });
        setLoading(false);
      } else {
        setTotal(data.total);
        const updatedData = data.data.map(
          (item: { user_details: any }) => item.user_details
        );
        setData(updatedData);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching Enrolled Data", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        customClass: {
          icon: "swal-my-icon",
        },
        text: error?.response?.data?.detail,
        showConfirmButton: true,
        confirmButtonColor: "red",
      });
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Enrollment</title>
      </Helmet>
      <Topbar heading={"Enrolled Students"} />
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
                total={total}
                userId={userId}
                setUserId={setUserId}
              />
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Enrolled;
