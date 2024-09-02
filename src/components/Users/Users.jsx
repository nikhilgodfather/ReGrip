import { React, useEffect, useState } from "react";
import "./Users.css";
import axios from "axios";
import AddUsers from "../AddUsers/AddUsers";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faPenToSquare,
  faChevronLeft,
} from "@fortawesome/free-solid-svg-icons";
import { API_URL } from "../Config/index";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useDispatch } from "react-redux";
import { getUserDetails } from "../../redux/actions/UserAction";
import "../../common/common.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Modal, ModalClose, Sheet } from "@mui/joy";
import { useNavigate } from "react-router-dom";

const Users = () => {
  const dummmyArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const [loading, setLoading] = useState(true);
  const [usersModal, setUsersModal] = useState(false);
  const [getAllUsers, setGetAllUsers] = useState([]);
  const [editUsersData, setEditUsersData] = useState(null);
  const [employeeModal, setAddEmployeeModal] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const getAllUsersData = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/user/users`);
      const { Users } = data;
      setLoading(false);
      setGetAllUsers(Users);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const updateUserInTable = (updatedUserData) => {
    setGetAllUsers((prevUserData) => {
      console.log("user", updatedUserData);
      const updatedUsers = prevUserData.map((user) => {
        if (user.user_id === updatedUserData.user_id) {
          return {
            user_id: updatedUserData.user_id,
            name: updatedUserData.user_name,
            mobile_number: updatedUserData.phone,
            email: updatedUserData.email,
            password: updatedUserData.password,
            role: updatedUserData.role,
            is_active: updatedUserData.is_active,
          };
        }
        return user;
      });
      return updatedUsers;
    });
  };

  useEffect(() => {
    getAllUsersData();
  }, []);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handlePopupClosing = (message) => {
    getAllUsersData();
    console.log("message", message);
    console.log("user");
    toast.success(message, {
      position: toast.POSITION.TOP_CENTER,
      autoClose: 8000,
    });
  };

  return (
    <div className="Fleet-container" style={{ marginLeft: 0 }}>
      <ToastContainer className="custom-toast-container" />

      <Modal
        aria-labelledby="modal-title"
        aria-describedby="modal-desc"
        open={employeeModal}
        onClose={() => {
          setAddEmployeeModal(false);
          setEditUsersData(null);
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
          }}
        >
          <ModalClose variant="plain" sx={{ m: 0 }} />
          <AddUsers
            setUsersModal={setUsersModal}
            editUsersData={editUsersData}
            setEditUsersData={setEditUsersData}
            updateUserInTable={updateUserInTable}
            onClosing={handlePopupClosing}
            setAddEmployeeModal={setAddEmployeeModal}
          />
        </Sheet>
      </Modal>

      <div className="Fleet-header">
        <h1 className="heading1" style={{ marginBottom: 30 }}>
          <FontAwesomeIcon
            onClick={() => {
              navigate('/organization')
            }}
            icon={faChevronLeft}
            color="#65a143"
            style={{ marginRight: 6, cursor: "pointer" }}
          />
          Users
        </h1>
        {/* <div className="head">
                <h1 className="heading1" style={{ marginBottom: '3px' }}>Users Details{userUpdated}</h1>
            </div> */}
        {/* {usersModal && } */}
        <button
          className="header-button"
          onClick={() => {
            setAddEmployeeModal(true);
          }}
        >
          <span>
            <FontAwesomeIcon
              icon={faPlus}
              style={{ color: "#ffffff", marginRight: "5px" }}
            />{" "}
            Add Users
          </span>
        </button>
      </div>
      <div className="table-mega-container">
        <div className="table-container">
          <table className="Fleet-table">
            <thead>
              <tr className="table-heading">
                <th style={{ borderTopLeftRadius: "15px" }}>SNo</th>
                <th>User Name</th>
                <th>User Mobile Number</th>
                <th>User Email</th>
                <th>User Role</th>
                <th>User Account</th>
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
                      <td>
                        <Skeleton />
                      </td>
                    </tr>
                  ))
                : getAllUsers.map((user, i) => {
                    const {
                      name,
                      mobile_number,
                      email,
                      role,
                      is_active,
                      login_role_id,
                    } = user;
                    return (
                      <tr className="table-data" key={i}>
                        <td>{i + 1}</td>
                        <td>{name}</td>
                        <td>{mobile_number}</td>
                        <td>{email}</td>
                        <td>
                          {login_role_id === 1
                            ? "Regrip"
                            : login_role_id === 2
                            ? "JK"
                            : "Bridgestone"}
                        </td>
                        <td style={{ cursor: "pointer" }}>
                          {is_active ? (
                            <span className="Active">Active</span>
                          ) : (
                            <span className="Inactive">Inactive</span>
                          )}
                        </td>
                        <td>
                          <div className="action-btn">
                            <div
                              className="edit-btn"
                              onClick={() => {
                                setAddEmployeeModal(true);
                                setEditUsersData(user);
                                // dispatch(getUserDetails(user))
                                dispatch(getUserDetails(user));
                              }}
                            >
                              <FontAwesomeIcon icon={faPenToSquare} />
                            </div>
                            {/* <div className="dlt-btn"> <FontAwesomeIcon icon={faTrashCan} style={{ color: "#ffffff", }} /></div> */}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Users;
