import React, { useState } from "react";
import "./CaptureSerialNoImageModal.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera, faFileAlt } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import Uploading from '../Uploading/Uploading';
import { API_URL } from "../Config/index";
import CameraCapture from "../CRMS/Customers/CameraCapture/CameraCapture";

const CaptureSerialNoImageModal = ({
  setShowSerialNoImageModal,
  setSerialNoImage,
  setSerialNoImageURL,
}) => {
  const [imageURL, setImageURL] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  const [uploading, setUploading] = useState(false);
  const uploadImage = async () => {
    if (!imageFile) return alert("No File Selected!");
    const file = imageFile;
    const fileType = encodeURIComponent(file.type);
    const { data } = await axios.get(
      `${API_URL}/upload/imageurl?fileType=${fileType}`
    );
    const { uploadURL } = data;
    try {
      await axios.put(uploadURL, file, {
        headers: { "Content-Type": fileType },
      });
      setSerialNoImageURL(uploadURL);
      setSerialNoImage(file.name);
    } catch (err) {
      alert(err);
      throw new Error(err);
    }
  };

  const handleProcessImage = async () => {
    if (!setSerialNoImage) alert("Error!");
    setUploading(true);
    await uploadImage();
    setUploading(false);
    setShowSerialNoImageModal(false);
  };

  const getImageURL = (imageFile) => {
    if (!imageFile) return alert("No File Selected");
    setImageFile(imageFile);
    const reader = new FileReader();
    reader.readAsDataURL(imageFile);
    reader.addEventListener("load", () => {
      setImageURL(reader.result);
    });
  };

  return (
    <div className="capture-image-modal-container">
      {uploading && <Uploading />}
      {showCamera && (
        <CameraCapture
          showCamera={showCamera}
          setShowCamera={setShowCamera}
          setImageURL={setImageURL}
          setImageFile={setImageFile}
        />
      )}
      <button
        className="inspection-close-button"
        onClick={() => { setShowSerialNoImageModal(false) }}
      >
        X
      </button>
      <h2 className="capture-image-modal-heading">
        Read Serial Number From Image
      </h2>
      <div className="capture-image-button-container">
        <div className="capture-image-box capture-image-file-upload">
          <h3 className="capture-image-heading capture-image-file-heading">
            <FontAwesomeIcon icon={faFileAlt} size="xl" />
          </h3>
          <input
            type="file"
            accept="image/heic,image/png , image/jpg, image/jpeg"
            onChange={(e) => {
              getImageURL(e.target.files[0]);
            }}
          />
        </div>
        <div className="capture-image-box capture-image-camera">
          <button
            className="capture-image-camera-button"
            onClick={() => {
              setShowCamera(true);
            }}
          >
            <h3 className="capture-image-heading capture-image-camera-heading">
              <FontAwesomeIcon icon={faCamera} size="xl" />
            </h3>
          </button>
        </div>
      </div>
      {imageURL && (
        <div className="capture-image-show-container">
          <img src={imageURL} className="capture-image-show" alt="" />
        </div>
      )}
      <div className="capture-image-proceed-button-container">
        <button onClick={handleProcessImage}>Proceed</button>
      </div>
    </div>
  );
};

export default CaptureSerialNoImageModal;
