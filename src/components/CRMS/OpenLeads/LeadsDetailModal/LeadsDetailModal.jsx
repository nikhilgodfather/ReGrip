import React, { useState } from 'react'
import './LeadsDetailModal.css'
import ReassignLeadModal from '../ReassignLeadModal.jsx/ReassignLeadModal';
const LeadsDetailModal = ({ leadData, reportData }) => {
    const [showReassignLeadModal, setShowReassignLeadModal] = useState(false)
    const [selectedLead, setSelectedLead] = useState()

    // getColor
    const getStatusClass = (status, report) => {
        switch (status) {
            case 'Hot':
                return 'status-show-chip-hot';
            case 'Warm':
                return 'status-show-chip-warm';
            case 'Cold':
                return 'status-show-chip-cold';
                case 'Order Generated':
                    return 'status-show-chip-order-generated';
            default:
                switch (report) {
                    case 'Hot':
                        return 'status-show-chip-hot';
                    case 'Warm':
                        return 'status-show-chip-warm';
                    case 'Cold':
                        return 'status-show-chip-cold';
                    case 'Order Generated':
                        return 'status-show-chip-order-generated';
                    default:
                        return 'status-show-chip';
                }
        }
    };

    const handleReAssignLeadButton = (data) => {
        setShowReassignLeadModal(true)
        setSelectedLead(data)
    }
    return (
        <div className='lead-details'>
            <h6 className={getStatusClass(leadData?.lead_status, reportData?.lead_status)}>{leadData ? leadData?.lead_status : reportData?.lead_status}</h6>
            <div className='main-container-lead' style={{ width: '30%' }}>
            <div className='detail'>
                    <span>Lead Id</span>
                    {leadData ? leadData?.lead_id : reportData.lead_id}
                </div>
                <div className='detail'>
                    <span>Customer</span>
                    {leadData ? leadData?.customer_name : reportData.customer_name}
                </div>

                <div className='detail'>
                    <span>Meeting Person</span>

                    {leadData ? (
                        leadData.meeting_person_name ? (
                            <>
                                {leadData.meeting_person_name} - {leadData.meeting_person_designation}
                            </>
                        ) : (
                            <span>--/--</span>
                        )
                    ) : (
                        reportData.meeting_person_name ? (
                            <>
                                {reportData.meeting_person_name} - {reportData.meeting_person_designation}
                            </>
                        ) : (
                            <span>--/--</span>
                        )
                    )}
                </div>


                <div className='detail'>
                    <span>Type</span>
                    {leadData ? (
                        leadData.visit_type ? (
                            leadData.visit_type
                        ) : (
                            <span>--/--</span>
                        )
                    ) : (
                        reportData.visit_type ? (
                            reportData.visit_type
                        ) : (
                            <span>--/--</span>
                        )
                    )}

                </div>

                <div className='detail'>
                    <span>Agenda of Meeting</span>
                    {leadData ? (
                        leadData.agenda_of_meeting ? (
                            leadData.agenda_of_meeting
                        ) : (
                            <span>--/--</span>
                        )
                    ) : (
                        reportData.agenda_of_meeting ? (
                            reportData.agenda_of_meeting
                        ) : (
                            <span>--/--</span>
                        )
                    )}
                </div>

                <div className='detail'>
                    <span>Meeting Date</span>
                    {leadData ? (
                        leadData.meeting_time ? (
                            new Date(leadData.meeting_time).toLocaleDateString('en-IN')
                        ) : (
                            <span>--/--</span>
                        )
                    ) : (
                        reportData.meeting_time ? (
                            new Date(reportData.meeting_time).toLocaleDateString('en-IN')
                        ) : (
                            <span>--/--</span>
                        )
                    )}
                </div>
                {leadData ? (
                    leadData.is_open ? (
                        <div className='detail'>
                            <span>Next Meeting Date</span>
                            {leadData.next_meeting_date ? (
                                new Date(leadData.next_meeting_date).toLocaleDateString('en-IN')
                            ) : (
                                <span>--/--</span>
                            )}
                        </div>
                    ) : (
                        <div className='detail'>
                            <span>Close Reason</span>
                            {leadData.close_reason ? (
                                leadData.close_reason
                            ) : (
                                <span>--/--</span>
                            )}
                        </div>
                    )
                ) : (
                    reportData.is_open ? (
                        <div className='detail'>
                            <span>Next Meeting Date</span>
                            {reportData.next_meeting_date ? (
                                new Date(reportData.next_meeting_date).toLocaleDateString('en-IN')
                            ) : (
                                <span>--/--</span>
                            )}
                        </div>
                    ) : (
                        <div className='detail'>
                            <span>Close Reason</span>
                            {reportData.close_reason ? (
                                reportData.close_reason
                            ) : (
                                <span>--/--</span>
                            )}
                        </div>
                    )
                )}
            </div>
            <div className='line'>
            </div>

            <div className='main-container-lead' style={{ width: '70%' }}>

            <div className='detail'>
                    <span>Assigned By:</span>
                    {leadData ? (
                        leadData.assigned_by_employee_name ? (
                            leadData.assigned_by_employee_name
                        ) : (
                            <span>--/--</span>
                        )
                    ) : (
                        reportData.assigned_by_employee_name ? (
                            reportData.assigned_by_employee_name
                        ) : (
                            <span>--/--</span>
                        )
                    )}
                </div>

                <div className='detail'>
                    <span>Sales Person</span>
                    {leadData ? (
                        leadData.sales_person_name ? (
                            leadData.sales_person_name
                        ) : (
                            <span>--/--</span>
                        )
                    ) : (
                        reportData.sales_person_name ? (
                            reportData.sales_person_name
                        ) : (
                            <span>--/--</span>
                        )
                    )}
                </div>
                <div className='detail' style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <span>Product Category</span>
                    {
                        leadData ? (
                            leadData?.is_interested ? (
                                <div className='product-category-view'>
                                    {leadData.product_category?.map((cheap, i) => (
                                        cheap.is_interested && (
                                            <div className='-styleout-modal' style={{ display: 'flex', gap: 6, }}>- {cheap.name}
                                                {
                                                    i === 0 && (
                                                        <div style={{ fontSize: '0.82vw' }}>
                                                            {cheap?.construction_type?.map((type) => (
                                                                <div>{'--> ' + type}</div>
                                                            ))}
                                                        </div>
                                                    )
                                                }
                                                {
                                                    i === 1 && (
                                                        <div style={{ fontSize: '0.82vw' }}>
                                                            {cheap?.construction_type?.map((type) => (
                                                                type.is_interested && (
                                                                    <div style={{ display: 'flex', gap: 2 }}>
                                                                        {'--> ' + type.name + ' ('}
                                                                        {
                                                                            type?.brands?.map((brand, index) => (
                                                                                <div key={index}>{brand}{index !== type.brands.length - 1 && ','}</div>
                                                                            ))
                                                                        }
                                                                        {')'}
                                                                    </div>
                                                                )
                                                            ))}
                                                        </div>
                                                    )
                                                }
                                            </div>
                                        )
                                    ))}
                                </div>
                            ) : (
                                <span>--/--</span>
                            )
                        ) : (
                            reportData?.is_interested ? (
                                <div className='product-category-view'>
                                    {reportData.product_category?.map((cheap, i) => (
                                        cheap.is_interested && (
                                            <div className='-styleout-modal' style={{ display: 'flex', gap: 6, }}>- {cheap.name}
                                                {
                                                    i === 0 && (
                                                        <div style={{ fontSize: '0.82vw' }}>
                                                            {cheap?.construction_type?.map((type) => (
                                                                <div>{'--> ' + type}</div>
                                                            ))}
                                                        </div>
                                                    )
                                                }
                                                {
                                                    i === 1 && (
                                                        <div style={{ fontSize: '0.82vw' }}>
                                                            {cheap?.construction_type?.map((type) => (
                                                                type.is_interested && (
                                                                    <div style={{ display: 'flex', gap: 2 }}>
                                                                        {'--> ' + type.name + ' ('}
                                                                        {
                                                                            type?.brands?.map((brand, index) => (
                                                                                <div key={index}>{brand}{index !== type.brands.length - 1 && ','}</div>
                                                                            ))
                                                                        }
                                                                        {')'}
                                                                    </div>
                                                                )
                                                            ))}
                                                        </div>
                                                    )
                                                }
                                            </div>
                                        )
                                    ))}
                                </div>
                            ) : (
                                <span>--/--</span>
                            )
                        )
                    }

                </div>

                <div className='detail'>
                    <span>Conversation</span>

                    {leadData ? (
                        leadData?.conversation ? (
                            leadData?.conversation
                        ) : (
                            <span>--/--</span>
                        )
                    ) : (
                        reportData?.conversation ? (
                            reportData?.conversation
                        ) : (
                            <span>--/--</span>
                        )
                    )}
                </div>
                <div className='detail'>
                    <span>Minutes of Meeting</span>
                    {leadData ? (
                        leadData?.minutes_of_meeting ? (
                            leadData?.minutes_of_meeting
                        ) : (
                            <span>--/--</span>
                        )
                    ) : (
                        reportData?.minutes_of_meeting ? (
                            reportData?.minutes_of_meeting
                        ) : (
                            <span>--/--</span>
                        )
                    )}
                </div>
            </div>
        </div>
    )
}

export default LeadsDetailModal
