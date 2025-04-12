import { useAuthContext } from "hooks/useAuthContext";
import {  ChevronLast, ChevronFirst } from "lucide-react";
import React, { useContext, createContext, useState, ReactNode } from "react";
import { Link } from "react-router-dom";

interface SidebarContextType {
  expanded: boolean;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

interface SidebarProps {
  children?: ReactNode;
}

export default function Sidebar({ children }: SidebarProps) {
  const { user }: any = useAuthContext();

  const [expanded, setExpanded] = useState<boolean>(true);

  return (
    <>
      <aside
        className={`h-full min-h-screen relative transition-all ${
          expanded ? "w-72" : "w-18"
        }`}
      >
        <nav className="h-full flex flex-col bg-white border-r shadow-sm">
          <div className="p-4 pb-2 flex justify-between items-center">
            <Link to={"/"}>
              <img
                src="/images/ILATE_Classes_Final_Logo-02.jpg"
                alt="logo"
                loading="lazy"
                className={`overflow-hidden my-2 transition-all ${
                  expanded ? "w-32" : "w-0"
                }`}
              />
            </Link>
            <button
              onClick={() => setExpanded((curr) => !curr)}
              className="p-1.5 my-2 rounded-lg bg-indigo-50 hover:bg-indigo-200"
            >
              {expanded ? <ChevronFirst /> : <ChevronLast />}
            </button>
          </div>
          <div>
            <h4 className={`text-[18px] m-4 overflow-hidden my-2 transition-all ${
                  expanded ? "w-32" : "w-0"
                }`}>
              Welcome {user?.user_name.toUpperCase()}
            </h4>
          </div>

          <SidebarContext.Provider value={{ expanded }}>
            <ul className="flex-1 px-3 my-1">{children}</ul>
          </SidebarContext.Provider>
        </nav>
      </aside>
    </>
  );
}

interface SidebarItemProps {
  icon?: any;
  text?: string;
  active?: boolean;
  alert?: boolean;
}

export function SidebarItem({ icon, text, active, alert }: SidebarItemProps) {
  const { expanded }: SidebarContextType = useContext(SidebarContext);

  return (
    <>
      <h4 className={` ${expanded ? "visible" : "hidden"}`}>
        {/* div contents */}
      </h4>
      <li
        className={`
          relative flex items-center py-2 px-3 my-1
          font-medium rounded-md cursor-pointer
          transition-colors group
          ${
            active
              ? "bg-gradient-to-tr from-indigo-200 to-indigo-100 text-indigo-800"
              : "hover:bg-indigo-50 text-gray-600"
          }
      `}
      >
        {icon}
        <span
          className={`overflow-hidden transition-all ${
            expanded ? "w-52 ml-3" : "w-0"
          }`}
        >
          {text}
        </span>
        {alert && (
          <div
            className={`absolute right-2 w-2 h-2 rounded bg-indigo-400 ${
              expanded ? "" : "top-2"
            }`}
          />
        )}

        {!expanded && (
          <div
            className={`
            absolute left-full rounded-md px-2 py-1 ml-6
            bg-indigo-100 text-indigo-800 text-sm
            invisible opacity-20 -translate-x-3 transition-all
            group-hover:visible group-hover:opacity-100 group-hover:translate-x-0
        `}
          >
            {text}
          </div>
        )}
      </li>
    </>
  );
}
