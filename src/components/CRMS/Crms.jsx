import React, { useEffect, useRef, useState } from "react";
import "./Crms.css";
import "./Crms.css";
import { API_URL } from "../Config/index";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import ReassignLeadModal from "./OpenLeads/ReassignLeadModal.jsx/ReassignLeadModal";
import LeadsDetailModal from "./OpenLeads/LeadsDetailModal/LeadsDetailModal";
import Modal from "@mui/joy/Modal";
import ModalClose from "@mui/joy/ModalClose";
import Sheet from "@mui/joy/Sheet";
import { Autocomplete, Table } from "@mui/joy";
import { Player, Controls } from "@lottiefiles/react-lottie-player";
import customer from "../../lotties/customer.json";
import sales from "../../lotties/sales.json";
import analyticsJson from "../../lotties/analytics.json";
import Orders from "./Orders/Orders";
import { REGRIP_SUPPLIER } from "../../redux/constants/Constant";
import GenerateLead from "./GenerateLead/GenerateLead";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
// import sales from '../../lotties/sales.json'

const Crms = () => {
  const [loading, setLoading] = useState(true);
  const [loaderData, setLoaderData] = useState(false);
  const [loaderDataForOrder, setLoaderDataForOrder] = useState(false);
  const [loaderDataForOpen, setLoaderDataForOpen] = useState(false);
  const [loaderDataForClose, setLoaderDataForClose] = useState(false);

  const [selectedLead, setSelectedLead] = useState();

  const [showReassignLeadModal, setShowReassignLeadModal] = useState(false);
  const [customerData, setCustomerData] = useState([]);
  const [openAssign, setOpenAssign] = useState(false);
  const navigate = useNavigate();

  const [leadsOpenData, setLeadsOpenData] = useState([]);
  const [leadsCloseData, setLeadsCloseData] = useState([]);
  const [leadsOtherData, setLeadsOtherData] = useState([]);
  const [ordersData, setOrdersData] = useState([]);
  const [leadsListVisible, setLeadsListVisible] = useState(true);
  const [showCRMSComponent, setShowCRMSComponent] = useState(true);

  const [salespersonData, setSalespersonData] = useState([]);
  const [selectedSalesPerson, setSelectedSalesPerson] = useState(null);

  const [salespersonValid, setSalesPersonValid] = useState(false);

  const [shareOpenLeadsData, setShareOpenLeadsData] = useState();
  const [shareCloseLeadsData, setShareCloseLeadsData] = useState();
  const [shareOtherLeadsData, setShareOtherLeadsData] = useState();

  const [shareOrdersData, setShareOrdersData] = useState();
  const currentUser = useSelector((state) => state.getCurrentUser.role_name);

  const [openlead, setOpenLead] = useState(false);
  const [closelead, setCloseLead] = useState(false);
  const [otherlead, setOtherLead] = useState(false);
  const [openOrders, setOpenOrders] = useState(false);
  const [generateLeadModal, setGenerateLeadModal] = useState(false);

  const onOpenLeadsclickhandle = () => {
    setOpenLead(true);
  };

  const onCloseLeadsclickhandle = () => {
    setCloseLead(true);
  };

  const onOpenOrdersclickhandle = () => {
    setOpenOrders(true);
  };

  // const openGenerateLeadModal = () => {
  //   setGenerateLeadModal(true)
  // };

  const handleReAssignLeadButton = (data) => {
    setOpenAssign(true);
    setSelectedLead(data);
  };

  const handlePopupClose = () => {
    getOpenLeads("open");
    getOpenLeads("close");
    getOtherLeads();
  };

  useEffect(() => {
    if (currentUser && REGRIP_SUPPLIER) {
      if (currentUser !== REGRIP_SUPPLIER) {
        navigate("/home");
      }
    }
  }, [currentUser]);

  // getColor
  const getStatusClass = (status) => {
    switch (status) {
      case "Hot":
        return "status-show-hot";
      case "Warm":
        return "status-show-warm";
      case "Cold":
        return "status-show-cold";
      case "Order Generated":
        return "status-show-order-generated";
      default:
        return "status-show";
    }
  };

  const getAllSalesPerson = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/employee/sales-employees`);
      setLoading(false);
      setSalespersonData(data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  //  ---- others lead start --- //

  const [currentPage, setCurrentPage] = useState(1);
  const [allDataLoaded, setAllDataLoaded] = useState(false);
  const itemsPerPage = 20;
  const otherLeadsRef = useRef(null);

  const getOtherLeads = async () => {
    try {
      setLoaderData(true);
      const { data } = await axios.get(
        `${API_URL}/lead/leads/other-leads?page=${currentPage}&page_size=${itemsPerPage}`
      );
      if (data.data.length === 0) {
        setAllDataLoaded(true);
        setLoaderData(false);
      } else {
        setLeadsOtherData((prevData) => [...prevData, ...data.data]);
        setLoaderData(false);
      }
    } catch (e) {
      console.log("Error while fetching data:", e.message);
      setLoaderData(false);
    }
  };

  const handleScroll = () => {
    if (!allDataLoaded && otherLeadsRef.current) {
      const scrollY = otherLeadsRef.current.scrollTop;
      const windowHeight = otherLeadsRef.current.clientHeight;
      const documentHeight = otherLeadsRef.current.scrollHeight;
      if (scrollY + windowHeight >= documentHeight - 100) {
        setCurrentPage(currentPage + 1);
      }
    }
  };

  useEffect(() => {
    if (otherLeadsRef.current) {
      otherLeadsRef.current.addEventListener("scroll", handleScroll);
      return () => {
        if (otherLeadsRef.current) {
          otherLeadsRef.current.removeEventListener("scroll", handleScroll);
        }
      };
    }
  }, [currentPage, allDataLoaded]);

  //  ---- others lead end --- //

  //  --- open and close lead start --- //
  const [currentPageForOpen, setCurrentPageForOpen] = useState(1);
  const [allDataLoadedForOpen, setAllDataLoadedForOpen] = useState(false);
  const itemsPerPageForOpen = 20;
  const forOpenLeadsRef = useRef(null);

  const [currentPageForClose, setCurrentPageForClose] = useState(1);
  const [allDataLoadedForClose, setAllDataLoadedForClose] = useState(false);
  const itemsPerPageForClose = 20;
  const forCloseLeadsRef = useRef(null);

  const getOpenLeads = async (type) => {
    try {
      // setLoaderData(true);

      if (type === "open") {
        setLoaderDataForOpen(true);
      } else if (type === "close") {
        setLoaderDataForClose(true);
      }
      const { data } = await axios.get(
        `${API_URL}/lead/leads?type=${type}&page=${
          type === "open" ? currentPageForOpen : currentPageForClose
        }&page_size=${
          type === "open" ? itemsPerPageForOpen : itemsPerPageForClose
        }`
      );
      if (type === "open") {
        // setLeadsOpenData(data.data);
        if (data.data.length === 0) {
          setAllDataLoadedForOpen(true);
          setLoaderDataForOpen(false);
        } else {
          setLeadsOpenData((prevData) => [...prevData, ...data.data]);
          setLoaderDataForOpen(false);
        }
      } else if (type === "close") {
        // setLeadsCloseData(data.data);

        if (data.data.length === 0) {
          setAllDataLoadedForClose(true);
          setLoaderDataForClose(false);
        } else {
          setLeadsCloseData((prevData) => [...prevData, ...data.data]);
          setLoaderDataForClose(false);
        }
      }
      // setLoaderData(false);
    } catch (e) {
      console.log("Error while fetching data:", e.message);
      // setLoaderData(false);
    }
  };

  const handleScrollForOpen = () => {
    if (!allDataLoadedForOpen && forOpenLeadsRef.current) {
      const scrollY = forOpenLeadsRef.current.scrollTop;
      const windowHeight = forOpenLeadsRef.current.clientHeight;
      const documentHeight = forOpenLeadsRef.current.scrollHeight;
      if (scrollY + windowHeight >= documentHeight - 100) {
        setCurrentPageForOpen(currentPageForOpen + 1);
      }
    }
  };

  useEffect(() => {
    if (forOpenLeadsRef.current) {
      forOpenLeadsRef.current.addEventListener("scroll", handleScrollForOpen);
      return () => {
        if (forOpenLeadsRef.current) {
          forOpenLeadsRef.current.removeEventListener(
            "scroll",
            handleScrollForOpen
          );
        }
      };
    }
  }, [currentPageForOpen, allDataLoadedForOpen]);

  const handleScrollForClose = () => {
    if (!allDataLoadedForClose && forCloseLeadsRef.current) {
      const scrollY = forCloseLeadsRef.current.scrollTop;
      const windowHeight = forCloseLeadsRef.current.clientHeight;
      const documentHeight = forCloseLeadsRef.current.scrollHeight;
      if (scrollY + windowHeight >= documentHeight - 100) {
        setCurrentPageForClose(currentPageForClose + 1);
      }
    }
  };

  useEffect(() => {
    if (forCloseLeadsRef.current) {
      forCloseLeadsRef.current.addEventListener("scroll", handleScrollForClose);
      return () => {
        if (forCloseLeadsRef.current) {
          forCloseLeadsRef.current.removeEventListener(
            "scroll",
            handleScrollForClose
          );
        }
      };
    }
  }, [currentPageForClose, allDataLoadedForClose]);

  //  --- open and close lead end --- //

  const [currentPageForOrder, setCurrentPageForOrder] = useState(1);
  const [allDataLoadedForOrder, setAllDataLoadedForOrder] = useState(false);
  const itemsPerPageForOrder = 20;
  const forOrderLeadsRef = useRef(null);

  const getOrders = async (type) => {
    try {
      setLoaderDataForOrder(true);
      const { data } = await axios.get(
        `${API_URL}/orders?page=${currentPageForOrder}&page_size=${itemsPerPageForOrder}`
      );
      if (data.data.length === 0) {
        setAllDataLoadedForOrder(true);
        setLoaderDataForOrder(false);
      } else {
        setOrdersData((prevData) => [...prevData, ...data.data]);
        setLoaderDataForOrder(false);
      }
      // setOrdersData(data.data);
      // setLoading(false);
    } catch (e) {
      console.log("Error while fetching data:", e.message);
      setLoaderData(false);
    }
  };

  const handleScrollForOrder = () => {
    if (!allDataLoadedForOrder && forOrderLeadsRef.current) {
      const scrollY = forOrderLeadsRef.current.scrollTop;
      const windowHeight = forOrderLeadsRef.current.clientHeight;
      const documentHeight = forOrderLeadsRef.current.scrollHeight;
      if (scrollY + windowHeight >= documentHeight - 100) {
        setCurrentPageForOrder(currentPageForOrder + 1);
      }
    }
  };

  useEffect(() => {
    if (forOrderLeadsRef.current) {
      forOrderLeadsRef.current.addEventListener("scroll", handleScrollForOrder);
      return () => {
        if (forOrderLeadsRef.current) {
          forOrderLeadsRef.current.removeEventListener(
            "scroll",
            handleScrollForOrder
          );
        }
      };
    }
  }, [currentPageForOrder, allDataLoadedForOrder]);

  const handleOkButton = () => {
    if (selectedSalesPerson) {
      setGenerateLeadModal(true);
      setSalesPersonValid(false);
    } else {
      alert("Please select a salesperson");
    }
  };

  const checkLocalStorage = () => {
    const storedSalesPerson = JSON.parse(
      localStorage.getItem("selectedSalesPerson")
    );
    if (storedSalesPerson) {
      setSelectedSalesPerson(storedSalesPerson);
      setGenerateLeadModal(true);
    } else {
      setSalesPersonValid(true);
      setGenerateLeadModal(false);
      setSelectedSalesPerson(null);
    }
  };

  const onClose = (message) => {
    getOpenLeads("open");
    getOpenLeads("close");
    getOtherLeads();
    getOrders();
    toast.success("Lead created successfully", {
      position: toast.POSITION.TOP_CENTER,
      autoClose: 2000,
    });
  };
  const openGenerateLeadModal = () => {
    checkLocalStorage();
  };

  useEffect(() => {
    getAllSalesPerson();
    // getOpenLeads("open");
    // getOpenLeads("close");
    getOtherLeads();
    // getOrders();
  }, [currentPage]);

  useEffect(() => {
    getOpenLeads("open");
  }, [currentPageForOpen]);

  useEffect(() => {
    getOpenLeads("close");
  }, [currentPageForClose]);

  useEffect(() => {
    getOrders();
  }, [currentPageForOrder]);
  // useEffect(() => {
  //   localStorage.setItem('selectedSalesPerson', JSON.stringify(selectedSalesPerson));
  // }, [selectedSalesPerson]);

  return (
    <div className="" style={{ width: "100%", height: "100vh" }}>
      <ToastContainer className="custom-toast-container" />

      {showCRMSComponent && (
        <div
          style={{
            height: "100%",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div className="icons-design">
            <div
              className="icon-specific-design"
              onClick={() => {
                // handleShowCustomer();
                navigate("/crms/customer")
              }}
            >
              <Player
                autoplay
                loop={false}
                keepLastFrame={true}
                src={customer}
                style={{ height: "70px", width: "70px" }}
              >
                <Controls buttons={["repeat", "frame", "debug"]} />
              </Player>
              <h5>Customer</h5>
            </div>
            <div
              className="icon-specific-design"
              onClick={() => {
                navigate('/crms/reports');
              }}
            >
              <Player
                autoplay
                loop={false}
                keepLastFrame={true}
                src={sales}
                style={{ height: "70px", width: "70px" }}
              >
                <Controls buttons={["repeat", "frame", "debug"]} />
              </Player>
              <h5>Reports</h5>
            </div>

            <div
              className="icon-specific-design"
              onClick={() => {
                navigate('/crms/analytics')
              }}
            >
              <Player
                autoplay
                loop={false}
                keepLastFrame={true}
                src={analyticsJson}
                style={{ height: "70px", width: "70px" }}
              >
                <Controls buttons={["repeat", "frame", "debug"]} />
              </Player>
              <h5>Analytics</h5>
            </div>

            <Modal
              aria-labelledby="modal-title"
              aria-describedby="modal-desc"
              open={salespersonValid}
              onClose={() => {
                setSalesPersonValid(false);
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
                  width: "30%",
                  height: "30%",
                  borderRadius: "md",
                  p: 3,
                  boxShadow: "lg",
                  position: "relative",
                }}
              >
                <ModalClose variant="plain" sx={{ m: 0 }} />
                <div className="salesperson-modal">
                  <h4>Select Sales Person to assign default lead </h4>
                  <Autocomplete
                    className="reports-filter-selectors"
                    placeholder="Sales Person"
                    options={salespersonData.map((salesperson, index) => ({
                      label: salesperson.first_name,
                      value: salesperson.employee_id,
                      key: `salesperson_${salesperson.employee_id}`,
                    }))}
                    value={selectedSalesPerson}
                    onChange={(event, newValue) => {
                      setSelectedSalesPerson(newValue);
                      localStorage.setItem(
                        "selectedSalesPerson",
                        JSON.stringify(newValue)
                      );
                    }}
                  />
                  <button
                    className="selectBtn"
                    onClick={() => handleOkButton()}
                  >
                    Select
                  </button>
                </div>
              </Sheet>
            </Modal>

            <Modal
              aria-labelledby="modal-title"
              aria-describedby="modal-desc"
              open={generateLeadModal}
              onClose={() => {
                setGenerateLeadModal(false);
                getOpenLeads("open");
                getOpenLeads("close");
                getOtherLeads();
                getOrders();
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
                  width: "1240px",
                  height: "85vh",
                  maxHeight: "600px",
                  borderRadius: "md",
                  p: 3,
                  boxShadow: "lg",
                  position: "relative",
                }}
              >
                <ModalClose variant="plain" sx={{ m: -1 }} />
                <GenerateLead
                  onClose={onClose}
                  setGenerateLeadModal={setGenerateLeadModal}
                />
              </Sheet>
            </Modal>

            <button
              className="lead-generate-button"
              onClick={() => openGenerateLeadModal()}
            >
              Lead Generate
            </button>
          </div>
          <div className="crmsContainer" style={{ display: "flex" }}>
            <Modal
              aria-labelledby="modal-title"
              aria-describedby="modal-desc"
              open={openAssign}
              onClose={() => setOpenAssign(false)}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Sheet
                variant="plain"
                sx={{
                  width: "400px",
                  height: "360px",
                  borderRadius: "md",
                  p: 3,
                  boxShadow: "lg",
                  position: "relative",
                }}
              >
                <ModalClose variant="plain" sx={{ m: 0 }} />
                <ReassignLeadModal
                  setOpenAssign={setOpenAssign}
                  setShowReassignLeadModal={setShowReassignLeadModal}
                  selectedLead={selectedLead}
                  getOpenLeads={getOpenLeads}
                />
              </Sheet>
            </Modal>

            {/* open leads */}
            <div className="Crms-list-card">
              <h3 className="crms-list-header">Open</h3>
              <div className="open-leads-main" ref={forOpenLeadsRef}>
                <Modal
                  aria-labelledby="modal-title"
                  aria-descPribedby="modal-desc"
                  open={openlead}
                  onClose={() => setOpenLead(false)}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Sheet
                    variant="plain"
                    sx={{
                      width: "80%",
                      height: "fit-content",
                      borderRadius: "md",
                      p: 3,
                      boxShadow: "lg",
                      position: "relative",
                    }}
                  >
                    <ModalClose variant="plain" sx={{ m: 0 }} />
                    <LeadsDetailModal leadData={shareOpenLeadsData} />
                  </Sheet>
                </Modal>

                {leadsOpenData.map((openleads, i) => {
                  const conversations = openleads?.conversation?.substring(
                    0,
                    30
                  );
                  return (
                    <>
                      {openleads.is_open === true && (
                        <div className="margin-line-close-open">
                          <div
                            className="openLeads-container"
                            key={openleads.lead_id}
                            onClick={() => {
                              onOpenLeadsclickhandle();
                              setShareOpenLeadsData(openleads);
                            }}
                          >
                            <div>
                              <h5 className="headingleads">
                                {openleads.customer_name} -{" "}
                                {openleads.meeting_person_name}
                              </h5>
                            </div>

                            <div className="types-design">
                              <div style={{ display: "flex" }}>
                                <h6 className="date-design">
                                  {new Date(
                                    openleads.meeting_time
                                  ).toLocaleDateString("en-IN")}{" "}
                                  -&nbsp;{" "}
                                </h6>
                                <h6
                                  style={{
                                    fontWeight: "normal",
                                    color: "#000",
                                  }}
                                >
                                  {openleads.visit_type}
                                </h6>
                              </div>
                              {openleads.sales_person_name && (
                                <div>
                                  <h6
                                    style={{
                                      fontWeight: "normal",
                                      color: "#000",
                                    }}
                                  >
                                    {openleads.sales_person_name}
                                  </h6>
                                </div>
                              )}

                              <h6
                                className={getStatusClass(
                                  openleads?.lead_status
                                )}
                              >
                                {openleads?.lead_status}
                              </h6>
                            </div>

                            <div className="conversation-design">
                              <p>
                                {conversations?.length >= 30
                                  ? `${conversations}...`
                                  : conversations}
                              </p>
                            </div>

                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                              }}
                            >
                              <div className="category-design">
                                {openleads.product_category !== "null" && (
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "4px",
                                    }}
                                  >
                                    <div>
                                      {openleads.product_category === null
                                        ? ""
                                        : openleads.product_category
                                            .slice(0, 1)
                                            .map((cheap) => (
                                              <button className="cheaps-styleout">
                                                {cheap.name}
                                              </button>
                                            ))}
                                    </div>
                                    {openleads.product_category &&
                                      openleads.product_category.length > 1 && (
                                        <span className="more-status">
                                          +
                                          {openleads.product_category.length -
                                            1}{" "}
                                          more
                                        </span>
                                      )}
                                  </div>
                                )}
                              </div>

                              <button
                                className="reasign-btn"
                                style={{ fontSize: "10px" }}
                                onClick={(event) => {
                                  event.stopPropagation();
                                  handleReAssignLeadButton(openleads);
                                }}
                              >
                                Assign Lead
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  );
                })}
                {loaderDataForOpen && (
                  <div className="bouncing-loader">
                    <div></div>
                    <div></div>
                    <div></div>
                  </div>
                )}
              </div>
            </div>

            {/* close leads */}
            <div className="Crms-list-card">
              <h3 className="crms-list-header">Close</h3>
              <div className="open-leads-main" ref={forCloseLeadsRef}>
                <Modal
                  aria-labelledby="modal-title"
                  aria-describedby="modal-desc"
                  open={closelead}
                  onClose={() => setCloseLead(false)}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Sheet
                    variant="plain"
                    sx={{
                      width: "80%",
                      height: "fit-content",
                      maxHeight: "80%",
                      borderRadius: "md",
                      p: 3,
                      boxShadow: "lg",
                    }}
                  >
                    <ModalClose variant="plain" sx={{ m: 0 }} />
                    <LeadsDetailModal leadData={shareCloseLeadsData} />
                  </Sheet>
                </Modal>
                {leadsCloseData.map((closeleads, i) => {
                  const conversations = closeleads?.conversation?.substring(
                    0,
                    30
                  );
                  return (
                    <>
                      {closeleads.is_open === false && (
                        <div className="margin-line-close-open">
                          <div
                            className="openLeads-container"
                            key={closeleads.lead_id}
                            onClick={() => {
                              onCloseLeadsclickhandle();
                              setShareCloseLeadsData(closeleads);
                            }}
                          >
                            <div>
                              <h5 className="headingleads">
                                {closeleads.customer_name} -{" "}
                                {closeleads.meeting_person_name}
                              </h5>
                            </div>

                            <div className="types-design">
                              <div style={{ display: "flex" }}>
                                <h6 className="">
                                  {new Date(
                                    closeleads.meeting_time
                                  ).toLocaleDateString("en-IN")}{" "}
                                  -&nbsp;{" "}
                                </h6>
                                <h6
                                  style={{
                                    fontWeight: "normal",
                                    color: "#000",
                                  }}
                                >
                                  {closeleads.visit_type}
                                </h6>
                              </div>
                              <div>
                                <h6
                                  style={{
                                    fontWeight: "normal",
                                    color: "#000",
                                  }}
                                >
                                  {closeleads.sales_person_name}
                                </h6>
                              </div>
                              <h6
                                className={getStatusClass(
                                  closeleads?.lead_status
                                )}
                              >
                                {closeleads.lead_status}
                              </h6>
                            </div>

                            <div className="conversation-design">
                              <p>
                                {conversations?.length >= 30
                                  ? `${conversations}...`
                                  : conversations}
                              </p>
                            </div>

                            <div className="category-design">
                              {closeleads.product_category !== "null" && (
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "4px",
                                  }}
                                >
                                  {closeleads.product_category === null
                                    ? ""
                                    : closeleads.product_category
                                        .slice(0, 1)
                                        .map((cheap) => (
                                          <button className="cheaps-styleout">
                                            {cheap.name}
                                          </button>
                                        ))}
                                  {closeleads.product_category &&
                                    closeleads.product_category.length > 1 && (
                                      <span className="more-status">
                                        +
                                        {closeleads.product_category.length - 1}{" "}
                                        more
                                      </span>
                                    )}
                                </div>
                              )}
                            </div>
                            {closeleads.is_open === "false" && (
                              <button
                                className="reasign-btn"
                                style={{ marginLeft: "12px" }}
                                onClick={(event) => {
                                  event.stopPropagation();
                                  handleReAssignLeadButton(closeleads);
                                }}
                              >
                                ReAssign
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </>
                  );
                })}
                {loaderDataForClose && (
                  <div className="bouncing-loader">
                    <div></div>
                    <div></div>
                    <div></div>
                  </div>
                )}
              </div>
            </div>

            {/* close leads */}
            <div className="Crms-list-card">
              <h3 className="crms-list-header">Others</h3>
              <div className="open-leads-main" ref={otherLeadsRef}>
                <Modal
                  aria-labelledby="modal-title"
                  aria-describedby="modal-desc"
                  open={otherlead}
                  onClose={() => setOtherLead(false)}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Sheet
                    variant="plain"
                    sx={{
                      width: "80%",
                      height: "fit-content",
                      maxHeight: "80%",
                      borderRadius: "md",
                      p: 3,
                      boxShadow: "lg",
                    }}
                  >
                    <ModalClose variant="plain" sx={{ m: 0 }} />
                    <LeadsDetailModal leadData={shareOtherLeadsData} />
                  </Sheet>
                </Modal>

                {leadsOtherData.map((otherleads, i) => {
                  const conversations = otherleads.conversation.substring(
                    0,
                    30
                  );
                  return (
                    <>
                      {otherleads.is_open === false && (
                        <div
                          className="margin-line-close-open"
                        >
                          <div
                            className="openLeads-container"
                            key={otherleads.lead_id}
                            onClick={() => {
                              setOtherLead(true);
                              setShareOtherLeadsData(otherleads);
                            }}
                          >
                            <div>
                              <h5 className="headingleads">
                                {otherleads.customer_name} -{" "}
                                {otherleads.meeting_person_name}
                              </h5>
                            </div>

                            <div className="types-design">
                              <div style={{ display: "flex" }}>
                                <h6 className="">
                                  {new Date(
                                    otherleads.meeting_time
                                  ).toLocaleDateString("en-IN")}{" "}
                                  -&nbsp;{" "}
                                </h6>
                                <h6
                                  style={{
                                    fontWeight: "normal",
                                    color: "#000",
                                  }}
                                >
                                  {otherleads.visit_type}
                                </h6>
                              </div>
                              <div>
                                <h6
                                  style={{
                                    fontWeight: "normal",
                                    color: "#000",
                                  }}
                                >
                                  {otherleads.sales_person_name}
                                </h6>
                              </div>
                              <h6
                                className={getStatusClass(
                                  otherleads?.lead_status
                                )}
                              >
                                {otherleads.lead_status}
                              </h6>
                            </div>

                            <div className="conversation-design">
                              <p>
                                {conversations.length >= 30
                                  ? `${conversations}...`
                                  : conversations}
                              </p>
                            </div>

                            <div className="category-design">
                              {otherleads.product_category !== "null" && (
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "4px",
                                  }}
                                >
                                  {otherleads.product_category === null
                                    ? ""
                                    : otherleads.product_category
                                        .slice(0, 1)
                                        .map((cheap) => (
                                          <button className="cheaps-styleout">
                                            {cheap.name}
                                          </button>
                                        ))}
                                  {otherleads.product_category &&
                                    otherleads.product_category.length > 1 && (
                                      <span className="more-status">
                                        +
                                        {otherleads.product_category.length - 1}{" "}
                                        more
                                      </span>
                                    )}
                                </div>
                              )}
                            </div>
                            {otherleads.is_open === "false" && (
                              <button
                                className="reasign-btn"
                                style={{ marginLeft: "12px" }}
                                onClick={(event) => {
                                  event.stopPropagation();
                                  handleReAssignLeadButton(otherleads);
                                }}
                              >
                                ReAssign
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </>
                  );
                })}

                {loaderData && (
                  <div className="bouncing-loader">
                    <div></div>
                    <div></div>
                    <div></div>
                  </div>
                )}
              </div>
            </div>

            {/* orders */}
            <div className="Crms-list-card">
              <h3 className="crms-list-header">Orders</h3>
              <div className="open-leads-main" ref={forOrderLeadsRef}>
                <Modal
                  aria-labelledby="modal-title"
                  aria-describedby="modal-desc"
                  open={openOrders}
                  onClose={() => setOpenOrders(false)}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Sheet
                    variant="plain"
                    sx={{
                      width: "80%",
                      height: "fit-content",
                      maxHeight: "80%",
                      borderRadius: "md",
                      p: 3,
                      boxShadow: "lg",
                      position: "relative",
                    }}
                  >
                    <ModalClose variant="plain" sx={{ m: 0 }} />
                    <Orders orderData={shareOrdersData} />
                  </Sheet>
                </Modal>
                {ordersData.map((order) => {
                  return (
                    <>
                      <div
                        onClick={() => {
                          onOpenOrdersclickhandle();
                          setShareOrdersData(order);
                        }}
                        className="margin-line-order"
                      >
                        <div className="openLeads-container">
                          <div className="order-design">
                            <div style={{ display: "flex" }}>
                              <h5 className="headingleads">
                                {order.customer_name}, {order.branch}
                              </h5>
                            </div>
                            <div>
                              <h6 className="">
                                {new Date(order.created_at).toLocaleDateString(
                                  "en-IN"
                                )}
                              </h6>
                            </div>
                          </div>

                          <div>
                            <h6 className="" style={{ marginBottom: "8px" }}>
                              Sales Person:{" "}
                              <span
                                style={{ fontWeight: "normal", color: "#000" }}
                              >
                                {order.sales_person_name}
                              </span>
                            </h6>
                          </div>
                          <div>
                            <h6 className="">
                              Total SKU :{" "}
                              <span
                                style={{ fontWeight: "normal", color: "#000" }}
                              >
                                {order?.order_data?.filter((item) => item?.SKU)
                                  ?.length > 0
                                  ? (() => {
                                      const uniqueSKUs = new Set();
                                      order?.order_data?.forEach((item) => {
                                        if (item?.SKU)
                                          uniqueSKUs?.add(item?.SKU);
                                      });

                                      return uniqueSKUs?.size;
                                    })()
                                  : ""}
                              </span>
                            </h6>
                          </div>

                          <div>
                            <h6 className="">
                              Total Tyres :{" "}
                              <span
                                style={{ fontWeight: "normal", color: "#000" }}
                              >
                                {order?.order_data?.filter((item) => item?.SKU)
                                  ?.length > 0
                                  ? order.order_data
                                      ?.filter((item) => item?.SKU)
                                      ?.reduce(
                                        (total, item) => total + item?.Quantity,
                                        0
                                      )
                                  : order?.order_data?.length === 1
                                  ? order?.order_data[0]?.Quantity
                                  : order?.order_data?.reduce(
                                      (total, item) => total + item?.Quantity,
                                      0
                                    )}
                              </span>
                            </h6>
                          </div>
                        </div>
                      </div>
                    </>
                  );
                })}
                {loaderDataForOrder && (
                  <div className="bouncing-loader">
                    <div></div>
                    <div></div>
                    <div></div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Crms;
