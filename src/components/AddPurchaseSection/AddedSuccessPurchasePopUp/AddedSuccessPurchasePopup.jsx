import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { faCheckCircle } from '@fortawesome/free-regular-svg-icons';
import AddPurchaseTyreDetails from '../AddPurchaseTyreDetails/AddPurchaseTyreDetails';

const AddedSuccessPurchasePopup = ({ onClose , onConfirm}) => {
    const iconStyle = {
        fontSize: '68px' // Increase the size as needed
    };
    const [addPurchaseTyreDetailsPopup , setAddPurchaseTyreDetailsPopup] = useState(false)
    
    const handleViewTyresDetailsPopup = () =>{
      setAddPurchaseTyreDetailsPopup(!addPurchaseTyreDetailsPopup)
    } 
    return (
        <div className="popup-overlay">
            <div className="popup-container">
                <div className="popup-close" onClick={onClose}>
                    <FontAwesomeIcon icon={faTimes} />
                </div>
                <div className="popup-logo-add-purchase">
                    <FontAwesomeIcon icon={faCheckCircle} style={iconStyle} />
                </div>
                <h2 className="popup-message">Added Successfully!</h2>
                <button className="view-button" onClick={handleViewTyresDetailsPopup}>View</button>
            </div>
            {addPurchaseTyreDetailsPopup && <AddPurchaseTyreDetails onClose={handleViewTyresDetailsPopup} onConfirm={onConfirm}/>}
        </div>
    );
};

export default AddedSuccessPurchasePopup;
