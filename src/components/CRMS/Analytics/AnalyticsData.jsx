import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../../Config";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
} from "@mui/material";
import Skeleton from "react-loading-skeleton";
import { Controls, Player } from "@lottiefiles/react-lottie-player";
import nodata from "../../../lotties/nodata1.json";
import AnalyticsReportExcel from "./AnalyticsReport";

const AnalyticsData = ({
  startDate,
  endDate,
  analyticsTitle,
  selectedAgendaOfMeeting,
  selectedEmployee,
  visitsKey,
  selectedProductCategory,
  runSpecificApi,
}) => {
  const dummyArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const [loading, setLoading] = useState(true);
  const [analyticsDataKey, setAnalyticsDataKey] = useState([]);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10); // Number of rows per page

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const getSerialNumber = (index) => {
    return index + 1 + page * rowsPerPage;
  };

  const getTotalVisit = async () => {
    let dataLead = {
      from: startDate.format("DD-MM-YYYY"),
      to: endDate.format("DD-MM-YYYY"),
      type_of_visit: selectedAgendaOfMeeting,
      key: visitsKey,
    };
    if (selectedProductCategory) {
      dataLead.product_category = [selectedProductCategory];
    }

    if (selectedEmployee?.value === "all") {
      dataLead.employee_id = null;
    } else {
      dataLead.employee_id = selectedEmployee?.value;
    }
    try {
      const { data } = await axios.post(
        `${API_URL}/lead/visits-data`,
        dataLead
      );
      setAnalyticsDataKey(data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const getTotalInterested = async () => {
    let dataLead = {
      from: startDate.format("DD-MM-YYYY"),
      to: endDate.format("DD-MM-YYYY"),
      key: visitsKey,
    };
    if (selectedProductCategory) {
      dataLead.product_category = [selectedProductCategory];
    }

    if (selectedEmployee?.value === "all") {
      dataLead.employee_id = null;
    } else {
      dataLead.employee_id = selectedEmployee?.value;
    }
    try {
      const { data } = await axios.post(
        `${API_URL}/lead/interest-data`,
        dataLead
      );
      setAnalyticsDataKey(data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const getTotalLeadsSummary = async () => {
    let dataLead = {
      from: startDate.format("DD-MM-YYYY"),
      to: endDate.format("DD-MM-YYYY"),
      key: visitsKey,
    };
    if (selectedProductCategory) {
      dataLead.product_category = [selectedProductCategory];
    }

    if (selectedEmployee?.value === "all") {
      dataLead.employee_id = null;
    } else {
      dataLead.employee_id = selectedEmployee?.value;
    }
    try {
      const { data } = await axios.post(
        `${API_URL}/lead/leads-summary-data`,
        dataLead
      );
      setAnalyticsDataKey(data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const getTotalLeadsAgeing = async () => {
    let dataLead = {
      from: startDate.format("DD-MM-YYYY"),
      to: endDate.format("DD-MM-YYYY"),
      key: visitsKey,
    };
    if (selectedProductCategory) {
      dataLead.product_category = [selectedProductCategory];
    }

    if (selectedEmployee?.value === "all") {
      dataLead.employee_id = null;
    } else {
      dataLead.employee_id = selectedEmployee?.value;
    }
    try {
      const { data } = await axios.post(
        `${API_URL}/lead/leads-ageing-data`,
        dataLead
      );
      setAnalyticsDataKey(data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const getTotalLeadsConversion = async () => {
    let dataLead = {
      from: startDate.format("DD-MM-YYYY"),
      to: endDate.format("DD-MM-YYYY"),
      key: visitsKey,
    };
    if (selectedProductCategory) {
      dataLead.product_category = [selectedProductCategory];
    }

    if (selectedEmployee?.value === "all") {
      dataLead.employee_id = null;
    } else {
      dataLead.employee_id = selectedEmployee?.value;
    }
    try {
      const { data } = await axios.post(
        `${API_URL}/lead/leads-conversion-data`,
        dataLead
      );
      setAnalyticsDataKey(data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const getTotalLeadsAchievements = async () => {
    let dataLead = {
      from: startDate.format("DD-MM-YYYY"),
      to: endDate.format("DD-MM-YYYY"),
      key: visitsKey,
    };
    if (selectedProductCategory) {
      dataLead.product_category = [selectedProductCategory];
    }

    if (selectedEmployee?.value === "all") {
      dataLead.employee_id = null;
    } else {
      dataLead.employee_id = selectedEmployee?.value;
    }
    try {
      const { data } = await axios.post(
        `${API_URL}/lead/leads-achievement-data`,
        dataLead
      );
      setAnalyticsDataKey(data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const getTotalLeadsFlow = async () => {
    let dataLead = {
      from: startDate.format("DD-MM-YYYY"),
      to: endDate.format("DD-MM-YYYY"),
      key: visitsKey,
    };
    if (selectedProductCategory) {
      dataLead.product_category = [selectedProductCategory];
    }

    if (selectedEmployee?.value === "all") {
      dataLead.employee_id = null;
    } else {
      dataLead.employee_id = selectedEmployee?.value;
    }
    try {
      const { data } = await axios.post(
        `${API_URL}/lead/leads-flow-data`,
        dataLead
      );
      setAnalyticsDataKey(data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (runSpecificApi === "visit-summary") {
      getTotalVisit();
    } else if (runSpecificApi === "interested-data") {
      getTotalInterested();
    } else if (runSpecificApi === "leads-summary") {
      getTotalLeadsSummary();
    } else if (runSpecificApi === "leads-ageing") {
      getTotalLeadsAgeing();
    } else if (runSpecificApi === "conversion-data") {
      getTotalLeadsConversion();
    } else if (runSpecificApi === "acheivement-data") {
      getTotalLeadsAchievements();
    } else if (runSpecificApi === "leads-flow-table") {
      getTotalLeadsFlow();
    }
  }, [visitsKey, selectedEmployee]);

  return (
    <div
      style={{
        marginLeft: 0,
        display: "flex",
        flexDirection: "column",
        padding: "0px 15px",
      }}
    >
      <div className="header">
        <div
          className="head"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h4
            className="heading1"
            style={{
              fontWeight: "normal",
              fontSize: "22px",
              padding: "10px 0px",
            }}
          >
            {analyticsTitle} :
          </h4>
          <span style={{ marginRight: "50px" }}>
            <AnalyticsReportExcel
              startDate={startDate.format("DD-MM-YYYY")}
              endDate={endDate.format("DD-MM-YYYY")}
              analyticsTitle={analyticsTitle}
              analyticsDataKey={analyticsDataKey}
              runSpecificApi={runSpecificApi}
            />
          </span>
        </div>
      </div>

      <div className="table-mega-container" style={{ flex: 1, height: "auto" }}>
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

                <TableCell style={{}}>Lead Assigned To</TableCell>
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
                {runSpecificApi === "acheivement-data" && (
                  <TableCell>Order ID</TableCell>
                )}
                {runSpecificApi === "acheivement-data" && (
                  <TableCell style={{ minWidth: "300px", width: "100%" }}>
                    Ordered Data
                  </TableCell>
                )}
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
                : (analyticsDataKey && analyticsDataKey)
                    ?.slice(
                      page * rowsPerPage,
                      page * rowsPerPage + rowsPerPage
                    )
                    ?.map((lead, i) => {
                      // let conversations = lead.conversation.substring(0, 10);
                      // let minutesOfMeeting = lead.minutes_of_meeting.substring(0, 10);
                      return (
                        <TableRow
                          key={i}
                          className="table-data"
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
                          {runSpecificApi === "acheivement-data" && (
                            <TableCell>
                              {lead?.order_id ? lead.order_id : "--/--"}
                            </TableCell>
                          )}
                          {runSpecificApi === "acheivement-data" && (
                            <TableCell>
                              {/* {lead?.order_data && lead?.order_data?.length > 0
                                ? lead?.order_data
                                    ?.filter(
                                      (order) => order?.SKU && order?.Quantity
                                    )
                                    ?.map((order, index) => (
                                      <span key={index}>
                                        {order?.SKU} : {order?.Quantity}
                                        {index !==
                                          lead?.order_data.length - 1 && ", "}
                                      </span>
                                    ))
                                : "--/--"} */}
                              {lead.order_data &&
                                lead.order_data
                                  .filter((order) => order.SKU)
                                  .map(
                                    (order) => `${order.SKU}: ${order.Quantity}`
                                  )
                                  .join(", ")}
                            </TableCell>
                          )}
                          <TableCell className="capitalize-text">
                            <div style={{ width: 350 }}>
                              {/* {lead.product_category &&
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
                                : "--/--"} */}

                              {lead.product_category
                                ? lead.product_category
                                    .filter(
                                      (category) =>
                                        category.is_interested === true
                                    )
                                    .map((category) => category.name)
                                    .join(", ")
                                : ""}
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
      {analyticsDataKey?.length === 0 && !loading ? (
        <div className="empty-data">
          <Player
            autoplay
            loop
            src={nodata}
            style={{ height: "150px", width: "150px" }}
          >
            <Controls buttons={["repeat", "frame", "debug"]} />
          </Player>
        </div>
      ) : (
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={loading ? dummyArray.length : analyticsDataKey?.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      )}
    </div>
  );
};

export default AnalyticsData;
