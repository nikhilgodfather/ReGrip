import { Input, Select, Option, Table, Sheet, Button, Checkbox } from '@mui/joy';
import React, { useEffect, useState } from 'react'
import './EditCustomer.css'
import axios from 'axios';
import { API_URL } from '../../Config';
import { ToastContainer, toast } from 'react-toastify';
import CircularProgress from '@mui/joy/CircularProgress';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';

const EditCustomer = ({ getCustomerByPan, setEditBranchModal, salesperson, customer, dealerBranch }) => {

    const [loading, setLoading] = useState(false)

    const [regions, setRegions] = useState([])
    const [customerId, setCustomerId] = useState(customer && customer.customer_id ? customer.customer_id : null)
    const [dealerRegion, setDealerRegion] = useState(dealerBranch && dealerBranch.customer_branch_region_id ? dealerBranch.customer_branch_region_id : null)
    const [panInput, setPanInput] = useState(customer && customer.pan_number ? customer.pan_number : "")
    const [selectIndex, setSelectIndex] = useState(dealerBranch ? 1 : 0);

    const [customerType, setCustomerType] = useState(customer && customer.customer_type ? customer.customer_type : "");
    const [customerName, setCustomerName] = useState(customer && customer.customer_name ? customer.customer_name : "")
    const [customerBranchName, setCustomerBranchName] = useState(dealerBranch && dealerBranch.customer_branch_name ? dealerBranch.customer_branch_name : "")
    const [customerBranchId, setCustomerBranchId] = useState(dealerBranch && dealerBranch.customer_branch_id ? dealerBranch.customer_branch_id : "")
    const [address, setAddress] = useState(customer && customer.customer_address ? customer.customer_address : "")
    const [usesRetread, setUsesRetread] = useState(dealerBranch && dealerBranch.uses_retread ? dealerBranch.uses_retread : false)
    const [industryType, setIndustryType] = useState(customer && customer.industry_type ? customer.industry_type : "")
    const [monthlyTyreSales, setMonthlyTyreSales] = useState(customer && customer.monthly_tyre_sales ? customer.monthly_tyre_sales : "")
    const [emailAddress, setEmailAddress] = useState(dealerBranch && dealerBranch.contact_email ? dealerBranch.contact_email : "")
    const [contactNumber, setContactNumber] = useState(dealerBranch && dealerBranch.mobile_number ? dealerBranch.mobile_number : null)
    const [gstNumber, setGSTNumber] = useState(dealerBranch && dealerBranch.gst_number ? dealerBranch.gst_number : "")
    const [currentlyDealing, setCurrentDealing] = useState(customer && customer.currently_dealing ? customer.currently_dealing : [])
    const [latitude, setLatitude] = useState(dealerBranch && dealerBranch.latitude ? dealerBranch.latitude : null)
    const [longitude, setLongitude] = useState(dealerBranch && dealerBranch.longitude ? dealerBranch.longitude : null)
    const [visitingCard, setVisitingCard] = useState(dealerBranch && dealerBranch.visiting_card ? dealerBranch.visiting_card : null)
    const [premisesPhoto, setPremisesPhoto] = useState(dealerBranch && dealerBranch.premises_photo ? dealerBranch.premises_photo : null)
    const [city, setCity] = useState(dealerBranch && dealerBranch.city ? dealerBranch.city : null)
    const [pinCode, setPinCode] = useState(dealerBranch && dealerBranch.pin_code ? dealerBranch.pin_code : null)

    const [brands, setBrands] = useState([])
    const [selectedBrands, setSelectedBrands] = useState(null);

    const isDealer = customerType === 'dealer';

    // Warnings
    const [showNameWarning, setShowNameWarning] = useState(false);
    const [showAddressWarning, setShowAddressWarning] = useState(false);
    const [showEmailWarning, setShowEmailWarning] = useState(false);
    const [showContactNumberWarning, setShowContactNumberWarning] = useState(false);
    const [showGSTNumberWarning, setShowGSTNumberWarning] = useState(false);
    const [showRegionWarning, setShowRegionWarning] = useState(false);

    // api calls
    const handleSubmit = async () => {
        const token = localStorage.getItem("token");
        const bearer_token = "bearer " + JSON.parse(token);
        let data
        try {
            if (isDealer) {
                if (!customerName || !address || !dealerRegion || !contactNumber || !gstNumber) {
                    !customerName && setShowNameWarning(true);
                    !address && setShowAddressWarning(true);
                    !contactNumber && setShowContactNumberWarning(true);
                    !gstNumber && setShowGSTNumberWarning(true);
                    !dealerRegion && setShowRegionWarning(true)
                    return;
                }
                data = {
                    employee_id: salesperson.value,
                    customer_type: customerType,
                    customer_name: customerName,
                    address: address,
                    monthly_tyre_sales: monthlyTyreSales,
                    customer_branch_region_id: dealerRegion,
                    mobile_number: contactNumber,
                    contact_email: emailAddress,
                    gst_number: gstNumber,
                    pan_number: panInput,
                    currently_dealing: selectedBrands,
                    latitude: latitude,
                    longitude: longitude,
                    city: city,
                    pin_code: pinCode,
                    uses_retread: usesRetread,
                    industry_type: industryType,
                    customer_branch_name: customerBranchName,
                    visiting_card: visitingCard,
                    premises_photo: premisesPhoto,
                    customer_branch_id:customerBranchId
                };
            }
            else {
                if (!customerName || !address) {
                    !customerName && setShowNameWarning(true);
                    !address && setShowAddressWarning(true);
                    return;
                }
                data = {
                    employee_id: salesperson.value,
                    customer_type: customerType,
                    customer_name: customerName,
                    address: address,
                    monthly_tyre_sales: monthlyTyreSales,
                    customer_branch_region_id: dealerRegion,
                    mobile_number: contactNumber,
                    contact_email: emailAddress,
                    pan_number: panInput,
                    industry_type: industryType,
                    currently_dealing: selectedBrands,
                };
            }
            setLoading(true)
            const response = await axios.patch(`${API_URL}/customer/update-customer`, data, {
                params: {
                    customer_id: customerId
                },
                headers: {
                    Authorization: bearer_token,
                },
            });
            setLoading(false);
            toast.success("Customer Edited successfully", {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 2000,
            })
            setEditBranchModal(false)
            await getCustomerByPan()
        }

        catch (error) {
            console.error('Error creating lead:', error);
            toast.error(error.response.data.message, {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 3000,
            })
        } finally {
            setLoading(false);
        }
    }

    const getRegions = async () => {
        try {
            const { data } = await axios.get(`${API_URL}/regions`);
            setRegions(data.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };


    const getAllBrands = async () => {
        try {
            const response = await axios.get(`${API_URL}/tyrebrand/getdata`);
            setLoading(false);
            setBrands(response.data.brands);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        getRegions()
        getAllBrands();
    }, []);

    return (
        <div className='main-addcustomer'>

            <div className='add-customer-head'>
                <h3 style={{ fontSize: 20, color: 'grey' }}> Edit Customer</h3>
                <ToastContainer className="custom-toast-container" />
            </div>
            <div>
                <h5>PAN Number</h5>
                <Input
                    sx={{ textTransform: "uppercase" }}
                    className='customerField'
                    placeholder="Enter PAN Number"
                    value={panInput}
                    onChange={(event) => {
                        const newPanInput = event.target.value.slice(0, 10).toUpperCase();
                        setPanInput(newPanInput);
                    }}
                />
            </div>
            {
                panInput.length === 10 &&
                <>

                    <div div className='add-customer-field-main'>
                        <span
                            className={`addcustomer-type-field ${selectIndex === 0 ? 'selected' : ''}`}
                        >
                            Transporter
                        </span>
                        <span
                            className={`addcustomer-type-field ${selectIndex === 1 ? 'selected' : ''}`}
                        >
                            Dealer
                        </span>
                    </div>


                    <div className='add-customer-field-main-fields'>
                        <div className='add-customer-field-container'>
                            <h5>{isDealer ? "Dealer Name" : "Transporter Name"}</h5>
                            <Input
                                style={{ border: showNameWarning ? ' 1px solid red' : ' 1px solid #ccc' }}

                                className='customerField'
                                placeholder={isDealer ? "Enter Dealer Name" : "Enter Transporter Name"}
                                value={customerName}
                                onChange={(event) => {
                                    setShowNameWarning(false)
                                    setCustomerName(event.target.value);
                                }}
                            />
                        </div>
                        <div className='add-customer-field-container'>
                            <h5>{isDealer ? "Dealer Address" : "Transporter Address"}</h5>
                            <Input
                                style={{ border: showAddressWarning ? ' 1px solid red' : ' 1px solid #ccc' }}
                                className='customerField'
                                placeholder={isDealer ? "Enter Dealer Address" : "Enter Transporter Address"}
                                value={address}
                                onChange={(event) => {
                                    setShowAddressWarning(false)
                                    setAddress(event.target.value);
                                }}
                            />
                        </div>
                        {!isDealer && <div className='add-customer-field-container'>
                            <h5>Industry Type</h5>
                            <Input
                                className='customerField'
                                placeholder="Industry Type"
                                value={industryType}
                                onChange={(event) => {
                                    setIndustryType(event.target.value);

                                }}
                            />
                        </div>}

                        {isDealer &&
                            <div className='add-customer-field-container'>
                                <h5>{isDealer ? "Dealer Email" : "Transporter Email"}</h5>
                                <Input
                                    className='customerField'
                                    placeholder={isDealer ? "Enter Dealer Email" : "Enter Transporter Email"}
                                    value={emailAddress}
                                    onChange={(event) => {
                                        setEmailAddress(event.target.value);

                                    }}
                                />
                            </div>}
                        <div className='add-customer-field-container'>
                            <h5>Monthly Tyre Sales</h5>
                            <Input
                                className='customerField'
                                placeholder="Monthly Tyre Sales"
                                value={monthlyTyreSales}
                                onChange={(event) => {
                                    setMonthlyTyreSales(event.target.value);
                                }}
                            />
                        </div>

                    </div>

                    {isDealer && <div className='add-customer-field-main-fields'>

                        {isDealer &&
                            <div className='add-customer-field-container'>
                                <h5>Region</h5>
                                <Select
                                    style={{ border: showRegionWarning ? ' 1px solid red' : ' 1px solid #ccc' }}
                                    className='customerField'
                                    placeholder="Select Region"
                                    defaultValue={dealerRegion}
                                    onChange={(event, newValue) => {
                                        setShowRegionWarning(false)
                                        setDealerRegion(newValue);
                                    }}
                                >
                                    {
                                        regions && regions.map((region) => (
                                            <Option value={region.region_id}>{region.region_name}</Option>
                                        ))
                                    }
                                </Select>
                            </div>
                        }
                        {isDealer &&
                            <div className='add-customer-field-container'>
                                <h5>Contact Number</h5>
                                <Input
                                    style={{ border: showContactNumberWarning ? ' 1px solid red' : ' 1px solid #ccc' }}
                                    className='customerField'
                                    placeholder="Contact Number"
                                    value={contactNumber}
                                    onChange={(event) => {
                                        setShowContactNumberWarning(false)
                                        setContactNumber(event.target.value);

                                    }}
                                />
                            </div>
                        }

                        {isDealer &&
                            <div className='add-customer-field-container'>
                                <h5>GST Number</h5>
                                <Input
                                    className='gst-number customerField'
                                    placeholder="GST Number"
                                    value={gstNumber}
                                    onChange={(event) => {
                                        setGSTNumber(event.target.value);
                                    }}
                                />
                            </div>
                        }

                        {isDealer &&
                            (
                                <>
                                    <div className='add-customer-field-container'>
                                        <h5>Currently Dealing </h5>
                                        < Select
                                            // placeholder="Currently Dealing"
                                            defaultValue={[]}
                                            value={currentlyDealing || []
                                            }
                                            onChange={(event, newValue) => {
                                                setSelectedBrands(newValue);
                                            }}
                                            multiple
                                            className='customerField'
                                            slotProps={{
                                                listbox: {
                                                    sx: {
                                                        width: '100%',
                                                    },
                                                },
                                            }}
                                        >
                                            {currentlyDealing?.map((brand) => (
                                                <Option key={brand} value={brand} >
                                                    {brand}
                                                </Option>
                                            ))}
                                        </Select>
                                    </div>

                                </>
                            )
                        }
                    </div>}
                    {
                        isDealer &&
                        <div className='field-addBranch' style={{ display: "flex", alignItems: 'end' }}>
                            <Checkbox label="Uses Retread" style={{ marginBottom: '8px' }} checked={usesRetread} onChange={(event) => {
                                setUsesRetread(event.target.checked);
                            }} />
                        </div>
                    }
                </>
            }

            <div className='add-customer-field-main' >
                {
                    loading ?
                        <Button className='submit-customer-button'>
                            <CircularProgress variant="solid" />
                        </Button>
                        :
                        <Button style={{marginTop:"20px !important"}} className='submit-customer-button'
                            onClick={() => {
                                handleSubmit()
                            }}
                        >
                            Edit Customer
                        </Button>
                }
            </div>

        </div>
    )
}

export default EditCustomer
