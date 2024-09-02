import React, { useEffect, useState } from "react";
import {
  faCircleCheck,
  faUserLarge,
  faLayerGroup,
  faFolderOpen,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import EmployeeList from './EmployeeList';
import "../../components/Hrms/Hrms.css";
import { Controls, Player } from "@lottiefiles/react-lottie-player";
import employee from "../../lotties/employee.json";
import user from "../../lotties/user.json";
import payroll from "../../lotties/payroll.json";
import Users from "../Users/Users";
// import AllAttendance from './AllAttendance/AllAttendance';
// import Leaves from './leaves/Leaves';

const Organization = () => {
  const [showNewComponent, setShowNewComponent] = useState(false);
  const [showUserComponent, setShowUserComponent] = useState(false);
  const [showOrganizationVisible, setShowOrganizationVisible] = useState(true);

  const [leaveComponent, setLeaveComponent] = useState(false);

  const handleClick = () => {
    setShowNewComponent(true);
    setShowOrganizationVisible(false);
  };

  const handleUserClick = () => {
    setShowUserComponent(true);
    setShowOrganizationVisible(false);
  };

  const handleLeaveClick = () => {
    setLeaveComponent(true);
    setShowOrganizationVisible(false);
  };

  function handleBackButton() {
    setShowNewComponent(false);
    setShowOrganizationVisible(true);
    setShowUserComponent(false);
    setLeaveComponent(false);
  }

  return (
    <div
      className="organization-container"
      style={{ display: "flex", width: "100%" }}
    >
      {/* {showNewComponent && <EmployeeList handleBackButton={handleBackButton} />} */}
      {showUserComponent && <Users handleBackButton={handleBackButton} />}
      {/* {leaveComponent && <Leaves handleBackButton={handleBackButton} />} */}

      {showOrganizationVisible && (
        <div style={{ display: "flex" }}>
          {/* <div
            className="Employee-list-card" onClick={() => {
              handleClick();
            }}>

            <Player
              autoplay
              loop={false}
              keepLastFrame={true}
              src={employee}
              style={{ height: '100px', width: '100px' }}
            >
              <Controls buttons={['repeat', 'frame', 'debug']} />
            </Player>
            <h3 style={{ padding: '8px 0px' }}>Employees</h3>
          </div> */}

          <div
            className="Employee-list-card"
            onClick={() => {
              handleUserClick();
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

          {/* <div
            className="Employee-list-card" onClick={() => {
              // handleAttendanceClick();
            }}
          >
            <Player
              autoplay
              loop
              src={payroll}
              style={{ height: '100px', width: '100px' }}
            >
              <Controls buttons={['repeat', 'frame', 'debug']} />
            </Player>
            <h3 style={{ padding: '8px 0px' }}>Attendance</h3>
          </div> */}
        </div>
      )}
    </div>
  );
};

export default Organization;
