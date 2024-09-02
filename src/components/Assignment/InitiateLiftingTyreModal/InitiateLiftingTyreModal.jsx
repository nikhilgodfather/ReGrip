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
import nodata from '../../../lotties/nodata1.json';


const InitiateLiftingTyreModal = ({ selectedStatus, handleSuccessBack, selectedAssignment }) => {

    const [tyres, setTyres] = useState([])
    const [filteredTyres, setFilteredTyres] = useState([]);

    const [loading, setLoading] = useState(true);
    const [searchedOption, setSearchedOption] = useState("");
    const [selectedTyres, setSelectedTyres] = useState([]);
    const [isChecked, setIsChecked] = useState(false);

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

    const handleSelectAllChange = (isChecked, tempTyres) => {

        if (isChecked && tempTyres) {
            const allInspectionIds = tempTyres.map((tyre) => tyre.tyre_inspection_id);
            setSelectedTyres(allInspectionIds);
        }
        else if (isChecked) {
            const allInspectionIds = tyres.map((tyre) => tyre.tyre_inspection_id);
            setSelectedTyres(allInspectionIds);
        }
        else {
            setSelectedTyres([]);
        }
    };

    const handleSubmit = async () => {
        try {
            if (selectedTyres.length === 0) {
                return;
            }
            const token = localStorage.getItem("token");
            // if (!token) navigate("/");
            setLoading(true)
            const data = {
                tyre_inspection_assignment_id: selectedAssignment.tyre_inspection_assignment_id,
                ids: selectedTyres,
                assignment_type: selectedAssignment?.scrap_batch_id ? 'scrap' : 'inspection'
            }

            const bearer_token = "bearer " + JSON.parse(token);
            const result = await axios.patch(`${API_URL}/inspection-assignments/initiate-lifting`, data, {
                headers: {
                    Authorization: bearer_token,
                }
            });
            setLoading(false)
            handleSuccessBack("Successfully Initiated Lifting")
        }
        catch (error) {
            if (error.response) {
                console.log("oops! Can't Initiate Lifting.");

                toast.error("oops! Can't Initiate Lifting.", {
                    position: toast.POSITION.TOP_CENTER,
                    autoClose: 3000,
                });

            }
            else {
                console.error('Failed to Update Branch', error);
            }
            setLoading(false)
        }
    }

    const getAssignmentAllTyres = async () => {
        try {
            const token = localStorage.getItem("token");
            // if (!token) navigate("/");
            setLoading(true)
            const bearer_token = "bearer " + JSON.parse(token);
            const { data } = await axios.get(`${API_URL}/inspection-assignments/invoice-status`, {
                headers: {
                    Authorization: bearer_token,
                },
                params: {
                    status: selectedStatus === 'invoiced' ? 'approved' : 'all',
                    request_id: selectedAssignment?.tyre_inspection_assignment_id
                }
            });
            setLoading(false)

            let temp = data.data.filter((tyre) => tyre.lifting_initiated === false);

            setTyres(temp);
            setFilteredTyres(temp);
            handleSelectAllChange(true, temp)
            setIsChecked(true)
        }
        catch (e) {
            // console.log("Error:", e.message)
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

        getAssignmentAllTyres();

    }, [selectedStatus]);

    return (
        <div className="tyre-action-container">
            <ToastContainer className="custom-toast-container" />

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
                                Initiate Lifting
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


                        {
                            filteredTyres.length !== 0 &&
                            <div className="table-container">
                                <table className="request-table">
                                    <thead>
                                        <tr className="table-heading">
                                            {
                                                <th>
                                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                        <Checkbox
                                                            style={{ height: 'auto' }}
                                                            checked={isChecked}
                                                            onChange={(event) => {
                                                                const isChecked = event.target.checked; // Get the updated checked state
                                                                setIsChecked(isChecked); // Update the state
                                                                !loading && handleSelectAllChange(isChecked); // Call handleSelectAllChange with the updated state
                                                            }}
                                                        />

                                                    </div>

                                                </th>
                                            }

                                            <th>Tyre Serial Number</th>
                                            <th>Construction Type</th>
                                            <th>Size</th>
                                            <th className='tyre-status'> Status </th>

                                        </tr>
                                    </thead>

                                    <tbody style={{ width: '100%' }}>
                                        {
                                            filteredTyres?.map((tyre, i) => (
                                                <tr className="table-data" >
                                                    {
                                                        <td style={{ borderTopLeftRadius: "20px", borderBottomLeftRadius: "20px" }}>
                                                            <Checkbox
                                                                checked={selectedTyres.includes(tyre.tyre_inspection_id)}
                                                                onChange={(event) => {
                                                                    handleCheckboxChange(event, tyre.tyre_inspection_id)
                                                                }} />
                                                        </td>
                                                    }

                                                    <td>{tyre.tyre_serial_number}</td>
                                                    <td style={{ width: '400px' }}>{tyre.tyre_construction_type}
                                                    </td>
                                                    <td> {tyre.tyre_size}</td>
                                                    {
                                                        <td>
                                                            {
                                                                tyre?.invoice_id ?
                                                                    <div className={`status-chip-approved`}>
                                                                        Invoiced
                                                                    </div>
                                                                    :
                                                                    <div className={`status-chip-pending`}>
                                                                        Pending
                                                                    </div>
                                                            }
                                                        </td>
                                                    }
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
                        {
                            <button className="submit-button" onClick={() => handleSubmit()}>
                                Initiate
                            </button>
                        }
                    </div>
            }
        </div >
    )
}
export default InitiateLiftingTyreModal
