import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { Link } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Login = () => {
  const [state, setState] = useState("sign up");

  const navigate = useNavigate();

  // context
  const { backendUrl, setIsLoggedIn, getUserData } = useContext(AppContext);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // form functionality
  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault();

      // send cookies with request
      axios.defaults.withCredentials = true;

      if (state === "sign up") {
        // user register api
        const { data } = await axios.post(backendUrl + "/api/auth/register", {
          name,
          email,
          password,
        });

        if (data.success) {
          setIsLoggedIn(true);
          getUserData();
          navigate("/");
        } else {
          toast.error(data.message);
        }
      } else {
        // user login api
        const { data } = await axios.post(backendUrl + "/api/auth/login", {
          email,
          password,
        });

        if (data.success) {
          setIsLoggedIn(true);
          getUserData();
          navigate("/");
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      toast.error(error.data.message);
    }
  };

  return (
    <div className=" flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400">
      <Link to="/">
        <img
          src={assets.logo}
          alt=""
          className=" absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer"
        />
      </Link>
      <div className="bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300 text-sm">
        <h2 className="text-3xl font-semibold text-white text-center mb-3 ">
          {state === "sign up" ? "Create account" : "Login"}{" "}
        </h2>
        <p className="text-center text-sm mb-6">
          {state === "sign up"
            ? "Create your account"
            : "Login to your account!"}
        </p>
        <form onSubmit={onSubmitHandler}>
          {state === "sign up" && (
            <div className=" mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
              <img src={assets.person_icon} alt="" />
              <input
                type="text"
                placeholder="Full Name"
                required
                className="bg-transparent outline-none "
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          )}

          <div className=" mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <img src={assets.mail_icon} alt="" />
            <input
              type="email"
              placeholder="Email id"
              required
              className="bg-transparent outline-none "
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className=" mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <img src={assets.lock_icon} alt="" />
            <input
              type="password"
              placeholder="Password"
              required
              className="bg-transparent outline-none "
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Link to="/reset-password">
            <p className="mb-3 text-indigo-500 cursor-pointer ">
              Forgot Password?
            </p>
          </Link>
          <button className=" w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 uppercase  text-white font-medium cursor-pointer">
            {state}
          </button>
        </form>
        {state === "sign up" ? (
          <p className="text-gray-400 text-center text-sm mt-4">
            Already have an account?{" "}
            <span
              onClick={() => setState("Login")}
              className="text-blue-400 cursor-pointer underline"
            >
              {" "}
              Login here
            </span>
          </p>
        ) : (
          <p className="text-gray-400 text-center text-sm mt-4">
            Don't have an account?{" "}
            <span
              onClick={() => setState("sign up")}
              className="text-blue-400 cursor-pointer underline"
            >
              {" "}
              Signup
            </span>
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;
