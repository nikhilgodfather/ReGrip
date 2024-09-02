import { useLocation } from "react-router-dom";
import './AssignmentRequest.css'
import axios from 'axios';
import { useEffect, useState } from 'react';
import { API_URL } from '../../Config';
import { useSelector } from "react-redux";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faEye } from '@fortawesome/free-solid-svg-icons';
import { REGRIP_ROLE_ID } from '../../../redux/constants/Constant';
import TyreInspectionDetailsModal from '../../TyreInspectionDetailsModal/TyreInspectionDetailsModal';
import TyreAction from '../TyreAction/TyreAction';
import ModalClose from '@mui/joy/ModalClose';
import Sheet from '@mui/joy/Sheet';
import Modal from '@mui/joy/Modal';
import TyreActionInvoice from '../TyreActionInvoice/TyreActionInvoice';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UploadedExcelModal from '../UploadedExcelModal/UploadedExcelModal';
import { useNavigate } from "react-router-dom";

const AssignmentRequest = ({ handleBackButton }) => {
    const [inspectionAssignmentRequests, setInspectionAssignmentRequests] = useState(null)
    const dummmyArray = [1, 2, 3];

    const currentUser = useSelector(state => state.getCurrentUser.role_id)
    const currentUserName = useSelector(state => state.getCurrentUser.role_name)
    const [loading, setLoading] = useState(true);
    const [selectedAssignment, setSelectedAssignment] = useState(null);
    const [selectedType, setSelectedType] = useState('');
    const [batchId, setBatchId] = useState();
    const [inspectionDetailsModal, setInspectionDetailsModal] = useState(false);
    const [assignmentType, setAssignmentType] = useState('inspection')
    const [showTyreAction, setShowTyreAction] = useState(false);
    const [showTyreActionInvoice, setShowTyreActionInvoice] = useState(false);
    const [showUploadedExcelModal, setShowUploadedExcelModal] = useState(false);
    const [fleetBranchLocation, setFleetBranchLocation] = useState()
    const navigate = useNavigate();

    const location = useLocation();

    const getAssignmentInspectionRequests = async () => {
        const currentUrl = location.pathname;
        let firstEndpoint
        if (currentUrl) {
            firstEndpoint = currentUrl.split("/")[2];
        }
        const token = localStorage.getItem("token");
        // if (!token) navigate("/");
        setLoading(true)
        const bearer_token = "bearer " + JSON.parse(token);
        const { data } = await axios.get(`${API_URL}/inspection-assignments/fleet-branch-assignments`, {
            headers: {
                Authorization: bearer_token,
            },
            params: {
                fleet_branch_id: firstEndpoint
            }
        });
        setLoading(false)
        setInspectionAssignmentRequests(data.data);
        setFleetBranchLocation(data?.data[0].fleet_branch_location)
    };

    const handleSuccessBack = (message) => {
        toast.success(message, {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 2000,
        })
        getAssignmentInspectionRequests()
    }

    useEffect(() => {
        getAssignmentInspectionRequests();
    }, []);

    return (
        <div className="assignment-request-container">
            <ToastContainer className="custom-toast-container" />
            <Modal
                aria-labelledby="modal-title"
                aria-describedby="modal-desc"
                open={showTyreAction}
                onClose={() => {
                    // getAssignmentInspectionRequests()
                    setShowTyreAction(false)
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
                    <TyreAction selectedFleet={fleetBranchLocation} assignmentType={assignmentType} handleSuccessBack={handleSuccessBack} selectedAssignment={selectedAssignment} type={selectedType} setShowTyreAction={setShowTyreAction} />
                </Sheet>
            </Modal>

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
                    <UploadedExcelModal inside={true} tyreInspectionAssignmentId={selectedAssignment?.tyre_inspection_assignment_id} />
                </Sheet>
            </Modal>

            <Modal
                aria-labelledby="modal-title"
                aria-describedby="modal-desc"
                open={showTyreActionInvoice}
                onClose={() => {
                    // getAssignmentInspectionRequests()
                    setShowTyreActionInvoice(false)
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
                    <TyreActionInvoice selectedFleet={fleetBranchLocation} assignmentType={assignmentType} handleSuccessBack={handleSuccessBack} selectedAssignment={selectedAssignment} type={selectedType} setShowTyreActionInvoice={setShowTyreActionInvoice} />
                </Sheet>
            </Modal>

            <div className='assignment-request' style={{ height: '100%' }}>
                {inspectionDetailsModal && (
                    <TyreInspectionDetailsModal
                        setInspectionDetailsModal={setInspectionDetailsModal}
                        selectedOption={currentUserName}
                        batchId={batchId}
                    />
                )}
                <div className="head">
                    <h1 className="heading1" style={{ marginBottom: "3px" }}>
                        <FontAwesomeIcon
                            onClick={() => {
                                navigate('/assignment')
                            }}
                            icon={faChevronLeft}
                            color="#65a143"
                            style={{ marginRight: 6, cursor: 'pointer' }}
                        />
                        {fleetBranchLocation}
                    </h1>
                </div>

                <div className='card-container'>
                    {
                        loading ?
                            dummmyArray.map((i) => (
                                <div className="card" onClick={() => { }} style={{ backgroundColor: '#fff' }}>
                                    <div className="card-header">
                                        <div className='card-heading'><Skeleton /></div>
                                        <p style={{ fontSize: '0.85vw', lineHeight: 'auto' }}>Request No : </p>

                                    </div>
                                    <div className='card-line'></div>
                                    <div className='card-content'>
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <h4 style={{ fontWeight: 400 }}>Total Tyres Request : <span style={{ fontWeight: 500 }}></span></h4>
                                            <div className="card-chip">
                                                <div className="chip-test"><Skeleton /></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="table-container">
                                        <table className="request-table">
                                            <thead>
                                                <tr className="table-heading">
                                                    <th>Date</th>
                                                    {currentUser === REGRIP_ROLE_ID && <th>Supplier Name</th>}
                                                    <th>Status</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            {
                                                dummmyArray.map((i) =>
                                                    <tbody style={{ width: '100%' }}>

                                                        <tr className="table-data" key={i}>
                                                            <td><Skeleton style={{ height: '30px' }} /></td>
                                                            <td><Skeleton /></td>
                                                            <td><Skeleton /></td>
                                                            <td><Skeleton /></td>
                                                        </tr>
                                                    </tbody>
                                                )
                                            }
                                        </table>
                                    </div>

                                </div>
                            ))
                            :
                            inspectionAssignmentRequests.map((request, i) => (

                                request.scrap_batch_id ?
                                    <div className="card" style={{ backgroundColor: '#fff' }}>
                                        <div className="card-header">
                                            <div className='field'>
                                                <p style={{ fontSize: '0.9vw', fontWeight: 600 }}>Scrap Request No : </p>
                                                <p style={{ fontSize: '0.9vw', fontWeight: 700 }}>{request.tyre_inspection_assignment_id}</p>
                                                <p>|</p>
                                                <div className="assignment-date">{request.date ? new Date(request.date).toLocaleDateString('en-IN') : null}</div>

                                            </div>
                                            |
                                            <div className='field' style={{ borderRadius: '10px', backgroundColor: 'f1f1f1', padding: '8px 16px', gap: '10px' }}>
                                                <div className="field-request">
                                                    <p style={{ fontSize: '0.9vw', fontWeight: 600 }}>Total Requested Tyres : </p>
                                                    <p style={{ fontSize: '0.9vw', fontWeight: 700 }}> {request.tyre_count}</p>
                                                </div>
                                            </div>
                                            |
                                            <div className='field'>
                                                <p style={{ fontSize: '0.9vw', fontWeight: 600, lineHeight: '23px' }}>Scrap Tyres : </p>
                                                <div className='data' style={{ fontSize: '0.85vw', fontWeight: 700 }}>{request.completed_tyre_count}</div>
                                            </div>
                                            {
                                                request.is_excel && "|"
                                            }
                                            {
                                                request.is_excel &&
                                                <button onClick={() => {
                                                    setSelectedAssignment(request)
                                                    setShowUploadedExcelModal(true)
                                                }} className='download-uploaded-excel'>
                                                    Uploaded Excel
                                                </button>
                                            }
                                            {/* |
                                            <div className='field'>
                                                <button className='field-button' onClick={() => {

                                                    setBatchId(request.inspection_batch_id)
                                                    setInspectionDetailsModal(true)

                                                }}>
                                                    Batch
                                                    <FontAwesomeIcon icon={faEye} />
                                                </button>
                                            </div> */}

                                        </div>
                                        <div className="table-container">
                                            <table className="request-table">
                                                <thead>
                                                    <tr className="table-heading">
                                                        <th>Date</th>
                                                        {currentUser === REGRIP_ROLE_ID && <th>Supplier Name</th>}
                                                        <th>Status</th>
                                                        <th>Action</th>
                                                    </tr>
                                                </thead>

                                                <tbody style={{ width: '100%' }}>

                                                    <tr className="table-data" key={i}>
                                                        <td style={{ borderTopLeftRadius: "20px", borderBottomLeftRadius: "20px" }}>{request.approve_time ? new Date(request.approve_time).toLocaleDateString('en-IN') : null}</td>
                                                        {currentUser === REGRIP_ROLE_ID && <td>{request.supplier_name}</td>}
                                                        <td style={{ width: '400px' }}>
                                                            <div style={{ backgroundColor: '#ceeaef' }} className="status-container">
                                                                <div className='status' style={{ color: '#1b5f6d', fontWeight: 700 }}>Approval:</div>
                                                                <div className='status' style={{ color: '#1b5f6d' }}>Approved
                                                                    <div style={{ backgroundColor: '#286c79' }} className="data">{request.inspection_approval_completed}</div>
                                                                </div>
                                                                <div className='status' style={{ color: '#1b5f6d' }}>Pending
                                                                    <div style={{ backgroundColor: '#286c79' }} className="data">{request.inspection_approval_pending}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            {
                                                                currentUser !== REGRIP_ROLE_ID ?
                                                                    < button className='action-button' onClick={() => {
                                                                        setSelectedType('approve')
                                                                        setSelectedAssignment(request)
                                                                        setAssignmentType('scrap')
                                                                        setShowTyreAction(true)
                                                                    }} style={{ backgroundColor: '#308698' }}>
                                                                        Approve
                                                                    </button>
                                                                    :
                                                                    <button className='action-button' onClick={() => {
                                                                        setSelectedType('approve')
                                                                        setSelectedAssignment(request)
                                                                        setAssignmentType('scrap')
                                                                        setShowTyreAction(true)
                                                                    }} style={{ backgroundColor: '#ceeaef', color: '#308698', border: '0.8px solid #308698' }}>
                                                                        View Approval
                                                                    </button>
                                                            }

                                                        </td>
                                                    </tr>

                                                    <tr className="table-data" key={i}>
                                                        <td style={{ borderTopLeftRadius: "20px", borderBottomLeftRadius: "20px" }}>{request.invoice_time ? new Date(request.invoice_time).toLocaleDateString('en-IN') : null}</td>
                                                        {currentUser === REGRIP_ROLE_ID && <td>{request.supplier_name}</td>}
                                                        <td style={{ width: '400px' }}>
                                                            <div style={{ backgroundColor: '#d2e5ff' }} className="status-container">
                                                                <div className='status' style={{ color: '#428bca', fontWeight: 700 }}>Invoice:</div>
                                                                <div className='status' style={{ color: '#428bca' }}>Uploaded
                                                                    <div style={{ backgroundColor: '#428bca' }} className="data">{request.inspection_invoice_completed}</div>
                                                                </div>
                                                                <div className='status' style={{ color: '#428bca' }}>Pending
                                                                    <div style={{ backgroundColor: '#428bca' }} className="data">{request.inspection_invoice_pending}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            {request.invoice_pending}
                                                        </td>
                                                        <td>
                                                            {
                                                                currentUser !== REGRIP_ROLE_ID ?
                                                                    <button className='action-button' onClick={() => {
                                                                        setSelectedType('invoice')
                                                                        setSelectedAssignment(request)
                                                                        setAssignmentType('scrap')
                                                                        setShowTyreActionInvoice(true)
                                                                    }} style={{ backgroundColor: '#428bca' }}>
                                                                        Upload Invoice
                                                                    </button>
                                                                    :
                                                                    <button className='action-button' onClick={() => {
                                                                        setSelectedType('invoice')
                                                                        setSelectedAssignment(request)
                                                                        setAssignmentType('scrap')
                                                                        setShowTyreActionInvoice(true)
                                                                    }} style={{ backgroundColor: '#d2e5ff', color: '#428bca', border: '0.8px solid #428bca' }}>
                                                                        View Invoice
                                                                    </button>
                                                            }

                                                        </td>
                                                    </tr>

                                                    <tr className="table-data" key={i}>
                                                        <td style={{ borderTopLeftRadius: "20px", borderBottomLeftRadius: "20px" }}>{request.lift_time ? new Date(request.lift_time).toLocaleDateString('en-IN') : null}</td>
                                                        {currentUser === REGRIP_ROLE_ID && <td>{request.supplier_name}</td>}
                                                        <td style={{ width: '400px' }}>
                                                            <div style={{ backgroundColor: '#e4e3f4' }} className="status-container">
                                                                <div className='status' style={{ color: '#928fe5', fontWeight: 700 }}>Pickup:</div>
                                                                <div className='status' style={{ color: '#928fe5' }}>Completed
                                                                    <div style={{ backgroundColor: '#928fe5' }} className="data">{request.inspection_lifting_completed}</div>
                                                                </div>
                                                                <div className='status' style={{ color: '#928fe5' }}>Pending
                                                                    <div style={{ backgroundColor: '#928fe5' }} className="data">{request.inspection_lifting_pending}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            {
                                                                currentUser === REGRIP_ROLE_ID ?
                                                                    <button className='action-button' onClick={() => {
                                                                        setSelectedType('lifting')
                                                                        setSelectedAssignment(request)
                                                                        setAssignmentType('scrap')
                                                                        setShowTyreAction(true)
                                                                    }} style={{ backgroundColor: '#928fe5' }}>
                                                                        Pickup
                                                                    </button> :
                                                                    <button className='action-button' onClick={() => {
                                                                        setSelectedType('lifting')
                                                                        setSelectedAssignment(request)
                                                                        setAssignmentType('scrap')
                                                                        setShowTyreAction(true)
                                                                    }} style={{ backgroundColor: '#e4e3f4', color: '#5651e8', border: '0.8px solid #928fe5' }}>
                                                                        View Pickup
                                                                    </button>
                                                            }

                                                        </td>
                                                    </tr>
                                                </tbody>


                                            </table>
                                        </div>
                                    </div>
                                    :
                                    <div className="card" style={{ backgroundColor: '#fff' }}>

                                        <div className="card-header">
                                            <div className='field'>
                                                <p style={{ fontSize: '0.9vw', fontWeight: 600 }}>Request No : </p>
                                                <p style={{ fontSize: '0.9vw', fontWeight: 700 }}>{request.tyre_inspection_assignment_id}</p>
                                                <p>|</p>
                                                <div className="assignment-date">{request.date ? new Date(request.date).toLocaleDateString('en-IN') : null}</div>
                                            </div>
                                            |
                                            <div className='field' style={{ borderRadius: '10px', backgroundColor: 'f1f1f1', padding: '8px 16px', gap: '10px' }}>
                                                <div className="field-request">
                                                    <p style={{ fontSize: '0.85vw', fontWeight: 600 }}> Total Requested Tyres : </p>
                                                    <p style={{ fontSize: '0.9vw', fontWeight: 700 }}> {request.tyre_count}</p>
                                                </div>
                                                {
                                                    request.is_excel && (
                                                        <>
                                                            |
                                                            <div className="field-request">
                                                                <p style={{ fontSize: '0.85vw', fontWeight: 600 }}>Tyres Matched : </p>
                                                                <p style={{ fontSize: '0.9vw', fontWeight: 700 }}>{request.completed_excel_inspections}</p>
                                                            </div>
                                                        </>
                                                    )
                                                }
                                                {
                                                    request.is_excel && (
                                                        <>
                                                            |
                                                            <div className="field-request">
                                                                <p style={{ fontSize: '0.85vw', fontWeight: 600 }}>Other Stencil Number : </p>
                                                                <p style={{ fontSize: '0.9vw', fontWeight: 700 }}> {request.extra_excel_inspections}</p>
                                                            </div>
                                                        </>
                                                    )
                                                }

                                            </div>
                                            |
                                            <div className='field'>
                                                <p style={{ fontSize: '0.9vw', fontWeight: 600, lineHeight: '23px' }}>Inspected Tyres : </p>
                                                <div className='data' style={{ fontSize: '0.85vw', fontWeight: 700 }}>{request.completed_tyre_count}</div>
                                                {
                                                    Number(request?.tyre_count) > Number(request?.completed_tyre_count) ?
                                                        <div className="card-chip-decreased">
                                                            <div className="chip-text">{Number(request?.tyre_count) - Number(request?.completed_tyre_count)} Less Tyres
                                                            </div>
                                                        </div>
                                                        :
                                                        Number(request?.tyre_count) < Number(request?.completed_tyre_count) ?
                                                            <div className="card-chip-increased">
                                                                <div className="chip-text">{Number(request?.completed_tyre_count) - Number(request?.tyre_count)} More Tyres</div>
                                                            </div>
                                                            :
                                                            ""
                                                }
                                            </div>

                                            {
                                                request.is_excel && "|"
                                            }
                                            {
                                                request.is_excel &&
                                                <button onClick={() => {
                                                    setSelectedAssignment(request)
                                                    setShowUploadedExcelModal(true)
                                                }} className='download-uploaded-excel'>
                                                    Uploaded Excel
                                                </button>
                                            }
                                            |
                                            <div className='field'>
                                                <button className='field-button' onClick={() => {
                                                    setBatchId(request.inspection_batch_id)
                                                    setInspectionDetailsModal(true)
                                                }}>
                                                    Batch
                                                    <FontAwesomeIcon icon={faEye} />
                                                </button>
                                            </div>

                                        </div>
                                        {/* {
                                            request.is_excel &&
                                            <div className="card-header">
                                                <div className='field'>
                                                    <p style={{ fontSize: '0.9vw', fontWeight: 600 }}>Total Tyres Excel : </p>
                                                    <p style={{ fontSize: '0.9vw', fontWeight: 700 }}>{request.total_excel_inspections}</p>
                                                </div>
                                                |
                                                <div className='field'>
                                                    <p style={{ fontSize: '0.9vw', fontWeight: 600 }}>Excel Tyres Matched : </p>
                                                    <p style={{ fontSize: '0.9vw', fontWeight: 700 }}>{request.completed_excel_inspections}</p>
                                                </div>
                                                |
                                                <div className='field'>
                                                    <p style={{ fontSize: '0.9vw', fontWeight: 600 }}>Excel Tyres Mismatched : </p>
                                                    <p style={{ fontSize: '0.9vw', fontWeight: 700 }}>{request.remaining_excel_inspections}</p>
                                                </div>
                                                |
                                                <div className='field'>
                                                    <p style={{ fontSize: '0.9vw', fontWeight: 600 }}>Tyres Other Than Excel : </p>
                                                    <p style={{ fontSize: '0.9vw', fontWeight: 700 }}>{request.extra_excel_inspections}</p>
                                                </div>





                                            </div>
                                        } */}

                                        <div className="table-container">
                                            <table className="request-table">
                                                <thead>
                                                    <tr className="table-heading">
                                                        <th>Date</th>
                                                        {currentUser === REGRIP_ROLE_ID && <th>Supplier Name</th>}
                                                        <th>Status</th>
                                                        <th>Action</th>
                                                    </tr>
                                                </thead>

                                                <tbody style={{ width: '100%' }}>

                                                    <tr className="table-data" key={i}>
                                                        <td style={{ borderTopLeftRadius: "20px", borderBottomLeftRadius: "20px" }}>{request.approve_time ? new Date(request.approve_time).toLocaleDateString('en-IN') : null}</td>
                                                        {currentUser === REGRIP_ROLE_ID && <td>{request.supplier_name}</td>}
                                                        <td style={{ width: '400px' }}>
                                                            <div style={{ backgroundColor: '#ceeaef' }} className="status-container">
                                                                <div className='status' style={{ color: '#1b5f6d', fontWeight: 700 }}>Approval:</div>
                                                                <div className='status' style={{ color: '#1b5f6d' }}>Approved
                                                                    <div style={{ backgroundColor: '#286c79' }} className="data">{request.inspection_approval_completed}</div>
                                                                </div>
                                                                <div className='status' style={{ color: '#1b5f6d' }}>Pending
                                                                    <div style={{ backgroundColor: '#286c79' }} className="data">{request.inspection_approval_pending}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            {
                                                                currentUser !== REGRIP_ROLE_ID ?
                                                                    < button className='action-button' onClick={() => {
                                                                        setSelectedType('approve')
                                                                        setSelectedAssignment(request)
                                                                        setAssignmentType('inspection')
                                                                        setShowTyreAction(true)
                                                                    }} style={{ backgroundColor: '#308698' }}>
                                                                        Approve
                                                                    </button>
                                                                    :
                                                                    <button className='action-button' onClick={() => {
                                                                        setSelectedType('approve')
                                                                        setSelectedAssignment(request)
                                                                        setAssignmentType('inspection')
                                                                        setShowTyreAction(true)
                                                                    }} style={{ backgroundColor: '#ceeaef', color: '#308698', border: '0.8px solid #308698' }}>
                                                                        View Approval
                                                                    </button>
                                                            }

                                                        </td>
                                                    </tr>

                                                    <tr className="table-data" key={i}>
                                                        <td style={{ borderTopLeftRadius: "20px", borderBottomLeftRadius: "20px" }}>{request.invoice_time ? new Date(request.invoice_time).toLocaleDateString('en-IN') : null}</td>
                                                        {currentUser === REGRIP_ROLE_ID && <td>{request.supplier_name}</td>}
                                                        <td style={{ width: '400px' }}>
                                                            <div style={{ backgroundColor: '#d2e5ff' }} className="status-container">
                                                                <div className='status' style={{ color: '#428bca', fontWeight: 700 }}>Invoice:</div>
                                                                <div className='status' style={{ color: '#428bca' }}>Uploaded
                                                                    <div style={{ backgroundColor: '#428bca' }} className="data">{request.inspection_invoice_completed}</div>
                                                                </div>
                                                                <div className='status' style={{ color: '#428bca' }}>Pending
                                                                    <div style={{ backgroundColor: '#428bca' }} className="data">{request.inspection_invoice_pending}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            {request.invoice_pending}
                                                        </td>
                                                        <td>
                                                            {
                                                                currentUser !== REGRIP_ROLE_ID ?
                                                                    <button className='action-button' onClick={() => {
                                                                        setSelectedType('invoice')
                                                                        setSelectedAssignment(request)
                                                                        setAssignmentType('inspection')
                                                                        setShowTyreActionInvoice(true)
                                                                    }} style={{ backgroundColor: '#428bca' }}>
                                                                        Upload Invoice
                                                                    </button>
                                                                    :
                                                                    <button className='action-button' onClick={() => {
                                                                        setSelectedType('invoice')
                                                                        setSelectedAssignment(request)
                                                                        setAssignmentType('inspection')
                                                                        setShowTyreActionInvoice(true)
                                                                    }} style={{ backgroundColor: '#d2e5ff', color: '#428bca', border: '0.8px solid #428bca' }}>
                                                                        View Invoice
                                                                    </button>
                                                            }

                                                        </td>
                                                    </tr>

                                                    <tr className="table-data" key={i}>
                                                        <td style={{ borderTopLeftRadius: "20px", borderBottomLeftRadius: "20px" }}>{request.lift_time ? new Date(request.lift_time).toLocaleDateString('en-IN') : null}</td>
                                                        {currentUser === REGRIP_ROLE_ID && <td>{request.supplier_name}</td>}
                                                        <td style={{ width: '400px' }}>
                                                            <div style={{ backgroundColor: '#e4e3f4' }} className="status-container">
                                                                <div className='status' style={{ color: '#928fe5', fontWeight: 700 }}>Pickup:</div>
                                                                <div className='status' style={{ color: '#928fe5' }}>Completed
                                                                    <div style={{ backgroundColor: '#928fe5' }} className="data">{request.inspection_lifting_completed}</div>
                                                                </div>
                                                                <div className='status' style={{ color: '#928fe5' }}>Pending
                                                                    <div style={{ backgroundColor: '#928fe5' }} className="data">{request.inspection_lifting_pending}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            {
                                                                currentUser === REGRIP_ROLE_ID ?
                                                                    <button className='action-button' onClick={() => {
                                                                        setSelectedType('lifting')
                                                                        setSelectedAssignment(request)
                                                                        setAssignmentType('inspection')
                                                                        setShowTyreAction(true)
                                                                    }} style={{ backgroundColor: '#928fe5' }}>
                                                                        Pickup
                                                                    </button> :
                                                                    <button className='action-button' onClick={() => {
                                                                        setSelectedType('lifting')
                                                                        setSelectedAssignment(request)
                                                                        setAssignmentType('inspection')
                                                                        setShowTyreAction(true)
                                                                    }} style={{ backgroundColor: '#e4e3f4', color: '#5651e8', border: '0.8px solid #928fe5' }}>
                                                                        View Pickup
                                                                    </button>
                                                            }

                                                        </td>
                                                    </tr>
                                                </tbody>


                                            </table>
                                        </div>
                                    </div>
                            ))

                    }

                </div>
            </div>

        </div >
    )
}

export default AssignmentRequest
