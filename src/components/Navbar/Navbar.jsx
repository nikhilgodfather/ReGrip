import React from 'react'
import './Navbar.css';
import { Link } from 'react-router-dom'
import CompanyLogo from '../../assets/c-logo.png'
import MenuIcon from '../../assets/menu-icon.png'
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faBell, faAngleDown, faRightFromBracket, faCheckDouble } from "@fortawesome/free-solid-svg-icons";
import { API_URL } from '../Config/index';

const Navbar = ({ setShowdb }) => {
    const navigate = useNavigate();

    const logout = async () => {
        try {
            const response = await axios.post(`${API_URL}/logout/logoutUser`);
            if (response.status === 200) {
                localStorage.removeItem("token");
                navigate("/");
            } else {
                console.error("Logout was not successful. Response status:", response.status);
            }
        } catch (error) {
            console.error("An error occurred:", error);
        }
    };



    return (
        <nav className="main-navbar-div">
            <div className="navbar">
                <div className="nav-item company-logo">
                    <img src={CompanyLogo} alt="company-logo" width="115" />
                </div>
                <div className="sidebar-menu">
                    <h4 onClick={() => setShowdb((prevShowdb) => !prevShowdb)}><img src={MenuIcon} alt="menu-icon" width="35" /></h4>
                </div>
                <form>
                    <input type="text" className="search-bar" placeholder="Search" />
                    <div className="search-icon">
                        <FontAwesomeIcon icon={faMagnifyingGlass} style={{ color: "#afb5c0", }} />
                    </div>
                </form>
                <div className="notification-box" style={{ float: 'right', margin: '0' }}>
                    <input type="checkbox" id="dropdown" />
                    <label for="dropdown" class="dropdown-msg-btn">
                        <span><FontAwesomeIcon className="bell-icon" icon={faBell} style={{ color: "#39532F", }} /><span className='notification-txt' style={{ padding: '0', }}> Notification</span></span>
                        <span class="arrow"><FontAwesomeIcon icon={faAngleDown} /></span>
                    </label>

                    <ul class="dropdown-content" role="menu">
                        <li><Link href="#"><FontAwesomeIcon icon={faCheckDouble} /> Message-1</Link></li>
                        <li><Link href="#"><FontAwesomeIcon icon={faCheckDouble} /> Message-2</Link></li>
                    </ul>
                </div>
                <div className="logOut-box">
                    <button className="lg-btn" onClick={() => logout()}><FontAwesomeIcon className='lg-icon' icon={faRightFromBracket} style={{ color: "#39532F", fontSize: "15px", }} /> <span className='lg-txt'>Logout</span></button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
