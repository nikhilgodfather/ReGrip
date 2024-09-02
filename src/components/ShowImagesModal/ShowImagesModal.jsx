import React, { useState, useEffect } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import "./ShowImagesModal.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import axios from "axios"; // Import axios
import { API_URL } from "../Config/index";
import { useSelector } from "react-redux";
import { Modal, ModalClose, Sheet } from "@mui/joy";

const ShowImagesModal = ({ setShowImages, editTyreData, setEditTyreData }) => {
  const [tyreDesc, setTyreDesc] = useState(
    editTyreData?.tyre_description
      ? editTyreData?.tyre_description
      : editTyreData?.claim_description || ""
  );

  const [defectImg, setDefectImg] = useState([]);
  const [imageDefectId, setImageDefectId] = useState([]);
  const [tyreDefectImg] = useState(
    editTyreData?.tyre_defects_images
      ? editTyreData?.tyre_defects_images
      : editTyreData?.claim_data || ""
  );
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [defectIdToNameMap, setDefectIdToNameMap] = useState({});

  const [selectedImageSrc, setSelectedImageSrc] = useState("");
  const [openImageModal, setOpenImageModal] = useState(false);

  const defect = useSelector((state) => state?.getDefectTypes.defects);
  const defectName = {
    1: "Crown Area Defect",
    2: "SideWall Area Defect",
    3: "InnerCrown Defect",
    4: "Bead Defect",
  };

  useEffect(() => {
    const getDefectNames = async () => {
      try {
        const defectMap = {};
        defect?.defects?.forEach((defect) => {
          defectMap[defect?.tyre_defect_id] = defect?.tyre_defect_name;
        });
        setDefectIdToNameMap(defectMap);
      } catch (error) {
        console.log("Error while getting defects", error);
      }
    };

    getDefectNames();
  }, []);

  // Update defect images and IDs when tyreDefectImg changes
  useEffect(() => {
    const imageNames = tyreDefectImg?.map((item) => item?.link);
    const imageDefectIds = tyreDefectImg?.map((item) => item?.defect_id);
    const result = imageNames?.map(
      (imageName, index) =>
        `${API_URL}/upload/readimageurl?imagename=${imageName}&folder${
          editTyreData.tyre_defects_images ? "=" : "=claimnotes/"
        }${imageDefectIds[index]}`
    );
    setDefectImg(result);
    setImageDefectId(imageDefectIds);
  }, [tyreDefectImg]);

  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 1,
    },
  };

  const currentDefectName =
    defectIdToNameMap[imageDefectId[currentImageIndex]] || "";

  return (
    <div className="show-images-modal-mega-container">
      <Modal
        aria-labelledby="modal-title"
        aria-describedby="modal-desc"
        open={openImageModal}
        onClose={() => setOpenImageModal(false)}
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <Sheet
          variant="plain"
          sx={{
            maxWidth: "90vh",
            height: "92vh",
            borderRadius: "md",
            p: 5,
            display: "flex",
            justifyContent: "center",
          }}
        >
          {selectedImageSrc && (
            <img
              src={selectedImageSrc}
              alt={`img`}
              style={{ maxWidth: "100%" }}
            />
          )}

          <ModalClose variant="plain" sx={{ m: 0 }} />
        </Sheet>
      </Modal>

      <div className="show-images-modal-container">
        {/* <span className="show-images-close-btn" onClick={() => setShowImages(false)}>
          <FontAwesomeIcon icon={faTimes} />
        </span> */}
        <h3 className="show-images-heading">Defects Images</h3>
        <div className="carousel-container">
          <Carousel
            className="carousel-style"
            showDots={true}
            arrows={true}
            responsive={responsive}
            beforeChange={(currentSlide, nextSlide) => {
              setCurrentImageIndex(currentSlide);
            }}
          >
            {defectImg?.map((image, index) => (
              <div
                key={index}
                className="image-container"
                style={{ cursor: currentDefectName !== "ok" && "pointer" }}
                onClick={() => {
                  currentDefectName !== "ok" && setSelectedImageSrc(image);
                  currentDefectName !== "ok" && setOpenImageModal(true);
                }}
              >
                {currentDefectName === "ok" ? (
                  <img
                    src={require("../../assets/Placeholder_view_vector.png")}
                    alt=""
                  />
                ) : (
                  <img src={image} alt="" />
                )}
              </div>
            ))}
          </Carousel>
          <div className="defect-name-container">
            <h4>Defect Name</h4>
            {editTyreData.tyre_defects_images ? (
              <p>
                {
                  defectName[
                    editTyreData?.tyre_defects_images[currentImageIndex]
                      ?.defect_type_id
                  ]
                }{" "}
                - {currentDefectName}
              </p>
            ) : (
              <p>
                {
                  defectName[
                    editTyreData?.claim_data[currentImageIndex]?.defect_type_id
                  ]
                }{" "}
                - {currentDefectName}
              </p>
            )}
          </div>
          <div className="description-container">
            <h4>Defect Description</h4>
            <p>{tyreDesc}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowImagesModal;
