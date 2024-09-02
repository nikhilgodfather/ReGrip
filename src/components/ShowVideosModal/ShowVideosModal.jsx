import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { API_URL } from "../Config";
import ReactPlayer from "react-player";
import Carousel from "react-multi-carousel";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "./ShowVideosModal.css";
import { Modal, ModalClose, Sheet } from "@mui/joy";

const ShowVideosModal = ({ setShowVideos, editTyreData, setEditTyreData }) => {
  const [tyreDesc, setTyreDesc] = useState(
    editTyreData?.tyre_description
      ? editTyreData?.tyre_description
      : editTyreData?.claim_description || ""
  );
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [defectIdToNameMap, setDefectIdToNameMap] = useState({});
  const [tyreDefectImg] = useState(
    editTyreData?.tyre_defects_images
      ? editTyreData?.tyre_defects_images
      : editTyreData?.claim_data || ""
  );
  const [defectVideoLinks, setDefectVideoLinks] = useState([]);
  const [imageDefectId, setImageDefectId] = useState([]);

  const [selectedVideoSrc, setSelectedVideoSrc] = useState("");
  const [openVideoModal, setOpenVideoModal] = useState(false);

  const api = `${API_URL}/upload/readvideourl?videokey=4966d21a-29d5-43ea-9c60-c21665041d33.mp4&folder=42`;

  const defect = useSelector((state) => state.getDefectTypes?.defects);

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
    const videoNames = tyreDefectImg?.map((item) => item?.video_link);
    const imageDefectIds = tyreDefectImg?.map((item) => item?.defect_id);
    const result = videoNames.map(
      (imageName, index) =>
        `${API_URL}/upload/readvideourl?videokey=${imageName}&folder${
          editTyreData?.tyre_defects_images ? "=" : "=claimnotes/"
        }${imageDefectIds[index]}`
    );
    setDefectVideoLinks(result);
    setImageDefectId(imageDefectIds);
  }, [tyreDefectImg]);

  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 1,
    },
  };

  const currentDefectName =
    defectIdToNameMap[imageDefectId[currentVideoIndex]] || "";

  return (
    <div className="show-images-modal-mega-container">
      <Modal
        aria-labelledby="modal-title"
        aria-describedby="modal-desc"
        open={openVideoModal}
        onClose={() => setOpenVideoModal(false)}
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <Sheet
          variant="plain"
          sx={{
            maxWidth: "90vh",
            height: "90vh",
            borderRadius: "md",
            p: 5,
            display: "flex",
            justifyContent: "center",
          }}
        >
          {selectedVideoSrc && (
            <ReactPlayer
              url={selectedVideoSrc}
              controls
              muted={true}
              height="100%"
            />
          )}

          <ModalClose variant="plain" sx={{ m: 0 }} />
        </Sheet>
      </Modal>

      <div className="show-images-modal-container">
        {/* <span className="show-images-close-btn" onClick={() => setShowVideos(false)}>
                    <FontAwesomeIcon icon={faTimes} />
                </span> */}
        <h3 className="show-images-heading">Defect Videos</h3>
        <div className="carousel-container">
          <Carousel
            className="carousel-style"
            showDots={true}
            arrows={true}
            responsive={responsive}
            beforeChange={(currentSlide, nextSlide) => {
              setCurrentVideoIndex(currentSlide);
            }}
          >
            {defectVideoLinks.map((video, index) => (
              <div
                key={index}
                className="image-container"
                style={{
                  cursor: currentDefectName !== "ok" && "pointer",
                  borderRadius: 50,
                }}
                onClick={() => {
                  currentDefectName !== "ok" && setSelectedVideoSrc(video);
                  currentDefectName !== "ok" && setOpenVideoModal(true);
                }}
              >
                {currentDefectName === "ok" ? (
                  <img
                    src={require("../../assets/Placeholder_view_vector.png")}
                    alt=""
                  />
                ) : (
                  <ReactPlayer
                    url={video}
                    controls
                    muted={true}
                    width="330"
                    height="270"
                  />
                )}
              </div>
            ))}
          </Carousel>
          <div className="defect-name-container">
            <h4>Defect Name</h4>
            {editTyreData?.tyre_defects_images ? (
              <p>
                {
                  defectName[
                    editTyreData.tyre_defects_images[currentVideoIndex]
                      .defect_type_id
                  ]
                }{" "}
                - {currentDefectName}
              </p>
            ) : (
              <p>
                {
                  defectName[
                    editTyreData?.claim_data[currentVideoIndex].defect_type_id
                  ]
                }{" "}
                - {currentDefectName}
              </p>
            )}{" "}
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

export default ShowVideosModal;
