import {combineReducers} from 'redux'
import { getUserDetailsReducer } from './reducers/UserReducer'
import { configureStore } from '@reduxjs/toolkit'
import { getDefectTypesReducer } from './reducers/DefectReducer'
import { getCurrentUserReducer } from './reducers/currentUserReducer'
import {notificationReducer }from './reducers/notificationCountReducer'

const rootReducer = combineReducers({
    getUserDetails: getUserDetailsReducer,
    getDefectTypes: getDefectTypesReducer,
    getCurrentUser: getCurrentUserReducer,
    get:notificationReducer
})

export const store = configureStore({
    reducer: rootReducer,
  })