import { createSlice } from '@reduxjs/toolkit'

export const uiSlice = createSlice({
  name: 'UI',
  initialState: {
    notifier : {
        state : false,
        title: "",
        message: "",
        onAccept : () => {},
        acceptBtnText : "",
        cancelBtnText : ""
    },
    inputModal : {
      state : false,
      title : "",
      component : (<></>),
      onAccept : () => {},
      acceptBtnText : "",
      cancelBtnText : ""
    },
    loader : {
      state : false,
      message : ""
    },
    alertModal : {
      state : false,
      component : (<></>),
      data : {}
    }
  },
  reducers: {
    openNotifier : (state, action) => {
      state.notifier = {
          state : true,
          message : action.payload.message,
          title : action.payload.title,
          onAccept : action.payload.onAccept,
          acceptBtnText : action.payload.acceptBtnText,
          cancelBtnText : action.payload.cancelBtnText
      }
    },
    closeNotifier : (state) => {
      state.notifier.state = false
    },
    openInputModal : (state, action) =>{
      state.inputModal ={
        state : true,
        title : action.payload.title,
        component : action.payload.component,
        onAccept : action.payload.onAccept,
        acceptBtnText : action.payload.acceptBtnText,
        cancelBtnText : action.payload.cancelBtnText
      }
    },
    closeInputModal : (state) =>{
      state.inputModal.state = false
    },
    openLoader : (state, action) =>{
      state.loader = action.payload
    },
    closeLoader : (state)=>{
      state.loader.state = false
    },openAlertModal : (state, action) =>{
      state.alertModal = {
        state : true,
        component : action.payload.component,
        data : action.payload.data
      }
    },
    closeAlertModal : (state)=>{
      state.alertModal = {
        ...state.alertModal,
        state : false
      }
    }
  },
})

// Action creators are generated for each case reducer function
export const { openAlertModal, closeAlertModal, openNotifier, closeNotifier, openInputModal, closeInputModal, openLoader, closeLoader } = uiSlice.actions

export default uiSlice.reducer