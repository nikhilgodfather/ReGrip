import React, { useEffect, useState } from "react";
import "./Supplier.css";
import axios from "axios";
import AddSupplier from "./../AddSupplier/AddSupplier";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPenToSquare,
  faTrashCan,
  faPlus,
  faEye,
  faDownload,
  faChevronLeft,
} from "@fortawesome/free-solid-svg-icons";
import ViewBankDetailsModal from "../ViewBankDetailsModal/ViewBankDetailsModal";
import { API_URL } from "../Config/index";
import {
  PDFDownloadLink,
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import * as XLSX from "xlsx";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const Supplier = () => {
  const dummmyArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const [loading, setLoading] = useState(true);
  const [supplierData, setSupplierData] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [bankDetailsViewForm, setBankDetailsViewForm] = useState(false);
  const [editSupplierData, setEditSupplierData] = useState(null);
  const [supplierId, setSupplierId] = useState();
  const [accountHolderName, setAccountHolderName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [bankName, setBankName] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const navigate = useNavigate();

  const getBankData = async (supplier_id) => {
    try {
      const { data } = await axios.get(
        `${API_URL}/supplier/bankdetails?supplierId=${supplier_id}`
      );
      const bankDetails = data.rows;

      if (bankDetails.length > 0) {
        const bankDetail = bankDetails[0];
        setAccountHolderName(bankDetail.account_holder_name);
        setBankName(bankDetail.bank_name);
        setAccountNumber(bankDetail.account_number);
        setIfscCode(bankDetail.ifsc_code);
      } else {
        console.log("No bank details found.");
      }
    } catch (error) {
      console.error("An error occurred while fetching Bank data:", error);
    }
  };

  const getSupplierData = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${API_URL}/supplier/getdata`);
      const { suppliers } = data;
      setLoading(false);
      setSupplierData(suppliers);
    } catch (error) {
      console.error("An error occurred while fetching supplier data:", error);
      // alert("Failed to fetch supplier data.");
      toast.error("Failed to fetch supplier data.", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 8000,
      });
    }
  };

  const deleteSupplier = async (supplier_id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this supplier?"
    );
    if (!confirmDelete) {
      return;
    }
    try {
      await axios.delete(`${API_URL}/supplier/deletedata`, {
        data: { supplier_id },
      });
      toast.success("Suppliers details deleted successfully!", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 8000,
      });
      setSupplierData((prevSupplierData) =>
        prevSupplierData.filter(
          (supplier) => supplier.supplier_id !== supplier_id
        )
      );
    } catch (error) {
      console.error("An error occurred while deleting the supplier:", error);
      // alert("Failed to delete the supplier.");
      toast.error("Failed to delete supplier data.", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 8000,
      });
    }
  };

  useEffect(() => {
    getSupplierData();
  }, []);
  const handlePopupClose = (message) => {
    getSupplierData();
    toast.success(message, {
      position: toast.POSITION.TOP_CENTER,
      autoClose: 8000,
    });
  };

  const downloadExcel = () => {
    const transformedData = transformDataForExcel(supplierData);
    const ws = XLSX.utils.json_to_sheet(transformedData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "SupplierData");
    XLSX.writeFile(wb, "SupplierData.xlsx");
  };

  const transformDataForExcel = (data) => {
    return data.map((item) => {
      return {
        "Supplier Name": item.supplier_name,
        "Supplier Code": item.supplier_code,
        "Person Name": item.person_name,
        "Mobile Number": item.mobile_number,
        "GST Number": item.gstno,
        City: item.city,
        State: item.state,
        account_holder_name: item.account_holder_name,
        account_holder_type: item.account_holder_type,
        account_number: item.account_number,
        ifsc_code: item.ifsc_code,
      };
    });
  };

  const styles = StyleSheet.create({
    page: {
      fontSize: 8,
      padding: 5,
    },
    heading: {
      fontSize: 15,
      textAlign: "center",
      marginBottom: 20,
      fontWeight: "bold",
    },
    table: {
      display: "table",
      borderStyle: "solid",
      borderWidth: 1,
      borderRightWidth: 0,
      borderBottomWidth: 0,
    },
    row: {
      flexDirection: "row",
    },
    cell: {
      width: "11%",
      padding: 5,
      borderStyle: "solid",
      borderWidth: 1,
      borderLeftWidth: 0,
      borderTopWidth: 0,
      flexDirection: "row",
      overflow: "hidden",
    },
    header: {
      backgroundColor: "grey",
      color: "white",
      width: "11%",
      padding: 5,
      borderStyle: "solid",
      borderWidth: 1,
      borderLeftWidth: 0,
      borderTopWidth: 0,
      flexDirection: "row",
      overflow: "hidden",
    },
  });

  const SupplierPDF = () => (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.heading}>
          <Text>Regrip</Text>
        </View>
        <View style={styles.table}>
          <View style={styles.row}>
            <Text style={[styles.cell, styles.header]}>Supplier Name</Text>
            <Text style={[styles.cell, styles.header]}>Supplier Code</Text>
            <Text style={[styles.cell, styles.header]}>Person Name</Text>
            <Text style={[styles.cell, styles.header]}>Mobile Number</Text>
            <Text style={[styles.cell, styles.header]}>GST No</Text>
            <Text style={[styles.cell, styles.header]}>State</Text>
            <Text style={[styles.cell, styles.header]}>City</Text>
            <Text style={[styles.cell, styles.header]}>
              Account Holder Name
            </Text>
            <Text style={[styles.cell, styles.header]}>
              Account Holder Type
            </Text>
            <Text style={[styles.cell, styles.header]}>Account Number</Text>
            <Text style={[styles.cell, styles.header]}>Ifsc Code</Text>
          </View>
          {supplierData.map((supplier, index) => (
            <View key={index} style={styles.row}>
              <Text style={styles.cell}>{supplier.supplier_name}</Text>
              <Text style={styles.cell}>{supplier.supplier_code}</Text>
              <Text style={styles.cell}>{supplier.person_name}</Text>
              <Text style={styles.cell}>{supplier.mobile_number}</Text>
              <Text style={styles.cell}>{supplier.gstno}</Text>
              <Text style={styles.cell}>{supplier.state}</Text>
              <Text style={styles.cell}>{supplier.city}</Text>
              <Text style={styles.cell}>{supplier.account_holder_name}</Text>
              <Text style={styles.cell}>{supplier.account_holder_type}</Text>
              <Text style={styles.cell}>{supplier.account_number}</Text>
              <Text style={styles.cell}>{supplier.ifsc_code}</Text>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );

  const downloadLink = (
    <PDFDownloadLink document={<SupplierPDF />} fileName="SupplierData.pdf">
      {({ loading }) => (loading ? "Loading document..." : "Download PDF")}
    </PDFDownloadLink>
  );

  return (
    <div className="supplier-container" style={{ marginLeft: 0 }}>
      <ToastContainer className="custom-toast-container" />
      <div className="supplier-header">
        {/* <h1 className="heading1">Supplier */}
        <h1 className="heading1">
          <FontAwesomeIcon
            onClick={() => {
              navigate("/home");
            }}
            icon={faChevronLeft}
            color="#65a143"
            style={{ marginRight: 6, cursor: "pointer" }}
          />
          Supplier
        </h1>
        <div className="supplier-btn">
          <button className="header-button" onClick={downloadExcel}>
            <span>
              <FontAwesomeIcon
                icon={faDownload}
                style={{ color: "#ffffff", marginRight: "5px" }}
              />{" "}
              Save As Excel
            </span>
          </button>

          <button className="header-button">
            <span>
              {" "}
              <FontAwesomeIcon
                icon={faDownload}
                style={{ color: "#ffffff", marginRight: "5px" }}
              />{" "}
              {downloadLink}
            </span>
          </button>
          <button
            className="header-button"
            onClick={() => {
              setShowForm(true);
            }}
          >
            <span>
              <FontAwesomeIcon
                icon={faPlus}
                style={{ color: "#ffffff", marginRight: "5px" }}
              />{" "}
              Add Supplier
            </span>
          </button>
        </div>
      </div>
      {/* Edit Supplier or Add supplier Modal */}
      {showForm && (
        <AddSupplier
          setShowForm={setShowForm}
          editSupplierData={editSupplierData}
          setEditSupplierData={setEditSupplierData}
          supplierId={supplierId}
          accountHolderName={accountHolderName}
          setAccountHolderName={setAccountHolderName}
          setAccountNumber={setAccountNumber}
          accountNumber={accountNumber}
          setIfscCode={setIfscCode}
          ifscCode={ifscCode}
          setBankName={setBankName}
          bankName={bankName}
          onClose={handlePopupClose}
        />
      )}

      {/* Bank Details View MOdal */}
      {bankDetailsViewForm && (
        <ViewBankDetailsModal
          setBankDetailsViewForm={setBankDetailsViewForm}
          supplierId={supplierId}
        />
      )}
      {true && (
        <div className="table-mega-container">
          <div className="table-container">
            <table className="supplier-table">
              <thead>
                <tr className="table-heading">
                  <th style={{ borderTopLeftRadius: "15px" }}>SNo</th>
                  <th>Supplier Name</th>
                  <th>Supplier code</th>
                  <th>Person Name</th>
                  <th>Mobile Number</th>
                  <th>GST Number</th>
                  <th>City</th>
                  <th>State</th>
                  <th>Bank Details</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {loading === true
                  ? dummmyArray.map((i) => (
                      <tr className="table-data skeleton" key={i}>
                        <td>
                          <Skeleton />
                        </td>
                        <td>
                          <Skeleton />
                        </td>
                        <td>
                          <Skeleton />
                        </td>
                        <td>
                          <Skeleton />
                        </td>
                        <td>
                          <Skeleton />
                        </td>
                        <td>
                          <Skeleton />
                        </td>
                        <td>
                          <Skeleton />
                        </td>
                        <td>
                          <Skeleton />
                        </td>
                        <td>
                          <Skeleton />
                        </td>
                        <td>
                          <Skeleton />
                        </td>
                      </tr>
                    ))
                  : supplierData.map((supplier, i) => {
                      const {
                        supplier_id,
                        supplier_name,
                        supplier_code,
                        person_name,
                        mobile_number,
                        gstno,
                        city,
                        state,
                      } = supplier;
                      return (
                        <tr className="table-data" key={i}>
                          <td>{i + 1}</td>
                          <td className="supplier-name-column">
                            {supplier_name}
                          </td>
                          <td>{supplier_code}</td>
                          <td>{person_name}</td>
                          <td>{mobile_number}</td>
                          <td>{gstno}</td>
                          <td>{city}</td>
                          <td>{state}</td>
                          <td>
                            <div
                              className="bankDetails-view-btn"
                              onClick={() => {
                                setBankDetailsViewForm(true);
                                setSupplierId(supplier_id);
                              }}
                            >
                              <FontAwesomeIcon
                                className="eye-btn"
                                icon={faEye}
                                style={{ color: "#39532f" }}
                              />
                            </div>
                          </td>
                          <td>
                            <div className="action-btn">
                              <div
                                className="spp-edit-btn"
                                onClick={() => {
                                  setEditSupplierData(supplier);
                                  setShowForm(true);
                                  setSupplierId(supplier_id);
                                  getBankData(supplier_id);
                                }}
                              >
                                <FontAwesomeIcon
                                  icon={faPenToSquare}
                                  style={{ color: "#ffffff" }}
                                />
                              </div>
                              <div
                                className="spp-dlt-btn"
                                onClick={() => {
                                  deleteSupplier(supplier_id);
                                }}
                              >
                                {" "}
                                <FontAwesomeIcon
                                  icon={faTrashCan}
                                  style={{ color: "#ffffff" }}
                                />
                              </div>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Supplier;
