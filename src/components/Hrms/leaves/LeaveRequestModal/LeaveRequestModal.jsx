import axios from 'axios';
import React, { useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import { API_URL } from '../../../Config';
import { Button, CircularProgress, Textarea, ToggleButtonGroup } from '@mui/joy';

const LeaveRequestModal = ({ leave_id, setUpdateStatusShow, getAllLeave }) => {

    const [loading, setLoading] = useState(false)

    const [status, setStatus] = useState('approved');
    const [message, setMessage] = useState('');

    const handleUpdateStatus = async () => {
        if (!status) {
            toast.error("Status field is required", {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 2000,
            })
        }
        try {
            const data = {
                status: status,
                comments: message
            }
            setLoading(true)

            const response = await axios.patch(`${API_URL}/leave/approve-reject?leave_id=${leave_id}`, data);
            console.log('Status updated successfully:', response.data);
            setLoading(false)
            setUpdateStatusShow(false)
            getAllLeave()
            setStatus("")
            setMessage("")

        } catch (error) {
            console.error('Error updating status:', error.message);
            setLoading(false)
        }
    };

    return (
        <div className='update-leave-request-modal'>
            <ToastContainer className="custom-toast-container" />

            <h4>Update Status</h4>
            <div className='leave-request-modal'>

                <ToggleButtonGroup
                    value={status}
                    onChange={(event, newValue) => {
                        setStatus(newValue);
                    }}
                >
                    <Button value="approved">Approved</Button>
                    <Button value="rejected">Reject</Button>
                </ToggleButtonGroup>
                <Textarea
                    value={message}
                    onChange={(event) => {
                        setMessage(event.target.value);
                    }}
                    placeholder='comments...' minRows={2} />
            </div>

            {
                loading ?
                    <Button className='update-leave-status-btn' ><CircularProgress variant="solid" sx={{ marginRight: "6px" }} /> Updating</Button>
                    :
                    <Button className='update-leave-status-btn'
                        onClick={() => handleUpdateStatus()}
                    >Update</Button>

            }
        </div>
    )
}

export default LeaveRequestModal
