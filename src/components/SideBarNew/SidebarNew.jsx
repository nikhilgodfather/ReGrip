import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './SideBarNew.css';
import regrip_logo from '../Logo/regrip_logo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

const Sidebar = ({ activeItem }) => {
  const [openMenu, setOpenMenu] = useState(null);

  const toggleMenu = (index) => {
    setOpenMenu(openMenu === index ? null : index);
  };
  useEffect(() => {
    // Automatically open the dropdown menu based on the activeItem
    if (activeItem === 'upload-jk-tyres' || activeItem === 'view-jk-batch') {
      setOpenMenu(0); // Open the JK Inspection dropdown
    } else if (activeItem === 'Add-Purchase' || activeItem === 'View-Purchase') {
      setOpenMenu(1); // Open the Purchases dropdown
    } else if (activeItem === 'subcategory-x' || activeItem === 'subcategory-y') {
      setOpenMenu(2); // Open the Upload Lifting Tyres dropdown
    } else {
      setOpenMenu(null); // Close all dropdowns if no matching activeItem
    }
  }, [activeItem]);
  
  return (
    <div className="sidebar-new">
      <div className="sidebar-header-new">
        <img src={regrip_logo} alt="Logo-new-regrip" className="logo" />
      </div>
      <ul className="sidebar-menu-new">
        <li
          className={`menu-item-new ${openMenu === 0 ? 'dropdown-open' : ''} ${activeItem === 'jk-inspection' ? 'active' : ''}`}
          onClick={() => toggleMenu(0)}
        >
          JK Inspection
          <span className="arrow-new">
            <FontAwesomeIcon icon={openMenu === 0 ? faAngleUp : faChevronDown} />
          </span>  
        </li>
        {openMenu === 0 && (
          <ul className="dropdown-menu-new">
            <Link to="/UploadJKTyre">
              <li className={`dropdown-item-new ${activeItem === 'upload-jk-tyres' ? 'active' : ''}`}>
                Upload JK Tyres
              </li>
            </Link>
            <Link to="/viewJkBatch">
              <li className={`dropdown-item-new ${activeItem === 'view-jk-batch' ? 'active' : ''}`}>
                View JK Batch
              </li>
            </Link>
          </ul>
        )}
        <li
          className={`menu-item-new ${openMenu === 1 ? 'dropdown-open' : ''} ${activeItem === 'purchases' ? 'active' : ''}`}
          onClick={() => toggleMenu(1)}
        >
          Purchases
          <span className="arrow-new">
            <FontAwesomeIcon icon={openMenu === 1 ? faAngleUp : faChevronDown} />
          </span>
        </li>
        {openMenu === 1 && (
          <ul className="dropdown-menu-new">
            <Link to='/addpurchase'>
            <li className={`dropdown-item-new ${activeItem === 'Add-Purchase' ? 'active' : ''}`}>
              Add Purchase
            </li>
            </Link>
            <Link to='/viewPurchase'> <li className={`dropdown-item-new ${activeItem === 'View-Purchase' ? 'active' : ''}`}>
              View Purchase
            </li></Link>
            
          </ul>
        )}
        <li
          className={`menu-item-new ${openMenu === 2 ? 'dropdown-open' : ''} ${activeItem === 'upload-lifting-tyres' ? 'active' : ''}`}
          onClick={() => toggleMenu(2)}
        >
          Job Work Order
          <span className="arrow-new">
            <FontAwesomeIcon icon={openMenu === 2 ? faAngleUp : faChevronDown} />
          </span>
        </li>
        {openMenu === 2 && (
          <ul className="dropdown-menu-new">
            <li className={`dropdown-item-new ${activeItem === 'subcategory-x' ? 'active' : ''}`}>
              Subcategory X
            </li>
            <li className={`dropdown-item-new ${activeItem === 'subcategory-y' ? 'active' : ''}`}>
              Subcategory Y
            </li>
          </ul>
        )}
        <Link to="/tyreConsoleReport"><li className={`menu-item-new ${activeItem === 'Tyre-Console-Report' ? 'active' : ''}`}>
          Tyre Console Report
        </li></Link>
        <Link to='/upload-lifting-tyres-new-erp'>
        <li className={`menu-item-new ${activeItem === 'Upload-Lifting-Tyrtes' ? 'active' : ''}`}>
          Upload Lifting Tyres
        </li>
        </Link>
        <li className={`menu-item-new ${activeItem === 'facility' ? 'active' : ''}`}>
          Facility
        </li>
        <li className={`menu-item-new ${activeItem === 'direct-purchases' ? 'active' : ''}`}>
          Direct Purchases
        </li>
      </ul>
      <div className="sidebar-footer-new">
        <button className="logout-button-new">Logout</button>
      </div>
    </div>
  );
};

Sidebar.propTypes = {
  activeItem: PropTypes.string.isRequired,
};

export default Sidebar;
