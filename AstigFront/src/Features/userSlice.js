import { createSlice } from '@reduxjs/toolkit'


export const userSlice = createSlice({
  name: 'user',
  initialState:{ hasUser : false, userData : null},
  reducers: {
    signin: (state, action) => {
      state.hasUser = true
      state.userData = action.payload
    },
    signout: (state) => {
      state.hasUser = false
      state.userData = null
      localStorage.removeItem("userData")
      localStorage.removeItem("access_token")
    },
    setCart : (state, action) => {
      state.userData.cart = action.payload 
    },
    addToCart : (state, action) =>  {
      state.userData.cart.items = [ ...state.userData.cart, action.payload ]
    }
  },
})

// Action creators are generated for each case reducer function
export const { signin, signout, setCart, addToCart } = userSlice.actions

export default userSlice.reducer