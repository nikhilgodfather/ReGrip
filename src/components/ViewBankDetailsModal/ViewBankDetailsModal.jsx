import React, { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import "./ViewBankDetailsModal.css"
import { API_URL } from "../Config/index";

const ViewBankDetailsModal = ({ setBankDetailsViewForm, setSupplierId, supplierId }) => {


    const [accountHolderName, setAccountHolderName] = useState('not found');
    const [accountNumber, setAccountNumber] = useState('');
    const [ifscCode, setIfscCode] = useState('');
    // const [bankName, setBankName] = useState('');

    function changeModalState() {
        setBankDetailsViewForm(false);
    }
    const getBankData = async () => {
        try {
            const { data } = await axios.get(`${API_URL}/supplier/bankdetails?supplierId=${supplierId}`);
            const bankDetails = data.rows;

            if (bankDetails.length > 0) {
                const bankDetail = bankDetails[0];
                setAccountHolderName(bankDetail.account_holder_name);
                // setBankName(bankDetail.bank_name);
                setAccountNumber(bankDetail.account_number);
                setIfscCode(bankDetail.ifsc_code);
            } else {
                console.log("No bank details found.");
            }
        } catch (error) {
            console.error("An error occurred while fetching Bank data:", error);
        }
    };


    useEffect(() => {
        getBankData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className='Bank-details-view-modal'>
            <div className="Bank-details-form">
                <div className='modal-left-side'></div>
                <div className="main-modal">
                    <div className='Bank-details'>
                        <header className='Bank-details-header'>
                            <div className='modal-header'>
                                <h2>Bank Details</h2>
                            </div>
                            <div className="close-btn">
                                <button onClick={changeModalState}><FontAwesomeIcon icon={faXmark} style={{ color: "rgb(78 77 77)", }} /></button>
                            </div>
                        </header>
                    </div>
                    <div className="bank-form">
                        <form action="" className="bankDetails-form">
                            <div className="bankDetails-form-input">
                                <label htmlFor="AccountHolderName">Account holder name</label>
                                <input type="text" name="account_holder_name" id="account_holder_name" value={accountHolderName} onChange={(e) => setAccountHolderName(e.target.value)} readOnly />
                            </div>
                            {/* <div className="bankDetails-form-input">
                                <label htmlFor="BankName">Bank name</label>
                                <input type="text" name="bank_name" id="bank_name" value={bankName} onChange={(e) => setBankName(e.target.value)} readOnly />
                            </div> */}
                            <div className="bankDetails-form-input">
                                <label htmlFor="accountNumber">Account number</label>
                                <input type="text" name="account_number" id="account_number" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} readOnly />
                            </div>
                            <div className="bankDetails-form-input">
                                <label htmlFor="ifscCode">IFSC code</label>
                                <input type="text" name="ifsc_code" id="ifsc_code" value={ifscCode} onChange={(e) => setIfscCode(e.target.value)} readOnly />
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ViewBankDetailsModal
