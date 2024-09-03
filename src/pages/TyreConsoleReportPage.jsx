import React from 'react'
import TyreConsoleReport from '../components/Tyre Console Report/TyreConsoleReport';
import Sidebar from '../components/SideBarNew/SidebarNew';
const TyreConsoleReportPage = ({activeItem}) => {
  return (
    <div>
      <Sidebar activeItem="Tyre-Console-Report"/>
      <TyreConsoleReport/>
    </div>
  )
}

export default TyreConsoleReportPage
