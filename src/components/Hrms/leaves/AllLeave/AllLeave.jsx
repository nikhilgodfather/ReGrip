import React, { useState } from 'react'
import './AllLeave.css'
import nodata from '../../../../lotties/nodata1.json';
import Skeleton from 'react-loading-skeleton';
import { Controls, Player } from '@lottiefiles/react-lottie-player'
import { Table, } from '@mui/joy';
import ModalClose from '@mui/joy/ModalClose';
import Modal from '@mui/joy/Modal';
import Sheet from '@mui/joy/Sheet';
import LeaveRequestModal from '../LeaveRequestModal/LeaveRequestModal';

const AllLeave = ({ allLeave, loading, getAllLeave }) => {
    const dummmyArray = [1, 2, 3, 4, 5]

    const [updateStatusShow, setUpdateStatusShow] = useState(false)

    const [leave_id, set_leave_id] = useState()

    return (
        <div className='all-leave'>
            <Modal
                aria-labelledby="modal-title"
                aria-describedby="modal-desc"
                open={updateStatusShow}
                onClose={() => {
                    setUpdateStatusShow(false)

                }
                }
                sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
            >
                <Sheet
                    variant="plain"
                    sx={{
                        width: "30%",
                        height: "45%",
                        borderRadius: 'md',
                        p: 3,
                        boxShadow: 'lg',
                        position: "relative"
                    }}
                >
                    <ModalClose variant="plain" sx={{ m: 0 }} />
                    <LeaveRequestModal leave_id={leave_id} setUpdateStatusShow={setUpdateStatusShow} getAllLeave={getAllLeave} />
                </Sheet>
            </Modal>
            <div className="leave-status-table-container">

                <Table >
                    <thead>
                        <tr className="">
                            <th style={{ width: "50px", }}>S.No</th>
                            <th>Name</th>
                            <th>Start Date</th>
                            <th>End Date</th>
                            <th>Leave Type</th>
                            <th >No Of Leaves</th>
                            <th style={{ width: "300px" }}>Reason</th>
                            <th style={{ width: "140px" }}>Status</th>
                        </tr>
                    </thead>
                    <tbody style={{ width: '100%' }}>
                        {
                            loading === true ?
                                dummmyArray.map((i) =>
                                    <tr className="" key={i}>
                                        <td><Skeleton /></td>
                                        <td><Skeleton /></td>
                                        <td><Skeleton /></td>
                                        <td><Skeleton /></td>
                                        <td><Skeleton /></td>
                                        <td ><Skeleton /></td>
                                        <td ><Skeleton /></td>
                                        <td ><Skeleton /></td>
                                    </tr>
                                )
                                :
                                allLeave?.map((leaves, i) => {
                                    const {
                                        applied_by_name,
                                        start_date,
                                        end_date,
                                        leave_type,
                                        number_of_leaves,
                                        reason,
                                        status,
                                        leave_id
                                    } = leaves;

                                    const formattedDateStart = new Date(start_date).toLocaleDateString('en-GB');
                                    const formattedDateEnd = new Date(end_date).toLocaleDateString('en-GB');
                                    const reasonData = reason ? reason.substring(0, 40) : '';
                                    return (
                                        <tr className="" key={i}>

                                            <td >{i + 1}</td>
                                            <td>{applied_by_name}</td>
                                            <td>{formattedDateStart}</td>
                                            <td>{formattedDateEnd}</td>
                                            <td>
                                                {leave_type}
                                            </td>
                                            <td>{number_of_leaves}</td>
                                            <td title=''>{reasonData ? (reasonData.length >= 40 ? `${reasonData.substring(0, 40)}...` : reasonData) : ''}</td>
                                            {
                                                status === "pending" ?
                                                    <td><button className='update-button-leave' onClick={() => {
                                                        setUpdateStatusShow(true)
                                                        set_leave_id(leave_id)
                                                    }}>Update Status</button></td>
                                                    : <td ><p className={status === "rejected" ? 'rejected-status' : status === "approved" ? 'approved-status' : ''}>{status}</p></td>

                                            }
                                        </tr>
                                    )
                                })
                        }
                    </tbody>
                </Table>
                {
                    allLeave.length === 0 && !loading &&
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

export default AllLeave
