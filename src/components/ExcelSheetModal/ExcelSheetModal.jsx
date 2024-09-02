import React, { useEffect, useState } from "react";
import "./ExcelSheetModal.css";
import "../TyreInspection/TyreInspection.css";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload, faXmark } from "@fortawesome/free-solid-svg-icons";
import ImageDisplay from "../ImageDisplay/ImageDisplay";
import { API_URL } from "../Config/index";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "../../common/common.css";

import { useDispatch, useSelector } from "react-redux";
import { REGRIP_SUPPLIER } from "../../redux/constants/Constant";

import PdfWithoutImages from "../PdfComponents/PdfWithoutImages/PdfWithoutImages";
import PdfWithImages from "../PdfComponents/PdfWithImages/PdfWithImages";

import ExcelWithoutImages from "../ExcelComponents/ExcelWithoutImages/ExcelWithoutImages";
import ExcelWithImages from "../ExcelComponents/ExcelWithImages/ExcelWithImages";

const ExcelSheetModal = ({
  setIsOpenExcelModal,
  cmp,
  fromDate,
  toDate,
  batchId,
  inspectionBy,
  tyreQty,
  totalAmt,
  userTyreCat,
  inspectionDate,
  fleetLocation,
  fleetName,
  fleetBranch,
  batchIdData,
}) => {
  console.log(batchId);

  const currentUser = useSelector((state) => state.getCurrentUser.role_id);
  const dummmyArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const [loading, setLoading] = useState(true);
  const [loadingExcelDownloadData, setLoadingExcelDownloadData] =
    useState(true);
  const [excelData, setExcelData] = useState([]);
  const [excelDataBase64, setExcelDataBase64] = useState();
  const [amountData, setAmountData] = useState(null);
  const [batchIdDataTyre, setBatchIdDataTyre] = useState();
  console.log("===",batchIdDataTyre);
  // const [downloadButtonText, setDownloadButtonText] = useState("Excel Download");s

  function DateFormat(inputDate) {
    const parsedDate = new Date(inputDate);

    const year = parsedDate.getFullYear();
    const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
    const day = String(parsedDate.getDate()).padStart(2, "0");
    const hours = String(parsedDate.getHours()).padStart(2, "0");
    const minutes = String(parsedDate.getMinutes()).padStart(2, "0");
    // const seconds = String(parsedDate.getSeconds()).padStart(2, '0');
    return `${year}:${month}:${day} ${hours}:${minutes}`;
  }

  if (cmp === "Regrip") {
    cmp = null;
  }

  function changeModalState() {
    setIsOpenExcelModal(false);
  }

  const getBatchIdInspection = async () => {
    let data = {
      batches: batchId.length > 0 ? batchId : [0],
    };
    try {
      const response = await axios.post(
        `${API_URL}/inspectionbatch/getbatchcount`,
        data
      );
      setBatchIdDataTyre(response?.data?.data);
    } catch (error) {
      console.log("Something went wrong", error);
    }
  };

  useEffect(() => {
    getBatchIdInspection();
    const getExcelData = async () => {
      let data = {
        from: fromDate ? fromDate : null,
        to: toDate ? toDate : null,
        fleet_name: null,
        supplier_name: cmp,
        batches: batchId,
      };

      let config = {
        method: "POST",
        maxLengthBody: Infinity,
        url: `${API_URL}/inspection/getdownloaddata`,
        data: data,
      };

      let amountPostData = {
        batches: batchId,
        supplier_brand_name: cmp === null ? "Regrip" : cmp,
      };

      let amountConfig = {
        method: "POST",
        maxLengthBody: Infinity,
        url: `${API_URL}/inspectionbatch/getbatchamount`,
        data: amountPostData,
      };

      try {
        setLoading(true);
        const response = await axios.request(config);
        const amountResponseData = (await axios.request(amountConfig)).data
          .data;
        setLoading(false);
        setExcelData(response.data.data);
        setAmountData(amountResponseData);
        getBase64Images(response.data.data);
      } catch (error) {
        console.error("Error in API", error);
      }
    };

    const getBase64Images = async (data) => {
      try {
        setLoadingExcelDownloadData(true);
        if (data) {
          const inspectionData = await Promise.all(
            data.map(async (inspection) => {
              inspection["tyre_serial_number_image_url_64"] = (
                await axios.get(
                  `${API_URL}/upload/readimagebase64?imagename=${inspection["tyre_serial_number_image_url"]}&folder=0`
                )
              ).data;
              inspection["inner_crown_image_64"] = (
                await axios.get(
                  `${API_URL}/upload/readimagebase64?imagename=${inspection["inner_crown_image"]}&folder=${inspection.inner_crown_defect_id}`
                )
              ).data;
              inspection["crown_area_image_64"] = (
                await axios.get(
                  `${API_URL}/upload/readimagebase64?imagename=${inspection["crown_area_image"]}&folder=${inspection.crown_area_defect_id}`
                )
              ).data;
              inspection["sidewall_area_image_64"] = (
                await axios.get(
                  `${API_URL}/upload/readimagebase64?imagename=${inspection["sidewall_area_image"]}&folder=${inspection.sidewall_area_defect_id}`
                )
              ).data;
              inspection["bead_image_64"] = (
                await axios.get(
                  `${API_URL}/upload/readimagebase64?imagename=${inspection["bead_image"]}&folder=${inspection.bead_defect_id}`
                )
              ).data;
              return inspection;
            })
          );
          setExcelDataBase64(inspectionData);
        } else {
          setLoading(false);
          console.log("Unable to get response");
        }
        setLoadingExcelDownloadData(false);
      } catch (e) {}
    };

    getExcelData();
  }, [cmp]);

  return (
    <div className="excel-modal">
      <div className="excel-Data">
        <div></div>
        <div className="excel-sheet-main-head">
          <div className="excel-head">
            <div className="head-left">
              {/* <h1 className="excel-heading">
                <FontAwesomeIcon
                  className="cmp"
                  icon={faBuilding}
                  style={{ color: "#39532f", marginRight: "11px" }}
                />
                {cmp ? "JK" : "REGRIP"}
              </h1> */}
              {/* <p className="date-style">
                <strong>From:</strong> {fromDate ? fromDate : "Not Selected"}
              </p>
              <p className="date-style">
                <strong>To:</strong> {toDate ? toDate : "Not Selected"}
              </p> */}
              {/* <p>Batch No: {batchId}</p> */}
            </div>

            <div className="close-btn-excel" style={{ display: "flex" }}>
              <div class="sec-center">
                <input
                  class="dropdown"
                  type="checkbox"
                  id="dropdown"
                  name="dropdown"
                />
                {loadingExcelDownloadData ? (
                  <label class="for-dropdown" for="dropdown">
                    Loading...
                    <FontAwesomeIcon
                      icon={faDownload}
                      style={{ color: "#ffffff" }}
                    />
                  </label>
                ) : (
                  <label class="for-dropdown" for="dropdown">
                    Download PDF
                    <FontAwesomeIcon
                      icon={faDownload}
                      style={{ color: "#ffffff" }}
                    />
                  </label>
                )}
                {console.log("======", batchIdDataTyre)}
                <div class="section-dropdown">
                  {excelDataBase64 && (
                    <PdfWithImages
                      batchIdDataTyre={batchIdDataTyre}
                      excelData={excelDataBase64}
                      s_name={excelDataBase64[0]}
                      cmp={cmp}
                      batchId={batchId}
                      inspectionBy={inspectionBy}
                      inspectionDate={inspectionDate}
                      fleetLocation={fleetLocation}
                      fleetName={fleetName}
                      fleetBranch={fleetBranch}
                      amountData={amountData}
                    />
                  )}
                  {excelDataBase64 && (
                    <PdfWithoutImages
                      batchIdDataTyre={batchIdDataTyre}
                      excelData={excelDataBase64}
                      s_name={excelDataBase64[0]}
                      cmp={cmp}
                      batchId={batchId}
                      inspectionBy={inspectionBy}
                      inspectionDate={inspectionDate}
                      fleetLocation={fleetLocation}
                      fleetName={fleetName}
                      fleetBranch={fleetBranch}
                      amountData={amountData}
                    />
                  )}
                </div>
              </div>
              <div class="sec-center-excel">
                <input
                  class="dropdown-excel"
                  type="checkbox"
                  id="dropdown-excel"
                  name="dropdown-excel"
                />
                {loadingExcelDownloadData ? (
                  <label class="for-dropdown-excel" for="dropdown-excel">
                    Loading...
                    <FontAwesomeIcon
                      icon={faDownload}
                      style={{ color: "#ffffff" }}
                    />
                  </label>
                ) : (
                  <label class="for-dropdown-excel" for="dropdown-excel">
                    Download Excel
                    <FontAwesomeIcon
                      icon={faDownload}
                      style={{ color: "#ffffff" }}
                    />
                  </label>
                )}

                <div class="section-dropdown-excel">
                  {excelDataBase64 && (
                    <ExcelWithImages
                      batchIdDataTyre={batchIdDataTyre}
                      excelData={excelDataBase64}
                      s_name={excelDataBase64[0]}
                      cmp={cmp}
                      batchId={batchId}
                      inspectionBy={inspectionBy}
                      inspectionDate={inspectionDate}
                      fleetLocation={fleetLocation}
                      fleetName={fleetName}
                      fleetBranch={fleetBranch}
                      amountData={amountData}
                    />
                  )}
                  {excelDataBase64 && (
                    <ExcelWithoutImages
                      batchIdDataTyre={batchIdDataTyre}
                      excelData={excelDataBase64}
                      s_name={excelDataBase64[0]}
                      cmp={cmp}
                      batchId={batchId}
                      inspectionBy={inspectionBy}
                      inspectionDate={inspectionDate}
                      fleetLocation={fleetLocation}
                      fleetName={fleetName}
                      fleetBranch={fleetBranch}
                      amountData={amountData}
                    />
                  )}
                </div>
              </div>
              <button
                onClick={changeModalState}
                style={{ width: 30, cursor: "pointer" }}
                className="cross-excel"
              >
                <FontAwesomeIcon
                  icon={faXmark}
                  style={{ color: "rgb(78 77 77)" }}
                />
              </button>
            </div>
          </div>
          <div className="excel-detail-container">
            <table className="excel-table" id="table-to-xls" cellPadding="2">
              <thead>
                <tr className="excel-table-heading">
                  <th style={{ borderTopLeftRadius: "15px" }}>
                    Inspection Date
                  </th>
                  <th
                    style={{
                      display:
                        currentUser !== REGRIP_SUPPLIER ? "none" : "visible",
                    }}
                  >
                    Supplier Name
                  </th>
                  <th
                    style={{
                      display:
                        currentUser !== REGRIP_SUPPLIER ? "none" : "visible",
                    }}
                  >
                    Supplier Code
                  </th>
                  <th>Tyre Serial Number</th>
                  <th>Tyre Size</th>
                  <th
                    style={{
                      display:
                        currentUser !== REGRIP_SUPPLIER ? "none" : "visible",
                    }}
                  >
                    Tyre Brand
                  </th>
                  <th>Tyre Modal</th>
                  {/* <th
                    style={{
                      display:
                        currentUser !== REGRIP_SUPPLIER ? "none" : "visible",
                    }}
                  >
                    System Tyre Category
                  </th> */}
                  <th>User Tyre Category</th>
                  <th>Product Category</th>
                  <th>Tyre Description</th>
                  <th>Crown Area Defect</th>
                  <th>Crown Area Image</th>
                  <th>SideWall Area Defect</th>
                  <th>SideWall Area Image</th>
                  <th>InnerCrown Defect</th>
                  <th>InnerCrown Image</th>
                  <th>Bead Defect</th>
                  <th style={{ borderTopRightRadius: "15px" }}>Bead Image</th>
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
                  : excelData.map((excelData, i) => {
                      const {
                        inspection_date,
                        supplier_name,
                        supplier_code,
                        tyre_serial_number,
                        tyre_size,
                        tyre_brand_name,
                        tyre_model_name,
                        // tyre_category_name,
                        user_category_name,
                        product_category,
                        tyre_description,
                        crown_area_defect_id,
                        crown_area_defect,
                        crown_area_image,
                        sidewall_area_defect_id,
                        sidewall_area_defect,
                        sidewall_area_image,
                        inner_crown_defect_id,
                        inner_crown_defect,
                        inner_crown_image,
                        bead_defect_id,
                        bead_defect,
                        bead_image,
                      } = excelData;

                      return (
                        <tr className="table-data" key={i}>
                          <td>{DateFormat(inspection_date)}</td>
                          <td
                            className="supplier-name-column"
                            style={{
                              display:
                                currentUser !== REGRIP_SUPPLIER
                                  ? "none"
                                  : "visible",
                            }}
                          >
                            {supplier_name}
                          </td>
                          <td
                            style={{
                              display:
                                currentUser !== REGRIP_SUPPLIER
                                  ? "none"
                                  : "visible",
                            }}
                          >
                            {supplier_code}
                          </td>
                          <td>
                            {tyre_serial_number.length > 15
                              ? `${tyre_serial_number.substring(0, 15)}...`
                              : tyre_serial_number}
                          </td>
                          <td>{tyre_size}</td>
                          <td
                            style={{
                              display:
                                currentUser !== REGRIP_SUPPLIER
                                  ? "none"
                                  : "visible",
                            }}
                          >
                            {tyre_brand_name}
                          </td>
                          <td>{tyre_model_name}</td>
                          {/* <td
                          style={{
                            display:
                              currentUser !== REGRIP_SUPPLIER
                                ? "none"
                                : "visible",
                          }}
                        >
                          {tyre_category_name}
                        </td> */}
                          <td>{user_category_name}</td>
                          <td>{product_category}</td>
                          <td>{tyre_description}</td>
                          <td style={{ textTransform: "capitalize" }}>
                            {crown_area_defect}
                          </td>
                          <td>
                            {crown_area_defect === "ok" ? (
                              <img
                                src={require("../../assets/Placeholder_view_vector.png")}
                                alt="Dummy Img"
                                width="80"
                              />
                            ) : (
                              <ImageDisplay
                                imageUrl={crown_area_image}
                                imageId={crown_area_defect_id}
                              />
                            )}
                          </td>

                          <td style={{ textTransform: "capitalize" }}>
                            {sidewall_area_defect}
                          </td>
                          <td>
                            {sidewall_area_defect === "ok" ? (
                              <img
                                src={require("../../assets/Placeholder_view_vector.png")}
                                alt="Dummy Img"
                                width="80"
                              />
                            ) : (
                              <ImageDisplay
                                imageUrl={sidewall_area_image}
                                imageId={sidewall_area_defect_id}
                              />
                            )}
                          </td>

                          <td style={{ textTransform: "capitalize" }}>
                            {inner_crown_defect}
                          </td>

                          <td>
                            {inner_crown_defect === "ok" ? (
                              <img
                                src={require("../../assets/Placeholder_view_vector.png")}
                                alt="Dummy Img"
                                width="80"
                              />
                            ) : (
                              <ImageDisplay
                                imageUrl={inner_crown_image}
                                imageId={inner_crown_defect_id}
                              />
                            )}
                          </td>

                          <td style={{ textTransform: "capitalize" }}>
                            {bead_defect}
                          </td>
                          <td>
                            {bead_defect === "ok" ? (
                              <img
                                src={require("../../assets/Placeholder_view_vector.png")}
                                alt="Dummy Img"
                                width="80"
                              />
                            ) : (
                              <ImageDisplay
                                imageUrl={bead_image}
                                imageId={bead_defect_id}
                              />
                            )}
                          </td>
                        </tr>
                      );
                    })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExcelSheetModal;
