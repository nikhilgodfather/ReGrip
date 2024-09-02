import React, { useState, useEffect } from "react";
import { API_URL } from "../Config";
import "./SearchTyreDataModal.css";
import { useSelector } from "react-redux";
import axios from "axios";
import { Controls, Player } from "@lottiefiles/react-lottie-player";
import nodata from "../../lotties/nodata1.json";

const SearchTyreDataModal = ({ sendTyreData }) => {
  const [sendTyreDataSerial, setSendTyreDataSerial] = useState();
  const defect = useSelector((state) => state.getDefectTypes.defects);
  const [defectIdToNameMap, setDefectIdToNameMap] = useState({});
  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const [loading, setLoading] = useState();

  function DateFormat(inputDate) {
    const parsedDate = new Date(inputDate);

    const year = parsedDate.getFullYear();
    const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
    const day = String(parsedDate.getDate()).padStart(2, "0");
    const hours = String(parsedDate.getHours()).padStart(2, "0");
    const minutes = String(parsedDate.getMinutes()).padStart(2, "0");
    return `${year}:${month}:${day} ${hours}:${minutes}`;
  }

  const onSearch = async () => {
    try {
      const token = localStorage.getItem("token");
      const bearer_token = "bearer " + JSON.parse(token);

      const { data } = await axios.get(
        `${API_URL}/inspection/getinspection?serialnumber=${sendTyreData}`,
        {
          headers: {
            Authorization: bearer_token,
          },
        }
      );
      setSendTyreDataSerial(data?.data?.inspectionbatch[0]);
    } catch (error) {
      console.error("Error fetching dashboard data:", error.message);
    }
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
    onSearch();
  }, [sendTyreData]);

  useEffect(() => {
    const button = document.getElementById("myButton");
    if (!loading && isButtonClicked) {
      button.click();

      setTimeout(() => {
        setIsButtonClicked(false);
      }, [1000]);
    }
  }, [isButtonClicked, loading]);

  const defectName = {
    0: "Crown Area Defect",
    1: "SideWall Area Defect",
    2: "InnerCrown Defect",
    3: "Bead Defect",
  };
  return (
    <>
      {sendTyreDataSerial ? (
        <div className="main-searcg-modal-container">
          <div
            className="head-search"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <img
              src={`${API_URL}/upload/readimageurl?imagename=${sendTyreDataSerial?.tyre_serial_number_image_url}&folder=0`}
              alt={""}
              className="heading-image-of-serialnum"
              style={{
                width: "350px",
                height: "130px",
              }}
            />
          </div>

          <div className="middle-show-data">
            <div className="section-one">
              <div className="section-one-child">
                <span className="data-one">Date</span>
                <span className="data-one">
                  {DateFormat(sendTyreDataSerial?.entrytime)}
                </span>
              </div>
              <div className="section-one-child">
                <span className="data-one">Supplier Name</span>
                <span className="data-one">
                  {sendTyreDataSerial?.supplier_name}
                </span>
              </div>

              <div className="section-one-child">
                <span className="data-one">Product Category</span>
                <span className="data-one">
                  {" "}
                  {sendTyreDataSerial?.product_category}
                </span>
              </div>

              <div className="section-one-child">
                <span className="data-one">Serial Number</span>
                <span className="data-one">
                  {sendTyreDataSerial?.tyre_serial_number}
                </span>
              </div>
            </div>

            <div className="section-two">
              <div className="section-one-child">
                <span className="data-one">Fleet Name</span>
                <span className="data-one">
                  {sendTyreDataSerial?.fleet_name}
                </span>
              </div>
              <div className="section-one-child">
                <span className="data-one">Construction Type</span>
                <span className="data-one">
                  {sendTyreDataSerial?.tyre_construction_type}
                </span>
              </div>

              <div className="section-one-child">
                <span className="data-one">Model</span>
                <span className="data-one">
                  {sendTyreDataSerial?.tyre_model_name}
                </span>
              </div>

              <div className="section-one-child">
                <span className="data-one">Tyre Category</span>
                <span className="data-one">
                  {sendTyreDataSerial?.user_category_name}
                </span>
              </div>
            </div>
          </div>

          <div className="image-parent-data">
            <div className="image-parent-child">
              {sendTyreDataSerial &&
                sendTyreDataSerial?.tyre_defects_images?.map((image, index) => {
                  return (
                    <div className="image-child-data">
                      <div
                        className="image-child-main-image"
                        style={{
                          width: "100%",
                          height: "90%",
                        }}
                      >
                        {defectIdToNameMap[image?.defect_id] === "ok" ? (
                          <img
                            className="image-size-modal"
                            src={require("../../assets/Placeholder_view_vector.png")}
                          />
                        ) : (
                          <img
                            className="image-size-modal"
                            src={`${API_URL}/upload/readimageurl?imagename=${image.link}&folder=${image?.defect_id}`}
                          />
                        )}
                      </div>
                      <h4 className="image-child-main-head">
                        {defectName[index]} -{" "}
                        {defectIdToNameMap[image?.defect_id]}
                      </h4>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      ) : (
        <div
          className="empty-data"
          style={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <h2 style={{}}>No Data</h2>
          <Player
            autoplay
            loop
            src={nodata}
            style={{ height: "150px", width: "150px" }}
          >
            <Controls buttons={["repeat", "frame", "debug"]} />
          </Player>
        </div>
      )}
    </>
  );
};

export default SearchTyreDataModal;
