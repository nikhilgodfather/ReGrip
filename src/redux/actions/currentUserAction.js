import { GET_CURRENT_USER_DETAILS } from "../constants/Constant";

export const getCurrentUserDetails = (data) => {
    return {
        type: GET_CURRENT_USER_DETAILS,
        payload: data
    }
  
}
