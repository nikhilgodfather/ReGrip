import React, { useState } from "react";
import "../../../Users/Users.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEyeSlash, faEye } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Checkbox } from "@mui/joy";
import "./AddOffshore.css";
import { API_URL } from "../../../Config";

// const AddUsers = ({ setUsersModal, editTempSalesData, setEditTempSalesData, updateUserInTable }) => {
const AddOffshore = ({
  updateUserInTable,
  onClosing,
  setOpenAddOffshore,
  editTempSalesData,
  setEditTempSalesData,
  handlePopupClosing,
}) => {
  const user = useSelector((state) => state.getUserDetails.users);

  const formFields = ["firm_name", "mobile", "password", "role"];

  const [showPassword, setShowPassword] = useState(false);
  const [firmName, setFirmName] = useState(
    editTempSalesData ? user.firm_name : ""
  );

  const [phone, setPhone] = useState(editTempSalesData ? user.mobile : "");
  const [email, setEmail] = useState(editTempSalesData ? user.email : "");

  const [password, setPassword] = useState(
    editTempSalesData ? user.password : "123456"
  );

  const [role, setRole] = useState(editTempSalesData ? user.role : "");
  const [isActive, setIsActive] = useState(
    editTempSalesData ? user.is_active : ""
  );
  const [validName, setvalidName] = useState(true);
  const [validNumber, setvalidNumber] = useState(true);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleToggle = () => {
    const newStatus = !isActive;
    setIsActive(newStatus);
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    let hasError = false;
    try {
      if (!editTempSalesData) {
        const add_data = {
          app_user_type: "temp_sales",
          email: email,
        };

        formFields.forEach((field) => {
          const element = event.target[field];
          if (element) {
            add_data[field] = element.value;
          }
        });
        if (!/^[A-Za-z\s]+$/.test(add_data.firm_name)) {
          setvalidName(false);
          hasError = true;
        }

        if (!/^\d{10}$/.test(add_data.mobile)) {
          setvalidNumber(false);
          hasError = true;
        }
        // if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(add_data.email)) {
        //   setvalidEmail(false);
        //   hasError = true;
        // }
        if (hasError) {
          return;
        }

        try {
          const result = await axios.post(
            `${API_URL}/appuser/signup`,
            add_data
          );
          if (result) {
            console.log("User added successfully", result.data.message);
            updateUserInTable(add_data);

            changeModalState();
            handlePopupClosing(result.data.message);
          }
        } catch (error) {
          if (error.response && error.response.status === 409) {
            toast.error("oops! Can't add user details already exist", {
              position: toast.POSITION.TOP_CENTER,
              autoClose: 3000,
            });
            console.log("oops! Can't add user details already exist");
          } else {
            console.log("oops! Can't add user details.", error);
          }
        }
      } else {
        const update_data = {
          email: email,
        };
        formFields.forEach((field) => {
          const element = event.target[field];
          if (element) {
            update_data[field] = element.value;
          }
        });
        if (!/^[A-Za-z\s]+$/.test(update_data.user_name)) {
          setvalidName(false);
          hasError = true;
        }

        if (!/^\d{10}$/.test(update_data.mobile)) {
          setvalidNumber(false);
          hasError = true;
        }

        if (hasError) {
          return;
        }

        update_data.app_user_id = editTempSalesData ? user.app_user_id : "";
        if (isActive === "") {
          update_data.is_active = editTempSalesData.is_active;
        } else {
          update_data.is_active = isActive;
        }
        try {
          const result = await axios.patch(
            `${API_URL}/appuser?app_user_id=${update_data.app_user_id}`,
            update_data
          );
          if (result) {
            handlePopupClosing(result.data.message);
            console.log("User Updated successfully", result.data.message);
            updateUserInTable(update_data);
            // setUsersModal(false);
            setEditTempSalesData(null);
            setOpenAddOffshore(false);
          }
        } catch (error) {
          if (error.response) {
            // alert("oops! Can't update user details.")
            toast.error("oops! Can't update user details.", {
              position: toast.POSITION.TOP_CENTER,
              autoClose: 8000,
            });
            console.log("oops! Can't update user details.");
          } else {
            console.error("Failed to Update user", error);
          }
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const changeModalState = () => {
    setOpenAddOffshore(false);
    setEditTempSalesData(null);
    setFirmName("");
    setEmail("");
    setPassword("");
    setPhone("");
  };

  return (
    <div className="add-user-container">
      <ToastContainer style={{ width: "500px" }} />

      <div className="addUser-header">
        <h2>
          {editTempSalesData ? "Update OffShore Sales" : "Add OffShore Sales"}
        </h2>
      </div>

      <div className="all-fields">
        <form onSubmit={handleFormSubmit}>
          <div className="align-fields">
            <div className="add-field-data">
              <label htmlFor="firm_name">Enter SalesPerson Name</label>
              <input
                type="text"
                name="firm_name"
                id="firm_name"
                value={firmName}
                onChange={(e) => {
                  setFirmName(e.target.value);
                  setvalidName(true);
                }}
              />
              {!validName && (
                <div
                  style={{
                    color: "red",
                    margin: "5px 0px 0px 5px",
                    // position: "absolute",
                    fontSize: 12,
                    // top: 47,
                  }}
                >
                  Please enter valid alphabetic characters.
                </div>
              )}
            </div>
            <div className="add-field-data">
              <label htmlFor="mobile">Enter Mobile Number</label>
              <input
                type="text"
                name="mobile"
                id="mobile"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  setvalidNumber(true);
                }}
              />
              {!validNumber && (
                <div
                  style={{
                    color: "red",
                    margin: "5px 0px 0px 5px",
                    // position: "absolute",
                    fontSize: 12,
                    // top: 47,
                  }}
                >
                  Please enter valid Number.
                </div>
              )}
            </div>
          </div>

          <div className="align-fields">
            <div className="add-field-data">
              <label htmlFor="email">Enter Email</label>
              <input
                type="email"
                name="email"
                id="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
            </div>

            <div className="add-field-data">
              <label htmlFor="password">Enter Password</label>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  border: "1px solid hsl(210, 8%, 75%)",
                  borderRadius: "0.5rem",
                }}
              >
                <input
                  style={{ border: "none", width: "100%" }}
                  type={showPassword ? "text" : "password"}
                  name="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <span>
                  {showPassword ? (
                    <FontAwesomeIcon
                      icon={faEyeSlash}
                      onClick={togglePasswordVisibility}
                      style={{ margin: "0px 4px", cursor: "pointer" }}
                    />
                  ) : (
                    <FontAwesomeIcon
                      icon={faEye}
                      onClick={togglePasswordVisibility}
                      style={{ margin: "0px 4px", cursor: "pointer" }}
                    />
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* <div className="align-fields"></div> */}

          <div className="align-fields">
            <div className="add-field-data">
              {editTempSalesData ? (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  {/* <input
                    type="checkbox"
                    id="deactivateUser"
                    onChange={handleToggle}
                    checked={isActive}
                  /> */}
                  <Checkbox
                    label="Status"
                    id="deactivateUser"
                    onChange={handleToggle}
                    checked={isActive}
                  />
                  <label>
                    {/* <span style={{ fontSize: "13px" }}>Status</span>{" "} */}
                    {isActive ? (
                      <span className="Active">Active</span>
                    ) : (
                      <span className="Inactive">Inactive</span>
                    )}
                  </label>
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
          <div
            className="align-fields"
            style={{ justifyContent: "center", marginBottom: "20px" }}
          >
            <button type="submit" className="add-employees-in-button">
              {editTempSalesData ? "Update" : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddOffshore;
