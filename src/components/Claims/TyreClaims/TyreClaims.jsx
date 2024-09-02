import React, { useEffect, useState } from "react";
import { Controls, Player } from "@lottiefiles/react-lottie-player";
import nodata from "../../../lotties/nodata1.json";
import axios from "axios";
import Skeleton from "react-loading-skeleton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faImage,
  faCheck,
  faXmark,
  faDownload,
  faEye,
} from "@fortawesome/free-solid-svg-icons";

import "../TyreClaims/TyreClaims.css";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from "@mui/material";
import ModalClose from "@mui/joy/ModalClose";
import Modal from "@mui/joy/Modal";
import Sheet from "@mui/joy/Sheet";
import Button from "@mui/joy/Button";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { Transition } from "react-transition-group";

import { API_URL, API_URL_FACILITY } from "../../Config";
import SerialNoImageModal from "../../SerialNoImageModal/SerialNoImageModal";
import TyreInspectionModal from "../../TyreInspectionModal/TyreInspectionModal";
import ShowImagesModal from "../../ShowImagesModal/ShowImagesModal";
import ShowVideosModal from "../../ShowVideosModal/ShowVideosModal";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import NSDVideo from "../../ShowVideosModal/NSDVideo";
import { Input, Option, Select } from "@mui/joy";
import SearchTyreDataModal from "../../Home/SearchTyreDataModal";
import HomeDownloadPDF from "../../PdfComponents/HomeDownloadPDF/HomeDownloadPDF";
import TyreClaimsExcel from "../ExcelDownload/TyreClaimsExcel";
import TyreClaimsDownloadPDF from "../PDFDownoad/TyreClaimsDownloadPDF";

const TyreClaims = ({ claimBatchId, setOpenTyreClaimModal, getClaims }) => {
  // retreader
  console.log("claim_batch_id", claimBatchId);
  const [ConfirmationModal, setConfirmationModal] = useState(false);
  const [retreaderList, setRetreaderList] = useState([]);

  const [selectedRetreader, setSelectedRetreader] = useState();
  const [selectedRetreaderDetails, setSelectedRetreaderDetails] =
    useState(null);
  // retreader

  const [loading, setLoading] = useState(true);
  const dummmyArray = [1, 2, 3, 4, 5];
  const [serialImagesModal, setSerialImagesModal] = useState(false);
  const [serialNoURL, setSerialNoURL] = useState();
  const [tyreSerialNumber, setTyreSerialNumber] = useState();

  const [showModal, setShowModal] = useState(false);
  const [showImages, setShowImages] = useState(false);
  const [showVideos, setShowVideos] = useState(false);
  const [showNSDVideoModal, setShowNSDVideoModal] = useState(false);
  const [editTyreData, setEditTyreData] = useState([]);
  const [editTyreModal, setEditTyreModal] = useState(false);
  const [defectIdToNameMap, setDefectIdToNameMap] = useState({});

  const [openClaimModal, setOpenClaimModal] = useState(false);

  const [tyreClaims, setTyreClaims] = useState([]);
  const [updatedTyreClaims, setUpdatedTyreClaims] = useState([]);

  const [selectedAcceptedFile, setSelectedAcceptedFile] = useState(null);
  const [acceptKey, setAcceptKey] = useState("");
  const [acceptUrl, setAcceptUrl] = useState("");

  const [selectedRejectedFile, setSelectedRejectedFile] = useState(null);
  const [rejectKey, setRejectKey] = useState("");
  const [rejectUrl, setRejectUrl] = useState("");

  const [regripRegripClaims, setRegripRegripClaims] = useState([]);

  const [addReviewBoolean, setAddReviewBoolean] = useState(false);
  const [addReview, setAddReview] = useState("");

  const [showSerialNumberModal, setShowSerialNumberModal] = useState(false);
  const [openModalSerialData, setOpenModalSerialData] = useState(false);

  let okImage;

  const defect = useSelector((state) => state.getDefectTypes.defects);

  const currentUser = useSelector((state) => state.getCurrentUser.role_name);

  const getTyreClaimsData = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${API_URL}/claim/claim-batch-id?claim_batch_id=${claimBatchId}`
      );
      setLoading(false);
      setTyreClaims(data.data);
      setSelectedRetreader(data.data[0]?.assigned_retreader?.id);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const getClaimRequestDetails = async () => {
    let requestDetails = {
      claim_batch_id: claimBatchId,
    };
    try {
      const { data } = await axios.post(
        `${API_URL_FACILITY}/claim-request-details`,
        requestDetails,

        {
          headers: {
            Authorization: "Regrip_Not_to_Change_APIKEY",
          },
        }
      );
      if (data?.message !== "Success") {
        setRegripRegripClaims([]);
      } else {
        setRegripRegripClaims(data?.data);
      }
    } catch (e) {
      console.log("Error while fetching data:", e.message);
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
        getClaimRequestDetails();
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
        claim_batch_id: tyreClaims[0].claim_batch_id,
        claim_batch_status: tyreClaims[0].claim_status,
        tyre_count: tyreClaims?.length,
        customer_id: tyreClaims[0].customer_id,
        rt_entity_id: selectedRetreader,
        tyre_data: tyreClaims.map((item, i) => ({
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

  const getDefectNames = async () => {
    try {
      const defectMap = {};
      defect?.defects?.forEach((defect) => {
        defectMap[defect?.tyre_defect_id] = defect?.tyre_defect_name;
      });

      setDefectIdToNameMap(defectMap);
    } catch (error) {
      console.log("Error while getting defects", error);
    }
  };

  const handleAccept = (inspectionId) => {
    const updatedClaims = updatedTyreClaims.map((claim) => {
      if (claim.tyre_inspection_id === inspectionId) {
        return {
          ...claim,
          status: "approved",
        };
      }
      return claim;
    });

    const existingClaimIndex = updatedClaims.findIndex(
      (claim) => claim.tyre_inspection_id === inspectionId
    );

    if (existingClaimIndex !== -1) {
      setUpdatedTyreClaims(updatedClaims);
    } else {
      setUpdatedTyreClaims((prevState) => [
        ...prevState,
        { tyre_inspection_id: inspectionId, status: "approved" },
      ]);
    }
  };

  const handleReject = (inspectionId) => {
    const updatedClaims = updatedTyreClaims.map((claim) => {
      if (claim.tyre_inspection_id === inspectionId) {
        return {
          ...claim,
          status: "rejected",
        };
      }
      return claim;
    });

    const existingClaimIndex = updatedClaims.findIndex(
      (claim) => claim.tyre_inspection_id === inspectionId
    );

    if (existingClaimIndex !== -1) {
      setUpdatedTyreClaims(updatedClaims);
    } else {
      setUpdatedTyreClaims((prevState) => [
        ...prevState,
        { tyre_inspection_id: inspectionId, status: "rejected" },
      ]);
    }
  };

  const handleUploadAccept = async (file) => {
    if (!file) {
      console.error("No file selected.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    const queryParams = new URLSearchParams({
      folder: "claimnotes",
      fileType: "application/pdf",
    });

    const url = `${API_URL}/upload/objecturl?${queryParams}`;

    try {
      const response = await axios.get(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setAcceptKey(response.data.data.key);
      setAcceptUrl(response.data.data.uploadURL);

      await axios.put(response.data.data.uploadURL, file, {
        headers: {
          "Content-Type": "application/pdf",
        },
      });
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const handleDownloadPDF = (folder, key) => {
    const pdfUrl = `${API_URL}/upload/readobjecturl?folder=${folder}&key=${key}`;
    fetch(pdfUrl)
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `${key}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
      })
      .catch((error) => {
        console.error("Error downloading PDF:", error);
      });
  };

  const handleSubmitForLetterModal = () => {
    if (updatedTyreClaims?.length !== tyreClaims?.length) {
      toast.error("Please Accept or Reject Each Request.", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 2000,
      });
      return;
    }

    setOpenClaimModal(true);
  };

  const handleUploadReject = async (file) => {
    if (!file) {
      console.error("No file selected.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    const queryParams = new URLSearchParams({
      folder: "claimnotes",
      fileType: "application/pdf",
    });

    const url = `${API_URL}/upload/objecturl?${queryParams}`;

    try {
      const response = await axios.get(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setRejectKey(response.data.data.key);
      setRejectUrl(response.data.data.uploadURL);

      await axios.put(response.data.data.uploadURL, file, {
        headers: {
          "Content-Type": "application/pdf",
        },
      });
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const handleSubmitTyreClaim = async () => {
    if (updatedTyreClaims?.length !== tyreClaims?.length || !claimBatchId) {
      toast.error("Please First Accept or Reject the Request.", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 2000,
      });
      return;
    }

    let data = {
      claims: updatedTyreClaims?.map((claim) => ({
        tyre_inspection_id: claim?.tyre_inspection_id,
        status: claim?.status,
      })),
      claim_batch_id: claimBatchId,
      claim_credit_note: acceptKey,
      claim_reject_note: rejectKey,
    };
    setLoading(true);

    try {
      const response = await axios.patch(
        `${API_URL}/claim/change-status`,
        data
      );
      toast.success("Successfully Claimed", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 2000,
      });
      getClaims();
      setOpenTyreClaimModal(false);
    } catch (error) {
      console.error("Error updating claim status:", error);
      setLoading(false);
      toast.error("Error while updating claim status", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 2000,
      });
    }
  };

  useEffect(() => {
    getTyreClaimsData();
    getDefectNames();
    getRetreaderList();
    if (claimBatchId) {
      getClaimRequestDetails();
    }
  }, []);
  return (
    <div style={{ paddingTop: "20px", paddingLeft: "20px" }}>
      <ToastContainer
        style={{ width: "400px" }}
        className="custom-toast-container"
      />

      {/* tyre serial modal - start */}

      <Modal
        aria-labelledby="modal-title"
        aria-describedby="modal-desc"
        open={showSerialNumberModal}
        onClose={() => {
          setShowSerialNumberModal(false);
          setAddReview("");
        }}
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <Sheet
          variant="plain"
          sx={{
            width: "450px",
            height: "220px",
            borderRadius: "md",
            boxShadow: "lg",
            position: "relative",
          }}
        >
          <ModalClose variant="plain" sx={{ m: 0 }} />
          <div className="serial-eye-modal">
            <img
              src={`${API_URL}/upload/readimageurl?imagename=${serialNoURL}&folder=0`}
              alt={""}
              className="heading-image-of-serialnum"
              style={{
                width: "350px",
                height: "130px",
              }}
            />
            <button
              style={{
                border: "none",
                backgroundColor: "transparent",
                cursor: "pointer",
              }}
              onClick={() => {
                setOpenModalSerialData(true);
              }}
            >
              <FontAwesomeIcon
                className="download-button"
                icon={faEye}
                style={{ color: "#ffffff" }}
              />
            </button>
          </div>
        </Sheet>
      </Modal>
      {/* tyre serial modal - end */}

      {/* child serial modal - start*/}
      <Modal
        aria-labelledby="modal-title"
        aria-describedby="modal-desc"
        open={openModalSerialData}
        onClose={() => {
          setOpenModalSerialData(false);
          setTyreSerialNumber();
          setShowSerialNumberModal(false);
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
          <SearchTyreDataModal sendTyreData={tyreSerialNumber} />
        </Sheet>
      </Modal>
      {/* child serial modal - end*/}

      {/* add review */}

      <Modal
        aria-labelledby="modal-title"
        aria-describedby="modal-desc"
        open={addReviewBoolean}
        onClose={() => {
          setAddReviewBoolean(false);
          setAddReview("");
        }}
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <Sheet
          variant="plain"
          sx={{
            width: "400px",
            height: "220px",
            borderRadius: "md",
            p: 3,
            boxShadow: "lg",
            position: "relative",
          }}
        >
          <ModalClose variant="plain" sx={{ m: 0 }} />

          <div className="addBranch-customer-main">
            <div className="scrolling-view">
              <div>
                <h3 style={{ fontSize: 18, color: "grey" }}>Add Comment</h3>
              </div>

              <div
                className="field-align"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "20px",
                }}
              >
                <div
                  className="add-customer-field-container"
                  style={{ width: "100%" }}
                >
                  <Input
                    style={{ width: "100%" }}
                    className="field-addBranch"
                    placeholder="Add Comment"
                    value={addReview}
                    type="text"
                    onChange={(e) => setAddReview(e.target.value)}
                  />
                </div>
              </div>
              <div
                style={{
                  marginTop: "10px",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Button
                  className="addBranch-btn"
                  onClick={() => {
                    console.log("Review added");
                  }}
                >
                  Add
                </Button>
              </div>
            </div>
          </div>
        </Sheet>
      </Modal>

      {/*  add review*/}

      <Modal
        aria-labelledby="modal-title"
        aria-describedby="modal-desc"
        open={ConfirmationModal}
        onClose={() => {
          setConfirmationModal(false);
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
                onClick={() => setConfirmationModal(false)}
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

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
          marginTop: "15px",
        }}
      >
        <h1>Claim Details</h1>

        <div style={{ display: "flex", alignItems: "center", gap: "25px" }}>
          <div style={{}}>
            <Select
              sx={{ width: "220px" }}
              value={selectedRetreader}
              onChange={(event, newValue) => {
                setSelectedRetreader(newValue);
                const selectedRetreaderDetail = retreaderList.find(
                  (ret) => ret.id === newValue
                );
                setSelectedRetreaderDetails(selectedRetreaderDetail);
              }}
            >
              {retreaderList?.map((ret) => (
                <Option
                  onClick={() => {
                    setConfirmationModal(true);
                  }}
                  key={ret?.id}
                  value={ret.id}
                >
                  {ret?.poc_name}
                </Option>
              ))}
            </Select>
          </div>

          {tyreClaims[0]?.claim_batch_status === "processed" && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "16px",
              }}
            >
              {tyreClaims[0].claim_credit_note !== null && (
                <Button
                  className="request-button"
                  style={{ cursor: "pointer" }}
                  onClick={() =>
                    handleDownloadPDF(
                      "claimnotes",
                      tyreClaims[0]?.claim_credit_note
                    )
                  }
                >
                  Credit Note
                  <FontAwesomeIcon
                    icon={faDownload}
                    style={{ cursor: "pointer", marginLeft: "6px" }}
                  />
                </Button>
              )}

              {tyreClaims[0]?.claim_reject_note !== null && (
                <Button
                  className="request-button"
                  style={{ cursor: "pointer" }}
                  onClick={() =>
                    handleDownloadPDF(
                      "claimnotes",
                      tyreClaims[0]?.claim_reject_note
                    )
                  }
                >
                  Rejection Letter
                  <FontAwesomeIcon
                    icon={faDownload}
                    style={{ cursor: "pointer", marginLeft: "6px" }}
                  />
                </Button>
              )}
            </div>
          )}

          <TyreClaimsExcel tyreClaims={tyreClaims} />
          <TyreClaimsDownloadPDF excelData={tyreClaims} />
        </div>
      </div>

      {/* Add Tyre inspection detail modal */}
      {showModal && <TyreInspectionModal setShowModal={setShowModal} />}

      {/* Show all defect images modal */}

      {/* nsd */}

      <Modal
        aria-labelledby="modal-title"
        aria-describedby="modal-desc"
        open={showNSDVideoModal}
        onClose={() => {
          setShowNSDVideoModal(false);
        }}
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <Sheet
          variant="plain"
          sx={{
            width: "fit-content",
            height: "fit-content",
            borderRadius: "md",
            p: 3,
            boxShadow: "lg",
            position: "relative",
            backgroundColor: "#F1F1F1 !important",
          }}
        >
          <ModalClose variant="plain" sx={{ m: 0 }} />
          <NSDVideo
            setShowNSDVideoModal={setShowNSDVideoModal}
            editTyreData={editTyreData}
            setEditTyreData={setEditTyreData}
          />
        </Sheet>
      </Modal>

      {/* nsd */}

      <Modal
        aria-labelledby="modal-title"
        aria-describedby="modal-desc"
        open={showImages}
        onClose={() => {
          setShowImages(false);
        }}
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <Sheet
          variant="plain"
          sx={{
            width: "fit-content",
            height: "fit-content",
            borderRadius: "md",
            p: 3,
            boxShadow: "lg",
            position: "relative",
            backgroundColor: "#F1F1F1 !important",
          }}
        >
          <ModalClose variant="plain" sx={{ m: 0 }} />
          <ShowImagesModal
            setShowImages={setShowImages}
            editTyreData={editTyreData}
            setEditTyreData={setEditTyreData}
          />
        </Sheet>
      </Modal>

      <Modal
        aria-labelledby="modal-title"
        aria-describedby="modal-desc"
        open={showVideos}
        onClose={() => {
          setShowVideos(false);
        }}
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <Sheet
          variant="plain"
          sx={{
            width: "fit-content",
            height: "fit-content",
            borderRadius: "md",
            p: 3,
            boxShadow: "lg",
            position: "relative",
            backgroundColor: "#F1F1F1 !important",
          }}
        >
          <ModalClose variant="plain" sx={{ m: 0 }} />
          <ShowVideosModal
            setShowVideos={setShowVideos}
            editTyreData={editTyreData}
            setEditTyreData={setEditTyreData}
          />
        </Sheet>
      </Modal>

      <Modal
        aria-labelledby="modal-title"
        aria-describedby="modal-desc"
        open={serialImagesModal}
        onClose={() => {
          setSerialImagesModal(false);
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
            width: "fit-content",
            height: "fit-content",
            borderRadius: "md",
            p: 3,
            boxShadow: "lg",
            position: "relative",
            backgroundColor: "#F1F1F1 !important",
          }}
        >
          <ModalClose variant="plain" sx={{ m: 0 }} />
          <SerialNoImageModal
            serialNoURL={serialNoURL}
            tyreSerialNumber={tyreSerialNumber}
            setSerialImagesModal={setSerialImagesModal}
          />
        </Sheet>
      </Modal>

      {/* {
                showImages && (<ShowImagesModal setShowImages={setShowImages}
                    editTyreData={editTyreData}
                    setEditTyreData={setEditTyreData} />)
            }

            {
                showVideos && (<ShowVideosModal setShowVideos={setShowVideos}
                    editTyreData={editTyreData}
                    setEditTyreData={setEditTyreData} />)
            } */}

      {/* {serialImagesModal && (
        <SerialNoImageModal
          serialNoURL={serialNoURL}
          tyreSerialNumber={tyreSerialNumber}
          setSerialImagesModal={setSerialImagesModal}
        />
      )} */}
      <div className="table-container">
        <Modal
          aria-labelledby="modal-title"
          aria-describedby="modal-desc"
          open={openClaimModal}
          onClose={() => {
            setOpenClaimModal(false);
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
              width: "400px",
              height: "260px",
              borderRadius: "md",
              p: 3,
              boxShadow: "lg",
              position: "relative",
            }}
          >
            <ModalClose variant="plain" sx={{ m: 0 }} />

            <div className="" style={{ width: "100%", height: "100%" }}>
              <div className="upload-div">
                <div>
                  <h3 style={{ fontSize: 20, color: "grey" }}>Tyre Claim</h3>
                </div>
                <div className="file-upload-div">
                  <div className="credit-note">
                    <h5>Upload Credit Note</h5>
                    <input
                      className="file-upload"
                      type="file"
                      accept="application/pdf"
                      onChange={(event) => {
                        const file = event.target.files[0];
                        setSelectedAcceptedFile(file);
                        handleUploadAccept(file);
                      }}
                    />
                  </div>
                  <div className="credit-note">
                    <h5>Upload Rejection Letter</h5>
                    <input
                      className="file-upload"
                      type="file"
                      accept="application/pdf"
                      onChange={(event) => {
                        const file = event.target.files[0];
                        setSelectedRejectedFile(file);
                        handleUploadReject(file);
                      }}
                    />
                  </div>
                </div>

                <div
                  style={{
                    marginTop: "10px",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <button
                    className="claim-submit-button"
                    onClick={() => {
                      handleSubmitTyreClaim();
                      setOpenClaimModal(false);
                    }}
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </Sheet>
        </Modal>
        <div className="table-customer" style={{ overflow: "scroll" }}>
          <table variant="outlined" className="claims-table">
            <thead>
              <tr className="table-heading">
                <th style={{ borderTopLeftRadius: "15px", width: 60 }}>SNo</th>
                <th style={{ width: 80 }}>Type Serial No</th>

                <th style={{ width: 100 }}>Invoice No</th>

                <th style={{ width: 100 }}>Invoice Date</th>

                <th style={{ width: 180 }}>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "12px",
                    }}
                  >
                    <div>
                      <h5>NSD</h5>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <span style={{ width: "60" }}>Current</span>
                      <span style={{ width: "60" }}>Standard</span>
                      <span style={{ width: "60" }}>Video</span>
                    </div>
                  </div>
                  {/* <table style={{ width: "100%" }}>
                    <thead>
                      <tr>
                        <th style={{ borderBottom: "0px" }} colSpan="3">
                          NSD
                        </th>
                      </tr>
                      <tr>
                        <th
                          style={{ paddingRight: "10px", borderBottom: "0px" }}
                        >
                          Current
                        </th>
                        <th
                          style={{
                            padding: "0 10px",
                            borderBottom: "0px",
                            borderLeft: "1px solid #b2b2b2",
                            borderRight: "1px solid #b2b2b2",
                          }}
                        >
                          Standard
                        </th>
                        <th
                          style={{ paddingLeft: "10px", borderBottom: "0px" }}
                        >
                          Video
                        </th>
                      </tr>
                    </thead>
                  </table> */}
                </th>
                {currentUser === "Regrip" && (
                  <th style={{ width: 100 }}>Brand</th>
                )}
                <th style={{ width: 100 }}>Size</th>
                <th style={{ width: 100 }}>Model</th>
                <th style={{ width: 100 }}>Description</th>
                <th style={{ width: 100 }}>Claim Images</th>
                <th style={{ width: 150 }}>Retreader Status</th>
                {/* <th style={{ width: 150 }}>Add Review</th> */}

                <th style={{ width: 150, borderTopRightRadius: "15px" }}>
                  {tyreClaims[0]?.claim_batch_status === "processed"
                    ? "Status"
                    : "Action"}
                </th>
              </tr>
            </thead>
            <tbody>
              {loading === true
                ? dummmyArray.map((i) => (
                    <tr className="table-data skeleton" key={i}>
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
                    </tr>
                  ))
                : tyreClaims &&
                  tyreClaims?.map((inspection, i) => {
                    let {
                      tyre_inspection_id,
                      product_category,
                      tyre_serial_number_image_url,
                      tyre_serial_number,
                      tyre_brand_name,
                      tyre_size,
                      tyre_construction_type,
                      tyre_model_name,
                      claim_batch_status,
                      claim_data,
                      claim_status,
                      claim_credit_note,
                      claim_reject_note,
                      claim_description,
                      invoice_no,
                      invoice_date,
                      standard_nsd,
                      current_nsd,
                    } = inspection;

                    const regripClaimData =
                      regripRegripClaims.length !== 0 &&
                      regripRegripClaims.length !== 0 &&
                      regripRegripClaims[0]?.tyre_data?.find(
                        (data) =>
                          data?.tyre_inspection_id === tyre_inspection_id
                      );

                    const claim_remark = regripClaimData?.rt_claim_remark
                      ? regripClaimData?.rt_claim_remark
                      : "Remark Pending";
                    return (
                      <tr key={i} className="">
                        <td className="capitalize-text">{i + 1}</td>
                        <td className="capitalize-text ">
                          <button
                            id="tyre-serial-number-button"
                            style={{ marginLeft: "auto", marginRight: "auto" }}
                            onClick={() => {
                              // setSerialImagesModal(true);
                              setSerialNoURL(tyre_serial_number_image_url);
                              setTyreSerialNumber(tyre_serial_number);
                              setShowSerialNumberModal(true);
                            }}
                          >
                            <FontAwesomeIcon
                              icon={faImage}
                              style={{ cursor: "pointer", marginRight: 4 }}
                            />
                            {tyre_serial_number &&
                            typeof tyre_serial_number === "string"
                              ? tyre_serial_number?.length > 10
                                ? `${tyre_serial_number.substring(0, 10)}...`
                                : tyre_serial_number
                              : ""}
                          </button>
                        </td>
                        <td className="capitalize-text">
                          {invoice_no ? invoice_no : "--/--"}
                        </td>
                        <td className="capitalize-text">
                          {inspection?.invoice_date ? (
                            new Date(
                              inspection?.invoice_date
                            ).toLocaleDateString("en-IN")
                          ) : (
                            <span>--/--</span>
                          )}
                        </td>

                        <td>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <span
                              style={{
                                width: "60px",
                              }}
                            >
                              {" "}
                              {current_nsd ? current_nsd : "--/--"}
                            </span>
                            <span
                              style={{
                                width: "60px",
                              }}
                            >
                              {standard_nsd ? standard_nsd : "--/--"}
                            </span>
                            <span
                              style={{
                                width: "60px",
                              }}
                            >
                              <img
                                style={{
                                  cursor: "pointer",
                                  width: 35,
                                  height: 35,
                                }}
                                src={require("../../../assets/video.png")}
                                alt=""
                                onClick={() => {
                                  setShowNSDVideoModal(true);
                                  setEditTyreData(inspection);
                                }}
                              />
                            </span>
                          </div>
                          {/* <table style={{width:"100%"}}>
                            <tbody>
                              <tr>
                                <td style={{ paddingRight: "10px",borderBottom:"0px" }} className="capitalize-text">
                                 
                                </td>
                                <td style={{ padding: "0px",borderBottom:"0px" }} className="capitalize-text">
                                
                                </td>
                                <td style={{ paddingLeft: "10px",borderBottom:"0px" }}>
                                  
                                </td>
                              </tr>
                            </tbody>
                          </table> */}
                        </td>
                        <td className="capitalize-text">{tyre_brand_name}</td>
                        <td className="capitalize-text">{tyre_size}</td>
                        <td className="capitalize-text">
                          {tyre_model_name ? tyre_model_name : "--/--"}
                        </td>
                        <td
                          className="capitalize-text"
                          style={{ cursor: "pointer" }}
                        >
                          <Tooltip
                            className="description-tooltip"
                            title={
                              <div
                                style={{ fontSize: "0.9vw", fontWeight: 400 }}
                              >
                                {claim_description}
                              </div>
                            }
                            arrow
                          >
                            {claim_description?.length > 20
                              ? claim_description.substring(0, 20) + "..."
                              : claim_description}
                          </Tooltip>
                        </td>

                        <td className="capitalize-text">
                          <div
                            style={{
                              display: "flex",
                              width: "100%",
                              justifyContent: "space-evenly",
                              alignItems: "center",
                            }}
                          >
                            <div className="view-img-btn">
                              {(okImage = claim_data?.find(
                                (image) =>
                                  defectIdToNameMap[image?.defect_id] !== "ok"
                              )) ? (
                                <img
                                  src={`${API_URL}/upload/readimageurl?imagename=${okImage?.link}&folder=claimnotes/${okImage?.defect_id}`}
                                  alt=""
                                  width="35"
                                  height="35"
                                  onClick={() => {
                                    setShowImages(true);
                                    setEditTyreData(inspection);
                                  }}
                                />
                              ) : (
                                <img
                                  style={{ width: 35, height: 35 }}
                                  src={require("../../../assets/Placeholder_view_vector.png")}
                                  alt="ok"
                                  onClick={() => {
                                    setShowImages(true);
                                    setEditTyreData(inspection);
                                  }}
                                />
                              )}
                            </div>
                            <img
                              style={{
                                cursor: "pointer",
                                display: inspection?.claim_data?.some(
                                  (image) => image?.video_link
                                )
                                  ? "visible"
                                  : "none",
                                width: 35,
                                height: 35,
                              }}
                              src={require("../../../assets/video.png")}
                              alt=""
                              onClick={() => {
                                setShowVideos(true);
                                setEditTyreData(inspection);
                              }}
                            />
                          </div>
                        </td>

                        <td>
                          {!selectedRetreader
                            ? "Assignment Pending"
                            : claim_remark && claim_remark}
                        </td>

                        {/* <td>
                          <button
                            style={{
                              width: "100%",
                              maxWidth: "80px",
                              fontSize: "0.8vw",
                              outline: "none",
                              border: "none",
                              borderRadius: "10px",
                              padding: "5px",
                              fontWeight: "600",
                              backgroundColor: "#80A3FF",
                              color: "white",
                              cursor: "pointer",
                            }}
                            onClick={() => {
                              setAddReviewBoolean(true);
                              console.log(tyre_inspection_id);
                            }}
                          >
                            Add Review
                          </button>
                        </td> */}

                        <td className="capitalize-text">
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              gap: "10px",
                            }}
                          >
                            <div>
                              {claim_batch_status === "processed" ? (
                                <div
                                  style={{
                                    display: "flex",
                                    gap: "12px",
                                    justifyContent: "center",
                                  }}
                                >
                                  {claim_status === "approved" ? (
                                    <button
                                      className={`button-request-approved ${
                                        claim_batch_status === "processed" &&
                                        claim_status === "approved"
                                          ? "approved-bg"
                                          : ""
                                      }`}
                                      onClick={() => {}}
                                    >
                                      Approved{" "}
                                      <FontAwesomeIcon
                                        icon={faCheck}
                                        style={{
                                          cursor: "pointer",
                                          marginLeft: 4,
                                        }}
                                      />
                                    </button>
                                  ) : (
                                    <button
                                      className={`button-request-rejected  ${
                                        claim_batch_status === "processed" &&
                                        claim_status === "rejected"
                                          ? "rejected-bg"
                                          : ""
                                      }`}
                                      onClick={() => {}}
                                    >
                                      Rejected{" "}
                                      <FontAwesomeIcon
                                        icon={faXmark}
                                        style={{
                                          cursor: "pointer",
                                          marginLeft: 4,
                                        }}
                                      />
                                    </button>
                                  )}
                                </div>
                              ) : (
                                <div
                                  style={{
                                    display: "flex",
                                    gap: "12px",
                                    justifyContent: "center",
                                  }}
                                >
                                  <button
                                    className={`button-request-approved ${
                                      updatedTyreClaims.some(
                                        (claim) =>
                                          claim.tyre_inspection_id ===
                                            inspection.tyre_inspection_id &&
                                          claim.status === "approved"
                                      )
                                        ? "approved-bg"
                                        : ""
                                    }`}
                                    onClick={() => {
                                      handleAccept(
                                        inspection.tyre_inspection_id
                                      );
                                    }}
                                  >
                                    Approve{" "}
                                    <FontAwesomeIcon
                                      icon={faCheck}
                                      style={{
                                        cursor: "pointer",
                                        marginLeft: 4,
                                      }}
                                    />
                                  </button>
                                  <button
                                    className={`button-request-rejected ${
                                      updatedTyreClaims.some(
                                        (claim) =>
                                          claim.tyre_inspection_id ===
                                            inspection.tyre_inspection_id &&
                                          claim.status === "rejected"
                                      )
                                        ? "rejected-bg"
                                        : ""
                                    }`}
                                    onClick={() => {
                                      handleReject(
                                        inspection.tyre_inspection_id
                                      );
                                    }}
                                  >
                                    Reject{" "}
                                    <FontAwesomeIcon
                                      icon={faXmark}
                                      style={{
                                        cursor: "pointer",
                                        marginLeft: 4,
                                      }}
                                    />
                                  </button>
                                </div>
                              )}
                            </div>
                            {/* <div><HomeDownloadPDF/></div> */}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
            </tbody>
          </table>

          {tyreClaims?.length === 0 ||
          tyreClaims[0]?.claim_batch_status === "processed" ? (
            ""
          ) : (
            <div className="tyre-claims-button">
              <button
                className="claim-submit-button"
                onClick={() => {
                  handleSubmitForLetterModal();
                }}
              >
                Submit
              </button>
            </div>
          )}

          {tyreClaims?.length === 0 && !loading && (
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
    </div>
  );
};

export default TyreClaims;
