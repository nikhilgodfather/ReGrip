import './Assignment.css'
import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { API_URL } from '../Config';
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Controls, Player } from '@lottiefiles/react-lottie-player'
import nodata from '../../lotties/nodata1.json';
import JKProfileImage from '../../assets/jktyre-tyre-logo.png';
import BridgestoneProfileImage from '../../assets/Bridgestone_profile1.png';
import { useNavigate } from "react-router-dom";

const Assignment = () => {
    const [inspectionAssignments, setInspectionAssignments] = useState(null)
    const dummmyArray = [1, 2, 3, 4];
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const getAssignmentInspectionStats = async () => {
        const token = localStorage.getItem("token");
        // if (!token) navigate("/");
        setLoading(true)
        const bearer_token = "bearer " + JSON.parse(token);
        const { data } = await axios.get(`${API_URL}/inspection-assignments/assignment-inspection-stats`, {
            headers: {
                Authorization: bearer_token,
            },
        });
        setLoading(false)
        setInspectionAssignments(data.data);
    };


    useEffect(() => {
        getAssignmentInspectionStats();

    }, []);

    return (
        <div className="assignment-container">


            <div className='assignment' style={{ height: '100%' }}>
                <div className="head">
                    <h1 className="heading1" style={{ marginBottom: "3px" }}>
                        Assignments
                    </h1>
                </div>

                <div className='card-container'>
                    {
                        loading ?
                            dummmyArray.map((i) => (
                                <div className="card" style={{ backgroundColor: '#fff' }}>
                                    <div className="card-header">
                                        <div className='card-heading'><Skeleton /></div>
                                        <p style={{ fontSize: '0.85vw', lineHeight: 'auto' }}>Assignment Requests: </p>

                                    </div>
                                    <div className='card-line'></div>
                                    <div className='card-content'>
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <h4 style={{ fontWeight: 400 }}>Total Tyres Request : <span style={{ fontWeight: 500 }}></span></h4>
                                            <div className="card-chip">
                                                <div className="chip-test"><Skeleton /></div>
                                            </div>
                                        </div>
                                        <div className='card-item'>
                                            <span className='filler-text'>Approval</span>
                                            <div className="filler"><Skeleton style={{ height: '100%' }} /></div>
                                        </div>
                                        <div className='card-item'>
                                            <span className='filler-text'>Invoice</span>
                                            <div className="filler"><Skeleton style={{ height: '100%' }} /></div>
                                        </div>
                                        <div className='card-item'>
                                            <span className='filler-text'>Pick-up</span>
                                            <div className="filler"><Skeleton style={{ height: '100%' }} /></div>
                                        </div>
                                        <div className="item-info">
                                            <div className="info">
                                                <span style={{ fontSize: '0.75vw', fontWeight: 400 }}>Completed</span>
                                                <div className="info-chip"></div>
                                            </div>
                                            <div className="info">
                                                <span style={{ fontSize: '0.75vw', fontWeight: 400 }}>Pending</span>
                                                <div style={{ backgroundColor: '#e0ecd9' }} className="info-chip"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                            :
                            inspectionAssignments.map((assignment, i) => (
                                <div className="card" onClick={() => {
                                    navigate(`/assignment/${assignment?.fleet_branch_id}`)
                                }} style={{ backgroundColor: '#fff' }}>
                                    <div className="card-header">
                                        <div className='card-heading'>
                                            {
                                                assignment.supplier_brand_name === 'JK' ?
                                                    <img src={JKProfileImage} alt="" />
                                                    :
                                                    assignment.supplier_brand_name === 'Bridgestone' ?
                                                        <img src={BridgestoneProfileImage} alt="" />
                                                        :
                                                        ""
                                            }

                                            {assignment?.fleet_name + ", " + assignment?.fleet_branch_location}
                                        </div>
                                        <p style={{ fontSize: '0.85vw', lineHeight: 'auto' }}>Assignment Requests: {Number(assignment?.inspection_requests_count) + Number(assignment?.scrap_requests_count)}</p>

                                    </div>
                                    <div className='card-line'></div>
                                    <div className='card-content'>
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <h4 style={{ fontWeight: 400, fontSize: '0.9vw' }}> Total Requested Tyres : <span style={{ fontWeight: 500 }}>{(Number(assignment?.total_inspection_assigned_tyre_count) + Number(assignment?.total_scrap_assigned_tyre_count))}</span></h4>
                                            {
                                                Number(assignment?.total_inspection_assigned_tyre_count) > Number(assignment?.total_inspected_tyre_count) ?
                                                    <div className="card-chip-decreased">
                                                        <div className="chip-text">{Number(assignment?.total_inspection_assigned_tyre_count) - Number(assignment?.total_inspected_tyre_count)} Less Tyres
                                                        </div>
                                                    </div>
                                                    :
                                                    Number(assignment?.total_inspection_assigned_tyre_count) < Number(assignment?.total_inspected_tyre_count) ?
                                                        <div className="card-chip-increased">
                                                            <div className="chip-text">{Number(assignment?.total_inspected_tyre_count) - Number(assignment?.total_inspection_assigned_tyre_count)} More Tyres</div>
                                                        </div>
                                                        :
                                                        ""
                                            }

                                        </div>
                                        <div className='card-item'>
                                            <span className='filler-text'>Approval</span>
                                            <div className="filler">
                                                {
                                                    Number(assignment?.total_inspected_tyre_count) !== 0 &&
                                                    <div className="progress-bar-fill" style={{ '--dynamic-width': `${(Number(assignment?.inspection_approval_completed) + Number(assignment?.scrap_approve_completed)) / (Number(assignment?.total_inspected_tyre_count) + Number(assignment?.total_scrap_assigned_tyre_count)) * 100}%` }}>
                                                        {
                                                            (Number(assignment?.inspection_approval_completed) + Number(assignment?.scrap_approve_completed)) !== 0 &&
                                                            Number(assignment?.inspection_approval_completed) + Number(assignment?.scrap_approve_completed)
                                                        }
                                                    </div>
                                                }
                                                {
                                                    Number(assignment?.total_inspected_tyre_count) !== 0 &&
                                                    <div className="remaining" style={{ '--dynamic-width': `${(Number(assignment?.inspection_approval_pending) + Number(assignment?.scrap_approve_pending)) / (Number(assignment?.total_inspected_tyre_count) + Number(assignment?.total_scrap_assigned_tyre_count)) * 100}%` }}>
                                                        {
                                                            (Number(assignment.inspection_approval_pending) + Number(assignment.scrap_approve_pending)) !== 0 &&
                                                            Number(assignment.inspection_approval_pending) + Number(assignment.scrap_approve_pending)
                                                        }
                                                    </div>
                                                }

                                            </div>
                                        </div>
                                        <div className='card-item'>
                                            <span className='filler-text'>Invoice</span>
                                            <div className="filler">
                                                {
                                                    Number(assignment?.total_inspected_tyre_count) !== 0 &&
                                                    <div className="progress-bar-fill" style={{ '--dynamic-width': `${(Number(assignment?.inspection_invoice_completed) + Number(assignment?.scrap_invoice_completed)) / (Number(assignment?.total_inspected_tyre_count) + Number(assignment?.total_scrap_assigned_tyre_count)) * 100}%` }}>
                                                        {
                                                            (Number(assignment.inspection_invoice_completed) + Number(assignment.scrap_invoice_completed)) !== 0 &&
                                                            Number(assignment.inspection_invoice_completed) + Number(assignment.scrap_invoice_completed)
                                                        }
                                                    </div>
                                                }
                                                {
                                                    Number(assignment?.total_inspected_tyre_count) !== 0 &&
                                                    <div className="remaining" style={{ '--dynamic-width': `${(Number(assignment?.inspection_invoice_pending) + Number(assignment?.scrap_invoice_pending)) / (Number(assignment?.total_inspected_tyre_count) + Number(assignment?.total_scrap_assigned_tyre_count)) * 100}%` }}>
                                                        {
                                                            (Number(assignment.inspection_invoice_pending) + Number(assignment.scrap_invoice_pending)) !== 0 &&
                                                            Number(assignment.inspection_invoice_pending) + Number(assignment.scrap_invoice_pending)
                                                        }
                                                    </div>
                                                }
                                            </div>
                                        </div>
                                        <div className='card-item'>
                                            <span className='filler-text'>Pick-up</span>
                                            <div className="filler">
                                                {
                                                    Number(assignment?.total_inspected_tyre_count) !== 0 &&
                                                    <div className="progress-bar-fill" style={{ '--dynamic-width': `${(Number(assignment?.inspection_lifting_completed) + Number(assignment?.scrap_lifting_completed)) / (Number(assignment?.total_inspected_tyre_count) + Number(assignment?.total_scrap_assigned_tyre_count)) * 100}%` }}>
                                                        {
                                                            (Number(assignment.inspection_lifting_completed) + Number(assignment.scrap_lifting_completed)) !== 0 &&
                                                            Number(assignment.inspection_lifting_completed) + Number(assignment.scrap_lifting_completed)
                                                        }
                                                    </div>
                                                }
                                                {
                                                    Number(assignment?.total_inspected_tyre_count) !== 0 &&
                                                    <div className="remaining" style={{ '--dynamic-width': `${(Number(assignment?.inspection_lifting_pending) + Number(assignment?.scrap_lifting_pending)) / (Number(assignment?.total_inspected_tyre_count) + Number(assignment?.total_scrap_assigned_tyre_count)) * 100}%` }}>
                                                        {
                                                            (Number(assignment.inspection_lifting_pending) + Number(assignment.scrap_lifting_pending)) !== 0 &&
                                                            Number(assignment.inspection_lifting_pending) + Number(assignment.scrap_lifting_pending)
                                                        }
                                                    </div>
                                                }
                                            </div>
                                        </div>
                                        <div className="item-info">
                                            <div className="info">
                                                <span style={{ fontSize: '0.75vw', fontWeight: 400 }}>Completed</span>
                                                <div className="info-chip"></div>
                                            </div>
                                            <div className="info">
                                                <span style={{ fontSize: '0.75vw', fontWeight: 400 }}>Pending</span>
                                                <div style={{ backgroundColor: '#e0ecd9' }} className="info-chip"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                    }
                </div>
                {
                    inspectionAssignments?.length === 0 && !loading &&
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

export default Assignment
