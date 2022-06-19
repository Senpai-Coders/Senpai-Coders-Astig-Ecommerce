import { createSlice } from '@reduxjs/toolkit'

export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    registration : {},
    signin : {},
    recovery : {}
  },
  reducers: {
    partialRegistration : (state, action) => {
      state.registration = action.payload
    },
    finalRegistration : (state, action) => {
      state.registration = {
          ...state.registration,
          confirmation_code : action.payload.confirmation_code
      }
    },
    cleanRegistration : (state) =>{
      state.registration = {}
    },
    setSignInCredential : (state, action) => {
      state.signin = action.payload
    },
    setSignInTwoFactor : (state, action ) =>{
      state.signin = {
        ...state.signin,
        twoFactCode : action.payload.twoFactCode
      }
    },
    cleanSignInCredential : (state) =>{ state.signin = {}},
    setRecoveryAccount : (state, action) =>{
      state.recovery = action.payload
    },
    setRecoveryCode : (state, action) =>{
      state.recovery = {
        ...state.recovery,
        recovery_code : action.payload.recovery_code
      }
    },
    clearRecovery : (state) => {
      state.recovery = {}
    }
  },
})

// Action creators are generated for each case reducer function
export const { setRecoveryAccount, setRecoveryCode, clearRecovery ,setSignInCredential, setSignInTwoFactor, cleanSignInCredential ,partialRegistration, finalRegistration, cleanRegistration } = authSlice.actions

export default authSlice.reducer