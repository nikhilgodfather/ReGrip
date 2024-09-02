import {
  Input,
  Select,
  Option,
  Table,
  Sheet,
  Button,
  Checkbox,
  ToggleButtonGroup,
  Autocomplete,
  TextField,
} from "@mui/joy";
import React, { useEffect, useState } from "react";
import "./AddCustomer.css";
import axios from "axios";
import { API_URL } from "../../Config";
import { ToastContainer, toast } from "react-toastify";
import AddCustomerBranch from "../AddCustomerBranch/AddCustomerBranch";
import ModalClose from "@mui/joy/ModalClose";
import Modal from "@mui/joy/Modal";
import CircularProgress from "@mui/joy/CircularProgress";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import country_data from "../../../assets/country.json";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";
import Skeleton from "react-loading-skeleton";
import { TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import AddMeetingPerson from "../AddMeetingPerson/AddMeetingPerson";
import AddOtherBrandTyre from "../AddOtherBrandTyre/AddOtherBrandTyre";
import PanNumberUpdate from "../PanNumberUpdate/PanNumberUpdate";
import { Tabs, TabList, TabPanel } from "@mui/joy";
import Tab, { tabClasses } from "@mui/joy/Tab";

const AddCustomer = ({
  salesperson,
  setShowAddCustomerModal,
  getAllCustomer,
  shareCustomerId,
  shareCustomerBranchId,
  resetFields,
  getSuccessMessage,
  shareCustomerPan
}) => {
  const [index, setIndex] = useState("1");
  const dummmyArray = [1, 2, 3, 4, 5];

  const [hubs, setHubs] = useState([
    {
      meeting_person_name: "",
      meeting_person_designation: "",
      mobile_number: "",
      email: "",
    },
  ]);

  const [parkinghubs, setParkingHubs] = useState([
    {
      meeting_person_name: "",
      meeting_person_designation: "",
      mobile_number: "",
      email: "",
    },
  ]);

  const addParkingMeetingPersonHub = () => {
    setParkingHubs([
      ...parkinghubs,
      {
        meeting_person_name: "",
        meeting_person_designation: "",
        mobile_number: "",
        email: "",
      },
    ]);
  };

  const removeParkingHub = (index) => {
    const updatedHubs = [...parkinghubs];
    updatedHubs.splice(index, 1);
    setParkingHubs(updatedHubs);
  };

  const handleHubParkingChange = (index, key, value) => {
    const updatedHubs = [...parkinghubs];
    updatedHubs[index][key] = value;
    setParkingHubs(updatedHubs);
  };

  const addHub = () => {
    setHubs([
      ...hubs,
      {
        meeting_person_name: "",
        meeting_person_designation: "",
        mobile_number: "",
        email: "",
      },
    ]);
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

  // tabs
  const [sets, setSets] = useState([{ brand: null, quantity: null }]);

  const [setsPCR, setSetsPCR] = useState([{ brand: null, quantity: null }]);

  const [setsTruckBus, setSetsTruckBus] = useState([
    { brand: null, quantity: null },
  ]);

  const [setsOTR, setSetsOTR] = useState([{ brand: null, quantity: null }]);

  const [setsFarm, setSetsFarm] = useState([{ brand: null, quantity: null }]);
  // tabs

  const [loading, setLoading] = useState(false);
  const [customer, setCustomer] = useState(null);

  const [isPanNotAvailable, setIsPanNotAvailable] = useState(false);

  const [customerExist, setCustomerExist] = useState("");

  const [editCustomerBranch, setEditCustomerBranch] = useState();
  const [region, setRegion] = useState(null);

  const [panInput, setPanInput] = useState("");

  const [selectIndex, setSelectIndex] = useState(null);
  const [customerType, setCustomerType] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [address, setAddress] = useState("");
  const [industryType, setIndustryType] = useState("");
  const [monthlyTyreSales, setMonthlyTyreSales] = useState(null);
  const [pincode, setPincode] = useState(null);
  const [emailAddress, setEmailAddress] = useState("");
  const [contactNumber, setContactNumber] = useState(null);
  const [currentlyDealing, setCurrentDealing] = useState([]);
  const [customerBranch, setCustomerBranch] = useState([]);
  const [dealerBranch, setDealerBranch] = useState(null);

  const [customerId, setCustomerId] = useState();

  const [brands, setBrands] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);

  const isDealer = customerType === "dealer";
  const [addBranchModal, setAddBranchModal] = useState(false);
  const [editBranchModal, setEditBranchModal] = useState(false);

  const [addBrandTyreModal, setAddBrandTyreModal] = useState(false);

  const [updatePanModal, setUpdatePanModal] = useState(false);

  const [editMeetingPersonModal, setEditMeetingPersonModal] = useState(false);
  const [editMeetingPersonData, setEditMeetingPersonData] = useState([]);

  const [meetingPersonDetails, setMeetingPersonDetails] = useState([]);
  const [parkingMeetingPersonDetails, setParkingMeetingPersonDetails] =
    useState([]);

  const [validStateName, setIsValidStateName] = useState(true);
  const [isChecked, setIsChecked] = useState(true);

  const [regions, setRegions] = useState([]);

  const [branchRegion, setBranchRegion] = useState(
    editCustomerBranch && editCustomerBranch.customer_branch_region_id
      ? editCustomerBranch.customer_branch_region_id
      : null
  );

  const [allCities, setAllCities] = useState([]);
  const [cityForParking, setCityForParking] = useState();

  const [city, setCity] = useState();

  useEffect(() => {
    const allCities = country_data?.state?.reduce((cities, currentState) => {
      currentState.city.forEach((city) =>
        cities.push({ value: city?.id, label: city?.name })
      );
      return cities;
    }, []);
    setAllCities(allCities);
  }, []);

  const [showRouteFields, setShowRouteFields] = useState(
    editCustomerBranch && editCustomerBranch.route
      ? editCustomerBranch.route !== "PAN India" &&
        editCustomerBranch.route !== "Undefined"
        ? true
        : false
      : false
  );

  const [noOfVehicles, SetNoOfVehicles] = useState(
    editCustomerBranch ? editCustomerBranch.number_of_vehicles : null
  );
  const [monthlyRun, setMonthlyRun] = useState(
    editCustomerBranch ? editCustomerBranch.monthly_km_run : null
  );
  const [GSTNumber, setGSTNumber] = useState(
    editCustomerBranch ? editCustomerBranch.gst_number : ""
  );
  const [application, setApplication] = useState([]);

  const [load, setLoad] = useState(
    editCustomerBranch
      ? editCustomerBranch.load
        ? editCustomerBranch.load
        : []
      : []
  );
  const [vehicleType, setVehicleType] = useState(
    editCustomerBranch
      ? editCustomerBranch.vehicle_type
        ? editCustomerBranch.vehicle_type
        : []
      : []
  );
  const [routes, setRoutes] = useState(
    editCustomerBranch && editCustomerBranch.route
      ? editCustomerBranch.route !== "PAN India" &&
        editCustomerBranch.route !== "Undefined"
        ? "From - To"
        : editCustomerBranch.route
      : ""
  );
  const [usesRetread, setUsesRetread] = useState(
    editCustomerBranch
      ? editCustomerBranch.uses_retread
        ? editCustomerBranch.uses_retread
        : false
      : false
  );
  const [from, setFrom] = useState(
    editCustomerBranch &&
      editCustomerBranch.route &&
      editCustomerBranch.route !== "PAN India" &&
      editCustomerBranch.route !== "Undefined"
      ? editCustomerBranch.route.split("-")[0]
      : ""
  );
  const [to, setTo] = useState(
    editCustomerBranch &&
      editCustomerBranch.route &&
      editCustomerBranch.route !== "PAN India" &&
      editCustomerBranch.route !== "Undefined"
      ? editCustomerBranch.route.split("-")[1]
      : ""
  );

  const [customerBranchIdForAddForMain, setCustomerBranchIdForAddForMain] =
    useState(null);

  const [
    customerBranchIdForAddForParking,
    setCustomerBranchIdForAddForParking,
  ] = useState(null);

  const [
    shareBranchIdForAddingMeetingPerson,
    setShareBranchIdForAddingMeetingPerson,
  ] = useState(null);

  // parking hubs
  const [parkingAddress, setParkingAddress] = useState(null);
  const [parkingContactNumber, setParkingContactNumber] = useState(null);
  const [parkingEmail, setParkingEmail] = useState(null);
  const [parkingRegion, setParkingRegion] = useState(null);
  const [parkingPincode, setParkingPincode] = useState(null);

  const [allapplication, setAllApplication] = useState([]);

  const [allLoad, setAllLoad] = useState([]);
  const [allVehicleType, setAllVehicleType] = useState([]);

  // make true
  const [showForHubsBoth, setShowForHubsBoth] = useState(false);
  console.log("1222", showForHubsBoth);
  // make true

  // Warnings
  const [showBranchNameWarning, setShowBranchNameWarning] = useState(false);

  const [showAddressWarning, setShowAddressWarning] = useState(false);
  const [showParkingAddressWarning, setShowParkingAddressWarning] =
    useState(false);
  //
  const [showEmailWarning, setShowEmailWarning] = useState(false);

  const [showContactNumberWarning, setShowContactNumberWarning] =
    useState(false);
  const [showParkingContactNumberWarning, setParkingShowContactNumberWarning] =
    useState(false);

  const [showNoOfVehiclesWarning, setShowNoOfVehiclesWarning] = useState(false);
  const [showMonthlyRunWarning, setShowMonthlyRunWarning] = useState(false);
  const [showGSTNumberWarning, setShowGSTNumberWarning] = useState(false);
  const [showApplicationWarning, setShowApplicationWarning] = useState(false);
  const [showLoadWarning, setShowLoadWarning] = useState(false);
  const [showVehicleTypeWarning, setShowVehicleTypeWarning] = useState(false);
  const [showRouteWarning, setShowRouteWarning] = useState(false);

  const [showRegionWarning, setShowRegionWarning] = useState(false);

  const [showNameWarning, setShowNameWarning] = useState(false);

  const [showPincodeWarning, setShowPincodeWarning] = useState(false);

  const [showCityWarning, setShowCityWarning] = useState(false);
  const [showParkingCityWarning, setShowParkingCityWarning] = useState(false);
  const [showParkingRegionWarning, setShowParkingRegionWarning] =
    useState(false);

  const [showSelectedBrandWarning, setShowSelectedBrandWarning] =
    useState(false);

  const [showMeetingPersonNameWarning, setShowMeetingPersonNameWarning] =
    useState(false);
  const [showMeetingPersonDesignWarning, setShowMeetingPersonDesignWarning] =
    useState(false);

  const [
    showParkingMeetingPersonNameWarning,
    setShowParkingMeetingPersonNameWarning,
  ] = useState(false);
  const [
    showParkingMeetingPersonDesignWarning,
    setShowParkingMeetingPersonDesignWarning,
  ] = useState(false);

  const [showFieldsInPan, setShowFieldsInPan] = useState(false);
  // api calls

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");
    const bearer_token = "bearer " + JSON.parse(token);
    try {
      if (isDealer) {
        if (!customerName || !address || !contactNumber || !city || !region) {
          !customerName && setShowNameWarning(true);
          !address && setShowAddressWarning(true);
          !contactNumber && setShowContactNumberWarning(true);
          // !pincode && setShowPincodeWarning(true);
          // !emailAddress && setShowEmailWarning(true);
          !city && setShowCityWarning(true);
          !region && setShowRegionWarning(true);
          // setIndex("1")
          return;
        }
      }

      if (isDealer && !shareCustomerId) {
        let hubFieldsValid = true;
        hubs?.forEach((hub, index) => {
          if (!hub?.meeting_person_name || !hub?.meeting_person_designation) {
            hubFieldsValid = false;
            !hub?.meeting_person_name && setShowMeetingPersonNameWarning(true);
            !hub?.meeting_person_designation &&
              setShowMeetingPersonDesignWarning(true);

            // setIndex("1")
            return;
          }
        });

        if (!hubFieldsValid) {
          return;
        }
      }

      // if (isDealer) {
      //   if (selectedBrands?.length === 0) {
      //     selectedBrands?.length === 0 && setShowSelectedBrandWarning(true);
      //     setIndex("3");
      //     return;
      //   }
      // }

      if (!isDealer && !shareCustomerId) {
        if (!customerName || !city || !region) {
          !customerName && setShowNameWarning(true);
          !city && setShowCityWarning(true);
          !region && setShowRegionWarning(true);
          return;
        }
        if (
          (!address && isChecked) ||
          (!address && !isChecked && !parkingAddress)
        ) {
          (!address && setShowAddressWarning(true)) ||
            (!parkingAddress && setShowAddressWarning(true));
          toast.error(
            "Please fill either the office address or the parking address",
            {
              position: toast.POSITION.TOP_CENTER,
              autoClose: 2000,
            }
          );
          return;
        }
        if (
          (!contactNumber && isChecked) ||
          (!contactNumber && !isChecked && !parkingContactNumber)
        ) {
          (!contactNumber && setShowContactNumberWarning(true)) ||
            (!parkingContactNumber && setShowContactNumberWarning(true));

          toast.error(
            "Please fill either the office contact no or the parking contact no",
            {
              position: toast.POSITION.TOP_CENTER,
              autoClose: 2000,
            }
          );
          return;
        }
      }

      if (!isDealer) {
        if (!isChecked) {
          if (!isChecked || !isDealer) {
            if (!cityForParking || !parkingRegion) {
              !cityForParking && setShowParkingCityWarning(true);
              !parkingRegion && setShowParkingRegionWarning(true);
              return;
            }
          }
        }
      }

      if (!isDealer && !shareCustomerId)
        if (isChecked) {
          const isValid = hubs.every(
            (hub) =>
              hub?.meeting_person_name?.trim() !== "" &&
              hub?.meeting_person_designation?.trim() !== ""
          );

          if (!isValid) {
            setShowMeetingPersonNameWarning(true);
            setShowMeetingPersonDesignWarning(true);
            return;
          }
        } else {
          const hubsValid = hubs.every(
            (hub) =>
              hub?.meeting_person_name?.trim() !== "" &&
              hub?.meeting_person_designation?.trim() !== ""
          );

          const parkingHubsValid = parkinghubs.every(
            (hub) =>
              hub?.meeting_person_name?.trim() !== "" &&
              hub?.meeting_person_designation?.trim() !== ""
          );

          if (!hubsValid && !parkingHubsValid) {
            setShowMeetingPersonNameWarning(true);
            setShowMeetingPersonDesignWarning(true);
            setShowForHubsBoth(true)
            toast.error(
              "Please fill out either main office or parking hubs meeting person name and designation.",
              {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 2000,
              }
            );
            return;
          }
        }

      let route;
      if (routes === "Undefined" || routes === "PAN India") {
        route = routes;
      } else if (routes === "From - To") {
        route = `${from?.toLowerCase()}-${to?.toLowerCase()}`;
      } else {
        route = null;
      }

      const contactNumberNUmber =
        contactNumber !== null ? Number(contactNumber) : null;
      const pincodeNumber = pincode !== null ? Number(pincode) : null;

      const noOfVehiclesNumber =
        noOfVehicles !== null ? Number(noOfVehicles) : null;
      const monthlyRunNumber = monthlyRun !== null ? Number(monthlyRun) : null;
      const monthlyTyreSalesNumber =
        monthlyTyreSales !== null ? Number(monthlyTyreSales) : null;

      const parkingContactNumberNumber =
        parkingContactNumber !== null ? Number(parkingContactNumber) : null;
      const parkingPincodeNumber =
        parkingPincode !== null ? Number(parkingPincode) : null;

      setLoading(true);
      let data;
      if (customerType === "dealer") {
        data = {
          // employee_id: 48,
          customer_branch_id: shareCustomerBranchId,
          customer_branch_name: customerName,
          // pan_number: panInput,
          // customer_type: customerType,
          customer_name: customerName,
          address: address,
          city: city,
          mobile_number: contactNumberNUmber,
          contact_email: emailAddress,
          customer_branch_region_id: region,
          pin_code: pincodeNumber,
          // main_branch_meeting_person: hubs,
          currently_dealing: selectedBrands,
          monthly_tyre_sales: monthlyTyreSalesNumber,
          gst_number: GSTNumber,
          uses_retread: usesRetread,
          brand_dealing_in_two_and_three_wheeler: sets.every(
            (set) => set.brand === null || set.brand === ""
          )
            ? null
            : sets,
          brand_dealing_in_pcr: setsPCR.every(
            (set) => set.brand === null || set.brand === ""
          )
            ? null
            : setsPCR,
          brand_dealing_in_otr: setsOTR.every(
            (set) => set.brand === null || set.brand === ""
          )
            ? null
            : setsOTR,
          brand_dealing_in_farm: setsFarm.every(
            (set) => set.brand === null || set.brand === ""
          )
            ? null
            : setsFarm,
          brand_dealing_in_truck_and_bus: setsTruckBus.every(
            (set) => set.brand === null || set.brand === ""
          )
            ? null
            : setsTruckBus,
        };
      } else {
        data = {
          // employee_id: 48,
          main_customer_branch_id: shareCustomerBranchId,
          customer_name: customerName,
          address: address,
          city: city,
          mobile_number: contactNumberNUmber,
          contact_email: emailAddress,
          customer_branch_region_id: region,
          pin_code: pincodeNumber,
          gst_number: GSTNumber,
          uses_retread: usesRetread,

          number_of_vehicles: noOfVehiclesNumber,
          monthly_km_run: monthlyRunNumber,
          route: route,
          application: applicationTypeData,
          load: load,
          vehicle_type: vehicleTypeData,

          is_parking_same_as_main_branch: isChecked,
          parking_address: parkingAddress,
          parking_city: cityForParking,
          parking_mobile_number: parkingContactNumberNumber,
          parking_contact_email: parkingEmail,
          parking_customer_branch_region_id: parkingRegion,
          parking_pin_code: parkingPincodeNumber,
        };
      }

      if (!shareCustomerId) {
        data.pan_number = panInput;
        data.customer_type = customerType;
        data.main_branch_meeting_person =
          hubs[0]?.meeting_person_name !== "" ? hubs : [];
        data.parking_hub_meeting_person =
          parkinghubs[0]?.meeting_person_name !== "" ? parkinghubs : [];
      }

      if (shareCustomerId) {
        await axios.patch(
          `${API_URL}/customer/update-customer?customer_id=${shareCustomerId}`,
          data,
          {
            headers: {
              Authorization: bearer_token,
            },
          }
        );
        getSuccessMessage("Customer updated successfully");
      } else {
        await axios.post(`${API_URL}/customer`, data, {
          headers: {
            Authorization: bearer_token,
          },
        });
        getSuccessMessage("Customer added successfully");
      }

      setLoading(false);
      setShowAddCustomerModal(false);
      resetFields();
      getAllCustomer();
    } catch (error) {
      console.error("Error creating lead:", error);
      toast.error(error?.response?.data?.message, {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const getRegions = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/regions`);
      setRegions(data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const getCustomerById = async (customerID) => {
    try {
      const response = await axios.get(
        `${API_URL}/customer/customers-by-id?customer_id=${customerID}`
      );
      const customerData = response.data.data;
      // setCustomer(customerData)
      // if (customerData && customerData.customer_type && customerData.customer_type === 'dealer') {
      //     setDealerBranch(customer.customer_branches[0])
      // }
      setIsPanNotAvailable(true);
      setShowFieldsInPan(true);

      setPanInput(customerData?.pan_number);
      setCustomerType(customerData?.customer_type);
      setCustomerName(customerData?.customer_name);
      setCustomerId(customerData?.customer_id);
      setIndustryType(customerData?.industry_type);
      setMonthlyTyreSales(customerData?.monthly_tyre_sales);
      setMonthlyRun(customerData?.customer_branches[0]?.monthly_km_run);
      SetNoOfVehicles(customerData?.customer_branches[0]?.number_of_vehicles);
      setGSTNumber(customerData?.customer_branches[0]?.gst_number);

      setSelectedBrands(customerData?.currently_dealing);
      setSets(
        customerData?.customer_branches[0]
          ?.brand_dealing_in_two_and_three_wheeler || [
          { brand: "", quantity: " " },
        ]
      );
      setSetsPCR(
        customerData?.customer_branches[0]?.brand_dealing_in_pcr || [
          { brand: "", quantity: " " },
        ]
      );
      setSetsTruckBus(
        customerData?.customer_branches[0]?.brand_dealing_in_truck_and_bus || [
          { brand: "", quantity: " " },
        ]
      );
      setSetsOTR(
        customerData?.customer_branches[0]?.brand_dealing_in_otr || [
          { brand: "", quantity: " " },
        ]
      );
      setSetsFarm(
        customerData?.customer_branches[0]?.brand_dealing_in_farm || [
          { brand: "", quantity: " " },
        ]
      );

      setCustomerBranch(customerData?.customer_branches);
      setIsChecked(customerData?.is_parking_same_as_main_branch);
      setLoad(customerData?.customer_branches[0]?.load);
      setVehicleTypeData(customerData?.customer_branches[0]?.vehicle_type);
      setApplicationTypeData(customerData?.customer_branches[0]?.application);
      setMeetingPersonDetails(
        customerData?.customer_branches[0]?.meeting_persons
      );
      setRoutes(customerData?.customer_branches[0]?.route);
      if (
        customerData?.customer_branches[0]?.route === "PAN India" ||
        customerData?.customer_branches[0]?.route === "Undefined"
      ) {
        setRoutes(customerData?.customer_branches[0]?.route);
      } else if (customerData?.customer_branches[0]?.route === null) {
        setRoutes(null);
      } else {
        setRoutes("From - To");
        setShowRouteFields(true);
        setFrom(customerData?.customer_branches[0]?.route.split("-")[0]);
        setTo(customerData?.customer_branches[0]?.route.split("-")[1]);
      }

      setUsesRetread(customerData?.uses_retread);

      const mainBranches = customerData?.customer_branches.filter(
        (branch) => branch.customer_branch_name === "Main Branch"
      );
      if (mainBranches[0]?.customer_branch_name === "Main Branch") {
        setAddress(mainBranches[0]?.branch_address);
        setEmailAddress(mainBranches[0]?.contact_email);
        setContactNumber(mainBranches[0]?.mobile_number);
        setPincode(mainBranches[0]?.pin_code);
        setRegion(mainBranches[0]?.customer_branch_region_id);
        setCity(mainBranches[0]?.city);
        setMeetingPersonDetails(mainBranches[0]?.meeting_persons);
        setCustomerBranchIdForAddForMain(mainBranches[0]?.customer_branch_id);
      } else if (
        customerData?.customer_branches[0].customer_branch_name ===
        customerData.customer_name
      ) {
        setAddress(customerData?.customer_branches[0]?.branch_address);
        setEmailAddress(customerData?.customer_branches[0]?.contact_email);
        setContactNumber(customerData?.customer_branches[0]?.mobile_number);
        setPincode(customerData?.customer_branches[0]?.pin_code);
        setRegion(
          customerData?.customer_branches[0]?.customer_branch_region_id
        );
        setCustomerBranchIdForAddForMain(
          customerData?.customer_branches[0]?.customer_branch_id
        );
        setCity(customerData?.customer_branches[0]?.city);
        setMeetingPersonDetails(
          customerData?.customer_branches[0]?.meeting_persons
        );
      }

      const parkingHubBranches = customerData?.customer_branches.filter(
        (branch) => branch.customer_branch_name === "Parking Hub"
      );
      setParkingAddress(parkingHubBranches[0]?.branch_address);
      setParkingEmail(parkingHubBranches[0]?.contact_email);
      setParkingContactNumber(parkingHubBranches[0]?.mobile_number);
      setParkingPincode(parkingHubBranches[0]?.pin_code);
      setParkingRegion(parkingHubBranches[0]?.customer_branch_region_id);
      setCityForParking(parkingHubBranches[0]?.city);
      setParkingMeetingPersonDetails(parkingHubBranches[0]?.meeting_persons);
      setCustomerBranchIdForAddForParking(
        parkingHubBranches[0]?.customer_branch_id
      );
      // console.log("1111", parkingHubBranches[0]?.meeting_persons);
    } catch (error) {
      console.error("Error fetching customer data by PAN:", error);
    }
  };
  const getCustomerByPan = async () => {
    try {
      if (panInput.length < 10) {
        return;
      }
      const response = await axios.get(
        `${API_URL}/customer/by-pan/?pan_number=${panInput}`
      );
      const customerData = response.data.data;
      setCustomerExist(response.data.message);
      setCustomer(customerData);
      // if (customerData && customerData.customer_type && customerData.customer_type === 'dealer') {
      //     setDealerBranch(customer.customer_branches[0])
      // }

      if (
        response.data.message === "Successfully fetched Customer and branches"
      ) {
        setCustomerType(customerData?.customer_type);
        setShowFieldsInPan(true);
        setCustomerName(customerData?.customer_name);
        setCustomerId(customerData?.customer_id);
        setIndustryType(customerData?.industry_type);
        setMonthlyTyreSales(customerData?.monthly_tyre_sales);
        setMonthlyRun(customerData?.customer_branches[0]?.monthly_km_run);
        SetNoOfVehicles(customerData?.customer_branches[0]?.number_of_vehicles);
        setGSTNumber(customerData?.customer_branches[0]?.gst_number);

        setCurrentDealing(customerData?.currently_dealing);
        setSets(
          customerData?.customer_branches[0]
            ?.brand_dealing_in_two_and_three_wheeler || []
        );
        setSetsPCR(
          customerData?.customer_branches[0]?.brand_dealing_in_pcr || []
        );
        setSetsTruckBus(
          customerData?.customer_branches[0]?.brand_dealing_in_truck_and_bus ||
            []
        );
        setSetsOTR(
          customerData?.customer_branches[0]?.brand_dealing_in_otr || []
        );
        setSetsFarm(
          customerData?.customer_branches[0]?.brand_dealing_in_farm || []
        );

        setCustomerBranch(customerData?.customer_branches);
        setIsChecked(customerData?.is_parking_same_as_main_branch);
        setAllLoad(customerData?.customer_branches[0]?.load);
        setAllVehicleType(customerData?.customer_branches[0]?.vehicle_type);
        setAllApplication(customerData?.customer_branches[0]?.application);
        setMeetingPersonDetails(
          customerData?.customer_branches[0]?.meeting_persons
        );
        setRoutes(customerData?.customer_branches[0]?.route);
        if (
          customerData?.customer_branches[0]?.route === "PAN India" ||
          customerData?.customer_branches[0]?.route === "Undefined"
        ) {
          setRoutes(customerData?.customer_branches[0]?.route);
        } else if (customerData?.customer_branches[0]?.route === null) {
          setRoutes(null);
        } else {
          setRoutes("From - To");
          setShowRouteFields(true);
          setFrom(customerData?.customer_branches[0]?.route.split("-")[0]);
          setTo(customerData?.customer_branches[0]?.route.split("-")[1]);
        }

        setUsesRetread(customerData?.uses_retread);

        const mainBranches = customerData?.customer_branches.filter(
          (branch) => branch.customer_branch_name === "Main Branch"
        );
        if (mainBranches[0]?.customer_branch_name === "Main Branch") {
          setAddress(mainBranches[0]?.branch_address);
          setEmailAddress(mainBranches[0]?.contact_email);
          setContactNumber(mainBranches[0]?.mobile_number);
          setPincode(mainBranches[0]?.pin_code);
          setRegion(mainBranches[0]?.customer_branch_region_id);
          setCity(mainBranches[0]?.city);
          setMeetingPersonDetails(mainBranches[0]?.meeting_persons);
        } else if (
          customerData?.customer_branches[0].customer_branch_name ===
          customerData.customer_name
        ) {
          setAddress(customerData?.customer_branches[0]?.branch_address);
          setEmailAddress(customerData?.customer_branches[0]?.contact_email);
          setContactNumber(customerData?.customer_branches[0]?.mobile_number);
          setPincode(customerData?.customer_branches[0]?.pin_code);
          setRegion(
            customerData?.customer_branches[0]?.customer_branch_region_id
          );
          setCity(customerData?.customer_branches[0]?.city);
          setMeetingPersonDetails(
            customerData?.customer_branches[0]?.meeting_persons
          );
        }

        const parkingHubBranches = customerData?.customer_branches.filter(
          (branch) => branch.customer_branch_name === "Parking Hub"
        );
        setParkingAddress(parkingHubBranches[0]?.branch_address);
        setParkingEmail(parkingHubBranches[0]?.contact_email);
        setParkingContactNumber(parkingHubBranches[0]?.mobile_number);
        setParkingPincode(parkingHubBranches[0]?.pin_code);
        setParkingRegion(parkingHubBranches[0]?.customer_branch_region_id);
        setCityForParking(parkingHubBranches[0]?.city);
        setParkingMeetingPersonDetails(parkingHubBranches[0]?.meeting_persons);
      } else if (response.data.message === "No Customer Found") {
        setCustomerType("transporter");
        setSelectIndex(0);
        setAddress("");
        setMonthlyTyreSales(null);
        setEmailAddress("");
        setContactNumber(null);
        setCurrentDealing([]);
        setSelectedBrands(null);
        setVehicleType([]);
        setLoad([]);
        setApplication([]);
        SetNoOfVehicles(null);
        setRegion(null);
        setParkingAddress("");
        setParkingContactNumber(null);
        setParkingEmail("");
        setParkingRegion(null);
        setParkingPincode(null);
        setCityForParking("");
        setUsesRetread(false);
        setIndex("1");
      }
    } catch (error) {
      console.error("Error fetching customer data by PAN:", error);
    }
  };

  const getAllBrands = async () => {
    try {
      const response = await axios.get(`${API_URL}/tyrebrand/get-all-brands`);
      setLoading(false);
      setBrands(response.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleItemClick = (index, name) => {
    setSelectIndex(index);
    onChange(name);
  };
  const onChange = (name) => {
    setCustomerType(name);
  };

  useEffect(() => {
    getRegions();
  }, []);

  useEffect(() => {
    const newIndex =
      customerType === "transporter" ? 0 : customerType === "dealer" ? 1 : null;
    setSelectIndex(newIndex);
  }, [customerType, currentlyDealing, selectIndex]);

  const gstinformat =
    /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

  useEffect(() => {
    if (GSTNumber.length === 15 && !shareCustomerId) {
      if (gstinformat.test(GSTNumber)) {
        const firstTwoCharacters = GSTNumber.slice(2, 12);
        setPanInput(firstTwoCharacters);
      } else {
        toast.error("Enter Valid GST Format", {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 3000,
        });
      }
    }
  }, [GSTNumber]);

  const isValidPan = /^[A-Z]{5}\d{4}[A-Z]$/;
  useEffect(() => {
    if (isValidPan.test(panInput) && !shareCustomerId) {
      setIsPanNotAvailable(true);
      getCustomerByPan();
    }

    getAllBrands();
  }, [panInput, isPanNotAvailable]);

  useEffect(() => {
    if (shareCustomerId) {
      getCustomerById(shareCustomerId);
    }
  }, [shareCustomerId]);

  // application
  const defaultOptionsForApplication = [
    "FMCG",
    "Metal",
    "Car Carrier",
    "E-Commerce",
    "Construction",
    "Add More",
  ];
  const [applicationTypeData, setApplicationTypeData] = useState([]);
  const [newOptionApplication, setNewOptionApplication] = useState("");
  const [addMoreModalApplication, setAddMoreModalApplication] = useState(false);

  const handleChangeForApplicationType = (event, newValue) => {
    if (newValue.includes("Add More")) {
      setAddMoreModalApplication(true);
    } else {
      setApplicationTypeData(newValue);
    }
  };

  const handleAddMoreForApplication = () => {
    if (newOptionApplication.trim() !== "") {
      setApplicationTypeData([...applicationTypeData, newOptionApplication]);
      setNewOptionApplication("");
    }
  };

  //

  //
  const defaultOptions = [
    "Car Carrier",
    "Bulker",
    "Open Body Container",
    "Closed Body Container",
    "Trailer",
    "Add More",
  ];
  const [vehicleTypeData, setVehicleTypeData] = useState([]);
  const [newOption, setNewOption] = useState("");
  const [addMoreModal, setAddMoreModal] = useState(false);

  const handleChangeForVehicleType = (event, newValue) => {
    if (newValue.includes("Add More")) {
      setAddMoreModal(true);
    } else {
      setVehicleTypeData(newValue);
    }
  };

  const handleAddMore = () => {
    if (newOption.trim() !== "") {
      setVehicleTypeData([...vehicleTypeData, newOption]);
      setNewOption("");
    }
  };
  //
  const [addModalMeeting, setAddModalMeeting] = useState(false);
  useState(false);

  return (
    <div className="main-addcustomer">
      {showForHubsBoth ? (
        <ToastContainer style={{ width: "55%" }} />
      ) : (
        <ToastContainer className="custom-toast-container" />
      )}

      {/* add meeting person */}

      <Modal
        aria-labelledby="modal-title"
        aria-describedby="modal-desc"
        open={addModalMeeting}
        onClose={() => {
          setAddModalMeeting(false);
        }}
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <Sheet
          variant="plain"
          sx={{
            width: "400px",
            height: "480px",
            borderRadius: "md",
            p: 3,
            boxShadow: "lg",
            position: "relative",
          }}
        >
          <ModalClose variant="plain" sx={{ m: 0 }} />
          <AddMeetingPerson
            getCustomerById={getCustomerById}
            setAddModalMeeting={setAddModalMeeting}
            shareCustomerId={shareCustomerId}
            shareBranchIdForAddingMeetingPerson={
              shareBranchIdForAddingMeetingPerson
            }
          />
        </Sheet>
      </Modal>

      <Modal
        aria-labelledby="modal-title"
        aria-describedby="modal-desc"
        open={editMeetingPersonModal}
        onClose={() => {
          setEditMeetingPersonModal(false);
        }}
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <Sheet
          variant="plain"
          sx={{
            width: "400px",
            height: "460px",
            borderRadius: "md",
            p: 3,
            boxShadow: "lg",
            position: "relative",
          }}
        >
          <ModalClose variant="plain" sx={{ m: 0 }} />
          <AddMeetingPerson
            setEditMeetingPersonModal={setEditMeetingPersonModal}
            editMeetingPersonData={editMeetingPersonData}
            getCustomerById={getCustomerById}
            shareCustomerId={shareCustomerId}
          />
        </Sheet>
      </Modal>

      <Modal
        aria-labelledby="modal-title"
        aria-describedby="modal-desc"
        open={addMoreModalApplication}
        onClose={() => {
          setAddMoreModalApplication(false);
          setNewOptionApplication("");
        }}
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <Sheet
          variant="plain"
          sx={{
            width: "400px",
            height: "260px",
            borderRadius: "md",
            p: 3,
            boxShadow: "lg",
            position: "relative",
          }}
        >
          <ModalClose variant="plain" sx={{ m: 0 }} />

          <div className="addBranch-customer-main">
            <div className="scrolling-view">
              <div>
                <h3 style={{ fontSize: 20, color: "grey" }}>
                  Add More Application
                </h3>
              </div>

              <div
                className="field-align"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "20px",
                }}
              >
                <div
                  className="add-customer-field-container"
                  style={{ width: "100%" }}
                >
                  <Input
                    style={{ width: "100%" }}
                    className="field-addBranch"
                    placeholder="Add More Application"
                    value={newOptionApplication}
                    type="text"
                    onChange={(e) => setNewOptionApplication(e.target.value)}
                  />
                </div>
              </div>
              <div
                style={{
                  marginTop: "10px",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Button
                  className="addBranch-btn"
                  onClick={() => {
                    handleAddMoreForApplication();
                    setAddMoreModalApplication(false);
                  }}
                >
                  Add
                </Button>
              </div>
            </div>
          </div>
        </Sheet>
      </Modal>

      <Modal
        aria-labelledby="modal-title"
        aria-describedby="modal-desc"
        open={addMoreModal}
        onClose={() => {
          setAddMoreModal(false);
          setNewOption("");
        }}
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <Sheet
          variant="plain"
          sx={{
            width: "400px",
            height: "260px",
            borderRadius: "md",
            p: 3,
            boxShadow: "lg",
            position: "relative",
          }}
        >
          <ModalClose variant="plain" sx={{ m: 0 }} />

          <div className="addBranch-customer-main">
            <div className="scrolling-view">
              <div>
                <h3 style={{ fontSize: 20, color: "grey" }}>
                  Add More Vehicle Body Type
                </h3>
              </div>

              <div
                className="field-align"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "20px",
                }}
              >
                <div
                  className="add-customer-field-container"
                  style={{ width: "100%" }}
                >
                  <Input
                    style={{ width: "100%" }}
                    className="field-addBranch"
                    placeholder="Add More Vehicle Type"
                    value={newOption}
                    type="text"
                    onChange={(e) => setNewOption(e.target.value)}
                  />
                </div>
              </div>
              <div
                style={{
                  marginTop: "10px",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Button
                  className="addBranch-btn"
                  onClick={() => {
                    handleAddMore();
                    setAddMoreModal(false);
                  }}
                >
                  Add
                </Button>
              </div>
            </div>
          </div>
        </Sheet>
      </Modal>

      <Modal
        aria-labelledby="modal-title"
        aria-describedby="modal-desc"
        open={updatePanModal}
        onClose={() => {
          setUpdatePanModal(false);
        }}
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <Sheet
          variant="plain"
          sx={{
            width: "400px",
            height: "260px",
            borderRadius: "md",
            p: 3,
            boxShadow: "lg",
            position: "relative",
          }}
        >
          <ModalClose variant="plain" sx={{ m: 0 }} />
          <PanNumberUpdate
            setUpdatePanModal={setUpdatePanModal}
            customer_Id={customerId}
            getCustomerById={getCustomerById}
            panInput={panInput}
          />
        </Sheet>
      </Modal>

      <Modal
        aria-labelledby="modal-title"
        aria-describedby="modal-desc"
        open={addBrandTyreModal}
        onClose={() => {
          setAddBrandTyreModal(false);
        }}
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <Sheet
          variant="plain"
          sx={{
            width: "400px",
            height: "260px",
            borderRadius: "md",
            p: 3,
            boxShadow: "lg",
            position: "relative",
          }}
        >
          <ModalClose variant="plain" sx={{ m: 0 }} />
          <AddOtherBrandTyre
            setAddBrandTyreModal={setAddBrandTyreModal}
            getAllBrands={getAllBrands}
          />
        </Sheet>
      </Modal>

      <Modal
        aria-labelledby="modal-title"
        aria-describedby="modal-desc"
        open={addBranchModal}
        onClose={() => setAddBranchModal(false)}
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <Sheet
          variant="plain"
          sx={{
            width: "95%",
            height: "85%",
            borderRadius: "md",
            p: 3,
            boxShadow: "lg",
            position: "relative",
          }}
        >
          <ModalClose variant="plain" sx={{ m: -1 }} />
          <AddCustomerBranch
            salesperson={salesperson}
            editCustomerBranch={editCustomerBranch}
            customerid={customerId}
            getCustomerByPan={getCustomerByPan}
            setAddBranchModal={setAddBranchModal}
            customerType={customerType}
          />
        </Sheet>
      </Modal>

      <div className="add-customer-head">
        <h3 style={{ fontSize: 20, color: "grey" }}>
          {shareCustomerId ? "Update Customer" : "Add Customer"}
        </h3>
      </div>

      <div className="add-customer-head">
        <div>
          <h5>GST Number</h5>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Input
              style={{
                border: showGSTNumberWarning
                  ? " 1px solid red"
                  : " 1px solid #ccc",
              }}
              className="customerField"
              placeholder="GST Number"
              readOnly={
                customerExist === "Successfully fetched Customer and branches"
              }
              value={GSTNumber}
              onChange={(event) => {
                setShowGSTNumberWarning(false);
                setGSTNumber(event.target.value.slice(0, 15).toUpperCase());
              }}
            />

            {/* {shareCustomerId && (
              <div
                className="edit-button-table-customer"
                style={{ marginLeft: "0px" }}
                onClick={() => {
                  setUpdatePanModal(true);
                  // setEditMeetingPersonData(meetingP)
                }}
              >
                <FontAwesomeIcon
                  icon={faPenToSquare}
                  style={{ color: "#ffffff" }}
                />
              </div>
            )} */}
          </div>
        </div>

        <div>
          <h5>PAN Number</h5>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Input
              sx={{ textTransform: "uppercase" }}
              className="customerField"
              placeholder="Enter PAN Number"
              value={panInput}
              readOnly={shareCustomerId}
              onChange={(event) => {
                const newPanInput = event.target.value
                  .slice(0, 10)
                  .toUpperCase();
                setPanInput(newPanInput);
                if (newPanInput === "PANNOTAVBL") {
                  setIsPanNotAvailable(true);
                } else {
                  setIsPanNotAvailable(false);
                }
              }}
            />

            {shareCustomerId && (
              <div
                className="edit-button-table-customer"
                style={{ marginLeft: "0px" }}
                onClick={() => {
                  setUpdatePanModal(true);
                  // setEditMeetingPersonData(meetingP)
                }}
              >
                <FontAwesomeIcon
                  icon={faPenToSquare}
                  style={{ color: "#ffffff", cursor: "pointer" }}
                />
              </div>
            )}

            {!isPanNotAvailable && (
              <Checkbox
                sx={{
                  marginRight: "auto",
                }}
                label="PAN not available?"
                checked={isPanNotAvailable}
                onChange={(event) => {
                  setIsPanNotAvailable(event.target.checked);
                  setPanInput("PANNOTAVBL");
                  setCustomerType("transporter");
                }}
              />
            )}
          </div>
        </div>
      </div>

      {(panInput.length === 10 && isValidPan.test(panInput)) ||
      (isPanNotAvailable && panInput === "PANNOTAVBL") ? (
        <>
          <div style={{ display: "flex" }}>
            {customerExist === "No Customer Found" || !showFieldsInPan ? (
              <div div className="add-customer-field-main">
                <span
                  className={`addcustomer-type-field ${
                    selectIndex === 0 ? "selected" : ""
                  }`}
                  onClick={() => handleItemClick(0, "transporter")}
                >
                  Transporter
                </span>
                <span
                  className={`addcustomer-type-field ${
                    selectIndex === 1 ? "selected" : ""
                  }`}
                  onClick={() => handleItemClick(1, "dealer")}
                >
                  Dealer
                </span>
              </div>
            ) : (
              <div div className="add-customer-field-main">
                <span
                  className={`addcustomer-type-field ${
                    selectIndex === 0 ? "selected" : ""
                  }`}
                >
                  Transporter
                </span>
                <span
                  className={`addcustomer-type-field ${
                    selectIndex === 1 ? "selected" : ""
                  }`}
                >
                  Dealer
                </span>
              </div>
            )}
          </div>

          <div className="add-customer-field-main-fields">
            <div className="add-customer-field-container">
              <h5>{isDealer ? "Dealer Name" : "Transporter Name"}</h5>
              <Input
                style={{
                  border: showNameWarning
                    ? " 1px solid red"
                    : " 1px solid #ccc",
                }}
                className="customerField"
                placeholder={
                  isDealer ? "Enter Dealer Name" : "Enter Transporter Name"
                }
                readOnly={
                  customerExist === "Successfully fetched Customer and branches"
                }
                value={customerName}
                onChange={(event) => {
                  setShowNameWarning(false);
                  setCustomerName(event.target.value);
                }}
              />
            </div>
          </div>

          <ToggleButtonGroup
            value={index}
            onChange={(event, newValue) => {
              setIndex(newValue);
            }}
            className="button-leaves"
          >
            <Button value="1">Main Office Details</Button>
            {customerType === "transporter" && (
              <Button value="2">Parking Hubs Details</Button>
            )}
            <Button value="3">Others Details</Button>
          </ToggleButtonGroup>

          {index === "1" && (
            <div className="">
              <div className="add-customer-field-main-fields">
                <div className="add-customer-field-container">
                  <h5>Address</h5>
                  <Input
                    style={{
                      border: showAddressWarning
                        ? " 1px solid red"
                        : " 1px solid #ccc",
                    }}
                    className="customerField"
                    placeholder="Enter Address"
                    readOnly={
                      customerExist ===
                      "Successfully fetched Customer and branches"
                    }
                    value={address}
                    onChange={(event) => {
                      setAddress(event.target.value);
                      setShowAddressWarning(false);
                    }}
                  />
                </div>
                {customerExist ===
                  "Successfully fetched Customer and branches" ||
                shareCustomerId ? (
                  <div className="add-customer-field-container">
                    <h5>City</h5>
                    {shareCustomerId ? (
                      <Autocomplete
                        style={{
                          border: showCityWarning
                            ? " 1px solid red"
                            : " 1px solid #ccc",
                        }}
                        className="customerField"
                        options={allCities}
                        onChange={(e, newValue) => {
                          setCity(newValue ? newValue?.label : "");
                          setShowCityWarning(false);
                        }}
                        value={
                          allCities?.find((option) => option?.label === city) ||
                          null
                        }
                        getOptionLabel={(option) => option?.label}
                        getOptionKey={(option) => option?.value}
                        renderInput={(params) => (
                          <TextField {...params} variant="plain" />
                        )}
                      />
                    ) : (
                      <Input
                        className="customerField"
                        placeholder="City"
                        readOnly={
                          customerExist ===
                          "Successfully fetched Customer and branches"
                        }
                        value={city}
                      />
                    )}
                  </div>
                ) : (
                  <div className="add-customer-field-container">
                    <h5>City</h5>
                    <Autocomplete
                      style={{
                        border: showCityWarning
                          ? " 1px solid red"
                          : " 1px solid #ccc",
                      }}
                      className="customerField"
                      options={allCities}
                      onChange={(e, newValue) => {
                        setCity(newValue ? newValue?.label : "");
                        setShowCityWarning(false);
                      }}
                      value={
                        allCities?.find((option) => option?.label === city) ||
                        null
                      }
                      getOptionLabel={(option) => option?.label}
                      getOptionKey={(option) => option?.value}
                      renderInput={(params) => (
                        <TextField {...params} variant="plain" />
                      )}
                    />
                  </div>
                )}

                <div className="add-customer-field-container">
                  <h5>Contact Number</h5>
                  <Input
                    style={{
                      border: showContactNumberWarning
                        ? " 1px solid red"
                        : " 1px solid #ccc",
                    }}
                    className="customerField"
                    type="number"
                    placeholder="Contact Number"
                    readOnly={
                      customerExist ===
                      "Successfully fetched Customer and branches"
                    }
                    value={contactNumber}
                    onChange={(event) => {
                      setContactNumber(event.target.value);
                      setShowContactNumberWarning(false);
                    }}
                  />
                </div>

                <div className="add-customer-field-container">
                  <h5>Email</h5>
                  <Input
                    className="customerField"
                    placeholder="Email"
                    readOnly={
                      customerExist ===
                      "Successfully fetched Customer and branches"
                    }
                    value={emailAddress}
                    onChange={(event) => {
                      setEmailAddress(event.target.value);
                    }}
                  />
                </div>

                <div className="add-customer-field-container">
                  <h5>Region</h5>
                  <Select
                    style={{
                      border: showRegionWarning
                        ? " 1px solid red"
                        : " 1px solid #ccc",
                    }}
                    className="field-addBranch"
                    placeholder="Select Region"
                    value={region}
                    disabled={
                      customerExist ===
                      "Successfully fetched Customer and branches"
                    }
                    onChange={(event, newValue) => {
                      setShowRegionWarning(false);
                      setRegion(newValue);
                    }}
                  >
                    {regions &&
                      regions?.map((regionn) => (
                        <Option
                          value={regionn?.region_id}
                          key={regionn?.region_id}
                        >
                          {regionn?.region_name}
                        </Option>
                      ))}
                  </Select>
                </div>
                <div className="add-customer-field-container">
                  <h5>Pincode</h5>
                  <Input
                    className="customerField"
                    placeholder="Pincode"
                    readOnly={
                      customerExist ===
                      "Successfully fetched Customer and branches"
                    }
                    value={pincode}
                    onChange={(event) => {
                      setPincode(event.target.value);
                    }}
                  />
                </div>
              </div>

              {shareCustomerId && (
                <>
                  {meetingPersonDetails &&
                  meetingPersonDetails?.length === 0 ? (
                    <div style={{ margin: "20px 0px" }}>
                      <button
                        onClick={() => {
                          setAddModalMeeting(true);
                          setShareBranchIdForAddingMeetingPerson(
                            customerBranchIdForAddForMain
                          );
                        }}
                        style={{
                          border: "none",
                          padding: "8px 15px",
                          outline: "none",
                          color: "#fff",
                          backgroundColor: "#000",
                          borderRadius: "20px",
                          cursor: "pointer",
                        }}
                      >
                        Add Meeting Person
                      </button>
                    </div>
                  ) : (
                    ""
                  )}
                </>
              )}

              {customerExist === "Successfully fetched Customer and branches" ||
              shareCustomerId ? (
                <>
                  {meetingPersonDetails?.length !== 0 && (
                    <div style={{ margin: "20px 0px" }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: "4px 0px",
                        }}
                      >
                        <div style={{ display: "flex", flex: "4" }}>
                          <h4 style={{ color: "grey" }}>
                            Meeting Person Details
                          </h4>
                        </div>
                        {shareCustomerId && (
                          <div style={{ display: "flex", flex: "1" }}>
                            <button
                              onClick={() => {
                                setAddModalMeeting(true);
                                setShareBranchIdForAddingMeetingPerson(
                                  customerBranchIdForAddForMain
                                );
                              }}
                              style={{
                                border: "none",
                                padding: "8px 15px",
                                outline: "none",
                                color: "#fff",
                                backgroundColor: "#000",
                                borderRadius: "20px",
                                margin: "auto",
                                cursor: "pointer",
                              }}
                            >
                              Add Meeting Person
                            </button>
                          </div>
                        )}
                      </div>
                      <Table>
                        <TableHead>
                          <TableRow className="">
                            <TableCell style={{ width: "50px" }}>
                              S.No
                            </TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Designation</TableCell>
                            <TableCell>Mobile No</TableCell>
                            <TableCell>Email</TableCell>
                            {shareCustomerId && <TableCell>Actions</TableCell>}
                          </TableRow>
                        </TableHead>
                        <TableBody style={{ width: "100%" }}>
                          {loading === true
                            ? dummmyArray?.map((i) => (
                                <TableRow className="" key={i}>
                                  <TableCell>
                                    <Skeleton />
                                  </TableCell>
                                  <TableCell>
                                    <Skeleton />
                                  </TableCell>
                                  <TableCell>
                                    <Skeleton />
                                  </TableCell>
                                  <TableCell>
                                    <Skeleton />
                                  </TableCell>
                                  <TableCell>
                                    <Skeleton />
                                  </TableCell>
                                </TableRow>
                              ))
                            : meetingPersonDetails?.map((meetingP, i) => {
                                return (
                                  <TableRow className="" key={i}>
                                    <TableCell>{i + 1}</TableCell>
                                    <TableCell>
                                      {meetingP?.meeting_person_name}
                                    </TableCell>
                                    <TableCell>
                                      {meetingP?.meeting_person_designation}
                                    </TableCell>
                                    <TableCell>
                                      {meetingP?.mobile_number}
                                    </TableCell>
                                    <TableCell>{meetingP?.email}</TableCell>
                                    {shareCustomerId && (
                                      <TableCell>
                                        <div
                                          style={{
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                          }}
                                        >
                                          <div
                                            className="edit-button-table-customer"
                                            onClick={() => {
                                              setEditMeetingPersonModal(true);
                                              setEditMeetingPersonData(
                                                meetingP
                                              );
                                            }}
                                          >
                                            <FontAwesomeIcon
                                              icon={faPenToSquare}
                                              style={{
                                                color: "#ffffff",
                                                cursor: "pointer",
                                              }}
                                            />
                                          </div>
                                        </div>
                                      </TableCell>
                                    )}
                                  </TableRow>
                                );
                              })}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </>
              ) : (
                <div className="hub-fields" style={{ marginTop: "15px" }}>
                  <h4 style={{ color: "grey" }}>Add Meeting Person</h4>
                  {hubs?.map((hub, index) => (
                    <div
                      key={index}
                      className="field-align"
                      style={{ justifyContent: "start" }}
                    >
                      <div
                        className="add-customer-field-container"
                        style={{ width: "auto" }}
                      >
                        <h5>Person Name</h5>
                        <Input
                          style={{
                            border: showMeetingPersonNameWarning
                              ? " 1px solid red"
                              : " 1px solid #ccc",
                          }}
                          className="field-addBranch"
                          placeholder={`Person Name`}
                          value={hub?.meeting_person_name}
                          onChange={(event) => {
                            handleHubChange(
                              index,
                              "meeting_person_name",
                              event.target.value
                            );
                            setShowMeetingPersonNameWarning(false);
                          }}
                        />
                      </div>
                      <div
                        className="add-customer-field-container"
                        style={{ width: "auto" }}
                      >
                        <h5>Person Designation</h5>
                        <Input
                          className="field-addBranch"
                          style={{
                            border: showMeetingPersonDesignWarning
                              ? " 1px solid red"
                              : " 1px solid #ccc",
                          }}
                          placeholder={`Person Designation`}
                          value={hub?.meeting_person_designation}
                          onChange={(event) => {
                            handleHubChange(
                              index,
                              "meeting_person_designation",
                              event.target.value
                            );
                            setShowMeetingPersonDesignWarning(false);
                          }}
                        />
                      </div>
                      <div
                        className="add-customer-field-container"
                        style={{ width: "auto" }}
                      >
                        <h5>Mobile Number</h5>
                        <Input
                          className="field-addBranch"
                          placeholder={`Mobile Number`}
                          value={hub?.mobile_number}
                          onChange={(event) => {
                            handleHubChange(
                              index,
                              "mobile_number",
                              event.target.value
                            );
                          }}
                        />
                      </div>
                      <div
                        className="add-customer-field-container"
                        style={{ width: "auto" }}
                      >
                        <h5>Email</h5>
                        <Input
                          className="field-addBranch"
                          placeholder={`Person Email`}
                          value={hub?.email}
                          onChange={(event) => {
                            handleHubChange(index, "email", event.target.value);
                          }}
                        />
                      </div>

                      <button
                        className="remove-hubs-btn"
                        type="button"
                        onClick={() => removeHub(index)}
                      >
                        <FontAwesomeIcon className="crossicon" icon={faTimes} />
                      </button>
                    </div>
                  ))}
                  <button
                    className="add-hubs-btn"
                    type="button"
                    onClick={addHub}
                  >
                    Add
                  </button>
                </div>
              )}
            </div>
          )}

          {index === "2" && (
            <>
              {customerType !== "dealer" && (
                <div className="">
                  <Checkbox
                    sx={{ marginBottom: "10px" }}
                    disabled={
                      customerExist ===
                      "Successfully fetched Customer and branches"
                    }
                    label="is same as main branch"
                    checked={isChecked}
                    onChange={(event) => {
                      setIsChecked(event.target.checked);
                      setParkingAddress(null);
                      setCityForParking(null);
                      setParkingContactNumber();
                      setParkingEmail(null);
                      setParkingRegion(null);
                      setParkingPincode(null);
                      setParkingMeetingPersonDetails([]);
                    }}
                  />

                  {!isChecked && (
                    <div className="">
                      <>
                        {!isChecked && (
                          <div className="add-customer-field-main-fields">
                            <div className="add-customer-field-container">
                              <h5>
                                {isDealer
                                  ? "Dealer Address"
                                  : "Parking Address"}
                              </h5>
                              <Input
                                style={{
                                  border: showAddressWarning
                                    ? " 1px solid red"
                                    : " 1px solid #ccc",
                                }}
                                className="customerField"
                                placeholder={
                                  isDealer
                                    ? "Enter Dealer Address"
                                    : "Enter Parking Address"
                                }
                                readOnly={
                                  customerExist ===
                                  "Successfully fetched Customer and branches"
                                }
                                value={parkingAddress}
                                onChange={(event) => {
                                  setParkingAddress(event.target.value);
                                  setShowAddressWarning(false);
                                }}
                              />
                            </div>

                            {customerExist ===
                              "Successfully fetched Customer and branches" ||
                            shareCustomerId ? (
                              <div className="add-customer-field-container">
                                <h5>Parking City</h5>
                                {shareCustomerId ? (
                                  <Autocomplete
                                    style={{
                                      border: showParkingCityWarning
                                        ? " 1px solid red"
                                        : " 1px solid #ccc",
                                    }}
                                    className="customerField"
                                    options={allCities}
                                    onChange={(e, newValue) => {
                                      setShowParkingCityWarning(false);
                                      setCityForParking(
                                        newValue ? newValue?.label : ""
                                      );
                                    }}
                                    value={
                                      allCities?.find(
                                        (option) =>
                                          option?.label === cityForParking
                                      ) || null
                                    }
                                    getOptionLabel={(option) => option?.label}
                                    getOptionKey={(option) => option?.value}
                                    renderInput={(params) => (
                                      <TextField {...params} variant="plain" />
                                    )}
                                  />
                                ) : (
                                  <Input
                                    className="customerField"
                                    placeholder="Parking City"
                                    readOnly={
                                      customerExist ===
                                      "Successfully fetched Customer and branches"
                                    }
                                    value={cityForParking}
                                  />
                                )}
                              </div>
                            ) : (
                              <div className="add-customer-field-container">
                                <h5>Parking City</h5>
                                <Autocomplete
                                  style={{
                                    border: showParkingCityWarning
                                      ? " 1px solid red"
                                      : " 1px solid #ccc",
                                  }}
                                  className="customerField"
                                  options={allCities}
                                  onChange={(e, newValue) => {
                                    setCityForParking(
                                      newValue ? newValue?.label : ""
                                    );
                                    setShowParkingCityWarning(false);
                                  }}
                                  value={
                                    allCities?.find(
                                      (option) =>
                                        option?.label === cityForParking
                                    ) || null
                                  }
                                  getOptionLabel={(option) => option?.label}
                                  getOptionKey={(option) => option?.value}
                                  renderInput={(params) => (
                                    <TextField {...params} variant="plain" />
                                  )}
                                />
                              </div>
                            )}

                            <div className="add-customer-field-container">
                              <h5>Parking Contact Number</h5>
                              <Input
                                style={{
                                  border: showContactNumberWarning
                                    ? " 1px solid red"
                                    : " 1px solid #ccc",
                                }}
                                className="customerField"
                                placeholder="Parking Contact Number"
                                readOnly={
                                  customerExist ===
                                  "Successfully fetched Customer and branches"
                                }
                                type="number"
                                value={parkingContactNumber}
                                onChange={(event) => {
                                  setParkingContactNumber(event.target.value);
                                  setShowContactNumberWarning(false);
                                }}
                              />
                            </div>

                            <div className="add-customer-field-container">
                              <h5>Parking Email</h5>
                              <Input
                                className="customerField"
                                placeholder="Parking Email"
                                readOnly={
                                  customerExist ===
                                  "Successfully fetched Customer and branches"
                                }
                                value={parkingEmail}
                                onChange={(event) => {
                                  setParkingEmail(event.target.value);
                                }}
                              />
                            </div>

                            <div className="add-customer-field-container">
                              <h5>Parking Branch Region</h5>
                              <Select
                                style={{
                                  border: showParkingRegionWarning
                                    ? " 1px solid red"
                                    : " 1px solid #ccc",
                                }}
                                className="field-addBranch"
                                placeholder="Select Parking Region"
                                defaultValue={parkingRegion}
                                disabled={
                                  customerExist ===
                                  "Successfully fetched Customer and branches"
                                }
                                onChange={(event, newValue) => {
                                  setParkingRegion(newValue);
                                  setShowParkingRegionWarning(false);
                                }}
                              >
                                {regions &&
                                  regions?.map((region) => (
                                    <Option value={region?.region_id}>
                                      {region?.region_name}
                                    </Option>
                                  ))}
                              </Select>
                            </div>

                            <div className="add-customer-field-container">
                              <h5>Parking Pincode</h5>
                              <Input
                                className="customerField"
                                placeholder="Parking Pincode"
                                readOnly={
                                  customerExist ===
                                  "Successfully fetched Customer and branches"
                                }
                                value={parkingPincode}
                                onChange={(event) => {
                                  setParkingPincode(event.target.value);
                                }}
                              />
                            </div>
                          </div>
                        )}

                        {shareCustomerId && (
                          <>
                            {parkingMeetingPersonDetails &&
                            parkingMeetingPersonDetails?.length === 0 ? (
                              <div style={{ margin: "20px 0px" }}>
                                <button
                                  onClick={() => {
                                    setAddModalMeeting(true);
                                    setShareBranchIdForAddingMeetingPerson(
                                      customerBranchIdForAddForParking
                                    );
                                  }}
                                  style={{
                                    border: "none",
                                    padding: "8px 15px",
                                    outline: "none",
                                    color: "#fff",
                                    backgroundColor: "#000",
                                    borderRadius: "20px",
                                    cursor: "pointer",
                                  }}
                                >
                                  Add Meeting Person
                                </button>
                              </div>
                            ) : (
                              ""
                            )}
                          </>
                        )}

                        {customerExist ===
                          "Successfully fetched Customer and branches" ||
                        shareCustomerId ? (
                          <>
                            {parkingMeetingPersonDetails?.length !== 0 && (
                              <div style={{ margin: "20px 0px" }}>
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    padding: "4px 0px",
                                  }}
                                >
                                  <div style={{ display: "flex", flex: "4" }}>
                                    <h4 style={{ color: "grey" }}>
                                      Meeting Person Details
                                    </h4>
                                  </div>
                                  {shareCustomerId && (
                                    <div style={{ display: "flex", flex: "1" }}>
                                      <button
                                        onClick={() => {
                                          setAddModalMeeting(true);
                                          setShareBranchIdForAddingMeetingPerson(
                                            customerBranchIdForAddForParking
                                          );
                                        }}
                                        style={{
                                          border: "none",
                                          padding: "8px 15px",
                                          outline: "none",
                                          color: "#fff",
                                          backgroundColor: "#000",
                                          borderRadius: "20px",
                                          margin: "auto",
                                          cursor: "pointer",
                                        }}
                                      >
                                        Add Meeting Person
                                      </button>
                                    </div>
                                  )}
                                </div>

                                <Table>
                                  <TableHead>
                                    <TableRow className="">
                                      <TableCell style={{ width: "50px" }}>
                                        S.No
                                      </TableCell>
                                      <TableCell>Name</TableCell>
                                      <TableCell>Designation</TableCell>
                                      <TableCell>Mobile No</TableCell>
                                      <TableCell>Email</TableCell>
                                      <TableCell>Action</TableCell>
                                    </TableRow>
                                  </TableHead>
                                  <TableBody style={{ width: "100%" }}>
                                    {loading === true
                                      ? dummmyArray?.map((i) => (
                                          <TableRow className="" key={i}>
                                            <TableCell>
                                              <Skeleton />
                                            </TableCell>
                                            <TableCell>
                                              <Skeleton />
                                            </TableCell>
                                            <TableCell>
                                              <Skeleton />
                                            </TableCell>
                                            <TableCell>
                                              <Skeleton />
                                            </TableCell>
                                          </TableRow>
                                        ))
                                      : parkingMeetingPersonDetails?.map(
                                          (meetingP, i) => {
                                            return (
                                              <TableRow className="" key={i}>
                                                <TableCell>{i + 1}</TableCell>
                                                <TableCell>
                                                  {
                                                    meetingP?.meeting_person_name
                                                  }
                                                </TableCell>
                                                <TableCell>
                                                  {
                                                    meetingP?.meeting_person_designation
                                                  }
                                                </TableCell>
                                                <TableCell>
                                                  {meetingP?.mobile_number}
                                                </TableCell>
                                                <TableCell>
                                                  {meetingP.email}
                                                </TableCell>
                                                <TableCell>
                                                  <div
                                                    className="edit-button-table-customer"
                                                    onClick={() => {
                                                      setEditMeetingPersonModal(
                                                        true
                                                      );
                                                      setEditMeetingPersonData(
                                                        meetingP
                                                      );
                                                    }}
                                                  >
                                                    <FontAwesomeIcon
                                                      icon={faPenToSquare}
                                                      style={{
                                                        color: "#ffffff",
                                                        cursor: "pointer",
                                                      }}
                                                    />
                                                  </div>
                                                </TableCell>
                                              </TableRow>
                                            );
                                          }
                                        )}
                                  </TableBody>
                                </Table>
                              </div>
                            )}
                          </>
                        ) : (
                          <div
                            className="hub-fields"
                            style={{ marginTop: "15px" }}
                          >
                            <h4 style={{ color: "grey" }}>
                              Parking Meeting Person
                            </h4>

                            {parkinghubs?.map((hub, index) => (
                              <div
                                key={index}
                                className="field-align"
                                style={{ justifyContent: "start" }}
                              >
                                <div
                                  className="add-customer-field-container"
                                  style={{ width: "auto" }}
                                >
                                  <h5>Parking Person Name</h5>
                                  <Input
                                    style={{
                                      border: showMeetingPersonNameWarning
                                        ? " 1px solid red"
                                        : " 1px solid #ccc",
                                    }}
                                    className="field-addBranch"
                                    placeholder={`Parking Person Name`}
                                    value={hub.meeting_person_name}
                                    onChange={(event) => {
                                      handleHubParkingChange(
                                        index,
                                        "meeting_person_name",
                                        event.target.value
                                      );
                                      setShowMeetingPersonNameWarning(false);
                                    }}
                                  />
                                </div>
                                <div
                                  className="add-customer-field-container"
                                  style={{ width: "auto" }}
                                >
                                  <h5>Parking Person Designation</h5>
                                  <Input
                                    style={{
                                      border: showMeetingPersonDesignWarning
                                        ? " 1px solid red"
                                        : " 1px solid #ccc",
                                    }}
                                    className="field-addBranch"
                                    placeholder={`Parking Person Designation`}
                                    value={hub.meeting_person_designation}
                                    onChange={(event) => {
                                      handleHubParkingChange(
                                        index,
                                        "meeting_person_designation",
                                        event.target.value
                                      );
                                      setShowMeetingPersonDesignWarning(false);
                                    }}
                                  />
                                </div>
                                <div
                                  className="add-customer-field-container"
                                  style={{ width: "auto" }}
                                >
                                  <h5>Parking Mobile Number</h5>
                                  <Input
                                    className="field-addBranch"
                                    placeholder={`Parking Mobile Number`}
                                    value={hub.mobile_number}
                                    type="number"
                                    onChange={(event) => {
                                      handleHubParkingChange(
                                        index,
                                        "mobile_number",
                                        event.target.value
                                      );
                                    }}
                                  />
                                </div>
                                <div
                                  className="add-customer-field-container"
                                  style={{ width: "auto" }}
                                >
                                  <h5>Parking Email</h5>
                                  <Input
                                    className="field-addBranch"
                                    placeholder={`Parking Person Email`}
                                    value={hub.email}
                                    onChange={(event) => {
                                      handleHubParkingChange(
                                        index,
                                        "email",
                                        event.target.value
                                      );
                                    }}
                                  />
                                </div>

                                <button
                                  className="remove-hubs-btn"
                                  type="button"
                                  onClick={() => removeParkingHub(index)}
                                >
                                  <FontAwesomeIcon
                                    className="crossicon"
                                    icon={faTimes}
                                  />
                                </button>
                              </div>
                            ))}
                            <button
                              className="add-hubs-btn"
                              type="button"
                              onClick={addParkingMeetingPersonHub}
                            >
                              Add
                            </button>
                          </div>
                        )}
                      </>
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {index === "3" && (
            <>
              <div>
                <div className="add-customer-field-main-fields">
                  {customerType !== "dealer" && (
                    <div className="add-customer-field-container">
                      <h5>Number Of Vehicles</h5>
                      <Input
                        className="field-addBranch"
                        placeholder="Enter Number Of Vehicles"
                        type="number"
                        value={noOfVehicles}
                        onChange={(event) => {
                          if (event.target.value < 0) {
                            SetNoOfVehicles(0);
                          } else {
                            SetNoOfVehicles(event.target.value);
                          }
                        }}
                      />
                    </div>
                  )}

                  {customerType !== "dealer" && (
                    <div className="add-customer-field-container">
                      <h5>Monthly Km Run</h5>
                      <Input
                        className="field-addBranch"
                        placeholder="Enter Monthly Km Run"
                        value={monthlyRun}
                        type="number"
                        onChange={(event) => {
                          setMonthlyRun(event.target.value);
                        }}
                      />
                    </div>
                  )}

                  {/* {customerType !== "transporter" && (
                    <div className="add-customer-field-container">
                      <h5>Monthly Tyre Sales</h5>
                      <Input
                        className="field-addBranch"
                        placeholder="Enter Monthly Km Run"
                        value={monthlyTyreSales}
                        type="number"
                        onChange={(event) => {
                          setMonthlyTyreSales(event.target.value);
                        }}
                      />
                    </div>
                  )} */}

                  {customerType === "transporter" && (
                    <>
                      {customerExist ===
                        "Successfully fetched Customer and branches" ||
                      shareCustomerId ? (
                        <div className="add-customer-field-container">
                          <h5>Application</h5>
                          {shareCustomerId ? (
                            <div
                              style={{ display: "flex", alignItems: "center" }}
                            >
                              <Select
                                className="field-addBranch"
                                multiple
                                value={applicationTypeData || []}
                                onChange={handleChangeForApplicationType}
                                sx={{
                                  minWidth: "13rem",
                                }}
                                slotProps={{
                                  listbox: {
                                    sx: {
                                      width: "100%",
                                    },
                                  },
                                }}
                              >
                                {applicationTypeData?.map((option, index) => (
                                  <Option key={index} value={option}>
                                    {option}
                                  </Option>
                                ))}
                                {defaultOptionsForApplication
                                  ?.filter(
                                    (option) =>
                                      !applicationTypeData?.includes(option)
                                  )
                                  ?.map((option, index) => (
                                    <Option key={index} value={option}>
                                      {option}
                                    </Option>
                                  ))}
                              </Select>
                              <div
                                style={{
                                  height: "100%",
                                  color: "black",
                                  cursor: "pointer",
                                }}
                                onClick={() => {
                                  setAddMoreModalApplication(true);
                                }}
                              >
                                <FontAwesomeIcon
                                  icon={faPlus}
                                  style={{
                                    backgroundColor: "white",
                                    color: "black",
                                    padding: "6px",
                                  }}
                                />
                              </div>
                            </div>
                          ) : (
                            <Select
                              // placeholder="Currently Dealing"
                              defaultValue={[]}
                              value={allapplication || []}
                              multiple
                              className="customerField"
                              slotProps={{
                                listbox: {
                                  sx: {
                                    width: "100%",
                                  },
                                },
                              }}
                            >
                              {allapplication?.map((application) => (
                                <Option key={application} value={application}>
                                  {application}
                                </Option>
                              ))}
                            </Select>
                          )}
                        </div>
                      ) : (
                        <div className="add-customer-field-container">
                          <h5>Application</h5>
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <Select
                              className="field-addBranch"
                              multiple
                              value={applicationTypeData || []}
                              onChange={handleChangeForApplicationType}
                              sx={{
                                minWidth: "13rem",
                              }}
                              slotProps={{
                                listbox: {
                                  sx: {
                                    width: "100%",
                                  },
                                },
                              }}
                            >
                              {applicationTypeData?.map((option, index) => (
                                <Option key={index} value={option}>
                                  {option}
                                </Option>
                              ))}
                              {defaultOptionsForApplication
                                ?.filter(
                                  (option) =>
                                    !applicationTypeData?.includes(option)
                                )
                                ?.map((option, index) => (
                                  <Option key={index} value={option}>
                                    {option}
                                  </Option>
                                ))}
                            </Select>
                            <div
                              style={{
                                height: "100%",
                                color: "black",
                                cursor: "pointer",
                              }}
                              onClick={() => {
                                setAddMoreModalApplication(true);
                              }}
                            >
                              <FontAwesomeIcon
                                icon={faPlus}
                                style={{
                                  backgroundColor: "white",
                                  color: "black",
                                  padding: "6px",
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  {/* <div className="add-customer-field-container">
                    <h5>GST Number</h5>
                    <Input
                      style={{
                        border: showGSTNumberWarning
                          ? " 1px solid red"
                          : " 1px solid #ccc",
                      }}
                      className="gst-number field-addBranch"
                      placeholder="GST Number"
                      readOnly={
                        customerExist ===
                        "Successfully fetched Customer and branches"
                      }
                      value={GSTNumber}
                      onChange={(event) => {
                        setShowGSTNumberWarning(false);
                        setGSTNumber(event.target.value);
                      }}
                    />
                  </div> */}
                  {/* 
                  {customerType !== "transporter" && (
                    <>
                      {customerExist ===
                        "Successfully fetched Customer and branches" ||
                      shareCustomerId ? (
                        <div className="add-customer-field-container">
                          <h5>Brand Dealing </h5>
                          {shareCustomerId ? (
                            <Select
                              // placeholder="Currently Dealing"
                              style={{
                                border: showSelectedBrandWarning
                                  ? " 1px solid red"
                                  : " 1px solid #ccc",
                              }}
                              defaultValue={[]}
                              value={selectedBrands || []}
                              onChange={(event, newValue) => {
                                setSelectedBrands(newValue);
                                setShowSelectedBrandWarning(false);
                              }}
                              multiple
                              className="customerField"
                              slotProps={{
                                listbox: {
                                  sx: {
                                    width: "100%",
                                  },
                                },
                              }}
                            >
                              {brands?.map((brand) => (
                                <Option
                                  key={brand?.tyre_brand_id}
                                  value={brand?.tyre_brand_name}
                                >
                                  {brand?.tyre_brand_name}
                                </Option>
                              ))}
                            </Select>
                          ) : (
                            <Select
                              defaultValue={[]}
                              value={currentlyDealing || []}
                              onChange={(event, newValue) => {
                                setSelectedBrands(newValue);
                              }}
                              multiple
                              className="customerField"
                              slotProps={{
                                listbox: {
                                  sx: {
                                    width: "100%",
                                  },
                                },
                              }}
                            >
                              {currentlyDealing?.map((brand) => (
                                <Option key={brand} value={brand}>
                                  {brand}
                                </Option>
                              ))}
                            </Select>
                          )}
                        </div>
                      ) : (
                        <div className="add-customer-field-container">
                          <h5>Brand Dealing </h5>
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "row",
                              alignItems: "center",
                            }}
                          >
                            <Select
                              style={{
                                border: showSelectedBrandWarning
                                  ? " 1px solid red"
                                  : " 1px solid #ccc",
                              }}
                              defaultValue={[]}
                              value={selectedBrands || []}
                              onChange={(event, newValue) => {
                                setSelectedBrands(newValue);
                                setShowSelectedBrandWarning(false);
                              }}
                              multiple
                              className="customerField"
                              slotProps={{
                                listbox: {
                                  sx: {
                                    width: "100%",
                                  },
                                },
                              }}
                            >
                              {brands?.map((brand) => (
                                <Option
                                  key={brand?.tyre_brand_id}
                                  value={brand?.tyre_brand_name}
                                >
                                  {brand?.tyre_brand_name}
                                </Option>
                              ))}
                            </Select>
                            <div
                              style={{ height: "100%", color: "black" }}
                              onClick={() => {
                                setAddBrandTyreModal(true);
                              }}
                            >
                              <FontAwesomeIcon
                                icon={faPlus}
                                style={{
                                  backgroundColor: "white",
                                  color: "black",
                                  padding: "6px",
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  )} */}
                  {customerType === "transporter" && (
                    <>
                      {customerExist ===
                      "Successfully fetched Customer and branches" ? (
                        <div className="add-customer-field-container">
                          <h5>Load</h5>
                          {shareCustomerId ? (
                            <Select
                              className="field-addBranch"
                              defaultValue={[""]}
                              multiple
                              value={load || []}
                              onChange={(event, newValue) => {
                                setLoad(newValue);
                              }}
                              sx={{
                                minWidth: "13rem",
                              }}
                              slotProps={{
                                listbox: {
                                  sx: {
                                    width: "100%",
                                  },
                                },
                              }}
                            >
                              <Option value="Normal Load">Normal Load</Option>
                              <Option value="Under Load">Under Load</Option>
                              <Option value="Over Load">Over Load</Option>
                            </Select>
                          ) : (
                            <Select
                              className="field-addBranch"
                              // placeholder="Load"
                              defaultValue={[""]}
                              multiple
                              value={allLoad || []}
                              onChange={(event, newValue) => {
                                setLoad(newValue);
                              }}
                              sx={{
                                minWidth: "13rem",
                              }}
                              slotProps={{
                                listbox: {
                                  sx: {
                                    width: "100%",
                                  },
                                },
                              }}
                            >
                              {allLoad?.map((load) => (
                                <Option key={load} value={load}>
                                  {load}
                                </Option>
                              ))}
                            </Select>
                          )}
                        </div>
                      ) : (
                        <div className="add-customer-field-container">
                          <h5>Load</h5>
                          <Select
                            className="field-addBranch"
                            // placeholder="Load"
                            defaultValue={[""]}
                            multiple
                            value={load || []}
                            onChange={(event, newValue) => {
                              setLoad(newValue);
                            }}
                            sx={{
                              minWidth: "13rem",
                            }}
                            slotProps={{
                              listbox: {
                                sx: {
                                  width: "100%",
                                },
                              },
                            }}
                          >
                            <Option value="Normal Load">Normal Load</Option>
                            <Option value="Under Load">Under Load</Option>
                            <Option value="Over Load">Over Load</Option>
                          </Select>
                        </div>
                      )}
                    </>
                  )}

                  {customerType === "transporter" && (
                    <>
                      {customerExist ===
                        "Successfully fetched Customer and branches" ||
                      shareCustomerId ? (
                        <div className="add-customer-field-container">
                          <h5>Vehicle Body Type</h5>
                          {shareCustomerId ? (
                            <div
                              style={{ display: "flex", alignItems: "center" }}
                            >
                              <Select
                                className="field-addBranch"
                                multiple
                                value={vehicleTypeData || []}
                                onChange={handleChangeForVehicleType}
                                sx={{
                                  minWidth: "13rem",
                                }}
                                slotProps={{
                                  listbox: {
                                    sx: {
                                      width: "100%",
                                    },
                                  },
                                }}
                              >
                                {vehicleTypeData?.map((option, index) => (
                                  <Option key={index} value={option}>
                                    {option}
                                  </Option>
                                ))}
                                {defaultOptions
                                  ?.filter(
                                    (option) =>
                                      !vehicleTypeData?.includes(option)
                                  )
                                  ?.map((option, index) => (
                                    <Option key={index} value={option}>
                                      {option}
                                    </Option>
                                  ))}
                              </Select>
                              <div
                                style={{
                                  height: "100%",
                                  color: "black",
                                  cursor: "pointer",
                                }}
                                onClick={() => {
                                  setAddMoreModal(true);
                                }}
                              >
                                <FontAwesomeIcon
                                  icon={faPlus}
                                  style={{
                                    backgroundColor: "white",
                                    color: "black",
                                    padding: "6px",
                                  }}
                                />
                              </div>
                            </div>
                          ) : (
                            <Select
                              className="field-addBranch"
                              // placeholder="Vehicle Type"
                              defaultValue={[""]}
                              multiple
                              value={allVehicleType || []}
                              onChange={(event, newValue) => {
                                setVehicleType(newValue);
                              }}
                              sx={{
                                minWidth: "13rem",
                              }}
                              slotProps={{
                                listbox: {
                                  sx: {
                                    width: "100%",
                                  },
                                },
                              }}
                            >
                              {allVehicleType?.map((vehicleType) => (
                                <Option key={vehicleType} value={vehicleType}>
                                  {vehicleType}
                                </Option>
                              ))}
                            </Select>
                          )}
                        </div>
                      ) : (
                        <div className="add-customer-field-container">
                          <h5>Vehicle Body Type</h5>
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <Select
                              className="field-addBranch"
                              multiple
                              value={vehicleTypeData}
                              onChange={handleChangeForVehicleType}
                              sx={{
                                minWidth: "13rem",
                              }}
                              slotProps={{
                                listbox: {
                                  sx: {
                                    width: "100%",
                                  },
                                },
                              }}
                            >
                              {vehicleTypeData?.map((option, index) => (
                                <Option key={index} value={option}>
                                  {option}
                                </Option>
                              ))}
                              {defaultOptions
                                ?.filter(
                                  (option) => !vehicleTypeData?.includes(option)
                                )
                                ?.map((option, index) => (
                                  <Option key={index} value={option}>
                                    {option}
                                  </Option>
                                ))}
                            </Select>
                            <div
                              style={{
                                height: "100%",
                                color: "black",
                                cursor: "pointer",
                              }}
                              onClick={() => {
                                setAddMoreModal(true);
                              }}
                            >
                              <FontAwesomeIcon
                                icon={faPlus}
                                style={{
                                  backgroundColor: "white",
                                  color: "black",
                                  padding: "6px",
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>

              {customerType === "transporter" && (
                <div className="add-customer-field-main-fields">
                  <div className="add-customer-field-container">
                    <h5>Route</h5>
                    <Select
                      className="field-addBranch"
                      placeholder="Select Route"
                      onChange={(event, newValue) => {
                        setRoutes(newValue);
                        setShowRouteFields(newValue === "From - To");
                      }}
                      value={routes}
                      disabled={
                        customerExist ===
                        "Successfully fetched Customer and branches"
                      }
                    >
                      <Option value="Undefined">No Defined Route</Option>
                      <Option value="PAN India">Pan India</Option>
                      <Option value="From - To">From - To</Option>
                    </Select>
                  </div>

                  {showRouteFields && (
                    <>
                      <div
                        className="add-customer-field-container"
                        style={{ width: "auto" }}
                      >
                        <h5>From</h5>
                        <Input
                          className="field-addBranch"
                          placeholder="From"
                          readOnly={
                            customerExist ===
                            "Successfully fetched Customer and branches"
                          }
                          value={from}
                          onChange={(event) => {
                            const value = event.target.value;
                            setFrom(value);
                            if (!value) {
                              setTo("");
                            }
                          }}
                        />
                      </div>

                      <div
                        className="add-customer-field-container"
                        style={{ width: "auto" }}
                      >
                        <h5>To</h5>
                        <Input
                          className="field-addBranch"
                          placeholder="to"
                          disabled={!from}
                          readOnly={
                            customerExist ===
                            "Successfully fetched Customer and branches"
                          }
                          value={to}
                          onChange={(event) => {
                            setTo(event.target.value);
                          }}
                        />
                      </div>
                    </>
                  )}
                </div>
              )}

              {customerType === "dealer" && (
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <h5 style={{ marginBottom: "0px" }}>Brand Dealing In</h5>

                  <TabsSelection
                    brands={brands}
                    sets={sets}
                    setsPCR={setsPCR}
                    setsTruckBus={setsTruckBus}
                    setsOTR={setsOTR}
                    setsFarm={setsFarm}
                    setSets={setSets}
                    setSetsPCR={setSetsPCR}
                    setSetsTruckBus={setSetsTruckBus}
                    setSetsOTR={setSetsOTR}
                    setSetsFarm={setSetsFarm}
                    shareCustomerId={shareCustomerId}
                    customerExist={customerExist}
                  />
                </div>
              )}

              {/* {customerType === "dealer" && shareCustomerId && selectedBrands!==null && selectedBrands?.length!==0? 
               <div className="add-customer-field-container">
               <h5>Brand Dealing In</h5>
               {shareCustomerId && (
                <Select                    
                defaultValue={[]}
                value={selectedBrands || []}
                onChange={(event, newValue) => {
                  setSelectedBrands(newValue);
                }}
                multiple
                className="customerField"
                slotProps={{
                  listbox: {
                    sx: {
                      width: "100%",
                    },
                  },
                }}
              >
                {brands?.map((brand) => (
                  <Option
                    key={brand?.tyre_brand_id}
                    value={brand?.tyre_brand_name}
                  >
                    {brand?.tyre_brand_name}
                  </Option>
                ))}
              </Select>
               )}
             </div>
              :""
              }  */}

              <div
                className="add-customer-field-main-fields"
                style={{ display: "flex", alignItems: "center" }}
              >
                <Checkbox
                  disabled={
                    customerExist ===
                    "Successfully fetched Customer and branches"
                  }
                  label="Uses Retread"
                  checked={usesRetread}
                  onChange={(event) => {
                    setUsesRetread(event.target.checked);
                  }}
                />
              </div>
            </>
          )}
        </>
      ) : (
        ""
      )}

      {customerExist === "Successfully fetched Customer and branches" ||
      !isPanNotAvailable ? (
        ""
      ) : (
        <>
          {loading ? (
            <Button className="submit-customer-button">
              <CircularProgress variant="solid" />
              &nbsp;{shareCustomerId ? "Updating" : "Adding"}
            </Button>
          ) : (
            <Button
              className="submit-customer-button"
              onClick={() => {
                handleSubmit();
              }}
            >
              {shareCustomerId ? "Update Customer" : "  Add Customer"}
            </Button>
          )}
        </>
      )}
    </div>
  );
};

export default AddCustomer;

const TabsSelection = ({
  brands,
  setSets,
  setSetsPCR,
  setSetsTruckBus,
  setSetsOTR,
  setSetsFarm,
  sets,
  setsPCR,
  setsTruckBus,
  setsOTR,
  setsFarm,
  shareCustomerId,
  customerExist,
}) => {
  const handleAddSet = () => {
    setSets([...sets, { brand: null, quantity: null }]);
  };

  const handleBrandChange = (index, newValue) => {
    const newSets = [...sets];
    newSets[index].brand = newValue;
    setSets(newSets);
  };

  const handleCountChange = (index, newValue) => {
    const newSets = [...sets];
    newSets[index].quantity = newValue;
    setSets(newSets);
  };

  // pcr

  const handleAddSetPCR = () => {
    setSetsPCR([...setsPCR, { brand: null, quantity: null }]);
  };

  const handleBrandChangePCR = (index, newValue) => {
    const newSets = [...setsPCR];
    newSets[index].brand = newValue;
    setSetsPCR(newSets);
  };

  const handleCountChangePCR = (index, newValue) => {
    const newSets = [...setsPCR];
    newSets[index].quantity = newValue;
    setSetsPCR(newSets);
  };

  // truck bus

  const handleAddSetTruckBus = () => {
    setSetsTruckBus([...setsTruckBus, { brand: null, quantity: null }]);
  };

  const handleBrandChangeTruckBus = (index, newValue) => {
    const newSets = [...setsTruckBus];
    newSets[index].brand = newValue;
    setSetsTruckBus(newSets);
  };

  const handleCountChangeTruckBus = (index, newValue) => {
    const newSets = [...setsTruckBus];
    newSets[index].quantity = newValue;
    setSetsTruckBus(newSets);
  };

  // OTR

  const handleAddSetOTR = () => {
    setSetsOTR([...setsOTR, { brand: null, quantity: null }]);
  };

  const handleBrandChangeOTR = (index, newValue) => {
    const newSets = [...setsOTR];
    newSets[index].brand = newValue;
    setSetsOTR(newSets);
  };

  const handleCountChangeOTR = (index, newValue) => {
    const newSets = [...setsOTR];
    newSets[index].quantity = newValue;
    setSetsOTR(newSets);
  };

  // Farm

  const handleAddSetFarm = () => {
    setSetsFarm([...setsFarm, { brand: null, quantity: null }]);
  };

  const handleBrandChangeFarm = (index, newValue) => {
    const newSets = [...setsFarm];
    newSets[index].brand = newValue;
    setSetsFarm(newSets);
  };

  const handleCountChangeFarm = (index, newValue) => {
    const newSets = [...setsFarm];
    newSets[index].quantity = newValue;
    setSetsFarm(newSets);
  };

  return (
    <div className="tyre-category-section-tab">
      <Tabs aria-label="Basic tabs" defaultValue={0}>
        <TabList
          sx={{
            pt: 1,
            justifyContent: "center",
            [`&& .${tabClasses.root}`]: {
              flex: "initial",
              bgcolor: "transparent",
              "&:hover": {
                bgcolor: "transparent",
              },
              [`&.${tabClasses.selected}`]: {
                color: "primary.plainColor",
                "&::after": {
                  height: 2,
                  borderTopLeftRadius: 3,
                  borderTopRightRadius: 3,
                  bgcolor: "primary.500",
                },
              },
            },
          }}

          // sx={{ borderBottom: "1px solid grey", borderRadius: "0px" }}
        >
          <Tab className="tabs-main">2W/3W</Tab>
          <Tab className="tabs-main">PCR</Tab>
          <Tab className="tabs-main">Truck/Bus</Tab>
          <Tab className="tabs-main">OTR</Tab>
          <Tab className="tabs-main">Farm</Tab>
        </TabList>
        <TabPanel value={0} className="tabsPanl-design">
          <div
            style={{ display: "flex", flexDirection: "column", gap: "15px" }}
          >
            {sets.map((set, index) => (
              <div
                style={{
                  display: "flex",
                  gap: "8px",
                  alignItems: "center",
                }}
              >
                <div key={index} className="table-panel">
                  <div className="brand-head">
                    <h5 style={{ width: "180px" }}>Select Brand</h5>
                    <h5 style={{ width: "180px" }}>Monthly Tyre Sales</h5>
                  </div>
                  <div className="brand-data">
                    <Select
                      value={set.brand}
                      onChange={(event, newValue) =>
                        handleBrandChange(index, newValue)
                      }
                      style={{ width: "180px" }}
                      disabled={
                        customerExist ===
                        "Successfully fetched Customer and branches"
                      }
                    >
                      {brands?.map((brand) => (
                        <Option
                          key={brand?.tyre_brand_id}
                          value={brand?.tyre_brand_name}
                        >
                          {brand?.tyre_brand_name}
                        </Option>
                      ))}
                    </Select>
                    <Input
                      sx={{ width: "180px" }}
                      className="input-count"
                      type="number"
                      readOnly={
                        customerExist ===
                        "Successfully fetched Customer and branches"
                      }
                      value={set.quantity}
                      onChange={(event) =>
                        handleCountChange(index, parseInt(event.target.value))
                      }
                    />
                  </div>
                </div>
                <button
                  className="add-icons-add-customerfor-tabs"
                  disabled={
                    customerExist ===
                    "Successfully fetched Customer and branches"
                  }
                >
                  {index === sets.length - 1 && (
                    <FontAwesomeIcon
                      onClick={handleAddSet}
                      icon={faPlus}
                      className={
                        customerExist ===
                        "Successfully fetched Customer and branches"
                          ? "add-disabled"
                          : "add-tabs"
                      }
                    />
                  )}
                </button>
              </div>
            ))}
          </div>
        </TabPanel>
        <TabPanel value={1} className="tabsPanl-design">
          <div
            style={{ display: "flex", flexDirection: "column", gap: "15px" }}
          >
            {setsPCR?.map((set, index) => (
              <div
                style={{
                  display: "flex",
                  gap: "8px",
                  alignItems: "center",
                }}
              >
                <div key={index} className="table-panel">
                  <div className="brand-head">
                    <h5 style={{ width: "180px" }}>Select Brand</h5>
                    <h5 style={{ width: "180px" }}>Monthly Tyre Sales</h5>
                  </div>
                  <div className="brand-data">
                    <Select
                      value={set.brand}
                      onChange={(event, newValue) =>
                        handleBrandChangePCR(index, newValue)
                      }
                      style={{ width: "180px" }}
                      disabled={
                        customerExist ===
                        "Successfully fetched Customer and branches"
                      }
                    >
                      {brands?.map((brand) => (
                        <Option
                          key={brand?.tyre_brand_id}
                          value={brand?.tyre_brand_name}
                        >
                          {brand?.tyre_brand_name}
                        </Option>
                      ))}
                    </Select>
                    <Input
                      sx={{ width: "180px" }}
                      className="input-count"
                      type="number"
                      readOnly={
                        customerExist ===
                        "Successfully fetched Customer and branches"
                      }
                      value={set.quantity}
                      onChange={(event) =>
                        handleCountChangePCR(
                          index,
                          parseInt(event.target.value)
                        )
                      }
                    />
                  </div>
                </div>
                <button
                  className="add-icons-add-customerfor-tabs"
                  disabled={
                    customerExist ===
                    "Successfully fetched Customer and branches"
                  }
                >
                  {index === setsPCR.length - 1 && (
                    <FontAwesomeIcon
                      onClick={handleAddSetPCR}
                      icon={faPlus}
                      className={
                        customerExist ===
                        "Successfully fetched Customer and branches"
                          ? "add-disabled"
                          : "add-tabs"
                      }
                    />
                  )}
                </button>
              </div>
            ))}
          </div>
        </TabPanel>

        <TabPanel value={2} className="tabsPanl-design">
          <div
            style={{ display: "flex", flexDirection: "column", gap: "15px" }}
          >
            {setsTruckBus?.map((set, index) => (
              <div
                style={{
                  display: "flex",
                  gap: "8px",
                  alignItems: "center",
                }}
              >
                <div key={index} className="table-panel">
                  <div className="brand-head">
                    <h5 style={{ width: "180px" }}>Select Brand</h5>
                    <h5 style={{ width: "180px" }}>Monthly Tyre Sales</h5>
                  </div>
                  <div className="brand-data">
                    <Select
                      value={set.brand}
                      onChange={(event, newValue) =>
                        handleBrandChangeTruckBus(index, newValue)
                      }
                      style={{ width: "180px" }}
                      disabled={
                        customerExist ===
                        "Successfully fetched Customer and branches"
                      }
                    >
                      {brands?.map((brand) => (
                        <Option
                          key={brand?.tyre_brand_id}
                          value={brand?.tyre_brand_name}
                        >
                          {brand?.tyre_brand_name}
                        </Option>
                      ))}
                    </Select>
                    <Input
                      sx={{ width: "180px" }}
                      className="input-count"
                      type="number"
                      readOnly={
                        customerExist ===
                        "Successfully fetched Customer and branches"
                      }
                      value={set.quantity}
                      onChange={(event) =>
                        handleCountChangeTruckBus(
                          index,
                          parseInt(event.target.value)
                        )
                      }
                    />
                  </div>
                </div>

                <button
                  className="add-icons-add-customerfor-tabs"
                  disabled={
                    customerExist ===
                    "Successfully fetched Customer and branches"
                  }
                >
                  {index === setsTruckBus.length - 1 && (
                    <FontAwesomeIcon
                      onClick={handleAddSetTruckBus}
                      icon={faPlus}
                      className={
                        customerExist ===
                        "Successfully fetched Customer and branches"
                          ? "add-disabled"
                          : "add-tabs"
                      }
                    />
                  )}
                </button>
              </div>
            ))}
          </div>
        </TabPanel>

        <TabPanel value={3} className="tabsPanl-design">
          <div
            style={{ display: "flex", flexDirection: "column", gap: "15px" }}
          >
            {setsOTR?.map((set, index) => (
              <div
                style={{
                  display: "flex",
                  gap: "8px",
                  alignItems: "center",
                }}
              >
                <div key={index} className="table-panel">
                  <div className="brand-head">
                    <h5 style={{ width: "180px" }}>Select Brand</h5>
                    <h5 style={{ width: "180px" }}>Monthly Tyre Sales</h5>
                  </div>
                  <div className="brand-data">
                    <Select
                      value={set.brand}
                      onChange={(event, newValue) =>
                        handleBrandChangeOTR(index, newValue)
                      }
                      style={{ width: "180px" }}
                      disabled={
                        customerExist ===
                        "Successfully fetched Customer and branches"
                      }
                    >
                      {brands?.map((brand) => (
                        <Option
                          key={brand?.tyre_brand_id}
                          value={brand?.tyre_brand_name}
                        >
                          {brand?.tyre_brand_name}
                        </Option>
                      ))}
                    </Select>
                    <Input
                      sx={{ width: "180px" }}
                      className="input-count"
                      type="number"
                      readOnly={
                        customerExist ===
                        "Successfully fetched Customer and branches"
                      }
                      value={set.quantity}
                      onChange={(event) =>
                        handleCountChangeOTR(
                          index,
                          parseInt(event.target.value)
                        )
                      }
                    />
                  </div>
                </div>
                <button
                  className="add-icons-add-customerfor-tabs"
                  disabled={
                    customerExist ===
                    "Successfully fetched Customer and branches"
                  }
                >
                  {index === setsOTR.length - 1 && (
                    <FontAwesomeIcon
                      onClick={handleAddSetOTR}
                      icon={faPlus}
                      className={
                        customerExist ===
                        "Successfully fetched Customer and branches"
                          ? "add-disabled"
                          : "add-tabs"
                      }
                    />
                  )}
                </button>
              </div>
            ))}
          </div>
        </TabPanel>

        <TabPanel value={4} className="tabsPanl-design">
          <div
            style={{ display: "flex", flexDirection: "column", gap: "15px" }}
          >
            {setsFarm?.map((set, index) => (
              <div
                style={{
                  display: "flex",
                  gap: "8px",
                  alignItems: "center",
                }}
              >
                <div key={index} className="table-panel">
                  <div className="brand-head">
                    <h5 style={{ width: "180px" }}>Select Brand</h5>
                    <h5 style={{ width: "180px" }}>Monthly Tyre Sales</h5>
                  </div>
                  <div className="brand-data">
                    <Select
                      value={set.brand}
                      onChange={(event, newValue) =>
                        handleBrandChangeFarm(index, newValue)
                      }
                      style={{ width: "180px" }}
                      disabled={
                        customerExist ===
                        "Successfully fetched Customer and branches"
                      }
                    >
                      {brands?.map((brand) => (
                        <Option
                          key={brand?.tyre_brand_id}
                          value={brand?.tyre_brand_name}
                        >
                          {brand?.tyre_brand_name}
                        </Option>
                      ))}
                    </Select>
                    <Input
                      sx={{ width: "180px" }}
                      className="input-count"
                      type="number"
                      readOnly={
                        customerExist ===
                        "Successfully fetched Customer and branches"
                      }
                      value={set.quantity}
                      onChange={(event) =>
                        handleCountChangeFarm(
                          index,
                          parseInt(event.target.value)
                        )
                      }
                    />
                  </div>
                </div>
                <button
                  className="add-icons-add-customerfor-tabs"
                  disabled={
                    customerExist ===
                    "Successfully fetched Customer and branches"
                  }
                >
                  {index === setsFarm.length - 1 && (
                    <FontAwesomeIcon
                      onClick={handleAddSetFarm}
                      icon={faPlus}
                      className={
                        customerExist ===
                        "Successfully fetched Customer and branches"
                          ? "add-disabled"
                          : "add-tabs"
                      }
                    />
                  )}
                </button>
              </div>
            ))}
          </div>
        </TabPanel>
      </Tabs>
    </div>
  );
};
