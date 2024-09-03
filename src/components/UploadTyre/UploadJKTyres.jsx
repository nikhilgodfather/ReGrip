import React, { useState } from 'react';
import './UploadJKTyres.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faFileUpload } from '@fortawesome/free-solid-svg-icons';
import AddedPopup from './AddedPopup';
import axios from 'axios';

const UploadJKTyres = () => {
  const [file, setFile] = useState(null);
  const [data, setData] = useState(null);
  const [addeddSuccessPopUp, setAddedSuccessPopUp] = useState(false);
  const [tyreSNs, setTyreSNs] = useState([
    'CP1069875225',
    'CP1069875225',
    'CP1069875225',
    'CP1069875225',
  ]);
  const [loading, setLoading] = useState(false)

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (file) {
      console.log('File submitted:', file);
    } else {
      alert('Please upload a file before submitting.');
    }
  };

  const handleFileAdded = async () => {
    setLoading(true)
    const formData = new FormData();
    formData.append('file', file);
    try {
      const response = await axios.post('http://localhost:3000/api/jk-inspection/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('File submitted:', response.data);
      setData(response.data);
      setAddedSuccessPopUp(!addeddSuccessPopUp);
      setLoading(false)
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Error uploading file. Please try again.');
      setLoading(false)
    }
  };

  return (
    <div className="upload-jk-tyres-container">
      <div className="header-new-jk">
        <h2 className="upload-header">Upload JK Tyres</h2>
        <div className="search-container">
          <input type="text" className="search-bar-new" placeholder="Search..." />
        </div>
      </div>
      <div className="inner-box">
        <form className="upload-form" onSubmit={handleSubmit}>
          <div className="file-upload-section-jk-new">
            <label htmlFor="file-upload" className="file-label-jk-new">
               Upload JK Tyres Details *
            </label>
            <input
              id="file-upload"
              type="file"
              onChange={handleFileChange}
              className="file-input"
            />
            <p className='successfully-uploaded'>{file ? `${file.name}`: null}</p>
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
        <button type="submit" className="submit-button-new-jk" onClick={handleFileAdded} disabled={loading}>
          {loading ? 'Loading...' : 'Submit'}
        </button>
      </div>
      {addeddSuccessPopUp && <AddedPopup onClose={handleFileAdded} data={data}/>}
    </div>
  );
};

export default UploadJKTyres;
