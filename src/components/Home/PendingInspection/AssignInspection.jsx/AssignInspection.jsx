import { useEffect, useState } from "react"
import axios from "axios"
import { API_URL } from "../../../Config"
import './AssignInspection.css'
import '../../../../common/common.css'
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Autocomplete, TextField } from "@mui/joy"


const AssignInspection = ({ selectedInspectionAssignment, setOpenAssign, getPendingInspection }) => {

    const [options, setOptions] = useState([])
    const [selectedInspector, setSelectedInspector] = useState()
    const [showSupplierWarning, setShowSupplierWarning] = useState(false)

    const getInspectorNames = async () => {
        try {
            const { data } = await axios.get(`${API_URL}/employee/inspector-employees`);
            setOptions(data.data.map(inspector => ({
                value: inspector.employee_id,
                label: inspector.first_name + ' ' + inspector.last_name
            })))
        } catch (error) {
            console.error("An error occurred while fetching supplier data:", error);
            alert("Failed to fetch supplier data.");
        }
    };

    useEffect(() => {
        getInspectorNames();
    }, []);

    const submitForm = async (event) => {
        event.preventDefault();
        if (!selectedInspector) {
            // Display a warning
            setShowSupplierWarning(true);
            return;
        }

        const data = {
            "assigned_employee_id": selectedInspector
        }

        try {
            const result = await axios.patch(`${API_URL}/inspection-assignments/assign-inspection`, data, {
                params: {
                    // Your additional parameters here
                    tyre_inspection_assignment_id: selectedInspectionAssignment.tyre_inspection_assignment_id
                }
            });
            if (result) {
                getPendingInspection()
                setOpenAssign(false)
            }
        } catch (error) {
            if (error.response) {
                toast.error("oops! Something Went Wrong.", {
                    position: toast.POSITION.TOP_CENTER,
                    autoClose: 8000,
                });
            } else {
                console.error('Failed to Update', error);
            }
        }
    }

    const handleInspectorSelect = (option) => {
        setSelectedInspector(option.value)
        setShowSupplierWarning(false)
    }

    return (
        <div className='addBranch-customer-main'>
            <div className='scrolling-view'>
                <div>
                    <h3 style={{ fontSize: 20, color: 'grey' }}>Assign Tyres</h3>
                </div>
                <form action="" className="addFleet-form-assign" onSubmit={submitForm}>
                    <div className="addFleet-form-input-assign" >
                        <label htmlFor="supplier_name">Inspector Name</label>

                        <Autocomplete
                            className="autocomlpete"
                            disablePortal
                            id="combo-box-demo"
                            options={options}
                            renderInput={(params) => <TextField   {...params} variant="plain" />}
                            onChange={(event, option) => {
                                if (option) {
                                    handleInspectorSelect(option)
                                } else {
                                    console.log("Select option")
                                }
                            }}
                        />

                        {/* Warning message for selecting a supplier */}
                        {showSupplierWarning && (
                            <div style={{
                                color: 'red', margin: '5px 0px 0px 5px', fontSize: 12, position: 'absolute', top: 55
                            }}>
                                Please select a supplier.
                            </div>
                        )}

                    </div>
                    <button style={{ width: "fit-content", marginLeft: "auto", marginRight: "auto" }} type="submit" className="header-button">
                        Submit
                    </button>
                </form>
            </div>
        </div>
    )
}

export default AssignInspection