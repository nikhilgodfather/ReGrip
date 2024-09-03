import React from 'react'
import Sidebar from '../components/SideBarNew/SidebarNew'
import ViewJKBatch from '../components/ViewJKBatch/ViewJKBatch'
const ViewJKBatchPage = ({activeItem}) => {
  return (
    <div>
      <Sidebar activeItem="view-jk-batch"/>
      <ViewJKBatch/>
    </div>
  )
}

export default ViewJKBatchPage
