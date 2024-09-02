import axios from "axios";
import React, { useEffect, useState } from "react";
import { API_URL } from "../../Config/index";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faDownload,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import {
  Autocomplete,
  TextField,
  Button,
  Modal,
  ModalClose,
  Option,
  Select,
  Sheet,
} from "@mui/joy";
import "./Report.css";
import "react-dates/initialize";
import { DateRangePicker } from "react-dates";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
} from "@mui/material";

import "react-dates/lib/css/_datepicker.css";
import moment from "moment";
import ReportExcel from "./ReportExcel/ReportExcel";
import Skeleton from "react-loading-skeleton";
import ReportDetailsModal from "./ReportDetailsModal/ReportDetailsModal";
import LeadsDetailModal from "../OpenLeads/LeadsDetailModal/LeadsDetailModal";
import { useNavigate } from "react-router-dom";

const Reports = () => {
  const dummyArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
  const [loading, setLoading] = useState(true);
  const [salespersonData, setSalespersonData] = useState([]);
  const [customerData, setCustomerData] = useState([]);
  const [leadData, setLeadData] = useState([]);

  const dateEnd = moment().startOf("month").format("DD-MM-YYYY");
  const [startDate, setStartDate] = useState(moment(dateEnd, "DD-MM-YYYY"));
  const [endDate, setEndDate] = useState(moment(new Date(), "DD-MM-YYYY"));

  const [focusedInput, setFocusedInput] = useState(null);

  const [showReset, setShowReset] = useState(false);

  const [selectedCustomer, setSelectedCustomer] = useState();
  const [selectedSalesPerson, setSelectedSalesPerson] = useState();
  const [selectedType, setSelectedType] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedAgendaOfMeeting, setSelectedAgendaOfMeeting] = useState("");

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10); // Number of rows per page
  const navigate = useNavigate();

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const resetFields = () => {
    setStartDate(moment().startOf("month"));
    setEndDate(moment());
    setSelectedCustomer("");
    setSelectedSalesPerson("");
    setSelectedStatus("");
    setSelectedType("");
    setSelectedAgendaOfMeeting("");
    setPage(0);
    setRowsPerPage(10);
  };

  const getAllCustomer = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/customer`);
      setLoading(false);
      setCustomerData(data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const getAllSalesPerson = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/employee/sales-employees`);
      setLoading(false);
      setSalespersonData(data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const getAllLeadsData = async () => {
    let dataLead = {
      customer_id: selectedCustomer ? selectedCustomer.value : null,
      sales_person_id: selectedSalesPerson ? selectedSalesPerson.value : null,
      lead_status: selectedStatus,
      agenda_of_meeting: selectedAgendaOfMeeting,
      start_date: startDate.format("DD-MM-YYYY"),
      end_date: endDate.format("DD-MM-YYYY"),
    };

    if (selectedType) {
      dataLead.visit_type = selectedType;
    }

    try {
      const { data } = await axios.get(`${API_URL}/lead`, {
        params: dataLead,
      });
      setLoading(false);
      setPage(0);
      setLeadData(data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const getSerialNumber = (index) => {
    return index + 1 + page * rowsPerPage;
  };
  // const handleApply = () => {
  //     getAllLeadsData()
  // }

  useEffect(() => {
    // setEndDate(moment(new Date(), 'DD-MM-YYYY'))

    // const dateEnd = moment().startOf('month').format('DD-MM-YYYY')
    // setStartDate(moment(dateEnd, "DD-MM-YYYY"))
    getAllCustomer();
    getAllSalesPerson();
    getAllLeadsData();
  }, []);

  useEffect(() => {
    getAllLeadsData();
  }, [
    startDate,
    endDate,
    selectedAgendaOfMeeting,
    selectedCustomer,
    selectedSalesPerson,
    selectedStatus,
    selectedType,
  ]);

  const handleDatesChange = ({ startDate, endDate }) => {
    setStartDate(startDate);
    setEndDate(endDate);
  };
  const isOutsideRangeStart = (date) => {
    return date.isAfter();
  };

  const [openReportModal, setOpenReportModal] = useState(false);
  const [reportData, setReportData] = useState([]);
  return (
    <div
      className="report-container"
      style={{ marginLeft: 0, display: "flex", flexDirection: "column" }}
    >
      <Modal
        aria-labelledby="modal-title"
        aria-describedby="modal-desc"
        open={openReportModal}
        onClose={() => {
          setOpenReportModal(false);
        }}
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <Sheet
          variant="plain"
          sx={{
            width: "80%",
            height: "fit-content",
            borderRadius: "md",
            p: 3,
            boxShadow: "lg",
            position: "relative",
          }}
        >
          <ModalClose variant="plain" sx={{ m: -1 }} />
          <LeadsDetailModal reportData={reportData} />
        </Sheet>
      </Modal>
      <div className="header">
        <div className="head" style={{ display: "flex" }}>
          <h1 className="heading1" style={{ marginBottom: "3px" }}>
            <FontAwesomeIcon
              onClick={() => {
                navigate('/crms')
              }}
              icon={faChevronLeft}
              color="#65a143"
              style={{ marginRight: 6, cursor: "pointer" }}
            />
            Reports
          </h1>
          <div className="report-filters button-grp">
            <ReportExcel
              leadData={leadData}
              startDate={startDate}
              endDate={endDate}
              selectedCustomer={selectedCustomer}
              selectedSalesPerson={selectedSalesPerson}
              selectedType={selectedType}
              selectedStatus={selectedStatus}
              selectedAgendaOfMeeting={selectedAgendaOfMeeting}
            />
            {/* <Button className='apply-button' onClick={handleApply}>
                            <p>Apply</p>
                        </Button> */}
            <Button className="apply-button" onClick={resetFields}>
              <p>Reset</p>
            </Button>
          </div>
        </div>
      </div>

      <div className="report-main">
        <div className="report-filters start-end-date">
          <DateRangePicker
            className="custom-date-range-picker"
            displayFormat={moment.localeData("en-IN").longDateFormat("LL")}
            startDate={startDate}
            startDateId="date_picker_start_date_id"
            endDate={endDate}
            endDateId="date_picker_end_date_id"
            onDatesChange={handleDatesChange}
            focusedInput={focusedInput}
            onFocusChange={(focusedInput) => setFocusedInput(focusedInput)}
            isOutsideRange={isOutsideRangeStart}
            readOnly
          />
        </div>

        <div className="report-filters">
          <Autocomplete
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
          />
        </div>

        <div className="report-filters">
          <Autocomplete
            className="reports-filter-selectors"
            placeholder="Sales Person"
            options={salespersonData.map((salesperson) => ({
              label: salesperson.first_name,
              value: salesperson.employee_id,
            }))}
            getOptionLabel={(option) => option.label}
            getOptionKey={(option) => option.value}
            value={selectedSalesPerson}
            onChange={(event, newValue) => {
              setSelectedSalesPerson(newValue);
            }}
          />
        </div>

        <div className="report-filters">
          <Select
            placeholder="Status"
            value={selectedStatus}
            onChange={(event, newValue) => {
              setSelectedStatus(newValue);
            }}
            className="reports-filter-selectors"
          >
            <Option value="Hot">Hot</Option>
            <Option value="Cold">Cold</Option>
            <Option value="Warm">Warm</Option>
            <Option value="Order Generated">Order Generated</Option>
            <Option value="Closed">Closed</Option>
          </Select>
        </div>

        <div className="report-filters">
          <Select
            className="reports-filter-selectors"
            placeholder="Visit Type"
            value={selectedType}
            onChange={(event, newValue) => {
              setSelectedType(newValue);
            }}
          >
            <Option value="On Site">On Site</Option>
            <Option value="On Call">On Call</Option>
          </Select>
        </div>

        <div className="report-filters">
          <Select
            className="reports-filter-selectors"
            placeholder="Agenda Of Meeting"
            value={selectedAgendaOfMeeting}
            onChange={(event, newValue) => {
              setSelectedAgendaOfMeeting(newValue);
            }}
          >
            <Option value="Sales Pitch">Sales Pitch</Option>
            <Option value="Collection">Collection</Option>
            <Option value="General Meeting">General Meeting</Option>
            <Option value="Other"> Other</Option>
          </Select>
        </div>
      </div>

      <div className="chips-container">
        {selectedCustomer && (
          <button className="chip">
            {selectedCustomer.label}
            <FontAwesomeIcon
              onClick={() => {
                setSelectedCustomer(null);
              }}
              icon={faXmark}
              style={{ cursor: "pointer", color: "#ffffff", marginLeft: 5 }}
            />
          </button>
        )}
        {selectedSalesPerson && (
          <button className="chip">
            {selectedSalesPerson.label}
            <FontAwesomeIcon
              onClick={() => {
                setSelectedSalesPerson(null);
              }}
              icon={faXmark}
              style={{ cursor: "pointer", color: "#ffffff", marginLeft: 5 }}
            />
          </button>
        )}
        {selectedStatus && (
          <button className="chip">
            {selectedStatus}
            <FontAwesomeIcon
              onClick={() => {
                setSelectedStatus(null);
              }}
              icon={faXmark}
              style={{ cursor: "pointer", color: "#ffffff", marginLeft: 5 }}
            />
          </button>
        )}
        {selectedType && (
          <button className="chip">
            {selectedType}
            <FontAwesomeIcon
              onClick={() => {
                setSelectedType(null);
              }}
              icon={faXmark}
              style={{ cursor: "pointer", color: "#ffffff", marginLeft: 5 }}
            />
          </button>
        )}
        {selectedAgendaOfMeeting && (
          <button className="chip">
            {selectedAgendaOfMeeting}
            <FontAwesomeIcon
              onClick={() => {
                setSelectedAgendaOfMeeting(null);
              }}
              icon={faXmark}
              style={{ cursor: "pointer", color: "#ffffff", marginLeft: 5 }}
            />
          </button>
        )}
        {(selectedCustomer ||
          selectedSalesPerson ||
          selectedStatus ||
          selectedType ||
          selectedAgendaOfMeeting) && (
          <button
            className="clear-all"
            style={{ cursor: "pointer" }}
            onClick={() => {
              setSelectedCustomer(null);
              setSelectedSalesPerson(null);
              setSelectedStatus(null);
              setSelectedType(null);
              setSelectedAgendaOfMeeting(null);
            }}
          >
            <FontAwesomeIcon
              icon={faXmark}
              style={{ color: "rgba(49, 99, 114, 255)", marginRight: 5 }}
            />
            Clear All
          </button>
        )}
      </div>

      <div className="table-mega-container" style={{ height: "auto" }}>
        <TableContainer
          className="table-customer"
          style={{ overflow: "visible" }}
        >
          <Table variant="outlined">
            <TableHead style={{ zIndex: 1 }}>
              <TableRow className="table-report">
                {/* <TableCell>SNo</TableCell> */}
                <TableCell
                  className="sicky_column"
                  style={{ borderTopLeftRadius: "15px", minWidth: 80 }}
                >
                  <div style={{ width: 90 }}>LeadID-HistoryID</div>
                </TableCell>
                {/* <TableCell>Branch</TableCell> */}
                <TableCell style={{ minWidth: 100 }}>Date</TableCell>
                <TableCell style={{ minWidth: 80 }}>Visit Type</TableCell>

                <TableCell>Lead Assigned To</TableCell>
                <TableCell>Lead Assigned By</TableCell>

                {/* <TableCell>Minutes of Meeting</TableCell> */}
                <TableCell>Customer</TableCell>
                <TableCell>Customer Branch</TableCell>
                <TableCell>Meeting Person</TableCell>
                <TableCell style={{ minWidth: 140 }}>
                  Meeting Person Designation
                </TableCell>
                <TableCell style={{ minWidth: 100 }}>
                  Agenda Of Meeting
                </TableCell>
                <TableCell style={{ minWidth: 100 }}>Lead Status</TableCell>
                <TableCell>Conversation</TableCell>
                <TableCell>Product Category</TableCell>
                <TableCell style={{ minWidth: 140 }}>Check In</TableCell>
                <TableCell style={{ minWidth: 140 }}>Meeting Time</TableCell>
                <TableCell style={{ minWidth: 140 }}>
                  Next Meeting Date
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading === true
                ? dummyArray.map((i) => (
                    <TableRow className="table-data skeleton " key={i}>
                      <TableCell className="table-mui-head-skeleton">
                        <Skeleton />
                      </TableCell>
                      <TableCell>
                        <Skeleton />
                      </TableCell>
                      <TableCell>
                        <Skeleton />
                      </TableCell>
                      <TableCell>
                        <Skeleton />
                      </TableCell>
                      <TableCell>
                        <Skeleton />
                      </TableCell>
                      <TableCell>
                        <Skeleton />
                      </TableCell>
                      <TableCell>
                        <Skeleton />
                      </TableCell>
                      <TableCell>
                        <Skeleton />
                      </TableCell>
                      <TableCell>
                        <Skeleton />
                      </TableCell>
                      <TableCell>
                        <Skeleton />
                      </TableCell>
                      <TableCell>
                        <Skeleton />
                      </TableCell>

                      <TableCell>
                        <Skeleton />
                      </TableCell>
                    </TableRow>
                  ))
                : (leadData && leadData)
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((lead, i) => {
                      // let conversations = lead.conversation.substring(0, 10);
                      // let minutesOfMeeting = lead.minutes_of_meeting.substring(0, 10);
                      return (
                        <TableRow
                          key={i}
                          className="table-data"
                          onClick={() => {
                            setOpenReportModal(true);
                            setReportData(lead);
                          }}
                          style={{ cursor: "pointer" }}
                        >
                          {/* <TableCell className="capitalize-text">{getSerialNumber(i)}</TableCell> */}
                          <TableCell
                            style={{
                              background: "#F7F7F7",
                            }}
                            className="capitalize-text sicky_column"
                          >
                            {getSerialNumber(i)} / {lead.lead_id} -{" "}
                            {lead.lead_history_id}
                          </TableCell>

                          <TableCell className="capitalize-text">
                            {lead.meeting_time ? (
                              new Date(lead.meeting_time).toLocaleDateString(
                                "en-IN"
                              )
                            ) : (
                              <span>--/--</span>
                            )}
                          </TableCell>
                          {/* <TableCell className="capitalize-text">{lead.customer_branch}</TableCell> */}

                          <TableCell className="capitalize-text">
                            {lead?.visit_type}
                          </TableCell>

                          <TableCell className="capitalize-text">
                            {lead?.sales_person_name}
                          </TableCell>

                          <TableCell className="capitalize-text">
                            {lead?.assigned_by_employee_name}
                          </TableCell>

                          {/* <TableCell
                            className="capitalize-text"
                            title={lead.minutes_of_meeting}
                          >
                            {lead.minutes_of_meeting &&
                            typeof lead.minutes_of_meeting === "string"
                              ? lead.minutes_of_meeting.length > 10
                                ? `${lead.minutes_of_meeting.substring(
                                    0,
                                    10
                                  )}...`
                                : lead.minutes_of_meeting
                              : ""}
                          </TableCell> */}

                          <TableCell className="capitalize-text ">
                            <div>{lead.customer_name}</div>
                          </TableCell>
                          <TableCell className="capitalize-text ">
                            <div>{lead.customer_branch_name}</div>
                          </TableCell>

                          <TableCell className="capitalize-text">
                            {lead.meeting_person_name}
                          </TableCell>

                          <TableCell className="capitalize-text">
                            {lead.meeting_person_designation}
                          </TableCell>

                          <TableCell className="capitalize-text">
                            {lead.agenda_of_meeting}
                          </TableCell>

                          <TableCell className="capitalize-text">
                            {lead.lead_status}
                          </TableCell>

                          <TableCell
                            className="capitalize-text"
                            title={lead.conversation}
                          >
                            <div style={{ minWidth: "420px", width: "100%" }}>
                              {lead.conversation &&
                              typeof lead.conversation === "string"
                                ? lead.conversation.length > 60
                                  ? `${lead.conversation.substring(0, 60)}...`
                                  : lead.conversation
                                : "--/--"}
                            </div>
                          </TableCell>

                          <TableCell className="capitalize-text">
                            <div style={{ width: 350 }}>
                              {lead.product_category &&
                              lead.product_category.length > 0
                                ? lead.product_category.map(
                                    (product, index) => (
                                      <React.Fragment key={index}>
                                        {product.is_interested && (
                                          <span>{product.name}</span>
                                        )}
                                        {index !==
                                          lead.product_category.length - 1 &&
                                          product.is_interested && (
                                            <span>, </span>
                                          )}
                                      </React.Fragment>
                                    )
                                  )
                                : "--/--"}
                            </div>
                          </TableCell>

                          <TableCell className="capitalize-text">
                            {lead.check_in_time ? (
                              new Date(lead.check_in_time).toLocaleDateString(
                                "en-IN",
                                {
                                  hour: "numeric",
                                  minute: "numeric",
                                  hour12: false,
                                }
                              )
                            ) : (
                              <span>--/--</span>
                            )}
                          </TableCell>

                          <TableCell className="capitalize-text">
                            {lead.meeting_time ? (
                              new Date(lead.meeting_time).toLocaleDateString(
                                "en-IN",
                                {
                                  hour: "numeric",
                                  minute: "numeric",
                                  hour12: false,
                                }
                              )
                            ) : (
                              <div style={{ height: 35 }}>--/--</div>
                            )}
                          </TableCell>
                          <TableCell className="capitalize-text">
                            {lead.next_meeting_date ? (
                              new Date(
                                lead.next_meeting_date
                              ).toLocaleDateString("en-IN")
                            ) : (
                              <span>--/--</span>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={loading ? dummyArray.length : leadData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </div>
  );
};

export default Reports;
