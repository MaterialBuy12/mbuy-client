import React, { useState } from "react";
import Logo from "../assests/logo2.png";
import Styles from "./Signup.module.css";
import { Link } from "react-router-dom";
import { postUserRegister } from "../apis/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import loginphoto from "../assests/loginphoto.jpg"


const Signup = () => {
  const navigate = useNavigate();
  const [signupState, setSignupState] = useState({
    username: "",
    email: "",
    password: "",
    gst: "",
    orgname: "",
    role: "",
  });
  const [buttontext, setButtontext] = useState("Sign up");
  // const [isAuth, setIsAuth] = useState(false);
  // const [authToken, setAuthToken] = useState("");
  const [showUsernameError, setShowUsernameError] = useState(false);
  const [showEmailError, setShowEmailError] = useState(false);
  const [signupAsCop, setSignupAsCop] = useState(false);
  const [gstvalid, setGstValid] = useState(null);


  const inputChangeHandler = (key, value) => {
    setSignupState({
      ...signupState,
      [key]: value,
    });
    setShowUsernameError(false);
    setShowEmailError(false);
  };

  const signupHandler = (e) => {
    e.preventDefault();
    setButtontext("Signing up...");
    // checking the role of the user
    if(signupAsCop){
      signupState.role = "Corporate";
    }
    const signupUser = async () => {
      const response = await postUserRegister(signupState);
      if (response.status === 200 && response.data.authtoken) {
        console.log(response.data.user);
        toast.success("Signup successfull");
        localStorage.setItem("isAuth", true);
        localStorage.setItem("authToken", response.data.authtoken);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        navigate("/");
      } else if (response.response.status === 400) {
        setButtontext("Sign up");
        if (
          response.response.data.errors ===
          "Sorry! a user with this username already exists."
        ) {
          setShowUsernameError(true);
        } else if (
          response.response.data.errors ===
          "Sorry! a user with this email already exists."
        ) {
          setShowEmailError(true);
        }
      }
    };
    signupUser();
  };

    const validatethegst = (data) => {
      let regex = new RegExp(
        /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/
      );

      console.log(data);
      if (data == null) {
        setGstValid(false);
        console.log("invalid gst");
      }

      if (regex.test(data) == true && data.length === 15) {
        console.log(regex.test(data));
        setGstValid(true);
        console.log("valid gst");
      } else if (data.length > 0 && data.length < 15) {
        setGstValid(false);
        console.log("invalid gst test");
      } else {
        setGstValid(false);
      }
    };

  return (
    <>
      <ToastContainer className="toastContainer" />
      <div className={`min-h-screen grid grid-cols-10`}>
        <div
          className={`min-h-screen flex flex-col items-center justify-center col-span-10 lg:col-span-3`}
        >
          <div className={`m-3 md:m-10 text-white`}>
            <img src={Logo} alt="logo" className={`w-2/3 sm:w-1/2`} />
            <h1 className={`text-2xl font-semibold mt-4`}>
              Sign in to your account
            </h1>
            <form className={`flex flex-col mt-4`} onSubmit={signupHandler}>
              <label htmlFor="" className={`text-sm`}>
                Username
              </label>
              <input
                type="text"
                id="username"
                value={signupState.username}
                className={`${Styles.signupInput} rounded text-sm`}
                onChange={(e) => inputChangeHandler("username", e.target.value)}
                required
              />
              {showUsernameError && (
                <p className={`text-red-500 text-sm`}>
                  Username is already in use!
                </p>
              )}
              <label htmlFor="" className={`text-sm mt-2`}>
                Email
              </label>
              <input
                type="email"
                id="email"
                value={signupState.email}
                className={`${Styles.signupInput} rounded text-sm`}
                onChange={(e) => inputChangeHandler("email", e.target.value)}
                required
              />
              {showEmailError && (
                <p className={`text-red-500 text-sm`}>
                  Email is already in use!
                </p>
              )}
              <label htmlFor="" className={`mt-2 text-sm`}>
                Password
              </label>
              <input
                type="password"
                id="password"
                value={signupState.password}
                className={`${Styles.signupInput} rounded text-sm tracking-widest`}
                onChange={(e) => inputChangeHandler("password", e.target.value)}
                required
              />
              {signupAsCop && (
                <>
                  <label htmlFor="" className={`mt-2 text-sm`}>
                    Phone
                  </label>
                  <input
                    type="text"
                    id="gst"
                    value={signupState.phone}
                    className={`${Styles.signupInput} rounded text-sm tracking-widest`}
                    onChange={(e) =>
                      inputChangeHandler("phone", e.target.value)
                    }
                    // onBlur={()}
                    required
                    />
                  <label htmlFor="" className={`mt-2 text-sm`}>
                    Gst no.
                  </label>
                  <input
                    type="text"
                    id="gst"
                    value={signupState.gst}
                    className={`${Styles.signupInput} rounded text-sm tracking-widest`}
                    onChange={(e) => inputChangeHandler("gst", e.target.value)}
                    // onBlur={()}
                    onBlur={() => validatethegst(signupState.gst)}
                    required
                  />
                  {gstvalid === false ? (
                    <h1 className="text-sm text-red-500">Invalid Gst Number</h1>
                  ) : (
                    ""
                  )}
                  <label htmlFor="" className={`mt-2 text-sm`}>
                    Organization name
                  </label>
                  <input
                    type="text"
                    id="orgname"
                    value={signupState.orgname}
                    className={`${Styles.signupInput} rounded text-sm tracking-widest`}
                    onChange={(e) =>
                      inputChangeHandler("orgname", e.target.value)
                    }
                    required
                  />
                </>
              )}
              <div className="flex w-full justify-end mt-2">
                <input
                  type="checkbox"
                  onChange={(e) => setSignupAsCop(e.target.checked)}
                ></input>
                <label htmlFor="" className="ml-2 text-sm">
                  Signup as corporate
                </label>
              </div>
              <button
                className={`bg-slate-500 mt-4 rounded ${Styles.signupButton}`}
                type="submit"
              >
                {buttontext}
              </button>
            </form>
            <Link to="/login" className={`text-sm cursor-pointer`}>
              Already have an account? Sign in here.
            </Link>
          </div>
        </div>
        <div
          className={`col-span-0 lg:col-span-7 bg-slate-300 ${Styles.mainimg}`}
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

export default Signup;
