import React from 'react'
import Sidebar from '../components/SideBarNew/SidebarNew';
import AddPurchase from '../components/AddPurchaseSection/AddPurchase';
const AddPurchasePage = ({activeItem , activeMenu}) => {
  return (
    <div>
      <Sidebar activeItem={activeItem} />
      <AddPurchase activeMenu={activeMenu}/>
    </div>
  )
}

export default AddPurchasePage
