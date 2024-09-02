import React, { useRef, useState } from "react";
import "./CameraCapture.css";
import { Camera } from "react-camera-pro";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCamera,
  faCheck,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
const CameraCapture = ({
  setShowCamera,
  showCamera,
  setImageURL,
  setImageFile,
  images,
  defects,
  setImages,
  serialNo
}) => {
  const cameraRef = useRef(null);
  const [image, setImage] = useState(null);

  //========================== FUNCTIONS ==============================//
  const cameraClick = () => {
    const clickedImage = cameraRef.current.takePhoto();
    setImage(clickedImage);
  };
  console.log("ii", image)

  const handleAcceptImage = () => {
    if (!image) return;
    fetch(image)
      .then((res) => res.blob())
      .then((blob) => {
        const imageFile = new File([blob], "image.png", blob);
        if (serialNo) {
          setImageFile(imageFile);
          setImageURL(image);
        }
        else {
          const image_data = {
            image_data_url: image,
            image_file: imageFile,
            image_defect_id: 1,
            // image_defect_name: defects[0]['tyre_defect_name']
          };
          setImages([...images, image_data]);
        }
        setShowCamera(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };


  //========================== JSX RETURN ==============================//
  return (
    <div className="camera-capture-container">
      <button
        className="inspection-close-button"
        onClick={() => {
          setShowCamera(!showCamera);
        }}
      >
        X
      </button>
      <div className="camera-box-container">
        {image ? (
          <div className="clicked-image-container">
            <img src={image} alt="" className="clicked-image" />
            <div className="clicked-image-button-container">
              <button
                className="clicked-button clicked-cancel-button"
                onClick={() => {
                  setImage(null);
                }}
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
              <button
                className="clicked-button clicked-accept-button"
                onClick={handleAcceptImage}
              >
                <FontAwesomeIcon icon={faCheck} />
              </button>
            </div>
          </div>
        ) : (
          <>
            <Camera
              ref={cameraRef}
            // facingMode={"environment"}
            //   aspectRatio={9 / 12}
            />
            <button
              className="camera-button"
              onClick={() => {
                cameraClick();
              }}
            >
              <FontAwesomeIcon
                icon={faCamera}
                color="white"
                fontSize={"20px"}
              />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default CameraCapture;
