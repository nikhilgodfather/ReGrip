    import { GET_DEFECT_TYPES } from "../constants/Constant";

    export const getDefectTypesReducer = (state = { defects: {} }, action) => {
        // console.log("dd",action.payload)
        switch (action.type) {
            case GET_DEFECT_TYPES:
                return {
                    defects: action.payload
                }
            default:
                return state;
        }
    }