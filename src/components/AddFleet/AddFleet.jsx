import React, { useEffect, useState } from "react";
import "./AddFleet.css";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import Select from "react-select";
import { API_URL } from "../Config/index";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";

const AddFleet = ({
  setFleetModal,
  setEditFleetData,
  editFleetData,
  onClose,
}) => {
  const form_fields = ["fleet_name"];
  const currentUser = useSelector((state) => state.getCurrentUser.role_name);

  const [showSupplierWarning, setShowSupplierWarning] = useState(false);
  const [supplierData, setSupplierData] = useState([]);

  const [selectedSupplier, setSelectedSupplier] = useState(null);

  const [fleetName, setFleetName] = useState(editFleetData?.fleet_name || "");

  const [fleetId, setFleetId] = useState(editFleetData?.fleet_id || "");

  const [id, setId] = useState("");

  function changeModalState() {
    setFleetModal(false);
    setEditFleetData(null);
    setFleetName("");
  }

  const getSupplierNames = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/supplier/getdata`);
      const { suppliers } = data;
      setSupplierData(suppliers);
    } catch (error) {
      console.error("An error occurred while fetching supplier data:", error);
      alert("Failed to fetch supplier data.");
    }
  };

  useEffect(() => {
    getSupplierNames();
  }, []);

  useEffect(() => {
    let compareUser = "";
    if (currentUser) {
      compareUser = currentUser.toLowerCase().trim();
    }
    const foundSupplier = supplierData.find(
      (supplier) => supplier.supplier_name.toLowerCase().trim() === compareUser
    );
    if (foundSupplier) {
      setSelectedSupplier(foundSupplier);
    }
  }, [supplierData, currentUser]);

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      width: "100%",
      height: "30px",
      border: state.isFocused ? "none" : "1px solid #ccc",
      borderRadius: "5px",
      boxShadow: state.isFocused ? "0 0 3px rgba(0, 0, 0, 0.2)" : "none",
      "&:hover": {
        borderColor: "#ccc",
        //
      },
    }),
  };

  const options = supplierData.map((supplier) => ({
    value: supplier.supplier_id,
    label: supplier.supplier_name,
  }));
  //

  const submitForm = async (event) => {
    event.preventDefault();
    if (!editFleetData) {
      const post_data = {};
      form_fields.forEach((field) => {
        const element = event.target[field];
        if (element) {
          post_data[field] = element.value;
        }
      });
      if (!selectedSupplier) {
        // Display a warning
        setShowSupplierWarning(true);
        return;
      }
      post_data.supplier_id =
        selectedSupplier.value || selectedSupplier.supplier_id;
      try {
        const result = await axios.post(
          `${API_URL}/fleets/addFleet`,
          post_data
        );
        if (result) {
          console.log("Fleet added successfully", result.data.message);
          changeModalState();
          onClose("Fleet Added Successfully.");
        }
      } catch (error) {
        if (error.response && error.response.status === 409) {
          toast.error("Fleet name already exist", {
            position: toast.POSITION.TOP_CENTER,
            // autoClose: 8000,
          });
        } else {
          console.error("Failed to add Fleet", error);
        }
      }
    } else {
      let edit_data = {};
      form_fields.forEach((field) => {
        const data = event.target[field];
        if (data) {
          edit_data[field] = data.value;
        }
      });
      edit_data = { ...editFleetData, ...edit_data };
      try {
        const result = await axios.put(
          `${API_URL}/fleets/updateFleet`,
          edit_data
        );
        if (result) {
          console.log("Fleet Update successfully", result.data.message);
          changeModalState();
          onClose("Fleet Updated Successfully.");
        }
      } catch (error) {
        if (error.response) {
          toast.error("oops! Can't update fleet details.", {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 8000,
          });
        } else {
          console.error("Failed to Update Fleet", error);
        }
      }
    }
  };

  return (
    <div className="modal-main-div">
      {/* <ToastContainer className="custom-toast-container" /> */}
      <div className="addFleet-container">
        <div className="addFleet-head">
          <div className="heading">
            <h2>{editFleetData ? "Update Fleet" : "Add Fleet"}</h2>
          </div>
          <div className="close-btn">
            <button onClick={changeModalState}>
              <FontAwesomeIcon icon={faXmark} style={{ color: "#ffffff" }} />
            </button>
          </div>
        </div>
        <form action="" className="addFleet-form" onSubmit={submitForm}>
          {currentUser === "Regrip" ? (
            <div
              className="addFleet-form-input"
              style={{ position: "relative" }}
            >
              <div className="addFleet-form-input">
                <input
                  type="hidden"
                  name="fleet_id"
                  id="fleet_id"
                  value={fleetId}
                  onChange={(e) => setFleetId(e.target.value)}
                />
              </div>
              <label htmlFor="supplier_name">Supplier Name</label>
              <Select
                styles={customStyles}
                options={options}
                value={selectedSupplier}
                onChange={(selectedOption) => {
                  setSelectedSupplier(selectedOption);
                  // setShowSupplierWarning(false)
                }}
                isSearchable
                placeholder={
                  editFleetData?.supplier_name || "Select supplier name"
                }
              />
              {/* Warning message for selecting a supplier */}
              {/* {showSupplierWarning && (
                        <div style={{
                            color: 'red', margin: '5px 0px 0px 5px', fontSize: 12, position: 'absolute', top: 55
                        }}>
                            Please select a supplier.
                        </div>
                    )} */}
            </div>
          ) : (
            ""
          )}

          <div className="addFleet-form-input">
            <label htmlFor="fleet_name">Fleet Name</label>
            <input
              type="text"
              name="fleet_name"
              id="fleet_name"
              value={fleetName}
              onChange={(e) => setFleetName(e.target.value)}
            />
          </div>
          <button type="submit" className="header-button">
            {editFleetData ? "Update" : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddFleet;
