import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { REGRIP_ROLE_ID } from "../../../redux/constants/Constant";
import { JK_SUPPLIER } from "../../../redux/constants/Constant";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  PDFDownloadLink,
  Image,
} from "@react-pdf/renderer";
import RegripStyles from "../../PdfComponents/PdfStyles/RegripStyles";
import OtherStyles from "../../PdfComponents/PdfStyles/OthersStyles";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import Watermark from "../../Watermark/Watermark";
import RegripLogo from "../../../assets/regrip-logo.png";
import CopyrightLogo from "../../../assets/copyright.png";
import { Button } from "@mui/joy";

const TyreClaimsDownloadPDF = ({
  excelData,
  cmp,
  batchId,
  inspectionDate,
  fleetName,
  fleetBranch,
  fleetLocation,
  s_name,
  amountData,
  batchIdDataTyre,
}) => {
  const [supplierName, setSupplierName] = useState("null");
  useEffect(() => {
    if (s_name) {
      setSupplierName(s_name.supplier_name);
    }
  }, [s_name]);

  const currentUser = useSelector((state) => state.getCurrentUser.role_id);

  const styles = currentUser === REGRIP_ROLE_ID ? RegripStyles : OtherStyles;

  const stylesPdf = StyleSheet.create({
    page: {
      flexDirection: "row",
      fontSize: "12",
    },
    section: {
      margin: 10,
      padding: 10,
      flexGrow: 1,
    },
    MainSection: {
      flexDirection: "column",
    },

    logoMain: {
      margin: 10,
      height: "100px",
    },
    logoRegrip: {
      width: "150px",
    },
    footerData: {
      marginTop: 10,
      marginLeft: 10,
      marginRight: 10,
      marginBottom: 0,
      height: "2%",
      display: "flex",
      alignItems: "center",
      flexDirection: "row",
      gap: "70px",
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
    mainHead: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: "3",
      width: "100%",
    },
    headerTop1: {
      flexDirection: "row",
      // marginBottom: '2',
      width: "100%",
    },
    headerTop: {
      flexDirection: "row",
      // marginBottom: '2',
      justifyContent: "flex-end",
      width: "100%",
    },
    header: {
      fontWeight: "bold",
      backgroundColor: "#FFD966",
    },
    headerInner: {
      padding: "5",
      border: 1,
      borderColor: "#000",
      // marginRight: '3',
      width: cmp === null ? "16.6%" : "33%",
    },
    tableRow: {
      flexDirection: "row",
    },
    cell: {
      width: "100%",
      padding: 3,
      border: 1,
      borderColor: "#000",
    },
    blueColor: {
      backgroundColor: "#B4C6E7",
    },
    greenColor: {
      backgroundColor: "#A9D08E",
    },

    tabledes: {
      marginTop: "15px",
    },
  });

  let totalQuantity = 0;
  let totalBasic = 0;
  let totalGST = 0;

  const generatePDFWithoutImages = (excelData) => {
    const uniqueCategories = getUniqueCategories(excelData);
    let serialNumber = 1;

    const downloadTime = new Date();

    return (
      <Document>
        <Page size="A4" orientation="landscape" style={stylesPdf.page} wrap>
          <view style={stylesPdf.MainSection}>
            <View style={stylesPdf.logoMain}>
              <Image src={RegripLogo} style={stylesPdf.logoRegrip} />
            </View>

            {/* <view>
              <View style={stylesPdf.section}>
                <view style={stylesPdf.mainHead}>
                  <view style={stylesPdf.headerTop1}>
                    <Text
                      style={[stylesPdf.headerInner, stylesPdf.blueColor]}
                      break
                    >
                      Inspection Date
                    </Text>
                    <Text
                      style={[stylesPdf.headerInner, stylesPdf.blueColor]}
                      break
                    >
                      {inspectionDate}
                    </Text>
                  </view>
                  {cmp !== null ? (
                    <view style={stylesPdf.headerTop}>
                      <Text
                        style={[stylesPdf.headerInner, stylesPdf.greenColor]}
                      >
                        Fleet Name
                      </Text>
                      <Text
                        style={[stylesPdf.headerInner, stylesPdf.greenColor]}
                      >
                        {fleetName}
                      </Text>
                    </view>
                  ) : null}
                </view>
                <view style={stylesPdf.mainHead}>
                  <view style={stylesPdf.headerTop1}>
                    <Text
                      style={[stylesPdf.headerInner, stylesPdf.greenColor]}
                      break
                    >
                      Supplier
                    </Text>
                    <Text
                      style={[stylesPdf.headerInner, stylesPdf.greenColor]}
                      break
                    >
                      {cmp === null ? "Regrip" : "JK"}
                    </Text>
                  </view>
                  {cmp !== null ? (
                    <view style={stylesPdf.headerTop}>
                      <Text
                        style={[stylesPdf.headerInner, stylesPdf.blueColor]}
                      >
                        Location
                      </Text>
                      <Text
                        style={[stylesPdf.headerInner, stylesPdf.blueColor]}
                      >
                        {fleetBranch}
                      </Text>
                    </view>
                  ) : null}
                </view>


                {amountData &&
                  amountData.map((adata) => {
                    const {
                      tyre_category_name,
                      price,
                      quantity,
                      basic_amount,
                      gst_amount,
                      total_amount,
                    } = adata;
                    return (
                      <View key={tyre_category_name} style={stylesPdf.tableRow}>
                        {cmp && (
                          <Text style={stylesPdf.cell}>
                            {tyre_category_name.toLowerCase() !== "total" &&
                              price}
                          </Text>
                        )}
                        {tyre_category_name.toLowerCase() !== "total" ? (
                          <Text style={stylesPdf.cell}>
                            {tyre_category_name}
                          </Text>
                        ) : (
                          <Text style={[stylesPdf.cell, stylesPdf.greenColor]}>
                            Total
                          </Text>
                        )}
                        <Text style={stylesPdf.cell}>{quantity}</Text>
                        {cmp && (
                          <Text style={stylesPdf.cell}>{basic_amount}</Text>
                        )}
                        {cmp && (
                          <Text style={stylesPdf.cell}>{gst_amount}</Text>
                        )}
                        <Text style={stylesPdf.cell}>{total_amount}</Text>
                      </View>
                    );
                  })}

                <View style={stylesPdf.tabledes}>
                  <View style={stylesPdf.tableRow}>
                    <Text style={[stylesPdf.cell, stylesPdf.header]}>
                      Tyre Size
                    </Text>
                    <Text style={[stylesPdf.cell, stylesPdf.header]}>
                      Fresh
                    </Text>
                    <Text style={[stylesPdf.cell, stylesPdf.header]}>RTD</Text>
                    <Text style={[stylesPdf.cell, stylesPdf.header]}>
                      Total
                    </Text>
                  </View>
                </View>

                {batchIdDataTyre &&
                  batchIdDataTyre?.map((batchData, i) => {
                    const { tyre_size, Fresh, RTD } = batchData;
                    return (
                      <View key={i} style={stylesPdf.tableRow}>
                        <Text style={stylesPdf.cell}>{tyre_size}</Text>
                        <Text style={stylesPdf.cell}>{Fresh}</Text>
                        <Text style={stylesPdf.cell}>{RTD}</Text>
                        <Text style={stylesPdf.cell}>{Fresh + RTD}</Text>
                      </View>
                    );
                  })}
                <View style={stylesPdf.tableRow}>
                  <Text style={[stylesPdf.cell, stylesPdf.greenColor]}>Total</Text>
                  <Text style={stylesPdf.cell}>
                    {batchIdDataTyre
                      ?.map((type) => type.Fresh)
                      .reduce(
                        (accumulator, currentValue) =>
                          accumulator + currentValue,
                        0
                      )}
                  </Text>
                  <Text style={stylesPdf.cell}>
                    {batchIdDataTyre
                      ?.map((type) => type.RTD)
                      .reduce(
                        (accumulator, currentValue) =>
                          accumulator + currentValue,
                        0
                      )}
                  </Text>
                  <Text style={stylesPdf.cell}>
                    {batchIdDataTyre?.reduce(
                      (total, type) => total + type.Fresh + type.RTD,
                      0
                    )}
                  </Text>
                </View>
              </View>
            </view> */}

            <view style={styles.page}>
              <View style={styles.table}>
                <View style={styles.row}>
                  <Text style={[styles.cell, styles.header]} break>
                    S.No
                  </Text>
                  <Text style={[styles.cell, styles.header]} break>
                    Tyre{"\n"}Number
                  </Text>
                  <Text style={[styles.cell, styles.header]} break>
                    Invoive{"\n"}Number
                  </Text>
                  <Text style={[styles.cell, styles.header]} break>
                    Invoive{"\n"}Date
                  </Text>
                  <Text style={[styles.cell, styles.header]} break>
                    Current{"\n"}NSD
                  </Text>
                  <Text style={[styles.cell, styles.header]} break>
                    Standard{"\n"}NSD
                  </Text>

                  <Text style={[styles.cell, styles.header]} break>
                    Brand
                  </Text>
                  <Text style={[styles.cell, styles.header]} break>
                    Size
                  </Text>
                  <Text style={[styles.cell, styles.header]} break>
                    Model
                  </Text>
                  <Text style={[styles.cell, styles.header]} break>
                    Description
                  </Text>
                  <Text style={[styles.cell, styles.header]} break>
                    Retreader{"\n"}Status
                  </Text>
                  <Text style={[styles.cell, styles.header]} break>
                    Status
                  </Text>

                  <Text style={[styles.cell, styles.header]} break>
                    Crown{"\n"}Defect
                  </Text>
                  <Text style={[styles.cell, styles.header]} break>
                    SideWall{"\n"}Defect
                  </Text>
                  <Text style={[styles.cell, styles.header]} break>
                    InnerCrown{"\n"}Defect
                  </Text>
                  <Text style={[styles.cell, styles.header]} break>
                    Bead{"\n"}Defect
                  </Text>
                </View>
                {excelData.map((data, index) => (
                  <View style={styles.row} key={index}>
                    <Text style={styles.cell} break>
                      {serialNumber++}
                    </Text>

                    <Text style={styles.cell} break>
                      {data.tyre_serial_number}
                    </Text>
                    <Text style={styles.cell} break>
                      {data.invoice_no}
                    </Text>

                    <Text style={styles.cell} break>
                      {data.invoice_date}
                    </Text>

                    <Text style={styles.cell} break>
                      {data.current_nsd}
                    </Text>

                    <Text style={styles.cell} break>
                      {data.standard_nsd}
                    </Text>

                    <Text style={styles.cell} break>
                      {data.tyre_brand_name}
                    </Text>
                    <Text style={styles.cell} break>
                      {data.tyre_size}
                    </Text>

                    <Text style={styles.cell} break>
                      {data.tyre_model_name}
                    </Text>

                    <Text style={styles.cell} break>
                      {data.claim_description}
                    </Text>

                    <Text style={styles.cell} break>
                      {data.claim_remark ? data.claim_remark : "Remark Pending"}
                    </Text>
                    <Text style={styles.cell} break>
                      {data.claim_status == "initiate"
                        ? "Status Pending"
                        : data.claim_status}
                    </Text>

                    <Text style={styles.cell} break>
                      <Text style={{ whiteSpace: "pre-line" }}>
                        {data.crown_area_defect}
                      </Text>
                    </Text>
                    <Text style={styles.cell} break>
                      {data.sidewall_area_defect}
                    </Text>
                    <Text style={styles.cell} break>
                      {data.inner_crown_defect}
                    </Text>
                    <Text style={styles.cell} break>
                      {data.bead_defect}
                    </Text>
                  </View>
                ))}
              </View>
            </view>

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
          </view>
          <Watermark />
        </Page>
      </Document>
    );
  };

  const getUniqueCategories = (excelData) => {
    const uniqueCategories = new Set();
    excelData.forEach((item) => {
      uniqueCategories.add(item.user_category_name);
    });
    return Array.from(uniqueCategories);
  };

  const fileName ="TyreClaims";

  return (
    <PDFDownloadLink
      document={generatePDFWithoutImages(excelData)}
      fileName={`${fileName}`}
    >
      {({ loading, blob, url }) => (
        <p style={{ color: "#39532f", width: "100%" }}>
          {loading ? (
            "Preparing PDF..."
          ) : (
            <span style={{ display: "flex" }}>
              <Button>Download PDF
              <FontAwesomeIcon icon={faDownload} style={{marginLeft:"2px", color: "#fff",fontSize:15 }}  />
                
                </Button>
            </span>
          )}
        </p>
      )}
    </PDFDownloadLink>
  );
};

export default TyreClaimsDownloadPDF;
