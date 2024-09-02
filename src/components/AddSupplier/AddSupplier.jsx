import React, { useState } from "react";
import "./AddSupplier.css";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { API_URL } from '../Config/index';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Select from 'react-select';
import country_data from '../../assets/country.json'

const AddSupplier = ({
  setShowForm,
  editSupplierData,
  setEditSupplierData,
  supplierId,
  accountHolderName,
  setAccountHolderName,
  setAccountNumber,
  accountNumber,
  setIfscCode,
  ifscCode,
  setBankName,
  bankName,
  onClose,
}) => {
  const [showGST, setShowGST] = useState(false);
  const [showBankDetails, setShowBankDetails] = useState(false);
  const [isValidPhoneNumber, setIsValidPhoneNumber] = useState(true);
  const [validSupplierName, setIsValidSupplierName] = useState(true);
  const [validPersonName, setIsValidPersonName] = useState(true);
  const [validStateName, setIsValidStateName] = useState(true);
  const [validCityName, setIsValidCityName] = useState(true);
  const [validPincodeNum, setIsValidPincodeNum] = useState(true);
  const [supplierName, setSupplierName] = useState(
    editSupplierData?.supplier_name || ""
  );
  const [personName, setPersonName] = useState(
    editSupplierData?.person_name || ""
  );
  const [mobileNumber, setMobileNumber] = useState(
    editSupplierData?.mobile_number || ""
  );
  const [city, setCity] = useState(editSupplierData?.city || "");
  const [state, setState] = useState(editSupplierData?.state || "");
  const [pincode, setPincode] = useState(editSupplierData?.pincode || "");
  const [gstNo, setGstNo] = useState(editSupplierData?.gstno || "");

  const [cities, setCities] = useState([])
  const states = country_data.state.map((i) => ({ value: i.name, label: i.name }))

  const formFields = [
    "supplier_name",
    "person_name",
    "mobile_number",
    "gstno",
    "city",
    "state",
    "pincode",
    "account_holder_name",
    "bank_name",
    "account_number",
    "ifsc_code",
  ];

  // const API_URL = "http://localhost:3001/api/supplier";
  // const API_URL = "http://35.154.105.171/api/supplier";

  //handle successor when from submit or update successfully
  const handleSuccess = () => {
    // alert("Supplier operation successful!");
    // window.location.reload();
    // changeModalState()

    setShowForm(false);
  };

  //handle error when from submit or update unsuccessfully
  const handleError = (error) => {
    // alert("An error occurred while performing the operation.");
    console.error(error);
  };

  //Add supplier form handler
  const addSupplier = async (send_data) => {
    try {
      const response = await axios.post(
        `${API_URL}/supplier/postdata`,
        send_data
      );
      if (response.status === 200) {
        handleSuccess();
        console.log("supplier added successfully", response.message);
        changeModalState();
        onClose("supplier Added Successfully.");
      } else {
        handleError();
      }
    } catch (error) {
      toast.error(error.response.data.message, {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 3000,
      })
      handleError(error);
    }
  };

  //update supplier form handler
  const updateSupplier = async (update_data) => {
    try {
      const response = await axios.put(
        `${API_URL}/supplier/updatedata?supplierId=${supplierId}`,
        update_data
      );
      if (response.status === 200) {
        handleSuccess();
        console.log("supplier updated successfully", response.message);
        changeModalState();
        onClose("supplier updated Successfully.");
      } else {
        handleError();
        toast.error("supplier name already exist", {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 3000,
        });
      }
    } catch (error) {
      handleError(error);
    }
  };

  const submitForm = async (e) => {
    e.preventDefault();
    let hasError = false
    if (!editSupplierData) {
      const send_data = {};
      formFields.forEach((field) => {
        const element = e.target[field];
        if (element) {
          send_data[field] = element.value;
        }
      });
      if (!showGST) {
        send_data.gstno = "";
      }

      if (!showBankDetails) {
        send_data.account_holder_name = "";
        send_data.account_number = "";
        send_data.bank_name = "";
        send_data.ifsc_code = "";
      }

      if (!mobileNumber || mobileNumber.length !== 10) {
        setIsValidPhoneNumber(false);
        hasError = true;
      }
      if (supplierName.length === 0) {
        setIsValidSupplierName(false)
        hasError = true;
      }
      if (personName.length === 0) {
        setIsValidPersonName(false)
        hasError = true;
      }
      if (city.length === 0) {
        setIsValidCityName(false)
        hasError = true;
      }
      if (state.length === 0) {
        setIsValidStateName(false)
        hasError = true;
      }
      if (pincode.length === 0) {
        setIsValidPincodeNum(false)
        hasError = true;
      }
      if (hasError) {
        return;
      }
      await addSupplier(send_data);
    }

    else {
      const update_data = {};
      formFields.forEach((field) => {
        const element = e.target[field];
        if (element) {
          update_data[field] = element.value;
        }
      });
      if (!showGST) {
        update_data.gstno = gstNo;
      }
      if (!showBankDetails) {
        update_data.account_holder_name = accountHolderName;
        update_data.account_number = accountNumber;
        update_data.ifsc_code = ifscCode;
        update_data.bank_name = bankName;
      }

      if (!mobileNumber) {
        setIsValidPhoneNumber(false);
        hasError = true;
      }
      if (supplierName.length === 0) {
        setIsValidSupplierName(false)
        hasError = true;
      }
      if (personName.length === 0) {
        setIsValidPersonName(false)
        hasError = true;
      }
      if (city.length === 0) {
        setIsValidCityName(false)
        hasError = true;
      }
      if (state.length === 0) {
        setIsValidStateName(false)
        hasError = true;
      }
      if (pincode.length === 0) {
        setIsValidPincodeNum(false)
        hasError = true;
      }
      if (hasError) {
        return;
      }
      await updateSupplier(update_data);
    }
  };

  const handleCheckboxChange = () => {
    setShowGST(!showGST);
    setGstNo("")
  };

  const handleCheckboxBankChange = () => {
    setShowBankDetails(!showBankDetails);
    setAccountHolderName("")
    setAccountNumber()
    setBankName("")
    setIfscCode()
  };

  function changeModalState() {
    setShowForm(false);
    setEditSupplierData(null);
    setSupplierName("");
    setPersonName("");
    setMobileNumber("");
    setCity("");
    setState("");
    setPincode("");
    setGstNo("");
    setAccountHolderName("");
    setAccountNumber("");
    setIfscCode("");
    setBankName("");
  }

  // Get City and State from Pincode 
  const getLocation = async (pin) => {
    try {
      setPincode(pin)
      if (pin.length < 6) {
        return;
      }
      const result = await axios.get(`https://api.postalpincode.in/pincode/${pin}`)
      if (result) {
        setCity(result.data[0].PostOffice[0].District)
        setState(result.data[0].PostOffice[0].State)
      }
    }
    catch (e) {
      console.log("Error:", e.message)
    }
  }

  const getCities = (s) => {
    const stateInfo = country_data.state.find((state) => state.name === s);
    if (stateInfo) {
      const temp_city = stateInfo ? stateInfo.city.map((city) => ({ value: city.name, label: city.name })) : [];
      setCities(temp_city)
    }
  }

  return (
    <div className="modal-main-div">
      <div className="addsupplier-container">
        <div className="addSupplier-head">
          <div className="heading">
            <h2>{editSupplierData ? "Update Supplier" : "Add Supplier"}</h2>
          </div>
          <div className="close-btn">
            <button onClick={changeModalState}>
              <FontAwesomeIcon icon={faXmark} style={{ color: "#ffffff" }} />
            </button>
          </div>
        </div>
        <form action="" className="addsupplier-form" onSubmit={submitForm}>
          <input type="hidden" name="supplier_id" value={supplierId} />

          <div className="addsupplier-form-input">
            <label htmlFor="supplierName">Supplier Name</label>
            <input
              type="text"
              name="supplier_name"
              id="supplierName"
              value={supplierName}
              onChange={(e) => {
                setSupplierName(e.target.value)
                setIsValidSupplierName(true)
              }
              }
            />
            {!validSupplierName &&
              (<div style={{
                color: 'red', margin: '5px 0px 0px 5px', position: "absolute", fontSize: 12, top: 55
              }}>
                Please enter the Supplier Name.
              </div>)}
          </div>
          <div className="addsupplier-form-input">
            <label htmlFor="personName">Person Name</label>
            <input
              type="text"
              name="person_name"
              id="personName"
              value={personName}
              onChange={(e) => {
                setIsValidPersonName(true)
                setPersonName(e.target.value)
              }}
            />
            {!validPersonName &&
              (<div style={{
                color: 'red', margin: '5px 0px 0px 5px', position: "absolute", fontSize: 12, top: 55
              }}>
                Please enter the Person Name.
              </div>)}
          </div>
          <div className="addsupplier-form-input">
            <label htmlFor="mobileNo">Mobile Number</label>
            <input
              type="text"
              name="mobile_number"
              id="mobileNo"
              value={mobileNumber}
              onChange={(e) => {
                setMobileNumber(e.target.value)
                setIsValidPhoneNumber(true)
              }}
            />
            {!isValidPhoneNumber &&
              (<div style={{
                color: 'red', margin: '5px 0px 0px 5px', position: "absolute", fontSize: 12, top: 55
              }}>
                Please enter a Phone Number.
              </div>)}
          </div>
          <div className="addsupplier-form-input">
            <label htmlFor="pincode">Pincode</label>
            <input
              type="text"
              name="pincode"
              id="pincode"
              value={pincode}
              onChange={(e) => {
                getLocation(e.target.value)
                setIsValidPincodeNum(true)
              }}
            />
            {!validPincodeNum &&
              (<div style={{
                color: 'red', margin: '5px 0px 0px 5px', position: "absolute", fontSize: 12, top: 55
              }}>
                Please enter the pincode number.
              </div>)}
          </div>
          <div className="addsupplier-form-input">
            <label htmlFor="state">State</label>
            <Select
              className="selector"
              name="state"
              options={states}
              value={{ value: state, label: state }}
              onChange={(e) => {
                setState(e.value)
                setCity("")
                getCities(e.value)
                setIsValidStateName(true)
              }}
            />
            {!validStateName &&
              (<div style={{
                color: 'red', margin: '5px 0px 0px 5px', position: "absolute", fontSize: 12, top: 55
              }}>
                Please enter the state Name.
              </div>)}
          </div>
          <div className="addsupplier-form-input">
            <label htmlFor="city">City</label>
            <Select
              className="selector"
              name="city"
              options={cities}
              value={{ value: city, label: city }}
              onChange={(e) => {
                setCity(e.value)
                setIsValidCityName(true)
              }}
            />
            {!validCityName &&
              (<div style={{
                color: 'red', margin: '5px 0px 0px 5px', position: "absolute", fontSize: 12, top: 55
              }}>
                Please enter the city name.
              </div>)}
          </div>
          {/* show gst check box */}
          <div className="addsupplier-form-input">
            <div className="chk-inp">
              <input
                type="checkbox"
                id="gst-checkbox"
                checked={showGST}
                onChange={handleCheckboxChange}
              />
              <label htmlFor="GSTNo">
                {editSupplierData
                  ? "Want to update GST number? "
                  : "Want to enter GST number?"}
              </label>
            </div>
            {showGST && (
              <div className="addsupplier-form-input">
                <input
                  type="text"
                  name="gstno"
                  id="GSTNo"
                  value={gstNo}
                  onChange={(e) => setGstNo(e.target.value)}
                />
              </div>
            )}
          </div>
          {/* Bank details Check box */}
          <div className="addsupplier-form-input">
            <div className="chk-inp-2">
              <input
                type="checkbox"
                id="bank-details-checkbox"
                checked={showBankDetails}
                onChange={handleCheckboxBankChange}
              />
              <label htmlFor="bank-details">
                {editSupplierData
                  ? "Want to update bank details?"
                  : "Want to enter bank details?"}
              </label>
            </div>
            {showBankDetails && (
              <>
                <div className="addsupplier-form-input">
                  <label htmlFor="AccountHolderName">Account holder name</label>
                  <input
                    type="text"
                    name="account_holder_name"
                    id="account_holder_name"
                    value={accountHolderName}
                    onChange={(e) => setAccountHolderName(e.target.value)}
                  />
                </div>
                <div className="addsupplier-form-input">
                  <label htmlFor="bank_name">Bank name</label>
                  <input
                    type="text"
                    name="bank_name"
                    id="bank_name"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                  />
                </div>
                <div className="addsupplier-form-input">
                  <label htmlFor="accountNumber">Account number</label>
                  <input
                    type="text"
                    name="account_number"
                    id="account_number"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                  />
                </div>
                <div className="addsupplier-form-input">
                  <label htmlFor="ifscCode">IFSC code</label>
                  <input
                    type="text"
                    name="ifsc_code"
                    id="ifsc_code"
                    value={ifscCode}
                    onChange={(e) => setIfscCode(e.target.value)}
                  />
                </div>
              </>
            )}
          </div>
          <button type="submit" className="addSupplier-submit-btn">
            {editSupplierData ? "Update" : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddSupplier;
