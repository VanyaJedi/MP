import { configureStore } from '@reduxjs/toolkit'
import { useDispatch } from 'react-redux'
import rootReducer from '../reducers/reducer';

const store = configureStore<any, any, any>({
  reducer: rootReducer
})

export type AppDispatch = typeof store.dispatch
const useAppDispatch = () => useDispatch<AppDispatch>();
export default useAppDispatch;