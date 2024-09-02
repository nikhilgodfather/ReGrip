import { GET_CURRENT_USER_DETAILS } from "../constants/Constant";

export const getCurrentUserReducer = (state = {  }, action) => {
    // console.log("Reducerdata", action.payload)

    switch (action.type) {
        case GET_CURRENT_USER_DETAILS:
            return action.payload;
        
        default:
            return state;
    }
}