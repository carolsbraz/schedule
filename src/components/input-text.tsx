import React, { useState, useRef, useEffect } from "react";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import VisibilityOffRounded from "@mui/icons-material/VisibilityOffRounded";

interface PropsInputText {
  text: string;
  icon: React.ReactNode;
  placeholder: string;
  type: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value?: string;
  color?: string;
}

export function InputText(props: PropsInputText) {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const textColorClass =
    props.color == "red"
      ? "text-red-800"
      : isFocused
      ? "text-blue-800"
      : "text-slate-600";

  const outlineColorClass =
    props.color == "red"
      ? "outline-red-800"
      : isFocused
      ? "outline-blue-800"
      : "outline-slate-600";

  const placeholderColorClass =
    props.color == "red" ? "placeholder-red-800/60" : "outline-slate-400";

  useEffect(() => {
    if (isFocused && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isFocused]);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="mt-3">
      <span className={textColorClass}>{props.text}</span>
      <br />
      <div
        className={`w-full py-2 pl-3 pr-4 outline outline-1 rounded-sm flex justify-between transition-colors hover:cursor-text ${outlineColorClass}`}
        onClick={() => setIsFocused(true)}
      >
        <div className="w-full">
          <span
            className={`mr-3 ${textColorClass} ${
              props.type === "password" ? "cursor-pointer" : ""
            }`}
          >
            {props.icon}
          </span>
          <input
            autoComplete={"new-password"}
            ref={inputRef}
            className={`bg-transparent md:w-[90%] w-[70%] transition-colors focus:outline-none ${placeholderColorClass} ${textColorClass} focus:${textColorClass}`}
            type={
              props.type === "password" && showPassword ? "text" : props.type
            }
            placeholder={props.placeholder}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onChange={props.onChange}
            value={props.value}
          />
        </div>
        {props.type === "password" && (
          <span
            onClick={togglePasswordVisibility}
            className={`transition-colors cursor-pointer ${textColorClass}`}
          >
            {props.type === "password" && showPassword ? (
              <VisibilityOffRounded />
            ) : (
              <VisibilityRoundedIcon />
            )}
          </span>
        )}
      </div>
    </div>
  );
}
