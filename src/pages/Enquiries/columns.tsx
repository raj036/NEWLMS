import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";

export type Enquiry = {
  id: any;
  phone: string;
  email: string;
  name: string;
  message: string;
};

export const columns: ColumnDef<Enquiry>[] = [
  {
    id: "id",
    accessorKey: "id",
    header: "ID",
  },
  {
    id: "name",
    accessorKey: "name",
    header: "Name",
  },
  {
    id: "email",
    accessorKey: "email",
    header: "Email",
  },
  {
    id: "phone",
    accessorKey: "phone",
    header: "Phone",
  },
  {
    id: "message",
    accessorKey: "message",
    header: "Message",
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
