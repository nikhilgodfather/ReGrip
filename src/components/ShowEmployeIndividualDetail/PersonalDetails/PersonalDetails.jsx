import React, { useEffect, useState } from "react";
import "./PersonalDetails.css";
import { Button, CircularProgress, Input, Option, Select } from "@mui/joy";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { format } from "date-fns";
import Checkbox from "@mui/joy/Checkbox";

import { API_URL } from "../../Config";
import dayjs from "dayjs";
const PersonalDetails = ({ employeeData, employees, getAllEmployeeData }) => {
  const [loading, setLoading] = useState(true);

  const [open, setOpen] = useState(false);
  const [openDate, setOpenDate] = useState(false);

  const [employee_id, setEmployee_id] = useState(null);

  const [residentialAddress, setResidentialAddress] = useState("");
  const [gender, setGender] = useState("");

  const [dob, setDob] = useState();
  const [joiningDate, setJoiningDate] = useState();

  const [jobTitle, setJobTitle] = useState("");
  const [officeAddress, setOfficeAddress] = useState("");
  const [employeeType, setEmployeeType] = useState("");

  const [allDepartment, setAllDepartment] = useState();
  const [regions, setRegions] = useState([]);

  const [regionId, setRegionId] = useState([]);

  const [department_id, setdepartment_id] = useState("");
  const [reporting_person_id, setreporting_person_id] = useState("");

  const [salesTarget, setSalesTarget] = useState(false);
  const [doInspection, setDoInspection] = useState(false);

  console.log(salesTarget, doInspection);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear().toString();

    return `${day}-${month}-${year}`;
  };

  const handleUpdate = async () => {
    // console.log("shshs",format(new Date(dob), 'yyyy/MM/dd'));
    try {
      const data = {
        date_of_birth: formatDate(dob),
        // date_of_birth: format(new Date(dob), 'yyyy/MM/dd'),
        // start_date: startDate.format("DD-MM-YYYY"),
        gender: gender,
        residential_address: residentialAddress,
        job_title: jobTitle,
        department_id: department_id,
        office_address: officeAddress,
        reporting_person_id: reporting_person_id,
        employee_type: employeeType,
        employee_region_id: regionId,
        date_of_joining: formatDate(joiningDate),
        can_sales: salesTarget,
        can_investigate: doInspection,
      };
      setLoading(true);

      const response = await axios.patch(
        `${API_URL}/employee?employee_id=${employee_id}`,
        data
      );
      console.log("Res", response);
      toast.success(response?.data?.message, {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 2000,
      });
      getAllEmployeeData();

      setLoading(false);
    } catch (error) {
      toast.error("Error while updating employee", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 2000,
      });
    }
  };

  let reportingPersons = [];

  const getDepartment = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/employee/department`);
      setAllDepartment(data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const getRegions = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/regions`);
      setRegions(data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  if (employees) {
    reportingPersons = employees?.map((department) => ({
      value: department.employee_id,
      label: department.first_name + " " + department.last_name,
    }));
  }

  useEffect(() => {
    if (employeeData) {
      setJobTitle(employeeData?.job_title);
      setResidentialAddress(employeeData?.residential_address);
      setGender(employeeData?.gender);

      const formattedDate = formatDate(employeeData?.date_of_birth);
      setDob(dayjs(formattedDate, "DD-MM-YYYY"));

      const formattedDateJoining = formatDate(employeeData?.date_of_joining);
      setJoiningDate(dayjs(formattedDateJoining, "DD-MM-YYYY"));

      setOfficeAddress(employeeData?.office_address);
      setEmployeeType(employeeData?.employee_type);
      setRegionId(employeeData?.employee_region_id);
      setdepartment_id(employeeData?.department_id);
      setreporting_person_id(employeeData?.reporting_person_id);
      setEmployee_id(employeeData?.employee_id);
      setSalesTarget(employeeData?.can_sales);
      setDoInspection(employeeData?.can_investigate);
    }

    getDepartment();
    getRegions();
  }, [employeeData]);

  return (
    <div className="details">
      <ToastContainer className="custom-toast-container" />

      <div className="main-container-personal">
        <h3 className="employee-head">Profile</h3>

        <div className="update-align-employees">
          <p>
            <span>Employee ID</span>
            {employeeData.employee_id ? (
              employeeData.employee_id
            ) : (
              <span>--/--</span>
            )}
          </p>
        </div>
        <div className="update-align-employees">
          <p>
            <span>Date of Birth</span>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                sx={{ maxWidth: "280px", width: "100%" }}
                className="date-picker"
                value={dob}
                onChange={(date) => {
                  setDob(date);
                }}
                format="DD-MM-YYYY"
                open={openDate}
                onClose={() => setOpenDate(false)}
                slotProps={{
                  textField: {
                    onClick: () => setOpenDate(true),
                  },
                }}
              />
            </LocalizationProvider>
          </p>
        </div>
        <div className="update-align-employees">
          <p>
            <span>Gender</span>
            <Select
              value={gender}
              className="personalDetailsInputData"
              onChange={(e, newValue) => setGender(newValue)}
            >
              <Option value="M">Male</Option>
              <Option value="F">Female</Option>
              <Option value="Others">Others</Option>
            </Select>
          </p>
        </div>

        <div className="update-align-employees">
          <p>
            <span>Residential Address</span>
            <Input
              className="personalDetailsInputData"
              type="text"
              value={residentialAddress}
              onChange={(e) => setResidentialAddress(e.target.value)}
            />
          </p>
        </div>

        <div className="update-align-employees">
          <p>
            <span>Job Title</span>
            <Input
              className="personalDetailsInputData"
              type="text"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
            />
          </p>
        </div>
      </div>

      <div className="line"></div>
      <div className="main-container-office">
        <h3 className="employee-head">Department</h3>

        <div className="update-align-employees">
          <p>
            <span>Department Name</span>
            <Select
              value={department_id}
              className="personalDetailsInputData"
              onChange={(e, newValue) => {
                setdepartment_id(newValue);
              }}
            >
              {allDepartment?.map((department) => (
                <Option
                  key={department?.department_id}
                  value={department?.department_id}
                >
                  {department?.department_name}
                </Option>
              ))}
            </Select>
          </p>
          <p>
            <span>Office Address</span>
            <Input
              className="personalDetailsInputData"
              type="text"
              value={officeAddress}
              onChange={(e) => setOfficeAddress(e.target.value)}
            />
          </p>
        </div>

        <div className="update-align-employees">
          <p>
            <span>Reporting Person Name</span>
            <Select
              value={reporting_person_id}
              className="personalDetailsInputData"
              onChange={(e, newValue) => {
                setreporting_person_id(newValue);
              }}
            >
              {reportingPersons?.map((department) => (
                <Option key={department.value} value={department.value}>
                  {department.label}
                </Option>
              ))}
            </Select>
          </p>

          <p>
            <span>Employee Type</span>
            <Input
              className="personalDetailsInputData"
              type="text"
              value={employeeType}
              onChange={(e) => setEmployeeType(e.target.value)}
            />
          </p>
        </div>

        <div className="update-align-employees">
          <p>
            <span>Employee Regions</span>
            <Select
              className="personalDetailsInputData"
              defaultValue={[]}
              value={regionId}
              multiple
              onChange={(event, newValue) => {
                setRegionId(newValue);
              }}
              sx={
                {
                  // minWidth: "20rem",
                }
              }
              slotProps={{
                listbox: {
                  sx: {
                    width: "100%",
                  },
                },
              }}
            >
              {regions?.map((region) => (
                <Option key={region?.region_id} value={region?.region_id}>
                  {region?.region_name}
                </Option>
              ))}
            </Select>
          </p>

          <p>
            <span>Date of Joining</span>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                sx={{ maxWidth: "280px", width: "100%" }}
                className="date-picker "
                value={joiningDate}
                onChange={(date) => {
                  setJoiningDate(date);
                }}
                format="DD-MM-YYYY"
                open={open}
                onClose={() => setOpen(false)}
                slotProps={{
                  textField: {
                    onClick: () => setOpen(true),
                  },
                }}
              />
            </LocalizationProvider>
          </p>
        </div>

        <div className="update-align-employees">
          <p>
            <span>Can Do Sales</span>
            <Checkbox
              className="custom-checkbox"
              label="Can do sales"
              checked={salesTarget}
              onChange={(event) => {
                setSalesTarget(event.target.checked);
              }}
            />
          </p>

          <p>
            <span>Can Do Inspection</span>
            <Checkbox
              className="custom-checkbox"
              label="Can do inspection"
              checked={doInspection}
              onChange={(event) => {
                setDoInspection(event.target.checked);
              }}
            />
          </p>
        </div>
      </div>

      <Button
        className="header-button-employee-update"
        onClick={() => handleUpdate()}
      >
        Update
      </Button>
    </div>
  );
};

export default PersonalDetails;
