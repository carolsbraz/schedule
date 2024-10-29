import { Checkbox } from "@mui/material";
import React, { useState, useEffect } from "react";

export interface TableColumn {
  key: string;
  label: string;
  renderCell: (rowData: any) => React.ReactNode;
}

export interface TableProps {
  columns: TableColumn[];
  data: any[];
}

const GenericTable: React.FC<TableProps> = ({ columns, data }) => {
  const [checkedRows, setCheckedRows] = useState<number[]>([]);
  const [tableData, setTableData] = useState(data);

  useEffect(() => {
    console.log("IDs das linhas clicadas:", checkedRows.join(", "));
  }, [checkedRows]);

  useEffect(() => {
    setTableData(data);
  }, [data]);

  const handleChangeRow = (
    event: React.ChangeEvent<HTMLInputElement>,
    id: number
  ) => {
    const isChecked = event.target.checked;
    setCheckedRows((prevCheckedRows) => {
      if (isChecked) {
        return [...prevCheckedRows, id];
      } else {
        return prevCheckedRows.filter((rowId) => rowId !== id);
      }
    });
  };

  return (
    <>
      <table className="w-full table-auto border-b border-slate-100 text-slate-700 text-sm">
        <thead>
          <tr className="border-b border-slate-200">
            <th className="text-left py-2 px-6 flex items-center justify-center">
              <Checkbox
                checked={checkedRows.length === tableData.length}
                indeterminate={
                  checkedRows.length > 0 &&
                  checkedRows.length < tableData.length
                }
                onChange={() => {
                  const allIds = tableData.map((item) => item.id);
                  setCheckedRows(
                    checkedRows.length === tableData.length ? [] : allIds
                  );
                }}
              />
            </th>
            {columns.map((column) => (
              <th key={column.key} className="text-left py-2 px-6">
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tableData.map((rowData) => (
            <tr
              key={rowData.id}
              className="border-b border-slate-100 text-slate-600"
            >
              <td className="py-3 px-6 flex items-center justify-center">
                <Checkbox
                  checked={checkedRows.includes(rowData.id)}
                  onChange={(event) => handleChangeRow(event, rowData.id)}
                />
              </td>
              {columns.map((column) => (
                <td key={column.key} className="py-3 px-6">
                  {column.renderCell(rowData)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default GenericTable;
