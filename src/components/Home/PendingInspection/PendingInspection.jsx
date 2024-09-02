import { useEffect, useState } from "react";
import "./PendingInspection.css";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import axios from "axios";
import { API_URL } from "../../Config";
import { useSelector } from "react-redux";
import AssignInspection from "./AssignInspection.jsx/AssignInspection";
import nodata from "../../../lotties/nodata1.json";
import { Controls, Player } from "@lottiefiles/react-lottie-player";
import GenerateRequest from "../../GenerateRequest/GenerateRequest.jsx";
import Modal from "@mui/joy/Modal";
import { useNavigate } from "react-router-dom";
import ModalClose from '@mui/joy/ModalClose';
import Sheet from '@mui/joy/Sheet';
import { REGRIP_ROLE_ID } from '../../../redux/constants/Constant.js'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileExcel } from '@fortawesome/free-solid-svg-icons'
import GenerateRequestExcel from '../GenerateRequestExcel/GenerateRequestExcel.jsx'
import UploadedExcelModal from '../../Assignment/UploadedExcelModal/UploadedExcelModal.jsx'

const PendingInspection = () => {
    const [generateRequestModal, setGenerateRequestModal] = useState(false);
    const currentUser = useSelector((state) => state.getCurrentUser.role_name);
    const currentUserId = useSelector((state) => state.getCurrentUser.role_id);
    const dummmyArray = [1, 2, 3, 4, 5]
    const [loading, setLoading] = useState(true)
    const [pendingInspections, setPendingInspections] = useState([])
    const [assignmentModal, setAssignmentModal] = useState(false)
    const [selectedInspectionAssignment, setSelectedInspectionAssignment] = useState()
    console.log(selectedInspectionAssignment)
    const [openAssign, setOpenAssign] = useState(false);

    const [showUploadedExcelModal, setShowUploadedExcelModal] = useState(false);

    const navigate = useNavigate();

  const handlePopupClose = () => {
    getPendingInspection();
  };

  const getPendingInspection = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) navigate("/");
      const bearer_token = "bearer " + JSON.parse(token);

      setLoading(true);
      const { data } = await axios.get(`${API_URL}/inspection-assignments`, {
        headers: {
          Authorization: bearer_token,
        },
        params: {
          status: "pending",
        },
      });
      // const fleets = data.rows;
      setLoading(false);
      setPendingInspections(data.data);
    } catch (e) {
      console.log("Error while fetching data:", e.message);
    }
  };

    const handleAssignmentButton = (data) => {
        setOpenAssign(true)
        setSelectedInspectionAssignment(data)
    }

    useEffect(() => {

        getPendingInspection()
    }, [])
    return (
        <div className='pending-inspection'>
            <Modal
                aria-labelledby="modal-title"
                aria-describedby="modal-desc"
                open={showUploadedExcelModal}
                onClose={() => {
                    // getAssignmentInspectionRequests()
                    setShowUploadedExcelModal(false)
                }}
                sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
            >
                <Sheet
                    variant="plain"
                    sx={{
                        width: "1240px",
                        height: "80%",
                        maxHeight: '80%',
                        minHeight: '400px',
                        borderRadius: 'md',
                        p: 3,
                        boxShadow: 'lg',
                        position: "relative"
                    }}
                >
                    <ModalClose variant="plain" sx={{ m: -1 }} />
                    <UploadedExcelModal inside={true} tyreInspectionAssignmentId={selectedInspectionAssignment?.tyre_inspection_assignment_id} />
                </Sheet>
            </Modal>
            <div style={{ display: 'flex' }} >
                <h2>Pending Requests</h2>
                {
                    currentUser === "Regrip" ? "" :
                        <>
                            <div style={{ marginLeft: 'auto' }}>
                                <button
                                    className="generateRequestBtn"
                                    onClick={() => {
                                        setGenerateRequestModal(true);
                                    }}
                                >
                                    <span>
                                        Generate Request
                                    </span>
                                </button>
                                <div>
                                    <Modal
                                        aria-labelledby="modal-title"
                                        aria-describedby="modal-desc"
                                        open={generateRequestModal}
                                        onClose={() => {
                                            setGenerateRequestModal(false)
                                        }}
                                        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                                    >
                                        <Sheet
                                            variant="plain"
                                            sx={{
                                                width: "450px",
                                                height: "fit-content",
                                                borderRadius: 'md',
                                                p: 3,
                                                boxShadow: 'lg',
                                                position: "relative",
                                                padding: 0
                                            }}
                                        >
                                            <ModalClose className='close-modal' variant="plain" sx={{ m: -1 }} />
                                            <GenerateRequest
                                                setGenerateRequestModal={setGenerateRequestModal}
                                                onClose={handlePopupClose}
                                            />
                                        </Sheet>
                                    </Modal>
                                </div>
                            </div>
                        </>
                }
            </div>
            <Modal
                aria-labelledby="modal-title"
                aria-describedby="modal-desc"
                open={openAssign}
                onClose={() => setOpenAssign(false)}
                sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
            >
                <Sheet
                    variant="plain"
                    sx={{
                        width: "400px",
                        height: "360px",
                        borderRadius: 'md',
                        p: 3,
                        boxShadow: 'lg',
                        position: "relative"
                    }}
                >
                    <ModalClose variant="plain" sx={{ m: 0 }} />
                    <AssignInspection getPendingInspection={getPendingInspection} selectedInspectionAssignment={selectedInspectionAssignment} setOpenAssign={setOpenAssign} />
                </Sheet>
            </Modal>
            <div className="table-container">
                <table className="pending-inspection-table">
                    <thead>
                        <tr className="table-heading">
                            <th></th>
                            <th>Request Type</th>
                            <th>{currentUserId === REGRIP_ROLE_ID ? "Supplier, " : ""} Fleet</th>
                            <th>Branch</th>
                            <th>Tyre Count</th>
                            <th>Date</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody style={{ width: '100%' }}>
                        {
                            loading === true ?
                                dummmyArray.map((i) =>
                                    <tr className="table-data" key={i}>
                                        <td style={{ borderTopLeftRadius: "20px", borderBottomLeftRadius: "20px", height: 45 }}><Skeleton /></td>
                                        <td><Skeleton /></td>
                                        <td><Skeleton /></td>
                                        <td><Skeleton /></td>
                                        <td><Skeleton /></td>
                                        <td><Skeleton /></td>
                                        <td style={{ borderTopRightRadius: "20px", borderBottomRightRadius: "20px" }}><Skeleton /></td>
                                    </tr>
                                )
                                :
                                pendingInspections.map((inspection, i) => {
                                    const {
                                        tyre_inspection_assignment_id,
                                        is_excel,
                                        assigned_employee_id,
                                        supplier_brand_name,
                                        fleet_name,
                                        fleet_branch_name,
                                        tyre_count,
                                        date,
                                        status,
                                        inspection_batch_id
                                    } = inspection;
                                    const formattedDate = new Date(date).toLocaleDateString('en-GB');

                                    return (
                                        <tr className="table-data" key={i}>
                                            <td style={{ borderTopLeftRadius: "20px", borderBottomLeftRadius: "20px", textAlign: 'right' }}>
                                                {
                                                    is_excel &&
                                                    <FontAwesomeIcon onClick={() => {
                                                        setSelectedInspectionAssignment(inspection)
                                                        setShowUploadedExcelModal(true)
                                                    }} icon={faFileExcel} style={{ cursor: 'pointer' }} />
                                                }

                                            </td>
                                            <td>
                                                {
                                                    inspection_batch_id ?
                                                        'Inspection'
                                                        :
                                                        "Scrap"
                                                }

                                            </td>
                                            <td>
                                                {currentUserId === REGRIP_ROLE_ID ? (supplier_brand_name + ", ") : ""}{fleet_name}
                                            </td>
                                            <td>{fleet_branch_name}</td>
                                            <td>
                                                <div className='tyre-quantity'>
                                                    {tyre_count}
                                                </div>
                                            </td>
                                            <td>{formattedDate}</td>
                                            <td style={{ borderTopRightRadius: "20px", borderBottomRightRadius: "20px" }} >
                                                {
                                                    (status === 'initiate' && currentUser !== 'Regrip') ? 'Assignment Pending' :
                                                        (status === 'initiate' && currentUser === 'Regrip') ? <button className='assign-button' onClick={() => {
                                                            handleAssignmentButton(inspection)
                                                        }}>Assign</button> :
                                                            (status === 'pending_inspection' && currentUser !== 'Regrip') ? `Inspector Assigned ` :
                                                                (status === 'pending_inspection' && currentUser === 'Regrip') ? `Assigned to ${inspection.assigned_employee_name}` :
                                                                    (status === 'pending_approval' && currentUser !== 'Regrip') ? `Approval Pending` :
                                                                        (status === 'pending_approval' && currentUser === 'Regrip') ? `Approval Pending` :
                                                                            (status === 'approved' && currentUser !== 'Regrip') ? `Invoice Pending` :
                                                                                (status === 'approved' && currentUser === 'Regrip') ? `Invoice Pending` :
                                                                                    (status === 'pending_lifting' && currentUser !== 'Regrip') ? `Lifting Pending` : `Lifting Pending`

                                                }
                                            </td>
                                        </tr>
                                    )
                                })
                        }
                    </tbody>
                </table>
                {
                    pendingInspections.length === 0 && !loading &&
                    <div className='empty-data'>
                        <Player
                            autoplay
                            loop
                            src={nodata}
                            style={{ height: '150px', width: '150px' }}
                        >
                            <Controls buttons={['repeat', 'frame', 'debug']} />
                        </Player>
                    </div>
                }
            </div>
        </div>
    )
}

export default PendingInspection;
