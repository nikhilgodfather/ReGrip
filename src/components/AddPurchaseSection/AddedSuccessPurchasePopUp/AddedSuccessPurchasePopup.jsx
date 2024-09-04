import React , {useState} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretRight, faCheck, faCircleCheck, faFlagCheckered, faRightFromBracket, faTimes } from '@fortawesome/free-solid-svg-icons';

const AddedSuccessPurchasePopup = ({ onClose}) => {
    const popupstyle ={
        width:'200px'
    }
  return (
    <div className="popup-overlay">
      <div className="popup-container">
        <div className="popup-close" onClick={onClose}>
          <FontAwesomeIcon icon={faTimes} />
        </div>
        <div className="popup-logo">
          <FontAwesomeIcon icon={faCircleCheck} style={popupstyle}/>
        </div>
        <h2 className="popup-message">Added Successfully!</h2>
        <button className="view-button" >View</button>
      </div>
      
    </div>
  );
};

export default AddedSuccessPurchasePopup;
