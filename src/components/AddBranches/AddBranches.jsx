import React, { useState } from 'react'
import './AddBranches.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import axios from 'axios';
import AsyncSelect from 'react-select/async';
import { API_URL } from '../Config/index';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddBranches = ({ setBranchesModal, selectedFleet, editBranchData, setEditBranchData, fleetId, handleBranchTable ,onClose}) => {

    const [inputV, setValue] = useState('');
    const [selectedCity, setSelectedCity] = useState([]);
    const [supervisorName, setSupervisorName] = useState(editBranchData?.supervisor_name || "")
    const [supervisorPhone, setSupervisorPhone] = useState(editBranchData?.supervisor_mobileno || "")

    const form_fields = [
        "supervisor_name",
        "supervisor_mobile"
    ]

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        if (!editBranchData) {
            const post_data = {};
            form_fields.forEach((field) => {
                const element = e.target[field];
                if (element) {
                    post_data[field] = element.value;
                }
            });
            post_data.fleet_id = fleetId;
            post_data.fleet_branch_location = selectedCity.value;

            try {
                const result = await axios.post(`${API_URL}/fleets/addBranch`, post_data);
                if (result) {
                    handleBranchTable({ data: post_data, isBranchAdd: true })
                    console.log('New Branch added successfully', result.data.message);
                   
                     changeModalState();
                    onClose("New Branch added successfully",fleetId);
                }
            } catch (error) {
                if (error.response && error.response.status === 409) {
                    console.log('Branch already exists.');
                    toast.error("oops! This Branch already exists.", {
                      position: toast.POSITION.TOP_CENTER,
                      autoClose: 3000,
                    });

                } else {
                    console.error('Failed to add new branch!', error);
                }
            }
        } else {
            const edit_data = {};
            form_fields.forEach((field) => {
                const element = e.target[field];
                if (element) {
                    edit_data[field] = element.value;
                }
            });
            if (selectedCity.value !== undefined) {
                edit_data.fleet_branch_location = selectedCity?.value || "Not selected";
            } else {
                edit_data.fleet_branch_location = editBranchData?.fleet_branch_location || "Cannot get location!";
            }
            edit_data.fleet_id = fleetId;
            edit_data.fleet_branch_id = editBranchData?.fleet_branch_id || "Unable to get";
            try {
                const result = await axios.put(`${API_URL}/fleets/updateBranch`, edit_data);
                if (result) {
                    handleBranchTable({ data: edit_data, isBranchAdd: false })
                    // alert(result.data.message);
                    console.log('Branch Update successfully', result.data.message);
                    setBranchesModal(false);
                    onClose("Branch updated successfully",fleetId);
                }
            } catch (error) {
                if (error.response) {
                    // alert("oops! Can't update branch details.")
                    console.log("oops! Can't update branch details.");
                    
                    toast.error("oops! Can't update branch details.", {
                      position: toast.POSITION.TOP_CENTER,
                      autoClose: 3000,
                    });
                    
                } else {
                    console.error('Failed to Update Branch', error);
                }
            }
        }

    }


    const customStyles = {
        control: (provided, state) => ({
            ...provided,
            width: '100%',
            height: '30px',
            border: state.isFocused ? 'none' : '1px solid #ccc',
            borderRadius: '5px',
            boxShadow: state.isFocused ? '0 0 3px rgba(0, 0, 0, 0.2)' : 'none',
            '&:hover': {
                borderColor: '#ccc',
            },
        }),
    };

    const handleInputChange = value => {
        setValue(value);
    };

    const handleCityChange = (selectedOption) => {
        setSelectedCity(selectedOption);
    };


    const loadOptions = async () => {
        const city = inputV;
        try {
            const response = await axios.get(`${API_URL}/location/getcity?query=${city}`);
            const responseData = response.data;

            if (responseData.status === 'success' && Array.isArray(responseData.data)) {
                return responseData.data.map(city => ({
                    value: `${city.area}, ${city.state}`,
                    label: `${city.area}, ${city.state}`
                }));
            } else {
                console.error('Invalid response data format:', responseData);
                return [];
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            return [];
        }
    };


    function changeModalState() {
        setBranchesModal(false);
        setEditBranchData(null)
        setSupervisorName('');
        setSupervisorPhone('');
    }

    return (
        <div className="modal-main-div">
            <div className="addBranches-container">
                <div className="addFleet-head">
                    <div className="heading">
                        <h2>{!editBranchData ? "Add Branches" : "Update Branches"}</h2>
                    </div>
                    <div className="close-btn">
                        <button onClick={changeModalState}><FontAwesomeIcon icon={faXmark} style={{ color: "#ffffff", }} /></button></div>
                </div>
                <form action="" className="addFleet-form" onSubmit={handleFormSubmit}>
                    <div className="addFleet-form-input">
                        <label htmlFor="fleets_name">Fleet Name</label>
                        <input type="text" name="fleets_name" id="fleets_name" value={selectedFleet} readOnly />
                    </div>
                    <div className="addFleet-form-input">
                        <label htmlFor="supervisor_name">Supervisor Name</label>
                        <input type="text" name="supervisor_name" id="supervisor_name" value={supervisorName} onChange={(e) => setSupervisorName(e.target.value)} />
                    </div>
                    <div className="addFleet-form-input">
                        <label htmlFor="supervisor_mobile">Supervisor Mobile no.</label>
                        <input type="text" name="supervisor_mobile" id="supervisor_mobile" value={supervisorPhone} onChange={(e) => setSupervisorPhone(e.target.value)} />
                    </div>
                    <div className="addFleet-form-input">
                        <label htmlFor="branch_location">Branch Location</label>
                        <AsyncSelect
                            styles={customStyles}
                            value={selectedCity}
                            onInputChange={handleInputChange}
                            onChange={handleCityChange}
                            loadOptions={loadOptions}
                            placeholder={editBranchData?.fleet_branch_location || "Search for a city..."}
                        />
                    </div>

                    <button type="submit" className="addFleet-submit-btn">{!editBranchData ? "Submit" : "Update"}</button>
                </form>
            </div>
        </div>
    )
}

export default AddBranches
