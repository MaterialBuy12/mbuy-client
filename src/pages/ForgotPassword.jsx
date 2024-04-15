import { Link } from "react-router-dom";
import React, { useRef, useState } from "react";
import Styles from "./Login.module.css";
import Logo from "../assests/logo.png";
import { toast } from "react-toastify";
import { forgotPassword } from "../apis/api";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const loginFormHandler = async (e) => {
    e.preventDefault();
    if (email.trim() === "") return;
    setLoading(true);
    try {
      const response = await forgotPassword({ email });
      console.log({ response });
      if (response?.status === 200) {
        toast.success(response.data);
      } else {
        const error = response?.response?.data ?? response.message;
        toast.error(error);
      }
    } catch (error) {
      console.log({ error });
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <div className={`min-h-screen grid grid-cols-10`}>
        <div
          className={`min-h-screen flex flex-col items-center justify-center col-span-10 md:col-span-3`}
        >
          <div className={`m-3 md:m-10 text-white`}>
            <img src={Logo} alt="logo" className={`w-2/3 sm:w-1/2`} />
            <h1 className={`text-2xl font-semibold mt-4`}>Forgot Password?</h1>
            <p>We will send a password reset link on your email.</p>
            <form className={`flex flex-col mt-4`} onSubmit={loginFormHandler}>
              <label htmlFor="" className={`text-sm`}>
                Email
              </label>
              <input
                type="email"
                value={email}
                className={`${Styles.loginInput} rounded text-sm`}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <button
                disabled={loading}
                className={`bg-slate-500 mt-4 rounded ${Styles.loginButton}`}
                type="submit"
              >
                {loading ? "Sending..." : "Send Mail"}
              </button>
            </form>
          </div>
        </div>
        <div
          className={`col-span-0 md:col-span-7 bg-slate-300 ${Styles.mainimg}`}
        >
          <img
            src="https://images.pexels.com/photos/4170184/pexels-photo-4170184.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
            alt=""
            className={`w-full h-full object-cover`}
          />
        </div>
      </div>
    </>
  );
};
export default ForgotPassword;
