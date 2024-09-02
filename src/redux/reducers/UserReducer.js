import { GET_USER_DETAILS } from "../constants/Constant"

export const getUserDetailsReducer = (state = { users: {} }, action) => {
    // console.log('userss',action.payload)
    switch (action.type){
        case GET_USER_DETAILS:
            return{
                users:action.payload
            }
        default:
            return state
    }
}