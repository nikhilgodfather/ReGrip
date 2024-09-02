import React, { useCallback, useEffect, useState } from "react";
import "./TyreInspection.css";
import axios from "axios";
import TyreInspectionDetailsModal from "../TyreInspectionDetailsModal/TyreInspectionDetailsModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faBuilding,
  faAngleDown,
  faDownload,
  faChevronLeft,
} from "@fortawesome/free-solid-svg-icons";
import not_found from "../../assets/sorry-item-not-found.png";
import { API_URL } from "../Config/index";
import ExcelSheetModal from "../ExcelSheetModal/ExcelSheetModal";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "../../common/common.css";
import { useDispatch, useSelector } from "react-redux";
import { getDefectTypes } from "../../redux/actions/DefectAction";
import { REGRIP_SUPPLIER } from "../../redux/constants/Constant";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Box, InputLabel, MenuItem, FormControl, Select, Checkbox, Pagination } from "@mui/material";

import Home from "../Home/Home";

const TyreInspection = ({ handleBackButton }) => {
  const [open1, setOpen1] = useState(false);
  const [open2, setOpen2] = useState(false);


  const currentUser = useSelector((state) => state.getCurrentUser.role_name);
  const dummmyArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const [loading, setLoading] = useState(true);
  const [batchData, setBatchData] = useState([]);
  const [inspectionDetailsModal, setInspectionDetailsModal] = useState(false);
  const [batchId, setBatchId] = useState([]);
  const [nameFilter, setNameFilter] = useState("");
  const [startDateFilter, setStartDateFilter] = useState("");
  const [endDateFilter, setEndDateFilter] = useState("");
  const [selectedOption, setSelectedOption] = useState("Regrip");
  const [supplierData, setSupplierData] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState([]);

  const [isOpenExcelModal, setIsOpenExcelModal] = useState(false);

  const [inspectionBy, setInspectionBy] = useState("");
  const [tyreQty, setTyreQty] = useState("");
  const [totalAmt, setTotalAmt] = useState("");
  const [userTyreCat, setUserTyreCat] = useState("");
  const [inspectionDate, setInspectionDate] = useState("");
  const [fleetName, setFleetName] = useState([]);
  const [fleetBranch, setFleetBranch] = useState([]);
  const [fleetLocation, setFleetLocation] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState()
  let blocked = false


  const defects = useSelector(state => state.getDefectTypes.defects)

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  function DateFormat(inputDateTime) {
    const date = new Date(inputDateTime);
    const day = date.getUTCDate();
    const month = months[date.getUTCMonth()];
    const year = date.getUTCFullYear() % 100;
    return `${day}-${month}-${year}`;
  }

  const itemsPerPage = 20;

  const handlePageChange = (page) => {
    setCurrentPage(page);
    // fetchData(page);
  };


  const fetchData = async (page) => {
    try {
      if (!blocked) {
        blocked = true
        setLoading(true);
        let apiUrl = `${API_URL}/inspectionbatch/getalldata?suppliername=`;

        if (selectedOption === "Regrip") {
          apiUrl += `&page=${page}&limit=${itemsPerPage}`;
        } else {
          apiUrl += `${selectedOption}&page=${page}&limit=${itemsPerPage}`;
        }
        const { data } = await axios.get(apiUrl);
        const { inspection } = data.data;
        setLoading(false);

        const dataLen = data.data.total_batches



        const total = Math.ceil(dataLen / itemsPerPage)
        setTotalPages(total)
        blocked = false

        if (selectedOption === "Regrip") {
          setBatchData(inspection);
        } else {
          setSupplierData(inspection);
        }
      }
    } catch (error) {
      console.error("Error fetching inspection data:", error);
      setBatchData([]);
    }
  };

  const handleOptionChange = (option) => {
    setSelectedOption(option);
    setSelectedBatch([]);
    setCurrentPage(1);
  };

  useEffect(() => {
    if (currentUser && currentUser !== REGRIP_SUPPLIER) {
      handleOptionChange(currentUser);
    }
    fetchData(currentPage);

  }, [currentPage, selectedOption, currentUser]);

  const filteredData = (selectedOption === "Regrip" ? batchData : supplierData).filter(
    (batch) => {
      const nameFilterLowerCase = nameFilter ? nameFilter.toLowerCase() : "";

      let nameMatches = false;
      if (selectedOption === "Regrip" && batch.supplier_name) {
        nameMatches = batch.supplier_name
          .toLowerCase()
          .includes(nameFilterLowerCase);
      } else if (selectedOption !== "Regrip" && batch.fleet_name) {
        nameMatches = batch.fleet_name
          .toLowerCase()
          .includes(nameFilterLowerCase);
      }

      const startDate = new Date(startDateFilter);
      const endDate = new Date(endDateFilter);
      const batchDate = new Date(batch.batch_date);

      const dateMatches =
        (!startDateFilter || batchDate >= startDate) &&
        (!endDateFilter || batchDate <= endDate);

      return nameMatches && dateMatches;
    }
  );

  const handleCheckboxChange = (itemId) => {

    const selectedItemIndex = selectedBatch.indexOf(itemId);
    let updatedSelectedBatch = [...selectedBatch];

    if (selectedItemIndex === -1) {
      updatedSelectedBatch = [...selectedBatch, itemId];
    } else {
      updatedSelectedBatch.splice(selectedItemIndex, 1);
    }

    setSelectedBatch(updatedSelectedBatch);

    setTimeout(() => {
      const selectedItems = filteredData.filter((sup) =>
        updatedSelectedBatch.includes(sup.batch_id)
      );

      const selectedFleetNames = selectedItems.map((sup) => sup.fleet_name).join(", ");
      const selectedFleetBranch = selectedItems.map((sup) => sup.fleet_branch_name).join(", ");
      const selectedFleetLocations = selectedItems.map((sup) => sup.google_location).join(", ");
      const selectedInspectionDates = selectedItems.map((sup) => DateFormat(sup.batch_date)).join(", ");

      setFleetName(selectedFleetNames);
      setFleetBranch(selectedFleetBranch);
      setFleetLocation(selectedFleetLocations);
      setInspectionDate(selectedInspectionDates);
    }, 0);
  };


  return (
    <div className="tyre-inspection-container">
      {inspectionDetailsModal && (
        <TyreInspectionDetailsModal
          setInspectionDetailsModal={setInspectionDetailsModal}
          selectedOption={selectedOption}
          batchId={batchId}
        />
      )}
      {inspectionDetailsModal && (
        <Home
          setInspectionDetailsModal={setInspectionDetailsModal}
          batchId={batchId}
        />
      )}

      {isOpenExcelModal && (
        <ExcelSheetModal
          setIsOpenExcelModal={setIsOpenExcelModal}
          fromDate={startDateFilter}
          toDate={endDateFilter}
          cmp={selectedOption}
          batchId={selectedBatch}
          inspectionBy={inspectionBy}
          totalAmt={totalAmt}
          tyreQty={tyreQty}
          userTyreCat={userTyreCat}
          inspectionDate={inspectionDate}
          fleetLocation={fleetLocation}
          fleetName={fleetName}
          fleetBranch={fleetBranch}
        />
      )}
      <div className="tyre-inspection-heading">
        <div className="heading_and_filter">
          <h1 className="heading1" style={{ marginBottom: 30 }}>
            {/* <FontAwesomeIcon
              onClick={() => {
                handleBackButton();
              }}e
              icon={faChevronLeft}
              color="#65a143"
              style={{ marginRight: 6, cursor: 'pointer' }}
            /> */}
            Tyre Inspection
          </h1>





          <div className="inspection-filters">

            {
              currentUser === REGRIP_SUPPLIER &&
              <Box
                sx={{ minWidth: 120 }}
                // style={{
                //   display: currentUser !== REGRIP_SUPPLIER ? "none" : "visible",
                // }}
              >
                <FormControl fullWidth>
                  <Select
                    className="dropdown-cmp-btn"
                    id="demo-simple-select"
                    value={selectedOption}
                    label=""
                    onChange={(e) => handleOptionChange(e.target.value)}
                  >
                    <MenuItem className="MenuItem" value={"Regrip"}>
                      Regrip
                    </MenuItem>
                    <MenuItem className="MenuItem" value={"JK"}>
                      JK
                    </MenuItem>
                    <MenuItem className="MenuItem" value={"Bridgestone"}>
                      Bridgestone
                    </MenuItem>
                  </Select>
                </FormControl>
              </Box>
            }


            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <span style={{ fontSize: "1vw" }}>from:</span>
              <DatePicker
                className="date-picker"
                value={startDateFilter}
                onChange={(e) => {
                  setStartDateFilter(e.$d);
                }}
                disableFuture={true}
                open={open2}
                onClose={() => setOpen2(false)}
                slotProps={{
                  textField: {
                    onClick: () => setOpen2(true),
                  },
                }}
              />
              <span style={{ fontSize: "1vw" }}>to:</span>

              <DatePicker
                className="date-picker"
                value={endDateFilter}
                onChange={(e) => {
                  setEndDateFilter(e.$d);
                }}
                disableFuture={true}
                open={open1}
                onClose={() => setOpen1(false)}
                slotProps={{
                  textField: {
                    onClick: () => setOpen1(true),
                  },
                }}
              />
            </LocalizationProvider>
          </div>
        </div>
        <div className="company-container">
          <div className="inspection-filters">
            <input
              id="search-field"
              type="text"
              placeholder="Search Fleet Name..."
              value={nameFilter}
              onChange={(e) => setNameFilter(e.target.value)}
            />
          </div>
          <div className="excel-btn">
            {/* <button type="button" onClick={() => { setIsOpenExcelModal(true) }}>
              <FontAwesomeIcon icon={faDownload} style={{ color: "#f0f2f5", }} />
              Save As Excel / PDF
            </button> */}

            {/* <button type="button" onClick={() => { navigate('/excelSheet?cmp=JK') }}>
                <FontAwesomeIcon icon={faDownload} style={{ color: "#f0f2f5", }} />
                Download Excel
              </button> */}
          </div>
        </div>
      </div>
      <div className="inspection-table-mega-container">
        <div className="inspection-table-container">
          <table className="inspection-table">
            {selectedOption === "Regrip" ? (
              <>
                <thead>
                  <tr className="table-heading">
                    <th style={{ borderTopLeftRadius: "15px" }}>SNo</th>
                    <th>Date</th>
                    <th>Supplier Name</th>
                    <th>Tyre Quantity</th>
                    <th>Total Amount</th>
                    <th>Inspection By</th>
                    <th>Action</th>
                    {/* <th>
                      {" "}
                      <p
                        onClick={() => {
                          let allSelectedBatches =
                            selectedBatch.length > 0
                              ? []
                              : batchData.map((batch) => {
                                return batch.batch_id;
                              });
                          setSelectedBatch(allSelectedBatches);
                        }}
                      >
                        Save As Excel / PDF
                      </p>
                    </th> */}
                    <th style={{ borderTopRightRadius: "15px" }}>
                      <div className="ep-btn">
                        <button
                          style={{ backgroundColor: selectedBatch.length > 0 ? 'white' : '#39532f', color: selectedBatch.length > 0 ? '#39532f' : '#f3f2ad' }}
                          type="button"
                          onClick={() => {
                            selectedBatch.length > 0 && setIsOpenExcelModal(true);
                            setSelectedBatch(selectedBatch);
                          }}
                        > Download
                          <FontAwesomeIcon icon={faDownload} />
                        </button>{" "}
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {loading === true ? (
                    dummmyArray.map((i) => (
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
                        <td>
                          <Skeleton />
                        </td>
                      </tr>
                    ))
                  ) : filteredData.length > 0 ? (
                    filteredData.map((batch, i) => (
                      <tr className="table-data" key={i}>
                        <td>{(i + 1) + ((currentPage - 1) * itemsPerPage)}</td>
                        <td>{DateFormat(batch.batch_date)}</td>
                        <td className="supplier-name-column">
                          {batch.supplier_name}
                        </td>

                        <td>
                          <div className="tooltip">
                            <div
                              style={{
                                position: "relative",
                                width: "max-content",
                                margin: "0px auto",
                              }}
                            >
                              <button id="tyre-quantity-button">
                                {batch.tyre_quantity}
                              </button>
                              <div className="tooltiptext">
                                {Object.entries(batch.user_tyre_categories)
                                  .filter(([key, value]) => value > 0)
                                  .map(([key, value]) => (
                                    <p key={key}>{`${key} - ${value}`}</p>
                                  ))}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td>{batch.total_amount}</td>
                        <td>{currentUser !== REGRIP_SUPPLIER ? "Regrip" : batch.username}</td>

                        <td>
                          {
                            <div className="action-btn">
                              <button
                                type="button"
                                onClick={() => {
                                  if (defects) {
                                    setInspectionDetailsModal(true);
                                    setBatchId(batch.batch_id);
                                  }
                                }}
                              >
                                <FontAwesomeIcon
                                  icon={faEye}
                                  className="view-eye"
                                />{" "}
                                View
                              </button>
                            </div>
                          }
                        </td>
                        {/* <td>
                          {" "}
                          <div className="ep-btn">
                            <button
                              type="button"
                              onClick={() => {
                                setBatchId(batch.batch_id);
                                setIsOpenExcelModal(true);
                                setSelectedBatch([batch.batch_id]);
                                setInspectionBy(batch.username);
                                setTyreQty(batch.tyre_quantity);
                                setTotalAmt(batch.total_amount);
                                setInspectionDate(DateFormat(batch.batch_date));
                                const filteredUserTyreCat = Object.entries(
                                  batch.user_tyre_categories
                                )
                                  .filter(([key, value]) => value > 0)
                                  .map(([key, value]) => `${key}(${value})`)
                                  .join(", ");

                                setUserTyreCat(filteredUserTyreCat);
                              }}
                            >
                              <FontAwesomeIcon icon={faDownload} />
                            </button>{" "}
                            <input
                              type="checkbox"
                              checked={selectedBatch.includes(batch.batch_id)}
                              onChange={() => {
                                handleCheckboxChange(batch.batch_id);
                              }}
                            />
                          </div>
                        </td> */}
                        <td>
                          <Checkbox
                            checked={selectedBatch.includes(batch.batch_id)}
                            onChange={() => {
                              handleCheckboxChange(batch.batch_id);
                            }}
                            color="success"
                          />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="8"
                        rowSpan="8"
                        style={{ width: "100%", paddingBottom: 50 }}
                      >
                        <h3 className="no-entries-message">
                          <img
                            src={not_found}
                            alt=""
                            height={240}
                            style={{ margin: 10 }}
                          />
                          {nameFilter && startDateFilter && endDateFilter
                            ? "No matching entries for the selected filters."
                            : nameFilter && !startDateFilter && !endDateFilter
                              ? "No matching entries for the name."
                              : startDateFilter || endDateFilter
                                ? "No entries found within the selected date range."
                                : "No entries found."}
                        </h3>
                      </td>
                    </tr>
                  )}
                </tbody>
              </>
            ) : (
              <>
                <thead>
                  <tr className="table-heading">
                    <th style={{ borderTopLeftRadius: "15px" }}>SNo</th>
                    <th>Date</th>
                    {/* <th style={{ display: currentUser === JK_ROLE_ID ? "none" : "visible" }}>Supplier Name</th> */}
                    <th>Fleet Name</th>
                    <th>Branch Name</th>
                    {/* <th style={{ display: currentUser === JK_ROLE_ID ? "none" : "visible" }}>G-location</th>  x */}
                    <th>Tyre Quantity</th>
                    <th>Total Amount</th>
                    <th>Inspection By</th>
                    <th>Action</th>
                    {/* <th  style={{ borderTopRightRadius: "15px" }}>
                      {" "}
                      <p
                        onClick={() => {
                          let allSelectedBatches =
                            selectedBatch.length > 0
                              ? []
                              : supplierData.map((batch) => {
                                return batch.batch_id;
                              });
                          setSelectedBatch(allSelectedBatches);
                        }}
                      >
                        Save As Excel / PDF
                      </p>
                    </th> */}
                    <th>
                      <div className="ep-btn">
                        <button
                          style={{ backgroundColor: selectedBatch.length > 0 ? 'white' : '#39532f', color: selectedBatch.length > 0 ? '#39532f' : '#f3f2ad' }}
                          type="button"
                          onClick={() => {
                            selectedBatch.length > 0 && setIsOpenExcelModal(true);
                            setSelectedBatch(selectedBatch);
                          }}
                        > Download
                          <FontAwesomeIcon icon={faDownload} />
                        </button>{" "}
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {loading === true ? (
                    dummmyArray.map((i) => (
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
                  ) : filteredData.length > 0 ? (
                    filteredData.map((sup, i) => (
                      <tr className="table-data" key={i}>
                        <td>{(i + 1) + ((currentPage - 1) * itemsPerPage)}</td>
                        <td>{DateFormat(sup.batch_date)}</td>
                        {/* <td style={{  display: currentUser === JK_ROLE_ID ? "none" : "visible" }}>{jk.supplier_name}</td> */}
                        <td>{sup.fleet_name}</td>
                        <td>{sup.fleet_branch_name}</td>
                        {/* <td style={{  display: currentUser === JK_ROLE_ID ? "none" : "visible" }}>{jk.google_location}</td> */}

                        <td>
                          <div className="tooltip">
                            <div
                              style={{
                                position: "relative",
                                width: "max-content",
                                margin: "0px auto",
                              }}
                            >
                              <button id="tyre-quantity-button">
                                {sup.tyre_quantity}
                              </button>
                              <div className="tooltiptext">
                                {Object.entries(sup.user_tyre_categories)
                                  .filter(([key, value]) => value > 0)
                                  .map(([key, value]) => (
                                    <p key={key}>{`${key} - ${value}`}</p>
                                  ))}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>&#8377; {sup.total_amount}</td>
                        <td>{currentUser !== REGRIP_SUPPLIER ? "Regrip" : sup.username}</td>
                        <td>
                          <div className="action-btn">
                            <button
                              type="button"
                              onClick={() => {
                                setInspectionDetailsModal(true);
                                setBatchId(sup.batch_id);
                              }}
                            >
                              <FontAwesomeIcon
                                icon={faEye}
                                className="view-eye"
                              />{" "}
                              Batch
                            </button>
                          </div>
                        </td>
                        {/* <td>
                          {" "}
                          <div className="ep-btn">
                            <button
                              type="button"
                              onClick={() => {
                                setIsOpenExcelModal(true);
                                setBatchId(sup.batch_id);
                                setSelectedBatch([sup.batch_id]);
                                setInspectionBy(sup.username);
                                setTyreQty(sup.tyre_quantity);
                                setTotalAmt(sup.total_amount);
                                setFleetLocation(sup.google_location);
                                setFleetName(sup.fleet_name);
                                setInspectionDate(DateFormat(sup.batch_date));
                                const filteredUserTyreCat = Object.entries(
                                  sup.user_tyre_categories
                                )
                                  .filter(([key, value]) => value > 0)
                                  .map(([key, value]) => `${key}(${value})`)
                                  .join(", ");
                                setUserTyreCat(filteredUserTyreCat);
                              }}
                            >
                              <FontAwesomeIcon icon={faDownload} />
                            </button>{" "}
                          </div>

                        </td> */}
                        <td>
                          {/* <input
                            type="checkbox"
                            checked={selectedBatch.includes(sup.batch_id)}
                            onChange={() => {
                              handleCheckboxChange(sup.batch_id);
                            }}
                          /> */}

                          <Checkbox
                            checked={selectedBatch.includes(sup.batch_id)}
                            onChange={() => {
                              handleCheckboxChange(sup.batch_id);
                              setFleetLocation(sup.google_location);
                              setFleetName(sup.fleet_name);
                              setFleetBranch(sup.fleet_branch_name);
                              setInspectionDate(DateFormat(sup.batch_date));
                            }}
                            color="success"
                          />

                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="11"
                        rowSpan="8"
                        style={{ width: "100%", paddingBottom: 50 }}
                      >
                        <h3 className="no-entries-message">
                          <img
                            src={not_found}
                            alt=""
                            height={240}
                            style={{ margin: 10 }}
                          />
                          {nameFilter && startDateFilter && endDateFilter
                            ? "No matching entries for the selected filters."
                            : nameFilter && !startDateFilter && !endDateFilter
                              ? "No matching entries for the name."
                              : startDateFilter || endDateFilter
                                ? "No entries found within the selected date range."
                                : "No entries found."}
                        </h3>
                      </td>
                    </tr>
                  )}
                </tbody>
              </>
            )}
          </table>
        </div>
      </div>

      {/* <div className="pagination-container">{renderPaginationButtons()}</div> */}
      <div className="pagination-container" style={{ textAlign: 'center' }}>
        <Pagination count={totalPages} page={currentPage} onChange={(e, value) => handlePageChange(value)} />
      </div>
    </div>
  );
};

export default TyreInspection;
