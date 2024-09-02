import React, { useEffect, useState } from "react";
import { API_URL } from "../Config";
import ReactPlayer from "react-player";
import { Modal, ModalClose, Sheet } from "@mui/joy";

const NSDVideo = ({  editTyreData }) => {
  console.log(editTyreData.upload_video);

  const [selectedVideoSrc, setSelectedVideoSrc] = useState("");
  const [nsdVideoLink, setNsdVideoLink] = useState();
  const [openVideoModal, setOpenVideoModal] = useState(false);

  useEffect(() => {
    const videoResult = `${API_URL}/upload/readvideourl?videokey=${editTyreData.upload_video}&folder=nsd`;
    setNsdVideoLink(videoResult);
  });

  return (
    <div style={{ width: "420px", height: "420px" }}>
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

      <div
        onClick={() => {
          nsdVideoLink && setSelectedVideoSrc(nsdVideoLink);
          nsdVideoLink && setOpenVideoModal(true);
        }}
      >
        <ReactPlayer
          url={nsdVideoLink}
          controls
          muted={true}
          width="100%"
          height="100%"
        />
      </div>
    </div>
  );
};

export default NSDVideo;
