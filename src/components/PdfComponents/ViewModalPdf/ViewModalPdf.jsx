import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import { API_URL } from '../../Config/index';
import { useSelector } from "react-redux";
import { REGRIP_SUPPLIER } from "../../../redux/constants/Constant";
import {
    Page,
    Text,
    View,
    Document,
    StyleSheet,
    Image,
    PDFDownloadLink,
} from "@react-pdf/renderer";


const ViewModalPdf = ({ inspectionData }) => {

    function DateFormat(inputDate) {
        const parsedDate = new Date(inputDate);

        const year = parsedDate.getFullYear();
        const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
        const day = String(parsedDate.getDate()).padStart(2, "0");
        const hours = String(parsedDate.getHours()).padStart(2, "0");
        const minutes = String(parsedDate.getMinutes()).padStart(2, "0");
        return `${year}:${month}:${day} ${hours}:${minutes}`;
    }
    const currentUser = useSelector(state => state.getCurrentUser.role_name)

    const defect = useSelector(state => state.getDefectTypes.defects)
    const [defectIdToNameMap, setDefectIdToNameMap] = useState({});

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

    const defectName = {
        0: "Crown Area Defect",
        1: "SideWall Area Defect",
        2: "InnerCrown Defect",
        3: "Bead Defect",
    }

    const stylesPdf = StyleSheet.create({
        page: {
            flexDirection: 'row',
            fontSize: '12',
            padding: '8',
        },
        sectionTop: {
            margin: 10,
            padding: 10,
            flexGrow: 1,
            height: '15%'
        },
        section: {
            margin: 10,
            padding: 10,
            flexGrow: 1,
            height: '85%'
        },
        MainSection: {
            flexDirection: 'column',
        },
        headSection: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '100%'
        },
        sectionLeft: {
            flexDirection: 'column',
            margin: '2'
        },
        tableData: {
            flexDirection: 'row',
            gap: '2rem',
            margin: '2',
            width: '100%'
        },
        tableRow: {
            border: '1',
            borderColor: '#000',
            margin: '2',
            padding: '2',
            width: '50%'
        },
        blueColor: {
            backgroundColor: '#B4C6E7'
        },
        greenColor: {
            backgroundColor: '#A9D08E'
        },
        yellowColor: {
            backgroundColor: '#FFD966',
        },
        ImagesSection: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            marginTop: 10,
        },
        imageContainer: {
            width: '48%',
            marginBottom: 10,

        },
        image: {
            border: '1',
            borderColor: '#000',
            width: '100%',
            height: '200rem',
            margin: '5',
            padding: '5'
        },
        imageDefect: {
            marginTop: '5',
            marginLeft: '5'
        }
    });


    const generatePDF = (inspectionData) => {
        return (
            <Document>
                <Page style={stylesPdf.page} wrap>
                    <View style={stylesPdf.MainSection}>
                        <View style={stylesPdf.sectionTop}>
                            <View style={stylesPdf.headSection}>
                                <view style={stylesPdf.sectionLeft}>
                                    <View style={stylesPdf.tableData}>
                                        <Text style={[stylesPdf.tableRow, stylesPdf.yellowColor]}>Date</Text>
                                        <Text style={[stylesPdf.tableRow, stylesPdf.yellowColor]}>{DateFormat(inspectionData.entrytime)}</Text>
                                    </View>
                                    <View style={stylesPdf.tableData}>
                                        <Text style={[stylesPdf.tableRow, stylesPdf.yellowColor]}>Supplier Name</Text>
                                        <Text style={[stylesPdf.tableRow, stylesPdf.yellowColor]}>{inspectionData.supplier_name}</Text>
                                    </View>
                                    <View style={stylesPdf.tableData}>
                                        <Text style={[stylesPdf.tableRow, stylesPdf.yellowColor]}>Product Category</Text>
                                        <Text style={[stylesPdf.tableRow, stylesPdf.yellowColor]}>{inspectionData.product_category}</Text>
                                    </View>
                                    <View style={stylesPdf.tableData}>
                                        <Text style={[stylesPdf.tableRow, stylesPdf.yellowColor]}>Serial Number</Text>
                                        <Text style={[stylesPdf.tableRow, stylesPdf.yellowColor]}>{inspectionData.tyre_serial_number}</Text>
                                    </View>
                                </view>
                                <view style={stylesPdf.sectionRight}>
                                    <View style={stylesPdf.tableData}>
                                        <Text style={[stylesPdf.tableRow, stylesPdf.greenColor]}>Brand Name</Text>
                                        <Text style={[stylesPdf.tableRow, stylesPdf.greenColor]}>{inspectionData.tyre_brand_name}</Text>
                                    </View>
                                    <View style={stylesPdf.tableData}>
                                        <Text style={[stylesPdf.tableRow, stylesPdf.greenColor]}>Construction Type</Text>
                                        <Text style={[stylesPdf.tableRow, stylesPdf.greenColor]}>{inspectionData.tyre_construction_type}</Text>
                                    </View>
                                    <View style={stylesPdf.tableData}>
                                        <Text style={[stylesPdf.tableRow, stylesPdf.greenColor]}>Model</Text>
                                        <Text style={[stylesPdf.tableRow, stylesPdf.greenColor]}>{inspectionData.tyre_model_name}</Text>
                                    </View>
                                    <View style={stylesPdf.tableData}>
                                        <Text style={[stylesPdf.tableRow, stylesPdf.greenColor]}>{currentUser !== REGRIP_SUPPLIER ? "Tyre Amount" : "User Tyre Amount"}</Text>
                                        <Text style={[stylesPdf.tableRow, stylesPdf.greenColor]}>{currentUser !== REGRIP_SUPPLIER ? inspectionData.system_user_tyre_amount : inspectionData.user_tyre_price}</Text>
                                    </View>
                                </view>
                            </View>
                        </View>
                        <View style={stylesPdf.section}>
                            <view style={stylesPdf.ImagesSection}>
                                {inspectionData.tyre_defects_images.map((image, index) => (
                                    <View key={index} style={stylesPdf.imageContainer}>
                                        {defectIdToNameMap[image.defect_id] === "ok" ?
                                            <Image src={require("../../../assets/Placeholder_view_vector.png")} style={stylesPdf.image} />
                                            :
                                            <Image src={`${API_URL}/upload/readimageurl?imagename=${image.link}&folder=${image.defect_id}`} style={stylesPdf.image} />
                                        }
                                        <Text style={stylesPdf.imageDefect}>{defectName[index]} - {defectIdToNameMap[image.defect_id]}</Text>
                                    </View>
                                ))}
                            </view>
                        </View>

                    </View>
                </Page >
            </Document >
        );
    };

    const Pdf_file_name = `${inspectionData.tyre_serial_number}`;
    return (
        <PDFDownloadLink document={generatePDF(inspectionData)} fileName={`${Pdf_file_name}`}>
            {({ loading, blob, url }) => (
                <button
                    className="spp-dwn-btn"
                    disabled={loading}
                   >
                    {loading ? <span style={{ color: '#fff' }}>PDF...</span> : <FontAwesomeIcon icon={faDownload} style={{ color: "#ffffff", }} />}
                </button>
            )}
        </PDFDownloadLink>
    )
}

export default ViewModalPdf

