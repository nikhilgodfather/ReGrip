import React, { useEffect, useState } from "react";
import "./AddUsers.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faEyeSlash, faEye } from "@fortawesome/free-solid-svg-icons";

import axios from "axios";
import { API_URL } from "../Config/index";
import { useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Select, Option, Checkbox } from "@mui/joy";

// const AddUsers = ({ setUsersModal, editUsersData, setEditUsersData, updateUserInTable }) => {
const AddUsers = ({
  setUsersModal,
  editUsersData,
  setEditUsersData,
  updateUserInTable,
  onClosing,
  setAddEmployeeModal,
}) => {
  const user = useSelector((state) => state.getUserDetails.users);

  const formFields = ["user_name", "phone", "email", "password", "role"];

  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState(editUsersData ? user.name : "");

  const [phone, setPhone] = useState(editUsersData ? user.mobile_number : "");
  const [email, setEmail] = useState(editUsersData ? user.email : "");
  const [password, setPassword] = useState(
    editUsersData ? user.password : "123456"
  );
  const [role, setRole] = useState(editUsersData ? user.role : "");
  const [isActive, setIsActive] = useState(editUsersData ? user.is_active : "");
  const [validName, setvalidName] = useState(true);
  const [validNumber, setvalidNumber] = useState(true);
  const [validEmail, setvalidEmail] = useState(true);

  const [userType, setUserType] = useState(
    editUsersData ? user.login_role_id : null
  );

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
      if (!editUsersData) {
        const add_data = {
          login_role_id: userType,
        };

        formFields.forEach((field) => {
          const element = event.target[field];
          if (element) {
            add_data[field] = element.value;
          }
        });
        if (!/^[A-Za-z\s]+$/.test(add_data.user_name)) {
          setvalidName(false);
          hasError = true;
        }

        if (!/^\d{10}$/.test(add_data.phone)) {
          setvalidNumber(false);
          hasError = true;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(add_data.email)) {
          setvalidEmail(false);
          hasError = true;
        }
        if (hasError) {
          return;
        }

        try {
          const result = await axios.post(`${API_URL}/user/addUser`, add_data);
          if (result) {
            console.log("User added successfully", result.data.message);
            updateUserInTable(add_data);
            // setUsersModal(false);
            changeModalState();
            setAddEmployeeModal();
            onClosing(result.data.message);
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
          login_role_id: userType,
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

        if (!/^\d{10}$/.test(update_data.phone)) {
          setvalidNumber(false);
          hasError = true;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(update_data.email)) {
          setvalidEmail(false);
          hasError = true;
        }
        if (hasError) {
          return;
        }

        update_data.user_id = editUsersData?.user_id || "";
        if (isActive === "") {
          update_data.is_active = editUsersData.is_active;
        } else {
          update_data.is_active = isActive;
        }
        try {
          const result = await axios.put(
            `${API_URL}/user/update_user`,
            update_data
          );
          if (result) {
            onClosing(result.data.message);
            console.log("User Updated successfully", result.data.message);
            updateUserInTable(update_data);
            setUsersModal(false);
            setEditUsersData(null);
            setAddEmployeeModal();
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

  function changeModalState() {
    setUsersModal(false);
    setEditUsersData(null);
    setName("");
    setEmail("");
    setPassword("");
    setPhone("");
    setRole("");
  }

  return (
    <div className="add-user-container">
      <ToastContainer style={{ width: "500px" }} />

      <div className="addUser-header">
        <h2>{editUsersData ? "Update User" : "Add Users"}</h2>
      </div>

      <div className="all-fields">
        <form onSubmit={handleFormSubmit}>
          <div className="align-fields">
            <div className="add-field-data">
              <label htmlFor="user_name">Enter Name</label>
              <input
                type="text"
                name="user_name"
                id="user_name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
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
              <label htmlFor="phone">Enter Mobile Number</label>
              <input
                type="text"
                name="phone"
                id="phone"
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
                  setvalidEmail(true);
                }}
              />
              {!validEmail && (
                <div
                  style={{
                    color: "red",
                    margin: "5px 0px 0px 5px",
                    // position: "absolute",
                    fontSize: 12,
                    // top: 47,
                  }}
                >
                  Please enter the valid email.
                </div>
              )}
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
            {/* <div className="add-field-data ">
              <label htmlFor="role">Enter Role</label>
              <input
                type="text"
                name="role"
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              />
            </div> */}
            <div className="add-field-data ">
              <label htmlFor="password">Select User Role</label>
              <Select
                value={userType}
                placeholder="Select User Role"
                onChange={(event, newValue) => {
                  setUserType(newValue);
                }}
              >
                <Option value={1}>Regrip</Option>
                <Option value={2}>JK</Option>
                <Option value={3}>Bridgestone</Option>
              </Select>
            </div>
          </div>

          <div className="align-fields">
            <div className="add-field-data">
              {editUsersData ? (
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
              {editUsersData ? "Update" : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUsers;
