// import './TyreAction.css'
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
import UploadInvoiceModal from './UploadInvoiceModal/UploadInvoiceModal';
import './TyreActionInvoice.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faFileArrowDown } from '@fortawesome/free-solid-svg-icons';
import nodata from '../../../lotties/nodata1.json';
import InvoiceTyresExcel from '../TyreInvoiceExcel/TyreInvoiceExcel';
import InitiateLiftingTyreModal from '../InitiateLiftingTyreModal/InitiateLiftingTyreModal';
import AssignmentTyresExcel from '../AssignmentTyresExcel/AssignmentTyresExcel';

const TyreActionInvoice = ({ assignmentType, handleSuccessBack, selectedAssignment, type, setShowTyreActionInvoice, selectedFleet }) => {
    const [pendingTyres, setPendingTyres] = useState([])
    const [invoicedTyres, setInvoicedTyres] = useState([])
    // const [filteredTyres, setFilteredTyres] = useState([]);

    const currentUser = useSelector(state => state.getCurrentUser.role_id)
    const [loading, setLoading] = useState(true);
    const [selectedTyres, setSelectedTyres] = useState([]);
    const [tyreCount, setTyreCount] = useState();
    const [selectAllChecked, setSelectAllChecked] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState('pending');

    const [showTyreCountModal, setShowTyreCountModal] = useState(false)
    const [showUploadInvoiceModal, setShowUploadInvoiceModal] = useState(false)

    //new
    const [checkedData, setCheckedData] = useState([]);
    const [invoiceSelectAll, setInvoiceSelectAll] = useState(false);

    const [showInitiateLiftingModal, setShowInitiateLiftingModal] = useState(false)
    const [showInitiateLiftingTyreModal, setShowInitiateLiftingTyreModal] = useState(false)
    const [selectedLiftingStatus, setSelectedLiftingStatus] = useState('all');

    const handleNestedSuccessBack = (message) => {
        setShowInitiateLiftingTyreModal(false)
        toast.success(message, {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 2000,
        })
        getAssignmentAllTyres();
    }

    const handleChangeInvoice = (event, tyreData) => {
        const isChecked = event.target.checked;

        if (isChecked) {
            setCheckedData(prevData => [...prevData, tyreData]);
            const allTyreDataLength = [
                ...invoicedTyres.reduce((accumulator, group) => {
                    accumulator.push(...group.inspections);
                    return accumulator;
                }, []),
                ...pendingTyres
            ].length;
            if (checkedData.length + 1 === allTyreDataLength) {
                setInvoiceSelectAll(true);
            }
        } else {
            setCheckedData(prevData => prevData.filter(data => data !== tyreData));
            setInvoiceSelectAll(false);
        }
    };

    const handleClickInitiateLifting = () => {
        if (pendingTyres.length !== 0) {
            setShowInitiateLiftingModal(true)
        }
        else {
            setShowInitiateLiftingTyreModal(true)
            setSelectedLiftingStatus('all')
        }

    }

    const handleChangeInvoiceAll = (event) => {
        const isChecked = event.target.checked;
        console.log()

        setInvoiceSelectAll(isChecked);
        if (isChecked && selectedStatus === 'pending') {
            setCheckedData(pendingTyres);
        }
        else if (isChecked && selectedStatus === 'invoiced') {
            const allTyreData = [
                ...invoicedTyres.reduce((accumulator, group) => {
                    accumulator.push(...group.inspections);
                    return accumulator;
                }, [])
            ];
            setCheckedData(allTyreData);
        }

        else if (isChecked) {
            const allTyreData = [
                ...invoicedTyres.reduce((accumulator, group) => {
                    accumulator.push(...group.inspections);
                    return accumulator;
                }, []),
                ...pendingTyres
            ];
            setCheckedData(allTyreData);
        }
        else {
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
            const allInspectionIds = pendingTyres.map((tyre) => tyre.tyre_inspection_id);
            setSelectedTyres(allInspectionIds);
        } else {
            setSelectedTyres([]);
        }
    };

    const handleInvoiceButton = () => {
        if (Number(checkedData.length) !== Number(tyreCount)) {
            toast.error(`Please select exactly ${tyreCount} number of tyres`, {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 2000,
            })
            return;
        }
        checkedData?.length > 0 && setShowUploadInvoiceModal(true)
    }

    const handleSubmit = async (key) => {
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
                invoice_link: key,
                assignment_type: assignmentType
            }
            const bearer_token = "bearer " + JSON.parse(token);
            const result = await axios.patch(`${API_URL}/inspection-assignments/change-inspection-status`, data, {
                headers: {
                    Authorization: bearer_token,
                }
            });
            setLoading(false)

            if (currentUser !== REGRIP_ROLE_ID) {
                getAssignmentPendingTyres();
            }
            else {
                getAssignmentAllTyres();
            }
            setCheckedData([])
            setShowTyreActionInvoice(false)
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
                    status: 'all',
                    request_id: selectedAssignment?.tyre_inspection_assignment_id
                }
            });
            setLoading(false)
            setInvoicedTyres(data.data.approved);
            setPendingTyres(data.data.pending);

            currentUser !== REGRIP_ROLE_ID && data.data.pending.length > 0 && setShowTyreCountModal(true)
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
            setPendingTyres(data.data);
            currentUser !== REGRIP_ROLE_ID && data.data.length > 0 && setShowTyreCountModal(true)
        }
        catch (e) {
            console.log("Error:", e.message)
            setLoading(false)
        }
    };

    // const handleSearchChange = (event) => {
    //     const newSearchTerm = event.target.value;
    //     setSearchedOption(newSearchTerm);

    //     // Filter tyres based on the new search term
    //     const newFilteredTyres = tyres.filter((tyre) =>
    //         tyre.tyre_serial_number.toLowerCase().includes(newSearchTerm.toLowerCase())
    //     );
    //     setFilteredTyres(newFilteredTyres);
    // };

    const downloadInvoice = async (key) => {
        try {
            if (!key) {
                return;
            }
            const result = await axios.get(`${API_URL}/upload/readinvoiceurl?invoicekey=${key}`, {
                responseType: 'blob' // Ensure response type is blob
            });

            // Create a blob URL for the PDF content
            const blobUrl = window.URL.createObjectURL(new Blob([result.data], { type: 'application/pdf' }));

            // Create a temporary anchor element
            const downloadLink = document.createElement('a');
            downloadLink.href = blobUrl;
            downloadLink.setAttribute('download', 'invoice.pdf'); // Set download attribute
            document.body.appendChild(downloadLink);

            // Simulate a click on the anchor element
            downloadLink.click();

            // Clean up: Remove the anchor element and revoke the blob URL
            downloadLink.parentNode.removeChild(downloadLink);
            window.URL.revokeObjectURL(blobUrl);
        } catch (e) {
            console.log("Error:", e.message);
        }
    }


    useEffect(() => {

        // if (currentUser === REGRIP_ROLE_ID) {
        //     getAssignmentAllTyres();
        // }
        // else {
        //     getAssignmentPendingTyres();
        // }

        getAssignmentAllTyres();
    }, []);

    return (
        <div className="tyre-action-container">
            {console.log(checkedData)}
            <ToastContainer className="custom-toast-container" />
            <Modal
                aria-labelledby="modal-title"
                aria-describedby="modal-desc"
                open={showTyreCountModal}
                onClose={() => {
                    setShowTyreCountModal(false)
                    setShowTyreActionInvoice(false)
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
                    <TyreCountModal maxTyres={pendingTyres?.length} setShowTyreCountModal={setShowTyreCountModal} type={type} tyreCount={tyreCount} setTyreCount={setTyreCount} />
                </Sheet>
            </Modal>

            <Modal
                aria-labelledby="modal-title"
                aria-describedby="modal-desc"
                open={showUploadInvoiceModal}
                onClose={() => {
                    setShowUploadInvoiceModal(false)
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
                    <UploadInvoiceModal handleSubmit={handleSubmit} setShowUploadInvoiceModal={setShowUploadInvoiceModal} />
                </Sheet>
            </Modal>

            <Modal
                aria-labelledby="modal-title"
                aria-describedby="modal-desc"
                open={showInitiateLiftingModal}
                onClose={() => setShowInitiateLiftingModal(false)}
                sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
            >
                <Sheet
                    variant="plain"
                    sx={{
                        width: "400px",
                        height: "fit-content",
                        borderRadius: 'md',
                        p: 3,
                        boxShadow: 'lg',
                        position: "relative"
                    }}
                >
                    <ModalClose variant="plain" sx={{ m: 0 }} />
                    <div className='confirmation-modal'>
                        <div style={{ height: 'fit-content' }}>
                            <h3 style={{ fontSize: 20, color: 'grey' }}>Initiate Lifting</h3>
                        </div>
                        <div className='confirmation-content'>
                            <p>Please select the tire you wish to initiate lifting for.</p>
                            <div className="confirmation-button-container" onClick={() => setShowInitiateLiftingModal(false)}>
                                <button className="header-button" onClick={() => {
                                    setShowInitiateLiftingTyreModal(true)
                                    setSelectedLiftingStatus('all')
                                }}>
                                    All Tyres
                                </button>
                                <button className="header-button" onClick={() => {
                                    setShowInitiateLiftingTyreModal(true)
                                    setSelectedLiftingStatus('invoiced')
                                }}>
                                    Invoiced Tyres
                                </button>
                            </div>

                        </div>
                    </div>

                </Sheet>
            </Modal>

            <Modal
                aria-labelledby="modal-title"
                aria-describedby="modal-desc"
                open={showInitiateLiftingTyreModal}
                onClose={() => {
                    setShowInitiateLiftingTyreModal(false)
                }}
                sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
            >
                <Sheet
                    variant="plain"
                    sx={{
                        width: "70%",
                        height: "70%",
                        borderRadius: 'md',
                        p: 3,
                        boxShadow: 'lg',
                        position: "relative"
                    }}
                >
                    <ModalClose variant="plain" sx={{ m: -1 }} />
                    <InitiateLiftingTyreModal handleSubmit={handleSubmit} selectedStatus={selectedLiftingStatus} setShowInitiateLiftingTyreModal={setShowInitiateLiftingTyreModal} handleSuccessBack={handleNestedSuccessBack} selectedAssignment={selectedAssignment} />
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
                                Invoice
                            </h1>
                            {/* <div className='search-container' style={{ margin: '0px 20px 20px auto', width: '50%' }}>
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
                </div> */}
                        </div>

                        <div className="info">
                            <div className="info-box">
                                <div className="text">
                                    Request No :
                                    <span style={{ fontWeight: 700, fontSize: '0.9vw' }} className='text'>56</span>
                                </div>
                                <div className="text">
                                    Supplier Name :
                                    <span style={{ fontWeight: 700, fontSize: '0.9vw' }} className='text'> {selectedAssignment?.supplier_name}</span>
                                </div>
                                <div className="text">
                                    Tyre count :
                                    <span style={{ fontWeight: 700, fontSize: '0.9vw' }} className='text'> {selectedAssignment?.tyre_count}</span>
                                </div>
                            </div>
                            {
                                currentUser !== REGRIP_ROLE_ID &&
                                <Button style={{ backgroundColor: 'purple', padding: '0px 10px', height: 'fit-content' }} className='apply-button' onClick={() => handleClickInitiateLifting()}>
                                    <p> Initiate Lifting</p>
                                </Button>
                            }
                            <div style={{ display: 'flex', gap: '15px', marginLeft: 'auto' }}>
                                {
                                    currentUser !== REGRIP_ROLE_ID && tyreCount && selectedStatus === 'pending' &&
                                    <div className="count">
                                        {checkedData?.length} / {tyreCount}
                                    </div>
                                }
                                {
                                    // currentUser === REGRIP_ROLE_ID &&
                                    <ToggleButtonGroup
                                        className="toggle"
                                        // size={value || undefined}
                                        value={selectedStatus}
                                        onChange={(event, newValue) => {
                                            setSelectedStatus(newValue);
                                            setInvoiceSelectAll(false)
                                            setCheckedData("")
                                        }}
                                    >
                                        <Button value="all">All</Button>
                                        <Button value="invoiced">Invoiced</Button>
                                        <Button value="pending">Pending</Button>
                                    </ToggleButtonGroup>
                                }
                            </div>


                        </div>
                        {
                            ((selectedStatus === "all" && (invoicedTyres.length !== 0 || pendingTyres.length !== 0)) ||
                                (selectedStatus === "pending" && pendingTyres.length !== 0) ||
                                (selectedStatus === "invoiced" && invoicedTyres.length !== 0)) &&
                            <div className="table-container">
                                <table className="request-table">
                                    <thead>
                                        <tr className="table-heading">
                                            {/* {
                                                currentUser !== REGRIP_ROLE_ID && selectedStatus === "pending" &&
                                                <th>
                                                    <Checkbox onChange={(event) => {
                                                        !loading && handleSelectAllChange(event)
                                                    }} />
                                                </th>
                                            } */}
                                            {/* {
                                            currentUser === REGRIP_ROLE_ID &&
                                            <th>
                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <Checkbox checked={invoiceSelectAll === false ? false : true} style={{ height: 'auto' }} onChange={(event) => {
                                                        !loading && handleChangeInvoiceAll(event)
                                                    }} />
                                                </div>
                                            </th>
                                        } */}

                                            <th>Tyre Serial Number</th>
                                            <th>Construction Type</th>
                                            <th>Size</th>
                                            {
                                                // currentUser === REGRIP_ROLE_ID &&
                                                <th className='tyre-status'> Status </th>
                                            }

                                            <th style={{ textAlign: 'right' }}>
                                                <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10, width: 'fit-content' }}>

                                                    {
                                                        pendingTyres.length > 0 && currentUser !== REGRIP_ROLE_ID &&
                                                        <button className="submit-button" onClick={() =>
                                                            handleInvoiceButton()
                                                        }>
                                                            Upload Invoice
                                                        </button>
                                                    }
                                                    {
                                                        checkedData.length > 0 ?
                                                            <InvoiceTyresExcel selectedFleetName={selectedFleet} checkedData={checkedData} />
                                                            :
                                                            <button className='apply-button'>
                                                                <p> Download </p>
                                                            </button>
                                                    }
                                                    <Checkbox checked={invoiceSelectAll === false ? false : true} style={{ height: 'auto' }} onChange={(event) => {
                                                        !loading && handleChangeInvoiceAll(event)
                                                    }} />
                                                </div>

                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody style={{ width: '100%' }}>
                                        {
                                            selectedStatus !== "pending" &&
                                            invoicedTyres?.map((group, i) => (
                                                <>
                                                    <tr style={{ borderTop: '0.5px solid rgb(0,0,0,0.2)' }}>
                                                        <td style={{ padding: 0, borderBottom: 'none' }}></td>
                                                        <td style={{ padding: 0, borderBottom: 'none' }}></td>
                                                        <td style={{ padding: 0, borderBottom: 'none' }}></td>
                                                        <td style={{ padding: 10, borderBottom: 'none', textAlign: 'right' }}>
                                                            <button className='download-invoice-button' onClick={() => { downloadInvoice(group?.invoice_link) }}>
                                                                Download invoice
                                                                <FontAwesomeIcon icon={faFileArrowDown} />
                                                            </button>
                                                        </td>
                                                        <td style={{ padding: 0, borderBottom: 'none' }}></td>
                                                    </tr>
                                                    {group?.inspections?.map((tyre) => (
                                                        <tr className="table-data" >
                                                            {/* {
                                                            currentUser === REGRIP_ROLE_ID &&
                                                            <td style={{ borderBottom: 'none' }}>
                                                                <Checkbox
                                                                    checked={checkedData.includes(tyre)}
                                                                    onChange={(event) => handleChangeInvoice(event, tyre)}
                                                                />
                                                            </td>
                                                        } */}
                                                            <td style={{ borderBottom: 'none' }}>{tyre.tyre_serial_number}</td>
                                                            <td style={{ borderBottom: 'none', width: '400px' }}>{tyre.tyre_construction_type}
                                                            </td>
                                                            <td style={{ borderBottom: 'none' }}> {tyre.tyre_size}</td>
                                                            {
                                                                // currentUser === REGRIP_ROLE_ID &&
                                                                <td style={{ borderBottom: 'none' }}>
                                                                    <div className={`status-chip-approved`}>
                                                                        Uploaded
                                                                    </div>
                                                                </td>
                                                            }
                                                            <td style={{ textAlign: 'right' }}>
                                                                <Checkbox
                                                                    checked={checkedData.includes(tyre)}
                                                                    onChange={(event) => handleChangeInvoice(event, tyre)}
                                                                />
                                                            </td>


                                                        </tr>
                                                    ))}
                                                </>
                                            ))
                                        }
                                        <tr style={{ borderTop: '0.5px solid rgb(0,0,0,0.2)' }}></tr>
                                        {
                                            selectedStatus !== "invoiced" &&
                                            pendingTyres?.map((tyre, i) => (
                                                <tr className="table-data" >
                                                    {/* {
                                                        currentUser !== REGRIP_ROLE_ID && selectedStatus === "pending" &&
                                                        <td style={{ borderTopLeftRadius: "20px", borderBottomLeftRadius: "20px" }}>
                                                            <Checkbox style={{ marginBottom: '8px' }}
                                                                checked={selectedTyres.includes(tyre.tyre_inspection_id)}
                                                                onChange={(event) => {
                                                                    handleCheckboxChange(event, tyre.tyre_inspection_id)
                                                                }} />
                                                        </td>
                                                    } */}
                                                    {/* {
                                                    currentUser === REGRIP_ROLE_ID &&
                                                    <td style={{ borderBottom: 'none' }}>
                                                        <Checkbox
                                                            checked={checkedData.includes(tyre)}
                                                            onChange={(event) => handleChangeInvoice(event, tyre)}
                                                        />
                                                    </td>
                                                } */}
                                                    <td>{tyre.tyre_serial_number}</td>
                                                    <td style={{ width: '400px' }}>{tyre.tyre_construction_type}
                                                    </td>
                                                    <td> {tyre.tyre_size}</td>
                                                    {
                                                        // currentUser === REGRIP_ROLE_ID &&
                                                        <td>
                                                            <div className={`status-chip-pending`}>
                                                                Pending
                                                            </div>
                                                        </td>
                                                    }
                                                    <td style={{ textAlign: 'right' }}>
                                                        <Checkbox
                                                            checked={checkedData.includes(tyre)}
                                                            onChange={(event) => handleChangeInvoice(event, tyre)}
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
                            selectedStatus === "all" && invoicedTyres.length === 0 && pendingTyres.length === 0 && !loading &&
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
                        {
                            selectedStatus === "pending" && pendingTyres.length === 0 && !loading &&
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
                        {
                            selectedStatus === "invoiced" && invoicedTyres.length === 0 && !loading &&
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
                            pendingTyres.length > 0 && currentUser !== REGRIP_ROLE_ID &&
                            <button className="submit-button" onClick={() =>
                                handleInvoiceButton()
                            }>
                                Upload Invoice
                            </button>
                        } */}
                    </div>
            }
        </div >
    )
}
export default TyreActionInvoice

