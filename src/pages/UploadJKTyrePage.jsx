import React from 'react'
import Sidebar from '../components/SideBarNew/SidebarNew'
import UploadJKTyres from '../components/UploadTyre/UploadJKTyres'
const UploadJKTyrePage = ( {activeItem}) => {
  return (
    <div>
      <Sidebar activeItem="upload-jk-tyres"/>
      <UploadJKTyres/>
    </div>
  )
}

export default UploadJKTyrePage
