import { useEffect, useState } from "react";
import "./HomeAssignment.css";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import axios from "axios";
import { API_URL } from "../../Config";
import { useSelector } from "react-redux";
import nodata from "../../../lotties/nodata1.json";
import { Controls, Player } from "@lottiefiles/react-lottie-player";
import GenerateRequest from "../../GenerateRequest/GenerateRequest.jsx";
import Modal from "@mui/joy/Modal";
import { useNavigate } from "react-router-dom";
import ModalClose from "@mui/joy/ModalClose";
import Sheet from "@mui/joy/Sheet";
import { REGRIP_ROLE_ID } from "../../../redux/constants/Constant.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileExcel, faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import GenerateRequestExcel from "../GenerateRequestExcel/GenerateRequestExcel.jsx";
import UploadedExcelModal from "../../Assignment/UploadedExcelModal/UploadedExcelModal.jsx";
import { Box, Tab, Tabs } from "@mui/material";
import AssignInspection from "../PendingInspection/AssignInspection.jsx/AssignInspection.jsx";
import AssignmentRequestModal from "../AssignmentRequestModal/AssignmentRequestModal.jsx";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../../common/common.css";

const HomeAssignment = () => {
  const [generateRequestModal, setGenerateRequestModal] = useState(false);
  const currentUser = useSelector((state) => state.getCurrentUser.role_name);
  const currentUserId = useSelector((state) => state.getCurrentUser.role_id);
  const dummmyArray = [1, 2, 3, 4, 5];
  const [loading, setLoading] = useState(true);
  const [pendingInspections, setPendingInspections] = useState([]);
  const [showAssignmentRequestModal, setShowAssignmentRequestModal] =
    useState(false);
  const [selectedInspectionAssignment, setSelectedInspectionAssignment] =
    useState();
  const [openAssign, setOpenAssign] = useState(false);
  const [showInitiateBillingModal, setShowInitiateBillingModal] =
    useState(false);

  const [showUploadedExcelModal, setShowUploadedExcelModal] = useState(false);

  const navigate = useNavigate();

  const [tabValue, setTabValue] = useState("pending_request");

  const [inspectorData, setInspectorData] = useState();

  const handlePopupClose = () => {
    getInspections();
  };

  const getInspections = async () => {
    try {
      let status;
      let type;
      if (tabValue === "pending_request") {
        status = "pending";
        type = "inspection";
      } else if (tabValue === "completed_inspection") {
        status = "completed";
        type = "inspection";
      } else if (tabValue === "pending_billing") {
        status = "pending";
        type = "invoice";
      } else if (tabValue === "completed_asssignemnt") {
        status = "completed";
        type = "assignment";
      }
      const token = localStorage.getItem("token");
      if (!token) navigate("/");
      const bearer_token = "bearer " + JSON.parse(token);

      setLoading(true);
      const { data } = await axios.get(`${API_URL}/inspection-assignments`, {
        headers: {
          Authorization: bearer_token,
        },
        params: {
          status: status,
          type: type,
        },
      });
      // const fleets = data.rows;
      setLoading(false);
      setPendingInspections(data.data);
    } catch (e) {
      console.log("Error while fetching data:", e.message);
    }
  };

  const initiateBilling = async (event) => {
    const data = {
      tyre_inspection_assignment_id:
        selectedInspectionAssignment.tyre_inspection_assignment_id,
    };

    try {
      const result = await axios.patch(
        `${API_URL}/inspection-assignments/initiate-invoice`,
        data
      );
      if (result) {
        getInspections();
        setShowInitiateBillingModal(false);
      }
    } catch (error) {
      if (error.response) {
        toast.error("oops! Something Went Wrong.", {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 8000,
        });
      } else {
        console.error("Failed to Update", error);
      }
    }
  };

  useEffect(() => {
    getInspections();
  }, [tabValue]);



  return (
    <div className="home-assignment">
      <ToastContainer className="custom-toast-container" />

      <Modal
        aria-labelledby="modal-title"
        aria-describedby="modal-desc"
        open={showUploadedExcelModal}
        onClose={() => {
          // getAssignmentInspectionRequests()
          setShowUploadedExcelModal(false);
        }}
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <Sheet
          variant="plain"
          sx={{
            width: "1240px",
            height: "80%",
            maxHeight: "80%",
            minHeight: "400px",
            borderRadius: "md",
            p: 3,
            boxShadow: "lg",
            position: "relative",
          }}
        >
          <ModalClose variant="plain" sx={{ m: -1 }} />
          <UploadedExcelModal
            inside={true}
            tyreInspectionAssignmentId={
              selectedInspectionAssignment?.tyre_inspection_assignment_id
            }
          />
        </Sheet>
      </Modal>

      <Modal
        aria-labelledby="modal-title"
        aria-describedby="modal-desc"
        open={showAssignmentRequestModal}
        onClose={() => {
          setShowAssignmentRequestModal(false);
        }}
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <Sheet
          variant="plain"
          sx={{
            width: "80%",
            height: "fit-content",
            maxHeight: "80%",
            minHeight: "400px",
            borderRadius: "20px",
            p: 3,
            boxShadow: "lg",
            position: "relative",
          }}
        >
          <ModalClose variant="plain" sx={{ m: -1 }} />
          <AssignmentRequestModal
            showAssignmentRequestModal={showAssignmentRequestModal}
            tyreInspectionAssignmentId={
              selectedInspectionAssignment?.tyre_inspection_assignment_id
            }
            selectedFleetBranchLocation={
              selectedInspectionAssignment?.fleet_branch_name
            }
          />
        </Sheet>
      </Modal>

      <Modal
        aria-labelledby="modal-title"
        aria-describedby="modal-desc"
        open={openAssign}
        onClose={() => setOpenAssign(false)}
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
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
          <AssignInspection
            getPendingInspection={getInspections}
            selectedInspectionAssignment={selectedInspectionAssignment}
            setOpenAssign={setOpenAssign}
          />
        </Sheet>
      </Modal>

      <Modal
        aria-labelledby="modal-title"
        aria-describedby="modal-desc"
        open={showInitiateBillingModal}
        onClose={() => setShowInitiateBillingModal(false)}
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <Sheet
          variant="plain"
          sx={{
            width: "400px",
            height: "fit-content",
            borderRadius: "md",
            p: 3,
            boxShadow: "lg",
            position: "relative",
          }}
        >
          <ModalClose variant="plain" sx={{ m: 0 }} />
          <div className="confirmation-modal">
            <div style={{ height: "fit-content" }}>
              <h3 style={{ fontSize: 20, color: "grey" }}>Initiate Billing</h3>
            </div>
            <div className="confirmation-content">
              <p>Are you sure you want to initiate billing?</p>
              <div
                className="confirmation-button-container"
                onClick={() => setShowInitiateBillingModal(false)}
              >
                <button className="cancel-button">Cancel</button>
                <button
                  onClick={() => initiateBilling()}
                  className="header-button"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </Sheet>
      </Modal>
      {currentUser === "Regrip" ? (
        ""
      ) : (
        <>
          <div style={{ marginLeft: "auto" }}>
            <button
              className="generateRequestBtn"
              onClick={() => {
                setGenerateRequestModal(true);
              }}
            >
              <span>Generate Request</span>
            </button>
            <div>
              <Modal
                aria-labelledby="modal-title"
                aria-describedby="modal-desc"
                open={generateRequestModal}
                onClose={() => {
                  setGenerateRequestModal(false);
                  setInspectorData();
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
                    width: "450px",
                    height: "fit-content",
                    borderRadius: "md",
                    p: 3,
                    boxShadow: "lg",
                    position: "relative",
                    padding: 0,
                  }}
                >
                  <ModalClose
                    className="close-modal"
                    variant="plain"
                    sx={{ m: -1 }}
                  />
                  <GenerateRequest
                    setGenerateRequestModal={setGenerateRequestModal}
                    onClose={handlePopupClose}
                    inspectorData={inspectorData}
                    setInspectorData={setInspectorData}
                  />
                </Sheet>
              </Modal>
            </div>
          </div>
        </>
      )}
      <Box sx={{ width: "100%" }}>
        <Tabs
          className="tabs"
          value={tabValue}
          onChange={(event, newValue) => {
            setTabValue(newValue);
          }}
          textColor="secondary"
          indicatorColor="secondary"
          aria-label="secondary tabs example"
        >
          <Tab value="pending_request" label="pending Request" />
          <Tab value="completed_inspection" label="completed inspection" />
          <Tab value="pending_billing" label="pending billing" />
          <Tab value="completed_asssignemnt" label="completed asssignemnt" />
        </Tabs>
      </Box>

      <div className="table-container">
        {pendingInspections.length !== 0 && !loading && (
          <table className="inspection-request-table">
            <thead>
              <tr className="table-heading">
                <th></th>
                <th style={{ textAlign: "left" }}>Request Type</th>
                <th>
                  {currentUserId === REGRIP_ROLE_ID ? "Supplier, " : ""} Fleet
                </th>
                <th>Branch</th>
                <th>Date</th>
                <th>Tyre Count</th>

                <th>Status</th>
                {currentUser !== "Regrip" && tabValue === "pending_request" ? (
                  <th>Action</th>
                ) : (
                  ""
                )}
              </tr>
            </thead>
            <tbody style={{ width: "100%" }}>
              {loading === true
                ? dummmyArray.map((i) => (
                    <tr className="table-data" key={i}>
                      <td
                        style={{
                          borderTopLeftRadius: "20px",
                          borderBottomLeftRadius: "20px",
                          height: 45,
                        }}
                      >
                        <Skeleton />
                      </td>
                      <td>
                        <Skeleton />
                      </td>
                      <td>
                        <Skeleton />
                      </td>
                      <td>
                        <Skeleton />
                      </td>
                      <td>
                        <Skeleton />
                      </td>
                      <td>
                        <Skeleton />
                      </td>
                      <td
                        style={{
                          borderTopRightRadius: "20px",
                          borderBottomRightRadius: "20px",
                        }}
                      >
                        <Skeleton />
                      </td>
                    </tr>
                  ))
                : pendingInspections.map((inspection, i) => {
                    const {
                      tyre_inspection_assignment_id,
                      is_excel,
                      assigned_employee_id,
                      supplier_brand_name,
                      fleet_name,
                      fleet_branch_name,
                      tyre_count,
                      date,
                      status,
                      inspection_batch_id,
                    } = inspection;
                    const formattedDate = new Date(date).toLocaleDateString(
                      "en-GB"
                    );

                    return (
                      <tr
                        className="table-data"
                        key={i}
                        style={{
                          cursor: `${
                            status !== "initiate" &&
                            status !== "pending_inspection" &&
                            status !== "inspection_done"
                              ? "pointer"
                              : ""
                          }`,
                        }}
                        onClick={() => {
                          if (
                            status !== "initiate" &&
                            status !== "pending_inspection" &&
                            status !== "inspection_done"
                          ) {
                            setSelectedInspectionAssignment(inspection);
                            setShowAssignmentRequestModal(true);
                          }
                        }}
                      >
                        <td
                          style={{
                            borderTopLeftRadius: "20px",
                            borderBottomLeftRadius: "20px",
                            textAlign: "right",
                          }}
                        >
                          {is_excel && (
                            <FontAwesomeIcon
                              onClick={(event) => {
                                event.stopPropagation();
                                setSelectedInspectionAssignment(inspection);
                                setShowUploadedExcelModal(true);
                              }}
                              icon={faFileExcel}
                              style={{ cursor: "pointer" }}
                            />
                          )}
                        </td>
                        <td style={{ textAlign: "left" }}>
                          {inspection_batch_id ? "Inspection" : "Scrap"}
                        </td>
                        <td>
                          {currentUserId === REGRIP_ROLE_ID
                            ? supplier_brand_name + ", "
                            : ""}
                          {fleet_name}
                        </td>
                        <td>{fleet_branch_name}</td>

                        <td>{formattedDate}</td>
                        <td>
                          <div className="tyre-quantity">{tyre_count}</div>
                        </td>
                        <td
                          style={{
                            borderTopRightRadius:
                              currentUser === "Regrip" ? "20px" : "0px",
                            borderBottomRightRadius:
                              currentUser === "Regrip" ? "20px" : "0px",
                          }}
                        >
                          {status === "initiate" && currentUser !== "Regrip" ? (
                            "Assignment Pending"
                          ) : status === "initiate" &&
                            currentUser === "Regrip" ? (
                            <button
                              className="assign-button"
                              onClick={() => {
                                setOpenAssign(true);
                                setSelectedInspectionAssignment(inspection);
                              }}
                            >
                              Assign
                            </button>
                          ) : status === "pending_inspection" &&
                            currentUser !== "Regrip" ? (
                            `Inspector Assigned `
                          ) : status === "pending_inspection" &&
                            currentUser === "Regrip" ? (
                            `Assigned to ${inspection.assigned_employee_name}`
                          ) : status === "inspection_done" &&
                            currentUser !== "Regrip" ? (
                            `Inspector Assigned `
                          ) : status === "inspection_done" &&
                            currentUser === "Regrip" ? (
                            <button
                              className="assign-button"
                              onClick={() => {
                                setShowInitiateBillingModal(true);
                                setSelectedInspectionAssignment(inspection);
                              }}
                            >
                              Initiate Billing
                            </button>
                          ) : status === "pending_approval" &&
                            currentUser !== "Regrip" ? (
                            `Approval Pending`
                          ) : status === "pending_approval" &&
                            currentUser === "Regrip" ? (
                            `Approval Pending`
                          ) : status === "approved" &&
                            currentUser !== "Regrip" ? (
                            `Invoice Pending`
                          ) : status === "approved" &&
                            currentUser === "Regrip" ? (
                            `Invoice Pending`
                          ) : status === "invoice_done" &&
                            currentUser !== "Regrip" ? (
                            `Invoice Done`
                          ) : status === "invoice_done" &&
                            currentUser === "Regrip" ? (
                            `Invoice Done`
                          ) : status === "pending_lifting" &&
                            currentUser !== "Regrip" ? (
                            `Lifting Pending`
                          ) : status === "pending_lifting" &&
                            currentUser === "Regrip" ? (
                            `Lifting Pending`
                          ) : status === "lifting_done" &&
                            currentUser !== "Regrip" ? (
                            `Invoice Pending`
                          ) : status === "lifting_done" &&
                            currentUser === "Regrip" ? (
                            `Invoice Pending`
                          ) : status === "assignment_complete" &&
                            currentUser !== "Regrip" ? (
                            `Assignment Complete`
                          ) : (
                            `Assignment Complete`
                          )}
                        </td>

                        {currentUser !== "Regrip" && (
                          <td
                            style={{
                              borderTopRightRadius: "20px",
                              borderBottomRightRadius: "20px",
                            }}
                          >
                            {status === "initiate" && (
                              <FontAwesomeIcon
                                icon={faPenToSquare}
                                style={{ color: "#000", cursor: "pointer" }}
                                onClick={() => {
                                  setInspectorData(inspection);
                                  setGenerateRequestModal(true);
                                }}
                              />
                            )}
                          </td>
                        )}
                      </tr>
                    );
                  })}
            </tbody>
          </table>
        )}

        {pendingInspections.length === 0 && !loading && (
          <div className="empty-data">
            <Player
              autoplay
              loop
              src={nodata}
              style={{ height: "150px", width: "150px" }}
            >
              <Controls buttons={["repeat", "frame", "debug"]} />
            </Player>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomeAssignment;
