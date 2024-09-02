import React, { useEffect, useState } from "react";
import "../../components/Hrms/Hrms.css";
import { Controls, Player } from "@lottiefiles/react-lottie-player";
import employee from "../../lotties/employee.json";
import leave from "../../lotties/leave.json";
import payroll from "../../lotties/payroll.json";
import OffShoresales from "../../lotties/sales_temp.json";
import user from "../../lotties/user.json";
import { useSelector } from "react-redux";
import { REGRIP_SUPPLIER } from "../../redux/constants/Constant";
import { useNavigate } from "react-router-dom";

const Hrms = () => {
  const currentUser = useSelector((state) => state.getCurrentUser.role_name);
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser && REGRIP_SUPPLIER) {
      if (currentUser !== REGRIP_SUPPLIER) {
        navigate('/home')
      }
    }
  }, [currentUser])

  return (
    <div className="hrmsContainer" style={{ display: "flex" }}>

      <div style={{ display: "flex", flexWrap: "wrap" }}>
        <div
          className="Employee-list-card"
          onClick={() => {
            navigate('/organization/employees')
          }}
        >
          <Player
            autoplay
            loop={false}
            keepLastFrame={true}
            src={employee}
            style={{ height: "100px", width: "100px" }}
          >
            <Controls buttons={["repeat", "frame", "debug"]} />
          </Player>
          <h3 style={{ padding: "8px 0px" }}>Employees</h3>
        </div>

        <div
          className="Employee-list-card"
          onClick={() => {
            navigate('/organization/leaves')
          }}
        >
          <Player
            autoplay
            loop={false}
            keepLastFrame={true}
            src={leave}
            style={{ height: "100px", width: "100px" }}
          >
            <Controls buttons={["repeat", "frame", "debug"]} />
          </Player>
          <h3 style={{ padding: "8px 0px" }}>Leaves</h3>
        </div>

        <div
          className="Employee-list-card"
          onClick={() => {
            navigate('/organization/attendance')
          }}
        >
          <Player
            autoplay
            loop
            src={payroll}
            style={{ height: "100px", width: "100px" }}
          >
            <Controls buttons={["repeat", "frame", "debug"]} />
          </Player>
          <h3 style={{ padding: "8px 0px" }}>Attendance</h3>
        </div>

        <div
          className="Employee-list-card"
          onClick={() => {
            navigate('/organization/users')
          }}
        >
          <Player
            autoplay
            loop={false}
            keepLastFrame={true}
            src={user}
            style={{ height: "100px", width: "100px" }}
          >
            <Controls buttons={["repeat", "frame", "debug"]} />
          </Player>
          <h3 style={{ padding: "8px 0px" }}>Users</h3>
        </div>

        <div
          className="Employee-list-card"
          onClick={() => {
            navigate('/organization/offshore-sales')
          }}
        >
          <Player
            autoplay
            loop={false}
            keepLastFrame={true}
            src={OffShoresales}
            style={{ height: "100px", width: "100px" }}
          >
            <Controls buttons={["repeat", "frame", "debug"]} />
          </Player>
          <h3 style={{ padding: "8px 0px" }}>OffShore Sales</h3>
        </div>
        
      </div>
    </div>
  );
};

export default Hrms;
