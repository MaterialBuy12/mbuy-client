import React, { useState } from "react";
import Styles from "./Login.module.css";
import Logo2 from "../assests/logo2.png";
import { Link } from "react-router-dom";
import { postUserLogin } from "../apis/api";
// import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { editUser } from "../features/userSlice";
import { editcartbyuserid, getcartbydb } from "../features/cartSlice";
import { getCart } from "../apis/api";
import loginphoto from "../assests/loginphoto.jpg"

const Login = () => {
  const [loginState, setLoginState] = useState({
    username: "",
    password: "",
  });
  const [showUsernameError, setShowUsernameError] = useState(false);
  const [showPasswordError, setShowPasswordError] = useState(false);
  const [buttontext, setButtontext] = useState("Sign in");
  // const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const inputChangeHandler = (key, value) => {
    setLoginState({
      ...loginState,
      [key]: value,
    });
    setShowUsernameError(false);
    setShowPasswordError(false);
  };

  const loginFormHandler = (e) => {
    setButtontext("Signing in...");
    e.preventDefault();
    const loginUser = async () => {
      const response = await postUserLogin(loginState);

      if (response.status === 200 && response.data.authtoken) {
        localStorage.setItem("isAuth", true);
        localStorage.setItem("authToken", response.data.authtoken);
        dispatch(editUser(response.data.user));
        const getOldCart = async (userid) => {
          try {
            const response = await getCart(userid);
            // console.log(response)
            if (response.status === 200) {
              delete response.data._id;
              delete response.data.__v;
              console.log(response.data, "response.data");
              dispatch(getcartbydb(response.data));
            }
          } catch (error) {
            console.log(error);
          }
        };
        await getOldCart(response.data.user._id);
        dispatch(editcartbyuserid(response.data.user._id));
        navigate("/");
      } else if (response.response.status === 400) {
        setButtontext("Sign in");
        if (response.response.data.message === "Invalid Username") {
          setShowUsernameError(true);
        } else if (response.response.data.message === "Invalid Password") {
          setShowPasswordError(true);
        }
      }
    };
    loginUser();
  };

  return (
    <>
      <div className={`min-h-screen grid grid-cols-10`}>
        <div
          className={`min-h-screen flex flex-col items-center justify-center col-span-10 md:col-span-3`}
        >
          <div className={`m-3 md:m-10 text-white`}>
            <img src={Logo2} alt="logo" className={`w-2/3 sm:w-1/2`} />
            <h1 className={`text-2xl font-semibold mt-4`}>
              Sign in to your account
            </h1>
            <form className={`flex flex-col mt-4`} onSubmit={loginFormHandler}>
              <label htmlFor="" className={`text-sm`}>
                Username
              </label>
              <input
                type="text"
                id="username"
                value={loginState.username}
                className={`${Styles.loginInput} rounded text-sm`}
                onChange={(e) => inputChangeHandler("username", e.target.value)}
                required
              />
              {showUsernameError && (
                <p className={`text-red-500 text-sm`}>Incorrect Username</p>
              )}
              <label htmlFor="" className={`mt-2 text-sm`}>
                Password
              </label>
              <input
                type="password"
                id="password"
                value={loginState.password}
                className={`${Styles.loginInput} rounded text-sm tracking-widest`}
                onChange={(e) => inputChangeHandler("password", e.target.value)}
                required
              />
              {showPasswordError && (
                <p className={`text-red-500 text-sm`}>Incorrect Password</p>
              )}
              <Link to={"/forgotpassowrd"}>
                <p className={`mt-2 text-sm`}>Forget Password?</p>
              </Link>
              <button
                className={`bg-slate-500 mt-4 rounded ${Styles.loginButton}`}
                type="submit"
              >
                {buttontext}
              </button>
            </form>
            <Link to="/signup" className={`text-sm`}>
              Don't have an account? Register here.
            </Link>
          </div>
        </div>
        <div
          className={`col-span-0 md:col-span-7 bg-slate-300 ${Styles.mainimg}`}
        >
          <img
            src={loginphoto}
            alt=""
            className={`w-full h-full object-cover`}
          />
        </div>
      </div>
    </>
  );
};

export default Login;
