import { Button, CircularProgress, Input } from '@mui/joy';
import React, { useEffect, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import { API_URL } from '../../Config';
import axios from 'axios';

const PanNumberUpdate = ({ customer_Id, setUpdatePanModal ,getCustomerById,panInput}) => {

    const [loading, setLoading] = useState(false)

    const [showPanWarning, setShowPanWarning] = useState(false);
    const [newPanNumber, setNewPanNumber] = useState()

    const [validation, setShowValidation] = useState(false)

    useEffect(()=>{
        setNewPanNumber(panInput)
    },[])

    const handleSubmitButton = async () => {
        const token = localStorage.getItem("token");
        const bearer_token = "bearer " + JSON.parse(token);
        try {

            if (!newPanNumber) {
                !newPanNumber && setShowPanWarning(true);
                return;
            }
            console.log(newPanNumber);

            const data = {
                employee_id:47,
                pan_number: newPanNumber,
            };
            setLoading(true)
            await axios.patch(`${API_URL}/customer/update-customer-pan?customer_id=${customer_Id}`, data, {
                headers: {
                    Authorization: bearer_token,
                },
            });
            setLoading(false)
            getCustomerById(customer_Id)
            setUpdatePanModal(false)

            toast.success("PAN Number Updated successfully", {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 2000,
            })
        } catch (error) {
            console.error('Error Meeting Person:', error);
            setLoading(false)
            toast.error(error.response.data.message, {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 2000,
                
            })
        }
    }

    const isValidPan = /^[A-Z]{5}\d{4}[A-Z]$/;


    return (
        <div className='addBranch-customer-main'>
            <ToastContainer className="custom-toast-container"  style={{width:"400px"}}/>
            <div className='scrolling-view'>
                <div>
                    <h3 style={{ fontSize: 20, color: 'grey' }}>Update PAN Number</h3>
                </div>

                <div className='field-align' style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div className='add-customer-field-container' style={{ width: '100%' }}>
                        <h5>PAN Number</h5>
                        <Input
                            style={{ border: showPanWarning ? ' 1px solid red' : ' 1px solid #ccc', width: "100%" }}
                            sx={{ textTransform: "uppercase" }}
                            className='field-addBranch'
                            placeholder="Update PAN Number"
                            value={newPanNumber}
                            onChange={(event) => {
                                const newPanInput = event.target.value.slice(0, 10).toUpperCase();
                                setNewPanNumber(newPanInput);
                                if (!isValidPan.test(newPanInput)) {
                                    setShowValidation(true);
                                } else {
                                    setShowValidation(false);
                                }
                            }}
                        />
                        {
                            validation ? <p style={{ color: "#ff0000", fontSize: "12px" }}>Enter A Valid PAN Number</p> : ""
                        }
                    </div>
                </div>
                <div className='button-for-adding' style={{ marginTop: '10px', display: 'flex', justifyContent: 'center' }}>
                    {

                        loading ?
                            <Button className='addBranchBTN'>
                                <CircularProgress variant="solid" />
                            </Button>
                            :
                            <Button disabled={validation} className={validation ? "addBranchBTN-disabled" : "addBranchBTN"}
                                onClick={() => handleSubmitButton()}
                            >
                                Update PAN
                            </Button>
                    }
                </div>
            </div>
        </div>

    )
}

export default PanNumberUpdate