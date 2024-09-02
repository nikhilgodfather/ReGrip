import React, { useEffect, useState } from "react";
import "./GenerateRequest.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import Select from "react-select";
import { API_URL } from "../Config/index";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Autocomplete, Input } from "@mui/joy";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import moment from "moment";
import dayjs from "dayjs";
import CircularProgress from "@mui/joy/CircularProgress";
import { Button, CircularProgress as MuiCircularProgress } from "@mui/material";
import "../../assets/Test_EXCEL.xlsx";
import Test_EXCEL from "./Test_EXCEL.xlsx";
import { ToastContainer, toast } from "react-toastify";

const Generate = ({
  setGenerateRequestModal,
  setEditFleetData,
  editFleetData,
  onClose,
  inspectorData,
  setInspectorData,
}) => {
  console.log(inspectorData);

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [loadingFleet, setLoadingFleet] = useState(false);
  const [loadingBranch, setLoadingBranch] = useState(false);
  const [fleetData, setFleetData] = useState([]);
  const [showFleetWarning, setShowFleetWarning] = useState(false);
  const [showBranchWarning, setShowBranchWarning] = useState(false);
  const [showTyreWarning, setShowTyreWarning] = useState(false);
  const [showUploadExcelWarning, setShowUploadExcelWarning] = useState(false);

  const [convertedDate, setConvertedDate] = useState(dayjs(new Date()));
  const [tyreCount, setTyreCount] = useState();
  const [requestType, setRequestType] = useState(true);
  const [selectedFleet, setSelectedFleet] = useState(null);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [fleetBranch, setFleetBranch] = useState([]);
  const [scrapExcel, setScrapExcel] = useState(null);

  const [tyreInspectionAssignmentId, setTyreInspectionAssignmentId] =
    useState(null);
  const [assignedEmployeeId, setAssignedEmployeeId] = useState(null);

  const getFleetAndSupplierData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) navigate("/");
      const bearer_token = "bearer " + JSON.parse(token);

      setLoadingFleet(true);
      const { data } = await axios.get(`${API_URL}/fleets/getFleetsData`, {
        headers: {
          Authorization: bearer_token,
        },
      });
      const fleets = data.rows;
      setLoadingFleet(false);
      setFleetData(fleets);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoadingFleet(false);
    }
  };
  const getFleetBranch = async (fleetId) => {
    try {
      setLoadingBranch(true);
      const { data } = await axios.get(
        `${API_URL}/fleets/getbranchesdata?fleetid=${fleetId}`
      );
      const fleetsBySupplierID = data.data.branches;
      setFleetBranch(fleetsBySupplierID);
      setLoadingBranch(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoadingBranch(false);
    }
  };

  const form_fields = ["tyre_count"];

  const convertDate = (dateString) => {
    const date = new Date(dateString);
    const formattedDate = `${date.getDate()}/${
      date.getMonth() + 1
    }/${date.getFullYear()}`;
    return formattedDate;
  };

  // const handleFileName = (e) => {
  //   const uploadedFile = e.target.files[0];
  //   const newFileName = `renamed`;
  //   const renamedFile = new File([uploadedFile], newFileName, {
  //     type: uploadedFile.type,
  //   });
  //   setScrapExcel(renamedFile);
  //   console.log("Renamed File Name:", renamedFile.name, renamedFile.type);
  // };


  const handleGenerateRequest = async (e) => {
    e.preventDefault();
    const post_data = {};
    // form_fields.forEach((field) => {
    //   const element = e.target[field];
    //   if (element) {
    //     post_data[field] = element.value;
    //   }
    // });
    post_data.date = convertDate(convertedDate.$d);
    if (
      !selectedFleet ||
      !selectedBranch ||
      !tyreCount ||
      Number(tyreCount) === 0
    ) {
      !selectedFleet && setShowFleetWarning(true);
      !selectedBranch && setShowBranchWarning(true);
      (!tyreCount || Number(tyreCount) === 0) && setShowTyreWarning(true);
      return;
    }
    if (!inspectorData) {
      if (!requestType && !scrapExcel) {
        setShowUploadExcelWarning(true);
        return;
      }
    }
    const formData = new FormData();
    post_data.fleet_id = selectedFleet.value;
    post_data.fleet_branch_id = selectedBranch.value;
    post_data.tyre_count = Number(tyreCount);
    post_data.direct_request = false;
    post_data.is_scrap = requestType ? false : true;

    if (inspectorData) {
      post_data.tyre_inspection_assignment_id = tyreInspectionAssignmentId;
      post_data.assigned_employee_id = assignedEmployeeId;
     
    }
    
    scrapExcel && formData.append("excel", scrapExcel);
    formData.append("postdata", JSON.stringify(post_data));

    if (inspectorData) {
      try {
        const token = localStorage.getItem("token");
        const bearer_token = "bearer " + JSON.parse(token);
        setLoading(true);
        let generateRequest;
        generateRequest = await axios.patch(
          `${API_URL}/inspection-assignments`,
          formData,
          {
            headers: {
              Authorization: bearer_token,
            },
          }
        );

        console.log(generateRequest);

        if (generateRequest.status === 200) {
          changeModalState();
          setInspectorData();
          toast.success("Request Updated Successfully.", {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 2000,
          });
          onClose();
        }
        setLoading(false);
      } catch (error) {
        if (error.response) {
          toast.error(error.response.data.message, {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 2000,
          });
        } else {
          toast.error("Failed To Update ", {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 2000,
          });
          console.error("Failed To Update", error);
        }
        setLoading(false);
      }
    } else {
      try {
        setLoading(true);
        let generateRequest;
        generateRequest = await axios.post(
          `${API_URL}/inspection-assignments/generate-request`,
          formData
        );

        console.log(generateRequest);

        if (generateRequest.status === 200) {
          changeModalState();
          onClose();
          toast.success("Generated Request Successfully.", {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 2000,
          });
        }
        setLoading(false);
      } catch (error) {
        if (error.response) {
          toast.error(error.response.data.message, {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 2000,
          });
        } else {
          toast.error("Failed to generate request", {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 2000,
          });
          console.error("Failed to Generate Request", error);
        }
        setLoading(false);
      }
    }
  };

  function changeModalState() {
    setGenerateRequestModal(false);
  }
  const options = fleetData.map((fleet) => ({
    value: fleet.fleet_id,
    label: fleet.fleet_name,
  }));
  useEffect(() => {
    if (inspectorData) {
      if (inspectorData) {
        const {
          fleet_id,
          fleet_name,
          fleet_branch_id,
          fleet_branch_name,
          inspection_batch_id,
          tyre_count,
          date,
          tyre_inspection_assignment_id,
        } = inspectorData;
        setTyreInspectionAssignmentId(
          tyre_inspection_assignment_id && tyre_inspection_assignment_id
        );
        setRequestType(
          inspection_batch_id && inspection_batch_id ? true : false
        );
        setSelectedFleet({ value: fleet_id, label: fleet_name });
        setSelectedBranch({ value: fleet_branch_id, label: fleet_branch_name });
        getFleetBranch(fleet_id && fleet_id);
        setTyreCount(tyre_count && tyre_count);
        setConvertedDate(dayjs(date));
      }
    }
    getFleetAndSupplierData();
  }, []);
  return (
    <div className="generateRequest">
      <ToastContainer className="custom-toast-container" />
      <div className="generateRequest-head">
        <div className="heading">
          <h2 style={{ color: "#53a336", fontSize: "25px" }}>
            {inspectorData
              ? `Edit ${
                  inspectorData?.inspection_batch_id ? "Inspection" : "Scrap"
                } Request`
              : "Generate Request"}
          </h2>
        </div>
      </div>
      <div style={{ flex: 1, overflow: "scroll" }}>
        {!inspectorData && (
          <div
            className="generateRequest-form-input"
            style={{ padding: "0px 20px" }}
          >
            <label htmlFor="select-type">Type*</label>
            <div className="generateRequest-form-type-input" id="select-type">
              <button
                className={`generateRequest-form-type-button ${
                  requestType ? "generateRequest-form-type-selected" : ""
                }`}
                onClick={() => {
                  setRequestType(true);
                }}
              >
                Inspection
              </button>
              <button
                className={`generateRequest-form-type-button ${
                  !requestType ? "generateRequest-form-type-selected" : ""
                }`}
                onClick={() => {
                  setRequestType(false);
                }}
              >
                Scrap
              </button>
            </div>
          </div>
        )}
        <form
          className="generateRequest-form"
          action=""
          onSubmit={handleGenerateRequest}
        >
          <div className="generateRequest-form-input">
            {!requestType ? (
              <>
                <div className="generateRequest-form-input" style={{ gap: 2 }}>
                  <label htmlFor="select-fleet">Select Fleet*</label>
                  <Autocomplete
                    className="background-color"
                    style={{
                      border: showFleetWarning
                        ? " 1px solid red"
                        : " 1px solid #ccc",
                    }}
                    placeholder="Select Fleet"
                    options={options.map((fleet, index) => ({
                      label: fleet.label,
                      value: fleet.value,
                      key: index,
                    }))}
                    value={selectedFleet}
                    loading={loadingFleet}
                    endDecorator={
                      loadingFleet ? (
                        <CircularProgress
                          size="sm"
                          sx={{ bgcolor: "background.surface" }}
                        />
                      ) : null
                    }
                    onChange={(event, selectedOption) => {
                      setShowFleetWarning(false);
                      setSelectedBranch([]);
                      setSelectedFleet(selectedOption);
                      selectedOption && getFleetBranch(selectedOption.value);
                    }}
                  />
                </div>
                <div className="generateRequest-form-input" style={{ gap: 2 }}>
                  <label htmlFor="select-branch">Select Branch*</label>
                  <Autocomplete
                    placeholder="Select Branch"
                    className="background-color"
                    style={{
                      border: showBranchWarning
                        ? " 1px solid red"
                        : " 1px solid #ccc",
                    }}
                    options={fleetBranch.map((branch, index) => ({
                      label: branch.fleet_branch_location,
                      value: branch.fleet_branch_id,
                      key: index,
                    }))}
                    value={selectedBranch}
                    loading={loadingBranch}
                    endDecorator={
                      loadingBranch ? (
                        <CircularProgress
                          size="sm"
                          sx={{ bgcolor: "background.surface" }}
                        />
                      ) : null
                    }
                    onChange={(event, selectedOption) => {
                      setShowBranchWarning(false);
                      setSelectedBranch(selectedOption);
                    }}
                  />
                </div>

                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <div
                    className="generateRequest-form-input"
                    style={{ gap: 2, width: "47%" }}
                  >
                    <label htmlFor="tyre_count">Tyre Count*</label>
                    <Input
                      placeholder="Tyre Count"
                      style={{
                        border: showTyreWarning
                          ? " 1px solid red"
                          : " 1px solid #ccc",
                      }}
                      className="background-color"
                      type="number"
                      value={tyreCount}
                      InputProps={{
                        inputProps: { min: 0 },
                      }}
                      onChange={(e) => {
                        setShowTyreWarning(false);
                        if (e.target.value < 0) {
                          setTyreCount(0);
                        } else {
                          setTyreCount(e.target.value);
                        }
                      }}
                    />
                  </div>

                  <div
                    className="generateRequest-form-input"
                    style={{ gap: 2, width: "47%" }}
                  >
                    <label htmlFor="date">Select Inspection Date*</label>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        className="date-picker"
                        value={convertedDate}
                        // disableFuture={true}
                        defaultValue={dayjs(new Date())}
                        disablePast={true}
                        format="DD/MM/YYYY"
                        onChange={(e) => {
                          setConvertedDate(e);
                        }}
                      />
                    </LocalizationProvider>
                  </div>
                </div>

                <div
                  className="generateRequest-form-input"
                  style={{ gap: 0, position: "relative", height: "auto" }}
                >
                  <div
                    className="generateRequest-form-input"
                    style={{ position: "relative", gap: 0, width: "100%" }}
                  >
                    <label htmlFor="select-fleet">Upload Data Excel</label>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <input
                        style={{ width: "60%" }}
                        accept=".xlsx, .xls"
                        type="file"
                        onChange={(e) => {
                          setScrapExcel(e.target.files[0]);
                          // handleFileName(e)
                        }}
                      />
                      <button
                        className="download-sample"
                        style={{ cursor: "pointer" }}
                      >
                        <a href={Test_EXCEL} download>
                          Download Sample
                        </a>
                      </button>
                    </div>
                  </div>
                  {showUploadExcelWarning && (
                    <div
                      style={{
                        color: "red",
                        fontSize: "12px",
                        marginLeft: "5px",
                        marginTop: "50px",
                        position: "absolute",
                      }}
                    >
                      Please Upload Excel
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <div className="generateRequest-form-input" style={{ gap: 2 }}>
                  <label htmlFor="select-fleet">Select Fleet*</label>
                  <Autocomplete
                    className="background-color"
                    style={{
                      border: showFleetWarning
                        ? " 1px solid red"
                        : " 1px solid #ccc",
                    }}
                    placeholder="Select Fleet"
                    options={options.map((fleet, index) => ({
                      label: fleet.label,
                      value: fleet.value,
                      key: index,
                    }))}
                    value={selectedFleet}
                    loading={loadingFleet}
                    endDecorator={
                      loadingFleet ? (
                        <CircularProgress
                          size="sm"
                          sx={{ bgcolor: "background.surface" }}
                        />
                      ) : null
                    }
                    onChange={(event, selectedOption) => {
                      setShowFleetWarning(false);
                      setSelectedBranch([]);
                      setSelectedFleet(selectedOption);
                      selectedOption && getFleetBranch(selectedOption.value);
                    }}
                  />
                </div>
                <div className="generateRequest-form-input" style={{ gap: 2 }}>
                  <label htmlFor="select-branch">Select Branch*</label>
                  <Autocomplete
                    placeholder="Select Branch"
                    className="background-color"
                    style={{
                      border: showBranchWarning
                        ? " 1px solid red"
                        : " 1px solid #ccc",
                    }}
                    options={fleetBranch.map((branch, index) => ({
                      label: branch.fleet_branch_location,
                      value: branch.fleet_branch_id,
                      key: index,
                    }))}
                    value={selectedBranch}
                    loading={loadingBranch}
                    endDecorator={
                      loadingBranch ? (
                        <CircularProgress
                          size="sm"
                          sx={{ bgcolor: "background.surface" }}
                        />
                      ) : null
                    }
                    onChange={(event, selectedOption) => {
                      setShowBranchWarning(false);
                      setSelectedBranch(selectedOption);
                    }}
                  />
                </div>

                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <div
                    className="generateRequest-form-input"
                    style={{ gap: 2, width: "47%" }}
                  >
                    <label htmlFor="tyre_count">Tyre Count*</label>
                    <Input
                      placeholder="Tyre Count"
                      style={{
                        border: showTyreWarning
                          ? " 1px solid red"
                          : " 1px solid #ccc",
                      }}
                      className="background-color"
                      type="number"
                      value={tyreCount}
                      InputProps={{
                        inputProps: { min: 0 },
                      }}
                      onChange={(e) => {
                        setShowTyreWarning(false);
                        if (e.target.value < 0) {
                          setTyreCount(0);
                        } else {
                          setTyreCount(e.target.value);
                        }
                      }}
                    />
                  </div>

                  <div
                    className="generateRequest-form-input"
                    style={{ gap: 2, width: "47%" }}
                  >
                    <label htmlFor="date">Select Inspection Date*</label>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        className="date-picker"
                        value={convertedDate}
                        // disableFuture={true}
                        defaultValue={dayjs(new Date())}
                        disablePast={true}
                        format="DD/MM/YYYY"
                        onChange={(e) => {
                          setConvertedDate(e);
                        }}
                      />
                    </LocalizationProvider>
                  </div>
                </div>
                <div
                  className="generateRequest-form-input"
                  style={{ gap: 0, width: "100%" }}
                >
                  <label htmlFor="select-fleet">Upload Data Excel</label>
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <input
                      style={{ width: "60%" }}
                      type="file"
                      accept=".xlsx, .xls"
                      onChange={(e) => {
                        setScrapExcel(e.target.files[0]);
                        // handleFileName(e)
                      }}
                    />
                    <button
                      className="download-sample"
                      style={{ cursor: "pointer" }}
                    >
                      <a href={Test_EXCEL} download>
                        Download Sample
                      </a>
                    </button>
                  </div>
                </div>
              </>
            )}

            {loading ? (
              <button type="submit" className="generateRequest-submit-btn">
                <MuiCircularProgress
                  style={{ color: "white", width: 15, height: 15 }}
                />
              </button>
            ) : (
              <button type="submit" className="generateRequest-submit-btn">
                Submit
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Generate;
