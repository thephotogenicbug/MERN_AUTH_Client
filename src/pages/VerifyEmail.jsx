import React, { useContext, useEffect } from "react";
import { assets } from "../assets/assets";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { AppContext } from "../context/AppContext";

const VerifyEmail = () => {
  const navigate = useNavigate();

  axios.defaults.withCredentials = true;
  const { backendUrl, isLoggedIn, getUserData, userData } =
    useContext(AppContext);

  const inputRefs = React.useRef([]);

  // move focus to next input field on enter
  const handleInput = (e, index) => {
    if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  // move focus to prev input field on delete
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && e.target.value === "" && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  // handle paste from clipboard feature
  const handlePaste = (e) => {
    const paste = e.clipboardData.getData("text");
    const pasteArray = paste.split("");
    pasteArray.forEach((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char;
      }
    });
  };

  // handle form
  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault();
      const otpArray = inputRefs.current.map((e) => e.value);
      const otp = otpArray.join("");

      const { data } = await axios.post(
        backendUrl + "/api/auth/verify-account",
        { otp }
      );
      if (data.success) {
        toast.success(data.message);
        getUserData();
        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    isLoggedIn &&
      userData &&
      userData?.userData?.isAccountVerified &&
      navigate("/");
  }, [isLoggedIn, userData]);

  return (
    <div className=" flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 to-purple-400">
      <Link to="/">
        <img
          src={assets.logo}
          alt=""
          className=" absolute left-5 sm:left-20 top-5 w-20 sm:w-28 cursor-pointer"
        />
      </Link>
      <form
        onSubmit={onSubmitHandler}
        className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm"
      >
        <h1 className="text-white text-2xl font-semibold text-center mb-4">
          Email Verify OTP
        </h1>
        <p className="text-center mb-6 text-indigo-400">
          Enter the 6-digit code sent to your email id.
        </p>
        <div className="flex justify-between mb-8" onPaste={handlePaste}>
          {Array(6)
            .fill(0)
            .map((_, index) => (
              <input
                type="text"
                maxLength="1"
                key={index}
                required
                className="w-12 h-12 bg-[#335c41] text-white text-center text-xl rounded-md"
                ref={(e) => (inputRefs.current[index] = e)}
                onInput={(e) => handleInput(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
              />
            ))}
        </div>
        <button className="w-full py-3 bg-gradient-to-r from-green-500 to-green-900 rounded-full cursor-pointer text-white uppercase">
          Verify email
        </button>
      </form>
    </div>
  );
};

export default VerifyEmail;
