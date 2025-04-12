import React, { useState, useEffect } from "react";
import { ColumnDef } from "@tanstack/react-table";
import {
  Info,
  Trash2,
  SquareArrowOutUpRight,
  CircleCheck,
  CircleX,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
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
  // {
  //   id: "select",
  //   header: ({ table }) => (
  //     <Checkbox
  //       checked={
  //         table.getIsAllPageRowsSelected() || table.getIsSomePageRowsSelected()
  //       }
  //       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
  //       aria-label="Select all"
  //     />
  //   ),
  //   cell: ({ row }) => (
  //     <Checkbox
  //       checked={row.getIsSelected()}
  //       onCheckedChange={(value) => row.toggleSelected(!!value)}
  //       aria-label="Select row"
  //     />
  //   ),
  //   enableSorting: true,
  //   enableHiding: true,
  // },
  {
    id: "user_id",
    accessorKey: "user_id",
    header: "User ID",
  },
  {
    id: "User Name",
    accessorKey: "user_name",
    header: "User Name",
    // header: ({ column }) => {
    //   return (
    //     <Button
    //       variant="ghost"
    //       onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    //     >
    //       User Name
    //       <ArrowUpDown className="ml-2 h-4 w-4" />
    //     </Button>
    //   );
    // },
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
    // cell: ({ row }) => {
    //   const amount = parseFloat(row.getValue("amount"));
    //   const formatted = new Intl.NumberFormat("en-US", {
    //     style: "currency",
    //     currency: "INR",
    //   }).format(amount);

    //   return <div className="text-left font-medium">{formatted}</div>;
    // },
  },
  {
    id: "User Type",
    accessorKey: "user_type",
    header: "User Type",
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
    id: "is_formsubmited",
    accessorKey: "is_formsubmited",
    header: "Form",
    cell: (value: any) => {
      if (value.getValue() === true) {
        return <CircleCheck className="text-green-500" />;
      } else {
        return <CircleX className="text-red-500" />;
      }
    },
  },
  {
    id: "is_payment_done",
    accessorKey: "is_payment_done",
    header: "Payment",
    cell: (value: any) => {
      if (value.getValue() === true) {
        return <CircleCheck className="text-green-500" />;
      } else {
        return <CircleX className="text-red-500" />;
      }
    },
  },
  {
    id: "admission",
    header: "Admission Details",
    cell: ({ row }) => {
      const [info, setInfo] = useState<any>([]);
      const [error, setError] = useState(false);
      const { user }: any = useAuthContext();
      let [formData, setFormData] = useState({
        student_data: {
          first_name: "",
          middle_name: "",
          last_name: "",
          date_of_birth: "",
          gender: "",
          nationality: "",
          referral: "",
          date_of_joining: "",
          date_of_completion: "",
        },
        student_contact: {
          primary_no: "",
          secondary_no: "",
          primary_email: "",
          secondary_email: "",
          current_address: "",
          permanent_address: "",
        },
        student_parent: {
          p_first_name: "",
          p_middle_name: "",
          p_last_name: "",
          guardian: "",
          primary_no: "",
          primary_email: "",
        },
        student_education: {
          student_class: "",
          school: "",
          year_of_passing: 0,
          percentage: 0,
        },
        course_details: {
          subject: "",
          standard: "",
          module: "",
          course: "",
        },
      });

      useEffect(() => {
        if (info) {
          setFormData({
            ...formData,
            student_data: {
              first_name: info?.first_name,
              middle_name: info?.middle_name,
              last_name: info?.last_name,
              date_of_birth: info?.date_of_birth,
              gender: info?.gender,
              nationality: info.nationality,
              referral: info?.referral,
              date_of_joining: info?.date_of_joining,
              date_of_completion: info?.date_of_completion,
            },
            student_contact: {
              primary_no: info?.contact_info?.primary_no,
              secondary_no: info?.contact_info?.secondary_no,
              primary_email: info?.contact_info?.primary_email,
              secondary_email: info?.contact_info?.secondary_email,
              current_address: info?.contact_info?.current_address,
              permanent_address: info?.contact_info?.permanent_address,
            },
            student_parent: {
              p_first_name: info?.parent_info?.p_first_name,
              p_middle_name: info?.parent_info?.p_middle_name,
              p_last_name: info?.parent_info?.p_last_name,
              guardian: info?.parent_info?.guardian,
              primary_no: info?.parent_info?.primary_no,
              primary_email: info?.parent_info?.primary_email,
            },
            student_education: {
              student_class: info?.pre_education?.student_class,
              school: info?.pre_education?.school,
              year_of_passing: info?.pre_education?.year_of_passing,
              percentage: info?.pre_education?.percentage,
            },
            course_details: {
              course: info?.course_details?.courses,
              standard: info?.course_details?.standards,
              subject: info?.course_details?.subjects,
              module: info?.course_details?.modules,
            },
          });
          setError(false);
        }
      }, [info]);

      const fetchProfile = async () => {
        try {
          const response = await axios.get(
            `api/admission/${row?.original?.user_id}`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${user.token}`,
              },
            }
          );
          setInfo(response.data);
          setError(false);
        } catch (error) {
          // console.error("Error Fetching Profile", error);
          setError(true);
        }
      };

      const handleChange = (section: string, fieldName: string, value: any) => {
        setFormData((prevData) => ({
          ...prevData,
          [section]: {
            ...prevData[section],
            [fieldName]: value,
          },
        }));
      };

      const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
          Swal.fire({
            title: "Updating User Information...",
            text: "Are You Sure You Want to Update User Admission Data?",
            icon: "warning",
            backdrop: false,
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Update!",
            customClass: "sweet",
          }).then(async (result) => {
            if (result.isConfirmed) {
              const response = await axios.put(
                `/api/admission/${info?.id}`,
                formData,
                {
                  headers: {
                    Authorization: `Bearer ${user.token}`,
                  },
                }
              );
              if (response.status === 200) {
                Swal.fire({
                  title: "Admission Form Updated!",
                  icon: "success",
                  customClass: {
                    icon: "swal-my-icon",
                  },
                  showConfirmButton: false,
                  timer: 2000,
                }).then((result: { isConfirmed: any }) => {
                  if (result.isConfirmed) {
                    window.location.reload();
                  }
                });
              }
            }
          });
        } catch (error) {
          // console.error("Error Updating Admission Details", error);
          Swal.fire({
            title: "Error Updating Admission Details!",
            icon: "error",
            customClass: {
              icon: "swal-my-icon",
            },
            timer: 2000,
          });
        }
      };

      const handleDelete = async (
        e: React.FormEvent<HTMLFormElement>,
        id: any
      ) => {
        e.preventDefault();
        try {
          const response = await axios.delete(`/api/admission/${id}`, {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          });
          if (response.status === 200) {
            Swal.fire({
              title: "Admission Form Deleted!",
              icon: "success",
              customClass: {
                icon: "swal-my-icon",
              },
              showConfirmButton: false,
              footer: "This window will be closed in 2 seconds.",
              timer: 2000,
            }).then(() => {
              window.location.reload();
            });
          }
        } catch (error) {
          // console.error("Error Deleting Admission Details", error);
          Swal.fire({
            title: "Error Deleting Admission Details!",
            showConfirmButton: false,
            icon: "error",
            customClass: {
              icon: "swal-my-icon",
            },
            footer: "This window will be closed in 2 seconds.",
            timer: 2000,
          });
        }
      };

      const verifyPayment = async () => {
        if (window.confirm("You Want to Verify These Payment Details ?")) {
          try {
            const response = await axios.put(
              `/api/payments/verify/${row?.original?.user_id}`,
              {},
              {
                headers: {
                  Authorization: `Bearer ${user.token}`,
                },
              }
            );
            if (response.status === 200) {
              Swal.fire({
                title: "Payment Verified!",
                icon: "success",
                customClass: {
                  icon: "swal-my-icon",
                },
                showConfirmButton: false,
                timer: 2000,
              }).then(() => {
                window.location.reload();
              });
            }
          } catch (error) {
            // console.error("Error Verifying Payment Details", error);
          }
        }
      };

      const isPaymentAvailable = info?.payment_details?.payment_id;

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
                  <Info className="w-5 h-5" />
                </Button>
              </DialogTrigger>
              {!error ? (
                <DialogContent className="sm:max-w-[425px] h-full max-h-2xl overflow-y-scroll">
                  <DialogHeader>
                    <DialogTitle>User Admission Details</DialogTitle>
                  </DialogHeader>
                  <DropdownMenuSeparator />
                  <h2 className="font-extrabold">Personal Information</h2>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <p>
                      <strong>First Name:</strong> {info?.first_name}
                    </p>
                    <p>
                      <strong>Middle Name:</strong> {info?.middle_name}
                    </p>
                    <p>
                      <strong>Last Name:</strong> {info?.last_name}
                    </p>
                    <p>
                      <strong>Gender:</strong> {info?.gender}
                    </p>
                    <p>
                      <strong>DOB:</strong> {info?.date_of_birth}
                    </p>
                    <p>
                      <strong>Nationality:</strong> {info?.nationality}
                    </p>
                    <p>
                      <strong>Date of Joining:</strong> {info?.date_of_joining}
                    </p>
                    <p>
                      <strong>Reffered By:</strong> {info?.referral}
                    </p>
                    {info?.id_proof_url && info?.id_proof_url !== null && (
                      <p className="w-full flex gap-2 justify-start items-center">
                        <strong>ID Proof:</strong>{" "}
                        <a
                          className="bg-black-900 hover:bg-gray-800 p-2 flex gap-2 items-center rounded-md text-white-A700"
                          href={info?.id_proof_url}
                          target="_blank"
                        >
                          Open <SquareArrowOutUpRight className="text-xs" />
                        </a>
                      </p>
                    )}
                    {info?.address_proof_url &&
                      info?.address_proof_url !== null && (
                        <p className="w-full flex gap-2 justify-start items-center">
                          <strong>Address Proof:</strong>{" "}
                          <a
                            className="bg-black-900 hover:bg-gray-800 p-2 flex gap-2 items-center rounded-md text-white-A700"
                            href={info?.address_proof_url}
                            target="_blank"
                          >
                            Open <SquareArrowOutUpRight className="text-xs" />
                          </a>
                        </p>
                      )}
                    <DropdownMenuSeparator className="col-span-2" />
                  </div>
                  <h2 className="font-extrabold">Contact Information</h2>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <p>
                      <strong>Primary Number:</strong>{" "}
                      {info?.contact_info?.primary_no}
                    </p>
                    <p>
                      <strong>Secondary Number:</strong>{" "}
                      {info?.contact_info?.secondary_no}
                    </p>
                    <p>
                      <strong>Primary Email:</strong>{" "}
                      {info?.contact_info?.primary_email}
                    </p>
                    <p>
                      <strong>Secondary Email:</strong>{" "}
                      {info?.contact_info?.secondary_email}
                    </p>
                    <p>
                      <strong>Current Address:</strong>{" "}
                      {info?.contact_info?.current_address}
                    </p>
                    <p>
                      <strong>Permenant Address:</strong>{" "}
                      {info?.contact_info?.permanent_address}
                    </p>
                    <DropdownMenuSeparator className="col-span-2" />
                  </div>
                  <h2 className="font-extrabold">Enroll Course Details</h2>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <p>
                      <strong>Course:</strong>{" "}
                      {info?.course_details?.courses?.name}
                    </p>
                    <p>
                      <strong>Standard:</strong>{" "}
                      {info?.course_details?.standards?.name}
                    </p>
                    <p>
                      <strong>Subject:</strong>{" "}
                      {info?.course_details?.subjects?.name}
                    </p>
                    <p>
                      <strong>Module:</strong>{" "}
                      {info?.course_details?.modules?.name}
                    </p>
                    <DropdownMenuSeparator className="col-span-2" />
                  </div>
                  <h2 className="font-extrabold">Pre Education</h2>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <p>
                      <strong>School:</strong> {info?.pre_education?.school}
                    </p>
                    <p>
                      <strong>Student Class:</strong>{" "}
                      {info?.pre_education?.student_class}
                    </p>
                    <p>
                      <strong>Year of Passing:</strong>{" "}
                      {info?.pre_education?.year_of_passing}
                    </p>
                    <p>
                      <strong>Percentage:</strong>{" "}
                      {info?.pre_education?.percentage}
                    </p>
                    <DropdownMenuSeparator className="col-span-2" />
                  </div>
                  <h2 className="font-extrabold">Parent Information</h2>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <p>
                      <strong>First Name:</strong>{" "}
                      {info?.parent_info?.p_first_name}
                    </p>
                    <p>
                      <strong>Middle Name:</strong>{" "}
                      {info?.parent_info?.p_middle_name}
                    </p>
                    <p>
                      <strong>Last Name:</strong>{" "}
                      {info?.parent_info?.p_last_name}
                    </p>
                    <p>
                      <strong>Relation:</strong> {info?.parent_info?.guardian}
                    </p>
                    <p>
                      <strong>Primary Email:</strong>{" "}
                      {info?.parent_info?.primary_email}
                    </p>
                    <p>
                      <strong>Primary Number:</strong>{" "}
                      {info?.parent_info?.primary_no}
                    </p>
                    <DropdownMenuSeparator className="col-span-2" />
                  </div>
                  {isPaymentAvailable && (
                    <>
                      <div className="flex justify-between items-center">
                        <h2 className="font-extrabold">Payment Information</h2>
                        {info?.is_payment_done === false ? (
                          <Button
                            onClick={verifyPayment}
                            className="font-extrabold"
                          >
                            Verify Payment
                          </Button>
                        ) : (
                          <>
                            <p className="text-green-500 flex items-center justify-end gap-1">
                              Payment Verified <CircleCheck />
                            </p>
                          </>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <p>
                          <strong>Amount:</strong>{" "}
                          {info?.payment_details?.amount}
                        </p>
                        <p>
                          <strong>Payment Mode:</strong>{" "}
                          {info?.payment_details?.payment_mode}
                        </p>
                        <p>
                          <strong>Transaction Info:</strong>{" "}
                          {info?.payment_details?.payment_info}
                        </p>
                        <p>
                          <strong>Other Info:</strong>{" "}
                          {info?.payment_details?.other_info}
                        </p>
                        <p>
                          <strong>Payment Date:</strong>{" "}
                          {new Date(
                            info?.payment_details?.created_on
                          ).toLocaleString()}
                        </p>
                        <p>
                          <strong>Payment ID:</strong>{" "}
                          {info?.payment_details?.payment_id}
                        </p>
                      </div>
                    </>
                  )}
                </DialogContent>
              ) : (
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>No Admission Details Found</DialogTitle>
                  </DialogHeader>
                </DialogContent>
              )}
            </Dialog>
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  onClick={fetchProfile}
                  className="hover:!bg-red-100"
                >
                  <Trash2 className="w-5 h-5" />
                </Button>
              </DialogTrigger>
              {!error ? (
                <DialogContent className="sm:max-w-[425px] max-w-fit">
                  <form onSubmit={(e) => handleDelete(e, info?.user_id)}>
                    <DialogHeader>
                      <DialogTitle>Delete Admission Details</DialogTitle>
                    </DialogHeader>
                    <p className="text-sm my-4">
                      Are you sure you want to delete{" "}
                      <strong>{info?.first_name}'s</strong> admission details?
                    </p>
                    <DialogFooter className="flex flex-row justify-between items-center">
                      <DialogClose>
                        <Button
                          variant="outline"
                          className="w-22 border-2 border-black-900"
                        >
                          Cancel
                        </Button>
                      </DialogClose>
                      <Button type="submit" className="w-22">
                        Delete
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              ) : (
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>No Admission Details Found</DialogTitle>
                  </DialogHeader>
                </DialogContent>
              )}
            </Dialog>
          </div>
        </>
      );
    },
  },
];
