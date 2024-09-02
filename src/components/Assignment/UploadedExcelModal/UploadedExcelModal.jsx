import './UploadedExcelModal.css'
import axios from 'axios';
import { useEffect, useState } from 'react';
import { API_URL } from '../../Config';
import { useSelector } from "react-redux";
import { REGRIP_ROLE_ID } from '../../../redux/constants/Constant';
import searchIcon from '../../../assets/icon.png'
import { Controls, Player } from '@lottiefiles/react-lottie-player';
import loadingTyre from '../../../lotties/loadingTyre.json'
import "react-toastify/dist/ReactToastify.css";
import nodata from '../../../lotties/nodata1.json';
import GenerateRequestExcel from '../../Home/GenerateRequestExcel/GenerateRequestExcel';


const UploadedExcelModal = ({ inside, tyreInspectionAssignmentId }) => {
    const [tyres, setTyres] = useState([])
    const [filteredTyres, setFilteredTyres] = useState([]);

    const currentUser = useSelector(state => state.getCurrentUser.role_id)

    const [loading, setLoading] = useState(true);
    const [searchedOption, setSearchedOption] = useState("");

    const getExcelData = async () => {
        try {
            const token = localStorage.getItem("token");
            const bearer_token = "bearer " + JSON.parse(token);

            setLoading(true)
            const { data } = await axios.get(`${API_URL}/inspection-assignments/excel-data`, {
                headers: {
                    Authorization: bearer_token,
                },
                params: {
                    tyre_inspection_assignment_id: tyreInspectionAssignmentId
                }
            });
            // const fleets = data.rows;
            setLoading(false);
            setTyres(data.data);
            setFilteredTyres(data.data);
        }
        catch (e) {
            console.log("Error while fetching data:", e.message)
        }
    }


    const handleSearchChange = (event) => {
        const newSearchTerm = event.target.value;
        setSearchedOption(newSearchTerm);

        // Filter tyres based on the new search term
        const newFilteredTyres = tyres.filter((tyre) =>
            tyre.tyre_serial_number.toLowerCase().includes(newSearchTerm.toLowerCase())
        );
        setFilteredTyres(newFilteredTyres);
    };

    useEffect(() => {
        getExcelData()
    }, []);

    return (
        <div className="tyre-action-container">

            {
                loading ?
                    <div className='tyre-loader'>
                        <Player
                            autoplay
                            loop={true}
                            keepLastFrame={true}
                            src={loadingTyre}
                            style={{ width: '60%', margin: 'auto' }}
                        >
                            <Controls buttons={['repeat', 'frame', 'debug']} />
                        </Player>
                    </div>
                    :
                    <div className='tyre-action' style={{ height: '100%' }}>
                        <div className="head">
                            <h1 className="heading" style={{ marginBottom: "3px" }}>
                                Uploaded Excel Data
                            </h1>
                            <div className='search-container' style={{ margin: '0px 20px 20px auto', width: '50%' }}>
                                <input
                                    type="text"
                                    placeholder="Enter tyre serial no."
                                    value={searchedOption}
                                    onChange={handleSearchChange}

                                />
                                <div className='search-btn' >
                                    <span style={{ marginBottom: 3 }}>Search</span>
                                    <img src={searchIcon} alt="Description" style={{ width: '10px', height: '10px' }} />
                                </div>
                            </div>
                        </div>


                        <GenerateRequestExcel inside={true} tyres={tyres}/>


                        <div className="table-container">
                            <table className="request-table">
                                <thead>
                                    <tr className="table-heading">
                                        <th>Serial Number</th>
                                        <th>Tyre Size</th>
                                        <th>Tyre Model</th>
                                        <th>Construction Type</th>
                                        <th>Product Category</th>
                                    </tr>
                                </thead>

                                <tbody style={{ width: '100%' }}>
                                    {
                                        filteredTyres?.map((tyre, i) => (
                                            <tr className="table-data" >
                                                <td>{tyre.tyre_serial_number}</td>
                                                <td>{tyre.tyre_serial_number}</td>
                                                <td>{tyre.tyre_serial_number}</td>
                                                <td>{tyre.tyre_serial_number}</td>
                                                <td>{tyre.tyre_size}</td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table>

                        </div>
                        {
                            filteredTyres.length === 0 && !loading &&
                            <div className='empty-data'>
                                <Player
                                    autoplay
                                    loop
                                    src={nodata}
                                    style={{ height: '150px', width: '150px' }}
                                >
                                    <Controls buttons={['repeat', 'frame', 'debug']} />
                                </Player>
                            </div>
                        }

                    </div>
            }
        </div >
    )
}
export default UploadedExcelModal
