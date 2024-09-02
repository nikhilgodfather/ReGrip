import './TyreAction.css'
import axios from 'axios';
import { useEffect, useState } from 'react';
import { API_URL } from '../../Config';
import { useSelector } from "react-redux";
import { REGRIP_ROLE_ID } from '../../../redux/constants/Constant';
import { Button, Checkbox, ToggleButtonGroup } from '@mui/joy';
import searchIcon from '../../../assets/icon.png'
import { Controls, Player } from '@lottiefiles/react-lottie-player';
import loadingTyre from '../../../lotties/loadingTyre.json'
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ModalClose from '@mui/joy/ModalClose';
import Sheet from '@mui/joy/Sheet';
import Modal from '@mui/joy/Modal';
import TyreCountModal from '../TyreCountModal/TyreCountModal';
import nodata from '../../../lotties/nodata1.json';
import AssignmentTyresExcel from '../AssignmentTyresExcel/AssignmentTyresExcel';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';


const TyreAction = ({ assignmentType, handleSuccessBack, selectedAssignment, type, setShowTyreAction, selectedFleet }) => {

    const [tyres, setTyres] = useState([])
    const [filteredTyres, setFilteredTyres] = useState([]);

    const currentUser = useSelector(state => state.getCurrentUser.role_id)


    const [loading, setLoading] = useState(true);
    const [searchedOption, setSearchedOption] = useState("");
    const [selectedTyres, setSelectedTyres] = useState([]);
    const [tyreCount, setTyreCount] = useState();
    const [selectAllChecked, setSelectAllChecked] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState('pending');
    const [showTyreCountModal, setShowTyreCountModal] = useState(false)
    const [maxCount, setMaxCount] = useState()

    // new 
    const [checkedData, setCheckedData] = useState([]);
    const [approveCheckedAll, setApproveCheckedAll] = useState(false);


    const handleChangeApprove = (event, tyreData) => {
        const isChecked = event.target.checked;

        if (isChecked) {
            setCheckedData(prevData => [...prevData, tyreData]);
            if (checkedData.length + 1 === filteredTyres.length) {
                setApproveCheckedAll(true);
            }
        } else {
            setCheckedData(prevData => prevData.filter(data => data !== tyreData));
            setApproveCheckedAll(false);
        }
    };

    const handleChangeApproveAll = (event) => {
        const isChecked = event.target.checked;

        setApproveCheckedAll(isChecked);
        if (isChecked) {
            const allTyreData = filteredTyres.map(tyre => tyre);
            setCheckedData(allTyreData);
        } else {
            setCheckedData([]);
        }
    };


    // new

    const handleCheckboxChange = (event, tyreInspectionId) => {
        let isChecked = event.target.checked

        if (isChecked) {
            setSelectedTyres((prevSelectedIds) => [...prevSelectedIds, tyreInspectionId]);
        }
        else {
            setSelectedTyres((prevSelectedIds) =>
                prevSelectedIds.filter((id) => id !== tyreInspectionId)
            );
        }
    }

    const handleSelectAllChange = (event) => {
        const isChecked = event.target.checked;

        setSelectAllChecked(isChecked);

        if (isChecked) {
            const allInspectionIds = tyres.map((tyre) => tyre.tyre_inspection_id);
            setSelectedTyres(allInspectionIds);
        } else {
            setSelectedTyres([]);
        }
    };

    const handleSubmit = async () => {
        try {
            if (checkedData.length === 0) {
                return;
            }
            if (Number(checkedData.length) !== Number(tyreCount)) {
                toast.error(`Please add exactly ${tyreCount} number of tyres`, {
                    position: toast.POSITION.TOP_CENTER,
                    autoClose: 2000,
                })
                return;
            }
            const token = localStorage.getItem("token");
            // if (!token) navigate("/");
            setLoading(true)
            const tyreInspectionIds = checkedData.map(obj => obj.tyre_inspection_id);

            const data = {
                type: type,
                ids: tyreInspectionIds,
                tyre_count: tyreInspectionIds.length,
                assignment_type: assignmentType
            }
            const bearer_token = "bearer " + JSON.parse(token);
            const result = await axios.patch(`${API_URL}/inspection-assignments/change-inspection-status`, data, {
                headers: {
                    Authorization: bearer_token,
                }
            });
            setLoading(false)

            if (type === 'lifting') {
                if (currentUser === REGRIP_ROLE_ID) {
                    getAssignmentPendingTyres();
                }
                else {
                    getAssignmentAllTyres();
                }
            }
            else {
                if (currentUser === REGRIP_ROLE_ID) {
                    getAssignmentAllTyres();
                }
                else {
                    getAssignmentPendingTyres();
                }
            }
            setCheckedData([])
            setShowTyreAction(false)
            handleSuccessBack("Successfully Updated Tyres Status")
        }
        catch (e) {
            toast.error(`Error:${e.message}`, {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 2000,
            })
            setLoading(false)
        }
    }

    const getAssignmentAllTyres = async () => {
        try {
            const token = localStorage.getItem("token");
            // if (!token) navigate("/");
            setLoading(true)
            const bearer_token = "bearer " + JSON.parse(token);
            const { data } = await axios.get(`${API_URL}/inspection-assignments/inspection-status`, {
                headers: {
                    Authorization: bearer_token,
                },
                params: {
                    type: type,
                    status: selectedStatus,
                    request_id: selectedAssignment?.tyre_inspection_assignment_id
                }
            });
            setLoading(false)
            setTyres(data.data);
            setFilteredTyres(data.data);
            if (selectedStatus === 'pending') {
                setMaxCount(data.data.length)
            }
            ((currentUser === REGRIP_ROLE_ID && type === 'lifting') || (currentUser !== REGRIP_ROLE_ID && type !== 'lifting')) && selectedStatus === 'pending' && data.data.length > 0 && !tyreCount && setShowTyreCountModal(true)
        }
        catch (e) {
            console.log("Error:", e.message)
            setLoading(false)
        }
    };

    const getAssignmentPendingTyres = async () => {
        try {
            const token = localStorage.getItem("token");
            // if (!token) navigate("/");
            setLoading(true)
            const bearer_token = "bearer " + JSON.parse(token);
            const { data } = await axios.get(`${API_URL}/inspection-assignments/pending-requests`, {
                headers: {
                    Authorization: bearer_token,
                },
                params: {
                    type: type,
                    request_id: selectedAssignment?.tyre_inspection_assignment_id
                }
            });
            setLoading(false)
            setTyres(data.data);
            setFilteredTyres(data.data);
            ((currentUser === REGRIP_ROLE_ID && type === 'lifting') || (currentUser !== REGRIP_ROLE_ID && type !== 'lifting')) && data.data.length > 0 && setShowTyreCountModal(true)
        }
        catch (e) {
            console.log("Error:", e.message)
            setLoading(false)
        }
    };

    const handleSearchChange = (event) => {
        const newSearchTerm = event.target.value;
        setSearchedOption(newSearchTerm);

        // Filter tyres based on the new search term
        const newFilteredTyres = tyres.filter((tyre) =>
            tyre.tyre_serial_number.toLowerCase().includes(newSearchTerm.toLowerCase())
        );
        setFilteredTyres(newFilteredTyres);
    };

    useEffect(() => {

        // if (type === 'lifting') {
        //     if (currentUser === REGRIP_ROLE_ID) {
        //         getAssignmentPendingTyres();
        //     }
        //     else {
        //         getAssignmentAllTyres();
        //     }
        // }
        // else {
        //     if (currentUser === REGRIP_ROLE_ID) {
        //         getAssignmentAllTyres();
        //     }
        //     else {
        //         getAssignmentPendingTyres();
        //     }
        // }
        getAssignmentAllTyres();

    }, [selectedStatus]);

    return (
        <div className="tyre-action-container">
            <ToastContainer className="custom-toast-container" />


            <Modal
                aria-labelledby="modal-title"
                aria-describedby="modal-desc"
                open={showTyreCountModal}
                onClose={() => {
                    setShowTyreCountModal(false)
                    setShowTyreAction(false)
                }}
                sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
            >
                <Sheet
                    variant="plain"
                    sx={{
                        width: "320px",
                        height: "fit-content",
                        borderRadius: 'md',
                        p: 3,
                        boxShadow: 'lg',
                        position: "relative"
                    }}
                >
                    <ModalClose variant="plain" sx={{ m: -1 }} />
                    <TyreCountModal maxTyres={maxCount} setShowTyreCountModal={setShowTyreCountModal} type={type} tyreCount={tyreCount} setTyreCount={setTyreCount} />
                </Sheet>
            </Modal>

            {
                loading ?
                    <div className='tyre-loader'>
                        <Player
                            autoplay
                            loop={true}
                            keepLastFrame={true}
                            src={loadingTyre}
                            style={{ width: '60%', margin: 'auto' }}
                        >
                            <Controls buttons={['repeat', 'frame', 'debug']} />
                        </Player>
                    </div>
                    :
                    <div className='tyre-action' style={{ height: '100%' }}>
                        <div className="head">
                            <h1 className="heading" style={{ marginBottom: "3px" }}>
                                {
                                    type === 'approve' ? "Approve" :
                                        type === 'invoice' ? "Invoice" : "Pick-Up"
                                }
                            </h1>
                            <div className='search-container' style={{ margin: '0px 20px 20px auto', width: '50%' }}>
                                <input
                                    type="text"
                                    placeholder="Enter tyre serial no."
                                    value={searchedOption}
                                    onChange={handleSearchChange}

                                />
                                <div className='search-btn' >
                                    <span style={{ marginBottom: 3 }}>Search</span>
                                    <img src={searchIcon} alt="Description" style={{ width: '10px', height: '10px' }} />
                                </div>
                            </div>
                        </div>

                        <div className="info">
                            <div className="info-box">
                                <div className="text">
                                    Request No :
                                    <span style={{ fontWeight: 700, fontSize: '0.9vw', marginLeft: 4 }} className='text'>{selectedAssignment?.tyre_inspection_assignment_id}</span>
                                </div>
                                <div className="text">
                                    Supplier Name :
                                    <span style={{ fontWeight: 700, fontSize: '0.9vw', marginLeft: 4 }} className='text'> {selectedAssignment?.supplier_name}</span>
                                </div>
                                <div className="text">
                                    Tyre count :
                                    <span style={{ fontWeight: 700, fontSize: '0.9vw', marginLeft: 4 }} className='text'> {selectedAssignment?.tyre_count}</span>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '15px', marginLeft: 'auto' }}>
                                {
                                    ((currentUser === REGRIP_ROLE_ID && type === 'lifting') || (currentUser !== REGRIP_ROLE_ID && type !== 'lifting')) && tyreCount && selectedStatus === 'pending' &&
                                    <div className="count">
                                        {checkedData?.length} / {tyreCount}
                                    </div>
                                }
                                {
                                    // ((currentUser === REGRIP_ROLE_ID && type !== 'lifting') || (currentUser !== REGRIP_ROLE_ID && type === 'lifting')) &&
                                    <ToggleButtonGroup
                                        className="toggle"
                                        // size={value || undefined}
                                        value={selectedStatus}
                                        onChange={(event, newValue) => {
                                            setSelectedStatus(newValue);
                                            setApproveCheckedAll(false)
                                            setCheckedData([])
                                        }}
                                    >
                                        <Button value="all">All</Button>
                                        {
                                            type === 'approve' ? <Button value="approved">Approved</Button> :
                                                <Button value="approved">Lifted</Button>
                                        }
                                        <Button value="pending">Pending</Button>
                                    </ToggleButtonGroup>
                                }
                            </div>




                        </div>

                        {
                            filteredTyres.length !== 0 && !loading &&
                            <div className="table-container">
                                <table className="request-table">
                                    <thead>
                                        <tr className="table-heading">
                                            {/* {
                                                ((currentUser === REGRIP_ROLE_ID && type === 'lifting') || (currentUser !== REGRIP_ROLE_ID && type !== 'lifting')) && selectedStatus === 'pending' &&
                                                <th>
                                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                        <Checkbox style={{ height: 'auto' }} onChange={(event) => {
                                                            !loading && handleSelectAllChange(event)
                                                        }} />
                                                    </div>

                                                </th>
                                            } */}
                                            {/* {
                                            ((currentUser === REGRIP_ROLE_ID && type === 'approve') || (currentUser !== REGRIP_ROLE_ID && type !== 'approve')) &&
                                            <th>
                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <Checkbox checked={approveCheckedAll === false ? false : true} style={{ height: 'auto' }} onChange={(event) => {
                                                        !loading && handleChangeApproveAll(event)
                                                    }} />
                                                </div>

                                            </th>
                                        } */}
                                            <th>Tyre Serial Number</th>
                                            <th>Construction Type</th>
                                            <th>Size</th>
                                            <th className='tyre-status'> Status </th>
                                            <th style={{ textAlign: 'right' }}>

                                                <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10, width: 'fit-content' }}>
                                                    {
                                                        tyres.length > 0 && ((currentUser === REGRIP_ROLE_ID && type === 'lifting') || (currentUser !== REGRIP_ROLE_ID && type !== 'lifting')) && selectedStatus === 'pending' &&
                                                        <button className="submit-button" onClick={() => handleSubmit()}>
                                                            {
                                                                type === 'approve' ?
                                                                    "Approve" : type === 'invoice' ?
                                                                        "Invoice" : "Pick Up"
                                                            }
                                                        </button>
                                                    }

                                                    {
                                                        checkedData.length > 0 ?
                                                            <AssignmentTyresExcel checkedData={checkedData} selectedFleetName={selectedFleet} />
                                                            :
                                                            <button className='apply-button'>
                                                                <p> Download </p>
                                                            </button>
                                                    }
                                                    <Checkbox checked={approveCheckedAll === false ? false : true} style={{ height: 'auto' }} onChange={(event) => {
                                                        !loading && handleChangeApproveAll(event)
                                                    }} />
                                                </div>

                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody style={{ width: '100%' }}>
                                        {
                                            filteredTyres?.map((tyre, i) => (
                                                <tr className="table-data" >
                                                    {/* {
                                                        ((currentUser === REGRIP_ROLE_ID && type === 'lifting') || (currentUser !== REGRIP_ROLE_ID && type !== 'lifting')) && selectedStatus === 'pending' &&
                                                        <td style={{ borderTopLeftRadius: "20px", borderBottomLeftRadius: "20px" }}>
                                                            <Checkbox
                                                                checked={selectedTyres.includes(tyre.tyre_inspection_id)}
                                                                onChange={(event) => {
                                                                    handleCheckboxChange(event, tyre.tyre_inspection_id)
                                                                }} />
                                                        </td>
                                                    } */}

                                                    {/* {
                                                    ((currentUser === REGRIP_ROLE_ID && type === 'approve') || (currentUser !== REGRIP_ROLE_ID && type !== 'approve')) &&
                                                    <td>
                                                        <Checkbox
                                                            checked={checkedData.includes(tyre)}
                                                            onChange={(event) => handleChangeApprove(event, tyre)}
                                                        />
                                                    </td>
                                                } */}

                                                    <td>{tyre.tyre_serial_number}</td>
                                                    <td style={{ width: '400px' }}>{tyre.tyre_construction_type}
                                                    </td>
                                                    <td> {tyre.tyre_size}</td>
                                                    {
                                                        (type === 'approve') &&
                                                        <td>
                                                            {
                                                                tyre.is_approved ?
                                                                    <div className={`status-chip-approved`}>
                                                                        Approved
                                                                    </div>
                                                                    :
                                                                    <div className={`status-chip-pending`}>
                                                                        Pending
                                                                    </div>
                                                            }
                                                        </td>
                                                    }
                                                    {
                                                        (type === 'lifting') &&
                                                        <td>
                                                            {
                                                                tyre.is_lifted ?
                                                                    <div className={`status-chip-approved`}>
                                                                        Lifting Done
                                                                    </div>
                                                                    :
                                                                    <div className={`status-chip-pending`}>
                                                                        Pending
                                                                    </div>
                                                            }
                                                        </td>
                                                    }
                                                    <td style={{ textAlign: 'right' }}>
                                                        <Checkbox
                                                            checked={checkedData.includes(tyre)}
                                                            onChange={(event) => handleChangeApprove(event, tyre)}
                                                        />
                                                    </td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </table>

                            </div>
                        }
                        {
                            filteredTyres.length === 0 && !loading &&
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
                        {/* {
                            tyres.length > 0 && ((currentUser === REGRIP_ROLE_ID && type === 'lifting') || (currentUser !== REGRIP_ROLE_ID && type !== 'lifting')) && selectedStatus === 'pending' &&
                            <button className="submit-button" onClick={() => handleSubmit()}>
                                {
                                    type === 'approve' ?
                                        "Approve" : type === 'invoice' ?
                                            "Invoice" : "Pick Up"
                                }
                            </button>
                        } */}
                    </div>
            }
        </div >
    )
}
export default TyreAction
