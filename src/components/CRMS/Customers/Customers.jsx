import axios from "axios";
import React, { useEffect, useState } from "react";
import { API_URL } from "../../Config/index";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faChevronLeft,
  faPenToSquare,
  faEye,
} from "@fortawesome/free-solid-svg-icons";
import Skeleton from "react-loading-skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
} from "@mui/material";
import { Controls, Player } from "@lottiefiles/react-lottie-player";
// import nodata from '../../../../lotties/nodata1.json';
import nodata from "../../../lotties/nodata1.json";
import { useNavigate } from "react-router-dom";
import "./Customers.css";
import { Input, Modal, ModalClose, Sheet } from "@mui/joy";
import AddCustomer from "../../CRMS/AddCustomer/AddCustomer.jsx";
import CustomerBranch from "./CustomerBranch/CustomerBranch.jsx";
import { ToastContainer, toast } from "react-toastify";

const Customers = () => {
  const dummyArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const [loading, setLoading] = useState(true);
  const [customerData, setCustomerData] = useState([]);
  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);
  const [editCustomerData, setEditCustomerData] = useState(null);
  const [openImageModal, setOpenImageModal] = useState(false);
  const [selectedImageSrc, setSelectedImageSrc] = useState("");
  const [openEditCustomer, setOpenEditCustomer] = useState(false);
  const [userName, setUserName] = useState("");

  const [CustomerBranchModal, setCustomerBranchModal] = useState(false);
  const [customerBranchData, setCustomerBranchData] = useState([]);

  const [shareCustomerId, setShareCustomerId] = useState(null);
  const [shareCustomerBranchId, setShareCustomerBranchId] = useState();
  const [shareCustomerPan, setShareCustomerPan] = useState("");
  const navigate = useNavigate();

  const resetFields = () => {
    setShareCustomerId(null);
  };

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10); // Number of rows per page

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenImageModal = (imageSrc) => {
    setSelectedImageSrc(imageSrc);
    setOpenImageModal(true);
  };

  const getAllCustomer = async () => {
    try {
      const { data } = await axios.get(
        `${API_URL}/customer/search-customers?customer_name=${userName}`
      );
      setLoading(false);
      setCustomerData(data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const getSuccessMessage = (messageTrue) => {
    toast.success(messageTrue, {
      position: toast.POSITION.TOP_CENTER,
      autoClose: 2000,
    });
  };

  useEffect(() => {
    getAllCustomer();
  }, [userName]);

  const getSerialNumber = (index) => {
    return index + 1 + page * rowsPerPage;
  };

  return (
    <div
      className="Fleet-container"
      style={{ marginLeft: 0, display: "flex", flexDirection: "column" }}
    >
      <ToastContainer className="custom-toast-container" />
      <Modal
        aria-labelledby="modal-title"
        aria-describedby="modal-desc"
        open={openImageModal}
        onClose={() => setOpenImageModal(false)}
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <Sheet
          variant="plain"
          sx={{
            width: 400,
            height: 430,
            borderRadius: "md",
            p: 5,
            display: "flex",
            justifyContent: "center",
          }}
        >
          {selectedImageSrc && (
            <img
              src={selectedImageSrc}
              alt={`img`}
              style={{ maxWidth: "100%", maxHeight: "100%" }}
            />
          )}

          <ModalClose variant="plain" sx={{ m: 0 }} />
        </Sheet>
      </Modal>

      <div
        className="Fleet-header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div className="head" style={{ display: "flex" }}>
          <h1 className="heading1" style={{ marginBottom: "3px" }}>
            <FontAwesomeIcon
              onClick={() => {
                navigate("/crms");
              }}
              icon={faChevronLeft}
              color="#65a143"
              style={{ marginRight: 6, cursor: "pointer" }}
            />
            Customer
          </h1>
        </div>
        <div style={{ marginLeft: "auto", marginRight: "20px" }}>
          <Input
            placeholder="Search Customer…"
            variant="outlined"
            onChange={(e) => {
              setPage(0);
              setUserName(e.target.value);
            }}
          />
        </div>
        <button
          className="header-button-add-customer"
          onClick={() => {
            setEditCustomerData(null);
            setShowAddCustomerModal(true);
          }}
        >
          <span>
            <FontAwesomeIcon
              icon={faPlus}
              style={{ color: "#ffffff", marginRight: "5px" }}
            />
            Add Customer
          </span>
        </button>
      </div>
      <Modal
        aria-labelledby="modal-title"
        aria-describedby="modal-desc"
        open={showAddCustomerModal}
        onClose={() => {
          setShowAddCustomerModal(false);
          setShareCustomerId(null);
        }}
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <Sheet
          variant="plain"
          sx={{
            width: "90%",
            height: "90%",
            borderRadius: "md",
            p: 3,
            boxShadow: "lg",
            position: "relative",
          }}
        >
          <ModalClose variant="plain" sx={{ m: 0 }} />
          <AddCustomer
            resetFields={resetFields}
            editCustomerData={editCustomerData}
            setShowAddCustomerModal={setShowAddCustomerModal}
            getAllCustomer={getAllCustomer}
            shareCustomerId={shareCustomerId}
            shareCustomerPan={shareCustomerPan}
            shareCustomerBranchId={shareCustomerBranchId}
            getSuccessMessage={getSuccessMessage}
          />
        </Sheet>
      </Modal>

      <Modal
        aria-labelledby="modal-title"
        aria-describedby="modal-desc"
        open={CustomerBranchModal}
        onClose={() => {
          setCustomerBranchModal(false);
        }}
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <Sheet
          variant="plain"
          sx={{
            width: "90%",
            height: "90%",
            borderRadius: "md",
            p: 3,
            boxShadow: "lg",
            position: "relative",
          }}
        >
          <ModalClose variant="plain" sx={{ m: 0 }} />
          <CustomerBranch customerBranchData={customerBranchData} />
        </Sheet>
      </Modal>

      <div className="table-mega-container" style={{ height: "auto" }}>
        <div className="table-container" style={{ maxHeight: "100%" }}>
          <TableContainer style={{ overflowX: "visible" }}>
            <Table
              className="table-customer"
              aria-label="table variants"
              variant="outlined"
              style={{background:"#fff"}}
            >
              <TableHead>
                <TableRow className="">
                  <TableCell style={{ minWidth: 90 }}>SNo</TableCell>
                  <TableCell style={{ minWidth: 180 }}>Name</TableCell>
                  <TableCell style={{ minWidth: 150 }}>
                    Contact Number
                  </TableCell>
                  <TableCell style={{ minWidth: 150 }}>Region</TableCell>
                  <TableCell style={{ minWidth: 150 }}>City</TableCell>
                  {/* <TableCell style={{ minWidth: 150 }}>
                    Meeting Person
                  </TableCell> */}
                  <TableCell style={{ minWidth: 140 }}>PAN</TableCell>
                  <TableCell style={{ minWidth: 140 }}>Customer Type</TableCell>
                  <TableCell style={{ minWidth: 120 }}>Actions</TableCell>
                 
                </TableRow>
              </TableHead>
              <TableBody>
                {loading === true
                  ? dummyArray.map((i) => (
                      <TableRow className="table-data skeleton" key={i}>
                        <TableCell>
                          <Skeleton />
                        </TableCell>
                        <TableCell>
                          <Skeleton />
                        </TableCell>
                        <TableCell>
                          <Skeleton />
                        </TableCell>
                        <TableCell>
                          <Skeleton />
                        </TableCell>
                        <TableCell>
                          <Skeleton />
                        </TableCell>
                      </TableRow>
                    ))
                  : (customerData && customerData)
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((customer, i) => (
                        <TableRow key={i} className="table-data">
                          <TableCell className="capitalize-text">
                            {getSerialNumber(i)}
                          </TableCell>
                          <TableCell className="capitalize-text">
                            {customer?.customer_name}
                          </TableCell>
                          <TableCell className="capitalize-text">
                            {customer?.branches?.some(
                              (b) => b?.customer_branch_name === "Main Branch"
                            )
                              ? customer?.branches?.find(
                                  (b) =>
                                    b?.customer_branch_name === "Main Branch"
                                )?.mobile_number
                              : customer?.branches[0]?.mobile_number}
                          </TableCell>
                          <TableCell className="capitalize-text">
                                {customer?.branches?.some(
                                  (b) => b?.customer_branch_name === "Main Branch"
                                )
                                  ? customer?.branches?.find(
                                      (b) =>
                                        b?.customer_branch_name === "Main Branch"
                                    )?.customer_branch_region_name
                                  : customer?.branches[0]?.customer_branch_region_name
                            
                            }
                          </TableCell>
                          <TableCell className="capitalize-text">
                          {customer?.branches?.some(
                                  (b) => b?.customer_branch_name === "Main Branch"
                                )
                                  ? customer?.branches?.find(
                                      (b) =>
                                        b?.customer_branch_name === "Main Branch"
                                    )?.city
                                  : customer?.branches[0]?.city
                            
                            }
                          </TableCell>
                          {/* <TableCell className="capitalize-text">
                            meeting person
                          </TableCell> */}

                         
                          <TableCell className="capitalize-text">
                            {customer?.pan_number
                              ? customer?.pan_number
                              : "--/--"}
                          </TableCell>
                          <TableCell className="capitalize-text">
                            <div
                              style={{
                                width: "100%",
                                display: "flex",
                                justifyContent: "center",
                              }}
                            >
                              <div
                                // className={`customer-chip-${customer?.customer_type}`}
                              >
                                {customer.customer_type
                                  ? customer?.customer_type
                                  : "--/--"}
                              </div>
                            </div>
                          </TableCell>

                          <TableCell>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                              }}
                            >
                              <div
                                style={{
                                  margin: "auto",
                                  backgroundColor: "#000",
                                  width: "fit-content",
                                  padding: "8px",
                                  borderRadius: "5px",
                                  cursor: "pointer",
                                }}

                                onClick={() => {
                                  setShowAddCustomerModal(true);
                                  setShareCustomerId(customer.customer_id);
                                  setShareCustomerPan(customer.pan_number);

                                  const mainBranch = customer?.branches.find(
                                    (branch) =>
                                      branch?.customer_branch_name ===
                                      "Main Branch"
                                  );
                                  if (
                                    mainBranch?.customer_branch_name ===
                                    "Main Branch"
                                  ) {
                                    setShareCustomerBranchId(
                                      mainBranch?.customer_branch_id
                                    );
                                  } else {
                                    setShareCustomerBranchId(
                                      customer?.branches[0]
                                        ?.customer_branch_id
                                    );
                                  }
                                }}
                              >
                                <FontAwesomeIcon
                                
                                  icon={faPenToSquare}
                                  style={{ color: "#fff" }}
                                />
                              </div>
                              <div
                                style={{
                                  margin: "auto",
                                  backgroundColor: "#000",
                                  width: "fit-content",
                                  padding: "8px",
                                  borderRadius: "5px",
                                  cursor: "pointer",
                                }}

                                onClick={() => {
                                  setShowAddCustomerModal(true);
                                  setShareCustomerId(customer.customer_id);
                                  setShareCustomerPan(customer.pan_number);

                                  const mainBranch = customer?.branches.find(
                                    (branch) =>
                                      branch?.customer_branch_name ===
                                      "Main Branch"
                                  );
                                  if (
                                    mainBranch?.customer_branch_name ===
                                    "Main Branch"
                                  ) {
                                    setShareCustomerBranchId(
                                      mainBranch?.customer_branch_id
                                    );
                                  } else {
                                    setShareCustomerBranchId(
                                      customer?.branches[0]?.customer_branch_id
                                    );
                                  }
                                }}
                              >
                                <FontAwesomeIcon

                                  icon={faEye}
                                  style={{ color: "#fff", cursor: "pointer" }}
                                />
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
              </TableBody>
            </Table>
            {customerData.length === 0 && !loading && (
              <div className="empty-data">
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
          </TableContainer>
        </div>
      </div>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={loading ? dummyArray.length : customerData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </div>
  );
};

export default Customers;
