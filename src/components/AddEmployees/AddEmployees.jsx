import React, { useEffect, useState } from "react";
import { API_URL } from "../Config/index";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faEyeSlash, faEye } from "@fortawesome/free-solid-svg-icons";
import Checkbox from "@mui/joy/Checkbox";
import { ToastContainer, toast } from "react-toastify";

import Select from "react-select";
import "./AddEmployees.css";
const AddEmployees = ({
  setEmployeeModal,
  editEmployeesData,
  employees,
  onClose,
}) => {
  const formFields = [
    "first_name",
    "last_name",
    "residential_address",
    "reporting_person_id",
    "date_of_joining",
    "office_address",
    "mobile_no",
    "date_of_birth",
    "gender",
    "salary",
    "password",
    "employee_status",
    "job_title",
    "email",
    "employee_type",
    "emergency_contact",
  ];
  // const employee = editEmployeesData;
  // console.log("name:",employee.name)

  const [first_name, setfirst_name] = useState("");
  const [last_name, setlast_name] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("123456");
  const [residential_address, setresidential_address] = useState("");
  const [isActive, setIsActive] = useState("");
  const [job_title, setjob_title] = useState("");
  const [employee_type, setemployee_type] = useState("");
  const [emergency_contact, setemergency_contact] = useState("");
  const [is_deleted, setis_deleted] = useState("");
  const [employee_status, setemployee_status] = useState("");
  const [salary, setsalary] = useState("");
  const [gender, setgender] = useState("");
  const [date_of_birth, setdate_of_birth] = useState("");
  const [mobile_no, setmobile_no] = useState("");
  const [office_address, setoffice_address] = useState("");
  const [date_of_joining, setdate_of_joining] = useState("");
  const [reporting_person_id, setreporting_person_id] = useState("");
  const [department_id, setdepartment_id] = useState("");
  const [validEmail, setvalidEmail] = useState(true);
  const [validNumber, setvalidNumber] = useState(true);
  const [validFirstName, setvalidFirstName] = useState(true);
  const [validlastName, setvalidlastName] = useState(true);
  const [validJobtitle, setvalidJobtitle] = useState(true);
  const [validemployeeType, setvalidemployeeType] = useState(true);
  const [validofficeAddress, setvalidofficeAddress] = useState(true);
  const [validResidentialAddress, setvalidResidentialAddress] = useState(true);
  const [validPassword, setvalidPassword] = useState(true);
  const [validSalary, setvalidSalary] = useState(true);
  const [validDateOfJoining, setvalidDateOfJoining] = useState(true);
  const [validDateOfBirth, setvalidDateOfBirth] = useState(true);
  const [validGender, setvalidGender] = useState(true);
  const [validReportingPersonID, setvalidReportingPersonID] = useState(true);
  const [validdepartmentID, setvaliddepartmentID] = useState(true);
  const [validemployeestatus, setvalidemployeestatus] = useState(true);
  const [departmentData, setdepartmentData] = useState();
  const [regions, setRegions] = useState([]);
  const [employee_region_id, setemployee_region_id] = useState([]);

  const [salesTarget, setSalesTarget] = useState(false);
  const [doInspection, setDoInspection] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  let options = [];
  let reportingPersons = [];

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
      },
    }),
  };

  const getRegions = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/regions`);
      setRegions(data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const getDepartmentName = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/employee/department`);
      setdepartmentData(data.data);
      console.log("cvbhnj", data);
    } catch (error) {
      console.error(
        "An error occurred while fetching departmentName data:",
        error
      );
      alert("Failed to fetch departmentName data.");
    }
  };

  const handleSubmitForm = async (event) => {
    event.preventDefault();
    let hasError = false;
    try {
      if (!editEmployeesData) {
        const add_data = {};
        console.log({ formFields });
        formFields.forEach((field) => {
          const element = event.target[field];
          if (element) {
            add_data[field] = element.value;
          }
        });
        add_data.department_id = department_id.value;
        add_data.reporting_person_id = reporting_person_id.value;
        add_data.can_sales = salesTarget;
        add_data.can_investigate = doInspection;
        add_data.employee_region_id =
          employee_region_id &&
          employee_region_id?.map((region) => region.value);
        if (!/^[A-Za-z\s]+$/.test(add_data.first_name)) {
          setvalidFirstName(false);
          hasError = true;
        }
        if (!/^[A-Za-z\s]+$/.test(add_data.last_name)) {
          setvalidlastName(false);
          hasError = true;
        }
        // if (!/^[A-Za-z\s]+$/.test(add_data.job_title)) {
        //     setvalidJobtitle(false)
        //     hasError = true
        // }
        // if (!/^[A-Za-z\s]+$/.test(add_data.employee_type)) {
        //     setvalidemployeeType(false)
        //     hasError = true
        // }
        if (!/^\d{10}$/.test(add_data.mobile_no)) {
          setvalidNumber(false);
          hasError = true;
        }
        // if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(add_data.email)) {
        //     setvalidEmail(false)
        //     hasError = true
        // }
        // if (!residential_address) {
        //     setvalidResidentialAddress(false)
        //     hasError = true
        // }
        // if (!office_address) {
        //     setvalidofficeAddress(false)
        //     hasError = true
        // }
        if (!password) {
          setvalidPassword(false);
          hasError = true;
        }
        // if (!salary) {
        //     setvalidSalary(false)
        //     hasError = true
        // }
        // if (!gender) {
        //     setvalidGender(false)
        //     hasError = true
        // }
        // if (!date_of_birth) {
        //     setvalidDateOfBirth(false)
        //     hasError = true
        // }
        // if (!date_of_joining) {
        //     setvalidDateOfJoining(false)
        //     hasError = true
        // }
        if (!department_id) {
          setvaliddepartmentID(false);
          hasError = true;
        }

        // if (!reporting_person_id) {
        //     setvalidReportingPersonID(false)
        //     hasError = true
        // }
        // if (!employee_status) {
        //     setvalidemployeestatus(false)
        //     hasError = true
        // }
        if (hasError) {
          return;
        }
        console.log(add_data);
        const result = await axios.post(
          `${API_URL}/employee/addEmployee`,
          add_data
        );
        if (result) {
          // console.log("Employe added successfully", result.data.message);
          // setUsersModal(false);
          toast.success(result.data.message, {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 2000,
          });
          changeModalState();
        }
      }
    } catch (error) {
      if (error.response && error.response.status === 409) {
        // alert("oops! Can't add user details already exist")
        console.log(error);
        console.log("oops! Can't add employe details already exist");
        toast.error(error.response.data.message, {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 2000,
        });
      } else {
        console.log("oops! Can't add Employee details.", error.message);
      }
    }
  };
  function changeModalState() {
    setEmployeeModal(false);
    onClose();
    setEmail("");
    setmobile_no("");
    setfirst_name("");
    setlast_name("");
    setresidential_address("");
    setIsActive("");
    setjob_title("");
    setemployee_type("");
    setemergency_contact("");
    setis_deleted("");
    setoffice_address("");
    setdate_of_joining("");
    setreporting_person_id("");
    setdepartment_id("");
    setemployee_status("");
    setsalary("");
    setdate_of_birth("");
    setgender("");
    setPassword("");
    setemployee_region_id([]);
    setSalesTarget(false);
    setDoInspection(false);
  }
  useEffect(() => {
    getRegions();
    getDepartmentName();
  }, []);

  if (departmentData) {
    options = departmentData.map((department) => ({
      value: department.department_id,
      label: department.department_name,
    }));
  }

  if (employees) {
    reportingPersons = employees.map((department) => ({
      value: department.employee_id,
      label: department.first_name + " " + department.last_name,
    }));
  }

  return (
    <div className="add-employee-container">
      <ToastContainer style={{ width: "500px" }} />

      <div className="employee-header">
        <h2>Add Employee</h2>
      </div>

      <div className="all-fields">
        <form onSubmit={handleSubmitForm}>
          <div className="align-fields">
            <div className="add-field-data">
              <label htmlFor="first_name">Enter first Name</label>
              <input
                type="text"
                name="first_name"
                id="first_name"
                value={first_name}
                onChange={(e) => {
                  setfirst_name(e.target.value);
                  setvalidFirstName(true);
                }}
              />
              {!validFirstName && (
                <div
                  style={{
                    color: "red",
                    margin: "5px 0px 0px 5px",
                    // position: "absolute",
                    fontSize: 11,
                    // top: 47,
                  }}
                >
                  Please enter valid First Name.
                </div>
              )}
            </div>
            <div className="add-field-data">
              <label htmlFor="last_name">Enter last Name</label>
              <input
                type="text"
                name="last_name"
                id="last_name"
                value={last_name}
                onChange={(e) => {
                  setlast_name(e.target.value);
                  setvalidlastName(true);
                }}
              />
              {!validlastName && (
                <div
                  className="validation"
                  style={{
                    color: "red",
                    margin: "5px 0px 0px 5px",
                    // position: "absolute",
                    fontSize: 11,
                    // top: 47,
                  }}
                >
                  Please enter valid Last Name.
                </div>
              )}
            </div>
          </div>

          <div className="align-fields">
            <div className="add-field-data">
              <label htmlFor="phone">Enter Mobile Number</label>
              <input
                type="text"
                name="mobile_no"
                id="phone"
                value={mobile_no}
                onChange={(e) => {
                  setmobile_no(e.target.value);
                  setvalidNumber(true);
                }}
              />
              {!validNumber && (
                <div
                  style={{
                    color: "red",
                    margin: "5px 0px 0px 5px",
                    // position: "absolute",
                    fontSize: 11,
                    // top: 47,
                  }}
                >
                  Please enter the valid number.
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
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setvalidPassword(true);
                  }}
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

              {!validPassword && (
                <div
                  style={{
                    color: "red",
                    margin: "5px 0px 0px 5px",
                    // position: "absolute",
                    fontSize: 12,
                    // top: 47,
                  }}
                >
                  Please enter the valid password
                </div>
              )}
            </div>
          </div>

          <div className="align-fields">
            <div className="add-field-data">
              <label htmlFor="department_id">Select Department</label>
              {/* <input
                                                    type="text"
                                                    name="department_id"
                                                    id="department_id"
                                                    value={department_id}
                                                    onChange={(e) => {
                                                        setdepartment_id(e.target.value)
                                                        setvaliddepartmentID(true)
                                                    }}
                                                /> */}

              <Select
                styles={customStyles}
                options={options}
                value={department_id}
                onChange={(selectedOption) => {
                  setdepartment_id(selectedOption);
                  setvaliddepartmentID(true);
                }}
                isSearchable
                placeholder={"Select department"}
              />
              {!validdepartmentID && (
                <div
                  style={{
                    color: "red",
                    margin: "5px 0px 0px 5px",
                    // position: "absolute",
                    fontSize: 11,
                    // top: 55,
                  }}
                >
                  Please enter the required details
                </div>
              )}
            </div>

            <div className="add-field-data">
              <label htmlFor="region">Select Region</label>
              <div>
                <Select
                  isMulti
                  styles={customStyles}
                  options={regions.map((region) => ({
                    value: region.region_id,
                    label: region.region_name,
                  }))}
                  value={employee_region_id}
                  onChange={(selectedOption) => {
                    setemployee_region_id(selectedOption);
                  }}
                  isSearchable
                  placeholder="Select region"
                />
              </div>
            </div>
          </div>

          <div className="align-fields">
            <div className="add-field-data">
              <label htmlFor="reporting_person_id">
                Selct Reporting Person
              </label>
              <div className="report-filters">
                {/* <Autocomplete
                  style={{ width: "200px" }}
                  className="reports-filter-selectors"
                  placeholder="Customer"
                  options={customerData.map((customer) => ({
                    label: customer.customer_name,
                    value: customer.customer_id,
                  }))}
                  getOptionLabel={(option) => option.label}
                  getOptionKey={(option) => option.value}
                  value={selectedCustomer}
                  onChange={(event, newValue) => {
                    setSelectedCustomer(newValue);
                  }}
                /> */}
              </div>
              <Select
                styles={customStyles}
                options={reportingPersons}
                value={reporting_person_id}
                onChange={(selectedOption) => {
                  setreporting_person_id(selectedOption);
                  setvalidReportingPersonID(true);
                }}
                isSearchable
                placeholder={"Selct Reporting Person"}
              />
              {!validReportingPersonID && (
                <div
                  style={{
                    color: "red",
                    margin: "5px 0px 0px 5px",
                    // position: "absolute",
                    fontSize: 12,
                    // top: 47,
                  }}
                >
                  Please enter the required details
                </div>
              )}
            </div>

            <div className="add-field-data ">
              <label htmlFor="email">Enter Email</label>
              <input
                type="text"
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
                    fontSize: 11,
                    // top: 47,
                  }}
                >
                  Please enter the valid email.
                </div>
              )}
            </div>
          </div>

          <div className="align-fields" style={{ margin: "50px 0px" }}>
            <div className="add-field-data ">
              <Checkbox
                label="Can do sales"
                checked={salesTarget}
                onChange={(event) => {
                  setSalesTarget(event.target.checked);
                }}
              />
            </div>

            <div className="add-field-data ">
              <Checkbox
                label="Can do inspection"
                checked={doInspection}
                onChange={(event) => {
                  setDoInspection(event.target.checked);
                }}
              />
            </div>
          </div>
          <div
            className="align-fields"
            style={{ justifyContent: "center", marginBottom: "20px" }}
          >
            <button type="submit" className="add-employees-in-button">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEmployees;
