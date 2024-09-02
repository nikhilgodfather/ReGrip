import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { API_URL } from '../../Config/index';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import Skeleton from 'react-loading-skeleton';
// import AddCustomer from '../../AddCustomer/AddCustomer';
import './OpenLeads.css'
import ReassignLeadModal from './ReassignLeadModal.jsx/ReassignLeadModal';

const OpenLeads = ({ setShowLeadsModal, leadsData, setLeadsListVisible }) => {
  const dummmyArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const [loading, setLoading] = useState(true);
  const [openLeadsData, setOpenLeadsData] = useState([]);
  const [showReassignLeadModal, setShowReassignLeadModal] = useState(false)
  const [selectedLead, setSelectedLead] = useState()
  const [leads, setLeads] = useState([])
  const handleReAssignLeadButton = (data) => {
    setShowReassignLeadModal(true)
    setSelectedLead(data)
  }


  function handleBackButtonClick() {
    console.log("leads", leadsData)
    setShowLeadsModal(false);
    setLeadsListVisible(true)
  }



  const getOpenLeads = async () => {
    try {
      setLoading(true)
      const { data } = await axios.get(`${API_URL}/lead/open-leads`);
      console.log(data.data)
      setLoading(false);
      setLeads(data.data)
    }
    catch (e) {
      console.log("Error while fetching data:", e.message)
    }
  }
  useEffect(() => {
    getOpenLeads();
  }, []);

  return (
    <div className="Fleet-container" style={{ marginLeft: 0, position: "absolute", zIndex: 1000, backgroundColor: "#F7F7F7" }}>
      <div>
        {showReassignLeadModal && (
          <ReassignLeadModal
            setShowReassignLeadModal={setShowReassignLeadModal}
            selectedLead={selectedLead}

          />
        )}
        <div className="Fleet-header">
          <div className="head" style={{ display: 'flex' }}>
            <h1 className="heading1" style={{ marginBottom: '3px' }}>
              <FontAwesomeIcon
                onClick={() => {
                  handleBackButtonClick();
                }}
                icon={faChevronLeft}
                color="#65a143"
                style={{ marginRight: 6, cursor: 'pointer' }}
              />
              Open Leads
            </h1>
          </div>
        </div>
      </div>
      <div className='scroll-container' >
        <div className='align-card' >
          {
            leads.map((lead) => {
              const conversations = lead.conversation.substring(0, 150);
              return (
                <div className='card-Open-Leads' >
                  <div className='card-data-alignments'>
                    <div className='card-data-alignment-secondary'>
                      <h6 className='heading'>
                        Customer name
                      </h6>
                      <h5 className='subheading'>{lead.customer_name}</h5>
                    </div>
                    <div className='card-data-alignment-secondary'>
                      <h6 className='heading'>
                        Person name - Designation
                      </h6>
                      <h5 className='subheading'>
                        {lead.meeting_person_name} - {lead.meeting_person_designation}
                      </h5>
                    </div>

                    <div className='card-data-alignment-secondary'>
                      <h6 className='heading'>
                        Type
                      </h6>
                      <h5 className='subheading'>{lead.visit_type}</h5>
                    </div>
                    <div className='card-data-alignment-secondary'>
                      <h6 className='heading'>
                        Status
                      </h6>
                      <h5 className='subheading'>{lead.lead_status}</h5>
                    </div>
                  </div>
                  <div className='card-data-alignments'>
                    <div >
                      <h6 className='heading'>
                        Conversation
                      </h6>
                      <div className=''>
                        <p style={{ height: "40px" }} className='conversation-style' title={`${lead.conversation.length >= 150 ? `${lead.conversation}` : ""}`}>
                          {conversations.length >= 150 ? `${conversations}...` : conversations}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className='card-data-alignments' >
                    <div className='' style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                      <h6 className='heading'>Products Category</h6>
                      <div className='' style={{ width: "180px", display: "flex", flexWrap: "wrap", gap: "8px" }}>
                        {lead.product_category.map((cheap) => (
                          <button className='cheaps-style' >{cheap}</button>
                        ))}

                      </div>
                    </div>
                    <div className='' style={{ display: "flex", justifyContent: "space-between" }}>
                      <div className='card-data-alignment-secondary'>
                        <h6 className='heading'>
                          Sales Person names
                        </h6>
                        <h5 className='subheading'>{lead.sales_person_name}</h5>
                      </div>
                    </div>

                    <div className='' style={{ display: "flex", justifyContent: "space-between" }}>
                      <div className='card-data-alignment-secondary'>
                        <h6 className='heading'>
                          Meeting Date
                        </h6>
                        <h5 className='subheading'>{new Date(lead.meeting_time).toLocaleDateString()}</h5>
                      </div>
                    </div>
                    <div><button className='reasign-btn' onClick={() => { handleReAssignLeadButton(lead) }}>ReAssign</button></div>
                  </div>
                </div>
              )
            })
          }
        </div>
      </div>
    </div >
  );
};

export default OpenLeads;
