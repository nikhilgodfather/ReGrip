import { Autocomplete, AutocompleteOption, Input, ModalClose, Option, Select, Switch, Textarea } from '@mui/joy';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { API_URL } from '../../Config/index';
import "./GenerateLead.css"
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { format } from 'date-fns';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";
import moment from 'moment';
import Sheet from '@mui/joy/Sheet';
import Modal from '@mui/joy/Modal';
import CircularProgress from '@mui/joy/CircularProgress';
import { CircularProgress as MuiCircularProgress, TextField } from '@mui/material';
import dayjs from 'dayjs';
import AddCustomer from '../AddCustomer/AddCustomer';
import AddMeetingPerson from '../AddMeetingPerson/AddMeetingPerson';

const GenerateLead = ({ onClose, setGenerateLeadModal }) => {

    //   radial

    const [otherValue, setOtherValue] = useState('');
    const [isOtherSelected, setIsOtherSelected] = useState(false);
    const [othersArray, setOthersArray] = useState([]);

    const handleChange = (event, newValue) => {
        if (newValue?.includes('Others')) {
            setIsOtherSelected(true);
            if (event) {
                event.target.blur();
            }
        } else if (productCategoryNewTyresRadial?.brands?.includes('Others') && !newValue?.includes('Others')) {
            const filteredValues = newValue?.filter(value => ['MRF', 'Appolo', "Bridgestone", "Ceat", "JK", "Michelin", "Continental"]?.includes(value));
            setProductCategoryNewTyresRadial({
                ...productCategoryNewTyresRadial,
                brands: filteredValues
            })
            setIsOtherSelected(false);
            setOthersArray([]);
            setShowNewTyresConstructionRadialReasonWarning(false)

            return;
        } else {
            setIsOtherSelected(false);
            setOthersArray([]);
            setShowNewTyresConstructionRadialReasonWarning(false)


        }



        const preservedValues = productCategoryNewTyresRadial?.brands?.filter(value => othersArray?.some(obj => obj.value === value));
        setProductCategoryNewTyresRadial({
            ...productCategoryNewTyresRadial,
            brands: [...newValue, ...preservedValues]
        });


        if (event) {
            event.target.blur();
        }
    };


    const handleOtherInputChange = (event) => {
        setOtherValue(event.target.value);
    };

    const handleAddOtherValue = () => {
        if (otherValue?.trim() !== '') {
            const newValue = { value: otherValue, key: otherValue };

            setOthersArray([...othersArray, newValue]);

            setProductCategoryNewTyresRadial(prevState => ({
                ...prevState,
                brands: [...prevState?.brands, newValue?.value]
            }));

            setOtherValue('');
        }
    };


    const handleRemoveOtherValue = (keyToRemove) => {
        const updatedOthersArray = othersArray?.filter(obj => obj.key !== keyToRemove);
        setOthersArray(updatedOthersArray);

        setProductCategoryNewTyresRadial(prevState => ({
            ...prevState,
            brands: prevState.brands?.filter(value => value !== keyToRemove)
        }));
    };

    // radial


    // nylon



    const [otherValueForNylon, setOtherValueForNylon] = useState('');
    const [isOtherSelectedForNylon, setIsOtherSelectedForNylon] = useState(false);
    const [othersArrayForNylon, setOthersArrayForNylon] = useState([]);

    const handleChangeForNylon = (event, newValue) => {
        if (newValue?.includes('Others')) {
            setIsOtherSelectedForNylon(true);
            if (event) {
                event.target.blur();
            }
        } else if (productCategoryNewTyresNylon?.brands?.includes('Others') && !newValue.includes('Others')) {
            const filteredValues = newValue?.filter(value => ['MRF', 'Appolo', "Bridgestone", "Ceat", "JK", "Michelin", "Continental"].includes(value));
            setProductCategoryNewTyresNylon({
                ...productCategoryNewTyresNylon,
                brands: filteredValues
            })
            setIsOtherSelectedForNylon(false);
            setOthersArrayForNylon([]);
            setShowNewTyresConstructionNylonReasonWarning(false)

            return;
        } else {
            setIsOtherSelectedForNylon(false);
            setOthersArrayForNylon([]);
            setShowNewTyresConstructionNylonReasonWarning(false)


        }
        const preservedValues = productCategoryNewTyresNylon?.brands?.filter(value => othersArrayForNylon?.some(obj => obj.value === value));
        setProductCategoryNewTyresNylon({
            ...productCategoryNewTyresNylon,
            brands: [...newValue, ...preservedValues]
        });


        if (event) {
            event.target.blur();
        }
    }


    const handleOtherInputChangeForNylon = (event) => {
        setOtherValueForNylon(event.target.value);

    };

    const handleAddOtherValueForNylon = () => {
        if (otherValueForNylon?.trim() !== '') {
            const newValue = { value: otherValueForNylon, key: otherValueForNylon };

            setOthersArrayForNylon([...othersArrayForNylon, newValue]);

            setProductCategoryNewTyresNylon(prevState => ({
                ...prevState,
                brands: [...prevState?.brands, newValue?.value]
            }));

            setOtherValueForNylon('');
        }
    };


    const handleRemoveOtherValueForNylon = (keyToRemove) => {
        const updatedOthersArray = othersArrayForNylon?.filter(obj => obj.key !== keyToRemove);
        setOthersArrayForNylon(updatedOthersArray);

        setProductCategoryNewTyresNylon(prevState => ({
            ...prevState,
            brands: prevState.brands?.filter(value => value !== keyToRemove)
        }));
    };
    // nylon

    const [open, setOpen] = useState(false);

    const [showCustomerWarning, setShowCustomerWarning] = useState(false)
    const [showSalesPersonWarning, setShowSalesPersonWarning] = useState(false)
    const [showCustomerBranchWarning, setShowCustomerBranchWarning] = useState(false)
    const [showMeetingPersonWarning, setShowMeetingPersonWarning] = useState(false)
    const [showAgendaWarning, setShowAgendaWarning] = useState(false)
    const [showStatusWarning, setShowStatusWarning] = useState(false)
    const [showReasonWarning, setShowReasonWarning] = useState(false)
    const [showOtherReasonWarning, setShowOtherReasonWarning] = useState(false)

    const [showRegripTyresReasonWarning, setShowRegripTyresReasonWarning] = useState(false)
    const [showRegripTyresOtherReasonWarning, setShowRegripTyresOtherReasonWarning] = useState(false)
    const [showRegripTyresConstructionReasonWarning, setShowRegripTyresConstructionReasonWarning] = useState(false)

    const [showNewTyresReasonWarning, setShowNewTyresReasonWarning] = useState(false)
    const [showNewTyresOtherReasonWarning, setShowNewTyresOtherReasonWarning] = useState(false)
    const [showNewTyresConstructionNylonReasonWarning, setShowNewTyresConstructionNylonReasonWarning] = useState(false)
    const [showNewTyresConstructionRadialReasonWarning, setShowNewTyresConstructionRadialReasonWarning] = useState(false)

    const [showTyresScrapReasonWarning, setShowTyresScrapReasonWarning] = useState(false)
    const [showTyresScrapOtherReasonWarning, setShowTyresScrapOtherReasonWarning] = useState(false)

    const [showRetreadingReasonWarning, setShowRetreadingReasonWarning] = useState(false)
    const [showRetreadingOtherReasonWarning, setShowRetreadingOtherReasonWarning] = useState(false)

    const [showServiceReasonWarning, setShowServiceReasonWarning] = useState(false)
    const [showServiceOtherReasonWarning, setShowServiceOtherReasonWarning] = useState(false)


    const [loading, setLoading] = useState(false);
    const [loadingCustomer, setLoadingCustomer] = useState(false);
    const [loadingMeetingPerson, setLoadingMeetingPerson] = useState(false);
    const [loadingSalesPerson, setLoadingSalesPerson] = useState(false);

    const [openAddCustomer, setOpenAddCustomer] = useState(false);
    const [openAddMeetingPersonModal, setOpenAddMeetingPersonModal] = useState(false);

    const [selectedIndex, setSelectedIndex] = useState(null);
    const [selectedName, setSelectedName] = useState("");
    const [selectedReason, setSelectedReason] = useState("")

    const [customerData, setCustomerData] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState('');
    const [selectedCustomerBranch, setSelectedCustomerBranch] = useState('');
    const [meetingPersonName, setMeetingPersonName] = useState('');
    const [meetingPersons, setMeetingPersons] = useState([]);
    const [selectedMeetingPerson, setSelectedMeetingPerson] = useState('');
    const [meetingPersonDesignation, setMeetingPersonDesignation] = useState('');
    const [selectedProductCategory, setSelectedProductCategory] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState('');
    // const [selectedNextMeetingDate, setSelectedNextMeetingDate] = useState(dayjs(new Date()));
    const [selectedNextMeetingDate, setSelectedNextMeetingDate] = useState("");
    const [conversation, setConversation] = useState('');
    const [minutesOfMeeting, setMinutesOfMeeting] = useState('');

    const [selectedAgendaOfMeeting, setSelectedAgendaOfMeeting] = useState('');

    const [showProductCategory, setShowProductCategory] = useState(false)
    const [showInterested, setShowInterested] = useState(false)
    const [isInterested, setIsInterested] = useState(true)


    const [salespersonData, setSalespersonData] = useState([]);
    const [selectedSalesPerson, setSelectedSalesPerson] = useState(null);

    const [productCategoryRegripTyres, setProductCategoryRegripTyres] = useState({
        name: "Regrip Tyres",
        is_interested: true,
        reason: null,
    })
    const [productCategoryNewTyres, setProductCategoryNewTyres] = useState({
        name: "New Tyres",
        is_interested: true,
        reason: null,
    })
    const [productCategoryNewTyresRadial, setProductCategoryNewTyresRadial] = useState({
        name: "Radial",
        is_interested: true,
        brands: [],
    })

    const [productCategoryNewTyresNylon, setProductCategoryNewTyresNylon] = useState({
        name: "Nylon",
        is_interested: true,
        brands: [],
    })


    const [productCategoryTyreScrap, setProductCategoryTyreScrap] = useState({
        name: "Tyres Scrap",
        is_interested: true,
        reason: null,
    })
    const [productCategoryRetreading, setProductCategoryRetreading] = useState({
        name: "Retreading",
        is_interested: true,
        reason: null,
    })
    const [productCategoryService, setProductCategoryService] = useState({
        name: "Service",
        is_interested: true,
        reason: null,
    })


    // const productCategory=[

    //     {
    //         name: "Regrip Tyres",
    //         reason: selectedReason,
    //         is_interested: productChecked
    //     },
    //     {
    //         name: "New Tyres",
    //         reason: "Pricing issue",
    //         is_interested: false
    //     },
    //     {
    //         name: "Tyre Scrap",
    //         reason: null,
    //         is_interested: true
    //     },
    //     {
    //         name: "Retreading",
    //         reason: "Taking on Credit",
    //         is_interested: false
    //     },
    //     {
    //         name: "Service",
    //         reason: "Not needed",
    //         is_interested: false
    //     }


    // ]

    const openAddCustomerModal = () => {
        setOpenAddCustomer(true)
    };

    const reset = () => {
        setSelectedCustomer('');
        setMeetingPersonName('');
        setMeetingPersonDesignation('');
        setSelectedProductCategory([]);
        setSelectedStatus('');
        setSelectedNextMeetingDate('');
        setConversation('');
        setMinutesOfMeeting('');
        setSelectedAgendaOfMeeting('');
        setShowProductCategory(false);
        setShowInterested(false);
    };

    const GenerateLeadSubmit = async () => {

        const token = localStorage.getItem("token");
        const bearer_token = "bearer " + JSON.parse(token);

        // const checked = true
        let exit = false

        try {
            if (!productCategoryRegripTyres.is_interested && !productCategoryNewTyres.is_interested && !productCategoryTyreScrap.is_interested && !productCategoryRetreading.is_interested && !productCategoryService.is_interested) {
                setIsInterested(false)
            }
            if (
                (selectedAgendaOfMeeting === "Sales Pitch" && isInterested === true && !selectedStatus) ||
                !selectedSalesPerson ||
                !selectedAgendaOfMeeting ||
                !selectedCustomer ||
                !selectedCustomerBranch ||
                !selectedMeetingPerson
            ) {
                if (selectedAgendaOfMeeting === "Sales Pitch" && !selectedStatus) {
                    !selectedStatus && setShowStatusWarning(true);
                }
                !selectedSalesPerson && setShowSalesPersonWarning(true);
                !selectedAgendaOfMeeting && setShowAgendaWarning(true);
                !selectedCustomer && setShowCustomerWarning(true);
                !selectedCustomerBranch && setShowCustomerBranchWarning(true);
                !selectedMeetingPerson && setShowMeetingPersonWarning(true);

                exit = true;
            }

            if (selectedAgendaOfMeeting === 'Sales Pitch') {
                if (productCategoryRegripTyres?.is_interested && !productCategoryRegripTyres?.construction_type) {
                    setShowRegripTyresConstructionReasonWarning(true)
                }
                if (!productCategoryRegripTyres.is_interested && !productCategoryRegripTyres.reason) {
                    setShowRegripTyresReasonWarning(true)
                    exit = true;
                }
                if (productCategoryNewTyres?.is_interested && productCategoryNewTyresNylon?.brands?.length === 0) {
                    setShowNewTyresConstructionNylonReasonWarning(true)
                    exit = true;
                }
                if (productCategoryNewTyres?.is_interested && productCategoryNewTyresRadial?.brands?.length === 0) {
                    setShowNewTyresConstructionRadialReasonWarning(true)
                    exit = true;
                }
                if (!productCategoryNewTyres.is_interested && !productCategoryNewTyres.reason) {
                    setShowNewTyresReasonWarning(true)
                    exit = true;
                }
                if (!productCategoryTyreScrap.is_interested && !productCategoryTyreScrap.reason) {
                    setShowTyresScrapReasonWarning(true)
                    exit = true;
                }
                if (!productCategoryRetreading.is_interested && !productCategoryRetreading.reason) {
                    setShowRetreadingReasonWarning(true)
                    exit = true;
                }
                if (!productCategoryService.is_interested && !productCategoryService.reason) {
                    setShowServiceReasonWarning(true)
                    exit = true;
                }
            }
            if (exit === true) {
                return;
            }

            setLoading(true)
            let data
            if (selectedAgendaOfMeeting === 'Sales Pitch') {
                data = {
                    employee_id: selectedSalesPerson.value,
                    customer_id: selectedCustomer.value,
                    customer_branch_id: selectedCustomerBranch.value,
                    meeting_person_id: selectedMeetingPerson.value,
                    agenda_of_meeting: selectedAgendaOfMeeting,
                    product_category: [
                        productCategoryRegripTyres,
                        {
                            name: productCategoryNewTyres.name,
                            is_interested: productCategoryNewTyres.is_interested,
                            reason: productCategoryNewTyres?.is_interested ? null : productCategoryNewTyres.reason,
                            construction_type: productCategoryNewTyres?.is_interested ? [
                                productCategoryNewTyresRadial,
                                productCategoryNewTyresNylon
                            ] :
                                null
                        },
                        productCategoryTyreScrap,
                        productCategoryRetreading,
                        productCategoryService,
                    ],
                    next_meeting_date: selectedNextMeetingDate ? format(new Date(selectedNextMeetingDate), 'dd/MM/yyyy') : null,
                    lead_status: selectedStatus,
                    conversation: conversation,
                    minutes_of_meeting: minutesOfMeeting,
                    visit_type: "On Call",
                    close_reason: selectedReason,
                    is_interested: isInterested
                };
            }

            else {
                data = {
                    employee_id: selectedSalesPerson.value,
                    customer_id: selectedCustomer.value,
                    customer_branch_id: selectedCustomerBranch.value,
                    meeting_person_id: selectedMeetingPerson.value,
                    agenda_of_meeting: selectedAgendaOfMeeting,
                    conversation: conversation,
                    minutes_of_meeting: minutesOfMeeting,
                    visit_type: "On Call",
                    close_reason: "Closed",
                    is_interested: false
                };
            }


            if (isInterested === false) {
                data.next_meeting_date = null
            }

            if (selectedAgendaOfMeeting === "Sales Pitch" && isInterested === false) {
                data.lead_status = "Closed"
            }

            if (selectedStatus === null) {
                data.lead_status = "Closed"
            }

            const response = await axios.post(`${API_URL}/lead`, data, {
                headers: {
                    Authorization: bearer_token,
                },
            });

            console.log('Lead created successfully:', response.data);
            reset()
            setLoading(false)
            onClose("Lead created successfully")
            setGenerateLeadModal(false)
        } catch (error) {
            console.error('Error creating lead:', error.message);
            toast.error("Error white creating Lead", {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 2000,
            })
        } finally {
            setLoading(false);
        }
    }

    const prefilledConditionMessage = () => {
        if (selectedAgendaOfMeeting === "Sales Pitch" && isInterested && selectedNextMeetingDate === '') {
            setMinutesOfMeeting(
                `Hi Sir, This is ${selectedSalesPerson?.label} from Regrip. It was nice meeting you. Thank you for showing your interest in Regrip. We hope that you will give us a chance to serve you soon. In case of any further enquiry or assistance, you may reach out to +91 9057599924\nThanks`
            );
        }

        else if (selectedAgendaOfMeeting === "Sales Pitch" && isInterested && selectedNextMeetingDate !== '') {
            setMinutesOfMeeting(
                `Hi Sir , This is ${selectedSalesPerson?.label} from regrip. Thank you for showing your interest in Regrip. We hope that you will give us chance to serve you soon. Our next meeting date is scheduled on ${format(new Date(selectedNextMeetingDate), 'dd/MM/yyyy')}. In case of any further enquiry or assistance, you may reached out to +91 9057599924\nThanks`);
        }
        else if (selectedAgendaOfMeeting === "Sales Pitch" && !isInterested) {
            setMinutesOfMeeting(
                `Hi Sir, This is ${selectedSalesPerson?.label} from Regrip. It was nice meeting you. Thank you for giving your valuable time. Your feedback is valuable for us. We hope that you will give us a chance to serve you next time. In case of any further enquiry or assistance, you may reach out to +91 9057599924\nThanks`
            );
        }
        else {
            setMinutesOfMeeting("");
        }
    }


    const getAllSalesPerson = async () => {
        try {
            setLoadingSalesPerson(true)
            const { data } = await axios.get(`${API_URL}/employee/sales-employees`);
            setLoading(false);
            setSalespersonData(data.data);
            setLoadingSalesPerson(false)
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const handleItemClick = (index, name) => {
        setSelectedIndex(index);
        // setSelectedReason("")
        onChange(name);

    };
    const onChange = (name) => {
        setSelectedName(name);
    };


    const getAllMeetingPersons = async (customerBranchId) => {
        try {
            setLoadingMeetingPerson(true);
            const { data } = await axios.get(`${API_URL}/meeting-person`, {
                params: {
                    customer_branch_id: customerBranchId
                }
            });
            setLoadingMeetingPerson(false);
            setMeetingPersons(data.data);
        } catch (error) {
            console.error("Error fetching data:", error);
            setLoadingMeetingPerson(true);
        }
    };

    useEffect(() => {
        getAllSalesPerson();
        prefilledConditionMessage()
    }, [selectedAgendaOfMeeting, selectedNextMeetingDate, isInterested, selectedSalesPerson]);

    useEffect(() => {
        const storedSalesPerson = JSON.parse(localStorage.getItem('selectedSalesPerson'));
        if (storedSalesPerson) {
            setSelectedSalesPerson(storedSalesPerson);
        }
    }, []);

    const handleSalesPersonSelection = (event, newValue) => {
        setSelectedSalesPerson(newValue);
        localStorage.setItem('selectedSalesPerson', JSON.stringify(newValue));
    };



    const getAllCustomer = async () => {
        try {
            setLoadingCustomer(true)
            const { data } = await axios.get(`${API_URL}/customer`);
            setLoadingCustomer(false)
            setCustomerData(data.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {

        getAllSalesPerson();
        getAllCustomer();
    }, []);

    useEffect(() => {
        if (selectedAgendaOfMeeting === "Sales Pitch") {
            setShowProductCategory(true);
            setShowInterested(true);
        }

        else {
            setShowProductCategory(false);
            setShowInterested(false);
            setSelectedNextMeetingDate('')
            setSelectedStatus(null)
        }
    }, [selectedAgendaOfMeeting]);

    return (
        <div className='main-generate'>
            <ToastContainer className="custom-toast-container" />
            <div className='generate-lead-title-with-salesperson-field'>
                <h3 style={{ fontSize: 20, color: 'grey' }}>Generate Lead</h3>

                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "10px", }}>
                    <h4 className='assign-text'>
                        Assign to:
                    </h4>
                    <Autocomplete
                        style={{ border: showSalesPersonWarning ? ' 1px solid red' : ' 1px solid #ccc' }}
                        sx={{ fontSize: "14px" }}
                        className='fieldSize'
                        placeholder="Select Sales Person"
                        options={salespersonData.map((salesperson, index) => ({
                            label: salesperson.first_name,
                            value: salesperson.employee_id,
                            key: `salesperson_${salesperson.employee_id}`,
                        }))}
                        loading={loadingSalesPerson}
                        endDecorator={
                            loadingSalesPerson ? (
                                <CircularProgress size="sm" sx={{ bgcolor: 'background.surface' }} />
                            ) : null
                        }
                        value={selectedSalesPerson}
                        // onChange={() => {
                        //     setShowSalesPersonWarning(false)
                        //     handleSalesPersonSelection()

                        // }}

                        onChange={(event, newValue) => {
                            setSelectedSalesPerson(newValue);
                            localStorage.setItem('selectedSalesPerson', JSON.stringify(newValue));

                        }}
                    />
                </div>
            </div>
            <div className='generate-lead-main'>
                <Modal
                    aria-labelledby="modal-title"
                    aria-describedby="modal-desc"
                    open={openAddCustomer}
                    onClose={() => setOpenAddCustomer(false)}
                    sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                >
                    <Sheet
                        variant="plain"
                        sx={{
                            width: "80%",
                            height: "75%",
                            borderRadius: 'md',
                            p: 3,
                            boxShadow: 'lg',
                            position: "relative"
                        }}
                    >
                        <ModalClose variant="plain" sx={{ m: 0 }} />
                        <AddCustomer salesperson={selectedSalesPerson} />
                    </Sheet>
                </Modal>

                <Modal
                    aria-labelledby="modal-title"
                    aria-describedby="modal-desc"
                    open={openAddMeetingPersonModal}
                    onClose={() => setOpenAddMeetingPersonModal(false)}
                    sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                >
                    <Sheet
                        variant="plain"
                        sx={{
                            width: "400px",
                            height: "460px",
                            borderRadius: 'md',
                            p: 3,
                            boxShadow: 'lg',
                            position: "relative"
                        }}
                    >
                        <ModalClose variant="plain" sx={{ m: 0 }} />
                        <AddMeetingPerson customerBranch={selectedCustomerBranch} getAllMeetingPersons={getAllMeetingPersons} setOpenAddMeetingPersonModal={setOpenAddMeetingPersonModal} />
                    </Sheet>
                </Modal>

                <div className='generate-lead-components' style={{ display: "flex" }}>
                    <div className='fieldSize autocomplete-container' style={{ position: 'relative', display: "flex", justifyContent: "center", alignItems: "center", gap: "10px", border: "none" }}>
                        <h5 style={{ position: 'absolute', top: -20, left: 0 }}>Customer</h5>

                        <Autocomplete
                            style={{ border: showCustomerWarning ? ' 1px solid red' : ' 1px solid #ccc' }}
                            className='autocomplete'
                            placeholder="Select Customer"
                            options={customerData.map((customer, index) => ({
                                label: customer?.customer_name,
                                value: customer?.customer_id,
                                key: `customer_${customer?.customer_id}`,
                                customerType: customer?.customer_type,
                                data: customer
                            }))}
                            value={selectedCustomer}
                            onChange={(event, newValue) => {
                                setShowCustomerWarning(false)
                                setSelectedCustomer(newValue);
                                if (newValue?.data.customer_type === 'dealer') {
                                    setSelectedCustomerBranch({
                                        label: newValue?.data?.branches[0]?.customer_branch_name,
                                        value: newValue?.data?.branches[0]?.customer_branch_id,
                                        key: `customer_${newValue?.data?.branches[0]?.customer_branch_id}`,
                                        data: newValue?.data?.branches[0]
                                    })
                                    getAllMeetingPersons(newValue?.data?.branches[0]?.customer_branch_id)
                                }
                                else {
                                    setSelectedCustomerBranch('')
                                }
                            }}
                            loading={loadingCustomer}
                            endDecorator={
                                loadingCustomer ? (
                                    <CircularProgress size="sm" sx={{ bgcolor: 'background.surface' }} />
                                ) : null
                            }
                            renderOption={(props, option) => (
                                <AutocompleteOption {...props}>
                                    <div className='autocomplete-option'>
                                        <p>{option.label}</p>
                                        <div className='autocomplete-chip-container'>
                                            <div className={`autocomplete-chip ${option.customerType}`}>
                                                {option.customerType}
                                            </div>
                                        </div>
                                    </div>
                                </AutocompleteOption>
                            )}
                        />
                        <div style={{ cursor: 'pointer', height: '100%' }} onClick={() => openAddCustomerModal()}>
                            <FontAwesomeIcon
                                icon={faPlus}
                                style={{ color: "#000", marginRight: "5px" }}
                            />
                        </div>
                        {
                            selectedCustomer?.data?.customer_type === 'transporter' && selectedCustomer?.data?.branches?.length === 0 &&
                            <div className='no-branch-warning'>Please Add Branches for this Customer</div>
                        }
                    </div>

                    {
                        selectedCustomer?.data?.customer_type === 'transporter' &&
                        selectedCustomer?.data?.branches[0]?.customer_branch_id !== null
                        &&
                        <div className='fieldSize autocomplete-container' style={{ position: 'relative', display: "flex", justifyContent: "center", alignItems: "center", gap: "10px", border: "none" }}>
                            <h5 style={{ position: 'absolute', top: -20, left: 0 }}>Branch</h5>
                            <Autocomplete
                                style={{ border: showCustomerBranchWarning ? ' 1px solid red' : ' 1px solid #ccc' }}
                                className='autocomplete'
                                placeholder="Select Branch"
                                options={selectedCustomer?.data?.branches?.map((branch, index) => ({
                                    label: branch?.customer_branch_name,
                                    value: branch?.customer_branch_id,
                                    key: `customer_${branch?.customer_branch_id}`,
                                    data: branch
                                }))}
                                value={selectedCustomerBranch}
                                onChange={(event, newValue) => {
                                    setShowCustomerBranchWarning(false)
                                    setSelectedCustomerBranch(newValue);
                                    getAllMeetingPersons(newValue?.value)
                                }}
                            />
                            <div style={{ height: '100%', color: 'white' }} >
                                <FontAwesomeIcon
                                    icon={faPlus}
                                    style={{ backgroundColor: 'white', color: "white", marginRight: "5px" }}
                                />
                            </div>
                        </div>
                    }

                    {
                        selectedCustomerBranch &&
                        <div className='fieldSize autocomplete-container' style={{ position: 'relative', display: "flex", justifyContent: "center", alignItems: "center", gap: "10px", border: "none" }}>
                            <h5 style={{ position: 'absolute', top: -20, left: 0 }}>Meeting Person</h5>

                            <Autocomplete
                                style={{ border: showMeetingPersonWarning ? ' 1px solid red' : ' 1px solid #ccc' }}
                                className='autocomplete'
                                placeholder="Select Meeting Persons"
                                options={meetingPersons?.map((person, index) => ({
                                    label: person?.meeting_person_name,
                                    value: person?.meeting_person_id,
                                    key: `customer_${person?.customer_branch_id}`,
                                    // data:person
                                }))}
                                loading={loadingMeetingPerson}
                                endDecorator={
                                    loadingMeetingPerson ? (
                                        <CircularProgress size="sm" sx={{ bgcolor: 'background.surface' }} />
                                    ) : null
                                }
                                value={selectedMeetingPerson}
                                onChange={(event, newValue) => {
                                    setShowMeetingPersonWarning(false)
                                    setSelectedMeetingPerson(newValue);
                                }}
                            />
                            <div style={{ cursor: 'pointer', height: '100%' }} onClick={() => setOpenAddMeetingPersonModal(true)}>
                                <FontAwesomeIcon
                                    icon={faPlus}
                                    style={{ color: "#000", marginRight: "5px" }}
                                />
                            </div>
                        </div>
                    }

                    <div style={{ position: 'relative', width: 100 }}>
                        <h5 style={{ position: 'absolute', top: -20, left: 0 }}>Agenda Of Meeting</h5>
                        <Select
                            className='fieldSize'
                            style={{ border: showAgendaWarning ? ' 1px solid red' : ' 1px solid #ccc' }}

                            placeholder="Agenda Of Meeting"
                            value={selectedAgendaOfMeeting}
                            onChange={(event, newValue) => {
                                setShowAgendaWarning(false)
                                setSelectedAgendaOfMeeting(newValue);
                            }}
                        >
                            <Option value="Sales Pitch">Sales Pitch</Option>
                            <Option value="Collection">Collection</Option>
                            <Option value="General Meeting">General Meeting</Option>
                            <Option value="Other"> Other</Option>

                        </Select>
                    </div>

                </div>
                
                {
                    showInterested &&

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        <h5>Product Category</h5>

                        <div className='generate-lead-components-category'>
                            <div style={{ position: 'relative' }} className='reasondiv'>
                                <h5 className='product-categories-heading'>Category</h5>
                                <div className='fieldSize-for-interested'>
                                    <h5>Regrip Tyres</h5>
                                    <Switch
                                        checked={productCategoryRegripTyres.is_interested}
                                        onChange={(event) => {
                                            // setProductChecked(event.target.checked)
                                            // setSelectedReason("")
                                            // setSelectedIndex(null)
                                            // setSelectedName("")
                                            setIsInterested(
                                                (event.target.checked || productCategoryNewTyres.is_interested || productCategoryRetreading.is_interested || productCategoryTyreScrap.is_interested || productCategoryService.is_interested)
                                            )
                                            setProductCategoryRegripTyres({
                                                name: "Regrip Tyres",
                                                is_interested: event.target.checked,
                                                reason: null
                                            })
                                        }}

                                        color={productCategoryRegripTyres.is_interested ? 'success' : 'neutral'}
                                        // variant={productCategoryRegripTyres.is_interested ? 'solid' : 'outlined'}
                                        endDecorator={productCategoryRegripTyres.is_interested ? 'Yes' : 'No'}
                                        slotProps={{
                                            endDecorator: {
                                                sx: {
                                                    minWidth: 40,
                                                },
                                            },
                                        }}
                                    />
                                </div>
                            </div>

                            {
                                !productCategoryRegripTyres.is_interested &&
                                <div className='reasondiv'>
                                    <div><h5 className='product-categories-heading'>Reason</h5></div>
                                    <div style={{ display: "flex", justifyContent: "start", alignItems: "center", gap: "10px" }}>

                                        <div className='reasons-main' style={{ border: showRegripTyresReasonWarning ? ' 1px solid red' : ' 1px solid #ccc' }}
                                        >
                                            <span
                                                style={{ width: 'fit=-content' }}
                                                className={`reasons-fields ${productCategoryRegripTyres.reason === 'Not Using Retread' ? 'selected' : ''}`}
                                                onClick={() => {
                                                    setProductCategoryRegripTyres({
                                                        ...productCategoryRegripTyres,
                                                        reason: 'Not Using Retread'
                                                    })
                                                    setShowReasonWarning(false)
                                                    setShowRegripTyresReasonWarning(false)
                                                }}
                                            >
                                                Not Using Retread
                                            </span>
                                            <span
                                                className={`reasons-fields ${productCategoryRegripTyres.reason === 'Pricing Issue' ? 'selected' : ''}`}
                                                onClick={() => {
                                                    setProductCategoryRegripTyres({
                                                        ...productCategoryRegripTyres,
                                                        reason: 'Pricing Issue'
                                                    })
                                                    setShowRegripTyresReasonWarning(false)
                                                    // setShowReasonWarning(false)
                                                }}
                                            >
                                                Pricing Issue
                                            </span>
                                            <span
                                                className={`reasons-fields ${(productCategoryRegripTyres.reason !== 'Pricing Issue' && productCategoryRegripTyres.reason !== 'Not Using Retread' && productCategoryRegripTyres.reason !== null) ? 'selected' : ''}`}
                                                onClick={() => {
                                                    setProductCategoryRegripTyres({
                                                        ...productCategoryRegripTyres,
                                                        reason: ''
                                                    })
                                                    setShowRegripTyresReasonWarning(false)
                                                }}
                                            >
                                                Others
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            }

                            {
                                (productCategoryRegripTyres.reason !== 'Pricing Issue' && productCategoryRegripTyres.reason !== 'Not Using Retread' && !productCategoryRegripTyres.is_interested && productCategoryRegripTyres.reason !== null) && (
                                    <div className='reasondiv'>
                                        <div><h5 className='product-categories-heading'>Others</h5></div>

                                        <Textarea
                                            style={{ border: showRegripTyresOtherReasonWarning ? ' 1px solid red' : ' 1px solid #ccc' }}
                                            className="generate-lead-components-reason"
                                            placeholder='Write other reason'
                                            minRows={2}
                                            variant="outlined"
                                            sx={{ fontSize: "1vw" }}
                                            value={productCategoryRegripTyres.reason}
                                            onChange={(e) => {
                                                setProductCategoryRegripTyres({
                                                    ...productCategoryRegripTyres,
                                                    reason: e.target.value
                                                })
                                                setShowRegripTyresOtherReasonWarning(false)
                                            }}
                                        />
                                    </div>
                                )
                            }

                            {
                                productCategoryRegripTyres?.is_interested &&
                                <div style={{ position: 'relative' }}>

                                    <h5 className='product-categories-heading'>Construction Type</h5>
                                    <Select
                                        style={{ border: showRegripTyresConstructionReasonWarning ? ' 1px solid red' : ' 1px solid #ccc', height: '40px', fontSize: '0.95vw' }}
                                        // value={selectedStatus}
                                        onChange={(event, newValue) => {
                                            setProductCategoryRegripTyres({
                                                ...productCategoryRegripTyres,
                                                construction_type: newValue
                                            })
                                            setShowRegripTyresConstructionReasonWarning(false)
                                        }}
                                        multiple
                                        className='fieldSize'
                                        placeholder="Select Type">
                                        <Option value="Radial">Radial</Option>
                                        <Option value="Nylon">Nylon</Option>
                                        <Option value="Tubeless">Tubeless</Option>
                                    </Select>
                                </div>
                            }
                        </div>

                        <div className='generate-lead-components-category'>
                            <div style={{ position: 'relative' }} className='reasondiv'>
                                <h5 className='product-categories-heading'>Category</h5>
                                <div className='fieldSize-for-interested'>
                                    <h5>New Tyres</h5>
                                    <Switch
                                        checked={productCategoryNewTyres.is_interested}
                                        onChange={(event) => {
                                            // setProductChecked(event.target.checked)
                                            // setSelectedReason("")
                                            // setSelectedIndex(null)
                                            // setSelectedName("")
                                            setIsInterested(
                                                (productCategoryRegripTyres.is_interested || event.target.checked || productCategoryRetreading.is_interested || productCategoryTyreScrap.is_interested || productCategoryService.is_interested)
                                            )
                                            setProductCategoryNewTyres({
                                                name: "New Tyres",
                                                is_interested: event.target.checked,
                                                reason: null,
                                                construction_type: []
                                            })

                                        }}

                                        color={productCategoryNewTyres.is_interested ? 'success' : 'neutral'}
                                        // variant={productCategoryRegripTyres.is_interested ? 'solid' : 'outlined'}
                                        endDecorator={productCategoryNewTyres.is_interested ? 'Yes' : 'No'}
                                        slotProps={{
                                            endDecorator: {
                                                sx: {
                                                    minWidth: 40,
                                                },
                                            },
                                        }}
                                    />
                                </div>
                            </div>

                            {
                                !productCategoryNewTyres.is_interested &&
                                <div className='reasondiv'>
                                    <div><h5 className='product-categories-heading'>Reason</h5></div>
                                    <div style={{ display: "flex", justifyContent: "start", alignItems: "center", gap: "10px" }}>

                                        <div className='reasons-main' style={{ border: showNewTyresReasonWarning ? ' 1px solid red' : ' 1px solid #ccc' }}
                                        >
                                            <span
                                                style={{ width: 'fit=-content' }}
                                                className={`reasons-fields ${productCategoryNewTyres.reason === 'Pricing Issue' ? 'selected' : ''}`}
                                                onClick={() => {
                                                    setProductCategoryNewTyres({
                                                        ...productCategoryNewTyres,
                                                        reason: 'Pricing Issue'
                                                    })
                                                    setShowNewTyresReasonWarning(false)
                                                }}
                                            >
                                                Pricing Issue
                                            </span>
                                            <span
                                                className={`reasons-fields ${productCategoryNewTyres.reason === 'Buying On Credit' ? 'selected' : ''}`}
                                                onClick={() => {
                                                    setProductCategoryNewTyres({
                                                        ...productCategoryNewTyres,
                                                        reason: 'Buying On Credit'
                                                    })
                                                    setShowNewTyresReasonWarning(false)
                                                    // setShowReasonWarning(false)
                                                }}
                                            >
                                                Buying On Credit
                                            </span>
                                            <span
                                                className={`reasons-fields ${(productCategoryNewTyres.reason !== 'Buying On Credit' && productCategoryNewTyres.reason !== 'Pricing Issue' && productCategoryNewTyres.reason !== null) ? 'selected' : ''}`}
                                                onClick={() => {
                                                    setProductCategoryNewTyres({
                                                        ...productCategoryNewTyres,
                                                        reason: ''
                                                    })
                                                    setShowNewTyresReasonWarning(false)
                                                }}
                                            >
                                                Others
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            }

                            {
                                (productCategoryNewTyres.reason !== 'Pricing Issue' && productCategoryNewTyres.reason !== 'Buying On Credit' && !productCategoryNewTyres.is_interested && productCategoryNewTyres.reason !== null) && (
                                    <div className='reasondiv'>
                                        <div><h5 className='product-categories-heading'>Others</h5></div>

                                        <Textarea
                                            style={{ border: showNewTyresOtherReasonWarning ? ' 1px solid red' : ' 1px solid #ccc' }}
                                            className="generate-lead-components-reason"
                                            placeholder='Write other reason'
                                            minRows={2}
                                            variant="outlined"
                                            sx={{ fontSize: "1vw" }}
                                            value={productCategoryNewTyres.reason}
                                            onChange={(e) => {
                                                setProductCategoryNewTyres({
                                                    ...productCategoryNewTyres,
                                                    reason: e.target.value
                                                })
                                                setShowNewTyresOtherReasonWarning(false)
                                            }}
                                        />
                                    </div>
                                )
                            }
                            {
                                productCategoryNewTyres?.is_interested &&
                                <div style={{ display: 'grid', gap: 10 }}>
                                    <div style={{ display: 'flex', gap: 60 }}>
                                        <div style={{ position: 'relative' }} className='reasondiv'>
                                            <h5 className='product-categories-heading'>Construction Type</h5>
                                            <div className='fieldSize-for-interested'>
                                                <h5>Radial</h5>
                                                <Switch
                                                    checked={(productCategoryNewTyresRadial?.is_interested)}

                                                    onChange={(event) => {
                                                        setOthersArray([])
                                                        setOtherValue("")
                                                        setProductCategoryNewTyresRadial(
                                                            {
                                                                name: "Radial",
                                                                is_interested: event?.target?.checked,
                                                                brands: []
                                                            }
                                                        )
                                                    }}

                                                    color={productCategoryNewTyresRadial?.is_interested ? 'success' : 'neutral'}
                                                    // variant={productCategoryRegripTyres.is_interested ? 'solid' : 'outlined'}
                                                    endDecorator={productCategoryNewTyresRadial?.is_interested ? 'Yes' : 'No'}
                                                    slotProps={{
                                                        endDecorator: {
                                                            sx: {
                                                                minWidth: 40,
                                                            },
                                                        },
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        {
                                            productCategoryNewTyresRadial?.is_interested &&
                                            <>
                                                <div style={{ position: 'relative' }}>

                                                    <h5 className='product-categories-heading'>Brand</h5>
                                                    <Select
                                                        style={{ border: showNewTyresConstructionRadialReasonWarning ? ' 1px solid red' : ' 1px solid #ccc', height: '40px', fontSize: '0.95vw' }}
                                                        // value={selectedStatus}
                                                        // onChange={(event, newValue) => {
                                                        //     setProductCategoryNewTyresRadial(
                                                        //         {
                                                        //             ...productCategoryNewTyresRadial,
                                                        //             brands: newValue
                                                        //         }
                                                        //     )
                                                        //     setShowNewTyresConstructionRadialReasonWarning(false)
                                                        // }}
                                                        value={productCategoryNewTyresRadial?.brands}
                                                        onChange={handleChange}

                                                        multiple
                                                        className='fieldSize'
                                                        placeholder="Select Brands">
                                                        <Option value="MRF">MRF</Option>
                                                        <Option value="Appolo">Appolo</Option>
                                                        <Option value="Bridgestone">Bridgestone</Option>
                                                        <Option value="Ceat">Ceat</Option>
                                                        <Option value="JK">JK</Option>
                                                        <Option value="Michelin">Michelin</Option>
                                                        <Option value="Continental">Continental</Option>
                                                        <Option value="Others">Others</Option>
                                                    </Select>
                                                </div>

                                                {isOtherSelected && (
                                                    <div style={{ position: 'relative' }}>
                                                        <div className='add-customer-field-container'>
                                                            <h5 className='product-categories-heading'>Others</h5>
                                                            <div style={{ display: "flex", alignItems: "center", }}>
                                                                <Input
                                                                    className='field-others-customers'
                                                                    type="text"
                                                                    value={otherValue}
                                                                    onChange={handleOtherInputChange}
                                                                    placeholder="Enter other value"
                                                                    sx={{
                                                                        '&::before': {
                                                                            display: 'none',
                                                                        },
                                                                        '&:focus-within': {
                                                                            outline: 'none',
                                                                            outlineOffset: '2px',
                                                                        },
                                                                    }}
                                                                />
                                                                <button
                                                                    className='others-buttons-customers'
                                                                    onClick={handleAddOtherValue}>Add</button>
                                                            </div>
                                                            <div style={{ width: "230px", display: "flex", flexWrap: "wrap", }}>
                                                                {othersArray && othersArray?.map((value, index) => (
                                                                    <span style={{ display: "flex", alignItems: "center" }} key={index}>
                                                                        {value?.value}
                                                                        <button className="remove-others-btn" onClick={() => {
                                                                            handleRemoveOtherValue(value.key)

                                                                        }}> <FontAwesomeIcon
                                                                                className='crossicon'
                                                                                icon={faTimes}

                                                                            /></button>

                                                                        {index !== othersArray?.length - 1 && ','}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </>
                                        }


                                    </div>
                                    <div style={{ display: 'flex', gap: 60 }}>
                                        <div style={{ position: 'relative' }} className='reasondiv'>
                                            <h5 className='product-categories-heading'>Construction Type</h5>
                                            <div className='fieldSize-for-interested'>
                                                <h5>Nylon</h5>
                                                <Switch
                                                    checked={(productCategoryNewTyresNylon?.is_interested)}

                                                    onChange={(event) => {
                                                        setOthersArrayForNylon([])
                                                        setOtherValueForNylon("")
                                                        setProductCategoryNewTyresNylon(
                                                            {
                                                                name: "Nylon",
                                                                is_interested: event.target.checked,
                                                                brands: []
                                                            }
                                                        )
                                                    }}

                                                    color={productCategoryNewTyresNylon?.is_interested ? 'success' : 'neutral'}
                                                    // variant={productCategoryRegripTyres.is_interested ? 'solid' : 'outlined'}
                                                    endDecorator={productCategoryNewTyresNylon?.is_interested ? 'Yes' : 'No'}
                                                    slotProps={{
                                                        endDecorator: {
                                                            sx: {
                                                                minWidth: 40,
                                                            },
                                                        },
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        {
                                            productCategoryNewTyresNylon?.is_interested &&
                                            <>
                                                <div style={{ position: 'relative' }}>

                                                    <h5 className='product-categories-heading'>Brand</h5>
                                                    <Select
                                                        style={{ border: showNewTyresConstructionNylonReasonWarning ? ' 1px solid red' : ' 1px solid #ccc', height: '40px', fontSize: '0.95vw' }}
                                                        // value={selectedStatus}
                                                        // onChange={(event, newValue) => {
                                                        //     setProductCategoryNewTyresNylon(
                                                        //         {
                                                        //             ...productCategoryNewTyresNylon,
                                                        //             brands: newValue
                                                        //         }
                                                        //     )
                                                        //     setShowNewTyresConstructionNylonReasonWarning(false)
                                                        // }}
                                                        value={productCategoryNewTyresNylon?.brands}
                                                        onChange={handleChangeForNylon}
                                                        multiple
                                                        className='fieldSize'
                                                        placeholder="Select Brands">
                                                        <Option value="MRF">MRF</Option>
                                                        <Option value="Appolo">Appolo</Option>
                                                        <Option value="Bridgestone">Bridgestone</Option>
                                                        <Option value="Ceat">Ceat</Option>
                                                        <Option value="JK">JK</Option>
                                                        <Option value="Michelin">Michelin</Option>
                                                        <Option value="Contiental">Contiental</Option>
                                                        <Option value="Others">Others</Option>
                                                    </Select>
                                                </div>

                                                {isOtherSelectedForNylon && (
                                                    <div style={{ position: 'relative' }}>
                                                        <div className='add-customer-field-container'>
                                                            <h5 className='product-categories-heading'>Others</h5>
                                                            <div style={{ display: "flex", alignItems: "center", }}>
                                                                <Input
                                                                    className='field-others-customers'
                                                                    type="text"
                                                                    value={otherValueForNylon}
                                                                    onChange={handleOtherInputChangeForNylon}
                                                                    placeholder="Enter other value"
                                                                    sx={{
                                                                        '&::before': {
                                                                            display: 'none',
                                                                        },
                                                                        '&:focus-within': {
                                                                            outline: 'none',
                                                                            outlineOffset: '2px',
                                                                        },
                                                                    }}
                                                                />
                                                                <button
                                                                    className='others-buttons-customers'
                                                                    onClick={handleAddOtherValueForNylon}>Add</button>
                                                            </div>
                                                            <div style={{ width: "230px", display: "flex", flexWrap: "wrap", }}>
                                                                {othersArrayForNylon && othersArrayForNylon?.map((value, index) => (
                                                                    <span style={{ display: "flex", alignItems: "center" }} key={index}>
                                                                        {value.value}
                                                                        <button className="remove-others-btn" onClick={() => {
                                                                            handleRemoveOtherValueForNylon(value.key)

                                                                        }}> <FontAwesomeIcon
                                                                                className='crossicon'
                                                                                icon={faTimes}

                                                                            /></button>

                                                                        {index !== othersArray.length - 1 && ','}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </>
                                        }


                                    </div>
                                </div>
                            }
                        </div>

                        <div className='generate-lead-components-category'>
                            <div style={{ position: 'relative' }} className='reasondiv'>
                                <h5 className='product-categories-heading'>Category</h5>
                                <div className='fieldSize-for-interested'>
                                    <h5>Tyre Scrap</h5>
                                    <Switch
                                        checked={productCategoryTyreScrap.is_interested}
                                        onChange={(event) => {
                                            // setProductChecked(event.target.checked)
                                            // setSelectedReason("")
                                            // setSelectedIndex(null)
                                            // setSelectedName("")

                                            setProductCategoryTyreScrap({
                                                name: "Tyre Scrap",
                                                is_interested: event.target.checked,
                                                reason: null
                                            })
                                            setIsInterested(
                                                (productCategoryRegripTyres.is_interested || productCategoryNewTyres.is_interested || productCategoryRetreading.is_interested || event.target.checked || productCategoryService.is_interested)
                                            )

                                        }}

                                        color={productCategoryTyreScrap.is_interested ? 'success' : 'neutral'}
                                        // variant={productCategoryTyreScrap.is_interested ? 'solid' : 'outlined'}
                                        endDecorator={productCategoryTyreScrap.is_interested ? 'Yes' : 'No'}
                                        slotProps={{
                                            endDecorator: {
                                                sx: {
                                                    minWidth: 40,
                                                },
                                            },
                                        }}
                                    />
                                </div>
                            </div>

                            {
                                !productCategoryTyreScrap.is_interested &&
                                <div className='reasondiv'>
                                    <div><h5 className='product-categories-heading'>Reason</h5></div>
                                    <div style={{ display: "flex", justifyContent: "start", alignItems: "center", gap: "10px" }}>

                                        <div className='reasons-main' style={{ border: showTyresScrapReasonWarning ? ' 1px solid red' : ' 1px solid #ccc' }}
                                        >

                                            <span
                                                className={`reasons-fields ${productCategoryTyreScrap.reason === 'Pricing Issue' ? 'selected' : ''}`}
                                                onClick={() => {
                                                    setProductCategoryTyreScrap({
                                                        ...productCategoryTyreScrap,
                                                        reason: 'Pricing Issue'
                                                    })
                                                    setShowTyresScrapReasonWarning(false)
                                                    // setShowReasonWarning(false)
                                                }}
                                            >
                                                Pricing Issue
                                            </span>
                                            <span
                                                className={`reasons-fields ${(productCategoryTyreScrap.reason !== 'Pricing Issue' && productCategoryTyreScrap.reason !== null) ? 'selected' : ''}`}
                                                onClick={() => {
                                                    setProductCategoryTyreScrap({
                                                        ...productCategoryTyreScrap,
                                                        reason: ''
                                                    })
                                                    setShowTyresScrapReasonWarning(false)
                                                }}
                                            >
                                                Others
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            }

                            {
                                (productCategoryTyreScrap.reason !== 'Pricing Issue' && !productCategoryTyreScrap.is_interested && productCategoryTyreScrap.reason !== null) && (
                                    <div className='reasondiv'>
                                        <div><h5 className='product-categories-heading'>Others</h5></div>

                                        <Textarea
                                            style={{ border: showTyresScrapOtherReasonWarning ? ' 1px solid red' : ' 1px solid #ccc' }}
                                            className="generate-lead-components-reason"
                                            placeholder='Write other reason'
                                            minRows={2}
                                            variant="outlined"
                                            sx={{ fontSize: "1vw" }}
                                            value={productCategoryTyreScrap.reason}
                                            onChange={(e) => {
                                                setProductCategoryTyreScrap({
                                                    ...productCategoryTyreScrap,
                                                    reason: e.target.value
                                                })
                                                setShowTyresScrapOtherReasonWarning(false)
                                            }}
                                        />
                                    </div>
                                )
                            }
                        </div>

                        <div className='generate-lead-components-category'>
                            <div style={{ position: 'relative' }} className='reasondiv'>
                                <h5 className='product-categories-heading'>Category</h5>
                                <div className='fieldSize-for-interested'>
                                    <h5>Retreading</h5>
                                    <Switch
                                        checked={productCategoryRetreading.is_interested}
                                        onChange={(event) => {
                                            setIsInterested(
                                                (productCategoryRegripTyres.is_interested || productCategoryNewTyres.is_interested || event.target.checked || productCategoryTyreScrap.is_interested || productCategoryService.is_interested)
                                            )
                                            setProductCategoryRetreading({
                                                name: "Retreading",
                                                is_interested: event.target.checked,
                                                reason: null
                                            })

                                        }}

                                        color={productCategoryRetreading.is_interested ? 'success' : 'neutral'}
                                        // variant={productCategoryRegripTyres.is_interested ? 'solid' : 'outlined'}
                                        endDecorator={productCategoryRetreading.is_interested ? 'Yes' : 'No'}
                                        slotProps={{
                                            endDecorator: {
                                                sx: {
                                                    minWidth: 40,
                                                },
                                            },
                                        }}
                                    />
                                </div>
                            </div>

                            {
                                !productCategoryRetreading.is_interested &&
                                <div className='reasondiv'>
                                    <div><h5 className='product-categories-heading'>Reason</h5></div>
                                    <div style={{ display: "flex", justifyContent: "start", alignItems: "center", gap: "10px" }}>

                                        <div className='reasons-main' style={{ border: showRetreadingReasonWarning ? ' 1px solid red' : ' 1px solid #ccc' }}
                                        >
                                            <span
                                                style={{ width: 'fit=-content' }}
                                                className={`reasons-fields ${productCategoryRetreading.reason === 'Taking On Credit' ? 'selected' : ''}`}
                                                onClick={() => {
                                                    setProductCategoryRetreading({
                                                        ...productCategoryRetreading,
                                                        reason: 'Taking On Credit'
                                                    })
                                                    setShowRetreadingReasonWarning(false)
                                                }}
                                            >
                                                Taking On Credit
                                            </span>
                                            <span
                                                className={`reasons-fields ${productCategoryRetreading.reason === 'Pricing Issue' ? 'selected' : ''}`}
                                                onClick={() => {
                                                    setProductCategoryRetreading({
                                                        ...productCategoryRetreading,
                                                        reason: 'Pricing Issue'
                                                    })
                                                    setShowRetreadingReasonWarning(false)
                                                }}
                                            >
                                                Pricing Issue
                                            </span>
                                            <span
                                                className={`reasons-fields ${(productCategoryRetreading.reason !== 'Pricing Issue' && productCategoryRetreading.reason !== 'Taking On Credit' && productCategoryRetreading.reason !== null) ? 'selected' : ''}`}
                                                onClick={() => {
                                                    setProductCategoryRetreading({
                                                        ...productCategoryRetreading,
                                                        reason: ''
                                                    })
                                                    setShowRetreadingReasonWarning(false)
                                                }}
                                            >
                                                Others
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            }

                            {
                                (productCategoryRetreading.reason !== 'Pricing Issue' && productCategoryRetreading.reason !== 'Taking On Credit' && !productCategoryRetreading.is_interested && productCategoryRetreading.reason !== null) && (
                                    <div className='reasondiv'>
                                        <div><h5 className='product-categories-heading'>Others</h5></div>

                                        <Textarea
                                            style={{ border: showRetreadingOtherReasonWarning ? ' 1px solid red' : ' 1px solid #ccc' }}
                                            className="generate-lead-components-reason"
                                            placeholder='Write other reason'
                                            minRows={2}
                                            variant="outlined"
                                            sx={{ fontSize: "1vw" }}
                                            value={productCategoryRetreading.reason}
                                            onChange={(e) => {
                                                setProductCategoryRetreading({
                                                    ...productCategoryRetreading,
                                                    reason: e.target.value
                                                })
                                                setShowRetreadingOtherReasonWarning(false)
                                            }}
                                        />
                                    </div>
                                )
                            }
                        </div>

                        <div className='generate-lead-components-category'>
                            <div style={{ position: 'relative' }} className='reasondiv'>
                                <h5 className='product-categories-heading'>Category</h5>
                                <div className='fieldSize-for-interested'>
                                    <h5>Service</h5>
                                    <Switch
                                        checked={productCategoryService.is_interested}
                                        onChange={(event) => {
                                            setIsInterested(
                                                (productCategoryRegripTyres.is_interested || productCategoryNewTyres.is_interested || productCategoryRetreading.is_interested || productCategoryTyreScrap.is_interested || event.target.checked)
                                            )
                                            setProductCategoryService({
                                                name: "Service",
                                                is_interested: event.target.checked,
                                                reason: null
                                            })

                                        }}

                                        color={productCategoryService.is_interested ? 'success' : 'neutral'}
                                        // variant={productCategoryRegripTyres.is_interested ? 'solid' : 'outlined'}
                                        endDecorator={productCategoryService.is_interested ? 'Yes' : 'No'}
                                        slotProps={{
                                            endDecorator: {
                                                sx: {
                                                    minWidth: 40,
                                                },
                                            },
                                        }}
                                    />
                                </div>
                            </div>

                            {
                                !productCategoryService.is_interested &&
                                <div className='reasondiv'>
                                    <div><h5 className='product-categories-heading'>Reason</h5></div>
                                    <div style={{ display: "flex", justifyContent: "start", alignItems: "center", gap: "10px" }}>

                                        <div className='reasons-main' style={{ border: showServiceReasonWarning ? ' 1px solid red' : ' 1px solid #ccc' }}
                                        >
                                            <span
                                                style={{ width: 'fit=-content' }}
                                                className={`reasons-fields ${productCategoryService.reason === 'Not Needed' ? 'selected' : ''}`}
                                                onClick={() => {
                                                    setProductCategoryService({
                                                        ...productCategoryService,
                                                        reason: 'Not Needed'
                                                    })
                                                    setShowServiceReasonWarning(false)
                                                }}
                                            >
                                                Not Needed
                                            </span>
                                            <span
                                                className={`reasons-fields ${productCategoryService.reason === 'Pricing Issue' ? 'selected' : ''}`}
                                                onClick={() => {
                                                    setProductCategoryService({
                                                        ...productCategoryService,
                                                        reason: 'Pricing Issue'
                                                    })
                                                    setShowServiceReasonWarning(false)
                                                }}
                                            >
                                                Pricing Issue
                                            </span>
                                            <span
                                                className={`reasons-fields ${(productCategoryService.reason !== 'Pricing Issue' && productCategoryService.reason !== 'Not Needed' && productCategoryService.reason !== null) ? 'selected' : ''}`}
                                                onClick={() => {
                                                    setProductCategoryService({
                                                        ...productCategoryService,
                                                        reason: ''
                                                    })
                                                    setShowServiceReasonWarning(false)
                                                }}
                                            >
                                                Others
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            }

                            {
                                (productCategoryService.reason !== 'Pricing Issue' && productCategoryService.reason !== 'Not Needed' && !productCategoryService.is_interested && productCategoryService.reason !== null) && (
                                    <div className='reasondiv'>
                                        <div><h5 className='product-categories-heading'>Others</h5></div>

                                        <Textarea
                                            style={{ border: showServiceOtherReasonWarning ? ' 1px solid red' : ' 1px solid #ccc' }}
                                            className="generate-lead-components-reason"
                                            placeholder='Write other reason'
                                            minRows={2}
                                            variant="outlined"
                                            sx={{ fontSize: "1vw" }}
                                            value={productCategoryService.reason}
                                            onChange={(e) => {
                                                setProductCategoryService({
                                                    ...productCategoryService,
                                                    reason: e.target.value
                                                })
                                                setShowServiceOtherReasonWarning(false)
                                            }}
                                        />
                                    </div>
                                )
                            }

                        </div>

                    </div>

                }
                <div className='generate-lead-components' style={{ gap: '60px' }}>
                    {showInterested && isInterested &&
                        <>
                            <div style={{ position: 'relative' }}>

                                <h5>Status</h5>
                                <Select
                                    style={{ border: showStatusWarning ? ' 1px solid red' : ' 1px solid #ccc' }}
                                    value={selectedStatus}
                                    onChange={(event, newValue) => {
                                        setShowStatusWarning(false)
                                        setSelectedStatus(newValue);
                                    }}
                                    className='fieldSize'
                                    placeholder="Select Status">
                                    <Option value="Hot">Hot</Option>
                                    <Option value="Cold">Cold</Option>
                                    <Option value="Warm">Warm</Option>
                                    {/* <Option value="Order Generated">Order Generated</Option> */}
                                    <Option value="Closed">Closed</Option>

                                </Select>
                            </div>

                            <div className=''  >
                                {/* <h5 className='interested-head'>Next Meeting</h5> */}
                                {/* <input type='date'
                                        // onChange={handleChange}
                                        // onFocus={convertToCurrentDate}
                                        onBlur={convertToCurrentDate}
                                        // value={format(new Date(selectedNextMeetingDate), 'dd-MM-yyyy')}
                                        value={selectedNextMeetingDate}
                                        onChange={(event) => {
                                            setnext(event.target.value);

                                        }} /> */}
                                {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DatePicker
                                            className="date-picker"
                                            value={selectedNextMeetingDate}
                                            disableFuture={true}
                                            disablePast={true}
                                            format='DD/MM/YYYY'
                                            onChange={(e) => {
                                                selectedNextMeetingDate(e)
                                            }}
                                        />
                                    </LocalizationProvider>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DemoContainer components={['DatePicker', 'DatePicker']}>
                                            <DatePicker
                                                format='DD-MM-YYYY'
                                                label="Next Meeting Date"
                                                value={selectedNextMeetingDate}
                                                onChange={(newValue) => setSelectedNextMeetingDate(newValue)}
                                            />
                                        </DemoContainer>
                                    </LocalizationProvider> */}
                                <div style={{ position: 'relative' }}>

                                    <h5>Next Meeting Date</h5>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DatePicker

                                            className="date-picker"
                                            // value={selectedNextMeetingDate}
                                            format='DD-MM-YYYY'
                                            disablePast={true}
                                            onChange={(e) => {
                                                setSelectedNextMeetingDate(e.$d);
                                            }}
                                            open={open}
                                            onClose={() => setOpen(false)}
                                            slotProps={{
                                                textField: {
                                                    onClick: () => setOpen(true),
                                                },
                                            }}
                                        />
                                    </LocalizationProvider>
                                </div>
                            </div>
                        </>}
                </div>



                {/* {
                    showInterested &&
                    <>
                        {
                            !checked &&
                            <div className='generate-lead-components-conversation-type'>
                                <Textarea placeholder='Reason' minRows={3} variant="outlined" />
                            </div>
                        }
                    </>
                } */}

                <div className='generate-lead-components-conversation-type'>
                    <h5>Conversation</h5>
                    <Textarea placeholder='Conversation' minRows={3} variant="outlined"
                        value={conversation}
                        onChange={(event, newValue) => {
                            if (event.target.value.length <= 60) {
                                setConversation(event.target.value);
                            }
                        }}
                    />
                </div>
                <div className='generate-lead-components-conversation-type'>
                    <h5>Minutes Of Meeting</h5>
                    <Textarea placeholder='Minutes Of Meeting' minRows={3} variant="outlined"
                        value={minutesOfMeeting}
                        onChange={(event, newValue) => {
                            setMinutesOfMeeting(event.target.value);
                        }}
                    />
                </div>
                {/* 
                <div className='fieldSize-interested'  >
                    <h5 className='interested-head'>Date</h5>
                    <input type='date'
                        value={date}
                        onChange={(event) => {
                            setDate(event.target.value);

                        }}
                    />
                </div> */}

                {
                    loading ?
                        <button className='submit-generate-button' onClick={() => GenerateLeadSubmit()} >
                            <MuiCircularProgress style={{ color: 'white', width: 15, height: 15 }} />
                        </button>
                        :
                        <button className='submit-generate-button' onClick={() => GenerateLeadSubmit()} >
                            Generate
                        </button>
                }

            </div>
        </div>
    )
}

export default GenerateLead
