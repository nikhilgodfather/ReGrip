import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'react-loading-skeleton/dist/skeleton.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { Autocomplete, Button, Option, Select, TextField, ToggleButtonGroup } from '@mui/joy';
import './Leaves.css';
import AllLeave from './AllLeave/AllLeave';
import RejectedLeave from './RejectedLeave/RejectedLeave';
import Pending from './Pending/Pending';
import ApproveRequest from './ApproveRequest/ApproveRequest';
import { API_URL } from '../../Config';
import { useNavigate } from "react-router-dom";

const Leaves = () => {

    const [index, setIndex] = useState("1")
    const [employees, setEmployees] = useState([])
    const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
    const [loading, setLoading] = useState(true)
    const [allLeave, setAllLeave] = useState([])
    const navigate = useNavigate();

    const getAllLeave = async (selectedEmployeeId) => {

        try {
            const token = localStorage.getItem("token");
            const bearer_token = "bearer " + JSON.parse(token);

            setLoading(true)
            const { data } = await axios.get(`${API_URL}/leave`, {
                headers: {
                    Authorization: bearer_token,
                },
                params: {
                    employee_id: selectedEmployeeId,
                },

            });
            setLoading(false);
            setAllLeave(data.data)
        }
        catch (error) {
            console.log("Error while fetching data:", error.message)
        }
    }

    const getAllEmployees = async () => {

        try {
            const { data } = await axios.get(`${API_URL}/employee/employees`);
            setEmployees(data.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    const handleEmployeeSelect = (event, newValue) => {
        setSelectedEmployeeId(newValue?.employee_id || '');
    };

    useEffect(() => {
        if (selectedEmployeeId) {
            getAllLeave(selectedEmployeeId);
        } else {
            getAllLeave();
        }
        getAllEmployees()
    }, [selectedEmployeeId]);

    return (
        <div className="Fleet-container" style={{ marginLeft: 0 }}>
            <div>
                <div className="Fleet-header-leaves">
                    <div className="head" style={{ display: 'flex', }}>
                        <h1 className="heading1" style={{ marginBottom: '3px', }}>
                            <FontAwesomeIcon
                                onClick={() => {
                                    navigate('/organization')
                                }}
                                icon={faChevronLeft}
                                color="#65a143"
                                style={{ marginRight: 6, cursor: 'pointer' }}
                            />
                            Leaves
                        </h1>
                    </div>
                </div>
                <div className='leaves-main'>
                    <div className='select-component'>

                        <Autocomplete
                            className='fields'
                            options={employees}
                            getOptionLabel={(employee) => `${employee.first_name} ${employee.last_name}`}
                            value={employees.find(emp => emp.employee_id === selectedEmployeeId) || null}
                            onChange={handleEmployeeSelect}
                            placeholder='Select Employee'
                            renderInput={(params) => <TextField {...params} variant="outlined" />}
                        />
                        <ToggleButtonGroup
                            value={index}
                            onChange={(event, newValue) => {
                                setIndex(newValue)
                                setSelectedEmployeeId(null)
                            }}
                            className='button-leaves'
                        >
                            <Button value="1">All</Button>
                            <Button value="2">Approved</Button>
                            <Button value="3">Rejected</Button>
                            <Button value="4">Pending</Button>
                        </ToggleButtonGroup>

                    </div>
                    {
                        index === "1" &&
                        <AllLeave selectedEmployeeId={selectedEmployeeId} allLeave={allLeave} loading={loading} getAllLeave={getAllLeave} />
                    }
                    {
                        index === "2" &&
                        <ApproveRequest selectedEmployeeId={selectedEmployeeId} allLeave={allLeave} loading={loading} />
                    }
                    {
                        index === "3" &&
                        <RejectedLeave selectedEmployeeId={selectedEmployeeId} allLeave={allLeave} loading={loading} />
                    }
                    {
                        index === "4" &&
                        <Pending selectedEmployeeId={selectedEmployeeId} allLeave={allLeave} loading={loading} getAllLeave={getAllLeave} />
                    }
                </div>
            </div>

        </div>
    );
};

export default Leaves;
