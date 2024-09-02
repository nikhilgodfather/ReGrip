import { React, useEffect, useState } from "react";
import "./Fleet.css";
import axios from "axios";
import AddFleet from "../AddFleet/AddFleet";
import AddBranches from "../AddBranches/AddBranches";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faPenToSquare,
  faTrashCan,
  faCodeBranch,
  faChevronLeft,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../Config/index";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../common/common.css";
import { useSelector } from "react-redux";

const Fleet = () => {
  const currentUser = useSelector((state) => state.getCurrentUser.role_name);

  const dummmyArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const [loading, setLoading] = useState(true);
  const [fleetModal, setFleetModal] = useState(false);
  const [branchesModal, setBranchesModal] = useState(false);
  const [fleetAndSupplierNames, setFleetAndSupplierNames] = useState([]);
  const [branch, setBranch] = useState(false);
  const [selectedFleet, setSelectedFleet] = useState([]);
  const [fleetData, setFleetData] = useState([]);
  const [editFleetData, setEditFleetData] = useState(null);
  const [editBranchData, setEditBranchData] = useState(null);
  const [fleetId, setFleetId] = useState(null);
  const navigate = useNavigate();

  const handleBranchTable = (updatedData) => {
    if (updatedData.data.isBranchAdd) {
      setFleetData((prevData) => {
        const existingBranch = prevData.find(
          (branch) =>
            branch.supervisor_mobileno === updatedData.data.supervisor_mobile
        );

        if (existingBranch) {
          return prevData.map((branch) =>
            branch.supervisor_mobile === updatedData.data.supervisor_mobile
              ? updatedData.data
              : branch
          );
        } else {
          const newData = {
            ...updatedData.data,
            supervisor_mobileno: updatedData.data.supervisor_mobile,
          };
          return [...prevData, newData];
        }
      });
    } else {
      setFleetData((prevData) => {
        const updatedBranch = prevData.map((branch) => {
          if (branch.fleet_branch_id === updatedData.data.fleet_branch_id) {
            return {
              supervisor_mobileno: updatedData.data.supervisor_mobile,
              fleet_branch_location: updatedData.data.fleet_branch_location,
              supervisor_name: updatedData.data.supervisor_name,
            };
          }
          return branch;
        });
        return updatedBranch;
      });
    }
  };

  const getFleetAndSupplierData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) navigate("/");
      const bearer_token = "bearer " + JSON.parse(token);

      setLoading(true);
      const { data } = await axios.get(`${API_URL}/fleets/getFleetsData`, {
        headers: {
          Authorization: bearer_token,
        },
      });
      const fleets = data.rows;
      setLoading(false);
      setFleetAndSupplierNames(fleets);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const getFleetBySupplierID = async (fleetId) => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${API_URL}/fleets/getbranchesdata?fleetid=${fleetId}`
      );
      const fleetsBySupplierID = data.data.branches;
      setLoading(false);
      setFleetData(fleetsBySupplierID);
      console.log(fleetsBySupplierID);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const deleteFleet = async (fleet_id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this fleet details?"
    );
    if (!confirmDelete) {
      return;
    }
    try {
      await axios.delete(`${API_URL}/fleets/deleteFleet`, {
        data: { fleet_id },
      });
      // alert("Fleet Details deleted successfully!");
      toast.success("Fleet Details deleted successfully!", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 3000,
      });
      setFleetAndSupplierNames((prevSupplierData) =>
        prevSupplierData.filter((fleet) => fleet.fleet_id !== fleet_id)
      );
    } catch (error) {
      console.error(
        "An error occurred while deleting the Fleet Details:",
        error
      );
      alert("Failed to delete fleet.");
    }
  };

  const deleteFleetBranch = async (fleet_branch_id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this fleet details?"
    );
    if (!confirmDelete) {
      return;
    }
    try {
      await axios.delete(`${API_URL}/fleets/deletefleetbranch`, {
        data: { fleet_branch_id },
      });
      // alert("Fleet Details deleted successfully!");
      toast.success("Fleet Branch Details deleted successfully!", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 8000,
      });
      setFleetData((prevFleetData) =>
        prevFleetData.filter(
          (fleet_branch) => fleet_branch.fleet_branch_id !== fleet_branch_id
        )
      );
    } catch (error) {
      console.error(
        "An error occurred while deleting the Fleet Branch Details:",
        error
      );
      alert("Failed to delete fleet.");
    }
  };

  useEffect(() => {
    getFleetAndSupplierData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePopupClose = (message) => {
    getFleetAndSupplierData();

    toast.success(message, {
      position: toast.POSITION.TOP_CENTER,
      autoClose: 3000,
    });
  };
  const handleBranchPopupClose = (message, id) => {
    toast.success(message, {
      position: toast.POSITION.TOP_CENTER,
      autoClose: 3000,
    });
    getFleetBySupplierID(id);
  };

  return (
    <div className="Fleet-container" style={{ marginLeft: 0 }}>
      <ToastContainer className="custom-toast-container" />
      {!branch ? (
        <div className="Fleet-header">
          <div className="head">
            <h1 className="heading1">
              <FontAwesomeIcon
                onClick={() => {
                  navigate('/home')
                }}
                icon={faChevronLeft}
                color="#65a143"
                style={{ marginRight: 6, cursor: 'pointer' }}
              />
              Fleet
            </h1>
            {/* <p style={{ margin: 0 }}><span style={{ color: '#8a8a8a' }}>Home</span>/Fleet Details</p> */}
          </div>
          <button
            className="header-button"
            onClick={() => {
              setFleetModal(true);
            }}
          >
            <span>
              <FontAwesomeIcon
                icon={faPlus}
                style={{ color: "#ffffff", marginRight: "5px" }}
              />{" "}
              Add Fleet
            </span>
          </button>
          {fleetModal && (
            <AddFleet
              setFleetModal={setFleetModal}
              setEditFleetData={setEditFleetData}
              editFleetData={editFleetData}
              onClose={handlePopupClose}
            />
          )}
        </div>
      ) : (
        <div className="Fleet-header">
          <div className="head">
            <h1
              className="Fleet-heading"
              style={{
                marginBottom: "3px",
                textTransform: "capitalize",
                fontSize: "2vw",
                color: "#65a143",
                fontWeight: 500,
              }}
            >
              <FontAwesomeIcon
                icon={faChevronLeft}
                onClick={() => setBranch(false)}
                style={{ cursor: "pointer", marginRight: 6 }}
              />
              {selectedFleet}
            </h1>
            {/* <p style={{ margin: 0 }}>
                            <span style={{ color: "#8a8a8a" }}>
                                Home/
                                <span
                                    style={{ color: "#8a8a8a" }}
                                    className="fd"
                                    onClick={() => setBranch(false)}
                                >
                                    Fleet Details
                                </span>
                            </span>
                            /{selectedFleet}
                        </p> */}
          </div>
          <button
            className="header-button"
            onClick={() => {
              setBranchesModal(true);
            }}
          >
            <span>
              <FontAwesomeIcon
                icon={faPlus}
                style={{ color: "#ffffff", marginRight: "5px" }}
              />{" "}
              Add Branches
            </span>
          </button>
          {branchesModal && (
            <AddBranches
              setBranchesModal={setBranchesModal}
              selectedFleet={selectedFleet}
              editBranchData={editBranchData}
              setEditBranchData={setEditBranchData}
              fleetId={fleetId}
              handleBranchTable={handleBranchTable}
              onClose={handleBranchPopupClose}
            // onUpdate={getFleetBySupplierID}
            />
          )}
        </div>
      )}

      <div className="table-mega-container">
        <div className="table-container">
          <table className="Fleet-table">
            {!branch ? (
              <>
                <thead>
                  <tr className="table-heading">
                    <th style={{ borderTopLeftRadius: "15px" }}>SNo</th>
                    <th>Fleet Name</th>
                    {currentUser === "Regrip" ? <th>Supplier Name</th> : ""}
                    <th>Actions</th>
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
                        {currentUser === "Regrip" && (
                          <td>
                            <Skeleton />
                          </td>
                        )}
                      </tr>
                    ))
                    : fleetAndSupplierNames.map((names, i) => {
                      const {
                        fleet_id,
                        supplier_id,
                        supplier_name,
                        fleet_name,
                        is_deleted,
                      } = names;
                      return (
                        <tr className="table-data" key={i}>
                          <td>{i + 1}</td>
                          <td>{fleet_name}</td>
                          {currentUser === "Regrip" ? (
                            <td className="supplier-name-column">
                              {supplier_name}
                            </td>
                          ) : (
                            ""
                          )}
                          <td>
                            <div className="action-btn">
                              <div
                                className="edit-btn"
                                onClick={() => {
                                  setFleetModal(true);
                                  setEditFleetData(names);
                                }}
                              >
                                {"Edit "} 
                                <FontAwesomeIcon
                                  icon={faPenToSquare}
                                  // style={{ color: "#ffffff" }}
                                />
                              </div>
                              {
                                currentUser === "Regrip" &&
                                <div
                                  className="dlt-btn"
                                  onClick={() => {
                                    deleteFleet(fleet_id);
                                  }}
                                >
                                  {"Delete "}
                                  
                                  <FontAwesomeIcon
                                    icon={faTrashCan}
                                    // style={{ color: "#ffffff" }}
                                  />
                                </div>
                              }
                              <div
                                className="branch-btn"
                                onClick={() => {
                                  setBranch(true);
                                  setSelectedFleet(fleet_name);
                                  setFleetId(fleet_id);
                                  getFleetBySupplierID(fleet_id);
                                }}
                              >
                                {"Branches "}
                                <FontAwesomeIcon
                                  icon={faCodeBranch}
                                  // style={{ color: "#fff" }}
                                />
                              </div>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </>
            ) : (
              // Branch Table
              <>
                <thead>
                  <tr className="table-heading">
                    <th style={{ borderTopLeftRadius: "15px" }}>SNo</th>
                    <th>Branch Location</th>
                    <th>G-Location</th>
                    <th>Supervisor Name</th>
                    <th>Supervisor Mobile No.</th>
                    <th>Actions</th>
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
                      </tr>
                    ))
                    : fleetData.map((branches, i) => {
                      const {
                        fleet_branch_id,
                        fleet_id,
                        fleet_branch_location,
                        google_location,
                        supervisor_name,
                        supervisor_mobileno,
                      } = branches;
                      return (
                        <tr className="table-data" key={i}>
                          <td>{i + 1}</td>
                          <td>{fleet_branch_location}</td>
                          <td>{google_location}</td>
                          <td>{supervisor_name}</td>
                          <td>{supervisor_mobileno}</td>
                          <td>
                            <div className="action-btn">
                              <div
                                className="edit-btn"
                                onClick={() => {
                                  setBranchesModal(true);
                                  setEditBranchData(branches);
                                }}
                              >
                                {"Edit "}
                                <FontAwesomeIcon
                                  icon={faPenToSquare}
                                  // style={{ color: "#ffffff" }}
                                />
                              </div>
                              {
                                currentUser === "Regrip" &&
                                <div
                                  className="dlt-btn"
                                  onClick={() => {
                                    deleteFleetBranch(fleet_branch_id);
                                  }}
                                >
                                  {"Delete "}
                                  <FontAwesomeIcon
                                    icon={faTrashCan}
                                    // style={{ color: "#ffffff" }}
                                  />
                                </div>
                              }
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </>
            )}
          </table>
        </div>
      </div>
    </div>
  );
};

export default Fleet;
