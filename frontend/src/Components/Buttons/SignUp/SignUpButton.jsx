import React from "react";
import { useNavigate } from "react-router-dom";

const SignUpButton = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/signup");
  };

  return (
    <button
      onClick={handleClick}
      className="bg-blue-600 hover:bg-blue-500 border border-blue-400/50 rounded-lg px-6 py-2 text-white font-semibold transition-all duration-200 shadow-md shadow-blue-500/20 hover:shadow-blue-500/40"
    >
      Sign up
    </button>
  );
};

export default SignUpButton;
