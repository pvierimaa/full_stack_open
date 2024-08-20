import { createSlice } from '@reduxjs/toolkit'
 
const initialState = null  

  const notificationSlice = createSlice({
    name: 'notification',
    initialState,
    reducers: {
      messageNotification(state, action) {
        const content = action.payload
        return content
      },
      clearNotification() {
        return null
      },
    }    
  })

export const setNotification = (content, timeout) => {
  return async dispatch => {
    dispatch(messageNotification(content))

    setTimeout(() => {
      dispatch(clearNotification())
    }, timeout * 1000)
  }
}    

export const { messageNotification, clearNotification } = notificationSlice.actions
export default notificationSlice.reducer