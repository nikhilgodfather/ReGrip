import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Customers from "./components/CRMS/Customers/Customers";
import Home from "./components/Home/Home";
import TyreInspection from "./components/TyreInspection/TyreInspection";
import Assignment from "./components/Assignment/Assignment";
import Claims from "./components/Claims/Claims";
import Crms from "./components/CRMS/Crms";
import Hrms from "./components/Hrms/Hrms";
import Supplier from "./components/Supplier/Supplier";
import Fleet from "./components/Fleet/Fleet";
import TyreInspectionByCategory from "./components/TyreInspectionCategory/TyreInspectionCategory";
import Reports from "./components/CRMS/Reports/Reports";
import Analytics from "./components/CRMS/Analytics/Analytics";
import Leaves from "./components/Hrms/leaves/Leaves";
import AllAttendance from "./components/Hrms/AllAttendance/AllAttendance";
import Users from "./components/Users/Users";
import OffshoreSales from "./components/Hrms/Offshore/OffshoreSales";
import EmployeeList from "./components/Hrms/EmployeeList";
import AssignmentRequest from "./components/Assignment/AssignmentRequest/AssignmentRequest";
import Report from "./components/Report/Report";

function AllRoutes() {
  const location = useLocation();

  return (
    <>
      <Routes location={location} key={location.pathname}>
        <Route path="/home" element={<Home />} />
        <Route path="/home/supplier" element={<Supplier />} />
        <Route path="/home/fleet" element={<Fleet />} />
        <Route path="/home/tyres/*" element={<TyreInspectionByCategory />} />

        <Route path="/tyre-inspection" element={<TyreInspection />} />
        <Route path="/report" element={<Report />} />

        <Route path="/assignment" element={<Assignment />} />
        <Route path="/assignment/*" element={<AssignmentRequest />} />

        <Route path="/claims" element={<Claims />} />

        <Route path="/organization" element={<Hrms />} />
        <Route path="/organization/employees" element={<EmployeeList />} />
        <Route path="/organization/leaves" element={<Leaves />} />
        <Route path="/organization/attendance" element={<AllAttendance />} />
        <Route path="/organization/users" element={<Users />} />
        <Route
          path="/organization/offshore-sales"
          element={<OffshoreSales />}
        />

        <Route path="/crms" element={<Crms />} />
        <Route path="/crms/customer" element={<Customers />} />
        <Route path="/crms/reports" element={<Reports />} />
        <Route path="/crms/analytics" element={<Analytics />} />
      </Routes>
    </>
  );
}

export default AllRoutes;
