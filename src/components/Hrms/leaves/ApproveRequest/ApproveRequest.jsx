import React from 'react'

import '../AllLeave/AllLeave.css'
import nodata from '../../../../lotties/nodata1.json';
import Skeleton from 'react-loading-skeleton';
import { Controls, Player } from '@lottiefiles/react-lottie-player'
import { Table } from '@mui/joy';
const ApproveRequest = ({ allLeave, loading }) => {

    const dummmyArray = [1, 2, 3, 4, 5]

    return (
        <div className='all-leave'>
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
                                allLeave
                                    ?.filter(leaves => leaves?.status === 'approved')
                                    ?.map((leaves, i) => {
                                        const {
                                            applied_by_name,
                                            start_date,
                                            end_date,
                                            leave_type,
                                            number_of_leaves,
                                            reason,
                                            status,
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
                                                <td>{reasonData ? (reasonData.length >= 40 ? `${reasonData.substring(0, 40)}...` : reasonData) : ''}</td>


                                                <td><p className='approved-status'
                                                >{status}</p></td>

                                            </tr>
                                        )
                                    })
                        }
                    </tbody>
                </Table>
                {
                    allLeave?.filter(leaves => leaves?.status === 'approved')?.length === 0 && !loading &&
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

export default ApproveRequest


