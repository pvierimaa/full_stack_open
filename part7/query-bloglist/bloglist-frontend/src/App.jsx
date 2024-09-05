import loginService from './services/login'
import blogService from './services/blogs'
import userService from './services/users'
import Notification from './components/Notification'
import Blog from './components/Blog'
import BlogDetails from './components/BlogDetails'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import User from './components/User'
import Users from './components/Users'
import Menu from './components/Menu'
import UserContext from './UserContext'
import { useEffect, useRef, useContext } from 'react'
import { useNotificationDispatch } from './NotificationContext'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Routes, Route } from 'react-router-dom'
import {
  Container,
  Button,
  TextField,
  Paper,
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
} from '@mui/material'

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

  const addCommentMutation = useMutation({
    mutationFn: ({ id, comment }) => blogService.addComment(id, comment),
    onSuccess: () => {
      queryClient.invalidateQueries(['blogs'])
    },
  })

  const result = useQuery({
    queryKey: ['blogs'],
    queryFn: blogService.getAll,
  })

  const result_users = useQuery({
    queryKey: ['users'],
    queryFn: userService.getAll,
  })

  if (result.isLoading) {
    return <div>loading data...</div>
  }

  if (result.isError) {
    return <div>blog service not available due to problems in server</div>
  }

  const blogs = result.data

  if (result_users.isLoading) {
    return <div>loading data...</div>
  }

  if (result_users.isError) {
    return <div>blog service not available due to problems in server</div>
  }

  const users = result_users.data

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

  const handleAddComment = (id, comment) => {
    addCommentMutation.mutate({ id, comment })
  }

  const sortedBlogs = [...blogs].sort((a, b) => {
    return b.likes - a.likes
  })

  if (user === null) {
    return (
      <Container>
        <div>
          <h2>Log in to application</h2>
          <Notification />
          <form onSubmit={handleLogin}>
            <div>
              <TextField
                label="username"
                data-testid="username"
                type="text"
                name="username"
              />
            </div>
            <div>
              <TextField
                label="password"
                data-testid="password"
                type="password"
                name="password"
              />
            </div>
            <Button variant="contained" color="primary" type="submit">
              login
            </Button>
          </form>
        </div>
      </Container>
    )
  }

  return (
    <Container>
      <div>
        <div>
          <Menu user={user.name} handleLogout={handleLogout} />
          <h1>blog app</h1>
          <Notification />
        </div>
        <div>
          <Routes>
            <Route path="/users/:id" element={<User users={users} />} />
            <Route path="/users" element={<Users users={users} />} />
            <Route
              path="/blogs/:id"
              element={
                <BlogDetails
                  blogs={blogs}
                  user={user.name}
                  onDelete={handleDeleteBlog}
                  onLike={handleLikeBlog}
                  addComment={handleAddComment}
                />
              }
            />
            <Route
              path="/"
              element={
                <div>
                  <Togglable buttonLabel="create new" ref={blogFormRef}>
                    <BlogForm createBlog={addBlog} />
                  </Togglable>
                  <TableContainer component={Paper}>
                    <Table>
                      <TableBody>
                        {sortedBlogs.map((blog) => (
                          <TableRow key={blog.id}>
                            <TableCell>
                              <Blog key={blog.id} blog={blog} />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </div>
              }
            />
          </Routes>
        </div>
      </div>
    </Container>
  )
}

export default App
