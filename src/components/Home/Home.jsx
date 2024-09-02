import "./Home.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { PieChart, pieArcLabelClasses } from "@mui/x-charts/PieChart";

import { faDownload, faEye } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useEffect, useState } from "react";
import { API_URL } from "../Config";
import { useDispatch, useSelector } from "react-redux";
import { REGRIP_SUPPLIER } from "../../redux/constants/Constant";
import tyrelogo from "../../assets/tyre (6) 1.png";
import A from "../../assets/A.png";
import B from "../../assets/B.png";
import C from "../../assets/C.png";
import D from "../../assets/D.png";
import CC from "../../assets/C+.png";
import searchIcon from "../../assets/icon.png";
import line from "../../assets/Line 16.png";
import HomeDownloadPDF from "../PdfComponents/HomeDownloadPDF/HomeDownloadPDF";
import TyreInspection from "../TyreInspection/TyreInspection";
import PendingInspection from "./PendingInspection/PendingInspection";
import RecentInspection from "./RecentInspection/RecentInspection";
import { getDefectTypes } from "../../redux/actions/DefectAction";
import { Box, Stack, Typography } from "@mui/material";
import Supplier from "../Supplier/Supplier";
import { BarChart } from "@mui/x-charts/BarChart";
import { ChartContainer, BarPlot } from "@mui/x-charts";
import HomeAssignment from "./HomeAssignment/HomeAssignment";
import Modal from "@mui/joy/Modal";
import Sheet from "@mui/joy/Sheet";
import Notification from "./Notification/Notification";
import { Transition } from "react-transition-group";
import { updateNotificationCount } from "../../redux/actions/TotalNotificationCount";
import Badge from "@mui/joy/Badge";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { Link, useNavigate } from "react-router-dom";
import { useSidebar } from "../Sidebar/currentSelected";
import SearchTyreDataModal from "./SearchTyreDataModal";
import { ModalClose } from "@mui/joy";

const Home = () => {
  const { setSelectedElement } = useSidebar();

  const [assignmentPendingData, setAssignmentPendingData] = useState();
  const dispatch = useDispatch();
  const [defects, setDefects] = useState();
  const [dashboardData, setDashboardData] = useState(null);
  const userDetails_Name = useSelector((state) => state.getCurrentUser.name);
  const currentUser = useSelector((state) => state.getCurrentUser.role_name);
  const [selectedOption, setSelectedOption] = useState();
  const [searchedOption, setSearchedOption] = useState();
  const [searchResult, setSearchResult] = useState();
  const [show, setShow] = useState(false);
  const [showHome, setShowHome] = useState(true);

  const [sendTyreData, setSendTyreData] = useState();
  const [showSearchTyreModal, setShowSearchTyreModal] = useState(false);
  const [showTypeInspection, setShowTypeInspection] = useState(false);

  const [category, setCategory] = useState(null);
  const [totalCountCategory, setTotalCountCategory] = useState(null);
  const [showInspectionCategory, setsShowInspectionCategory] = useState(false);
  const navigate = useNavigate();

  // const getInspectionData = async ({ batchId, setInspectionDetailsModal }) => {
  //     try {
  //         const batch_id = batchId;

  //         const { data } = await axios.get(`${API_URL}/inspection/getbatch/${batch_id}`);
  //         const { inspectionbatch } = data.data;
  //         setInspectionData(inspectionbatch);
  //     } catch (error) {
  //         console.error("Error fetching inspection data:", error);
  //         setInspectionData([]);
  //     }
  // };

  const uData = [4000, 3000, 2000, 2780, 3490];
  const xLabels = ["Page A", "Page B", "Page C", "Page D", "Page E"];

  const handleTyreInspection = () => {
    setShowTypeInspection(true);
    setShowHome(false);
  };

  const handleBackButton = () => {
    setShowTypeInspection(false);
    setShowHome(true);
  };

  const onSearch = async (e) => {
    setSearchedOption(e.target.value);
    if (e.target.value === "" || e.target.value.length < 3) {
      setShow(false);
      return;
    }
    try {
      const token = localStorage.getItem("token");
      // if (!token) navigate("/");
      const bearer_token = "bearer " + JSON.parse(token);
      const { data } = await axios.get(
        `${API_URL}/inspection/getinspection?serialnumber=${e.target.value}`,
        {
          headers: {
            Authorization: bearer_token,
          },
        }
      );
      setShow(true);
      setSearchResult(data.data.inspectionbatch);
    } catch (error) {
      console.error("Error fetching dashboard data:", error.message);
    }
  };
  // const handleDownloadClick = (tyreData) => {
  //     setTyreDataToDownload(tyreData);
  // };
  const handleBackButtonCategory = () => {
    setsShowInspectionCategory(false);
    setShowHome(true);
  };

  const setCategoryonClick = (categoryId, totalCount) => {
    setCategory(categoryId);
    setTotalCountCategory(totalCount);
  };

  const handleCategoryClick = (categoryId, totalCount) => {
    setCategory(categoryId);
    setTotalCountCategory(totalCount);
    navigate(`/home/tyres/${categoryId}`);
  };

  const getDefects = async () => {
    const { data } = await axios.get(`${API_URL}/defect/getdata`);
    setDefects(data);
    dispatch(getDefectTypes(data));
  };

  const getAssignmentPendingDashboardData = async () => {
    try {
      const token = localStorage.getItem("token");
      const bearer_token = "bearer " + JSON.parse(token);

      const response = await axios.get(
        `${API_URL}/inspection-assignments/dashboard`,
        {
          headers: {
            Authorization: bearer_token,
          },
        }
      );
      setAssignmentPendingData(response.data.data);
    } catch (error) {
      console.error(
        "Error fetching inspection assignment dashboard data:",
        error.message
      );
    }
  };

  const categoryData = [
    {
      id: 1,
      image: A,
      name: "A",
      classStyle: "line-design-A",
      color: "#7389AE",
    },
    {
      id: 2,
      image: B,
      name: "B",
      classStyle: "line-design-B",
      color: "#58A4B0",
    },
    {
      id: 3,
      image: C,
      name: "C",
      classStyle: "line-design-C",
      color: "#E0D68A",
    },
    {
      id: 4,
      image: CC,
      name: "C+",
      classStyle: "line-design-CC",
      color: "#475841",
    },
    {
      id: 5,
      image: D,
      name: "D",
      classStyle: "line-design-D",
      color: "#DC9596",
    },
  ];

  const size = {
    width: 300,
    height: 240,
    // margin: { right: 5 },
  };

  useEffect(() => {
    const fetchData = async () => {
      if (currentUser === "Jk") {
        setSelectedOption("JK");
      } else {
        setSelectedOption(currentUser);
      }
      if (selectedOption) {
        try {
          const { data } =
            selectedOption === REGRIP_SUPPLIER
              ? await axios.get(`${API_URL}/dashboard/getdata`)
              : await axios.get(
                  `${API_URL}/dashboard/getdata?suppliername=${selectedOption}`
                );

          setDashboardData(data.data);
        } catch (error) {
          console.error("Error fetching dashboard data:", error);
        }
      }
    };

    fetchData();
    getDefects();
    getAssignmentPendingDashboardData();
  }, [currentUser, selectedOption]);

  const formatDate = (date) => {
    if (date) {
      const originalDate = new Date(date);
      const formattedDate = originalDate.toLocaleDateString("en-GB");
      return formattedDate;
    }
    return;
  };

  //   notification section

  const [showNotificationPopup, setShowNotificationPopup] = useState(false);

  const [notifications, setNotifications] = useState([]);

  const [notificationCountTotal, setNotificationCountTotal] = useState(0);

  const getAllNotificationsData = async () => {
    try {
      const token = localStorage.getItem("token");
      const bearer_token = "bearer " + JSON.parse(token);
      const response = await axios.get(
        `${API_URL}/inspection-assignments/notifications`,
        {
          headers: {
            Authorization: bearer_token,
          },
        }
      );
      setNotificationCountTotal(response?.data?.data?.length);
      setNotifications(response.data.data);

      const lastOpened = localStorage.getItem("lastOpened");
      const today = new Date().toLocaleDateString();
      if (response?.data?.data?.length !== 0) {
        if (!lastOpened || lastOpened !== today) {
          setShowNotificationPopup(true);
          localStorage.setItem("lastOpened", today);
        }
      }
    } catch (error) {
      console.error("Error fetching notifications:", error.message);
    }
  };

  useEffect(() => {
    if (currentUser === "Regrip") {
      getAllNotificationsData();
    }
  }, [currentUser]);

  //   notification section

  return (
    <div className="home-container">
      {/* search */}

      <Modal
        keepMounted
        aria-labelledby="modal-title"
        aria-describedby="modal-desc"
        open={showSearchTyreModal}
        onClose={() => {
          setShowSearchTyreModal(false);
          setSendTyreData()
        }}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Sheet
          variant="plain"
          sx={{
            width: "70%",
            height: "85%",
            overflow: "scroll",
            borderRadius: "md",
            p: 3,
            boxShadow: "lg",
            position: "relative",
          }}
        >
          <ModalClose variant="plain" sx={{ m: 0 }} />
          <SearchTyreDataModal sendTyreData={sendTyreData} />
        </Sheet>
      </Modal>

      {/* search */}

      <Transition in={showNotificationPopup} timeout={400}>
        {(state) => (
          <Modal
            keepMounted
            aria-labelledby="modal-title"
            aria-describedby="modal-desc"
            // open={showNotificationPopup}
            open={!["exited", "exiting"].includes(state)}
            onClose={() => {
              setShowNotificationPopup(false);
            }}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
            slotProps={{
              backdrop: {
                sx: {
                  opacity: 0,
                  backdropFilter: "none",
                  transition: `opacity 600ms, backdrop-filter 600ms`,
                  ...{
                    entering: { opacity: 1, backdropFilter: "blur(8px)" },
                    entered: { opacity: 1, backdropFilter: "blur(8px)" },
                  }[state],
                },
              },
            }}
          >
            <Sheet
              variant="plain"
              sx={{
                width: "50%",
                height: "80%",
                maxHeight: "80%",
                minHeight: "400px",
                borderRadius: "md",
                p: 3,
                boxShadow: "lg",
                position: "relative",
                opacity: 0,
                transition: `opacity 400ms`,
                ...{
                  entering: { opacity: 1 },
                  entered: { opacity: 1 },
                }[state],
              }}
            >
              <Notification
                setShowNotificationPopup={setShowNotificationPopup}
                notifications={notifications}
                getAllNotificationsData={getAllNotificationsData}
                setNotificationCountTotal={setNotificationCountTotal}
              />
            </Sheet>
          </Modal>
        )}
      </Transition>
      {showTypeInspection && (
        <TyreInspection handleBackButton={handleBackButton} />
      )}

      {showHome && (
        <>
          <div className="header-container">
            <h1>Welcome, {userDetails_Name}</h1>
            <div className="search-container">
              <input
                type="text"
                placeholder="Enter tyre serial no."
                value={searchedOption}
                onChange={onSearch}
              />
              <div className="search-btn">
                <span style={{ marginBottom: 3 }}>Search</span>
                <img
                  src={searchIcon}
                  alt="Description"
                  style={{ width: "10px", height: "10px" }}
                />
              </div>

              {show && (
                <div className="search-result">
                  {searchResult.map((tyre) => (
                    <tr className="searchingResult">
                      <td>
                        {" "}
                        <img
                          src={`${API_URL}/upload/readimageurl?imagename=${tyre.tyre_serial_number_image_url}&folder=0`}
                          alt={""}
                          style={{
                            width: "100px",
                            height: "35px",
                            borderRadius: "15px",
                          }}
                        />
                      </td>
                      <td style={{ width: 160, fontSize: 16, fontWeight: 500 }}>
                        <span style={{ fontWeight: 400 }}>
                          {" "}
                          {tyre.tyre_serial_number.length > 12 ? (
                            `${tyre.tyre_serial_number.slice(0, 12)}...`
                          ) : (
                            <span style={{ fontWeight: 400 }}>
                              {tyre.tyre_serial_number}
                            </span>
                          )}
                        </span>
                      </td>
                      <td>
                        {" "}
                        <span>{tyre.tyre_size}</span>
                      </td>
                      <td>
                        {" "}
                        <img
                          src={line}
                          alt={""}
                          style={{ width: "3px", height: "17px" }}
                        />
                      </td>
                      <td>
                        {" "}
                        <span>
                          {tyre.fleet_name} - {tyre.fleet_branch_location}
                        </span>
                      </td>
                      <td>
                        {" "}
                        <img
                          src={line}
                          alt={""}
                          style={{ width: "3px", height: "17px" }}
                        />
                      </td>
                      <td>
                        {" "}
                        <span>{tyre.user_category_name}</span>
                      </td>
                      <td>
                        {" "}
                        <img
                          src={line}
                          alt={""}
                          style={{ width: "3px", height: "17px" }}
                        />
                      </td>
                      <td>
                        {" "}
                        <span>{formatDate(tyre.entrytime)}</span>
                      </td>
                      <td>
                        {" "}
                        <img
                          src={line}
                          alt={""}
                          style={{ width: "3px", height: "17px" }}
                        />
                      </td>

                      <td>
                        <button
                          style={{
                            border: "none",
                            backgroundColor: "transparent",
                            cursor: "pointer",
                          }}
                          onClick={() => {
                            setShowSearchTyreModal(true);
                            setSendTyreData(tyre?.tyre_serial_number);
                          }}
                          type="button"
                        >
                          <FontAwesomeIcon
                            className="download-button"
                            icon={faEye}
                            style={{ color: "#ffffff" }}
                          />
                        </button>
                      </td>

                      <td style={{ width: 70 }}>
                        <span>
                          <HomeDownloadPDF inspectionData={tyre} />
                        </span>
                      </td>
                    </tr>
                  ))}
                </div>
              )}
            </div>
          </div>
          {currentUser === "Regrip" && (
            <div
              className="notification-icons-design"
              onClick={() => {
                setShowNotificationPopup(true);
              }}
            >
              <Badge
                badgeContent={
                  notificationCountTotal ? notificationCountTotal : "0"
                }
                sx={{
                  "& .MuiBadge-badge": {
                    fontSize: 12,
                    backgroundColor: "#65A143",
                  },
                }}
              >
                <NotificationsIcon style={{ color: "#65A143" }} />
              </Badge>
            </div>
          )}
          <div
            className="content"
            style={{ marginTop: currentUser !== "Regrip" && "40px" }}
          >
            <div className="card-container">
              {/* <h1 style={{ marginTop: '24px', fontSize: '1.7vw', fontWeight: '600', marginLeft: '12px' }}>Tyre Stock</h1> */}

              <div
                className="card"
                style={{ backgroundColor: "#fff", height: "140px" }}
              >
                <h4>Tyres</h4>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "100%",
                  }}
                >
                  <div
                    style={{
                      width: currentUser !== REGRIP_SUPPLIER && "48%",
                    }}
                    className="dashboard-data"
                  >
                    <Link
                      to={"/tyre-inspection"}
                      style={{ textDecoration: "none" }}
                      onClick={() => {
                        setSelectedElement &&
                          setSelectedElement("tyre-inspection");
                      }}
                    >
                      <h3>Tyre Inspection</h3>
                      <div className="vert-line"> </div>
                      <div className="data" style={{ color: "#928fe5" }}>
                        <h5>Total</h5>
                        <span>
                          {dashboardData?.tyre_inspections_count.Total}
                        </span>
                      </div>
                    </Link>
                  </div>

                  {/* <hr style={{ height: "45px" }} /> */}
                  {currentUser === REGRIP_SUPPLIER && (
                    <div
                      onClick={() => {
                        navigate("/home/supplier");
                      }}
                      className="dashboard-data"
                    >
                      <h3>Suppliers</h3>
                      <div className="vert-line"> </div>
                      <div className="data" style={{ color: "#928fe5" }}>
                        <h5>Total</h5>
                        <span>{dashboardData?.supplier_count}</span>
                      </div>
                    </div>
                  )}
                  <div
                    onClick={() => {
                      navigate("/home/fleet");
                    }}
                    className="dashboard-data"
                    style={{
                      width: currentUser !== REGRIP_SUPPLIER && "48%",
                    }}
                  >
                    <h3>Fleets</h3>
                    <div className="vert-line"> </div>
                    <div className="data" style={{ color: "#928fe5" }}>
                      <h5>Total</h5>
                      <span>{dashboardData?.fleet_count}</span>
                    </div>
                  </div>
                </div>
              </div>

              <Link
                to={"/assignment"}
                style={{ textDecoration: "none" }}
                onClick={() => {
                  setSelectedElement && setSelectedElement("assignment");
                }}
              >
                <div
                  className="card"
                  style={{ backgroundColor: "#fff", height: "190px" }}
                >
                  <h4>Assignments Pending</h4>
                  {/* {
                                    assignmentPendingData?.map((data) => ( */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      width: "100%",
                    }}
                  >
                    <div className="dashboard-data" style={{ width: "31%" }}>
                      <h3>Approval</h3>
                      <div className="vert-line"> </div>
                      <div className="data" style={{ color: "#b98862" }}>
                        <h5>Pending</h5>
                        <span>
                          {assignmentPendingData?.inspection_approval_pending}
                        </span>
                      </div>
                      <div className="data" style={{ color: "#4f8530" }}>
                        <h5>Completed</h5>
                        <span>
                          {assignmentPendingData?.inspection_approval_completed}
                        </span>
                      </div>
                    </div>
                    <div className="dashboard-data" style={{ width: "31%" }}>
                      <h3>Invoice</h3>
                      <div className="vert-line"> </div>
                      <div className="data" style={{ color: "#b98862" }}>
                        <h5>Pending</h5>
                        <span>
                          {assignmentPendingData?.inspection_invoice_pending}
                        </span>
                      </div>
                      <div className="data" style={{ color: "#4f8530" }}>
                        <h5>Completed</h5>
                        <span>
                          {assignmentPendingData?.inspection_invoice_completed}
                        </span>
                      </div>
                    </div>
                    <div className="dashboard-data" style={{ width: "31%" }}>
                      <h3>Pickup</h3>
                      <div className="vert-line"> </div>
                      <div className="data" style={{ color: "#b98862" }}>
                        <h5>Pending</h5>
                        <span>
                          {assignmentPendingData?.inspection_lifting_pending}
                        </span>
                      </div>
                      <div className="data" style={{ color: "#4f8530" }}>
                        <h5>Completed</h5>
                        <span>
                          {assignmentPendingData?.inspection_lifting_completed}
                        </span>
                      </div>
                    </div>
                  </div>
                  {/* ))
                                } */}
                </div>
              </Link>

              {/* {currentUser === REGRIP_SUPPLIER ?
                                <div className="card" style={{ backgroundColor: '#fff', cursor: "pointer" }}>
                                    <div className="heading-text" style={{ color: '#65A143' }}>
                                        <h3 style={{ marginBottom: 10 }}>Total Supplier</h3>
                                        <span>{
                                            dashboardData && dashboardData.supplier_count
                                        }</span>

                                    </div>
                                </div>
                                :
                                <div className="card" style={{ backgroundColor: '#fff', cursor: "pointer" }}>
                                    <div className="heading-text" style={{ color: '#65A143' }}>

                                        <h3 style={{ marginBottom: 10 }}>Total Fleet</h3>

                                        <span>{dashboardData && dashboardData.fleet_count}</span>

                                    </div>
                                </div>
                            } */}

              <div
                className="card"
                style={{ backgroundColor: "#fff", gap: 10 }}
              >
                <div className="tyre-category-top">
                  <div className="tyre-category-heading">
                    <img src={tyrelogo} alt="Description" style={{}} />
                    <h2 style={{ paddingLeft: "6px" }}> Total Tyres </h2>
                  </div>
                  <h2>
                    {dashboardData &&
                      dashboardData.tyre_inspections_count.Total}
                  </h2>
                </div>

                <div className="category-container">
                  <div
                    onClick={() =>
                      handleCategoryClick(
                        1,
                        dashboardData?.tyre_inspections_count.A
                      )
                    }
                    className="dashboard-data"
                    style={{
                      width: "100%",
                      borderRadius: 100,
                      padding: "0px 20px",
                    }}
                  >
                    <div
                      className="data"
                      style={{
                        color: "#b98862",
                        justifyContent: "space-between",
                      }}
                    >
                      <h5 style={{ fontSize: "1.1vw", color: "#4f8530" }}>
                        Category A
                      </h5>
                      <span>{dashboardData?.tyre_inspections_count.A}</span>
                    </div>
                  </div>
                  <div
                    onClick={() =>
                      handleCategoryClick(
                        2,
                        dashboardData?.tyre_inspections_count.B
                      )
                    }
                    className="dashboard-data"
                    style={{
                      width: "100%",
                      borderRadius: 100,
                      padding: "0px 20px",
                    }}
                  >
                    <div
                      className="data"
                      style={{
                        color: "#b98862",
                        justifyContent: "space-between",
                      }}
                    >
                      <h5 style={{ fontSize: "1.1vw", color: "#4f8530" }}>
                        Category B
                      </h5>
                      <span>{dashboardData?.tyre_inspections_count.B}</span>
                    </div>
                  </div>
                  <div
                    onClick={() =>
                      handleCategoryClick(
                        3,
                        dashboardData?.tyre_inspections_count.C
                      )
                    }
                    className="dashboard-data"
                    style={{
                      width: "100%",
                      borderRadius: 100,
                      padding: "0px 20px",
                    }}
                  >
                    <div
                      className="data"
                      style={{
                        color: "#b98862",
                        justifyContent: "space-between",
                      }}
                    >
                      <h5 style={{ fontSize: "1.1vw", color: "#4f8530" }}>
                        Category C
                      </h5>
                      <span>{dashboardData?.tyre_inspections_count.C}</span>
                    </div>
                  </div>

                  <div
                    onClick={() =>
                      handleCategoryClick(
                        4,
                        dashboardData?.tyre_inspections_count["C+"]
                      )
                    }
                    className="dashboard-data"
                    style={{
                      width: "100%",
                      borderRadius: 100,
                      padding: "0px 20px",
                    }}
                  >
                    <div
                      className="data"
                      style={{
                        color: "#b98862",
                        justifyContent: "space-between",
                      }}
                    >
                      <h5 style={{ fontSize: "1.1vw", color: "#4f8530" }}>
                        Category C+
                      </h5>
                      <span>{dashboardData?.tyre_inspections_count["C+"]}</span>
                    </div>
                  </div>
                  <div
                    onClick={() =>
                      handleCategoryClick(
                        5,
                        dashboardData?.tyre_inspections_count.D
                      )
                    }
                    className="dashboard-data"
                    style={{
                      width: "100%",
                      borderRadius: 100,
                      padding: "0px 20px",
                    }}
                  >
                    <div
                      className="data"
                      style={{
                        color: "#b98862",
                        justifyContent: "space-between",
                      }}
                    >
                      <h5 style={{ fontSize: "1.1vw", color: "#4f8530" }}>
                        Category D
                      </h5>
                      <span>{dashboardData?.tyre_inspections_count.D}</span>
                    </div>
                  </div>
                </div>
                <div className="category-container">
                  {/* <PieChart
                                        slotProps={{
                                            legend: {
                                                direction: 'row',
                                                position: { vertical: 'bottom', horizontal: 'middle', },
                                                padding: 10,
                                                hidden: true,
                                            },

                                        }}
                                        series={[

                                            {

                                                // arcLabel: (item) => `${item.label} $ ${item.value}`,
                                                arcLabel: (item) => (
                                                    <>
                                                        <tspan style={{ fontSize: '16px', fontWeight: "normal" }}>{item.label}</tspan>{" "}
                                                        <tspan style={{ fontSize: '20px', fontWeight: "600" }}>{item.value}</tspan>
                                                    </>
                                                ),
                                                arcLabelMinAngle: 35,
                                                data: categoryData?.map(category => ({
                                                    label: category.name,
                                                    value: dashboardData ? dashboardData.tyre_inspections_count[category.name] : 0,
                                                    color: category.color,
                                                })),
                                                cx: 140,
                                                cy: 115,
                                                // highlightScope: {faded: 'global', highlighted: 'item' },
                                                // faded: {innerRadius: 30, additionalRadius: -30, color: 'gray' },
                                            },
                                        ]}

                                        sx={{
                                            [`& .${pieArcLabelClasses.root}`]: {
                                                fill: 'white',
                                                fontWeight: 'normal',
                                            },
                                            '& path:hover': {
                                                transform: 'scale(1.1)',
                                                transition: 'transform 0.2s ease-in-out',
                                                zIndex: 1,
                                            },

                                        }}
                                        onClick={(event, item) => {
                                            const clickedDataPoint = categoryData[item?.dataIndex];
                                            const categoryId = clickedDataPoint?.id;
                                            const totalCount = dashboardData ? dashboardData.tyre_inspections_count[categoryId] : 0;
                                            handleCategoryClick(categoryId, totalCount);
                                        }}

                                        {...size}
                                    /> */}

                  {/* <div style={{width:'100%'}} onClick={(event) => {
                                        if (event.target.tagName === 'rect') {
                                            const barIndex = Array.from(event.target.parentNode.children).indexOf(event.target);
                                            const totalCount =
                                                barIndex === 0 ? dashboardData?.tyre_inspections_count.A :
                                                    barIndex === 1 ? dashboardData?.tyre_inspections_count.B :
                                                        barIndex === 2 ? dashboardData?.tyre_inspections_count.C :
                                                            barIndex === 3 ? dashboardData?.tyre_inspections_count['C+'] : dashboardData?.tyre_inspections_count.D
                                            // handleCategoryClick(barIndex+1, totalCount);
                                            console.log(totalCount)
                                        }
                                    }}>
                                        <BarChart
                                            xAxis={[{ scaleType: 'band', data: ['A', 'B', 'C', 'C+', 'D'] }]}
                                            series={[{
                                                data: [
                                                    dashboardData?.tyre_inspections_count.A,
                                                    dashboardData?.tyre_inspections_count.B,
                                                    dashboardData?.tyre_inspections_count.C,
                                                    dashboardData?.tyre_inspections_count['C+'],
                                                    dashboardData?.tyre_inspections_count.D
                                                ],
                                                color: ['#85E3FF', '#B5B9FF']
                                            }]}
                                            height={300}
                                            // width={300}
                                        />
                                    </div> */}
                </div>
              </div>
            </div>
            <div className="right-container">
              <HomeAssignment />
              {/* <PendingInspection />
                            <RecentInspection /> */}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
