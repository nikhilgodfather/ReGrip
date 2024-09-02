import React, { useEffect, useState } from "react";
import { Input, Button } from "@mui/joy";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { API_URL } from "../../Config";
import CircularProgress from "@mui/joy/CircularProgress";

const AddMeetingPerson = ({
  getAllMeetingPersons,
  customerBranch,
  setOpenAddMeetingPersonModal,
  setEditMeetingPersonModal,
  editMeetingPersonData,
  getCustomerByPan,
  getCustomerById,
  shareCustomerId,
  shareBranchIdForAddingMeetingPerson,
  setAddModalMeeting,
}) => {



    
  console.log("shareCustomerId", shareCustomerId);
  console.log("shareBranchIdForAddingMeetingPerson", shareBranchIdForAddingMeetingPerson);
  const [loading, setLoading] = useState(false);

  const [showNameWarning, setShowNameWarning] = useState(false);
  const [showDesignationWarning, setShowDesignationWarning] = useState(false);
  const [showContactNumberWarning, setShowContactNumberWarning] =
    useState(false);

  const [meetingPersonId, setMeetingPersonId] = useState();
  const [name, setName] = useState("");
  const [designation, setDesignation] = useState("");
  const [email, setEmail] = useState("");
  const [contactNumber, setContactNumber] = useState(null);

  const handleSubmitButton = async () => {
    try {
      if (!name || !designation || !contactNumber) {
        !name && setShowNameWarning(true);
        !designation && setShowDesignationWarning(true);
        !contactNumber && setShowContactNumberWarning(true);
        return;
      }

      const data = {
        customer_branch_id: shareBranchIdForAddingMeetingPerson
          ? shareBranchIdForAddingMeetingPerson
          : customerBranch?.data?.customer_branch_id,
        meeting_persons: [
          {
            meeting_person_name: name,
            meeting_person_designation: designation,
            mobile_number: contactNumber,
            email: email,
          },
        ],
      };
      setLoading(true);

      if (editMeetingPersonData) {
        await axios.patch(
          `${API_URL}/meeting-person?meeting_person_id=${meetingPersonId}`,
          data.meeting_persons[0]
        );
      } else {
        await axios.post(`${API_URL}/meeting-person`, data);
      }

      setLoading(false);
      toast.success(
        editMeetingPersonData
          ? "Meeting Person Updated successfully"
          : "Meeting Person Added successfully",
        {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 2000,
        }
      );

      if (editMeetingPersonData) {
        setEditMeetingPersonModal(false);
        if (shareCustomerId) {
          getCustomerById(shareCustomerId);
        }
      } else if (shareBranchIdForAddingMeetingPerson) {
        setAddModalMeeting(false);
        getCustomerById(shareCustomerId);
      } else {
        setOpenAddMeetingPersonModal(false);
        await getAllMeetingPersons(customerBranch?.data?.customer_branch_id);
      }
    } catch (error) {
      console.error("Error Meeting Person:", error);
      setLoading(false);
      toast.error(
        editMeetingPersonData
          ? "Error While Updating Meeting Person"
          : "Error While Adding Meeting Person",
        {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 2000,
        }
      );
    }
  };

  useEffect(() => {
    if (editMeetingPersonData) {
      setMeetingPersonId(editMeetingPersonData.meeting_person_id);
      setName(editMeetingPersonData.meeting_person_name || "");
      setDesignation(editMeetingPersonData.meeting_person_designation || "");
      setEmail(editMeetingPersonData.email || "");
      setContactNumber(editMeetingPersonData.mobile_number || "");
    }
  }, [editMeetingPersonData]);

  return (
    <div className="addBranch-customer-main">
      <ToastContainer className="custom-toast-container" />

      <div className="scrolling-view">
        <div>
          <h3 style={{ fontSize: 20, color: "grey" }}>Add Meeting Person</h3>
        </div>

        <div
          className="field-align"
          style={{ display: "flex", flexDirection: "column", gap: "20px" }}
        >
          <div
            className="add-customer-field-container"
            style={{ width: "100%" }}
          >
            <h5>Name</h5>
            <Input
              style={{
                border: showNameWarning ? " 1px solid red" : " 1px solid #ccc",
                width: "100%",
              }}
              className="field-addBranch"
              placeholder="Enter Meeting Person Name"
              value={name}
              onChange={(event) => {
                setShowNameWarning(false);
                setName(event.target.value);
              }}
            />
          </div>

          <div
            className="add-customer-field-container"
            style={{ width: "100%" }}
          >
            <h5>Designation</h5>
            <Input
              style={{
                border: showDesignationWarning
                  ? " 1px solid red"
                  : " 1px solid #ccc",
                width: "100%",
              }}
              className="field-addBranch"
              placeholder="Enter Meeting Person Designation"
              value={designation}
              onChange={(event) => {
                setDesignation(event.target.value);
                setShowDesignationWarning(false);
              }}
            />
          </div>

          <div
            className="add-customer-field-container"
            style={{ width: "100%" }}
          >
            <h5>Contact Number</h5>
            <Input
              style={{
                border: showContactNumberWarning
                  ? " 1px solid red"
                  : " 1px solid #ccc",
                width: "100%",
              }}
              className="field-addBranch"
              placeholder="Enter Contact Number"
              type="number"
              value={contactNumber}
              onChange={(event) => {
                setContactNumber(event.target.value);
                setShowContactNumberWarning(false);
              }}
            />
          </div>
          <div
            className="add-customer-field-container"
            style={{ width: "100%" }}
          >
            <h5>Email</h5>
            <Input
              style={{ width: "100%" }}
              className="field-addBranch"
              placeholder="Enter Meeting Person Email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
              }}
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
          {editMeetingPersonData ? (
            <>
              {loading ? (
                <Button className="addBranch-btn">
                  <CircularProgress variant="solid" />
                </Button>
              ) : (
                <Button
                  className="addBranch-btn"
                  onClick={() => handleSubmitButton()}
                >
                  Edit Meeting Person
                </Button>
              )}
            </>
          ) : (
            <>
              {loading ? (
                <Button className="addBranch-btn">
                  <CircularProgress variant="solid" />
                </Button>
              ) : (
                <Button
                  className="addBranch-btn"
                  onClick={() => handleSubmitButton()}
                >
                  Add Meeting Person
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddMeetingPerson;
