import { faChevronLeft, faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { API_URL } from "../../Config";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, Tooltip } from '@mui/material';
import './AllAttendance.css'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import dayjs from "dayjs";
import Skeleton from "react-loading-skeleton";
import AllAttendanceExcel from "./AllAttendanceExcel/AllAttendanceExcel";
import { useNavigate } from "react-router-dom";

const AllAttendance = () => {
    const [open, setOpen] = useState(false);
    const date = new Date();
    const dummyArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const [selectedMonth, setSelectedMonth] = useState(date.getMonth() + 1)
    const monthNumber = date.getMonth() + 1;
    const [selectedYear, setSelectedYear] = useState(date.getFullYear())
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [attendance, setAttendance] = useState([]);
    const [allAttendanceData, setAllAttendanceData] = useState([]);
    const [firstTimeLoad, setFirstTimeLoad] = useState(true)
    const navigate = useNavigate();

    const handleMonthChange = async (e) => {
        try {
            setSelectedMonth(e.$M + 1)
            setSelectedYear(e.$y)
        }
        catch (e) {
            console.log(e.message)
        }
    }

    const getMonthName = (monthNumber) => {
        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const monthname = months[monthNumber - 1]
        return monthname
    };



    const getStatus = (holiday_name, is_weekend, isCurrentDate) => {
        if (holiday_name) {
            return <span className="holiday">{holiday_name}</span>; // Apply className "holiday" for holiday
        }
        else if (isCurrentDate) {
            return <span>--/--</span>;

        } else if (is_weekend) {
            return <span className="weekend">Weekend</span>; // Apply className "weekend" for weekend
        } else {
            return <span className="absent">Absent</span>;
        }
    };



    const getAllAttendance = async () => {
        try {
            setLoading(true)
            const { data } = await axios.get(`${API_URL}/employee/allattendancebymonth`, {
                params: {
                    month: selectedMonth,
                    year: selectedYear
                }
            })
            setLoading(false)
            setAttendance(data.data[0].attendance)
            setAllAttendanceData(data.data)
        }
        catch (e) {
            console.log("Error:", e.message)
        }
    }



    useEffect(() => {
        const fetchDataAndScroll = async () => {
            try {
                await getAllAttendance();
                if (firstTimeLoad) {

                    setTimeout(() => {
                        const lastRow = document.querySelector('table tr td:last-child')
                        if (lastRow) {
                            lastRow.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "end" });
                        }
                    }, 700);
                }
                setFirstTimeLoad(false)
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchDataAndScroll();
        getMonthName()

    }, [selectedMonth]);



    return (
        <div className="all-attendance">
            <div className="head" style={{ display: 'flex', justifyContent: "space-between", alignItems: "center" }}>
                <h1 className="heading1" style={{ marginBottom: '3px' }}>
                    <FontAwesomeIcon
                        onClick={() => {
                            navigate('/organization')
                        }}
                        icon={faChevronLeft}
                        color="#65a143"
                        style={{ marginRight: 6, cursor: 'pointer' }}
                    />
                    All Attendance
                </h1>
                {console.log(selectedMonth)}
                <AllAttendanceExcel attendance={attendance} allAttendanceData={allAttendanceData} selectedMonth={getMonthName(selectedMonth)} />
            </div>
            <div className="all-attendance-container">
                <div style={{ marginTop: "8px" }} className='date-picker-container'>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            className='date-picker'
                            variant="inline"
                            openTo="year"
                            disableFuture={true}
                            defaultValue={dayjs(new Date())}
                            open={open}
                            onClose={() => setOpen(false)}
                            slotProps={{
                                textField: {
                                    onClick: () => setOpen(true),
                                },
                            }}
                            views={["year", "month"]}
                            helperText="Start from year selection"
                            onChange={(e) => handleMonthChange(e)}
                        />
                    </LocalizationProvider>
                </div>
                <div className="table-mega-container" style={{ flex: 1, height: 'auto', overflow: 'scroll', width: '100%' }} >
                    <TableContainer className="table-customer" style={{ overflow: 'visible' }} id="table">
                        <Table style={{ width: 'auto' }} variant="outlined" >
                            <TableHead>
                                <TableRow className="table-report">
                                    <TableCell className="sicky_column">Name</TableCell>
                                    {attendance && attendance.map((col, index) => {
                                        return (
                                            <TableCell className={index === attendance.length - 1 ? "last-cell" : ""}>{col.attendance_date ? new Date(col.attendance_date).toLocaleDateString('en-IN') : null} </TableCell>
                                        )
                                    })
                                    }
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {loading === true ? (
                                    dummyArray.map((i) => (
                                        <TableRow className="table-data skeleton" key={i}>
                                            <TableCell>
                                                <Skeleton />
                                            </TableCell>
                                            <TableCell>
                                                <Skeleton />
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (allAttendanceData && allAttendanceData).map((employee, i) => {

                                    return (
                                        <TableRow key={i} className="table-data">
                                            <TableCell className="capitalize-text sicky_column"  style={{background:"#F7F7F7"}}>{employee.employee_name}</TableCell>
                                            {
                                                employee.attendance.map((data) => {
                                                    const isCurrentDate = dayjs(data.attendance_date).isSame(dayjs(), 'day');
                                                    return (
                                                        <TableCell className={isCurrentDate && "current-date"}  >
                                                            {
                                                                !data.check_in_time ?
                                                                    <div className="status">
                                                                        {getStatus(data.holiday_name, data.is_weekend, isCurrentDate)}
                                                                    </div>
                                                                    :
                                                                    <div className="check-in-out" style={{ height: 'auto' }}>
                                                                        {data.check_in_time ?
                                                                            <span style={{ alignItems: 'center', display: 'flex' }}>{data.check_in_time.substring(0, 5)}
                                                                                {
                                                                                    data.check_in_remarks &&
                                                                                    <Tooltip title={data.check_in_remarks} arrow>
                                                                                        <InfoOutlinedIcon className="info-icon" />
                                                                                    </Tooltip>
                                                                                }
                                                                            </span>
                                                                            :
                                                                            <span>--/--</span>}
                                                                        <span style={{ fontSize: 20, color: 'rgb(0,0,0,0.4)' }}> | </span>
                                                                        {data.check_out_time ?
                                                                            <span style={{ alignItems: 'center', display: 'flex' }}>{data.check_out_time.substring(0, 5)}
                                                                                {
                                                                                    data.check_out_remarks &&
                                                                                    <Tooltip title={data.check_in_remarks} arrow>
                                                                                        <InfoOutlinedIcon className="info-icon" />
                                                                                    </Tooltip>
                                                                                }
                                                                            </span>
                                                                            :
                                                                            <span>--/--</span>}
                                                                    </div>
                                                            }


                                                        </TableCell>
                                                    )
                                                })
                                            }

                                            {/* <TableCell className="capitalize-text">{lead.next_meeting_date ? new Date(lead.next_meeting_date).toLocaleDateString('en-IN') : <span>--/--</span>}</TableCell> */}
                                        </TableRow>
                                    )
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
            </div>
        </div>
    )
}

export default AllAttendance