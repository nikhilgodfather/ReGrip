import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faChevronLeft,
  faPenToSquare,
} from "@fortawesome/free-solid-svg-icons";
import { Modal, ModalClose, Sheet } from "@mui/joy";
import AddOffshore from "./AddOffshore/AddOffshore";
import axios from "axios";
import { API_URL } from "../../Config";
import Skeleton from "react-loading-skeleton";
import { getUserDetails } from "../../../redux/actions/UserAction";
import { useDispatch } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const OffshoreSales = () => {
  const [loading, setLoading] = useState(true);
  const dummmyArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const [getAllTempSales, setGetAllTempSales] = useState([]);
  const [editTempSalesData, setEditTempSalesData] = useState(null);

  const [openAddOffshore, setOpenAddOffshore] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const getAllTempSalesData = async () => {
    try {
      const { data } = await axios.get(
        `${API_URL}/appuser?app_user_type=temp_sales`
      );
      console.log(data.data);
      setLoading(false);
      setGetAllTempSales(data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const updateUserInTable = (updatedUserData) => {
    setGetAllTempSales((prevUserData) => {
      const updatedUsers = prevUserData.map((user) => {
        if (user.app_user_id === updatedUserData.app_user_id) {
          return {
            app_user_id: updatedUserData.app_user_id,
            firm_name: updatedUserData.firm_name,
            mobile_number: updatedUserData.mobile,
            email: updatedUserData.email,
            password: updatedUserData.password,
            is_active: updatedUserData.is_active,
          };
        }
        return user;
      });
      return updatedUsers;
    });
  };

  const handlePopupClosing = (message) => {
    getAllTempSalesData();
    console.log("message", message);
    console.log("user");
    toast.success(message, {
      position: toast.POSITION.TOP_CENTER,
      autoClose: 8000,
    });
  };

  useEffect(() => {
    getAllTempSalesData();
  }, []);

  return (
    <div className="Fleet-container" style={{ marginLeft: 0 }}>
      <ToastContainer className="custom-toast-container" />

      <Modal
        aria-labelledby="modal-title"
        aria-describedby="modal-desc"
        open={openAddOffshore}
        onClose={() => {
          setOpenAddOffshore(false);
          setEditTempSalesData(null);
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
          <AddOffshore
            // setEmployeeModal={setEmployeeModal}
            // editEmployeesData={editEmployeesData}
            // employees={getAllEmployees}
            // onClose={onAddEmployeeModaClose}
            setOpenAddOffshore={setOpenAddOffshore}
            editTempSalesData={editTempSalesData}
            setEditTempSalesData={setEditTempSalesData}
            updateUserInTable={updateUserInTable}
            handlePopupClosing={handlePopupClosing}
          />
        </Sheet>
      </Modal>
      <div className="Fleet-header">
        <h1
          onClick={() => {
            navigate('/organization')
          }}
          className="heading1"
          style={{ marginBottom: 30, cursor: "pointer" }}
        >
          <FontAwesomeIcon
            icon={faChevronLeft}
            color="#65a143"
            style={{ marginRight: 6, cursor: "pointer" }}
          />
          OffShore Sales
        </h1>
        <button
          className="header-button"
          onClick={() => {
            setOpenAddOffshore(true);
          }}
        >
          <span>
            <FontAwesomeIcon
              icon={faPlus}
              style={{ color: "#ffffff", marginRight: "5px" }}
            />
            Add OffShore Sales
          </span>
        </button>
      </div>
      <div className="table-mega-container">
        <div className="table-container">
          <table className="Fleet-table">
            <thead>
              <tr className="table-heading">
                <th style={{ borderTopLeftRadius: "15px" }}>SNo</th>
                <th>SalesPerson Name</th>
                <th>Mobile Number</th>
                <th>Email</th>
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
                : getAllTempSales?.map((tempsale, i) => {
                    const {
                      firm_name,
                      mobile,
                      email,
                      app_user_type,
                      is_active,
                    } = tempsale;
                    return (
                      <tr className="table-data" key={i}>
                        <td>{i + 1}</td>
                        <td>{firm_name}</td>
                        <td>{mobile}</td>
                        <td>{email}</td>
                        {/* <td>
                          {login_role_id === 1
                            ? "Regrip"
                            : login_role_id === 2
                            ? "JK"
                            : "Bridgestone"}
                        </td> */}
                        {/* <td>{app_user_type}</td> */}
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
                                setOpenAddOffshore(true);
                                setEditTempSalesData(tempsale);
                                // dispatch(getUserDetails(user))
                                dispatch(getUserDetails(tempsale));
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

export default OffshoreSales;
