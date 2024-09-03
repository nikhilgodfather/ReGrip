import React, { useState } from 'react';
import './AddPurchase.css';

const AddPurchase = ({activeMenu}) => {
  const [tyreSNs, setTyreSNs] = useState([
    'CP1069875225',
    'CP1069875225',
    'CP1069875225',
    'CP1069875225',
  ]);

  return (
    <div className="addPurchase-container">
      <h2 className="header-title">Add Purchase</h2>
      <div className='menu-container-view-purchase'>
        <ul>
        <li className={`menu-Item ${activeMenu==='Casing-From-JK' ? 'active' : ''}`}>Casing From JK</li>
            <li className={`menu-Item ${activeMenu==='Belt' ? 'active' : ''}`}>Belt</li>
            <li className={`menu-Item ${activeMenu==='Ready-Retread'  ? 'active' : ''}`}>Ready Retread</li>
            <input type="text" className='menu-searchBar' placeholder='Search...'/>
        </ul>
    </div>

      <form className="purchase-form">
        <div className="form-row">
          <div className="form-group">
            <label>Invoice Number *</label>
            <input type="text" placeholder="Enter Invoice Number" />
          </div>
          <div className="form-group">
            <label>Invoice Date *</label>
            <input type="date" value="2024-08-22" />
          </div>
          <div className="form-group">
            <label>Delivery Location *</label>
            <input type="text" placeholder="Delivery Location" />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Purchase Tyre Count *</label>
            <input type="text" placeholder="Enter Purchase Tyre Count" />
          </div>
          <div className="form-group">
            <label>Basic Amount *</label>
            <input type="text" placeholder="Enter Basic Amount" />
          </div>
          <div className="form-group">
            <label>GST Amount *</label>
            <input type="text" placeholder="Enter GST Amount" />
          </div>
          <div className="form-group">
            <label>Total Amount *</label>
            <input type="text" placeholder="Total GST Amount" />
          </div>
        </div>
        <div className='inner-box-addpurchase'>
        <form className="upload-xl-add-purchase" >
          <div className="file-upload-section">
            <label htmlFor="file-upload" className="file-label">
               Upload JK Tyres Details *
            </label>
            <input
              id="file-upload"
              type="file"
              className="file-input"
            />
            <p className='successfully-uploaded'></p>
            <a href="/path/to/excel-template.xlsx" className="download-template">
              Download Excel Template
            </a>
          </div>
          <div className="tyre-sn-list">
            <table>
              <thead>
                <tr>
                  <th>Tyre SN</th>
                </tr>
              </thead>
              <tbody>
                {tyreSNs.map((sn, index) => (
                  <tr key={index}>
                    <td>{sn}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </form>
        </div>
       
        <button type="submit" className="submit-button-new-jk" >
         Submit
        </button>
      </form>
    </div>
  );
};

export default AddPurchase;
