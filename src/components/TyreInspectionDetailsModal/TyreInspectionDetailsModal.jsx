import React, { useEffect, useState } from "react";
import "./TyreInspectionDetailsModal.css";
import "../TyreInspection/TyreInspection.css";
import TyreInspectionModal from "../TyreInspectionModal/TyreInspectionModal";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPenToSquare,
  faTrashCan,
  faXmark,
  faImage,
} from "@fortawesome/free-solid-svg-icons";
import ShowImagesModal from "../ShowImagesModal/ShowImagesModal";
import SerialNoImageModal from "../SerialNoImageModal/SerialNoImageModal";
import EditTyreModal from "../EditTyreModal/EditTyreModal";
import { API_URL } from "../Config/index";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useSelector } from "react-redux";
import { REGRIP_SUPPLIER } from "../../redux/constants/Constant";
import ShowVideosModal from "../ShowVideosModal/ShowVideosModal";

// import ViewModalPdf from "../PdfComponents/ViewModalPdf/ViewModalPdf";
import HomeDownloadPDF from "../PdfComponents/HomeDownloadPDF/HomeDownloadPDF";
import { Option, Select } from "@mui/joy";
import TyreInspectionDetailsModalExcel from "./TyreInspectionDetailsModalExcel/TyreInspectionDetailsModalExcel";
import Modal from "@mui/joy/Modal";
import ModalClose from "@mui/joy/ModalClose";
import Sheet from "@mui/joy/Sheet";

const TyreInspectionDetailsModal = ({
  batchId,
  setInspectionDetailsModal,
  selectedOption,
}) => {
  const dummmyArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const [loading, setLoading] = useState(true);
  const [inspectionData, setInspectionData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showImages, setShowImages] = useState(false);
  const [showVideos, setShowVideos] = useState(false);
  // const [fetchImages, setFetchImages] = useState([]);
  const [editTyreData, setEditTyreData] = useState([]);
  const [editTyreModal, setEditTyreModal] = useState(false);
  const [serialImagesModal, setSerialImagesModal] = useState(false);
  const [serialNoURL, setSerialNoURL] = useState();
  const [defectIdToNameMap, setDefectIdToNameMap] = useState({});
  const [tyreSerialNumber, setTyreSerialNumber] = useState();
  const [batchIdDataTyre, setBatchIdDataTyre] = useState();

  let okImage;

  const [category, setCategory] = useState("");

  const defect = useSelector((state) => state.getDefectTypes.defects);
  const currentUser = useSelector((state) => state.getCurrentUser.role_name);

  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const getBatchIdInspection = async () => {
    let data = {
      batches: [batchId],
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

  const getInspectionData = async () => {
    try {
      setLoading(true);
      const batch_id = batchId;
      const { data } = await axios.get(
        `${API_URL}/inspection/getbatch/${batch_id}?category=${category}`
      );

      const { inspectionbatch } = data.data;
      setLoading(false);
      setInspectionData(inspectionbatch);

      // const inspectionArray = Array.isArray(inspectionbatch) ? inspectionbatch : [inspectionbatch];
      // const tyreDefectsImages = inspectionArray.map(item => item.tyre_defects_images);
      // const imageLinks = tyreDefectsImages.map(images => Object.values(images).map(image => image.link));
      // const flattenedLinks = imageLinks.flat();
      // const linksAsString = flattenedLinks.join(', ');
      // const imageNames = linksAsString.split(", ");

      // const result = [];

      // for (const imageName of imageNames) {
      //     const link = (`${API_URL}/upload/readimageurl?imagename=${imageName}`);

      //     result.push(link);
      // }
      // setFetchImages(result);
    } catch (error) {
      console.error("Error fetching inspection data:", error);
      setInspectionData([]);
    }
  };

  const deleteTyre = async (tyre_id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this tyre inspection Details?"
    );
    if (!confirmDelete) {
      return;
    }
    try {
      await axios.delete(`${API_URL}/inspection/deletetyre`, {
        data: { tyre_id },
      });
      alert("Tyre Details deleted successfully!");
      getInspectionData();
      // setInspectionData(prevTyreData =>
      //     prevTyreData.filter(inspection => inspection.tyre_id !== tyre_id)
      // );
    } catch (error) {
      console.error(
        "An error occurred while deleting the tyre Details:",
        error
      );
      alert("Failed to delete the tyre Details.");
    }
  };

  function changeModalState() {
    setInspectionDetailsModal(false);
  }

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

  useEffect(() => {
    getInspectionData();
    getDefectNames();
    getBatchIdInspection();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category]);

  return (
    <div className="inspection-details-modal">
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
          <SerialNoImageModal
            serialNoURL={serialNoURL}
            tyreSerialNumber={tyreSerialNumber}
            setSerialImagesModal={setSerialImagesModal}
          />
        </Sheet>
      </Modal>

      <div className="inspection-detail-Data" id="tyreInspectionDetailsModal">
        <div className="tyre-inspection-detail-container">
          <div className="detailed-modal-head">
            <div className="head-name">
              <h1 className="heading1">Tyre Inspection</h1>
              {/* <button className="add-tyre-button" onClick={() => { setShowModal(true); }}>
                            Add Tyre Inspection
                        </button> */}
              <input
                type="text"
                placeholder="Search by Tyre Serial Number"
                value={searchTerm}
                onChange={handleSearchChange}
                className="serial_number-search"
              />
            </div>
            <div
              className="close-btn-modal"
              value={category}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "30px",
              }}
            >
              <Select
                sx={{ width: "220px" }}
                className="select-mui"
                placeholder="Select Category"
                onChange={(event, newValue) => {
                  setCategory(newValue);
                }}
              >
                <Option value="">All</Option>
                <Option value="A">A</Option>
                <Option value="B">B</Option>
                <Option value="C">C</Option>
                <Option value="cp">C+</Option>
                <Option value="D">D</Option>
              </Select>
              <TyreInspectionDetailsModalExcel
                inspectionData={inspectionData}
                category={category}
                batchIdDataTyre={batchIdDataTyre}
              />
              <button className="close-cross" onClick={changeModalState}>
                <FontAwesomeIcon
                  icon={faXmark}
                  style={{ color: "rgb(78 77 77)" }}
                />
              </button>
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
          )} */}

          {/* {showVideos && (
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

          {/* Tyre Data Edit Modal */}
          {editTyreModal && (
            <EditTyreModal
              setEditTyreModal={setEditTyreModal}
              editTyreData={editTyreData}
              setEditTyreData={setEditTyreData}
            />
          )}
          <table className="excel-table">
            <thead>
              <tr className="table-heading">
                <th style={{ borderTopLeftRadius: "15px" }}>SNo</th>
                <th>Tyre Serial No</th>
                <th
                  style={{
                    display:
                      currentUser !== REGRIP_SUPPLIER ? "none" : "visible",
                  }}
                >
                  Brand
                </th>
                <th>Size</th>
                <th>Model</th>
                <th>User Category</th>
                <th>Construction Type</th>
                <th>Product Category</th>
                <th>Tyre Amount</th>
                <th>description</th>
                <th>Defected Images</th>
                <th
                  style={{
                    borderTopRightRadius: "15px",
                    display:
                      currentUser !== REGRIP_SUPPLIER ? "none" : "visible",
                  }}
                >
                  Action
                </th>
                <th
                  style={{
                    borderTopRightRadius: "15px",
                    display:
                      currentUser === REGRIP_SUPPLIER ? "none" : "visible",
                  }}
                >
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
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
                      <td
                        style={{
                          display:
                            currentUser !== REGRIP_SUPPLIER
                              ? "none"
                              : "visible",
                        }}
                      >
                        <Skeleton />
                      </td>
                    </tr>
                  ))
                : inspectionData
                    .filter((inspection) =>
                      inspection.tyre_serial_number
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())
                    )
                    .map((inspection, i) => {
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
                      } = inspection;
                      return (
                        <tr className="table-data" key={i}>
                          <td>{i + 1}</td>
                          <td>
                            <button
                              id="tyre-serial-number-button"
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
                              {tyre_serial_number}
                            </button>
                          </td>
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
                          <td>{tyre_size}</td>
                          <td>{tyre_model_name}</td>
                          {/* <td style={{ display: currentUser !== REGRIP_SUPPLIER ? "none" : "visible" }}>{tyre_category_name}</td> */}
                          <td>{user_category_name}</td>
                          <td>{tyre_construction_type}</td>
                          <td>{product_category}</td>
                          <td>
                            &#8377;{" "}
                            {supplier_name !== "Regrip"
                              ? system_user_tyre_amount
                              : user_tyre_price}
                          </td>
                          <td>{tyre_description}</td>
                          <td
                            style={{
                              display: "flex",
                              justifyContent: "center",
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
                                  alt=""
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
                                display: inspection?.tyre_defects_images?.some(
                                  (image) => image?.video_link
                                )
                                  ? "visible"
                                  : "none",
                                width: 35,
                                height: 35,
                                marginLeft: 10,
                              }}
                              src={require("../../assets/video.png")}
                              alt=""
                              onClick={() => {
                                setShowVideos(true);
                                setEditTyreData(inspection);
                              }}
                            />
                          </td>
                          <td
                            style={{
                              display:
                                currentUser !== REGRIP_SUPPLIER
                                  ? "none"
                                  : "visible",
                            }}
                          >
                            <div className="inspection-action-btn">
                              <div
                                className="spp-edit-btn"
                                style={{ marginRight: 6 }}
                                onClick={() => {
                                  setEditTyreData(inspection);
                                  setEditTyreModal(true);
                                }}
                              >
                                <FontAwesomeIcon
                                  icon={faPenToSquare}
                                  style={{ color: "#ffffff" }}
                                />
                              </div>
                              <div
                                className="spp-dlt-btn"
                                style={{ marginRight: 6 }}
                                onClick={() => {
                                  deleteTyre(tyre_inspection_id);
                                }}
                              >
                                <FontAwesomeIcon
                                  icon={faTrashCan}
                                  style={{ color: "#ffffff" }}
                                />
                              </div>
                              <HomeDownloadPDF inspectionData={inspection} /> 
                            </div>
                          </td>
                          <td
                            style={{
                              display:
                                currentUser === REGRIP_SUPPLIER
                                  ? "none"
                                  : "visible",
                            }}
                          >
                            <div className="inspection-action-btn">
                              {/* <div className="spp-edit-btn" onClick={() => {
                                                            setEditTyreData(inspection);
                                                            setEditTyreModal(true)
                                                        }} ><FontAwesomeIcon icon={faPenToSquare} style={{ color: "#ffffff", }} /></div> */}
                              {/* <div className="spp-dlt-btn" onClick={() => { deleteTyre(tyre_inspection_id) }}>
                                                            <FontAwesomeIcon icon={faTrashCan} style={{ color: "#ffffff", }} /></div> */}
                              <HomeDownloadPDF inspectionData={inspection} />
                            </div>
                          </td>
                        </tr>
                      );
                    })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TyreInspectionDetailsModal;
