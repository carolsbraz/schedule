import { useState } from "react";

import DashboardRounded from "@mui/icons-material/DashboardRounded";
import { WorkspacesRounded } from "@mui/icons-material";
import AgendaLaboratorios from "./admin/env-management";

interface Component {
  title: string;
  content: JSX.Element;
}

const components: Record<string, Component> = {
  dashboard: {
    title: "Dashboard",

    content: <AgendaLaboratorios />,
  },
};

const links = [
  { key: "dashboard", label: "Dashboard", icon: <DashboardRounded /> },
  { key: "environment", label: "Ambientes", icon: <WorkspacesRounded /> },
];

export function Admin() {
  const [activeLink, setActiveLink] = useState("dashboard");
  const [adminName, setAdminName] = useState("");

  return (
    <div className="flex">
      <div className="md:w-1/6 bg-white p-4 space-y-6 h-lvh min-w-[200px]">
        <div>
          <h2 className="text-l font-semibold text-slate-700">Administração</h2>
          <h3 className="text-xl font-semibold text-blue-900">{adminName}</h3>
        </div>
      </div>

      <div className="w-full flex-grow">
        {activeLink in components && (
          <div className="flex flex-col w-full h-full">
            <h3 className="bg-blue-900 text-white text-2xl font-semibold px-6 py-6">
              {components[activeLink].title}
            </h3>

            <div className="px-6 py-4 w-full h-full overflow-auto max-h-[calc(100vh-80px)]">
              {components[activeLink].content}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
