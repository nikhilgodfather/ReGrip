import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faChevronLeft,
  faPenToSquare,
} from "@fortawesome/free-solid-svg-icons";
import "./Analytics.css";
import "react-dates/initialize";
import { DateRangePicker } from "react-dates";
import moment from "moment";
import { Select, Option, Autocomplete, Table } from "@mui/joy";
import axios from "axios";
import { API_URL } from "../../Config";
import { Modal, ModalClose, Sheet } from "@mui/joy";
import AnalyticsData from "./AnalyticsData";
import { useNavigate } from "react-router-dom";

const Analytics = () => {
  const [loading, setLoading] = useState(true);

  const dateEnd = moment().startOf("month").format("DD-MM-YYYY");
  const [startDate, setStartDate] = useState(moment(dateEnd, "DD-MM-YYYY"));
  const [endDate, setEndDate] = useState(moment(new Date(), "DD-MM-YYYY"));
  const [focusedInput, setFocusedInput] = useState(null);
  const [getAllEmployees, setGetAllEmployees] = useState([]);
  const [selectedAgendaOfMeeting, setSelectedAgendaOfMeeting] = useState("sales-pitch");
  const [selectedEmployee, setSelectedEmployee] = useState();
  const [selectedProductCategory, setSelectedProductCategory] = useState("Regrip Tyres");
  const [interestData, setInterestData] = useState();
  const [leadsSummaryData, setLeadsSummaryData] = useState();
  const [leadDataFlow, setLeadDataFlow] = useState();
  const [leadConversation, setLeadConversation] = useState();
  const [leadAchievement, setLeadAchievement] = useState();
  const [leadDataVisits, setLeadDataVisits] = useState();
  const [leadsAgeing, setLeadsAgeing] = useState();
  const [visitsKey, setVisitKey] = useState("");
  const [analyticsTitle, setAnalyticsTitle] = useState("");
  const [runSpecificApi, setRunSpecificApi] = useState("");
  const navigate = useNavigate();

  const handleDatesChange = ({ startDate, endDate }) => {
    setStartDate(startDate);
    setEndDate(endDate);
  };
  const isOutsideRangeStart = (date) => {
    return date.isAfter();
  };

  // api call
  const getAllEmployeeData = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/employee/sales-employees`);
      const Employees = data;
      setLoading(false);
      setGetAllEmployees(Employees.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  // api call

  const filterAnalyticsData = async () => {
    let dataLead = {
      from: startDate.format("DD-MM-YYYY"),
      to: endDate.format("DD-MM-YYYY"),
    };

    // if (selectedAgendaOfMeeting) {
    //   dataLead.type_of_visit = selectedAgendaOfMeeting;
    // }

    if (selectedProductCategory) {
      dataLead.product_category = [selectedProductCategory];
    }

    if (selectedEmployee?.value === "all") {
      dataLead.employee_id = null;
    } else {
      dataLead.employee_id = selectedEmployee?.value;
    }

    try {
      const { data } = await axios.post(`${API_URL}/lead/interest`, dataLead);
      setInterestData(data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }

    try {
      const { data } = await axios.post(
        `${API_URL}/lead/leads-summary`,
        dataLead
      );
      setLeadsSummaryData(data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }

    try {
      const { data } = await axios.post(`${API_URL}/lead/leads-flow`, dataLead);
      setLeadDataFlow(data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }

    try {
      const { data } = await axios.post(
        `${API_URL}/lead/leads-ageing`,
        dataLead
      );
      setLeadsAgeing(data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }

    try {
      const { data } = await axios.post(
        `${API_URL}/lead/leads-conversion`,
        dataLead
      );
      setLeadConversation(data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }

    try {
      const { data } = await axios.post(
        `${API_URL}/lead/leads-achievement`,
        dataLead
      );
      setLeadAchievement(data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }

    // if (selectedAgendaOfMeeting) {
    //   try {
    //     const { data } = await axios.get(`${API_URL}/lead/visits`, {
    //       params: dataLead,
    //     });
    //     setLeadDataVisits(data.data);
    //   } catch (error) {
    //     console.error("Error fetching data:", error);
    //   }
    // }
  };

  const filterAgendaOfMeetingData = async () => {
    let dataLead = {
      from: startDate.format("DD-MM-YYYY"),
      to: endDate.format("DD-MM-YYYY"),
    };

    if (selectedAgendaOfMeeting) {
      dataLead.type_of_visit = selectedAgendaOfMeeting;
    }

    if (selectedEmployee?.value === "all") {
      dataLead.employee_id = null;
    } else {
      dataLead.employee_id = selectedEmployee?.value;
    }

    if (selectedAgendaOfMeeting) {
      try {
        const { data } = await axios.get(`${API_URL}/lead/visits`, {
          params: dataLead,
        });
        setLeadDataVisits(data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  };

  useEffect(() => {
    filterAnalyticsData();
    filterAgendaOfMeetingData();
    getAllEmployeeData();
  }, [
    startDate,
    endDate,
    selectedEmployee,
    selectedAgendaOfMeeting,
    selectedProductCategory,
  ]);
  const [openAnalyticsData, setAnalyticsData] = useState(false);

  return (
    <div
      className="Fleet-container"
      style={{
        marginLeft: 0,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Modal
        aria-labelledby="modal-title"
        aria-describedby="modal-desc"
        open={openAnalyticsData}
        onClose={() => {
          setAnalyticsData(false);
          setVisitKey("");
          setAnalyticsTitle("");
          setRunSpecificApi("");
        }}
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <Sheet
          variant="plain"
          sx={{
            width: "95%",
            height: "95%",
            borderRadius: "md",
            boxShadow: "lg",
            position: "relative",
            overflow: "auto",
          }}
        >
          <ModalClose
            variant="plain"
            sx={{
              m: 0,
            }}
          />
          <AnalyticsData
            startDate={startDate}
            endDate={endDate}
            selectedAgendaOfMeeting={selectedAgendaOfMeeting}
            selectedEmployee={selectedEmployee}
            visitsKey={visitsKey}
            analyticsTitle={analyticsTitle}
            selectedProductCategory={selectedProductCategory}
            runSpecificApi={runSpecificApi}
          />
        </Sheet>
      </Modal>
      <div
        className="Fleet-header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div className="head" style={{ display: "flex" }}>
          <h1
            className="heading1"
            style={{ marginBottom: "3px", cursor: "pointer" }}
            onClick={() => {
              navigate('/crms')
            }}
          >
            <FontAwesomeIcon
              icon={faChevronLeft}
              color="#65a143"
              style={{ marginRight: 6, cursor: "pointer" }}
            />
            Analytics
          </h1>
        </div>
      </div>

      <div className="analytics-filter">
        <div className="analytics">
          <div
            className="report-filters start-end-date"
            style={{ width: "fit-content" }}
          >
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
        </div>

        <div className="analytics">
          <Select
            className="analytics-fields"
            placeholder="Agenda Of Meeting"
            value={selectedAgendaOfMeeting}
            onChange={(event, newValue) => {
              setSelectedAgendaOfMeeting(newValue);
            }}
          >
            <Option value="sales-pitch">Sales Pitch</Option>
            <Option value="collection">Collection</Option>
            <Option value="general-meeting">General Meeting</Option>
            <Option value="other"> Other</Option>
          </Select>
        </div>

        <div className="analytics">
          <Autocomplete
            className="analytics-fields"
            placeholder="Select Employee"
            options={[
              { label: "Select All", value: "all" }, // "Select All" option
              ...getAllEmployees?.map((employee) => ({
                label: `${employee?.first_name} ${employee?.last_name}`,
                value: employee?.employee_id,
              })),
            ]}
            getOptionLabel={(option) => option?.label}
            getOptionKey={(option) => option?.value}
            value={selectedEmployee}
            onChange={(event, newValue) => {
              setSelectedEmployee(newValue);
            }}
          />
        </div>
      </div>

      <div
        style={{
          overflow: "auto",
          padding: "25px",
          marginTop: "20px",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          scrollBehavior: "smooth",
        }}
      >
        {selectedAgendaOfMeeting === "sales-pitch" ? (
          <>
            <div className="all-data-card">
              <h3>Visits Summary</h3>
              <div className="card-design-visit-summary">
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    width: "100%",
                  }}
                >
                  <div
                    style={{
                      // border: "1px solid #b2b2b2",
                      width: "100%",
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <div
                      style={{
                        width: "45%",
                        height: "fit-content",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <div className="card-child">
                        <div
                          className=""
                          style={{
                            width: "100%",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <p>Total Visits</p>
                          <p
                            className="clickable-text-design"
                            onClick={() => {
                              setAnalyticsData(true);
                              setVisitKey("total_visits");
                              setAnalyticsTitle("Total Visits");
                              setRunSpecificApi("visit-summary");
                            }}
                          >
                            {leadDataVisits?.total_visits}
                          </p>
                        </div>
                        <div
                          className=""
                          style={{
                            width: "100%",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <p>No of days</p>
                          <p className="clickable-text-design-simp">
                            {leadDataVisits?.number_of_days}
                          </p>
                        </div>
                        <div
                          className=""
                          style={{
                            width: "100%",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <p>Average daily visits</p>
                          <p className="clickable-text-design-simp">
                            {leadDataVisits?.average_daily_visits}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div
                      style={{
                        width: "45%",
                        height: "fit-content",
                        display: "flex",
                        flexDirection: "column",
                        gap: "20px",
                      }}
                    >
                      <div className="card-child">
                        <div
                          className=""
                          style={{
                            width: "100%",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <p>Visits on existing clients</p>
                          <p
                            className="clickable-text-design"
                            onClick={() => {
                              setAnalyticsData(true);
                              setVisitKey("existing_client_visits");
                              setAnalyticsTitle("Visits on existing clients");
                              setRunSpecificApi("visit-summary");
                            }}
                          >
                            {leadDataVisits?.existing_client_visits}
                          </p>
                        </div>
                        <div
                          className=""
                          style={{
                            width: "100%",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <p>Visits on new clients</p>
                          <p
                            className="clickable-text-design"
                            onClick={() => {
                              setAnalyticsData(true);
                              setVisitKey("new_client_visits");
                              setAnalyticsTitle("Visits on new clients");
                              setRunSpecificApi("visit-summary");
                            }}
                          >
                            {leadDataVisits?.new_client_visits}
                          </p>
                        </div>
                      </div>
                      <div className="card-child">
                        <div
                          className=""
                          style={{
                            width: "100%",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <p>Repeat visits on existing leads</p>
                          <p
                            className="clickable-text-design"
                            onClick={() => {
                              setAnalyticsData(true);
                              setVisitKey("repeat_visit_existing_leads");
                              setAnalyticsTitle(
                                "Repeat visits on existing leads"
                              );
                              setRunSpecificApi("visit-summary");
                            }}
                          >
                            {leadDataVisits?.repeat_visit_existing_leads}
                          </p>
                        </div>
                        <div
                          className=""
                          style={{
                            width: "100%",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <p>New prospectus generated</p>
                          <p
                            className="clickable-text-design"
                            onClick={() => {
                              setAnalyticsData(true);
                              setVisitKey("new_prospectus_generated");
                              setAnalyticsTitle("New prospectus generated");
                              setRunSpecificApi("visit-summary");
                            }}
                          >
                            {leadDataVisits?.new_prospectus_generated}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="card-child">
                    <div
                      className=""
                      style={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <p>Total available time (hrs)</p>
                      <p>
                        {leadDataVisits?.total_available_time ? (
                          leadDataVisits?.total_available_time
                        ) : (
                          <p className="dash-design">--</p>
                        )}
                      </p>
                    </div>
                    <div
                      className=""
                      style={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <p>Total meeting time for sales conversion</p>
                      <p>
                        {leadDataVisits?.total_meeting_time_for_sales_conversion ? (
                          leadDataVisits?.total_meeting_time_for_sales_conversion
                        ) : (
                          <p className="dash-design">--</p>
                        )}
                      </p>
                    </div>
                    <div
                      className=""
                      style={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <p>Total meeting time for collection etc</p>
                      <p>
                        {leadDataVisits?.total_meeting_time_for_collection_etc ? (
                          leadDataVisits?.total_meeting_time_for_collection_etc
                        ) : (
                          <p className="dash-design">--</p>
                        )}
                      </p>
                    </div>
                    <div
                      className=""
                      style={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <p>Total travelling time (hrs)</p>
                      <p>
                        {leadDataVisits?.total_travelling_time ? (
                          leadDataVisits?.total_travelling_time
                        ) : (
                          <p className="dash-design">--</p>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="all-data-card">
              <div
                className=""
                style={{ display: "flex", alignItems: "center", gap: "20px" }}
              >
                <h4 style={{ fontWeight: "600" }}>Select Product Category :</h4>

                <Select
                  sx={{ maxWidth: "220px", width: "100%" }}
                  placeholder="Select Product Category"
                  value={selectedProductCategory}
                  onChange={(e, newValue) =>
                    setSelectedProductCategory(newValue)
                  }
                >
                  <Option value="Regrip Tyres">Regrip Tyres</Option>
                  <Option value="New Tyres">New Tyres</Option>
                  <Option value="Tyres Scrap">Tyres Scrap</Option>
                  <Option value="Retreading">Retreading</Option>
                  <Option value="Service">Service</Option>
                </Select>
              </div>
            </div>
            <div className="all-data-card">
              <h3>Interested Summary</h3>
              <div className="card-design">
                <div
                  style={{
                    width: "45%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <div
                    style={{
                      // border: "1px solid black",
                      padding: "10px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "10px",
                      marginTop: "auto",
                      marginBottom: "auto",
                      boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.3)",
                      borderRadius: "10px",
                    }}
                  >
                    <div
                      className=""
                      style={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <h4>Interested Matrix</h4>
                    </div>
                    <div
                      className=""
                      style={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <p>New leads generated</p>
                      <p
                        className="clickable-text-design"
                        onClick={() => {
                          setAnalyticsData(true);
                          setVisitKey("new_leads");
                          setAnalyticsTitle("New leads generated");
                          setRunSpecificApi("interested-data");
                        }}
                      >
                        {interestData?.new_leads}
                      </p>
                    </div>
                    <div
                      className=""
                      style={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <p>Interested leads</p>
                      <p
                        className="clickable-text-design"
                        onClick={() => {
                          setAnalyticsData(true);
                          setVisitKey("interested_leads");
                          setAnalyticsTitle("Interested leads");
                          setRunSpecificApi("interested-data");
                        }}
                      >
                        {" "}
                        {interestData?.interested_leads}
                      </p>
                    </div>
                    <div
                      className=""
                      style={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <p>Not interested leads</p>
                      <p
                        className="clickable-text-design"
                        onClick={() => {
                          setAnalyticsData(true);
                          setVisitKey("not_interested_leads");
                          setAnalyticsTitle("Not interested leads");
                          setRunSpecificApi("interested-data");
                        }}
                      >
                        {interestData?.not_interested_leads}
                      </p>
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    width: "45%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <div
                    style={{
                      boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.3)",
                      padding: "10px",
                      borderRadius: "10px",

                      display: "flex",
                      flexDirection: "column",
                      gap: "10px",
                      marginTop: "auto",
                      marginBottom: "auto",
                    }}
                  >
                    <div
                      className=""
                      style={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <p>Not interested leads</p>
                      <p className="clickable-text-design-simp">
                        {interestData?.not_interested_leads}
                      </p>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "10px",
                      }}
                    >
                      <h4 style={{ fontWeight: "600" }}>Reason:</h4>
                      <div
                        className=""
                        style={{
                          width: "100%",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          paddingLeft: "20px",
                        }}
                      >
                        <p>Buy on credit</p>
                        <p
                          className="clickable-text-design"
                          onClick={() => {
                            setAnalyticsData(true);
                            setVisitKey("not_interested_credit_leads");
                            setAnalyticsTitle("Buy on credit");
                            setRunSpecificApi("interested-data");
                          }}
                        >
                          {interestData?.not_interested_credit_leads}
                        </p>
                      </div>
                      <div
                        className=""
                        style={{
                          width: "100%",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          paddingLeft: "20px",
                        }}
                      >
                        <p>Pricing issue</p>

                        <p
                          className="clickable-text-design"
                          onClick={() => {
                            setAnalyticsData(true);
                            setVisitKey("not_interested_pricing_leads");
                            setAnalyticsTitle("Pricing issue");
                            setRunSpecificApi("interested-data");
                          }}
                        >
                          {interestData?.not_interested_pricing_leads}
                        </p>
                      </div>
                      <div
                        className=""
                        style={{
                          width: "100%",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          paddingLeft: "20px",
                        }}
                      >
                        <p>Others</p>
                        <p
                          className="clickable-text-design"
                          onClick={() => {
                            setAnalyticsData(true);
                            setVisitKey("not_interested_other_leads");
                            setAnalyticsTitle("Others");
                            setRunSpecificApi("interested-data");
                          }}
                        >
                          {interestData?.not_interested_other_leads}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="all-data-card">
              <h3>Leads Summary</h3>
              <div className="card-design">
                <div
                  style={{
                    width: "45%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <div className="card-child">
                    <div
                      className=""
                      style={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <h4>Leads Count</h4>
                    </div>
                    <div
                      className=""
                      style={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <p>New Leads Generated</p>
                      <p
                        className="clickable-text-design"
                        onClick={() => {
                          setAnalyticsData(true);
                          setVisitKey("new_leads_generated");
                          setAnalyticsTitle("New Leads Generated");
                          setRunSpecificApi("leads-summary");
                        }}
                      >
                        {leadsSummaryData?.new_leads_generated}
                      </p>
                    </div>
                    <div
                      className=""
                      style={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <p>Open Leads as on starting of month</p>
                      <p
                        className="clickable-text-design"
                        onClick={() => {
                          setAnalyticsData(true);
                          setVisitKey("open_leads_starting_of_month");
                          setAnalyticsTitle(
                            "Open Leads as on starting of month"
                          );
                          setRunSpecificApi("leads-summary");
                        }}
                      >
                        {leadsSummaryData?.open_leads_starting_of_month}
                      </p>
                    </div>
                    <div
                      className=""
                      style={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <p>Existing leads successfully closed</p>
                      <p
                        className="clickable-text-design"
                        onClick={() => {
                          setAnalyticsData(true);
                          setVisitKey("existing_leads_successfully_closed");
                          setAnalyticsTitle(
                            "Existing leads successfully closed"
                          );
                          setRunSpecificApi("leads-summary");
                        }}
                      >
                        {leadsSummaryData?.existing_leads_successfully_closed}
                      </p>
                    </div>
                    <div
                      className=""
                      style={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <p>Existing leads unsuccessfully closed</p>
                      <p
                        className="clickable-text-design"
                        onClick={() => {
                          setAnalyticsData(true);
                          setVisitKey("existing_leads_unsuccessfully_closed");
                          setAnalyticsTitle(
                            "Existing leads unsuccessfully closed"
                          );
                          setRunSpecificApi("leads-summary");
                        }}
                      >
                        {leadsSummaryData?.existing_leads_unsuccessfully_closed}
                      </p>
                    </div>
                    <div
                      className=""
                      style={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <p>Open leads as on closing on month</p>
                      <p
                        className="clickable-text-design"
                        onClick={() => {
                          setAnalyticsData(true);
                          setVisitKey("open_leads_closing_on_month");
                          setAnalyticsTitle(
                            "Open leads as on closing on month"
                          );
                          setRunSpecificApi("leads-summary");
                        }}
                      >
                        {leadsSummaryData?.open_leads_closing_on_month}
                      </p>
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    width: "45%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <div className="card-child">
                    <div
                      className=""
                      style={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <h4>Open Leads</h4>
                      <p className="clickable-text-design-simp">
                        {leadsSummaryData?.open_leads_closing_on_month}
                      </p>
                    </div>
                    <div
                      className=""
                      style={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <p>Hot</p>
                      <p
                        className="clickable-text-design"
                        onClick={() => {
                          setAnalyticsData(true);
                          setVisitKey("hot_leads");
                          setAnalyticsTitle("Hot");
                          setRunSpecificApi("leads-summary");
                        }}
                      >
                        {leadsSummaryData?.hot_leads}
                      </p>
                    </div>
                    <div
                      className=""
                      style={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <p>Warm</p>
                      <p
                        className="clickable-text-design"
                        onClick={() => {
                          setAnalyticsData(true);
                          setVisitKey("warm_leads");
                          setAnalyticsTitle("Warm");
                          setRunSpecificApi("leads-summary");
                        }}
                      >
                        {leadsSummaryData?.warm_leads}
                      </p>
                    </div>
                    <div
                      className=""
                      style={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <p>Cold</p>
                      <p
                        className="clickable-text-design"
                        onClick={() => {
                          setAnalyticsData(true);
                          setVisitKey("cold_leads");
                          setAnalyticsTitle("Cold");
                          setRunSpecificApi("leads-summary");
                        }}
                      >
                        {leadsSummaryData?.cold_leads}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="all-data-card">
              <h3>Leads Flow Summary</h3>
              <div className="card-design">
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                  }}
                >
                  <div
                    style={
                      {
                        // border: "1px solid black",
                        // padding: "10px",
                      }
                    }
                  >
                    <table className="table-analytics">
                      <thead>
                        <tr>
                          <th style={{ minWidth: "15%" }}>Leads Flow</th>
                          <th style={{ minWidth: "10%" }}>New</th>
                          <th style={{ minWidth: "15%" }}>Old Pending</th>
                          <th style={{ minWidth: "25%" }}>
                            Old Successfully Closed
                          </th>
                          <th style={{ minWidth: "25%" }}>
                            Old Unsuccessfully Closed
                          </th>
                          <th style={{ minWidth: "18%" }}>Transfer to hot</th>
                          <th style={{ minWidth: "18%" }}>Transfer to cold</th>
                          <th style={{ minWidth: "18%" }}>Transfer to warm</th>
                          <th style={{ minWidth: "15%" }}>Closing</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>Hot</td>
                          <td>
                            <p
                              className="clickable-text-design"
                              onClick={() => {
                                setAnalyticsData(true);
                                setVisitKey("hot_new");
                                setAnalyticsTitle("Hot - New");
                                setRunSpecificApi("leads-flow-table");
                              }}
                            >
                              {leadDataFlow?.hot_new}
                            </p>
                          </td>
                          <td>
                            <p
                              className="clickable-text-design"
                              onClick={() => {
                                setAnalyticsData(true);
                                setVisitKey("hot_old_pending");
                                setAnalyticsTitle("Hot - Old pending");
                                setRunSpecificApi("leads-flow-table");
                              }}
                            >
                              {leadDataFlow?.hot_old_pending}
                            </p>
                          </td>
                          <td>
                            <p
                              className="clickable-text-design"
                              onClick={() => {
                                setAnalyticsData(true);
                                setVisitKey("hot_old_successfully_closed");
                                setAnalyticsTitle(
                                  "Hot - Old successfully closed"
                                );
                                setRunSpecificApi("leads-flow-table");
                              }}
                            >
                              {leadDataFlow?.hot_old_successfully_closed}
                            </p>
                          </td>
                          <td>
                            <p
                              className="clickable-text-design"
                              onClick={() => {
                                setAnalyticsData(true);
                                setVisitKey("hot_old_unsuccessfully_closed");
                                setAnalyticsTitle(
                                  "Hot - Old unsuccessfully closed"
                                );
                                setRunSpecificApi("leads-flow-table");
                              }}
                            >
                              {leadDataFlow?.hot_old_unsuccessfully_closed}
                            </p>
                          </td>
                          <td>
                            <p
                              className="clickable-text-design"
                              onClick={() => {
                                setAnalyticsData(true);
                                setVisitKey("hot_transfer_to_hot");
                                setAnalyticsTitle("Hot - Transfer to hot");
                                setRunSpecificApi("leads-flow-table");
                              }}
                            >
                              {leadDataFlow?.hot_transfer_to_hot}
                            </p>
                          </td>
                          <td>
                            <p
                              className="clickable-text-design"
                              onClick={() => {
                                setAnalyticsData(true);
                                setVisitKey("hot_transfer_to_cold");
                                setAnalyticsTitle("Hot - Transfer to cold");
                                setRunSpecificApi("leads-flow-table");
                              }}
                            >
                              {leadDataFlow?.hot_transfer_to_cold}
                            </p>
                          </td>
                          <td>
                            <p
                              className="clickable-text-design"
                              onClick={() => {
                                setAnalyticsData(true);
                                setVisitKey("hot_transfer_to_warm");
                                setAnalyticsTitle("Hot - Transfer to warm");
                                setRunSpecificApi("leads-flow-table");
                              }}
                            >
                              {leadDataFlow?.hot_transfer_to_warm}
                            </p>
                          </td>
                          <td>
                            <p
                              className="clickable-text-design"
                              onClick={() => {
                                setAnalyticsData(true);
                                setVisitKey("hot_closing");
                                setAnalyticsTitle("Hot - Closing");
                                setRunSpecificApi("leads-flow-table");
                              }}
                            >
                              {leadDataFlow?.hot_closing}
                            </p>
                          </td>
                        </tr>
                        <tr>
                          <td>Cold</td>
                          <td>
                            <p
                              className="clickable-text-design"
                              onClick={() => {
                                setAnalyticsData(true);
                                setVisitKey("cold_new");
                                setAnalyticsTitle("Cold - New");
                                setRunSpecificApi("leads-flow-table");
                              }}
                            >
                              {leadDataFlow?.cold_new}
                            </p>
                          </td>
                          <td>
                            <p
                              className="clickable-text-design"
                              onClick={() => {
                                setAnalyticsData(true);
                                setVisitKey("cold_old_pending");
                                setAnalyticsTitle("Cold - Old pending");
                                setRunSpecificApi("leads-flow-table");
                              }}
                            >
                              {leadDataFlow?.cold_old_pending}
                            </p>
                          </td>
                          <td>
                            <p
                              className="clickable-text-design"
                              onClick={() => {
                                setAnalyticsData(true);
                                setVisitKey("cold_old_successfully_closed");
                                setAnalyticsTitle(
                                  "Cold - Old successfully closed"
                                );
                                setRunSpecificApi("leads-flow-table");
                              }}
                            >
                              {leadDataFlow?.cold_old_successfully_closed}
                            </p>
                          </td>
                          <td>
                            <p
                              className="clickable-text-design"
                              onClick={() => {
                                setAnalyticsData(true);
                                setVisitKey("cold_old_unsuccessfully_closed");
                                setAnalyticsTitle(
                                  "Cold - Old unsuccessfully closed"
                                );
                                setRunSpecificApi("leads-flow-table");
                              }}
                            >
                              {leadDataFlow?.cold_old_unsuccessfully_closed}
                            </p>
                          </td>
                          <td>
                            <p
                              className="clickable-text-design"
                              onClick={() => {
                                setAnalyticsData(true);
                                setVisitKey("cold_transfer_to_hot");
                                setAnalyticsTitle("Cold - Transfer to hot");
                                setRunSpecificApi("leads-flow-table");
                              }}
                            >
                              {leadDataFlow?.cold_transfer_to_hot}
                            </p>
                          </td>
                          <td>
                            <p
                              className="clickable-text-design"
                              onClick={() => {
                                setAnalyticsData(true);
                                setVisitKey("cold_transfer_to_cold");
                                setAnalyticsTitle("Cold - Transfer to cold");
                                setRunSpecificApi("leads-flow-table");
                              }}
                            >
                              {leadDataFlow?.cold_transfer_to_cold}
                            </p>
                          </td>
                          <td>
                            <p
                              className="clickable-text-design"
                              onClick={() => {
                                setAnalyticsData(true);
                                setVisitKey("cold_transfer_to_warm");
                                setAnalyticsTitle("Cold - Transfer to warm");
                                setRunSpecificApi("leads-flow-table");
                              }}
                            >
                              {leadDataFlow?.cold_transfer_to_warm}
                            </p>
                          </td>
                          <td>
                            <p
                              className="clickable-text-design"
                              onClick={() => {
                                setAnalyticsData(true);
                                setVisitKey("cold_closing");
                                setAnalyticsTitle("Cold - Closing");
                                setRunSpecificApi("leads-flow-table");
                              }}
                            >
                              {leadDataFlow?.cold_closing}
                            </p>
                          </td>
                        </tr>
                        <tr>
                          <td>Warm</td>
                          <td>
                            <p
                              className="clickable-text-design"
                              onClick={() => {
                                setAnalyticsData(true);
                                setVisitKey("warm_new");
                                setAnalyticsTitle("Warm - New");
                                setRunSpecificApi("leads-flow-table");
                              }}
                            >
                              {leadDataFlow?.warm_new}
                            </p>
                          </td>
                          <td>
                            <p
                              className="clickable-text-design"
                              onClick={() => {
                                setAnalyticsData(true);
                                setVisitKey("warm_old_pending");
                                setAnalyticsTitle("Warm - Old pending");
                                setRunSpecificApi("leads-flow-table");
                              }}
                            >
                              {leadDataFlow?.warm_old_pending}
                            </p>
                          </td>
                          <td>
                            <p
                              className="clickable-text-design"
                              onClick={() => {
                                setAnalyticsData(true);
                                setVisitKey("warm_old_successfully_closed");
                                setAnalyticsTitle(
                                  "Warm - Old successfully closed"
                                );
                                setRunSpecificApi("leads-flow-table");
                              }}
                            >
                              {leadDataFlow?.warm_old_successfully_closed}
                            </p>
                          </td>
                          <td>
                            <p
                              className="clickable-text-design"
                              onClick={() => {
                                setAnalyticsData(true);
                                setVisitKey("warm_old_unsuccessfully_closed");
                                setAnalyticsTitle(
                                  "Warm - Old unsuccessfully closed"
                                );
                                setRunSpecificApi("leads-flow-table");
                              }}
                            >
                              {leadDataFlow?.warm_old_unsuccessfully_closed}
                            </p>
                          </td>
                          <td>
                            <p
                              className="clickable-text-design"
                              onClick={() => {
                                setAnalyticsData(true);
                                setVisitKey("warm_transfer_to_hot");
                                setAnalyticsTitle("Warm - Transfer to hot");
                                setRunSpecificApi("leads-flow-table");
                              }}
                            >
                              {leadDataFlow?.warm_transfer_to_hot}
                            </p>
                          </td>
                          <td>
                            <p
                              className="clickable-text-design"
                              onClick={() => {
                                setAnalyticsData(true);
                                setVisitKey("warm_transfer_to_cold");
                                setAnalyticsTitle("Warm - Transfer to cold");
                                setRunSpecificApi("leads-flow-table");
                              }}
                            >
                              {leadDataFlow?.warm_transfer_to_cold}
                            </p>
                          </td>
                          <td>
                            <p
                              className="clickable-text-design"
                              onClick={() => {
                                setAnalyticsData(true);
                                setVisitKey("warm_transfer_to_warm");
                                setAnalyticsTitle("Warm - Transfer to warm");
                                setRunSpecificApi("leads-flow-table");
                              }}
                            >
                              {leadDataFlow?.warm_transfer_to_warm}
                            </p>
                          </td>
                          <td>
                            <p
                              className="clickable-text-design"
                              onClick={() => {
                                setAnalyticsData(true);
                                setVisitKey("warm_closing");
                                setAnalyticsTitle("Warm - Closing");
                                setRunSpecificApi("leads-flow-table");
                              }}
                            >
                              {leadDataFlow?.warm_closing}
                            </p>
                          </td>
                        </tr>

                        <tr>
                          <td>
                            <b>Total</b>
                          </td>
                          <td>
                            <p
                              className="clickable-text-design"
                              onClick={() => {
                                setAnalyticsData(true);
                                setVisitKey("total_new");
                                setAnalyticsTitle("Total - New");
                                setRunSpecificApi("leads-flow-table");
                              }}
                            >
                              {leadDataFlow?.total_new}
                            </p>
                          </td>
                          <td>
                            <p
                              className="clickable-text-design"
                              onClick={() => {
                                setAnalyticsData(true);
                                setVisitKey("total_old_pending");
                                setAnalyticsTitle("Total - Old pending");
                                setRunSpecificApi("leads-flow-table");
                              }}
                            >
                              {leadDataFlow?.total_old_pending}
                            </p>
                          </td>
                          <td>
                            <p
                              className="clickable-text-design"
                              onClick={() => {
                                setAnalyticsData(true);
                                setVisitKey("total_old_successfully_closed");
                                setAnalyticsTitle(
                                  "Total - Old successfully closed"
                                );
                                setRunSpecificApi("leads-flow-table");
                              }}
                            >
                              {leadDataFlow?.total_old_successfully_closed}
                            </p>
                          </td>
                          <td>
                            <p
                              className="clickable-text-design"
                              onClick={() => {
                                setAnalyticsData(true);
                                setVisitKey("total_old_unsuccessfully_closed");
                                setAnalyticsTitle(
                                  "Total - Old unsuccessfully closed"
                                );
                                setRunSpecificApi("leads-flow-table");
                              }}
                            >
                              {leadDataFlow?.total_old_unsuccessfully_closed}
                            </p>
                          </td>
                          <td>
                            <p
                              className="clickable-text-design"
                              onClick={() => {
                                setAnalyticsData(true);
                                setVisitKey("total_transfer_to_hot");
                                setAnalyticsTitle("Total - Transfer to hot");
                                setRunSpecificApi("leads-flow-table");
                              }}
                            >
                              {leadDataFlow?.total_transfer_to_hot}
                            </p>
                          </td>
                          <td>
                            <p
                              className="clickable-text-design"
                              onClick={() => {
                                setAnalyticsData(true);
                                setVisitKey("total_transfer_to_cold");
                                setAnalyticsTitle("Total - Transfer to cold");
                                setRunSpecificApi("leads-flow-table");
                              }}
                            >
                              {leadDataFlow?.total_transfer_to_cold}
                            </p>
                          </td>
                          <td>
                            <p
                              className="clickable-text-design"
                              onClick={() => {
                                setAnalyticsData(true);
                                setVisitKey("total_transfer_to_warm");
                                setAnalyticsTitle("Total - Transfer to warm");
                                setRunSpecificApi("leads-flow-table");
                              }}
                            >
                              {leadDataFlow?.total_transfer_to_warm}
                            </p>
                          </td>
                          <td>
                            <p
                              className="clickable-text-design"
                              onClick={() => {
                                setAnalyticsData(true);
                                setVisitKey("total_closing");
                                setAnalyticsTitle("Total - Closing");
                                setRunSpecificApi("leads-flow-table");
                              }}
                            >
                              {leadDataFlow?.total_closing}
                            </p>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            <div className="all-data-card">
              <h3>Leads Ageing Summary</h3>
              <div className="card-design">
                <div
                  style={{
                    width: "30%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <div
                    style={{
                      boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.3)",
                      padding: "10px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "10px",
                      marginTop: "auto",
                      marginBottom: "auto",
                      borderRadius: "10px",
                    }}
                  >
                    <div
                      className=""
                      style={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <h4>Hot Leads ageing matrix</h4>
                    </div>
                    <div
                      className=""
                      style={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <p>{`<7 days`}</p>
                      <p
                        className="clickable-text-design"
                        onClick={() => {
                          setAnalyticsData(true);
                          setVisitKey("hot_lead_ageing_matrix_<7_days");
                          setAnalyticsTitle("Hot - <7 days");
                          setRunSpecificApi("leads-ageing");
                        }}
                      >
                        {leadsAgeing?.["hot_lead_ageing_matrix_<7_days"]}
                      </p>
                    </div>
                    <div
                      className=""
                      style={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <p>{`7-15 days`}</p>

                      <p
                        className="clickable-text-design"
                        onClick={() => {
                          setAnalyticsData(true);
                          setVisitKey("hot_lead_ageing_matrix_7-15_days");
                          setAnalyticsTitle("Hot - 7-15 days");
                          setRunSpecificApi("leads-ageing");
                        }}
                      >
                        {leadsAgeing?.["hot_lead_ageing_matrix_7-15_days"]}
                      </p>
                    </div>
                    <div
                      className=""
                      style={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <p>{`16-30 days`}</p>

                      <p
                        className="clickable-text-design"
                        onClick={() => {
                          setAnalyticsData(true);
                          setVisitKey("hot_lead_ageing_matrix_16-30_days");
                          setAnalyticsTitle("Hot - 16-30 days");
                          setRunSpecificApi("leads-ageing");
                        }}
                      >
                        {leadsAgeing?.["hot_lead_ageing_matrix_16-30_days"]}
                      </p>
                    </div>
                    <div
                      className=""
                      style={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <p>{`>30 days`}</p>

                      <p
                        className="clickable-text-design"
                        onClick={() => {
                          setAnalyticsData(true);
                          setVisitKey("hot_lead_ageing_matrix_>30_days");
                          setAnalyticsTitle("Hot - >30 days");
                          setRunSpecificApi("leads-ageing");
                        }}
                      >
                        {leadsAgeing?.["hot_lead_ageing_matrix_>30_days"]}
                      </p>
                    </div>

                    <div
                      className=""
                      style={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <p>{`Total`}</p>

                      <p className="clickable-text-design-simp">
                        {leadsAgeing?.["hot_lead_ageing_matrix_<7_days"] +
                          leadsAgeing?.["hot_lead_ageing_matrix_7-15_days"] +
                          leadsAgeing?.["hot_lead_ageing_matrix_16-30_days"] +
                          leadsAgeing?.["hot_lead_ageing_matrix_>30_days"]}
                      </p>
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    width: "30%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <div
                    style={{
                      boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.3)",
                      padding: "10px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "10px",
                      marginTop: "auto",
                      marginBottom: "auto",
                      borderRadius: "10px",
                    }}
                  >
                    <div
                      className=""
                      style={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <h4>Cold Leads ageing matrix</h4>
                    </div>
                    <div
                      className=""
                      style={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <p>{`<15 days`}</p>
                      <p
                        className="clickable-text-design"
                        onClick={() => {
                          setAnalyticsData(true);
                          setVisitKey("cold_lead_ageing_matrix_<15_days");
                          setAnalyticsTitle("Cold - <15 days");
                          setRunSpecificApi("leads-ageing");
                        }}
                      >
                        {leadsAgeing?.["cold_lead_ageing_matrix_<15_days"]}
                      </p>
                    </div>
                    <div
                      className=""
                      style={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <p>{`16-30 days`}</p>
                      <p
                        className="clickable-text-design"
                        onClick={() => {
                          setAnalyticsData(true);
                          setVisitKey("cold_lead_ageing_matrix_16-30_days");
                          setAnalyticsTitle("Cold - 16-30 days");
                          setRunSpecificApi("leads-ageing");
                        }}
                      >
                        {leadsAgeing?.["cold_lead_ageing_matrix_16-30_days"]}
                      </p>
                    </div>
                    <div
                      className=""
                      style={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <p>{`31-45 days`}</p>

                      <p
                        className="clickable-text-design"
                        onClick={() => {
                          setAnalyticsData(true);
                          setVisitKey("cold_lead_ageing_matrix_31-45_days");
                          setAnalyticsTitle("Cold - 31-45 days");
                          setRunSpecificApi("leads-ageing");
                        }}
                      >
                        {leadsAgeing?.["cold_lead_ageing_matrix_31-45_days"]}
                      </p>
                    </div>
                    <div
                      className=""
                      style={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <p>{`>45 days`}</p>

                      <p
                        className="clickable-text-design"
                        onClick={() => {
                          setAnalyticsData(true);
                          setVisitKey("cold_lead_ageing_matrix_>45_days");
                          setAnalyticsTitle("Cold - >45 days");
                          setRunSpecificApi("leads-ageing");
                        }}
                      >
                        {leadsAgeing?.["cold_lead_ageing_matrix_>45_days"]}
                      </p>
                    </div>

                    <div
                      className=""
                      style={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <p>{`Total`}</p>

                      <p className="clickable-text-design-simp">
                        {leadsAgeing?.["cold_lead_ageing_matrix_<15_days"] +
                          leadsAgeing?.["cold_lead_ageing_matrix_16-30_days"] +
                          leadsAgeing?.["cold_lead_ageing_matrix_31-45_days"] +
                          leadsAgeing?.["cold_lead_ageing_matrix_>45_days"]}
                      </p>
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    width: "30%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <div
                    style={{
                      boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.3)",
                      padding: "10px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "10px",
                      marginTop: "auto",
                      marginBottom: "auto",
                      borderRadius: "10px",
                    }}
                  >
                    <div
                      className=""
                      style={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <h4>Warm Leads ageing matrix</h4>
                    </div>
                    <div
                      className=""
                      style={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <p>{`<30 days`}</p>

                      <p
                        className="clickable-text-design"
                        onClick={() => {
                          setAnalyticsData(true);
                          setVisitKey("warm_leads_ageing_matrix_<30_days");
                          setAnalyticsTitle("Warm - <30 days");
                          setRunSpecificApi("leads-ageing");
                        }}
                      >
                        {leadsAgeing?.["warm_leads_ageing_matrix_<30_days"]}
                      </p>
                    </div>
                    <div
                      className=""
                      style={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <p>{`31-60 days`}</p>

                      <p
                        className="clickable-text-design"
                        onClick={() => {
                          setAnalyticsData(true);
                          setVisitKey("warm_leads_ageing_matrix_31-60_days");
                          setAnalyticsTitle("Warm - 31-60 days");
                          setRunSpecificApi("leads-ageing");
                        }}
                      >
                        {leadsAgeing?.["warm_leads_ageing_matrix_31-60_days"]}
                      </p>
                    </div>
                    <div
                      className=""
                      style={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <p>{`61-90 days`}</p>

                      <p
                        className="clickable-text-design"
                        onClick={() => {
                          setAnalyticsData(true);
                          setVisitKey("warm_leads_ageing_matrix_61-90_days");
                          setAnalyticsTitle("Warm - 61-90 days");
                          setRunSpecificApi("leads-ageing");
                        }}
                      >
                        {leadsAgeing?.["warm_leads_ageing_matrix_61-90_days"]}
                      </p>
                    </div>
                    <div
                      className=""
                      style={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <p>{`>90 days`}</p>

                      <p
                        className="clickable-text-design"
                        onClick={() => {
                          setAnalyticsData(true);
                          setVisitKey("warm_leads_ageing_matrix_>90_days");
                          setAnalyticsTitle("Warm - >90 days");
                          setRunSpecificApi("leads-ageing");
                        }}
                      >
                        {leadsAgeing?.["warm_leads_ageing_matrix_>90_days"]}
                      </p>
                    </div>

                    <div
                      className=""
                      style={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <p>{`Total`}</p>

                      <p className="clickable-text-design-simp">
                        {leadsAgeing?.["warm_leads_ageing_matrix_<30_days"] +
                          leadsAgeing?.["warm_leads_ageing_matrix_31-60_days"] +
                          leadsAgeing?.["warm_leads_ageing_matrix_61-90_days"] +
                          leadsAgeing?.["warm_leads_ageing_matrix_>90_days"]}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="all-data-card">
              <h3>Conversion Summary</h3>
              <div className="card-design">
                <div
                  style={{
                    width: "45%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <div
                    style={{
                      boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.3)",
                      borderRadius: "10px",

                      padding: "10px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "10px",
                      marginTop: "auto",
                      marginBottom: "auto",
                    }}
                  >
                    <div
                      className=""
                      style={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <h4>Conversion Matrix</h4>
                    </div>
                    <div
                      className=""
                      style={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <p>Successfully closed leads</p>
                      <p
                        className="clickable-text-design"
                        onClick={() => {
                          setAnalyticsData(true);
                          setVisitKey("successfully_closed");
                          setAnalyticsTitle("Successfully closed leads");
                          setRunSpecificApi("conversion-data");
                        }}
                      >
                        {leadConversation?.successfully_closed}
                      </p>
                    </div>
                    <div
                      className=""
                      style={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <p>Unsuccessfully closed leads</p>

                      <p
                        className="clickable-text-design"
                        onClick={() => {
                          setAnalyticsData(true);
                          setVisitKey("unsuccessfully_closed");
                          setAnalyticsTitle("Unsuccessfully closed leads");
                          setRunSpecificApi("conversion-data");
                        }}
                      >
                        {" "}
                        {leadConversation?.unsuccessfully_closed}
                      </p>
                    </div>
                    <div
                      className=""
                      style={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <p>Open leads</p>
                      <p
                        className="clickable-text-design"
                        onClick={() => {
                          setAnalyticsData(true);
                          setVisitKey("open_leads");
                          setAnalyticsTitle("Open leads");
                          setRunSpecificApi("conversion-data");
                        }}
                      >
                        {" "}
                        {leadConversation?.open_leads}
                      </p>
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    width: "45%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <div
                    style={{
                      boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.3)",
                      padding: "10px",
                      borderRadius: "10px",

                      display: "flex",
                      flexDirection: "column",
                      gap: "10px",
                      marginTop: "auto",
                      marginBottom: "auto",
                    }}
                  >
                    <div
                      className=""
                      style={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <p>Not conversion leads</p>

                      <p className="clickable-text-design-simp">
                        {leadConversation?.unsuccessfully_closed}
                      </p>
                    </div>
                    <div>
                      <h4 style={{ fontWeight: "600" }}>Reason:</h4>
                      <div
                        className=""
                        style={{
                          width: "100%",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          paddingLeft: "20px",
                        }}
                      >
                        <p>Buy on credit</p>
                        <p
                          className="clickable-text-design"
                          onClick={() => {
                            setAnalyticsData(true);
                            setVisitKey("unsuccessfully_closed_credit");
                            setAnalyticsTitle("Buy on credit");
                            setRunSpecificApi("conversion-data");
                          }}
                        >
                          {leadConversation?.unsuccessfully_closed_credit}
                        </p>
                      </div>
                      <div
                        className=""
                        style={{
                          width: "100%",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          paddingLeft: "20px",
                        }}
                      >
                        <p>Pricing issue</p>

                        <p
                          className="clickable-text-design"
                          onClick={() => {
                            setAnalyticsData(true);
                            setVisitKey("unsuccessfully_closed_pricing");
                            setAnalyticsTitle("Pricing issue");
                            setRunSpecificApi("conversion-data");
                          }}
                        >
                          {leadConversation?.unsuccessfully_closed_pricing}
                        </p>
                      </div>
                      <div
                        className=""
                        style={{
                          width: "100%",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          paddingLeft: "20px",
                        }}
                      >
                        <p>Others</p>
                        <p
                          className="clickable-text-design"
                          onClick={() => {
                            setAnalyticsData(true);
                            setVisitKey("unsuccessfully_closed_others");
                            setAnalyticsTitle("Others");
                            setRunSpecificApi("conversion-data");
                          }}
                        >
                          {leadConversation?.unsuccessfully_closed_others}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="all-data-card">
              <h3>Achivements Summary</h3>
              <div className="card-design">
                <div
                  style={{
                    width: "45%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <div
                    style={{
                      boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.3)",
                      padding: "10px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "10px",
                      marginTop: "auto",
                      marginBottom: "auto",
                      borderRadius: "10px",
                    }}
                  >
                    <div
                      className=""
                      style={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <h4>Achivements Matrix</h4>
                    </div>
                    <div
                      className=""
                      style={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <p>Total order in nos</p>
                      <p
                        className="clickable-text-design"
                        onClick={() => {
                          setAnalyticsData(true);
                          setVisitKey("total_orders");
                          setAnalyticsTitle("Average order in nos");
                          setRunSpecificApi("acheivement-data");
                        }}
                      >
                        {leadAchievement?.total_orders}
                      </p>
                    </div>
                    <div
                      className=""
                      style={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <p>Total order value</p>
                      <p
                        className="clickable-text-design"
                        onClick={() => {
                          setAnalyticsData(true);
                          setVisitKey("total_tyres");
                          setAnalyticsTitle("Average order value");
                          setRunSpecificApi("acheivement-data");
                        }}
                      >
                        {leadAchievement?.total_tyres}
                      </p>
                    </div>
                    <div
                      className=""
                      style={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <p>New customer added</p>
                      <p
                        className="clickable-text-design"
                        onClick={() => {
                          setAnalyticsData(true);
                          setVisitKey("new_customers_added");
                          setAnalyticsTitle("New customer added");
                          setRunSpecificApi("acheivement-data");
                        }}
                      >
                        {leadAchievement?.new_customers_added}
                      </p>
                    </div>
                    <div
                      className=""
                      style={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <p>Repeat customers</p>
                      <p
                        className="clickable-text-design"
                        onClick={() => {
                          setAnalyticsData(true);
                          setVisitKey("repeat_customers");
                          setAnalyticsTitle("Repeat customers");
                          setRunSpecificApi("acheivement-data");
                        }}
                      >
                        {leadAchievement?.repeat_customers}
                      </p>
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    width: "45%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  {/* <div
                    style={{
                      boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.3)",
                      padding: "10px",
                      borderRadius: "10px",

                      display: "flex",
                      flexDirection: "column",
                      gap: "10px",
                      marginTop: "auto",
                      marginBottom: "auto",
                    }}
                  >
                    <div
                      className=""
                      style={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <h4>Time Parameters</h4>
                    </div>
                    <div
                      className=""
                      style={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <p>Total available time (hrs)</p>
                      <p>{leadAchievement?.total_available_time_hrs}</p>
                    </div>
                    <div
                      className=""
                      style={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <p>Total meeting time for sales conversation</p>
                      <p>
                        {
                          leadAchievement?.total_meeting_time_for_sales_conversion_hrs
                        }
                      </p>
                    </div>
                    <div
                      className=""
                      style={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <p>Total meeting time for collection etc</p>
                      <p>
                        {
                          leadAchievement?.total_meeting_time_for_collection_etc_hrs
                        }
                      </p>
                    </div>
                    <div
                      className=""
                      style={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <p>Total travelling time (hrs)</p>
                      <p>{leadAchievement?.total_travelling_time_hrs}</p>
                    </div>
                  </div> */}
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="all-data-card">
              <h3>Visits Summary</h3>
              <div className="card-design">
                <div
                  style={{
                    width: "45%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <div
                    style={{
                      boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.3)",
                      borderRadius: "10px",

                      padding: "10px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "10px",
                      marginTop: "auto",
                      marginBottom: "auto",
                    }}
                  >
                    <div
                      className=""
                      style={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <p>Total Visits</p>
                      <p className="clickable-text-design-simp">
                        {leadDataVisits?.total_visits}
                      </p>
                    </div>
                    <div
                      className=""
                      style={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <p>Visits for collection</p>
                      <p
                        className="clickable-text-design "
                        onClick={() => {
                          setAnalyticsData(true);
                          setVisitKey("total_visits");
                          setAnalyticsTitle("Visits for collection");
                          setSelectedAgendaOfMeeting("collection");
                          setRunSpecificApi("visit-summary");
                        }}
                      >
                        {leadDataVisits?.visits_for_collection}
                      </p>
                    </div>
                    <div
                      className=""
                      style={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <p>Visit for general meeting</p>
                      <p
                        className="clickable-text-design "
                        onClick={() => {
                          setAnalyticsData(true);
                          setVisitKey("total_visits");
                          setAnalyticsTitle("Visit for general meeting");
                          setSelectedAgendaOfMeeting("general-meeting");
                          setRunSpecificApi("visit-summary");
                        }}
                      >
                        {leadDataVisits?.visits_for_general_meeting}
                      </p>
                    </div>
                    <div
                      className=""
                      style={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <p>Visit for other purpose</p>
                      <p
                        className="clickable-text-design "
                        onClick={() => {
                          setAnalyticsData(true);
                          setVisitKey("total_visits");
                          setAnalyticsTitle("Visit for other purpose");
                          setSelectedAgendaOfMeeting("other");
                          setRunSpecificApi("visit-summary");
                        }}
                      >
                        {leadDataVisits?.visits_for_other_purpose}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Analytics;
