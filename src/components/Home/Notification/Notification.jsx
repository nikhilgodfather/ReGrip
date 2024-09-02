import React, { useEffect, useState } from "react";
import "./Notification.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { API_URL } from "../../Config";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

const Notification = ({
  setShowNotificationPopup,
  notifications,
  getAllNotificationsData,
}) => {
  const [notifications_Id, setNotifications_Id] = useState([]);

  const handleMarkAllAsRead = async () => {
    try {
      const data = {
        notification_ids: notifications_Id,
      };
      await axios.patch(
        `${API_URL}/inspection-assignments/notifications`,
        data
      );
      setShowNotificationPopup(false);
      toast.success("Marked All Read As", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 2000,
      });
      getAllNotificationsData();
    } catch (error) {
      toast.error("Error while marking all read as", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 2000,
      });
    }
  };

  useEffect(() => {
    const ids = notifications.map(
      (notification) => notification.notification_id
    );
    setNotifications_Id(ids);
  }, [notifications]);

  return (
    <div className="notification-box">
      <ToastContainer />
      <button
        className="mark-icon-notification"
        onClick={() => setShowNotificationPopup(false)}
      >
        <FontAwesomeIcon className="icon-mark" icon={faXmark} />
      </button>
      <h2>Notifications</h2>

      {notifications?.length === 0 ? (
        <div className="notification-empty">
          <p>No Notifications</p>
        </div>
      ) : (
        <div className="messages-popup-content">
          {notifications?.map((notification) => (
            <div className="notification-list">
              <p>{notification?.message}</p>
            </div>
          ))}
        </div>
      )}

      {notifications?.length !== 0 && (
        <button
          className="button-mark-read"
          onClick={() => handleMarkAllAsRead()}
        >
          Mark all as read
        </button>
      )}
    </div>
  );
};

export default Notification;
