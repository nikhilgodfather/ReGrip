import React from "react";
import "./AssignPopup.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
export const AssignPopup = ({ onClose, onConfirm, data }) => {
  const handleDetailConfirm = () => {
    onConfirm();
  };
  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <div className="popup-close" onClick={onClose}>
          <FontAwesomeIcon icon={faTimes} />
        </div>
        <h3 className="Header-Matched-tyre-Details">Matched Tyre Details</h3>

        <div className="table-container">
          <div className="Overview-table">
            <p className="Overview-item">Matched Tyres (04)</p>
            <p className="Overview-item">Category Mismatch (01)</p>
            <p className="Overview-item">Tyre SN Mismatch (01)</p>
            <p className="Overview-item">Total Tyre (06)</p>
            <p className="Overview-item">|</p>
            <p className="Overview-item">A (03)</p>
            <p className="Overview-item">B (01)</p>
            <p className="Overview-item">C (01)</p>
            <p className="Overview-item">D (01)</p>
            <p className="Overview-item">ALL (06)</p>
          </div>
          <table className="inspection-table">
            <thead>
              <tr>
                <th>Type Serial Number</th>
                <th>Category as per JK sheet</th>
                <th>Category as per Regrip</th>
                <th>Brand</th>
                <th>Size</th>
                <th>Model</th>
                <th>Date of Inspection</th>
                <th>Inspection Batch No.</th>
                <th>Matching Status</th>
              </tr>
            </thead>
            <tbody>
              {data.data?.map((tyre, index) => (
                <tr key={index}  className={`${tyre.mismatches['tyre_category'] | tyre.mismatches['tyre_serial_number'] ? 'error-type-table-data': 'normal-black'}`}>
                  <td>
                    {tyre.tyre_serial_number}
                  </td>
                  <td style={{ color: "black" }}>
                    {tyre.tyre_category}
                  </td>
                  <td style={{ color: "black" }}>
                    {tyre.tyre_category_2}
                  </td>
                  <td style={{ color: "black" }}>{tyre.Brand}</td>
                  <td style={{ color: "black" }}>{tyre.Size}</td>
                  <td style={{ color: "black" }}>{tyre.Model}</td>
                  <td style={{ color: "black" }}>
                    {tyre.date_of_inspection}
                  </td>
                  <td style={{ color: "black" }}>
                    NA
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button className="Confirm-button" onClick={handleDetailConfirm}>
          Confirm
        </button>
      </div>
    </div>
  );
};
