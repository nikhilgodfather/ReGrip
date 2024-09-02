import React, { useEffect, useState } from "react";
import "./Report.css";
import axios from "axios";
import { API_URL } from "../Config";
import { useSelector } from "react-redux";
import ScrapRatioTable from "./allReportTableData/ScrapRatioTable";
import CasingRatio from "./allReportTableData/CasingRatio";
import InspectedTyreTable from "./allReportTableData/InspectedTyreTable";
import CategoryPie from "./allReportTableData/CategoryPie";
import DefectPieChart from "./allReportTableData/DefectPieChart";
import PositionPieChart from "./allReportTableData/PositionPieChart";
import { useNavigate } from "react-router-dom";
import { Autocomplete, Button, Checkbox, CircularProgress } from "@mui/joy";
import { Controls, Player } from "@lottiefiles/react-lottie-player";
import nodata from "../../lotties/nodata1.json";
import "react-dates/initialize";
import { DateRangePicker } from "react-dates";
import moment from "moment";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const Report = () => {
  const navigate = useNavigate();
  const [fleetData, setFleetData] = useState([]);
  const [loadingFleet, setLoadingFleet] = useState(false);

  const [selectedFleet, setSelectedFleet] = useState(null);

  const [loadingInspected, setLoadingInspected] = useState(true);
  const [loadingScrapRatio, setLoadingScrapRatio] = useState(true);
  const [loadingCasingRatio, setLoadingCasingRatio] = useState(true);

  const currentUser = useSelector((state) => state.getCurrentUser.role_name);

  // data
  const [getInspectedTyreData, setInspectedTyreData] = useState([]);
  const [getScrapRatioData, setGetScrapRatioData] = useState([]);
  const [getCasingRatioData, setGetCasingRatioData] = useState([]);

  // piechart
  const [getCategoryPieChartData, setGetCategoryPieChartData] = useState([]);
  const [getDefectPieChartData, setGetDefectPieChartData] = useState([]);
  const [getPositionPieChartData, setGetPositionPieChartData] = useState([]);

  // piechart
  // data

  // date-filter

  const [isChecked, setIsChecked] = useState(true);

  const dateEnd = moment()?.startOf("month")?.format("DD-MM-YYYY");
  const [startDate, setStartDate] = useState(moment(dateEnd, "DD-MM-YYYY"));
  const [endDate, setEndDate] = useState(moment(new Date(), "DD-MM-YYYY"));
  const [focusedInput, setFocusedInput] = useState(null);

  const handleDatesChange = ({ startDate, endDate }) => {
    setStartDate(startDate);
    setEndDate(endDate);
    setLoadingInspected(true);
    setLoadingScrapRatio(true);
    setLoadingCasingRatio(true);
  };
  const isOutsideRangeStart = (date) => {
    return date.isAfter();
  };

  // date filter

  // fleet
  const getFleetAndSupplierData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) navigate("/");
      const bearer_token = "bearer " + JSON.parse(token);
      setLoadingFleet(true);
      const { data } = await axios.get(`${API_URL}/fleets/getFleetsData`, {
        headers: {
          Authorization: bearer_token,
        },
      });
      const fleets = data.rows;
      setFleetData(fleets);
      setLoadingFleet(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoadingFleet(false);
    }
  };
  // fleet

  const getInspectedTyresReport = async () => {
    let paramsForData = {
      supplier_brand_name: currentUser?.toLowerCase(),
      fleet_id: selectedFleet?.value,
      to: endDate?.format("DD-MM-YYYY"),
    };

    if (!isChecked) {
      paramsForData.from = startDate?.format("DD-MM-YYYY");
    }

    try {
      const { data } = await axios.get(
        `${API_URL}/report/total-inspected-tyres`,
        { params: paramsForData }
      );
      setLoadingInspected(false);
      setInspectedTyreData(data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const getScrapRatioReport = async () => {
    let paramsForData = {
      supplier_brand_name: currentUser?.toLowerCase(),
      fleet_id: selectedFleet?.value,

      to: endDate?.format("DD-MM-YYYY"),
    };

    if (!isChecked) {
      paramsForData.from = startDate?.format("DD-MM-YYYY");
    }
    try {
      const { data } = await axios.get(`${API_URL}/report/scrap-ratio`, {
        params: paramsForData,
      });
      setLoadingScrapRatio(false);
      setGetScrapRatioData(data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const getCasingRatioReport = async () => {
    let paramsForData = {
      supplier_brand_name: currentUser?.toLowerCase(),
      fleet_id: selectedFleet?.value,

      to: endDate.format("DD-MM-YYYY"),
    };

    if (!isChecked) {
      paramsForData.from = startDate?.format("DD-MM-YYYY");
    }
    try {
      const { data } = await axios.get(`${API_URL}/report/casing-ratio`, {
        params: paramsForData,
      });
      setLoadingCasingRatio(false);
      setGetCasingRatioData(data?.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const getCategoryPieChart = async () => {
    let paramsForData = {
      supplier_brand_name: currentUser?.toLowerCase(),
      fleet_id: selectedFleet?.value,

      to: endDate?.format("DD-MM-YYYY"),
    };

    if (!isChecked) {
      paramsForData.from = startDate?.format("DD-MM-YYYY");
    }
    try {
      const { data } = await axios.get(`${API_URL}/report/category-pie-chart`, {
        params: paramsForData,
      });
      setGetCategoryPieChartData(data?.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const getDefectCategoryPieChart = async () => {
    let paramsForData = {
      supplier_brand_name: currentUser?.toLowerCase(),
      fleet_id: selectedFleet?.value,

      to: endDate?.format("DD-MM-YYYY"),
    };

    if (!isChecked) {
      paramsForData.from = startDate?.format("DD-MM-YYYY");
    }
    try {
      const { data } = await axios.get(`${API_URL}/report/defect-pie-chart`, {
        params: paramsForData,
      });
      setGetDefectPieChartData(data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const getPositionCategoryPieChart = async () => {
    let paramsForData = {
      supplier_brand_name: currentUser?.toLowerCase(),
      fleet_id: selectedFleet?.value,

      to: endDate?.format("DD-MM-YYYY"),
    };

    if (!isChecked) {
      paramsForData.from = startDate?.format("DD-MM-YYYY");
    }
    try {
      const { data } = await axios.get(`${API_URL}/report/position-pie-chart`, {
        params: paramsForData,
      });
      setGetPositionPieChartData(data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const options = fleetData.map((fleet) => ({
    value: fleet.fleet_id,
    label: fleet.fleet_name,
  }));

  const [pdfDownloadingLoader, setPdfDownloadingLoader] = useState(false);

  const printRef = React.useRef();

  const handleDownloadPdf = async () => {
    setPdfDownloadingLoader(true);

    const element = printRef.current;
    const canvas = await html2canvas(element);
    const data = canvas.toDataURL("image/png");

    const pdf = new jsPDF({
      orientation: "portrait", // Set orientation to landscape
    });

    const imgProperties = pdf.getImageProperties(data);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width;

    const marginTop = 25; // Adjust this value to set the top margin
    const marginBottom = 20; // Adjust this value to set the bottom margin
    const usableHeight =
      pdf.internal.pageSize.getHeight() - marginTop - marginBottom;

    // Calculate the scaling factor to fit the image within the usable height
    const scaleFactor = usableHeight / pdfHeight;

    // Calculate the adjusted height after applying the scaling factor
    const adjustedHeight = pdfHeight * scaleFactor;
    const adjustedWidth = pdfWidth * scaleFactor;

    const xPos = (pdf.internal.pageSize.getWidth() - adjustedWidth) / 2; // Center horizontally
    const yPos = marginTop; // Set margin from top

    // pdf.setFontSize(18); // Set font size for heading
    // pdf.text("To", pdf.internal.pageSize.getWidth() / 2, 10, {
    //   align: "center",
    // });
    // pdf.text("From", pdf.internal.pageSize.getWidth() / 2, 10, {
    //   align: "center",
    // });

    pdf.addImage(data, "PNG", xPos, yPos, adjustedWidth, adjustedHeight);

    const columns = ["Start Date", "End Date", "Fleet Name"];
    const rows = [
      [
        startDate?.format("DD-MM-YYYY"),
        endDate?.format("DD-MM-YYYY"),
        selectedFleet?.label,
      ],
    ];

    // Set the table options
    const options = {
      startY: 4, // Vertical position to start the table (in mm)
    };

    // Generate the table
    pdf.autoTable(columns, rows, options);

    setPdfDownloadingLoader(false);

    pdf.save(
      `${startDate?.format("DD-MM-YYYY")}_${endDate?.format(
        "DD-MM-YYYY"
      )}_report.pdf`
    );
  };

  useEffect(() => {
    getFleetAndSupplierData();
    if (currentUser) {
      getInspectedTyresReport();
      getScrapRatioReport();
      getCasingRatioReport();
      getCategoryPieChart();
      getDefectCategoryPieChart();
      getPositionCategoryPieChart();
    }
  }, [selectedFleet, currentUser, startDate, endDate, isChecked]);
  return (
    <div className="report-cont-container">
      <div
        className="head"
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1 className="heading1">Report</h1>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "25px",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: "10px",
              alignItems: "center",
              backgroundColor: "#ededed",
              padding: "5px",
              borderRadius: "6px",
            }}
          >
            {!isChecked && (
              <div
                className="report-filters start-end-date"
                style={{ width: "fit-content" }}
              >
                <DateRangePicker
                  className="custom-date-range-picker"
                  displayFormat={moment
                    .localeData("en-IN")
                    .longDateFormat("LL")}
                  startDate={startDate}
                  startDateId="date_picker_start_date_id"
                  endDate={endDate}
                  endDateId="date_picker_end_date_id"
                  onDatesChange={handleDatesChange}
                  focusedInput={focusedInput}
                  onFocusChange={(focusedInput) =>
                    setFocusedInput(focusedInput)
                  }
                  isOutsideRange={isOutsideRangeStart}
                  readOnly
                />
              </div>
            )}

            <Checkbox
              label="All"
              checked={isChecked}
              onChange={(event) => {
                setIsChecked(event.target.checked);
              }}
            />
          </div>
          <Autocomplete
            className="background-color"
            placeholder="Select Fleet"
            options={options.map((fleet, index) => ({
              label: fleet.label,
              value: fleet.value,
              key: index,
            }))}
            value={selectedFleet}
            onChange={(event, selectedOption) => {
              setSelectedFleet(selectedOption);
              setLoadingInspected(true);
              setLoadingScrapRatio(true);
              setLoadingCasingRatio(true);
            }}
          />
          <Button
            disabled={
              getInspectedTyreData?.length === 0 &&
              getScrapRatioData?.length === 0 &&
              getCasingRatioData?.length === 0
            }
            style={{
              textAlign: "center",
              width: "150px",
              padding: "5px 0px",
              borderRadius: "6px",
              color:
                getInspectedTyreData?.length === 0 &&
                getScrapRatioData?.length === 0 &&
                getCasingRatioData?.length === 0
                  ? "#000"
                  : "white",
              backgroundColor:
                getInspectedTyreData?.length === 0 &&
                getScrapRatioData?.length === 0 &&
                getCasingRatioData?.length === 0 &&
                "EBEBE4",
            }}
            onClick={() => handleDownloadPdf()}
          >
            {pdfDownloadingLoader ? "Downloading..." : "Download"}
          </Button>
        </div>
      </div>
      <div ref={printRef} className="all-report-parent">
        <div className="all-report-component">
          <InspectedTyreTable
            getInspectedTyreData={getInspectedTyreData}
            loadingInspected={loadingInspected}
          />
          <ScrapRatioTable
            getScrapRatioData={getScrapRatioData}
            loadingScrapRatio={loadingScrapRatio}
          />
          <CasingRatio
            getCasingRatioData={getCasingRatioData}
            loadingCasingRatio={loadingCasingRatio}
          />
        </div>

        {getDefectPieChartData?.length === 0 &&
        getCategoryPieChartData?.length === 0 &&
        getPositionPieChartData?.length === 0 ? (
          <div className="empty-data" style={{ backgroundColor: "#fff" }}>
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
          <div className="chart-main-report">
            {getDefectPieChartData?.length !== 0 && (
              <div>
                <DefectPieChart getDefectPieChartData={getDefectPieChartData} />
              </div>
            )}

            {/* <div className="chart-child-report"> */}
            {getCategoryPieChartData?.length !== 0 && (
              <CategoryPie data={getCategoryPieChartData} />
            )}

            {getPositionPieChartData?.length !== 0 && (
              <PositionPieChart
                getPositionPieChartData={getPositionPieChartData}
              />
            )}
            {/* </div> */}
          </div>
        )}
      </div>
    </div>
  );
};

export default Report;
