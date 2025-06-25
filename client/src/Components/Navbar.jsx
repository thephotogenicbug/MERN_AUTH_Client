import React from "react";
import { assets } from "../assets/assets";
import { Link } from "react-router-dom";
const Navbar = () => {
  return (
    <div className="w-full flex justify-between items-center p-4 sm:p-6 sm:px-24 absolute top-0">
      <img src={assets.logo} alt="" className="w-28 sm:w-32" />
      <Link to="/login">
        <button className="flex items-center gap-2 border border-gray-500 rounded-full py-2 px-6 text-gray-800 hover:bg-gray-100 transition-all cursor-pointer ">
          Login <img src={assets.arrow_icon} alt="" />
        </button>
      </Link>
    </div>
  );
};

export default Navbar;
