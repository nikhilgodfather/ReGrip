import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes} from '@fortawesome/free-solid-svg-icons';

const AddPurchaseTyreDetails = ({onClose , onConfirm}) => {

    const handleAddPurchaseDetailsConfirm = () =>{
      onConfirm();
    }
  return (
    <div className="popup-overlay">
      <div className="popup-content">
      <div className="popup-close" onClick={onClose}>
          <FontAwesomeIcon icon={faTimes} />
        </div>
        <h3 className='view-purchase-tyre-Details'>View Purchase Tyre Details</h3>
        
        <div className="table-container-view-purchase-Tyre-Detail">
        <div className="Overview-table">
            <p className='Overview-item'>1000-20 (04)</p>
            <p className='Overview-item'>1100-20 (01)</p>
            <p className='Overview-item'>All (06)</p>
            <p className='Overview-item'>|</p>
            <p className='Overview-item'>A (03)</p>
            <p className='Overview-item'>B (01)</p>
            <p className='Overview-item'>C (01)</p>
            <p className='Overview-item'>D (01)</p>
            <p className='Overview-item'>ALL (06)</p>
          </div>
                <table className="inspection-table">
                    <thead>
                        <tr>
                            <th>Type Serial Number</th>
                            <th>Category </th>
                            <th>Brand</th>
                            <th>Size</th>
                            <th>Model</th>
                            <th>Date of Inspection</th>
                            <th>Inspection Batch No.</th>
                        </tr>
                    </thead>
                    <tbody>
                    <tr>
                            <td>02X 882DA AA3</td>
                            <td>A</td>
                            <td>Ceat</td>
                            <td>1000-20</td>
                            <td>JUHS</td>
                            <td>29 Aug 2024</td>
                            <td>123</td>
                        </tr>
                        <tr>
                            <td>02X 882DA AA3</td>
                            <td>A</td>
                            <td>Ceat</td>
                            <td>1000-20</td>
                            <td>JUHS</td>
                            <td>29 Aug 2024</td>
                            <td>123</td>
                        </tr>
                        <tr>
                            <td>02X 882DA AA3</td>
                            <td>A</td>
                            <td>Ceat</td>
                            <td>1000-20</td>
                            <td>JUHS</td>
                            <td>29 Aug 2024</td>
                            <td>123</td>
                        </tr>
                        <tr>
                            <td>02X 882DA AA3</td>
                            <td>A</td>
                            <td>Ceat</td>
                            <td>1000-20</td>
                            <td>JUHS</td>
                            <td>29 Aug 2024</td>
                            <td>123</td>
                        </tr>
                        <tr>
                            <td>02X 882DA AA3</td>
                            <td>A</td>
                            <td>Ceat</td>
                            <td>1000-20</td>
                            <td>JUHS</td>
                            <td>29 Aug 2024</td>
                            <td>123</td>
                        </tr>
                        <tr>
                            <td>02X 882DA AA3</td>
                            <td>A</td>
                            <td>Ceat</td>
                            <td>1000-20</td>
                            <td>JUHS</td>
                            <td>29 Aug 2024</td>
                            <td>123</td>
                        </tr>
                        <tr>
                            <td>02X 882DA AA3</td>
                            <td>A</td>
                            <td>Ceat</td>
                            <td>1000-20</td>
                            <td>JUHS</td>
                            <td>29 Aug 2024</td>
                            <td>123</td>
                        </tr>
                        <tr>
                            <td>02X 882DA AA3</td>
                            <td>A</td>
                            <td>Ceat</td>
                            <td>1000-20</td>
                            <td>JUHS</td>
                            <td>29 Aug 2024</td>
                            <td>123</td>
                        </tr>
                        <tr>
                            <td>02X 882DA AA3</td>
                            <td>A</td>
                            <td>Ceat</td>
                            <td>1000-20</td>
                            <td>JUHS</td>
                            <td>29 Aug 2024</td>
                            <td>123</td>
                        </tr>
                        <tr>
                            <td>02X 882DA AA3</td>
                            <td>A</td>
                            <td>Ceat</td>
                            <td>1000-20</td>
                            <td>JUHS</td>
                            <td>29 Aug 2024</td>
                            <td>123</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <button className="Confirm-button" onClick={handleAddPurchaseDetailsConfirm}>
          Confirm
        </button>
      </div>
    </div>
  )
}

export default AddPurchaseTyreDetails
