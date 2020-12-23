import { combineReducers } from '@reduxjs/toolkit'
import { connectionsReducer } from './slices'

const reducers = combineReducers({
  connectionsReducer,
})

export { reducers }
