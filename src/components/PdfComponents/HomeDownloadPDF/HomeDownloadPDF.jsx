import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import RegripLogo from "../../../assets/regrip-logo.png";
import CopyrightLogo from "../../../assets/copyright.png";
import { API_URL } from "../../Config/index";
import { useSelector } from "react-redux";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
  PDFDownloadLink,
} from "@react-pdf/renderer";
import "./HomeDownloadPDF.css";
import { CircularProgress } from "@mui/material";
import Watermark from "../../Watermark/Watermark";

const HomeDownloadPDF = ({ inspectionData }) => {
  function DateFormat(inputDate) {
    const parsedDate = new Date(inputDate);

    const year = parsedDate.getFullYear();
    const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
    const day = String(parsedDate.getDate()).padStart(2, "0");
    const hours = String(parsedDate.getHours()).padStart(2, "0");
    const minutes = String(parsedDate.getMinutes()).padStart(2, "0");
    return `${year}:${month}:${day} ${hours}:${minutes}`;
  }

  const defect = useSelector((state) => state.getDefectTypes.defects);
  const [defectIdToNameMap, setDefectIdToNameMap] = useState({});
  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const [loading, setLoading] = useState();

  useEffect(() => {
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

    getDefectNames();
  }, []);

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

  const stylesPdf = StyleSheet.create({
    page: {
      flexDirection: "row",
      fontSize: "12",
      width: "100%",
      position: "relative",
    },
    sectionTop: {
      margin: 10,
      flexGrow: 1,
      // height: "18%",
    },
    section: {
      margin: 10,
      flexGrow: 1,
      // height: "85%",
    },
    logoMain: {
      margin: 10,
      flexGrow: 1,
      height: "15%",
      gap: "30px",
      display: "flex",
      flexDirection: "row",
      // alignItems:"center",
    },
    logoRegrip: {
      width: "150px",
      height: "100px",
    },
    tyreSer: {
      width: "250px",
      height: "100px",
    },

    footerData: {
      marginTop: 10,
      marginLeft: 10,
      marginRight: 10,
      marginBottom: 0,

      // flexGrow: 1,
      height: "4%",
      display: "flex",
      alignItems: "center",
      flexDirection: "row",
      gap: "70px",
      // border:"1px solid blue"
    },
    footerText: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      fontSize: 10,
      margin: 5,
      gap: "5px",
    },
    CopyrightLogo: {
      width: 10,
      height: 10,
    },
    MainSection: {
      flexDirection: "column",
    },
    headSection: {
      flexDirection: "row",
      justifyContent: "space-between",
      width: "100%",
    },
    sectionLeft: {
      flexDirection: "column",
      margin: "2",
    },
    sectionRight: {
      flexDirection: "column",
      margin: "2",
    },
    tableData: {
      flexDirection: "row",
      gap: "2rem",
      margin: "2",
      width: "100%",
    },
    tableRow1: {
      border: "1",
      borderColor: "#000",
      margin: "2",
      padding: "2",
      width: "45%",
    },
    tableRow2: {
      border: "1",
      borderColor: "#000",
      margin: "2",
      padding: "2",
      width: "60%",
    },
    blueColor: {
      backgroundColor: "#B4C6E7",
    },
    greenColor: {
      backgroundColor: "#A9D08E",
    },
    yellowColor: {
      backgroundColor: "#FFD966",
    },
    ImagesSection: {
      display: "flex",
      justifyContent: "space-between",
      flexDirection: "row",
      flexWrap: "wrap",
      margin: "auto",
      paddingRight: "6",
      paddingLeft: "6",
    },
    imageContainer: {
      width: "48%",
      marginBottom: 10,
    },
    image: {
      border: "1",
      borderColor: "#000",
      width: "100%",
      height: "200rem",
    },
    imageDefect: {
      marginTop: "5",
      marginLeft: "5",
    },
  });

  const generatePDF = (inspectionData) => {
    const downloadTime = new Date();
    return (
      <Document>
        <Page style={stylesPdf.page} wrap>
          <View style={stylesPdf.MainSection}>
            <View style={stylesPdf.logoMain}>
              <Image src={RegripLogo} style={stylesPdf.logoRegrip} />
              <Image
                src={`${API_URL}/upload/readimageurl?imagename=${inspectionData.tyre_serial_number_image_url}&folder=0`}
                style={stylesPdf.tyreSer}
              />
            </View>
            <View style={stylesPdf.sectionTop}>
              <View style={stylesPdf.headSection}>
                <view style={stylesPdf.sectionLeft}>
                  <View style={stylesPdf.tableData}>
                    <Text style={[stylesPdf.tableRow1, stylesPdf.yellowColor]}>
                      Date
                    </Text>
                    <Text style={[stylesPdf.tableRow2, stylesPdf.yellowColor]}>
                      {DateFormat(inspectionData.entrytime)}
                    </Text>
                  </View>
                  <View style={stylesPdf.tableData}>
                    <Text style={[stylesPdf.tableRow1, stylesPdf.yellowColor]}>
                      Supplier Name
                    </Text>
                    <Text style={[stylesPdf.tableRow2, stylesPdf.yellowColor]}>
                      {inspectionData.supplier_name}
                    </Text>
                  </View>
                  <View style={stylesPdf.tableData}>
                    <Text style={[stylesPdf.tableRow1, stylesPdf.yellowColor]}>
                      Product Category
                    </Text>
                    <Text style={[stylesPdf.tableRow2, stylesPdf.yellowColor]}>
                      {inspectionData.product_category}
                    </Text>
                  </View>
                  <View style={stylesPdf.tableData}>
                    <Text style={[stylesPdf.tableRow1, stylesPdf.yellowColor]}>
                      Serial Number
                    </Text>
                    <Text style={[stylesPdf.tableRow2, stylesPdf.yellowColor]}>
                      {inspectionData.tyre_serial_number}
                    </Text>
                  </View>
                </view>
                <view style={stylesPdf.sectionRight}>
                  <View style={stylesPdf.tableData}>
                    <Text style={[stylesPdf.tableRow1, stylesPdf.greenColor]}>
                      Fleet Name
                    </Text>
                    <Text style={[stylesPdf.tableRow2, stylesPdf.greenColor]}>
                      {inspectionData.fleet_name}
                    </Text>
                  </View>
                  <View style={stylesPdf.tableData}>
                    <Text style={[stylesPdf.tableRow1, stylesPdf.greenColor]}>
                      Construction Type
                    </Text>
                    <Text style={[stylesPdf.tableRow2, stylesPdf.greenColor]}>
                      {inspectionData.tyre_construction_type}
                    </Text>
                  </View>
                  <View style={stylesPdf.tableData}>
                    <Text style={[stylesPdf.tableRow1, stylesPdf.greenColor]}>
                      Model
                    </Text>
                    <Text style={[stylesPdf.tableRow2, stylesPdf.greenColor]}>
                      {inspectionData.tyre_model_name}
                    </Text>
                  </View>
                  <View style={stylesPdf.tableData}>
                    <Text style={[stylesPdf.tableRow1, stylesPdf.greenColor]}>
                      Tyre Category
                    </Text>
                    <Text style={[stylesPdf.tableRow2, stylesPdf.greenColor]}>
                      {inspectionData.user_category_name}
                    </Text>
                  </View>
                </view>
              </View>
            </View>
            <View style={stylesPdf.section}>
              <view style={stylesPdf.ImagesSection}>
                {inspectionData.tyre_defects_images.map((image, index) => (
                  <View key={index} style={stylesPdf.imageContainer}>
                    {defectIdToNameMap[image.defect_id] === "ok" ? (
                      <Image
                        src={require("../../../assets/Placeholder_view_vector.png")}
                        style={stylesPdf.image}
                      />
                    ) : (
                      <Image
                        src={`${API_URL}/upload/readimageurl?imagename=${image.link}&folder=${image.defect_id}`}
                        style={stylesPdf.image}
                      />
                    )}
                    <Text style={stylesPdf.imageDefect}>
                      {defectName[index]} - {defectIdToNameMap[image.defect_id]}
                    </Text>
                  </View>
                ))}
              </view>
            </View>
            <View style={stylesPdf.footerData}>
              <View style={stylesPdf.footerText}>
                <Text>
                  Report Generated Time:{" "}
                  {downloadTime.toLocaleDateString("en-IN", {
                    hour: "numeric",
                    minute: "numeric",
                    hour12: false,
                  })}
                </Text>
              </View>
              <View style={stylesPdf.footerText}>
                <Image src={CopyrightLogo} style={stylesPdf.CopyrightLogo} />{" "}
                <Text>Regrip India Pvt. Ltd.</Text>
              </View>
            </View>
          </View>
          <Watermark />
        </Page>
      </Document>
    );
  };

  const Pdf_file_name = `${inspectionData.tyre_serial_number}`;
  return isButtonClicked ? (
    <PDFDownloadLink
      document={generatePDF(inspectionData)}
      fileName={`${Pdf_file_name}`}
    >
      {({ loading, blob, url }) => {
        setLoading(loading);
        return (
          <button id="myButton" className="download-button" disabled={loading}>
            {loading ? (
              <CircularProgress
                style={{ color: "white", width: 15, height: 15 }}
              />
            ) : (
              <FontAwesomeIcon icon={faDownload} style={{ color: "#ffffff" }} />
            )}
          </button>
        );
      }}
    </PDFDownloadLink>
  ) : (
    <button
      className="download-button"
      onClick={() => setIsButtonClicked(true)}
    >
      <FontAwesomeIcon icon={faDownload} style={{ color: "#ffffff" }} />
    </button>
  );
};

export default HomeDownloadPDF;
