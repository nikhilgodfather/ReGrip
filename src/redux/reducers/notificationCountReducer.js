import { UPDATE_NOTIFICATION_COUNT } from "../constants/Constant";

const initialState = {
  notificationCount: 0,
};

export const notificationReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_NOTIFICATION_COUNT:
      return {
        ...state,
        notificationCount: action.payload,
      };
    default:
      return state;
  }
};

