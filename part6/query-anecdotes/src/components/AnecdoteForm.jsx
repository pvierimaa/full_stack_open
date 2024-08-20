import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createAnecdote } from '../requests'
import { useNotificationDispatch } from '../NotificationContext'

const AnecdoteForm = () => {
  const queryClient = useQueryClient()
  const dispatch = useNotificationDispatch()

  const newAnecdoteMutation = useMutation({ 
    mutationFn: createAnecdote,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
        dispatch({
        type: 'setNotification',
        payload: `anecdote '${data.content}' added`
      })
      setTimeout(() => {
        dispatch({
          type: 'clearNotification',
          payload: []
        })
      }, 5000)
    },
    onError: (error) => {
        dispatch({
        type: 'setNotification',
        payload: `too short anecdote, must have at least 5 or more`,
      })
      setTimeout(() => {
        dispatch({
          type: 'clearNotification',
          payload: []
        })
      }, 5000)
    }
   })

  const onCreate = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    newAnecdoteMutation.mutate({ content, votes: 0 })
  }

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name='anecdote' />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
