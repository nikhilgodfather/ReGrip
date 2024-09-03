import React from 'react';
import './TyreConsoleReport.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { faPen } from '@fortawesome/free-solid-svg-icons/faPen';
const ViewJKBatch = () => {
  return (
    <div className="view-jk-batch-console-container-new">
      <div className="batch-header">
        <h2>Tyre Console Dashboard</h2>
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
      
      <div className="table-container-console">
        <table className="batch-table-console">
        <thead>
    <tr>
        <th>Ins. Batch <span>Number</span></th>
        <th>Ins. Date</th>
        <th>Fleet Name</th>
        <th>Tyres <span>Inspected</span></th>
        <th>Approved Tyres</th>
        <th>Tyres Pending <span>for Approval</span></th>
        <th>Total Invoice <span>Tyres</span></th>
    </tr>
       </thead>

          <tbody>
            <tr>
               <td>1</td>
               <td>8 Sep 23</td>
               <td>RITCO</td>
               <td className='Inspected-Tyre'><span className="Insepected-Tyre-highlight-text">10</span></td>
               <td className='Approved-Tyre'><span className='Approved-Tyre-Highlight-edit'>4 <span className='Approved-Edit'><FontAwesomeIcon icon={faPen} /></span></span></td>
               <td>6</td>
               <td className='Approved-Tyre'><span className='Approved-Tyre-Highlight-edit'>4 <span className='Approved-Edit'><FontAwesomeIcon icon={faPen} /></span></span></td>
            </tr>
            <tr>
               <td>1</td>
               <td>8 Sep 23</td>
               <td>RITCO</td>
               <td className='Inspected-Tyre'><span className="Insepected-Tyre-highlight-text">10</span></td>
               <td className='Approved-Tyre'><span className='Approved-Tyre-Highlight-edit'>4 <span className='Approved-Edit'><FontAwesomeIcon icon={faPen} /></span></span></td>
               <td>6</td>
               <td className='Approved-Tyre'><span className='Approved-Tyre-Highlight-edit'>4 <span className='Approved-Edit'><FontAwesomeIcon icon={faPen} /></span></span></td>
            </tr>
            <tr>
               <td>1</td>
               <td>8 Sep 23</td>
               <td>RITCO</td>
               <td className='Inspected-Tyre'><span className="Insepected-Tyre-highlight-text">10</span></td>
               <td className='Approved-Tyre'><span className='Approved-Tyre-Highlight-edit'>4 <span className='Approved-Edit'><FontAwesomeIcon icon={faPen} /></span></span></td>
               <td>6</td>
               <td className='Approved-Tyre'><span className='Approved-Tyre-Highlight-edit'>4 <span className='Approved-Edit'><FontAwesomeIcon icon={faPen} /></span></span></td>
            </tr>
            <tr>
               <td>1</td>
               <td>8 Sep 23</td>
               <td>RITCO</td>
               <td className='Inspected-Tyre'><span className="Insepected-Tyre-highlight-text">10</span></td>
               <td className='Approved-Tyre'><span className='Approved-Tyre-Highlight-edit'>4 <span className='Approved-Edit'><FontAwesomeIcon icon={faPen} /></span></span></td>
               <td>6</td>
               <td className='Approved-Tyre'><span className='Approved-Tyre-Highlight-edit'>4 <span className='Approved-Edit'><FontAwesomeIcon icon={faPen} /></span></span></td>
            </tr>
            <tr>
               <td>1</td>
               <td>8 Sep 23</td>
               <td>RITCO</td>
               <td className='Inspected-Tyre'><span className="Insepected-Tyre-highlight-text">10</span></td>
               <td className='Approved-Tyre'><span className='Approved-Tyre-Highlight-edit'>4 <span className='Approved-Edit'><FontAwesomeIcon icon={faPen} /></span></span></td>
               <td>6</td>
               <td className='Approved-Tyre'><span className='Approved-Tyre-Highlight-edit'>4 <span className='Approved-Edit'><FontAwesomeIcon icon={faPen} /></span></span></td>
            </tr>
            <tr>
               <td>1</td>
               <td>8 Sep 23</td>
               <td>RITCO</td>
               <td className='Inspected-Tyre'><span className="Insepected-Tyre-highlight-text">10</span></td>
               <td className='Approved-Tyre'><span className='Approved-Tyre-Highlight-edit'>4 <span className='Approved-Edit'><FontAwesomeIcon icon={faPen} /></span></span></td>
               <td>6</td>
               <td className='Approved-Tyre'><span className='Approved-Tyre-Highlight-edit'>4 <span className='Approved-Edit'><FontAwesomeIcon icon={faPen} /></span></span></td>
            </tr>
            <tr>
               <td>1</td>
               <td>8 Sep 23</td>
               <td>RITCO</td>
               <td className='Inspected-Tyre'><span className="Insepected-Tyre-highlight-text">10</span></td>
               <td className='Approved-Tyre'><span className='Approved-Tyre-Highlight-edit'>4 <span className='Approved-Edit'><FontAwesomeIcon icon={faPen} /></span></span></td>
               <td>6</td>
               <td className='Approved-Tyre'><span className='Approved-Tyre-Highlight-edit'>4 <span className='Approved-Edit'><FontAwesomeIcon icon={faPen} /></span></span></td>
            </tr>
            <tr>
               <td>1</td>
               <td>8 Sep 23</td>
               <td>RITCO</td>
               <td className='Inspected-Tyre'><span className="Insepected-Tyre-highlight-text">10</span></td>
               <td className='Approved-Tyre'><span className='Approved-Tyre-Highlight-edit'>4 <span className='Approved-Edit'><FontAwesomeIcon icon={faPen} /></span></span></td>
               <td>6</td>
               <td className='Approved-Tyre'><span className='Approved-Tyre-Highlight-edit'>4 <span className='Approved-Edit'><FontAwesomeIcon icon={faPen} /></span></span></td>
            </tr>
            <tr>
               <td>1</td>
               <td>8 Sep 23</td>
               <td>RITCO</td>
               <td className='Inspected-Tyre'><span className="Insepected-Tyre-highlight-text">10</span></td>
               <td className='Approved-Tyre'><span className='Approved-Tyre-Highlight-success'>4 </span></td>
               <td>6</td>
               <td className='Approved-Tyre'><span className='Approved-Tyre-Highlight-edit'>4 <span className='Approved-Edit'><FontAwesomeIcon icon={faPen} /></span></span></td>
            </tr>
            <tr>
               <td>1</td>
               <td>8 Sep 23</td>
               <td>RITCO</td>
               <td className='Inspected-Tyre'><span className="Insepected-Tyre-highlight-text">10</span></td>
               <td className='Approved-Tyre'><span className='Approved-Tyre-Highlight-edit'>4 <span className='Approved-Edit'><FontAwesomeIcon icon={faPen} /></span></span></td>
               <td>6</td>
               <td className='Approved-Tyre'><span className='Approved-Tyre-Highlight-edit'>4 <span className='Approved-Edit'><FontAwesomeIcon icon={faPen} /></span></span></td>
            </tr>
            <tr>
               <td>1</td>
               <td>8 Sep 23</td>
               <td>RITCO</td>
               <td className='Inspected-Tyre'><span className="Insepected-Tyre-highlight-text">10</span></td>
               <td className='Approved-Tyre'><span className='Approved-Tyre-Highlight-edit'>4 <span className='Approved-Edit'><FontAwesomeIcon icon={faPen} /></span></span></td>
               <td>6</td>
               <td className='Approved-Tyre'><span className='Approved-Tyre-Highlight-edit'>4 <span className='Approved-Edit'><FontAwesomeIcon icon={faPen} /></span></span></td>
            </tr>
            <tr>
               <td>1</td>
               <td>8 Sep 23</td>
               <td>RITCO</td>
               <td className='Inspected-Tyre'><span className="Insepected-Tyre-highlight-text">10</span></td>
               <td className='Approved-Tyre'><span className='Approved-Tyre-Highlight-edit'>4 <span className='Approved-Edit'><FontAwesomeIcon icon={faPen} /></span></span></td>
               <td>6</td>
               <td className='Approved-Tyre'><span className='Approved-Tyre-Highlight-edit'>4 <span className='Approved-Edit'><FontAwesomeIcon icon={faPen} /></span></span></td>
            </tr>
            <tr>
               <td>1</td>
               <td>8 Sep 23</td>
               <td>RITCO</td>
               <td className='Inspected-Tyre'><span className="Insepected-Tyre-highlight-text">10</span></td>
               <td className='Approved-Tyre'><span className='Approved-Tyre-Highlight-edit'>4 <span className='Approved-Edit'><FontAwesomeIcon icon={faPen} /></span></span></td>
               <td>6</td>
               <td className='Approved-Tyre'><span className='Approved-Tyre-Highlight-edit'>4 <span className='Approved-Edit'><FontAwesomeIcon icon={faPen} /></span></span></td>
            </tr>
            <tr>
               <td>1</td>
               <td>8 Sep 23</td>
               <td>RITCO</td>
               <td className='Inspected-Tyre'><span className="Insepected-Tyre-highlight-text">10</span></td>
               <td className='Approved-Tyre'><span className='Approved-Tyre-Highlight-edit'>4 <span className='Approved-Edit'><FontAwesomeIcon icon={faPen} /></span></span></td>
               <td>6</td>
               <td className='Approved-Tyre'><span className='Approved-Tyre-Highlight-edit'>4 <span className='Approved-Edit'><FontAwesomeIcon icon={faPen} /></span></span></td>
            </tr>
            <tr>
               <td>1</td>
               <td>8 Sep 23</td>
               <td>RITCO</td>
               <td className='Inspected-Tyre'><span className="Insepected-Tyre-highlight-text">10</span></td>
               <td className='Approved-Tyre'><span className='Approved-Tyre-Highlight-edit'>4 <span className='Approved-Edit'><FontAwesomeIcon icon={faPen} /></span></span></td>
               <td>6</td>
               <td className='Approved-Tyre'><span className='Approved-Tyre-Highlight-edit'>4 <span className='Approved-Edit'><FontAwesomeIcon icon={faPen} /></span></span></td>
            </tr>
            <tr>
               <td>1</td>
               <td>8 Sep 23</td>
               <td>RITCO</td>
               <td className='Inspected-Tyre'><span className="Insepected-Tyre-highlight-text">10</span></td>
               <td className='Approved-Tyre'><span className='Approved-Tyre-Highlight-edit'>4 <span className='Approved-Edit'><FontAwesomeIcon icon={faPen} /></span></span></td>
               <td>6</td>
               <td className='Approved-Tyre'><span className='Approved-Tyre-Highlight-edit'>4 <span className='Approved-Edit'><FontAwesomeIcon icon={faPen} /></span></span></td>
            </tr>

            
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewJKBatch;
