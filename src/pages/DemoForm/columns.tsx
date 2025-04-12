import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";

export type Enquiry = {
  id: any;
  user_id: any;
  name: string;
  email_id: string;
  contact_no: string;
  course: string;
  standard: string;
  school: string;
  teaching_mode: string;
  other_info: string;
};

export const columns: ColumnDef<Enquiry>[] = [
  {
    id: "user_id",
    accessorKey: "user_id",
    header: "User ID",
  },
  {
    id: "name",
    accessorKey: "name",
    header: "Name",
  },
  {
    id: "email_id",
    accessorKey: "email_id",
    header: "Email ID",
  },
  {
    id: "contact_no",
    accessorKey: "contact_no",
    header: "Contact Number",
  },
  {
    id: "course",
    accessorKey: "course",
    header: "Course",
  },
  {
    id: "standard",
    accessorKey: "standard",
    header: "Standard",
  },
  {
    id: "subject",
    accessorKey: "subject",
    header: "Subject",
  },
  {
    id: "school",
    accessorKey: "school",
    header: "School",
  },
  {
    id: "teaching_mode",
    accessorKey: "teaching_mode",
    // header: "Teaching Mode",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Teaching Mode
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    id: "other_info",
    accessorKey: "other_info",
    header: "Other Info",
  },
  {
    id: "created_on",
    accessorKey: "created_on",
    header: "Received on",
    cell: (value: any) => {
      let date = new Date(value.getValue());
      return date.toLocaleString();
    },
  },
];
