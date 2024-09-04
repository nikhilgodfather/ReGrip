import React from 'react'
import { Route, Routes} from "react-router-dom";
import UploadJKTyrePage from "./pages/UploadJKTyrePage";
import ViewJKBatch from "./pages/ViewJKBatchPage";
import TyreConsoleReportPage from "./pages/TyreConsoleReportPage"
import Dashboard from "./pages/Dashboard";
import ViewPurchasePage from './pages/ViewPurchasePage';
import AddPurchasePage from './pages/AddPurchasePage';
const NewSidebarAllRoutes = () => {
  return (
    <div>
      <Routes>
       <Route path='/RegripERP' element={<Dashboard />}/>
        <Route path='/UploadJKTyre' element={<UploadJKTyrePage activeItem="Tyre-Console-Report"/>}/>
         <Route path='/viewJkBatch' element={<ViewJKBatch activeItem="Tyre-Console-Report"/>}/>
         <Route path='/tyreConsoleReport' element={<TyreConsoleReportPage activeItem="Tyre-Console-Report"/>}/>
         <Route path='/viewPurchase' element={<ViewPurchasePage activeItem="View-Purchase" activeMenu="Casing-From-JK"/>}/>
         <Route path='/addpurchase' element={<AddPurchasePage activeItem="Add-Purchase" activeMenu="Casing-From-JK"/>}/>
         </Routes>
    </div>
  )
}

export default NewSidebarAllRoutes
