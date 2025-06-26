import React, { useContext } from "react";
import { assets } from "../assets/assets";
import { Link } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const Navbar = () => {
  const { userData, backendUrl, setUserData, setIsLoggedIn } =
    useContext(AppContext);

  const navigate = useNavigate();

  const logout = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(backendUrl + "/api/auth/logout");
      data.success && setIsLoggedIn(false);
      data.success && setUserData(false);
      navigate("/");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="w-full flex justify-between items-center p-4 sm:p-6 sm:px-24 absolute top-0">
      <img src={assets.logo} alt="" className="w-28 sm:w-32" />
      {userData ? (
        <div className="  w-8 h-8 flex justify-center items-center rounded-full bg-black text-white relative group">
          {userData?.userData?.name[0].toUpperCase()}
          <div className=" absolute hidden group-hover:block top-0 right-0 z-10 text-black rounded pt-10">
            <ul className="list-non m-0 p-2 bg-gray-100 text-sm">
              {!userData?.userData?.isAccountVerified && (
                <li className="py-1 px-2 hover:bg-gray-200 cursor-pointer">
                  Verify email
                </li>
              )}

              <li
                onClick={logout}
                className="py-1 px-2 hover:bg-gray-200 cursor-pointer pr-10"
              >
                Logout
              </li>
            </ul>
          </div>
        </div>
      ) : (
        <Link to="/login">
          <button className="flex items-center gap-2 border border-gray-500 rounded-full py-2 px-6 text-gray-800 hover:bg-gray-100 transition-all cursor-pointer ">
            Login <img src={assets.arrow_icon} alt="" />
          </button>
        </Link>
      )}
    </div>
  );
};

export default Navbar;
