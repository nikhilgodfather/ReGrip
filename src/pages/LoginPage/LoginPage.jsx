import React, { useEffect, useState } from "react";
import "./LoginPage.css";
import { useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPhone,
  faUserLock,
  faEyeSlash,
  faEye,
} from "@fortawesome/free-solid-svg-icons";
import stockImg from "../../assets/sunil-shetty.jpg";
import cLogo from "../../assets/logo_black.png";
import axios from "axios";
import { API_URL } from "../../components/Config";
import { CircularProgress } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";

const LoginPage = ({ isloggedIn, setIsloggedIn }) => {
  const [showPassword, setShowPassword] = useState(false);
  const location = useLocation();

  const [loading, setLoading] = useState();
  const navigate = useNavigate();
  const [mobileWarning, setMobileWarning] = useState(false);
  const [passwordWarning, setPasswordWarning] = useState(false);
  const [mobileNumber, setMobileNumber] = useState();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    if (isloggedIn) {
      navigate('/home')
    }
  }, [isloggedIn])

  const getLoginDetails = async (e, navigate) => {
    e.preventDefault();

    const login_url = `${API_URL}/user/login`;
    const mobileno = e.target["mobileno"].value;
    const password = e.target["password"].value;

    if (mobileno.length !== 10) {
      setMobileWarning(true);
      return;
    }

    if (password.length <= 8) {
      setPasswordWarning(true);
      return;
    }

    setLoading(true);

    await axios
      .post(login_url, { mobileno, password })
      .then((res) => {
        if (res?.data?.data?.verified) {
          localStorage.setItem("token", JSON.stringify(res?.data?.data?.token));
          setIsloggedIn(true)
          navigate("/home");
          setLoading(false);
        }
      })
      .catch((err) => {
        setLoading(false);
        toast.error(err.response?.data?.message, {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 3000,
        });
      });
  };
  return (
    <div className="login-mega-container">
      <div className="login-container">
        <ToastContainer style={{ width: "400px" }} />
        <div className="image-side">
          <img src={stockImg} alt="stock-img" />
        </div>
        {/* <div className="line"></div> */}
        <div className="login-side">
          <div className="login-card">
            <span className="logo-container">
              <img src={cLogo} alt="company-logo" />
            </span>
            <h1 className="login-heading">Welcome to ReGrip</h1>
            <form
              action=""
              className="login-form"
              onSubmit={(e) => {
                getLoginDetails(e, navigate);
              }}
            >
              <div
                className="mobile-input login-input"
                style={{ display: "block", position: "relative" }}
              >
                <div className="label-input">
                  <label htmlFor="Mobileno">
                    <FontAwesomeIcon
                      icon={faPhone}
                      style={{ color: "#39532F", fontSize: "18px" }}
                    />
                  </label>
                  <input
                    type="number"
                    name="mobileno"
                    id="Mobileno"
                    placeholder="Enter mobile number"
                    value={mobileNumber}
                    onChange={(e) => {
                      // setMobileWarning(false);
                      if(e.target.value.length<=10){
                        setMobileNumber(e.target.value)
                      }
                    }}
                  />
                </div>
                {mobileWarning && (
                  <div
                    style={{
                      color: "red",
                      fontSize: 12,
                      marginLeft: "35px",
                      marginTop: "3px",
                      position: "absolute",
                    }}
                  >
                    {" "}
                    Mobile number requires only 10 digits.
                  </div>
                )}
              </div>

              <div
                className="password-input login-input"
                style={{ display: "block", position: "relative" }}
              >
                <div className="label-input">
                  <label htmlFor="Password">
                    <FontAwesomeIcon
                      icon={faUserLock}
                      style={{ color: "#39532F", fontSize: "18px" }}
                    />
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    id="Password"
                    placeholder="Password"
                    onChange={() => {
                      setPasswordWarning(false);
                    }}
                  />
                  <span
                    style={{
                      position: "absolute",
                      right: "0",
                    }}
                  >
                    {showPassword ? (
                      <FontAwesomeIcon
                        icon={faEyeSlash}
                        onClick={togglePasswordVisibility}
                        style={{ margin: "0px 4px" }}
                      />
                    ) : (
                      <FontAwesomeIcon
                        icon={faEye}
                        onClick={togglePasswordVisibility}
                        style={{ margin: "0px 4px" }}
                      />
                    )}
                  </span>
                </div>

                {passwordWarning && (
                  <div
                    style={{
                      color: "red",
                      fontSize: "12px",
                      marginLeft: "35px",
                      marginTop: "3px",
                      position: "absolute",
                    }}
                  >
                    {" "}
                    Password requires a minimum of 8 characters.
                  </div>
                )}
              </div>

              <div className="login-bottom">
                <div className="login-remember-me">
                  <input
                    type="checkbox"
                    id="rememberMe"
                    value="remember-me"
                    name="remember-me"
                  />
                  <label htmlFor="rememberMe">Remember Me</label>
                </div>
                <a href="https://www.google.com">Forgot Password ?</a>
              </div>
              {loading ? (
                <button className="login-button" type="submit">
                  <CircularProgress
                    style={{ color: "white", width: 15, height: 15 }}
                  />
                </button>
              ) : (
                <button className="login-button" type="submit">
                  Login
                </button>
              )}

              <p className="login-terms">
                Login for ReGrip account means you agree for{" "}
                <span>Privacy Policy</span> {"and "}
                <span>Terms of Services</span>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
export default LoginPage;
