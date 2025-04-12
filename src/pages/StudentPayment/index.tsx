import React, { useState, useEffect } from "react";
import Topbar from "components/Topbar";
import { DataTable } from "./d-table";
import { columns } from "./columns";
import { useAuthContext } from "hooks/useAuthContext";
import axios from "helper/axios";
import Swal from "sweetalert2";
import Loader from "components/Loader";
import { Helmet } from "react-helmet";

const StudentPayment = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user }: any = useAuthContext();

  useEffect(() => {
    fetchPayment();
  }, [user]);

  const fetchPayment = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/payments/FetchAll`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      });
      const data = await response.data;
      setData(data);
      setLoading(false);
    } catch (error) {
      // console.error(error, "Error fetching Users Data");
      Swal.fire({
        icon: "error",
        title: "No payment data was there",
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
        <title>Admission</title>
      </Helmet>
      <Topbar heading={"Student Payments"} />
      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="container">
            <div className="mx-auto">
              <DataTable columns={columns} data={data} />
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default StudentPayment;
