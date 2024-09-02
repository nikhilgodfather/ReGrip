import React, { useState } from 'react'
import "../../components/ShowEmployeIndividualDetail/EmployeDetail.css"
import 'react-loading-skeleton/dist/skeleton.css'
import { API_URL } from '../Config'
import Attendance from './Attendance/Attendance'
import PersonalDetails from './PersonalDetails/PersonalDetails'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { Button, ToggleButtonGroup, Sheet } from '@mui/joy';
import defaultProfile from '../../assets/employee_profile.png'

const EmployeDetails = ({ employeeData, setShowEmployeeModal, setEmployeeListVisible,employees,getAllEmployeeData }) => {
  const [index, setIndex] = useState("1")
  function handleBackButtonClick() {
    console.log("OP")
    setShowEmployeeModal(false);
    setEmployeeListVisible(true)
  }

  return (
    <div className='Employe-details-main-container' >
      {/* <FontAwesomeIcon onClick={() => { handleBackButtonClick() }} className='back-button' icon={faChevronLeft} style={{ marginRight: 6, cursor: 'pointer', fontSize: '30' }} /> */}



      <div className='employee-details-sub-container'>
        <div className='employee-picture'>
          <img
            src={employeeData.face_photo_url ? `${API_URL}/upload/readimageurl?imagename=${employeeData.face_photo_url}&folder=employee` : defaultProfile}
            alt=''
            width='100'
            height='100'
            style={{ borderRadius: 50, objectFit: 'fill' }} />
        </div>
        <div className='employee-personal-details'>
          <p style={{ fontSize: '25px', fontWeight: '500', color: 'black' }}>{employeeData.first_name} {employeeData.last_name}</p>
          <p style={{ paddingTop: '0px' }}>{employeeData.job_title}</p>
          <p>{employeeData.mobile_number}</p>
          <p style={{ textTransform: 'lowercase' }}>{employeeData.email}</p>
          <p></p>
        </div>

      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <ToggleButtonGroup
          value={index}
          onChange={(event, newValue) => {
            setIndex(newValue)
          }}
          className='button-container'
        >
          <Button value="1">Personal Info</Button>
          <Button value="2">Attendance & Leave</Button>


        </ToggleButtonGroup>
      </div>
      {
        index === "1" ?
          < PersonalDetails
            employeeData={employeeData}
            employees={employees}
            getAllEmployeeData={getAllEmployeeData}
          />
          :
          <Attendance
            employeeData={employeeData}
          />
      }
    </div>


  )
}

export default EmployeDetails