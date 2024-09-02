import { GET_DEFECT_TYPES } from "../constants/Constant";

export const getDefectTypes = (data) => {
    return {
        type: GET_DEFECT_TYPES,
        payload: data
    }
}