import React, { useState } from "react";
import "./Sidebar.css";
import axios from "axios";
import { API_URL } from "../Config/index";
import ProfileImage from "../../assets/profile.png";
import JKProfileImage from "../../assets/jktyre-tyre-logo.png";
import BridgestoneProfileImage from "../../assets/Bridgestone_profile1.png";
import CompanyLogo from "../../assets/regrip-logo.png";
import MenuIcon from "../../assets/menu.png";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
import {
  BRIDGESTONE_ROLE_ID,
  JK_ROLE_ID,
} from "../../redux/constants/Constant";
import { useSidebar } from "./currentSelected";

const Sidebar = ({
  setShowdb,
  showdb,
  dashboardItems,
  currentElement,
  setCurrentElement,
  setIsloggedIn,
}) => {
  const userDetails_Name = useSelector((state) => state.getCurrentUser.name);
  const userDetails_Number = useSelector(
    (state) => state.getCurrentUser.number
  );
  const currentUser = useSelector((state) => state.getCurrentUser.role_id);
  const { setSelectedElement, selectedCurrentElement } = useSidebar();

  const navigate = useNavigate();

  const logout = async () => {
    try {
      const response = await axios.post(`${API_URL}/logout/logoutUser`);
      if (response.status === 200) {
        localStorage.removeItem("token");
        setIsloggedIn(false)
        navigate("/login");  
      } 
      else {
        console.error(
          "Logout was not successful. Response status:",
          response.status
        );
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  return (
    <div
      className={`sidebar-container ${
        showdb ? "side-main-cont" : "hide-side-cont"
      }`}
    >
      <div className="sidebar-inner-div">
        <div className="sidebar-menu">
          <h4 onClick={() => setShowdb((prevShowdb) => !prevShowdb)}>
            <img src={MenuIcon} alt="menu-icon" width="30" />
          </h4>
        </div>
        <div
          className="sidebar-profile-container"
          style={{ background: "none" }}
        >
          <div className="profile-icon">
            <img
              // style={{
              //   height: `${showdb ? "5rem" : "4rem"}`,
              //   width: `${showdb ? "5rem" : "4rem"}`,
              // }}
              src={
                currentUser === JK_ROLE_ID
                  ? JKProfileImage
                  : currentUser === BRIDGESTONE_ROLE_ID
                  ? BridgestoneProfileImage
                  : ProfileImage
              }
              alt="profile-img"
            />
          </div>
          {showdb && (
            <div className="profile-info">
              <h3 className="name" style={{ textTransform: "capitalize" }}>
                {userDetails_Name}
              </h3>
              <p className="number">{userDetails_Number}</p>
            </div>
          )}
        </div>
        <div className="dashboard-items-container">
          <ul className="dashboard-items">
            {dashboardItems.map((item, i) => {
              return (
                <li
                  key={i}
                  // className={`dashboard-item ${
                  //   currentElement === i ? "active-item" : ""
                  // }`}
                >
                  <Link
                    className={`dashboard-item ${
                      item.linkName === selectedCurrentElement
                        ? "active-item"
                        : ""
                    }`}
                    to={item?.linkName}
                    onClick={() => {
                      setSelectedElement && setSelectedElement(item?.linkName);
                    }}
                  >
                    <span>{item.icon}</span>
                    {showdb && <p className="sidebar-icons">{item.name}</p>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="logOut-box">
          <button className="lg-btn" onClick={() => logout()}>
            <FontAwesomeIcon
              className="lg-icon"
              icon={faRightFromBracket}
              style={{ color: "#39532F", fontSize: "16px" }}
            />{" "}
            {showdb && <span className="lg-txt">Logout</span>}{" "}
          </button>
        </div>
      </div>
      <div className="version-container">
        {!showdb && <img src={CompanyLogo} alt="company-logo" width="65" />}
        {showdb && (
          <div className="nav-item company-logo">
            <img src={CompanyLogo} alt="company-logo" width="95" />
          </div>
        )}
        {/* {showdb && (
          <div className="text">
            <p>Terms of Service</p>
            <p>Privacy Policy</p>
          </div>
        )} */}
        <p className="version_name">Version 1.0.0</p>
      </div>
    </div>
  );
};

export default Sidebar;
