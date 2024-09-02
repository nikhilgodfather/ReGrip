import React, { useEffect, useState } from "react";
import "./Claims.css";
import { Box, Tab, Tabs } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL, API_URL_FACILITY } from "../Config";
import { Controls, Player } from "@lottiefiles/react-lottie-player";
import nodata from "../../lotties/nodata1.json";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Modal from "@mui/joy/Modal";
import ModalClose from "@mui/joy/ModalClose";
import Sheet from "@mui/joy/Sheet";
import TyreClaims from "./TyreClaims/TyreClaims";
import { ToastContainer, toast } from "react-toastify";
import { REGRIP_SUPPLIER } from "../../redux/constants/Constant";
import { useSelector } from "react-redux";
import { Autocomplete, Option, Select } from "@mui/joy";

const Claims = () => {
  const [showNewComponent, setShowNewComponent] = useState(false);
  const [showClaims, setShowClaims] = useState(true);
  const [tabValue, setTabValue] = useState("pending_claims");
  const [loading, setLoading] = useState(true);
  const [claims, setClaims] = useState([]);
  const dummmyArray = [1, 2, 3, 4, 5];
  const currentUser = useSelector((state) => state.getCurrentUser.role_name);

  const [openTyreClaimModal, setOpenTyreClaimModal] = useState(false);
  const [claimBatchId, setClaimBatchId] = useState(null);

  const [claimsData, setClaimsData] = useState([]);
  const [claim_batch_id, set_claim_batch_id] = useState(null);

  const [ConfirmationModal, setConfirmationModal] = useState(false);

  const [retreaderList, setRetreaderList] = useState([]);
  const [selectedRetreader, setSelectedRetreader] = useState();
  const [selectedRetreaderDetails, setSelectedRetreaderDetails] =
    useState(null);

  const navigate = useNavigate();

  const handleClick = () => {
    setShowNewComponent(true);
    setShowClaims(false);
  };

  function handleBackButton() {
    setShowNewComponent(false);
    setShowClaims(true);
  }

  const getTyreClaimsData = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${API_URL}/claim/claim-batch-id?claim_batch_id=${claim_batch_id}`
      );
      setLoading(false);
      setClaimsData(data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const onClickChangeRetreader = async () => {
    let dataForClaim = {
      claim_batch_id: claimBatchId,
      retreader: selectedRetreaderDetails,
    };

    try {
      const { data } = await axios.patch(
        `${API_URL}/claim/claim-batch-retreader`,
        dataForClaim
      );
      if (data.status === "success") {
        onClickChangeRetreaderApiRegripIndia();

        getClaims();
        setConfirmationModal(false);
        toast.success("Successfully Assigned Retreader", {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 2000,
        });
      } else {
        setConfirmationModal(false);
        toast.error("Something Went Wrong! Try Again Later", {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 2000,
        });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setConfirmationModal(false);
      toast.error("Something Went Wrong! Try Again Later", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 2000,
      });
    }
  };

  const onClickChangeRetreaderApiRegripIndia = async () => {
    let formData = new FormData();

    const testData = [
      {
        claim_batch_id: claimsData[0].claim_batch_id,
        claim_batch_status: claimsData[0].claim_status,
        tyre_count: claimsData.length,
        customer_id: claimsData[0].customer_id,
        rt_entity_id: selectedRetreader,
        tyre_data: claimsData.map((item, i) => ({
          tyre_inspection_id: item.tyre_inspection_id,
          tyre_serial_number: item.tyre_serial_number,
          tyre_serial_number_image_url: item.tyre_serial_number_image_url,
          standard_nsd: item.standard_nsd,
          current_nsd: item.current_nsd,
          upload_video: item.upload_video,
          invoice_no: item.invoice_no,
          invoice_date: item.invoice_date,
          tyre_brand_name: item.tyre_brand_name,
          tyre_size: item.tyre_size,
          tyre_model_name: item.tyre_model_name,
          claim_description: item.claim_description,
          claim_status: item.claim_status,
          claim_data: item.claim_data,
        })),
      },
    ];

    formData.append("claim_requests[]", JSON.stringify(testData));

    try {
      const { data } = await axios.post(
        `${API_URL_FACILITY}/claim-request-assign-retreader`,
        formData,
        {
          headers: {
            Authorization: "Regrip_Not_to_Change_APIKEY",
          },
        }
      );
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const getRetreaderList = async () => {
    try {
      const { data } = await axios.post(
        `${API_URL_FACILITY}/claim-request-retreader-list`,
        {},
        {
          headers: {
            Authorization: "Regrip_Not_to_Change_APIKEY",
          },
        }
      );

      setRetreaderList(data?.data);
    } catch (e) {
      console.log("Error while fetching data:", e.message);
    }
  };

  const getClaims = async () => {
    try {
      let status;
      let type;
      if (tabValue === "pending_claims") {
        status = "complete";
      } else if (tabValue === "processed_claims") {
        status = "processed";
      }
      const token = localStorage.getItem("token");

      if (!token) navigate("/");
      const bearer_token = "bearer " + JSON.parse(token);

      setLoading(true);
      const { data } = await axios.get(`${API_URL}/claim/claim-batch`, {
        headers: {
          Authorization: bearer_token,
          "Access-Control-Allow-Origin": "*",
        },
        params: {
          status: status,
          type: type,
        },
      });
      // const fleets = data.rows;
      setLoading(false);
      setClaims(data.data);
      console.log(data.data.map((item) => item.assigned_retreader));
    } catch (e) {
      console.log("Error while fetching data:", e.message);
    }
  };

  useEffect(() => {
    getClaims();
  }, [tabValue]);

  useEffect(() => {
    if (currentUser && REGRIP_SUPPLIER) {
      if (currentUser !== REGRIP_SUPPLIER) {
        navigate("/home");
      }
    }
  }, [currentUser]);

  useEffect(() => {
    // getClaimRequestDetails();
    getRetreaderList();
    if (claim_batch_id) {
      getTyreClaimsData();
    }
  }, [claim_batch_id]);

  return (
    <div className="claims-container" >
      <ToastContainer className="custom-toast-container" />
      <Modal
        aria-labelledby="modal-title"
        aria-describedby="modal-desc"
        open={ConfirmationModal}
        onClose={() => {
          setConfirmationModal(false);
          set_claim_batch_id(null);
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
            width: "420px",
            borderRadius: "md",
            boxShadow: "lg",
            position: "relative",
            padding: "0px !important",
          }}
        >
          <ModalClose variant="plain" sx={{ m: 1 }} />

          <div className="tyre-claims-modal">
            <h2 className="title">Assign Retreader</h2>
            <hr />
            <p className="description">are you sure want to assign retreader</p>
            <hr />
            <div className="action-div">
              <button
                className="closebtn"
                onClick={() => {
                  setConfirmationModal(false);
                  set_claim_batch_id(null);
                }}
              >
                Close
              </button>
              <button
                className="confirmbtn"
                onClick={() => {
                  onClickChangeRetreader();
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        </Sheet>
      </Modal>
      <div className="head">
        <h1 className="heading1" style={{ marginBottom: "3px" }}>
          Claims
        </h1>
      </div>{" "}
      <Modal
        aria-labelledby="modal-title"
        aria-describedby="modal-desc"
        open={openTyreClaimModal}
        onClose={() => {
          setOpenTyreClaimModal(false);
        }}
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <Sheet
          variant="plain"
          sx={{
            width: "95vw",
            height: "90vh",
            borderRadius: "md",
            p: 3,
            boxShadow: "lg",
            position: "relative",
            overflow: "scroll",
          }}
        >
          <ModalClose variant="plain" sx={{ m: -1 }} />
          <TyreClaims
            claimBatchId={claimBatchId}
            setOpenTyreClaimModal={setOpenTyreClaimModal}
            getClaims={getClaims}
            retreaderList={retreaderList}
          />
        </Sheet>
      </Modal>
      {showClaims && (
        <div className="claims">
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
              <Tab value="pending_claims" label="Requested Claims" />
              <Tab value="processed_claims" label="Processed Claims" />
            </Tabs>
          </Box>
          <div
            className="table-container"
            style={{ overflowY: "auto", maxHeight: "calc(100vh - 220px)"}}
          >
            {claims.length !== 0 && !loading && (
              <table className="claims-table">
                <thead>
                  <tr className="table-heading">
                    <th>S No</th>
                    <th>Customer Name</th>
                    <th>User Type</th>
                    <th>City</th>
                    <th>Email</th>
                    <th>Mobile Number</th>
                    <th>Claim Date</th>
                    <th>Tyre Count</th>
                    <th>Assign Retreader</th>
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
                    : claims?.map((inspection, i) => {
                        const {
                          claim_batch_id,
                          app_user_type,
                          city,
                          email,
                          firm_name,
                          mobile,
                          entrytime,
                          tyre_count,
                          assigned_retreader,
                        } = inspection;
                        const formattedDate = new Date(
                          entrytime
                        ).toLocaleDateString("en-GB");

                        return (
                          <tr
                            onClick={() => {
                              setOpenTyreClaimModal(true);
                              setClaimBatchId(claim_batch_id);
                            }}
                            className="table-data-claim-web"
                            key={i}
                            style={{ cursor: "pointer" }}
                          >
                            <td>{i + 1}</td>
                            <td>{firm_name}</td>
                            <td>{app_user_type}</td>
                            <td>{city}</td>
                            <td>{email}</td>
                            <td>{mobile}</td>
                            <td>{formattedDate}</td>
                            <td>{tyre_count}</td>
                            <td
                              style={{ width: "200px" }}
                              onClick={(event) => {
                                event.stopPropagation();
                                setClaimBatchId(claim_batch_id);
                              }}
                            >
                              <div
                                className="claim-retreader"
                                style={{ width: "fit-content" }}
                              >
                                <Select
                                  sx={{ width: "180px" }}
                                  value={assigned_retreader?.id}
                                  onChange={(event, newValue) => {
                                    setSelectedRetreader(newValue);
                                    const selectedRetreaderDetail =
                                      retreaderList.find(
                                        (ret) => ret.id === newValue
                                      );
                                    setSelectedRetreaderDetails(
                                      selectedRetreaderDetail
                                    );
                                  }}
                                >
                                  {retreaderList?.map((ret) => (
                                    <Option
                                      onClick={() => {
                                        setConfirmationModal(true);
                                        set_claim_batch_id(claim_batch_id);
                                      }}
                                      key={ret?.id}
                                      value={ret.id}
                                    >
                                      {ret?.poc_name}
                                    </Option>
                                  ))}
                                </Select>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                </tbody>
              </table>
            )}

            {claims.length === 0 && !loading && (
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
      )}
    </div>
  );
};

export default Claims;
