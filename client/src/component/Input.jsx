import React, { useState } from "react";
import { TextField } from "@mui/material";
import { LiaEyeSolid, LiaEyeSlashSolid } from "react-icons/lia";

export default function Input({ id, onChange, value, label, type }) {
  const [showPassword, setShowPassword] = useState(true);

  // Styling for the TextField component
  const style = {
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "black",
      },
      "&:hover fieldset": {
        borderColor: "black",
      },
      "&.Mui-focused fieldset": {
        borderColor: "black",
      },
    },
    "& .MuiInputLabel-root": {
      color: "black",
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: "black",
    },
    "& .MuiInputBase-input": {
      color: "black",
    },
  };

  // Choose the appropriate icon based on password visibility
  const Icon = showPassword ? LiaEyeSolid : LiaEyeSlashSolid;

  return (
    <div className="relative">
      <TextField
        id={id}
        name={id}
        onChange={onChange}
        type={!showPassword ? "password" : "text"}
        value={value}
        sx={style}
        className="text-white  w-full rounded-md"
        label={label}
        variant="outlined"
      />
      {type === "password" && (
        <div
          onClick={() => setShowPassword(!showPassword)}
          className="absolute text-black right-5 top-1/3"
        >
          <Icon size={20} />
        </div>
      )}
    </div>
  );
}
