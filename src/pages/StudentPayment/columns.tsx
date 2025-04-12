import React, { useState, useEffect } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "flowbite-react";
import { Info } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import axios from "helper/axios";
import { useAuthContext } from "hooks/useAuthContext";
import { format } from "date-fns";

export type Enquiry = {
  user_id: any;
  id: any;
  amount: string;
  email: string;
  name: string;
  message: string;
  variant: string;
};

export const columns: ColumnDef<Enquiry>[] = [
  {
    id: "user_name",
    accessorKey: "user_name",
    header: "User Name",
  },
  {
    id: "payment_info",
    accessorKey: "payment_info",
    header: "Payment Info",
  },
  {
    id: "amount",
    accessorKey: "amount",
    header: "Amount",
  },
  {
    id: "created_on",
    accessorKey: "created_on",
    header: "Received on",
    cell: (value: any) => {
      let date = new Date(value.getValue());
      return format(date, "dd/MM/yyyy");
    },
  },
  {
    id: "admission",
    header: "Admission Details",
    cell: ({ row }) => {
      const [info, setInfo] = useState<any>([]);
      const [error, setError] = useState(false);
      const { user }: any = useAuthContext();

      const fetchProfile = async () => {
        try {
          const response = await axios.get(
            `api/payments/history/${row.original.user_id}`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${user.token}`,
              },
            }
          );
          // let dateHistory = response?.data?.payment_history?.created_on
          const formattedData = {
            ...response.data,
            payment_history: response.data.payment_history.map(
              (invoice: any) => ({
                ...invoice,
                created_on: format(
                  new Date(invoice.created_on),
                  "dd/MM/yy - h:mm a"
                ), // Format the date using date-fns
              })
            ),
          };
          setInfo(formattedData);
          setError(false);
        } catch (error) {
          // console.error("Error Fetching Profile", error);
          setError(true);
        }
      };

      return (
        <>
          <div className="flex gap-2 items-center justify-start">
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  // variant="outline"
                  onClick={fetchProfile}
                  className="hover:!bg-blue-100"
                >
                  <Info className="w-5 h-5" />
                </Button>
              </DialogTrigger>
              {!error ? (
                <DialogContent className=" h-full max-h-2xl overflow-y-scroll overflow-x-scroll">
                  <DialogHeader>
                    <DialogTitle>Payment Details</DialogTitle>
                  </DialogHeader>
                  <Table className="border-2">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="bg-teal-900 text-white-A700">
                          Sr no
                        </TableHead>
                        <TableHead className="bg-teal-900 text-white-A700">
                          Payment ID
                        </TableHead>
                        <TableHead className="bg-teal-900 text-white-A700">
                          Course
                        </TableHead>
                        <TableHead className="bg-teal-900 text-white-A700">
                          Date
                        </TableHead>
                        <TableHead className="bg-teal-900 text-white-A700">
                          Amount
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {info?.payment_history?.map(
                        (invoice: any, index: any) => (
                          <TableRow key={index}>
                            <TableCell className="border-b-2">
                              {index + 1}
                            </TableCell>
                            <TableCell className="border-b-2">
                              {invoice.payment_id}
                            </TableCell>
                            <TableCell className="border-b-2">
                              {invoice.course_name}
                            </TableCell>
                            <TableCell className="border-b-2">
                              {invoice.created_on}
                            </TableCell>
                            <TableCell className="border-b-2">
                              {invoice.amount}
                            </TableCell>
                          </TableRow>
                        )
                      )}
                    </TableBody>
                    <TableFooter>
                      <TableRow>
                        <TableCell className="bg-teal-900 text-white-A700"></TableCell>
                        <TableCell className="bg-teal-900 text-white-A700"></TableCell>
                        <TableCell className="bg-teal-900 text-white-A700"></TableCell>
                        <TableCell className="bg-teal-900 text-white-A700"></TableCell>
                        <TableCell className="bg-teal-900 text-white-A700">
                          <span>Total: </span> ₹{info?.total_amount}
                        </TableCell>
                      </TableRow>
                    </TableFooter>
                  </Table>
                  <DropdownMenuSeparator />
                </DialogContent>
              ) : (
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>No Payment Details Found!</DialogTitle>
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
