import loginService from './services/login'
import { useEffect, useRef, useContext } from 'react'
import Notification from './components/Notification'
import Blog from './components/Blog'
import blogService from './services/blogs'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import { useNotificationDispatch } from './NotificationContext'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import UserContext from './UserContext'

const App = () => {
  const blogFormRef = useRef()
  const notificationDispatch = useNotificationDispatch()
  const queryClient = useQueryClient()
  const [user, userDispatch] = useContext(UserContext)

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      userDispatch({
        type: 'setUser',
        payload: user,
      })
      blogService.setToken(user.token)
    }
  }, [userDispatch])

  const handleLogin = async (event) => {
    event.preventDefault()
    const username = event.target.username.value
    const password = event.target.password.value
    event.target.username.value = ''
    event.target.password.value = ''
    try {
      const user = await loginService.login({
        username,
        password,
      })
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      userDispatch({
        type: 'setUser',
        payload: user,
      })
      blogService.setToken(user.token)
    } catch (exception) {
      notificationDispatch({
        type: 'setNotification',
        payload: 'wrong username or password',
      })
      setTimeout(() => {
        notificationDispatch({
          type: 'clearNotification',
          payload: [],
        })
      }, 5000)
    }
  }

  const handleLogout = (event) => {
    event.preventDefault()
    window.localStorage.removeItem('loggedBlogappUser')
    userDispatch({
      type: 'clearUser',
    })
  }

  const addBlogMutation = useMutation({
    mutationFn: blogService.create,
    onSuccess: (returnedBlog) => {
      queryClient.invalidateQueries(['blogs'])
      notificationDispatch({
        type: 'setNotification',
        payload: `a new blog ${returnedBlog.title} by ${returnedBlog.author} added`,
      })
      setTimeout(() => {
        notificationDispatch({
          type: 'clearNotification',
          payload: [],
        })
      }, 5000)
    },
  })

  const deleteBlogMutation = useMutation({
    mutationFn: blogService.deleteBlog,
    onSuccess: () => {
      queryClient.invalidateQueries(['blogs'])
    },
  })

  const likeBlogMutation = useMutation({
    mutationFn: ({ id, blog }) =>
      blogService.likeBlog(id, { ...blog, likes: blog.likes + 1 }),
    onSuccess: () => {
      queryClient.invalidateQueries(['blogs'])
    },
  })

  const result = useQuery({
    queryKey: ['blogs'],
    queryFn: blogService.getAll,
  })

  if (result.isLoading) {
    return <div>loading data...</div>
  }

  if (result.isError) {
    return <div>blog service not available due to problems in server</div>
  }

  const blogs = result.data

  const addBlog = (blogObject) => {
    blogFormRef.current.toggleVisibility()
    addBlogMutation.mutate(blogObject)
  }

  const handleDeleteBlog = (id, title, author) => {
    if (window.confirm(`Remove blog ${title} by ${author}`)) {
      deleteBlogMutation.mutate(id)
    }
  }

  const handleLikeBlog = (id, blog) => {
    likeBlogMutation.mutate({ id, blog })
  }

  const sortedBlogs = [...blogs].sort((a, b) => {
    return b.likes - a.likes
  })

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification />
        <form onSubmit={handleLogin}>
          <div>
            username
            <input data-testid="username" type="text" name="username" />
          </div>
          <div>
            password
            <input data-testid="password" type="password" name="password" />
          </div>
          <button type="submit">login</button>
        </form>
      </div>
    )
  }

  return (
    <div>
      <div>
        <h2>blogs</h2>
        <Notification />
        {user.name} logged in
        <button onClick={handleLogout}>logout</button>
      </div>
      <div>
        <Togglable buttonLabel="create new blog" ref={blogFormRef}>
          <BlogForm createBlog={addBlog} />
        </Togglable>
        {sortedBlogs.map((blog) => (
          <Blog
            key={blog.id}
            blog={blog}
            user={user.name}
            onDelete={handleDeleteBlog}
            onLike={handleLikeBlog}
          />
        ))}
      </div>
    </div>
  )
}

export default App
