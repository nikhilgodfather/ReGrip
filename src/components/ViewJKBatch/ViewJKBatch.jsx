import React from 'react';
import './ViewJKBatch.css';

const ViewJKBatch = () => {
  return (
    <div className="view-jk-batch-container-new">
      <div className="batch-header">
        <h2>View JK Batch</h2>
        <div className="filters">
          <select className="filter-select">
            <option value="JK">JK</option>
            {/* Add more options as needed */}
          </select>
          <input type="date" className="date-input" placeholder="From: DD-MM-YYYY" />
          <input type="date" className="date-input" placeholder="To: DD-MM-YYYY" />
          <input type="text" placeholder="Search..." className="search-bar View-batch-searchbar"></input>
        </div>
      </div>
      
      <div className="table-container-view">
        <table className="batch-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Total Tyres</th>
              <th>Matched Tyres</th>
              <th>Category Mismatch</th>
              <th>Tyre SN Mismatch</th>
              <th>Download</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>8 Sep 23</td>
              <td>6</td>
              <td>4</td>
              <td>1</td>
              <td>1</td>
              <td><button className="download-btn">📄</button></td>
            </tr>
            <tr>
              <td>8 Sep 23</td>
              <td>6</td>
              <td>4</td>
              <td>1</td>
              <td>1</td>
              <td><button className="download-btn">📄</button></td>
            </tr>
            <tr>
              <td>8 Sep 23</td>
              <td>6</td>
              <td>4</td>
              <td>1</td>
              <td>1</td>
              <td><button className="download-btn">📄</button></td>
            </tr>
            <tr>
              <td>8 Sep 23</td>
              <td>6</td>
              <td>4</td>
              <td>1</td>
              <td>1</td>
              <td><button className="download-btn">📄</button></td>
            </tr>
            <tr>
              <td>8 Sep 23</td>
              <td>6</td>
              <td>4</td>
              <td>1</td>
              <td>1</td>
              <td><button className="download-btn">📄</button></td>
            </tr>
            <tr>
              <td>8 Sep 23</td>
              <td>6</td>
              <td>4</td>
              <td>1</td>
              <td>1</td>
              <td><button className="download-btn">📄</button></td>
            </tr>
            <tr>
              <td>8 Sep 23</td>
              <td>6</td>
              <td>4</td>
              <td>1</td>
              <td>1</td>
              <td><button className="download-btn">📄</button></td>
            </tr>
            <tr>
              <td>8 Sep 23</td>
              <td>6</td>
              <td>4</td>
              <td>1</td>
              <td>1</td>
              <td><button className="download-btn">📄</button></td>
            </tr>
            <tr>
              <td>8 Sep 23</td>
              <td>6</td>
              <td>4</td>
              <td>1</td>
              <td>1</td>
              <td><button className="download-btn">📄</button></td>
            </tr>
            <tr>
              <td>8 Sep 23</td>
              <td>6</td>
              <td>4</td>
              <td>1</td>
              <td>1</td>
              <td><button className="download-btn">📄</button></td>
            </tr>
            <tr>
              <td>8 Sep 23</td>
              <td>6</td>
              <td>4</td>
              <td>1</td>
              <td>1</td>
              <td><button className="download-btn">📄</button></td>
            </tr>
            <tr>
              <td>8 Sep 23</td>
              <td>6</td>
              <td>4</td>
              <td>1</td>
              <td>1</td>
              <td><button className="download-btn">📄</button></td>
            </tr>
            <tr>
              <td>8 Sep 23</td>
              <td>6</td>
              <td>4</td>
              <td>1</td>
              <td>1</td>
              <td><button className="download-btn">📄</button></td>
            </tr>
            <tr>
              <td>8 Sep 23</td>
              <td>6</td>
              <td>4</td>
              <td>1</td>
              <td>1</td>
              <td><button className="download-btn">📄</button></td>
            </tr>
            <tr>
              <td>8 Sep 23</td>
              <td>6</td>
              <td>4</td>
              <td>1</td>
              <td>1</td>
              <td><button className="download-btn">📄</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewJKBatch;
