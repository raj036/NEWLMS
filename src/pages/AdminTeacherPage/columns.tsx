import React, { useState, useEffect } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "helper/axios";
import { useAuthContext } from "hooks/useAuthContext";
import Swal from "sweetalert2";

export type User = {
  user_id: any;
  phone_no: number;
  user_email: string;
  user_name: string;
  user_type: string;
};

export const columns: ColumnDef<User>[] = [
  {
    id: "user_id",
    accessorKey: "user_id",
    header: "User ID",
  },
  {
    id: "User Name",
    accessorKey: "user_name",
    header: "User Name",
  },
  {
    id: "User Email",
    accessorKey: "user_email",
    header: "Email",
  },
  {
    id: "Phone",
    accessorKey: "phone_no",
    header: "Phone",
  },
  {
    id: "created_on",
    accessorKey: "created_on",
    header: "Created",
    cell: (value: any) => {
      let date = new Date(value.getValue());
      return date.toLocaleString();
    },
  },
  {
    id: "updated_on",
    accessorKey: "updated_on",
    header: "Updated",
    cell: (value: any) => {
      let date = new Date(value.getValue());
      return date.toLocaleString();
    },
  },
  {
    id: "User Type",
    accessorKey: "user_type",
    header: "User Type",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const [info, setInfo] = useState<any>([]);
      const [error, setError] = useState(false);
      const { user }: any = useAuthContext();
      let [formData, setFormData] = useState({
        user_name: "",
        user_email: "",
        phone_no: "",
        user_type: "",
        new_password: "",
        repassword: "",
      });

      useEffect(() => {
        if (info) {
          setFormData({
            ...formData,
            user_name: info.user_name,
            user_email: info.user_email,
            phone_no: info.phone_no,
            user_type: info.user_type,
            new_password: "",
            repassword: "",
          });
          setError(false);
        }
      }, [info]);

      const fetchProfile = async () => {
        try {
          const response = await axios.get(
            `api/read/lms_user?user_id=${row.original.user_id}`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${user.token}`,
              },
            }
          );
          setInfo(response?.data?.data[0]?.user_details);
          setError(false);
        } catch (error) {
          // console.error("Error Fetching Profile", error);
          setError(true);
        }
      };

      const handleInputChange = (fieldName: any, value: any) => {
        setFormData((prevData) => ({
          ...prevData,
          [fieldName]: value,
        }));
      };
      const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (formData.new_password === formData.repassword) {
          try {
            const response = await axios.put(
              `/api/update/lms_user/${info?.user_id}`,
              formData,
              {
                headers: {
                  Authorization: `Bearer ${user.token}`,
                },
              }
            );
            if (response.status === 200) {
              Swal.fire({
                title: "User Updated!",
                icon: "success",
                showConfirmButton: false,
                timer: 1500,
                customClass: {
                  icon: "swal-my-icon",
                },
              }).then(() => {
                window.location.reload();
              });
            } else {
              throw new Error("Error");
            }
          } catch (error) {
            // console.error("Error Updating User Details", error);
            Swal.fire({
              title: "Error Updating User Details!",
              text: error?.response?.data?.detail,
              icon: "error",
              customClass: {
                icon: "swal-my-icon",
              },
              showConfirmButton: false,
              timer: 1500,
            });
          }
        } else {
          Swal.fire({
            title: "Password Do Not Match!",
            text: "Kindly Check Both Passwords",
            icon: "error",
            customClass: {
              icon: "swal-my-icon",
            },
            showConfirmButton: false,
            timer: 1500,
          });
        }
      };

      return (
        <>
          <div className="flex gap-2 items-center justify-start">
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  onClick={fetchProfile}
                  className="hover:!bg-blue-100"
                >
                  <Edit className="w-5 h-5" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit User</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleEditSubmit} className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="user_name" className="text-right">
                      Name
                    </Label>
                    <Input
                      id="user_name"
                      name="user_name"
                      type="text"
                      className="col-span-3"
                      value={formData.user_name || ""}
                      onChange={(e) =>
                        handleInputChange("user_name", e.target.value)
                      }
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="user_email" className="text-right">
                      Email
                    </Label>
                    <Input
                      id="user_email"
                      type="email"
                      name="user_email"
                      className="col-span-3"
                      value={formData.user_email || ""}
                      onChange={(e) =>
                        handleInputChange("user_email", e.target.value)
                      }
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="phone_no" className="text-right">
                      Phone
                    </Label>
                    <Input
                      id="phone_no"
                      type="number"
                      pattern="[0-9]*"
                      maxLength={10}
                      name="phone_no"
                      className="col-span-3"
                      value={formData.phone_no || ""}
                      onChange={(e) =>
                        handleInputChange("phone_no", e.target.value)
                      }
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="new_password" className="text-right">
                      Password
                    </Label>
                    <Input
                      id="new_password"
                      type="password"
                      name="new_password"
                      className="col-span-3"
                      autoComplete="on"
                      value={formData.new_password || ""}
                      onChange={(e) =>
                        handleInputChange("new_password", e.target.value)
                      }
                      required={formData.repassword.length !== 0 ? true : false}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="repassword" className="text-right">
                      Re-Password
                    </Label>
                    <Input
                      id="repassword"
                      type="password"
                      name="repassword"
                      className="col-span-3"
                      autoComplete="on"
                      value={formData.repassword || ""}
                      onChange={(e) =>
                        handleInputChange("repassword", e.target.value)
                      }
                      required={
                        formData.new_password.length !== 0 ? true : false
                      }
                    />
                  </div>
                  <DialogFooter>
                    <Button type="submit">Edit</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </>
      );
    },
  },
];
