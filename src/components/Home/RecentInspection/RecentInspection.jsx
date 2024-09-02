import { useEffect, useState } from 'react'
import './RecentInspection.css'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import axios from 'axios'
import { API_URL } from '../../Config'
import { useSelector } from 'react-redux'
import nodata from '../../../lotties/nodata1.json';
import { Controls, Player } from '@lottiefiles/react-lottie-player'
import { useNavigate } from "react-router-dom";
import { REGRIP_ROLE_ID } from '../../../redux/constants/Constant'
import GenerateRequestExcel from '../GenerateRequestExcel/GenerateRequestExcel'
import UploadedExcelModal from '../../Assignment/UploadedExcelModal/UploadedExcelModal'
import Modal from '@mui/joy/Modal';
import ModalClose from '@mui/joy/ModalClose';
import Sheet from '@mui/joy/Sheet';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileExcel } from '@fortawesome/free-solid-svg-icons'

const RecentInspection = () => {
    const currentUser = useSelector((state) => state.getCurrentUser.role_name);
    const currentUserId = useSelector((state) => state.getCurrentUser.role_id);
    const dummmyArray = [1, 2, 3, 4, 5]
    const [loading, setLoading] = useState(true)
    const [recentInspections, setRecentInspections] = useState([])
    const [assignmentModal, setAssignmentModal] = useState(false)
    const [selectedInspectionAssignment, setSelectedInspectionAssignment] = useState()

    const [showUploadedExcelModal, setShowUploadedExcelModal] = useState(false);

    const navigate = useNavigate();

    const handlePopupClose = () => {
        setRecentInspections();
    }

    const getRecentInspection = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) navigate("/");
            const bearer_token = "bearer " + JSON.parse(token);

            setLoading(true)
            const { data } = await axios.get(`${API_URL}/inspection-assignments`, {
                headers: {
                    Authorization: bearer_token,
                },
                params: {
                    status: "completed"
                }
            });
            // const fleets = data.rows;
            setLoading(false);
            setRecentInspections(data.data)
        }
        catch (e) {
            console.log("Error while fetching data:", e.message)
        }
    }
    useEffect(() => {

        getRecentInspection()
    }, [])
    return (
        <div className='recent-inspection'>
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
            <h2>Recent Requests</h2>
            <div className="table-container">
                <table className="recent-inspection-table">
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
                    <tbody>
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
                                recentInspections.map((inspection, i) => {
                                    const {
                                        is_excel,
                                        assigned_employee_id,
                                        supplier_brand_name,
                                        fleet_name,
                                        fleet_branch_name,
                                        tyre_count,
                                        date,
                                        status,
                                        tyre_inspection_assignment_id
                                    } = inspection;
                                    const formattedDate = new Date(date).toLocaleDateString('en-GB');

                                    return (
                                        <tr className="table-data" key={i}>
                                            {/* <td>{i + 1}</td> */}
                                            <td style={{ borderTopLeftRadius: "20px", borderBottomLeftRadius: "20px", textAlign: 'right' }}>
                                                {
                                                    is_excel &&
                                                    <FontAwesomeIcon onClick={() => {
                                                        setSelectedInspectionAssignment(inspection)
                                                        setShowUploadedExcelModal(true)
                                                    }} icon={faFileExcel} style={{ cursor: 'pointer' }} />
                                                }
                                            </td>
                                            <td>{assigned_employee_id ? "Inspection" : "Scrap"}</td>
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
                                            <td style={{ borderTopRightRadius: "20px", borderBottomRightRadius: "20px" }} >Lifting Done</td>
                                        </tr>
                                    )
                                })}
                    </tbody>
                </table>
                {
                    recentInspections.length === 0 && !loading &&
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

export default RecentInspection