import { createSlice } from '@reduxjs/toolkit'
import anecdoteService from '../services/anecdotes'

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    appendAnecdote(state, action) {
      state.push(action.payload)
    },
    updateAnecdote(state, action) {
      const index = state.findIndex(anecdote => anecdote.id === action.payload.id)
      state[index] = action.payload
    },  
    setAnecdotes(state, action) {
      return action.payload
    }
  }
})

export const { appendAnecdote, updateAnecdote, setAnecdotes } = anecdoteSlice.actions

export const initializeNotes = () => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll()
    dispatch(setAnecdotes(anecdotes))
  }
}

export const createAnecdote = content => {
  return async dispatch => {
    const newNote = await anecdoteService.createNew(content)
    dispatch(appendAnecdote(newNote))
  }
}

export const voteAnecdote = (id, anecdote) => {
  const changedAnecdote = {
      ...anecdote,
      votes: anecdote.votes + 1
    }
  console.log(changedAnecdote, id)  
  return async dispatch => {
    const updatedAnecdote = await anecdoteService.update(id, changedAnecdote)
    dispatch(updateAnecdote(updatedAnecdote))
  }
}

export default anecdoteSlice.reducer