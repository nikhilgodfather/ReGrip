import { GET_USER_DETAILS } from "../constants/Constant";

export const getUserDetails = (data) => {
    return {
        type: GET_USER_DETAILS,
        payload: data
    }
}

