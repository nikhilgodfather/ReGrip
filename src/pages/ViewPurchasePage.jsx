import React from 'react'
import Sidebar from '../components/SideBarNew/SidebarNew';
import ViewPurchase from '../components/View Purchase/ViewPurchase';
const ViewPurchasePage = ({activeItem , activeMenu}) => {
  return (
    <div>
      <Sidebar activeItem={activeItem}/>
      <ViewPurchase activeMenu={activeMenu}/>
    </div>
  )
}

export default ViewPurchasePage
