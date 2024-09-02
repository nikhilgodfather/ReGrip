import React, { useState, useEffect } from "react";
import "./SerialNoImageModal.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { API_URL } from "../Config/index";
import { Modal, ModalClose, Sheet } from "@mui/joy";

const SerialNoImageModal = ({
  serialNoURL,
  setSerialImagesModal,
  tyreSerialNumber,
}) => {
  console.log(serialNoURL, setSerialImagesModal, tyreSerialNumber);
  const [serialNumberImage, setSerialNumberImage] = useState();

  const [selectedImageSrc, setSelectedImageSrc] = useState("");
  const [openImageModal, setOpenImageModal] = useState(false);

  useEffect(() => {
    const result = [];

    const link = `${API_URL}/upload/readimageurl?imagename=${serialNoURL}&folder=0`;

    result.push(link);

    setSerialNumberImage(result);
  }, [serialNoURL]);

  return (
    <div className="show-serial-images-modal-mega-container">
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
      <div className="show-serial-images-modal-container">
        {/* <span className="show-serial-images-close-btn" onClick={() => setSerialImagesModal(false)}>
                    <FontAwesomeIcon icon={faTimes} />
                </span> */}
        <h3 className="show-serial-images-heading">Tyre Serial Number Image</h3>
        <div className="serial-carousel-container">
          <div
            className="image-serial-container"
            onClick={() => {
              setSelectedImageSrc(serialNumberImage);
              setOpenImageModal(true);
            }}
          >
            <img src={serialNumberImage} alt="" />
          </div>
          <div style={{ fontWeight: 500, maxWidth: "100%" }}>
            {tyreSerialNumber}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SerialNoImageModal;
