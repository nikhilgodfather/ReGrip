import React, { useState } from "react";
import "./SelectBatchModal.css";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { API_URL } from '../Config/index';
import DownloadReportModal from './ExcelSheetModal'

const SelectBatchModal = ({ setIsOpenExcelModal, cmp, fromDate, toDate }) => {

    const [isModalOpen, setIsModalOpen] = useState(false);



    return (
        <div className="select-batch-modal-div">
            {isModalOpen && <DownloadReportModal setIsModalOpen={setIsModalOpen} cmp={cmp} fromDate={fromDate} toDate={toDate} />}
            <div className="Select-batch-container">
                <div className="Select-batch-head">
                    <div className="heading">
                        <h2>Select Batch</h2>
                    </div>
                    <div className="close-btn">
                        <button onClick={() => { setIsOpenExcelModal(false) }}><FontAwesomeIcon icon={faXmark} style={{ color: "#ffffff", }} /></button></div>
                </div>
                <div className="select-batch">
                    <h1 onClick={() => { setIsModalOpen(true) }}>Batch</h1>
                </div>
            </div>
        </div>
    );
};

export default SelectBatchModal;
