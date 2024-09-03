import React from 'react'
import { Route, Routes} from "react-router-dom";
import UploadJKTyrePage from "./pages/UploadJKTyrePage";
import ViewJKBatch from "./pages/ViewJKBatchPage";
import TyreConsoleReportPage from "./pages/TyreConsoleReportPage"
import Dashboard from "./pages/Dashboard";
const NewSidebarAllRoutes = () => {
  return (
    <div>
      <Routes>
       <Route path='/Dash' element={<Dashboard />}/>
        <Route path='/UploadJKTyre' element={<UploadJKTyrePage activeItem="Tyre-Console-Report"/>}/>
         <Route path='/viewJkBatch' element={<ViewJKBatch activeItem="Tyre-Console-Report"/>}/>
         <Route path='/tyreConsoleReport' element={<TyreConsoleReportPage activeItem="Tyre-Console-Report"/>}/>
         </Routes>
    </div>
  )
}

export default NewSidebarAllRoutes
