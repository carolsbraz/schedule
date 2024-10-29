import React from "react";

interface PropsInputRadio {
  text: string;
  icon: React.ReactNode;
  name: string;
  value: string;
  checked: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function InputRadio(props: PropsInputRadio) {
  return (
    <label
      className={`px-4 py-2 min-w-[150px] outline outline-1 rounded-sm hover:cursor-pointer transition-colors flex items-center ${
        props.checked ? "text-blue-800" : "outline-slate-400"
      }`}
    >
      <input
        type="radio"
        name={props.name}
        value={props.value}
        checked={props.checked}
        onChange={props.onChange}
        className="appearance-none"
      />
      <span
        className={`flex items-center gap-2 justify-center md:justify-start md:flex-row ${
          props.checked ? "text-blue-800" : "text-slate-400"
        }`}
      >
        {props.icon} {props.text}
      </span>
    </label>
  );
}
