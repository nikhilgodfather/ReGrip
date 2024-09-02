import { UPDATE_NOTIFICATION_COUNT } from "../constants/Constant";

export const updateNotificationCount = (count) => ({
    type: UPDATE_NOTIFICATION_COUNT,
    payload: count,
  });