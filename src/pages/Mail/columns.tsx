import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";

export type Mail = {
  id: any;
  phone: string;
  email: string;
  name: string;
  message: string;
  subject: string;
  created_on: string;
};

export const columns: ColumnDef<Mail>[] = [
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
    id: "subject",
    accessorKey: "subject",
    header: "Subject",
  },
  {
    id: "message",
    accessorKey: "message",
    header: "Message",
    cell: (value: any) => {
      const message = value.getValue();
      return (
        <div
          title={message}
          className="w-full max-w-xs overflow-hidden text-ellipsis whitespace-nowrap"
        >
          {message}
        </div>
      );
    },
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
