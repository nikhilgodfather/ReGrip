import React, { useState, useEffect } from "react";
import "./Dashboard.css";
import Sidebar from "./../../components/Sidebar/Sidebar";
import TyreInspection from "../../components/TyreInspection/TyreInspection";
// import LoginPage from "./../LoginPage/LoginPage";
// import { useNavigate } from "react-router-dom";
import Fleet from "../../components/Fleet/Fleet";
// import BlankPage from "../../components/BlankPage/BlankPage";
import Supplier from "../../components/Supplier/Supplier";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCar,
  faUser,
  faUsers,
  faHome,
  faPerson,
  faUserTie,
  faFolderTree,
  faClipboard,
  faBuilding,
  faFileCircleExclamation,
} from "@fortawesome/free-solid-svg-icons";
// import Navbar from "../../components/Navbar/Navbar";
import Users from "../../components/Users/Users";
import { REGRIP_SUPPLIER } from "../../redux/constants/Constant";
import { getCurrentUserDetails } from "../../redux/actions/currentUserAction";
import { useDispatch } from "react-redux";
import Home from "../../components/Home/Home";
import Hrms from "../../components/Hrms/Hrms";
import Crms from "../../components/CRMS/Crms";
import Assignment from "../../components/Assignment/Assignment";
import Organization from "../../components/Organization/Organization";
import Claims from "../../components/Claims/Claims";

const Dashboard = () => {
  const [showdb, setShowdb] = useState(true);
  const [currentElement, setCurrentElement] = useState(0);
  const [currentSubElement, setCurrentSubElement] = useState(null);
  const [currentUser, setCurrentUser] = useState({});
  const [dashboardItems, setDashboardItems] = useState([]);

  const dispatch = useDispatch();

  function parseJwt(token) {
    if (!token) {
      return;
    }
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace("-", "+").replace("_", "/");
    return JSON.parse(window.atob(base64));
  }

  const regripItems = [
    {
      name: "Home",
      element: <Home setCurrentElement={setCurrentElement} />,
      icon: <FontAwesomeIcon icon={faHome} />,
      linkName: "home",
    },
    {
      name: "Tyre Inspection",
      element: <TyreInspection />,
      icon: <FontAwesomeIcon icon={faCar} />,
      linkName: "tyre-inspection",
    },
    {
      name: "Assignment",
      element: <Assignment />,
      icon: <FontAwesomeIcon icon={faClipboard} />,
      linkName: "assignment",
    },
    {
      name: "Claims",
      element: <Claims />,
      icon: <FontAwesomeIcon icon={faFileCircleExclamation} />,
      linkName: "claims",
    },
    // {
    //   name: 'Organization',
    //   element: <Organization />,
    //   icon: <FontAwesomeIcon icon={faBuilding} />,
    // },
    // {
    //   name: 'Fleet',
    //   element: <Fleet />,
    //   icon: <FontAwesomeIcon icon={faPerson} style={{ fontSize: '23px' }} />,
    // },
    // {
    //   name: 'Supplier',
    //   element: <Supplier />,
    //   icon: <FontAwesomeIcon icon={faUser} />,
    // },
    // {
    //   name: 'Users',
    //   icon: <FontAwesomeIcon icon={faUsers} />,
    //   element: <Users />,
    // },
    {
      name: "Organization",
      icon: <FontAwesomeIcon icon={faUserTie} />,
      element: <Hrms />,
    },
    {
      name: "CRMS",
      icon: <FontAwesomeIcon icon={faFolderTree} />,
      element: <Crms />,
    },
    // {
    //   name: "Home",
    //   element: <BlankPage />,
    //   icon: <FontAwesomeIcon icon={faHome} />,
    // },
  ];

  const SupplierItems = [
    {
      name: "Home",
      element: <Home setCurrentElement={setCurrentElement} />,
      icon: <FontAwesomeIcon icon={faHome} />,
      linkName: "home",
    },
    {
      name: "Tyre Inspection",
      element: <TyreInspection />,
      icon: <FontAwesomeIcon icon={faCar} />,
      linkName: "tyre-inspection",
    },
    {
      name: "Assignment",
      element: <Assignment />,
      icon: <FontAwesomeIcon icon={faClipboard} />,
      linkName: "assignment",
    },

    // {
    //   name: "Fleet",
    //   element: <Fleet />,
    //   icon: <FontAwesomeIcon icon={faPerson} style={{ fontSize: "23px", }} />,
    // },
  ];

  useEffect(() => {
    const getToken = localStorage.getItem("token");
    const user = parseJwt(getToken);

    let UserNew = {
      name: user.data.name,
      number: user.data.mobile_number,
      email: user.data.email,
      role_id: user.data.login_role_id,
      role_name:
        user.data.login_role_name.charAt(0).toUpperCase() +
        user.data.login_role_name.slice(1),
    };
    if (
      UserNew.role_name &&
      UserNew.role_name.charAt(0).toUpperCase() + UserNew.role_name.slice(1) ===
        REGRIP_SUPPLIER
    ) {
      setDashboardItems(regripItems);
    } else {
      setDashboardItems(SupplierItems);
    }

    if (UserNew.role_name === "Jk") {
      UserNew.role_name = UserNew.role_name.toUpperCase();
    }

    setCurrentUser(UserNew);
    // access()
    dispatch(getCurrentUserDetails(UserNew));
  }, []);

  return (
    <div className="dashboard-page">
      <Sidebar
        showdb={showdb}
        setShowdb={setShowdb}
        dashboardItems={dashboardItems}
        currentElement={currentElement}
        setCurrentElement={setCurrentElement}
        currentSubElement={currentSubElement}
        setCurrentSubElement={setCurrentSubElement}
      />

      {/* new Comment */}
      <div
        className="dashboard-container"
        style={showdb ? { width: "85%" } : { width: "95%" }}
      >
        {/* <Navbar setShowdb={setShowdb} showdb={showdb} /> */}
        {/* {dashboardItems.length > 0 && (
          <div className="db-item-container">
            {currentSubElement !== null
              ? dashboardItems[currentElement].subItems[currentSubElement]
                  .element
              : dashboardItems[currentElement].element}
          </div>
        )} */}
      </div>
    </div>
  );
};

export default Dashboard;
