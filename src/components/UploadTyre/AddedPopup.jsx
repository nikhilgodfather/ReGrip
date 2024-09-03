import React , {useState} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import './AddedPopUp.css'; // Ensure you have the CSS file for styling
import { AssignPopup } from './MatchedTyreDetails/AssignPopup';

const AddedPopup = ({ onClose, data }) => {
    const [matchedTyre , setMatchedTyre] = useState(false)

    const handleMatchedTyreDetails = () =>{
     setMatchedTyre(!matchedTyre)
    }
    const handleConfirmDetails = () =>{
      setMatchedTyre(!matchedTyre)
      onClose();
    }
  return (
    <div className="popup-overlay">
      <div className="popup-container">
        <div className="popup-close" onClick={onClose}>
          <FontAwesomeIcon icon={faTimes} />
        </div>
        <div className="popup-logo">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="success-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>
        <h2 className="popup-message">{data ? data.message : null}</h2>
        <button className="view-button" onClick={handleMatchedTyreDetails}>View</button>
      </div>
      {matchedTyre && <AssignPopup data={data}  onClose={handleMatchedTyreDetails} onConfirm={handleConfirmDetails}/>}
    </div>
  );
};

export default AddedPopup;
