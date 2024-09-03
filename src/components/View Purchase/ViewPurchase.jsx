import React, { useState } from 'react'
import './ViewPurchase.css'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faEye,faNewspaper} from '@fortawesome/free-solid-svg-icons';
import ViewPurchaseTyreDetail from './View Purchase Tyre Detail Popup/ViewPurchaseTyreDetail';
const ViewPurchase = ({activeMenu}) => {
    const [viewPurchasePopup , setViewPurchasePopup] = useState(false)

    const handleViewPurchaseTyrePopup = () =>{
        setViewPurchasePopup(!viewPurchasePopup)
    }
    return (
    <div className="view-purchase-new">
    <div className="view-purchase-header">
      <h2>View Purchase</h2>
    </div>
    <div className='menu-container-view-purchase'>
        <ul>
            <li className={`menu-Item ${activeMenu==='Casing-From-JK' ? 'active' : ''}`}>Casing From JK</li>
            <li className={`menu-Item ${activeMenu==='Belt' ? 'active' : ''}`}>Belt</li>
            <li className={`menu-Item ${activeMenu==='Ready-Retread'  ? 'active' : ''}`}>Ready Retread</li>
            <input type="text" className='menu-searchBar' placeholder='Search...'/>
        </ul>
    </div>
    <div className="table-container-view-purchase">
      <table className="batch-table-view-purchase">
        <thead>
          <tr>
            <th>Invoice No.</th>
            <th>Fleet Name</th>
            <th>Invoice Date</th>
            <th>Basic Amount</th>
            <th>GST Amount</th>
            <th>Total Invoice Amount</th>
            <th>Total Tyre Count</th>
            <th>Tyre Detail</th>
            <th>Invoice</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>12334</td>
            <td>RITCO</td>
            <td>19-Aug-24</td>
            <td>10,000</td>
            <td>2000</td>
            <td>12000</td>
            <td>5</td>
            <td className="view-purchase-eye-btn" onClick={handleViewPurchaseTyrePopup}><span className='eye-btn'><FontAwesomeIcon icon={faEye} /></span></td>
            <td><button className="download-btn"><FontAwesomeIcon icon={faNewspaper} /></button></td>
          </tr>
          <tr>
            <td>12334</td>
            <td>RITCO</td>
            <td>19-Aug-24</td>
            <td>10,000</td>
            <td>2000</td>
            <td>12000</td>
            <td>5</td>
            <td className="view-purchase-eye-btn" onClick={handleViewPurchaseTyrePopup}><span className='eye-btn'><FontAwesomeIcon icon={faEye} /></span></td>
            <td><button className="download-btn"><FontAwesomeIcon icon={faNewspaper} /></button></td>
          </tr>
          <tr>
            <td>12334</td>
            <td>RITCO</td>
            <td>19-Aug-24</td>
            <td>10,000</td>
            <td>2000</td>
            <td>12000</td>
            <td>5</td>
            <td className="view-purchase-eye-btn" onClick={handleViewPurchaseTyrePopup}><span className='eye-btn'><FontAwesomeIcon icon={faEye} /></span></td>
            <td><button className="download-btn"><FontAwesomeIcon icon={faNewspaper} /></button></td>
          </tr>
          <tr>
            <td>12334</td>
            <td>RITCO</td>
            <td>19-Aug-24</td>
            <td>10,000</td>
            <td>2000</td>
            <td>12000</td>
            <td>5</td>
            <td className="view-purchase-eye-btn" onClick={handleViewPurchaseTyrePopup}><span className='eye-btn'><FontAwesomeIcon icon={faEye} /></span></td>
            <td><button className="download-btn"><FontAwesomeIcon icon={faNewspaper} /></button></td>
          </tr>
          <tr>
            <td>12334</td>
            <td>RITCO</td>
            <td>19-Aug-24</td>
            <td>10,000</td>
            <td>2000</td>
            <td>12000</td>
            <td>5</td>
            <td className="view-purchase-eye-btn" onClick={handleViewPurchaseTyrePopup}><span className='eye-btn'><FontAwesomeIcon icon={faEye} /></span></td>
            <td><button className="download-btn"><FontAwesomeIcon icon={faNewspaper} /></button></td>
          </tr>
          <tr>
            <td>12334</td>
            <td>RITCO</td>
            <td>19-Aug-24</td>
            <td>10,000</td>
            <td>2000</td>
            <td>12000</td>
            <td>5</td>
            <td className="view-purchase-eye-btn" onClick={handleViewPurchaseTyrePopup}><span className='eye-btn'><FontAwesomeIcon icon={faEye} /></span></td>
            <td><button className="download-btn"><FontAwesomeIcon icon={faNewspaper} /></button></td>
          </tr>
          <tr>
            <td>12334</td>
            <td>RITCO</td>
            <td>19-Aug-24</td>
            <td>10,000</td>
            <td>2000</td>
            <td>12000</td>
            <td>5</td>
            <td className="view-purchase-eye-btn" onClick={handleViewPurchaseTyrePopup}><span className='eye-btn'><FontAwesomeIcon icon={faEye} /></span></td>
            <td><button className="download-btn"><FontAwesomeIcon icon={faNewspaper} /></button></td>
          </tr>
          <tr>
            <td>12334</td>
            <td>RITCO</td>
            <td>19-Aug-24</td>
            <td>10,000</td>
            <td>2000</td>
            <td>12000</td>
            <td>5</td>
            <td className="view-purchase-eye-btn" onClick={handleViewPurchaseTyrePopup}><span className='eye-btn'><FontAwesomeIcon icon={faEye} /></span></td>
            <td><button className="download-btn"><FontAwesomeIcon icon={faNewspaper} /></button></td>
          </tr>
          <tr>
            <td>12334</td>
            <td>RITCO</td>
            <td>19-Aug-24</td>
            <td>10,000</td>
            <td>2000</td>
            <td>12000</td>
            <td>5</td>
            <td className="view-purchase-eye-btn" onClick={handleViewPurchaseTyrePopup}><span className='eye-btn'><FontAwesomeIcon icon={faEye} /></span></td>
            <td><button className="download-btn"><FontAwesomeIcon icon={faNewspaper} /></button></td>
          </tr>
          <tr>
            <td>12334</td>
            <td>RITCO</td>
            <td>19-Aug-24</td>
            <td>10,000</td>
            <td>2000</td>
            <td>12000</td>
            <td>5</td>
            <td className="view-purchase-eye-btn" onClick={handleViewPurchaseTyrePopup}><span className='eye-btn'><FontAwesomeIcon icon={faEye} /></span></td>
            <td><button className="download-btn"><FontAwesomeIcon icon={faNewspaper} /></button></td>
          </tr>
          <tr>
            <td>12334</td>
            <td>RITCO</td>
            <td>19-Aug-24</td>
            <td>10,000</td>
            <td>2000</td>
            <td>12000</td>
            <td>5</td>
            <td className="view-purchase-eye-btn" onClick={handleViewPurchaseTyrePopup}><span className='eye-btn'><FontAwesomeIcon icon={faEye} /></span></td>
            <td><button className="download-btn"><FontAwesomeIcon icon={faNewspaper} /></button></td>
          </tr>
          <tr>
            <td>12334</td>
            <td>RITCO</td>
            <td>19-Aug-24</td>
            <td>10,000</td>
            <td>2000</td>
            <td>12000</td>
            <td>5</td>
            <td className="view-purchase-eye-btn" onClick={handleViewPurchaseTyrePopup}><span className='eye-btn'><FontAwesomeIcon icon={faEye} /></span></td>
            <td><button className="download-btn"><FontAwesomeIcon icon={faNewspaper} /></button></td>
          </tr>
          <tr>
            <td>12334</td>
            <td>RITCO</td>
            <td>19-Aug-24</td>
            <td>10,000</td>
            <td>2000</td>
            <td>12000</td>
            <td>5</td>
            <td className="view-purchase-eye-btn" onClick={handleViewPurchaseTyrePopup}><span className='eye-btn'><FontAwesomeIcon icon={faEye} /></span></td>
            <td><button className="download-btn"><FontAwesomeIcon icon={faNewspaper} /></button></td>
          </tr>
          <tr>
            <td>12334</td>
            <td>RITCO</td>
            <td>19-Aug-24</td>
            <td>10,000</td>
            <td>2000</td>
            <td>12000</td>
            <td>5</td>
            <td className="view-purchase-eye-btn" onClick={handleViewPurchaseTyrePopup}><span className='eye-btn'><FontAwesomeIcon icon={faEye} /></span></td>
            <td><button className="download-btn"><FontAwesomeIcon icon={faNewspaper} /></button></td>
          </tr>
          <tr>
            <td>12334</td>
            <td>RITCO</td>
            <td>19-Aug-24</td>
            <td>10,000</td>
            <td>2000</td>
            <td>12000</td>
            <td>5</td>
            <td className="view-purchase-eye-btn" onClick={handleViewPurchaseTyrePopup}><span className='eye-btn'><FontAwesomeIcon icon={faEye} /></span></td>
            <td><button className="download-btn"><FontAwesomeIcon icon={faNewspaper} /></button></td>
          </tr>
          <tr>
            <td>12334</td>
            <td>RITCO</td>
            <td>19-Aug-24</td>
            <td>10,000</td>
            <td>2000</td>
            <td>12000</td>
            <td>5</td>
            <td className="view-purchase-eye-btn" onClick={handleViewPurchaseTyrePopup}><span className='eye-btn'><FontAwesomeIcon icon={faEye} /></span></td>
            <td><button className="download-btn"><FontAwesomeIcon icon={faNewspaper} /></button></td>
          </tr>
          
        </tbody>
      </table>
    </div>
    {viewPurchasePopup && <ViewPurchaseTyreDetail onClose={handleViewPurchaseTyrePopup}/>}
  </div>
  )
}

export default ViewPurchase
