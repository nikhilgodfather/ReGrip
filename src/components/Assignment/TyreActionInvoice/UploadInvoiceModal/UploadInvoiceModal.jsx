import axios from "axios";
import { API_URL } from "../../../Config";
import { useState } from "react";
import './UploadInvoiceModal.css';
import { CircularProgress } from "@mui/material";

const UploadInvoiceModal = ({ handleSubmit, setShowUploadInvoiceModal }) => {

    const [invoicePdf, setInvoicePdf] = useState(null);
    const [showUploadWarning, setShowUploadWarning] = useState(false);
    const [loading, setLoading] = useState(false)

    const handleSubmitInvoice = async () => {
        try {
            if (!invoicePdf) {
                setShowUploadWarning(true)
                return;
            }

            const token = localStorage.getItem("token");
            const bearer_token = "bearer " + JSON.parse(token);

            // Step 1: Request URL for uploading PDF
            setLoading(true)
            const { data } = await axios.get(`${API_URL}/upload/invoiceurl?fileType=application/pdf`, {
                headers: {
                    Authorization: bearer_token,
                },
            });

            // Create a separate async function for file upload
            const uploadFile = async (binaryData) => {
                const result = await axios.put(data.data.uploadURL, binaryData, {
                    headers: {
                        'Content-Type': 'application/pdf',
                        'Content-Length': invoicePdf.size.toString(),
                    },
                });
            };

            const reader = new FileReader();

            reader.onload = (e) => {
                const binary = e.target.result;

                uploadFile(binary);
            };

            reader.readAsArrayBuffer(invoicePdf);
            setShowUploadInvoiceModal(false)
            setLoading(false)
            await handleSubmit(data.data.key)

        } catch (e) {
            console.error(e.message);
            // Handle other errors
            setLoading(false)
        }
    };


    return (
        <div className="upload-invoice-modal">
            <div className="heading" style={{ width: '100%' }}>
                <h2 style={{ color: "#53a336", fontSize: "25px", textTransform: 'capitalize', textAlign: 'center' }}>Upload Invoice</h2>
            </div>
            <div className="input-field">
                <h5 style={{ marginBottom: 6 }}>Upload Invoice</h5>
                <input
                    style={{ width: '60%' }}
                    accept=".pdf"
                    type="file"
                    onChange={(event) => {
                        setInvoicePdf(event.target.files[0])
                        setShowUploadWarning(false)
                    }}
                />
                {
                    showUploadWarning &&
                    <p style={{ color: "red", fontSize: "12px" }}>Please Upload Invoice</p>
                }
            </div>
            {
                loading ?
                    <button className="submit-button" onClick={handleSubmitInvoice}>
                        <CircularProgress style={{ color: 'white', width: 15, height: 15 }} />
                    </button>

                    :
                    <button className="submit-button" onClick={handleSubmitInvoice}>
                        Upload
                    </button>
            }

        </div>
    );
};

export default UploadInvoiceModal;
