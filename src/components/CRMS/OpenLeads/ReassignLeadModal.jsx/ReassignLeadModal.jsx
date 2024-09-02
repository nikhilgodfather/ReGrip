import { faXmark } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useEffect, useState } from "react"
import axios from "axios"
import { API_URL } from "../../../Config"
import './ReassignLeadModal.css'
import '../../../../common/common.css'
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Autocomplete, TextField } from "@mui/joy"


const ReassignLeadModal = ({ setShowReassignLeadModal, selectedLead, setOpenAssign, getOpenLeads }) => {
    const [options, setOptions] = useState([])
    const [selectedSalesPerson, setSelectedSalesPerson] = useState()
    const [showSalesPersonWarning, setShowSalesPersonWarning] = useState(false)

    const getSalesPersonNames = async () => {
        try {
            const { data } = await axios.get(`${API_URL}/employee/sales-employees-for-customer-region`, {
                params: {
                    customer_branch_id: selectedLead?.customer_branch_id
                }
            });
            setOptions(data.data.map(salesPerson => ({
                value: salesPerson.employee_id,
                label: salesPerson.first_name + ' ' + salesPerson.last_name
            })))
        } catch (error) {
            console.error("An error occurred while fetching Sales Person data:", error);
            alert("Failed to fetch Sales Person data.");
        }
    };

    useEffect(() => {
        getSalesPersonNames();
    }, []);

    const submitForm = async (event) => {
        event.preventDefault();
        if (!selectedSalesPerson) {
            // Display a warning
            setShowSalesPersonWarning(true);
            return;
        }

        const data = {
            "employee_id": selectedSalesPerson
        }

        try {
            const result = await axios.patch(`${API_URL}/lead/reassign-lead`, data, {
                params: {
                    // Your additional parameters here
                    lead_id: selectedLead.lead_id
                }
            });
            if (result) {
                toast.success("Assigned Lead successfully", {
                    position: toast.POSITION.TOP_CENTER,
                    autoClose: 2000,
                });
                getOpenLeads("open")
                setOpenAssign(false)


            }
        } catch (error) {
            if (error.response) {
                toast.error("oops! Can't Assign Lead.", {
                    position: toast.POSITION.TOP_CENTER,
                    autoClose: 8000,
                });
            } else {
                console.error('Failed to Assign Fleet', error);
            }
        }
    }

    const handleInspectorSelect = (option) => {
        setSelectedSalesPerson(option.value)
        setShowSalesPersonWarning(false)
    }

    return (
        <div className='addBranch-customer-main'>
            <div className='scrolling-view'>
                <div>
                    <h3 style={{ fontSize: 20, color: 'grey' }}>Assign Tyres</h3>
                </div>
                <form action="" className="addFleet-form-reassign" onSubmit={submitForm}>
                    <div className="addFleet-form-input-reassign">
                        <label htmlFor="supplier_name">Sales Person Name</label>

                        <Autocomplete
                            className="autocomlpete"
                            disablePortal
                            id="combo-box-demo"
                            options={options}
                            sx={{ width: 300 }}
                            renderInput={(params) => <TextField {...params} />}
                            onChange={(event, option) => {
                                if (option) {
                                    handleInspectorSelect(option)
                                } else {
                                    console.log("Select option")
                                }
                            }}
                        />
                        {/* Warning message for selecting a supplier */}
                        {showSalesPersonWarning && (
                            <div style={{
                                color: 'red', margin: '5px 0px 0px 5px', fontSize: 12, position: 'absolute', top: 55
                            }}>
                                Please select a Sales Person.
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

export default ReassignLeadModal
