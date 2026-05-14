import React from "react";
import { useNavigate } from "react-router-dom";

const SigninButton = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/signin");
  };

  return (
    <button
      onClick={handleClick}
      className="bg-zinc-800 hover:bg-zinc-700 border border-blue-500/30 hover:border-blue-400/50 rounded-lg px-6 py-2 text-white font-semibold transition-all duration-200 shadow-md hover:shadow-blue-500/20"
    >
      Sign in
    </button>
  );
};

export default SigninButton;
