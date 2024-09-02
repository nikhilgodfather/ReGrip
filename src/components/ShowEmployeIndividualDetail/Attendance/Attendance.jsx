import React, { useEffect, useState } from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import axios from "axios";
import { API_URL } from "../../Config";
import Skeleton from "react-loading-skeleton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import "./Attendance.css";

const Attendance = ({ employeeData }) => {
  const date = new Date();
  const [selectedMonth, setSelectedMonth] = useState(date.getMonth() + 1);
  const monthNumber = date.getMonth() + 1;
  const [selectedYear, setSelectedYear] = useState(date.getFullYear());

  const [attendance, setAttendance] = useState();
  const [loading, setLoading] = useState(true);
  const dummmyArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  const handleMonthChange = async (e) => {
    try {
      setSelectedMonth(e.$M + 1);
      setSelectedYear(e.$y);
    } catch (e) {
      console.log(e.message);
    }
  };

  const getEmployeeDetails = async () => {
    try {
      const body = {
        employee_id: employeeData.employee_id,
        month: selectedMonth,
        year: selectedYear,
      };
      console.log(body);
      const { data } = await axios.get(`${API_URL}/employee/attendance`, {
        params: body,
      });

      setAttendance(data.data);
      setLoading(false);
    } catch (error) {
      console.error("An error occurred while fetching attendance data:", error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);

    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear().toString().slice(-2);

    return `${day}-${month}-${year}`;
  };
  useEffect(() => {
    getEmployeeDetails();
  }, [selectedMonth]);
  return (
    <div>
      <div className="date-picker-container">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            className="date-picker"
            variant="inline"
            openTo="year"
            views={["year", "month"]}
            helperText="Start from year selection"
            onChange={(e) => handleMonthChange(e)}
          />
        </LocalizationProvider>
      </div>
      <table className="attendance-table">
        <thead>
          <tr className="table-heading">
            <th style={{ borderTopLeftRadius: "15px" }}>SNo</th>
            <th>Date</th>
            <th>Check-in Time</th>
            <th>Check-out Time</th>
            <th style={{ borderTopRightRadius: "15px" }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {loading === true
            ? dummmyArray.map((i) => (
                <tr className="table-data" key={i}>
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
            : attendance.map((names, i) => {
                const {
                  attendance_date,
                  check_in_time,
                  check_out_time,
                  is_weekend,
                  holiday_name,
                } = names;

                const getStatus = () => {
                  if (holiday_name) {
                    return <span className="holiday">{holiday_name}</span>; // Apply className "holiday" for holiday
                  } else if (is_weekend) {
                    return <span className="weekend">Weekend</span>; // Apply className "weekend" for weekend
                  } else {
                    const status = check_in_time ? "Present" : "Absent";
                    return (
                      <span className={check_in_time ? "present" : "absent"}>
                        {status}
                      </span>
                    ); // Apply classNames "present" or "absent" based on check_in_time
                  }
                };

                let formattedCheckInTime;
                if (check_in_time) {
                  const f = check_in_time.split(":");
                  formattedCheckInTime = f[0] + ":" + f[1];
                }

                let formattedCheckOutTime;
                if (check_out_time) {
                  const f = check_out_time.split(":");
                  formattedCheckOutTime = f[0] + ":" + f[1];
                }

                return (
                  <tr className="table-data" key={i}>
                    <td>{i + 1}</td>
                    <td>{formatDate(attendance_date)}</td>
                    <td>{check_in_time ? formattedCheckInTime : "--/--"}</td>
                    <td>{check_out_time ? formattedCheckOutTime : "--/--"}</td>
                    <td className="status">{getStatus()}</td>
                  </tr>
                );
              })}
        </tbody>
      </table>
    </div>
  );
};

export default Attendance;
