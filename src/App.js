// import "./App.css";
import {
  BrowserRouter as Router,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import AllRoutes from "./AllRoutes";
import "./pages/Dashboard/Dashboard.css";
import NewSidebarAllRoutes from "./NewSidebarAllRoutes";
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
  faDashboard,
} from "@fortawesome/free-solid-svg-icons";
import { useDispatch } from "react-redux";
import { REGRIP_SUPPLIER } from "./redux/constants/Constant";
import { getCurrentUserDetails } from "./redux/actions/currentUserAction";
import Sidebar from "./components/Sidebar/Sidebar";
import SidebarProvider, {
  SidebarContext,
} from "./components/Sidebar/currentSelected";

function App({ setIsloggedIn }) {
  const [showdb, setShowdb] = useState(true);
  const [currentElement, setCurrentElement] = useState("");
  const [currentSubElement, setCurrentSubElement] = useState(null);
  const [currentUser, setCurrentUser] = useState({});
  const [dashboardItems, setDashboardItems] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();

  const dispatch = useDispatch();

  function parseJwt(token) {
    if (!token) {
      return;
    }
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace("-", "+").replace("_", "/");
    return JSON.parse(window.atob(base64));
  }
  const { selectedCurrentElement, setSelectedCurrentElement } =
    useContext(SidebarContext);

    const newSidebarRoutes = [
      "/RegripERP",
      "/UploadJKTyre",
       "/viewJkBatch", 
      "/tyreConsoleReport",
       "/viewPurchase",
      "/addpurchase"
    ];

    const isNewSidebarRoute = newSidebarRoutes.some((route) =>
      location.pathname.startsWith(route)
    );

  const regripItems = [
    {
      name: "Home",
      // element: <Home setCurrentElement={setCurrentElement} />,
      icon: <FontAwesomeIcon icon={faHome} />,
      linkName: "home",
    },
    {
      name: "Tyre Inspection",
      // element: <TyreInspection />,
      icon: <FontAwesomeIcon icon={faCar} />,
      linkName: "tyre-inspection",
    },
    {
      name: "Assignment",
      // element: <Assignment />,
      icon: <FontAwesomeIcon icon={faClipboard} />,
      linkName: "assignment",
    },
    {
      name: "Claims",
      // element: <Claims />,
      icon: <FontAwesomeIcon icon={faFileCircleExclamation} />,
      linkName: "claims",
    },

    {
      name: "Organization",
      icon: <FontAwesomeIcon icon={faUserTie} />,
      linkName: "organization",

      // element: <Hrms />,
    },
    {
      name: "CRMS",
      icon: <FontAwesomeIcon icon={faFolderTree} />,
      linkName: "crms",

      // element: <Crms />,
    },
    {
      name: "RegripERP",
      icon :<FontAwesomeIcon icon={faDashboard}/>,
      linkName: "/RegripERP"
    }
  ];

  const SupplierItems = [
    {
      name: "Home",
      // element: <Home setCurrentElement={setCurrentElement} />,
      icon: <FontAwesomeIcon icon={faHome} />,
      linkName: "home",
    },
    {
      name: "Tyre Inspection",
      // element: <TyreInspection />,
      icon: <FontAwesomeIcon icon={faCar} />,
      linkName: "tyre-inspection",
    },
    {
      name: "Assignment",
      // element: <Assignment />,
      icon: <FontAwesomeIcon icon={faClipboard} />,
      linkName: "assignment",
    },
    {
      name: "Report",
      // element: <Report/>,
      icon: <FontAwesomeIcon icon={faClipboard} />,
      linkName: "report",
    },
  ];

  useEffect(() => {
    const getToken = localStorage.getItem("token");
    const user = parseJwt(getToken);

    let UserNew = {
      name: user?.data.name,
      number: user?.data.mobile_number,
      email: user?.data.email,
      role_id: user?.data.login_role_id,
      role_name:
        user?.data.login_role_name.charAt(0).toUpperCase() +
        user?.data.login_role_name.slice(1),
    };
    if (
      UserNew.role_name &&
      UserNew?.role_name.charAt(0).toUpperCase() +
        UserNew?.role_name.slice(1) ===
        REGRIP_SUPPLIER
    ) {
      setDashboardItems(regripItems);
    } else {
      setDashboardItems(SupplierItems);
    }

    if (UserNew?.role_name === "Jk") {
      UserNew.role_name = UserNew.role_name.toUpperCase();
    }

    setCurrentUser(UserNew);
    // access()
    dispatch(getCurrentUserDetails(UserNew));
  }, []);

  useEffect(() => {
    const currentUrl = location.pathname;
    if (currentUrl === "/") {
      navigate("/home");
      return;
    }
    if (currentUrl) {
      const firstEndpoint = currentUrl.split("/")[1];
      setSelectedCurrentElement(firstEndpoint);
    }
  }, [location.pathname]);

  return (
    // <Router>
    <div>
    {!isNewSidebarRoute ? <div className="dashboard-page">
      <Sidebar
        showdb={showdb}
        setShowdb={setShowdb}
        dashboardItems={dashboardItems}
        currentElement={currentElement}
        setCurrentElement={setCurrentElement}
        currentSubElement={currentSubElement}
        setCurrentSubElement={setCurrentSubElement}
        setIsloggedIn={setIsloggedIn}
      />
      <div
        className="dashboard-container"
        // style={showdb ? { width: "85%" ,} : { width: "95%" },}

        style={{ width: showdb ? "85%" : "95%" }}
      >
        <AllRoutes />
        
      </div>
    </div> : ''}
    {isNewSidebarRoute && <NewSidebarAllRoutes />}
    </div>
    // </Router>
  );
}

export default App;

// const Side = () => {
//   return (
//     <div
//       className="dashboard-container"
//       style={showdb ? { width: "85%" } : { width: "95%" }}
//     >
//       hahahahhah
//     </div>
//   );
// };
