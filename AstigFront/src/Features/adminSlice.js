import { createSlice } from '@reduxjs/toolkit'

export const adminSlice = createSlice({
  name: 'admin',
  initialState:{ hasAdmin : false, adminData : null},
  reducers: {
    adminSign: (state, action) => {
      state.hasAdmin = true
      state.adminData = action.payload
    },
    adminOut: (state) => {
      state.hasAdmin = false
      state.adminData = null
      localStorage.removeItem("adminData")
    }
  },
})

// Action creators are generated for each case reducer function
export const { adminSign, adminOut } = adminSlice.actions

export default adminSlice.reducer