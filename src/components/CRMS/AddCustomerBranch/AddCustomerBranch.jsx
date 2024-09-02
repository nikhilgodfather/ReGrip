import React, { useEffect, useState } from 'react'
import './AddCustomerBranch.css'
import { Checkbox, Input, Option, Select, Button } from '@mui/joy';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import { API_URL } from '../../Config';
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CircularProgress from '@mui/joy/CircularProgress';

const AddCustomerBranch = ({ salesperson, editCustomerBranch, customerid, getCustomerByPan, setAddBranchModal, customerType }) => {
    const [loading, setLoading] = useState(false)

    const [showRouteFields, setShowRouteFields] = useState(
        editCustomerBranch && editCustomerBranch.route
            ?
            editCustomerBranch.route !== "PAN India" && editCustomerBranch.route !== "Undefined"
                ?
                true : false : false
    );
    const [showBranchNameWarning, setShowBranchNameWarning] = useState(false);
    const [showAddressWarning, setShowAddressWarning] = useState(false);
    const [showEmailWarning, setShowEmailWarning] = useState(false);
    const [showContactNumberWarning, setShowContactNumberWarning] = useState(false);
    const [showNoOfVehiclesWarning, setShowNoOfVehiclesWarning] = useState(false);
    const [showMonthlyRunWarning, setShowMonthlyRunWarning] = useState(false);
    const [showGSTNumberWarning, setShowGSTNumberWarning] = useState(false);
    const [showApplicationWarning, setShowApplicationWarning] = useState(false);
    const [showLoadWarning, setShowLoadWarning] = useState(false);
    const [showVehicleTypeWarning, setShowVehicleTypeWarning] = useState(false);
    const [showRouteWarning, setShowRouteWarning] = useState(false);
    const [showRegionWarning, setShowRegionWarning] = useState(false);


    const [regions, setRegions] = useState([])
    const [branchName, setBranchName] = useState(editCustomerBranch ? editCustomerBranch.customer_branch_name : "")
    const [branchRegion, setBranchRegion] = useState(editCustomerBranch && editCustomerBranch.customer_branch_region_id ? editCustomerBranch.customer_branch_region_id : null)
    const [address, setAddress] = useState(editCustomerBranch ? editCustomerBranch.branch_address : "")
    const [email, setEmail] = useState(editCustomerBranch ? editCustomerBranch.contact_email : "")
    const [contactNumber, setContactNumber] = useState(editCustomerBranch ? editCustomerBranch.mobile_number : "")
    const [latitude, setLatitude] = useState(editCustomerBranch && editCustomerBranch.latitude ? editCustomerBranch.latitude : null)
    const [longitude, setLongitude] = useState(editCustomerBranch && editCustomerBranch.longitude ? editCustomerBranch.longitude : null)
    const [visitingCard, setVisitingCard] = useState(editCustomerBranch && editCustomerBranch.visiting_card ? editCustomerBranch.visiting_card : null)
    const [premisesPhoto, setPremisesPhoto] = useState(editCustomerBranch && editCustomerBranch.premises_photo ? editCustomerBranch.premises_photo : null)
    const [city, setCity] = useState(editCustomerBranch && editCustomerBranch.city ? editCustomerBranch.city : null)
    const [pinCode, setPinCode] = useState(editCustomerBranch && editCustomerBranch.pin_code ? editCustomerBranch.pin_code : null)

    const [noOfVehicles, SetNoOfVehicles] = useState(editCustomerBranch ? editCustomerBranch.number_of_vehicles : null)
    const [monthlyRun, setMonthlyRun] = useState(editCustomerBranch ? editCustomerBranch.monthly_km_run : null)
    const [GSTNumber, setGSTNumber] = useState(editCustomerBranch ? editCustomerBranch.gst_number : "")
    const [application, setApplication] = useState(editCustomerBranch ? editCustomerBranch.application ? editCustomerBranch.application : [] : [])
    const [load, setLoad] = useState(editCustomerBranch ? editCustomerBranch.load ? editCustomerBranch.load : [] : [])
    const [vehicleType, setVehicleType] = useState(editCustomerBranch ? editCustomerBranch.vehicle_type ? editCustomerBranch.vehicle_type : [] : [])
    const [routes, setRoutes] = useState(
        editCustomerBranch && editCustomerBranch.route
            ?
            editCustomerBranch.route !== "PAN India" && editCustomerBranch.route !== "Undefined"
                ?
                "From - To" : editCustomerBranch.route : ""
    );
    const [usesRetread, setUsesRetread] = useState(editCustomerBranch ? editCustomerBranch.uses_retread ? editCustomerBranch.uses_retread : false : false);
    const [from, setFrom] = useState(
        editCustomerBranch &&
            editCustomerBranch.route &&
            editCustomerBranch.route !== "PAN India" &&
            editCustomerBranch.route !== "Undefined"
            ? editCustomerBranch.route.split('-')[0]
            : ""
    );
    const [to, setTo] = useState(
        editCustomerBranch &&
            editCustomerBranch.route &&
            editCustomerBranch.route !== "PAN India" &&
            editCustomerBranch.route !== "Undefined"
            ? editCustomerBranch.route.split('-')[1]
            : ""
    )
    const [hubs, setHubs] = useState(
        editCustomerBranch ? editCustomerBranch.hubs :
            [
                // { Name: '', Location: '', PhoneNo: '' },
            ]
    );


    const addHub = () => {
        setHubs([...hubs, { Name: '', Location: '', PhoneNo: '' }]);
    };

    const getRegions = async () => {
        try {
            const { data } = await axios.get(`${API_URL}/regions`);
            setRegions(data.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const removeHub = (index) => {
        const updatedHubs = [...hubs];
        updatedHubs.splice(index, 1);
        setHubs(updatedHubs);
    };


    const handleHubChange = (index, key, value) => {
        const updatedHubs = [...hubs];
        updatedHubs[index][key] = value;
        setHubs(updatedHubs);
    };

    const handleSubmitBranch = async () => {
        try {
            let route;
            if (routes === "Undefined" || routes === "Pan India") {
                route = routes;
            }
            else if(routes === "From - To"){
                route = `${from.toLowerCase()}-${to.toLowerCase()}`;
            } 
            else {
                route = null
            }

            if (!branchName || !address || !contactNumber || !GSTNumber || !branchRegion) {
                !branchName && setShowBranchNameWarning(true);
                !address && setShowAddressWarning(true);
                // !email && setShowEmailWarning(true);
                !contactNumber && setShowContactNumberWarning(true);
                !noOfVehicles && setShowNoOfVehiclesWarning(true);
                // !monthlyRun && setShowMonthlyRunWarning(true);
                !GSTNumber && setShowGSTNumberWarning(true);
                // !application.length && setShowApplicationWarning(true);
                // !load.length && setShowLoadWarning(true);
                // !vehicleType.length && setShowVehicleTypeWarning(true);
                // !route && setShowRouteWarning(true);
                !branchRegion && setShowRegionWarning(true)
                return;
            }


            const data = {
                employee_id: salesperson.value,
                customer_id: customerid,
                customer_branch_name: branchName,
                address: address,
                contact_email: email,
                mobile_number: contactNumber,
                latitude: latitude,
                longitude: longitude,
                visiting_card: visitingCard,
                premises_photo: premisesPhoto,
                city: city,
                pin_code: pinCode,
                number_of_vehicles: Number(noOfVehicles),
                monthly_km_run: Number(monthlyRun),
                gst_number: GSTNumber,
                application: application,
                load: load,
                vehicle_type: vehicleType,
                route: route,
                hubs: hubs,
                uses_retread: usesRetread,
                customer_branch_region_id:branchRegion
            };
            setLoading(true)
            const token = localStorage.getItem("token");
            const bearer_token = "bearer " + JSON.parse(token);
            let response
            editCustomerBranch ?
                response = await axios.patch(`${API_URL}/customer`, data, {
                    params: {
                        customer_branch_id: editCustomerBranch.customer_branch_id
                    },
                    headers: {
                        Authorization: bearer_token,
                    },
                })
                :
                response = await axios.post(`${API_URL}/customer/branch`, data);
            setLoading(false)
            toast.success(editCustomerBranch ? "Branch Updated successfully" : "Branch created successfully", {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 2000,
            })
            setAddBranchModal(false)
            await getCustomerByPan()

        } catch (error) {
            console.error('Error creating lead:', error);
            setLoading(false)
            toast.error(error.response.data.message, {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 8000,
            })
        }
    }

    useEffect(() => {
        getRegions()
    }, [])

    return (
        <div className='addBranch-customer-main'>
            <ToastContainer className="custom-toast-container" />

            <div className='scrolling-view'>
                <div>
                    <h3 style={{ fontSize: 20, color: 'grey' }}> {editCustomerBranch ? "Update Customer Branch" : "Add Customer Branch"}</h3>
                </div>

                <div className='field-align' >
                    <div className='add-customer-field-container'>
                        <h5>Name</h5>
                        <Input
                            style={{ border: showBranchNameWarning ? ' 1px solid red' : ' 1px solid #ccc' }}
                            className='field-addBranch'
                            placeholder="Enter Branch Name"
                            value={branchName}
                            onChange={(event) => {
                                setShowBranchNameWarning(false)
                                setBranchName(event.target.value);
                            }}
                        />
                    </div>


                    <div className='add-customer-field-container'>
                        <h5>Address</h5>
                        <Input
                            style={{ border: showAddressWarning ? ' 1px solid red' : ' 1px solid #ccc' }}
                            className='field-addBranch'
                            placeholder="Address"

                            value={address}
                            onChange={(event) => {
                                setAddress(event.target.value);
                                setShowAddressWarning(false)
                            }}
                        />
                    </div>

                    <div className='add-customer-field-container'>
                        <h5>Email</h5>
                        <Input
                            className='field-addBranch'
                            placeholder="Enter Email"

                            value={email}
                            onChange={(event) => {
                                setEmail(event.target.value);

                            }}
                        />
                    </div>

                    <div className='add-customer-field-container'>
                        <h5>Contact Number</h5>
                        <Input
                            style={{ border: showContactNumberWarning ? ' 1px solid red' : ' 1px solid #ccc' }}
                            className='field-addBranch'
                            placeholder="Enter Contact Number"
                            type="number"
                            value={contactNumber}
                            onChange={(event) => {
                                if (event.target.value < 0) {
                                    setContactNumber(0)
                                }
                                else {
                                    setContactNumber(event.target.value);
                                }
                                setShowContactNumberWarning(false)
                            }}
                        />
                    </div>

                    <div className='add-customer-field-container'>
                        <h5>Number Of Vehicles</h5>
                        <Input
                            className='field-addBranch'
                            placeholder="Enter Number Of Vehicles"
                            type="number"
                            value={noOfVehicles}
                            onChange={(event) => {
                                if (event.target.value < 0) {
                                    SetNoOfVehicles(0);
                                }
                                else {
                                    SetNoOfVehicles(event.target.value);
                                }
                            }}
                        />
                    </div>

                </div>

                <div className='field-align' >

                    {customerType === "transporter" &&
                        <div className='add-customer-field-container'>
                            <h5>Monthly Km Run</h5>
                            <Input
                                className='field-addBranch'
                                placeholder="Enter Monthly Km Run"
                                value={monthlyRun}
                                type="number"
                                onChange={(event) => {
                                    setMonthlyRun(event.target.value);

                                }}
                            />
                        </div>

                    }

                    <div className='add-customer-field-container'>
                        <h5>GST Number</h5>
                        <Input
                            style={{ border: showGSTNumberWarning ? ' 1px solid red' : ' 1px solid #ccc' }}
                            className='gst-number field-addBranch'
                            placeholder="GST Number"
                            // sx={{ textTransform: "uppercase" }}
                            value={GSTNumber}
                            onChange={(event) => {
                                setShowGSTNumberWarning(false)
                                setGSTNumber(event.target.value);

                            }}
                        />
                    </div>

                    <div className='add-customer-field-container'>
                        <h5>Application</h5>
                        <Select
                            id="demo-simple-select-error"

                            className='field-addBranch'
                            // placeholder="Application"
                            defaultValue={['']}
                            multiple
                            value={application}
                            onChange={(event, newValue) => {
                                setApplication(newValue);
                            }}
                            sx={{
                                minWidth: '13rem',
                            }}
                            slotProps={{
                                listbox: {
                                    sx: {
                                        width: '100%',
                                    },
                                },
                            }}
                        >
                            <Option value="Construction">Construction</Option>
                            <Option value="FMCG">FMCG</Option>
                            <Option value="E-Commerce">E-Commerce</Option>
                        </Select>
                    </div>

                    <div className='add-customer-field-container'>
                        <h5>Load</h5>
                        <Select
                            className='field-addBranch'
                            // placeholder="Load"
                            defaultValue={['']}
                            multiple
                            value={load}
                            onChange={(event, newValue) => {
                                setLoad(newValue);
                            }}
                            sx={{
                                minWidth: '13rem',
                            }}
                            slotProps={{
                                listbox: {
                                    sx: {
                                        width: '100%',
                                    },
                                },
                            }}
                        >
                            <Option value="Normal Load">Normal Load</Option>
                            <Option value="Under Load">Under Load</Option>
                            <Option value="Over Load">Over Load</Option>

                        </Select>
                    </div>

                    <div className='add-customer-field-container'>
                        <h5>Vehicle Type</h5>
                        <Select
                            className='field-addBranch'
                            // placeholder="Vehicle Type"
                            defaultValue={['']}
                            multiple
                            value={vehicleType}
                            onChange={(event, newValue) => {
                                setVehicleType(newValue);
                            }}
                            sx={{
                                minWidth: '13rem',
                            }}
                            slotProps={{
                                listbox: {
                                    sx: {
                                        width: '100%',
                                    },
                                },
                            }}
                        >
                            <Option value="Open Container">Open Container</Option>
                            <Option value="Closed Container">Closed Container</Option>
                            <Option value="Trailer Car Carrier">Trailer Car Carrier</Option>
                        </Select>
                    </div>
                </div>
                <div>
                    <div className='add-customer-field-container'>
                        <h5>Branch Region</h5>
                        <Select
                            style={{ border: showRegionWarning ? ' 1px solid red' : ' 1px solid #ccc' }}
                            className='field-addBranch'
                            placeholder="Select Region"
                            defaultValue={branchRegion}
                            onChange={(event, newValue) => {
                                setShowRegionWarning(false)
                                setBranchRegion(newValue);
                            }}
                        >
                            {
                                regions && regions.map((region) => (
                                    <Option value={region.region_id}>{region.region_name}</Option>
                                ))
                            }
                        </Select>
                    </div>
                </div>

                <div className='field-align' style={{ justifyContent: 'start' }}>
                    <div className='add-customer-field-container' style={{ width: 'auto' }}>
                        <h5>Route</h5>
                        <Select
                            className='field-addBranch'
                            placeholder="Select Route"
                            onChange={(event, newValue) => {
                                setRoutes(newValue);
                                setShowRouteFields(newValue === "From - To");
                            }}
                            defaultValue={routes}
                        >
                            <Option value="Undefined">No Defined Route</Option>
                            <Option value="PAN India">Pan India</Option>
                            <Option value="From - To">From - To</Option>
                        </Select>
                    </div>


                    {
                        showRouteFields &&
                        <>
                            <div className='add-customer-field-container' style={{ width: 'auto' }}>
                                <h5>From</h5>
                                <Input
                                    className='field-addBranch'
                                    placeholder="From"

                                    value={from}
                                    onChange={(event) => {
                                        const value = event.target.value;
                                        setFrom(value);
                                        if (!value) {
                                            setTo('');
                                        }

                                    }}
                                />
                            </div>

                            <div className='add-customer-field-container' style={{ width: 'auto' }}>
                                <h5>To</h5>
                                <Input
                                    className='field-addBranch'
                                    placeholder="to"
                                    disabled={!from}
                                    value={to}
                                    onChange={(event) => {
                                        setTo(event.target.value);
                                    }}
                                />
                            </div>
                        </>
                    }
                    <div className='field-addBranch' style={{ display: "flex", alignItems: 'end' }}>
                        <Checkbox label="Uses Retread" style={{ marginBottom: '8px' }} checked={usesRetread} onChange={(event) => {
                            setUsesRetread(event.target.checked);
                        }} />
                    </div>

                </div>
                <div className='field-align'>
                    <div className='hub-fields'>
                        <h4 style={{ color: 'grey' }}>Hubs</h4>

                        {hubs.map((hub, index) => (
                            <div key={index} className='field-align' style={{ justifyContent: 'start' }}>
                                <div className='add-customer-field-container' style={{ width: 'auto' }}>
                                    <h5>Hub Name</h5>
                                    <Input
                                        className='field-addBranch'
                                        placeholder={`Name`}
                                        value={hub.Name}
                                        onChange={(event) => handleHubChange(index, 'Name', event.target.value)}
                                    />
                                </div>
                                <div className='add-customer-field-container' style={{ width: 'auto' }}>
                                    <h5>Hub Location</h5>
                                    <Input
                                        className='field-addBranch'

                                        placeholder={`Location`}
                                        value={hub.Location}
                                        onChange={(event) => handleHubChange(index, 'Location', event.target.value)}
                                    />
                                </div>
                                <div className='add-customer-field-container' style={{ width: 'auto' }}>
                                    <h5>Hub Contact Number</h5>
                                    <Input
                                        className='field-addBranch'
                                        placeholder={`Phone No`}
                                        value={hub['Phone No']}
                                        onChange={(event) => handleHubChange(index, 'PhoneNo', event.target.value)}
                                    />
                                </div>

                                <button className="remove-hubs-btn" type='button' onClick={() => removeHub(index)}>
                                    <FontAwesomeIcon
                                        className='crossicon'
                                        icon={faTimes}

                                    />
                                </button>
                            </div>
                        ))}
                        <butto className="add-hubs-btn" type='button' onClick={addHub}>
                            Add Hubs
                        </butto>
                    </div>
                </div>
                {
                    loading ?
                        <Button className='addBranch-btn'>
                            <CircularProgress variant="solid" />
                        </Button>
                        :
                        <Button className='addBranch-btn'
                            onClick={() => handleSubmitBranch()}
                        >
                            {editCustomerBranch ? "Update Branch" : "Add Branch"}
                        </Button>
                }


            </div>

        </div>
    )
}

export default AddCustomerBranch
