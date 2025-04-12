import React, { useState } from "react";
import {
  ColumnDef,
  flexRender,
  SortingState,
  VisibilityState,
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "helper/axios";
import Swal from "sweetalert2";
import { useBranch } from "hooks/Branch";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  setPageNum: any;
  setPageSize: any;
  pageNum: number;
  pageSize: number;
  total: number;
  userId: any;
  setUserId: any;
  userType: any;
  setUserType: any;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  setPageNum,
  pageNum,
  pageSize,
  total,
  userType,
  setUserType,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const [formData, setFormData] = useState({
    user_name: "",
    user_email: "",
    phone_no: "",
    branch_id: "",
    user_type: "",
    user_password: "",
    repassword: "",
  });

  const handleInputChange = (fieldName: any, value: any) => {
    setFormData((prevData) => ({
      ...prevData,
      [fieldName]: value,
    }));
  };

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });
  const { branchData } = useBranch();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formData.user_password === formData.repassword) {
      try {
        const response = await axios.post("api/insert/lms_user", formData);
        if (response.data.status_code === 500) {
          throw new Error("Email Already in Use");
        }
        if (response.data.status_code === 400) {
          throw new Error(response.data.detail);
        }
        Swal.fire({
          icon: "success",
          title: `User Created Successfully`,
          showConfirmButton: false,
          customClass: {
            icon: "swal-my-icon",
          },
          timer: 1500,
        }).then(() => window.location.reload());
      } catch (error) {
        // console.error("Error Creating User", error);
        Swal.fire({
          icon: "error",
          title: "Error creating user.",
          text:
            error?.message ||
            "Please check your internet connection or try again later.",
          showConfirmButton: false,
          customClass: {
            icon: "swal-my-icon",
          },
          timer: 1500,
        });
      }
    } else {
      Swal.fire({
        icon: "error",
        title: "Passwords do not match!",
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
      <div className="flex items-center py-4">
        {/* <Input
          placeholder="Filter by User ID..."
          value={userId || null}
          onChange={(event) => setUserId(event.target.value || null)}
          className="max-w-sm mr-2 !bg-white-A700 !text-black-900"
        /> */}
        {/* <Input
          placeholder="Filter emails..."
          value={
            (table.getColumn("User Email")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("User Email")?.setFilterValue(event.target.value)
          }
          className="max-w-sm mr-2 !bg-white-A700 !text-black-900"
        /> */}
        <Select onValueChange={(value) => setUserType(value)} value={userType}>
          <SelectTrigger className="max-w-sm !bg-white-A700 !text-black-900">
            <SelectValue placeholder="Filter type..." />
          </SelectTrigger>
          <SelectContent className="max-w-sm !bg-white-A700 !text-black-900">
            <SelectItem value={null}>Filter Type...</SelectItem>
            <SelectItem value="user">User</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="teacher">Teacher</SelectItem>
            <SelectItem value="student">Student</SelectItem>
            <SelectItem value="parent">Parent</SelectItem>
          </SelectContent>
        </Select>
        {/* <Input
          placeholder="Filter type..."
          value={userType || null}
          onChange={(event) => setUserType(event.target.value || null)}
          className="max-w-sm !bg-white-A700 !text-black-900"
        /> */}
        <div className="ml-auto">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="mx-2 !bg-teal-900">Add User</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add User</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="user_name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="user_name"
                    name="user_name"
                    type="text"
                    className="col-span-3"
                    value={formData.user_name}
                    onChange={(e) =>
                      handleInputChange("user_name", e.target.value)
                    }
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
                    value={formData.user_email}
                    onChange={(e) =>
                      handleInputChange("user_email", e.target.value)
                    }
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
                    value={formData.phone_no}
                    onChange={(e) =>
                      handleInputChange("phone_no", e.target.value)
                    }
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone_no" className="text-right">
        Branch
      </Label>
      <select
        name="branch_id"
        value={formData.branch_id}
        onChange={(e) => handleInputChange("branch_id", e.target.value)}
        className="col-span-3 bg-gray-500 text-white-A700 h-[40px] rounded-[5px] text-[14px] pl-[10px]
          appearance-none
          bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23FFFFFF%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.4-12.8z%22%2F%3E%3C%2Fsvg%3E')]
          bg-[length:0.65em]
          bg-[right_0.75em_center]
          bg-no-repeat
          pr-[2.5em]
          [&>option]:bg-gray-500 
          [&>option]:text-white-A700
          [&>option:checked]:bg-gray-600"
        required
      >
        <option value="" disabled hidden>
          Select Branch..
        </option>
        {branchData.map((branch, index) => (
          <option
            key={index}
            value={branch.id}
            className="bg-gray-500 text-white-A700"
          >
            {branch.name}
          </option>
        ))}
      </select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="phone_no" className="text-right">
                    User Type
                  </Label>
                  <Select
                    onValueChange={(value) =>
                      handleInputChange("user_type", value)
                    }
                    value={formData.user_type}
                  >
                    <SelectTrigger className="col-span-3 !bg-gray-500 !text-white-A700">
                      <SelectValue placeholder="Select Type..." />
                    </SelectTrigger>
                    <SelectContent className="col-span-3 !bg-gray-500 !text-white-A700">
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="teacher">Teacher</SelectItem>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="parent">Parent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="user_password" className="text-right">
                    Password
                  </Label>
                  <Input
                    id="user_password"
                    type="password"
                    name="user_password"
                    className="col-span-3"
                    autoComplete="on"
                    value={formData.user_password}
                    onChange={(e) =>
                      handleInputChange("user_password", e.target.value)
                    }
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
                    value={formData.repassword}
                    onChange={(e) =>
                      handleInputChange("repassword", e.target.value)
                    }
                  />
                </div>
                <DialogFooter>
                  <Button type="submit">Add</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Toggle Columns
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white-A700" align="end">
              <DropdownMenuLabel>Toggle Columns</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {table
                ?.getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className="bg-teal-900 text-white-A700"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <div className="flex items-center justify-end space-x-2 p-4 bg-teal-900 text-white-A700">
          {/* <div className="flex-1 text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div> */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPageNum((prev: number) => prev > 0 && prev - 1)}
            disabled={pageNum === 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPageNum((prev: number) => prev + 1)}
            disabled={pageNum * pageSize >= total}
          >
            Next
          </Button>
        </div>
      </div>
    </>
  );
}
