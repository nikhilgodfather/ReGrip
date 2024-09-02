import React, { useState } from "react";
import "./CaptureImageModal.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera, faFileAlt } from "@fortawesome/free-solid-svg-icons";
import Uploading from "../Uploading/Uploading";
import CameraCapture from "../CRMS/Customers/CameraCapture/CameraCapture";

const CaptureImageModal = (props) => {
  const { setShowImageModal, images, setImages, defects } = props;
  const [showCamera, setShowCamera] = useState(false);
  const [uploading] = useState(false);

  const handleProceed = async () => {
    setShowImageModal(false);
  };

  const getImageURL = (imageFile) => {
    if (!imageFile) return alert("No File Selected");
    // console.log(imageFile);
    const reader = new FileReader();
    reader.readAsDataURL(imageFile);
    reader.addEventListener("load", () => {
      const image_data = {
        image_data_url: reader.result,
        image_file: imageFile,
        image_defect_id: defects[0]['tyre_defect_id'],
        // image_defect_name: defects[0]["tyre_defect_name"],
      };
      setImages([...images, image_data]);
      // console.log('IMAGE URL', image_data);
    });
  };

  const removeElement = (i) => {
    setImages(() => {
      return images.filter((_, index) => i !== index);
    });
  };

  return (
    <div
      className="capture-images-modal-container" onClick={() => { console.log(images); }}>
      {uploading && <Uploading />}
      {showCamera && (
        <CameraCapture
          showCamera={showCamera}
          setShowCamera={setShowCamera}
          serialNo={false}
          images={images}
          setImages={setImages}
          defects={defects}
        />
      )}
      <div className="capture-images-button-container">
        <div className="capture-images-box capture-images-file-upload">
          <h3 className="capture-images-heading capture-images-file-heading">
            <FontAwesomeIcon icon={faFileAlt} size="xl" />
          </h3>
          <input type="file" accept="image/heic,image/png , image/jpg, image/jpeg" multiple
            onChange={(e) => {
              Object.keys(e.target.files).forEach((key) => {
                const file = e.target.files[key];
                getImageURL(file);
              });
            }}
          />
        </div>
        <div className="capture-images-box capture-images-camera">
          <button className="capture-images-camera-button"
            onClick={() => {
              setShowCamera(true);
            }}>
            <h3 className="capture-images-heading capture-images-camera-heading">
              <FontAwesomeIcon icon={faCamera} size="xl" />
            </h3>
          </button>
        </div>
      </div>
      <div className="capture-images-container">
        {images.map((image, i) => {
          return (
            <div className="capture-images-image-container" key={i}>
              <button className="close-button" onClick={() => { removeElement(i); }}>
                X
              </button>
              <img src={image.image_data_url} alt="" className="capture-image" />
              <div className="capture-image-defect-input">
                <label htmlFor={`defect-type-${i}`}>{"Defect : "}</label>
                <select type="text" value={image.image_defect_id}
                  onChange={(e) => {
                    const tempImages = images;
                    tempImages[i].image_defect_id = e.target.value;
                    tempImages[i].image_defect_name =
                      defects[parseInt(e.target.value) - 1]["tyre_defect_name"];
                    setImages(tempImages);
                  }}
                >
                  {defects.map((defect, ii) => {
                    return (
                      <option value={defect.tyre_defect_id} key={ii}>
                        {defect.tyre_defect_name}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>
          );
        })}
      </div>
      <div className="capture-images-proceed-button-container">
        <button
          onClick={() => {
            setImages([]);
            handleProceed();
          }}
        >Close</button>
        <button onClick={handleProceed}>Save</button>
      </div>
    </div>
  );
};

export default CaptureImageModal;
