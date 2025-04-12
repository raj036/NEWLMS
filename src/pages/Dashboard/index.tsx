import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Topbar from "components/Topbar";
import {
  Users,
  GraduationCap,
  BadgeInfo,
  Presentation,
  BookMarked,
} from "lucide-react";
import axios from "helper/axios";
import { useAuthContext } from "hooks/useAuthContext";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import Loader from "components/Loader";
import { Helmet } from "react-helmet";

const Dashboard = () => {
  const { user }: any = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [dashboard, setDashboard] = useState<any>();

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const response = await axios.get("api/dashboard_counts", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      setDashboard(response.data);
      setLoading(false);
    } catch (error) {
      // console.error("Error Fetching Dashboard Count", error);
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

  const data = [
    {
      name: "Page A",
      uv: 4000,
      pv: 2400,
      amt: 2400,
    },
    {
      name: "Page B",
      uv: 3000,
      pv: 1398,
      amt: 2210,
    },
    {
      name: "Page C",
      uv: 2000,
      pv: 4800,
      amt: 2290,
    },
    {
      name: "Page D",
      uv: 2780,
      pv: 3908,
      amt: 2000,
    },
    {
      name: "Page E",
      uv: 1890,
      pv: 4800,
      amt: 2181,
    },
    {
      name: "Page F",
      uv: 2390,
      pv: 3800,
      amt: 2500,
    },
    {
      name: "Page G",
      uv: 3490,
      pv: 4300,
      amt: 2100,
    },
  ];

  return (
    <>
      <Helmet>
        <title>Admin Dashboard</title>
      </Helmet>
      <Topbar heading={"Dashboard"} />
      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="container my-5">
            <div className="flex justify-between items-center w-full gap-4">
              <Card className="w-full">
                <Link to={"users"}>
                  <div className="flex justify-between p-6 pb-2 font-semibold">
                    <p>Users</p>
                    <Users className="w-5 h-5" />
                  </div>
                  <CardHeader className="pt-2">
                    <CardTitle className="text-indigo-500">
                      {dashboard?.user_count || 0}
                    </CardTitle>
                    <CardDescription>Registered</CardDescription>
                  </CardHeader>
                </Link>
              </Card>
              <Card className="w-full">
                <Link to={"/tutor"}>
                  <div className="flex justify-between p-6 pb-2 font-semibold">
                    <p>Teachers</p>
                    <BookMarked className="w-5 h-5" />
                  </div>
                  <CardHeader className="pt-2">
                    <CardTitle className="text-indigo-500">
                      {dashboard?.teacher_count || 0}
                    </CardTitle>
                    <CardDescription>Teaching</CardDescription>
                  </CardHeader>
                </Link>
              </Card>
              <Card className="w-full">
                <Link to={"/enrolled"}>
                  <div className="flex justify-between p-6 pb-2 font-semibold">
                    <p>Students</p>
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <CardHeader className="pt-2">
                    <CardTitle className="text-indigo-500">
                      {dashboard?.student_count || 0}
                    </CardTitle>
                    <CardDescription>Enrolled</CardDescription>
                  </CardHeader>
                </Link>
              </Card>
              <Card className="w-full">
                <Link to={"/enquiry"}>
                  <div className="flex justify-between p-6 pb-2 font-semibold">
                    <p>Admission Enquiries</p>
                    <BadgeInfo className="w-5 h-5" />
                  </div>
                  <CardHeader className="pt-2">
                    <CardTitle className="text-indigo-500">
                      {dashboard?.inquiry_count || 0}
                    </CardTitle>
                    <CardDescription>Received</CardDescription>
                  </CardHeader>
                </Link>
              </Card>
              <Card className="w-full">
                <Link to={"/demoform"}>
                  <div className="flex justify-between p-6 pb-2 font-semibold">
                    <p>Demo Enquiries</p>
                    <Presentation className="w-5 h-5" />
                  </div>
                  <CardHeader className="pt-2">
                    <CardTitle className="text-indigo-500">
                      {dashboard?.demo_count || 0}
                    </CardTitle>
                    <CardDescription>Received</CardDescription>
                  </CardHeader>
                </Link>
              </Card>
            </div>
            <div className="w-full h-[500px] mt-20 flex justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  width={500}
                  height={300}
                  data={data}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="pv"
                    stroke="#474BCA"
                    strokeWidth={4}
                    activeDot={{ r: 8 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="uv"
                    stroke="#000"
                    strokeWidth={4}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Dashboard;
