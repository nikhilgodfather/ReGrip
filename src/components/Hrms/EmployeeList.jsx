import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../Config/index";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "../../common/common.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import AddEmployees from "../AddEmployees/AddEmployees";
import EmployeDetails from "../ShowEmployeIndividualDetail/EmployeDetails";
import "./EmployeeList.css";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Modal, ModalClose, Sheet } from "@mui/joy";

const EmployeeList = () => {
  const dummmyArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const [getAllEmployees, setGetAllEmployees] = useState();

  const [loading, setLoading] = useState(true);
  const [EmployeeModal, setEmployeeModal] = useState(false);
  const [editEmployeesData, seteditEmployeesData] = useState(null);
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);

  const [employeeListVisible, setEmployeeListVisible] = useState(true);
  const navigate = useNavigate();
  const [openPersonalDetailsModal, setOpenPersonalDetailsModal] =
    useState(false);

  const [employeeData, setEmployeeData] = useState();

  const onclickhandle = () => {
    setShowEmployeeModal(true);
    setEmployeeListVisible(false);
  };

  const onAddEmployeeModaClose = () => {
    try {
      getAllEmployeeData();
    } catch (e) {
      console.lgo("Error:", e.message);
    }
  };

  const getAllEmployeeData = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/employee/employees`);
      const Employees = data;
      setLoading(false);
      setGetAllEmployees(Employees.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    getAllEmployeeData();
  }, []);

  return (
    <div className="Fleet-container" style={{ marginLeft: 0 }}>
      <ToastContainer style={{ width: "400px" }} />

      <Modal
        aria-labelledby="modal-title"
        aria-describedby="modal-desc"
        open={openPersonalDetailsModal}
        onClose={() => {
          setOpenPersonalDetailsModal(false);
        }}
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <Sheet
          variant="plain"
          sx={{
            width: "95%",
            height: "95%",
            borderRadius: "md",
            p: 3,
            boxShadow: "lg",
            position: "relative",
            overflow: "scroll",
          }}
        >
          <ModalClose variant="plain" sx={{ m: 0 }} />
          <EmployeDetails
            setOpenPersonalDetailsModal={setOpenPersonalDetailsModal}
            employeeData={employeeData}
            employees={getAllEmployees}
            getAllEmployeeData={getAllEmployeeData}
          />
        </Sheet>
      </Modal>

      <Modal
        aria-labelledby="modal-title"
        aria-describedby="modal-desc"
        open={EmployeeModal}
        onClose={() => {
          setEmployeeModal(false);
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
          <AddEmployees
            setEmployeeModal={setEmployeeModal}
            editEmployeesData={editEmployeesData}
            employees={getAllEmployees}
            onClose={onAddEmployeeModaClose}
          />
        </Sheet>
      </Modal>

      {employeeListVisible && (
        <div>
          <div className="Fleet-header">
            <div className="head" style={{ display: "flex" }}>
              <h1 className="heading1" style={{ marginBottom: "3px" }}>
                <FontAwesomeIcon
                  onClick={() => {
                    navigate('/organization')
                  }}
                  icon={faChevronLeft}
                  color="#65a143"
                  style={{ marginRight: 6, cursor: "pointer" }}
                />
                Employees
              </h1>
            </div>
            {/* {EmployeeModal && (
              <AddEmployees
                setEmployeeModal={setEmployeeModal}
                editEmployeesData={editEmployeesData}
                employees={getAllEmployees}
                onClose={onAddEmployeeModaClose}
              />
            )} */}

            <button
              className="header-button"
              onClick={() => {
                setEmployeeModal(true);
              }}
            >
              <span>
                <FontAwesomeIcon
                  icon={faPlus}
                  style={{ color: "#ffffff", marginRight: "5px" }}
                />{" "}
                Add Employee
              </span>
            </button>
          </div>
          <div className="table-mega-container">
            <div className="table-container">
              <table className="Fleet-table">
                <thead>
                  <tr className="table-heading">
                    <th style={{ borderTopLeftRadius: "15px" }}>SNo</th>
                    <th> Name</th>
                    <th>Mobile No</th>
                    {/* <th>Job Title</th> */}
                    <th>department Name</th>
                  </tr>
                </thead>
                <tbody>
                  {loading === true
                    ? dummmyArray.map((i) => (
                        <tr className="table-data" key={i}>
                          <td style={{ height: 70 }}>
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
                    : getAllEmployees.map((employee, i) => {
                        const {
                          first_name,
                          // job_title,
                          last_name,
                          mobile_number,
                          department_name,
                        } = employee;
                        return (
                          <tr className="table-data" key={i}>
                            <td>{i + 1}</td>
                            <td>
                              <button
                                className="Employee-individual-detail-button"
                                onClick={() => {
                                  setOpenPersonalDetailsModal(true);
                                  setEmployeeData(employee);
                                }}
                              >
                                {first_name} {last_name}
                              </button>
                            </td>
                            <td>{mobile_number}</td>
                            {/* <td>{job_title}</td> */}
                            <td style={{ textTransform: "capitalize" }}>
                              {department_name}
                            </td>
                          </tr>
                        );
                      })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeList;
