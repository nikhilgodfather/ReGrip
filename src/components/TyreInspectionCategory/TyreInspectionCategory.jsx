import React, { useEffect, useState } from "react";
import "./TyreInspectionCategory.css";
import { faChevronLeft, faXmark } from "@fortawesome/free-solid-svg-icons";
import Skeleton from "react-loading-skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
} from "@mui/material";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Placeholder_view_vector from "../../assets/Placeholder_view_vector.png";
import { faImage } from "@fortawesome/free-solid-svg-icons";
import SerialNoImageModal from "../SerialNoImageModal/SerialNoImageModal";
import { API_URL } from "../Config";
import ShowImagesModal from "../ShowImagesModal/ShowImagesModal";
import ShowVideosModal from "../ShowVideosModal/ShowVideosModal";
import { useSelector } from "react-redux";
import axios from "axios";
import TyreInspectionModal from "../TyreInspectionModal/TyreInspectionModal";
import HomeDownloadPDF from "../PdfComponents/HomeDownloadPDF/HomeDownloadPDF";
import { REGRIP_SUPPLIER } from "../../redux/constants/Constant";
import Modal from "@mui/joy/Modal";
import ModalClose from "@mui/joy/ModalClose";
import Sheet from "@mui/joy/Sheet";
import {
  Autocomplete,
  Button,
  MenuItem,
  Option,
  Select,
  TextField,
} from "@mui/joy";
import { useLocation, useNavigate } from "react-router-dom";
import TyreInspectionCategoryExcel from "./TyreInspectionCategoryExcel/TyreInspectionCategoryExcel";

const TyreInspectionByCategory = () => {
  const dummmyArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  const [serialNoURL, setSerialNoURL] = useState();
  const location = useLocation();
  const [category, setCategory] = useState();
  const [tyreSerialNumber, setTyreSerialNumber] = useState();
  const [serialImagesModal, setSerialImagesModal] = useState(false);
  const [editTyreData, setEditTyreData] = useState([]);
  const [showImages, setShowImages] = useState(false);
  const [showVideos, setShowVideos] = useState(false);
  const [defectIdToNameMap, setDefectIdToNameMap] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [totalItemCount, setTotalItemCount] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10); // Number of rows per page

  useEffect(()=>{
    setCategory(location?.pathname?.split('/')[3])
  },[location.pathname])
  let okImage;

  const defect = useSelector((state) => state.getDefectTypes.defects);

  const currentUser = useSelector((state) => state.getCurrentUser.role_name);

  const navigate = useNavigate();
  const [getInspectionData, setgetInspectionData] = useState([]);
  const [
    allDataForDownloadTyreInspection,
    setAllDataForDownloadTyreInspection,
  ] = useState([]);
  const [fleetData, setFleetData] = useState([]);
  const [selectedFleet, setSelectedFleet] = useState(null);
  const [fleetBranch, setFleetBranch] = useState([]);
  const [selectedFleetBranch, setSelectedFleetBranch] = useState(null);
  const [showFleetWarning, setShowFleetWarning] = useState(false);

  const getFleetAndSupplierData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) navigate("/");
      const bearer_token = "bearer " + JSON.parse(token);
      setLoading(true);
      const { data } = await axios.get(`${API_URL}/fleets/getFleetsData`, {
        headers: {
          Authorization: bearer_token,
        },
      });
      const fleets = data.rows;
      setLoading(false);
      setFleetData(fleets);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const getAllDataForDownload = async () => {
    let dataDownload = {
      fleet_id: selectedFleet?.fleet_id,
      fleet_branch_id: selectedFleetBranch
        ? selectedFleetBranch?.map((branch) => branch?.fleet_branch_id)
        : null,
      tyre_category_id: category,
      limit: totalItemCount,
      page: 1,
    };
    try {
      const token = localStorage.getItem("token");
      const bearer_token = "bearer " + JSON.parse(token);

      const response = await axios.post(
        `${API_URL}/inspection/getinspectioncategory`,
        dataDownload,
        {
          headers: {
            Authorization: bearer_token,
          },
        }
      );
      setAllDataForDownloadTyreInspection(response.data.data.inspections);
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };

  const getInspectionDataByFilter = async () => {
    let dataInspection = {
      fleet_id: selectedFleet?.fleet_id,
      fleet_branch_id: selectedFleetBranch
        ? selectedFleetBranch.map((branch) => branch.fleet_branch_id)
        : null,
      tyre_category_id: category,
      limit: rowsPerPage,
      page: page + 1,
    };

    if (selectedFleet === null) {
      dataInspection.fleet_id = null;
    }

    try {
      const token = localStorage.getItem("token");
      const bearer_token = "bearer " + JSON.parse(token);

      const response = await axios.post(
        `${API_URL}/inspection/getinspectioncategory`,
        dataInspection,
        {
          headers: {
            Authorization: bearer_token,
          },
        }
      );
      setgetInspectionData(response.data.data);
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };

  const getFleetBranch = async (fleetId) => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${API_URL}/fleets/getbranchesdata?fleetid=${fleetId}`
      );
      const fleetsBySupplierID = data.data.branches;
      setLoading(false);
      setFleetBranch(fleetsBySupplierID);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleChangeFleet = (event, newValue) => {
    setSelectedFleet(newValue);
    if (!newValue) {
      setSelectedFleetBranch([]);
    } else if (selectedFleetBranch) {
      const filteredBranches = selectedFleetBranch.filter((branch) =>
        newValue.fleet_branch_ids.includes(branch.fleet_branch_id)
      );
      setSelectedFleetBranch(filteredBranches);
    }

    if (newValue) {
      getFleetBranch(newValue.fleet_id);
      setPage(0);
    }
  };

  const getDefectNames = async () => {
    try {
      const defectMap = {};
      defect.defects.forEach((defect) => {
        defectMap[defect.tyre_defect_id] = defect.tyre_defect_name;
      });

      setDefectIdToNameMap(defectMap);
    } catch (error) {
      console.log("Error while getting defects", error);
    }
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  useEffect(() => {
    const fetchData = async () => {
      await getInspectionDataByFilter();
      getFleetAndSupplierData();
      getDefectNames();
      setTotalItemCount(getInspectionData?.total_count);
    };
    fetchData();
  }, [
    category,
    selectedFleet,
    selectedFleetBranch,
    rowsPerPage,
    page,
    getInspectionData?.total_count,
  ]);

  useEffect(() => {
    getAllDataForDownload();
  }, [totalItemCount]);

  useEffect(() => {
    if (selectedFleet !== null) {
      setShowFleetWarning(false);
    }
  }, [selectedFleet]);

  return (
    <div className="tyre-inspection-container">
      <Modal
        aria-labelledby="modal-title"
        aria-describedby="modal-desc"
        open={showImages}
        onClose={() => {
          setShowImages(false);
        }}
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <Sheet
          variant="plain"
          sx={{
            width: "fit-content",
            height: "fit-content",
            borderRadius: "md",
            p: 3,
            boxShadow: "lg",
            position: "relative",
            backgroundColor: "#F1F1F1 !important",
          }}
        >
          <ModalClose variant="plain" sx={{ m: 0 }} />
          <ShowImagesModal
            setShowImages={setShowImages}
            editTyreData={editTyreData}
            setEditTyreData={setEditTyreData}
          />
        </Sheet>
      </Modal>

      <Modal
        aria-labelledby="modal-title"
        aria-describedby="modal-desc"
        open={showVideos}
        onClose={() => {
          setShowVideos(false);
        }}
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <Sheet
          variant="plain"
          sx={{
            width: "fit-content",
            height: "fit-content",
            borderRadius: "md",
            p: 3,
            boxShadow: "lg",
            position: "relative",
            backgroundColor: "#F1F1F1 !important",
          }}
        >
          <ModalClose variant="plain" sx={{ m: 0 }} />
          <ShowVideosModal
            setShowVideos={setShowVideos}
            editTyreData={editTyreData}
            setEditTyreData={setEditTyreData}
          />
        </Sheet>
      </Modal>

      <Modal
        aria-labelledby="modal-title"
        aria-describedby="modal-desc"
        open={serialImagesModal}
        onClose={() => {
          setSerialImagesModal(false);
        }}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Sheet
          variant="plain"
          sx={{
            width: "fit-content",
            height: "fit-content",
            borderRadius: "md",
            p: 3,
            boxShadow: "lg",
            position: "relative",
            backgroundColor: "#F1F1F1 !important",
          }}
        >
          <ModalClose variant="plain" sx={{ m: 0 }} />
          <SerialNoImageModal
            serialNoURL={serialNoURL}
            tyreSerialNumber={tyreSerialNumber}
            setSerialImagesModal={setSerialImagesModal}
          />
        </Sheet>
      </Modal>

      <div className="tyre-inspection-heading">
        <div className="heading_and_filter">
          <h1 className="heading1">
            <FontAwesomeIcon
              onClick={() => {
                navigate('/home')
              }}
              icon={faChevronLeft}
              color="#65a143"
              style={{ marginRight: 6, cursor: "pointer" }}
            />
            Category
            {category && category === 1 && (
              <span style={{ marginLeft: "10px" }}>A</span>
            )}
            {category && category === 2 && (
              <span style={{ marginLeft: "10px" }}>B</span>
            )}
            {category && category === 3 && (
              <span style={{ marginLeft: "10px" }}>C</span>
            )}
            {category && category === 4 && (
              <span style={{ marginLeft: "10px" }}>C+</span>
            )}
            {category && category === 5 && (
              <span style={{ marginLeft: "10px" }}>D</span>
            )}
          </h1>
        </div>
      </div>

      <div
        style={{
          marginLeft: "auto",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        <div style={{ textAlign: "end" }}>
          <h2 style={{ fontWeight: "normal", fontSize: "16px" }}>
            Total Tyres :{" "}
            <span style={{ fontSize: "20px" }}>
              {getInspectionData.total_count}
            </span>
          </h2>
        </div>

        <div
          className="filter-design"
          style={{ display: "flex", gap: "10px", marginLeft: "auto" }}
        >
          <div className="filter-design-1">
            <Autocomplete
              className={
                showFleetWarning === true
                  ? "filter-fields-warning"
                  : "filter-fields"
              }
              placeholder="Fleet Name"
              options={fleetData}
              getOptionLabel={(option) => option.fleet_name}
              value={selectedFleet}
              onChange={handleChangeFleet}
              renderInput={(params) => (
                <TextField {...params} label="Fleet Id" variant="plain" />
              )}
            />
          </div>
          <div className="filter-design-1">
            <Select
              className={"filter-fields"}
              multiple
              placeholder="Branch"
              value={selectedFleetBranch || []}
              onChange={(event, newValue) => {
                setSelectedFleetBranch(newValue);
                setPage(0);
              }}
              sx={{
                minWidth: "13rem",
              }}
              slotProps={{
                listbox: {
                  sx: {
                    width: "100%",
                  },
                },
              }}
            >
              {fleetBranch.map((branch) => (
                <Option key={branch.fleet_branch_id} value={branch}>
                  {branch.fleet_branch_location}
                </Option>
              ))}
            </Select>
          </div>

          <div>
            <TyreInspectionCategoryExcel
              category={category}
              setShowFleetWarning={setShowFleetWarning}
              selectedFleet={selectedFleet}
              allDataForDownloadTyreInspection={
                allDataForDownloadTyreInspection
              }
            />
          </div>
        </div>

        <div className="chips-main">
          {selectedFleet && <h5>Applied Filters</h5>}
          <div className="chips-container-tyreCategory">
            {selectedFleet && (
              <button className="chip-category">
                {selectedFleet.fleet_name}
                <FontAwesomeIcon
                  onClick={() => {
                    setSelectedFleet(null);
                    setSelectedFleetBranch(null);
                    setFleetBranch([]);
                  }}
                  icon={faXmark}
                  style={{ cursor: "pointer", color: "#ffffff", marginLeft: 5 }}
                />
              </button>
            )}

            {selectedFleetBranch &&
              selectedFleetBranch.map((branch) => (
                <button className="chip-category" key={branch.fleet_branch_id}>
                  {branch?.fleet_branch_location}
                  <FontAwesomeIcon
                    onClick={() => {
                      const updatedBranches = selectedFleetBranch.filter(
                        (selectedBranch) =>
                          selectedBranch.fleet_branch_id !==
                          branch.fleet_branch_id
                      );
                      setSelectedFleetBranch(updatedBranches);
                      setPage(0);
                    }}
                    icon={faXmark}
                    style={{
                      cursor: "pointer",
                      color: "#ffffff",
                      marginLeft: 5,
                    }}
                  />
                </button>
              ))}

            {selectedFleet && (
              <button
                className="clear-all"
                style={{ cursor: "pointer" }}
                onClick={() => {
                  setSelectedFleet(null);
                  setSelectedFleetBranch(null);
                  setFleetBranch([]);
                  setPage(0);
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
        </div>
      </div>

      {/* Add Tyre inspection detail modal */}
      {showModal && <TyreInspectionModal setShowModal={setShowModal} />}

      {/* Show all defect images modal */}
      {/* {showImages && (
        <ShowImagesModal
          setShowImages={setShowImages}
          editTyreData={editTyreData}
          setEditTyreData={setEditTyreData}
        />
      )}

      {showVideos && (
        <ShowVideosModal
          setShowVideos={setShowVideos}
          editTyreData={editTyreData}
          setEditTyreData={setEditTyreData}
        />
      )} */}

      {/* serial number Images Modal */}
      {/* {serialImagesModal && (
        <SerialNoImageModal
          serialNoURL={serialNoURL}
          tyreSerialNumber={tyreSerialNumber}
          setSerialImagesModal={setSerialImagesModal}
        />
      )} */}

      <div className="table-mega-container" style={{ flex: 1, height: "auto" }}>
        <TableContainer
          className="table-customer"
          style={{ overflow: "visible" }}
        >
          <Table variant="outlined">
            <TableHead>
              <TableRow className="table-report">
                <TableCell
                  style={{ borderTopLeftRadius: "15px", minWidth: 60 }}
                >
                  SNo
                </TableCell>
                <TableCell style={{ minWidth: 100 }}>Type Serial No</TableCell>
                {currentUser === "Regrip" && (
                  <TableCell style={{ minWidth: 100 }}>Brand</TableCell>
                )}
                <TableCell style={{ minWidth: 100 }}>Fleet Name</TableCell>
                <TableCell style={{ minWidth: 100 }}>Size</TableCell>
                <TableCell style={{ minWidth: 100 }}>Model</TableCell>
                <TableCell style={{ minWidth: 100 }}>
                  Construction Type
                </TableCell>
                <TableCell style={{ minWidth: 100 }}>
                  Product Category
                </TableCell>

                <TableCell style={{ minWidth: 100 }}>Defected Images</TableCell>
                <TableCell
                  style={{ borderTopRightRadius: "15px", minWidth: 100 }}
                >
                  Action
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading === true
                ? dummmyArray.map((i) => (
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
                : (getInspectionData && getInspectionData.inspections)?.map(
                    (inspection, i) => {
                      const {
                        tyre_inspection_id,
                        product_category,
                        tyre_serial_number_image_url,
                        tyre_category_name,
                        user_category_name,
                        tyre_serial_number,
                        tyre_brand_name,
                        tyre_size,
                        tyre_construction_type,
                        tyre_model_name,
                        tyre_description,
                        system_user_tyre_amount,
                        user_tyre_price,
                        tyre_defects_images,
                        supplier_name,
                        fleet_name,
                        fleet_branch_location,
                      } = inspection;
                      const actualSerialNumber = i + 1 + page * rowsPerPage; // Calculate the actual serial number

                      return (
                        <TableRow key={i} className="table-data">
                          <TableCell className="capitalize-text">
                            {actualSerialNumber}
                          </TableCell>
                          <TableCell className="capitalize-text ">
                            <button
                              id="tyre-serial-number-button"
                              style={{
                                marginLeft: "auto",
                                marginRight: "auto",
                              }}
                              onClick={() => {
                                setSerialImagesModal(true);
                                setSerialNoURL(tyre_serial_number_image_url);
                                setTyreSerialNumber(tyre_serial_number);
                              }}
                            >
                              <FontAwesomeIcon
                                icon={faImage}
                                style={{ cursor: "pointer", marginRight: 4 }}
                              />{" "}
                              {tyre_serial_number &&
                              typeof tyre_serial_number === "string"
                                ? tyre_serial_number.length > 10
                                  ? `${tyre_serial_number.substring(0, 10)}...`
                                  : tyre_serial_number
                                : ""}
                            </button>
                          </TableCell>
                          {currentUser === "Regrip" && (
                            <TableCell className="capitalize-text">
                              {tyre_brand_name}
                            </TableCell>
                          )}
                          <TableCell className="capitalize-text">
                            {fleet_name}, {fleet_branch_location}
                          </TableCell>
                          <TableCell className="capitalize-text">
                            {tyre_size}
                          </TableCell>
                          <TableCell className="capitalize-text">
                            {tyre_model_name}
                          </TableCell>
                          <TableCell className="capitalize-text">
                            {tyre_construction_type}
                          </TableCell>
                          <TableCell className="capitalize-text">
                            {product_category}
                          </TableCell>

                          <TableCell className="capitalize-text">
                            <div
                              style={{
                                display: "flex",
                                width: "100%",
                                justifyContent: "space-evenly",
                                alignItems: "center",
                              }}
                            >
                              <div className="view-img-btn">
                                {(okImage = tyre_defects_images.find(
                                  (image) =>
                                    defectIdToNameMap[image.defect_id] !== "ok"
                                )) ? (
                                  <img
                                    src={`${API_URL}/upload/readimageurl?imagename=${okImage.link}&folder=${okImage.defect_id}`}
                                    alt=""
                                    width="35"
                                    height="35"
                                    onClick={() => {
                                      setShowImages(true);
                                      setEditTyreData(inspection);
                                    }}
                                  />
                                ) : (
                                  <img
                                    style={{ width: 35, height: 35 }}
                                    src={require("../../assets/Placeholder_view_vector.png")}
                                    alt="ok"
                                    onClick={() => {
                                      setShowImages(true);
                                      setEditTyreData(inspection);
                                    }}
                                  />
                                )}
                              </div>
                              <img
                                style={{
                                  cursor: "pointer",
                                  display:
                                    inspection?.tyre_defects_images?.some(
                                      (image) => image?.video_link
                                    )
                                      ? "visible"
                                      : "none",
                                  width: 35,
                                  height: 35,
                                }}
                                src={require("../../assets/video.png")}
                                alt=""
                                onClick={() => {
                                  setShowVideos(true);
                                  setEditTyreData(inspection);
                                }}
                              />
                            </div>
                          </TableCell>
                          <TableCell className="capitalize-text">
                            <div
                              className="inspection-action-btn"
                              style={{
                                marginLeft: "auto",
                                marginRight: "auto",
                              }}
                            >
                              <HomeDownloadPDF inspectionData={inspection} />
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    }
                  )}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      <TablePagination
        style={{ marginLeft: "auto" }}
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={loading ? dummmyArray?.length : totalItemCount}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(event, newPage) => {
          setPage(newPage);
        }}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </div>
  );
};

export default TyreInspectionByCategory;
