import { createSlice } from '@reduxjs/toolkit'
 
const initialState = ''  

  const filterSlice = createSlice({
    name: 'filter',
    initialState,
    reducers: {
      filterAnecdote(state, action) {
        const content = action.payload
        return content
      }
    }    
  })

export const { filterAnecdote } = filterSlice.actions
export default filterSlice.reducer