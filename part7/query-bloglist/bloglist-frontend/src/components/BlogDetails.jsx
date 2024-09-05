import RemoveButton from './RemoveButton'
import { useParams } from 'react-router-dom'
import {
  TableContainer,
  Paper,
  Table,
  TableBody,
  TableRow,
  Button,
  TextField,
} from '@mui/material'

const BlogDetails = ({ blogs, onDelete, user, onLike, addComment }) => {
  const id = useParams().id
  const blog = blogs.find((b) => b.id === id)

  if (!blog) {
    return null
  }

  const handleAddComment = (event) => {
    event.preventDefault()
    const comment = event.target.comment.value
    event.target.comment.value = ''
    addComment(blog.id, comment)
  }

  return (
    <div data-testid="blog-details">
      <TableContainer component={Paper}>
        <Table>
          <TableBody>
            <TableRow>
              <h2>
                {blog.title} {blog.author}
              </h2>
            </TableRow>
            <TableRow>
              <a href={blog.url}>{blog.url}</a> <br />
            </TableRow>
            <TableRow>{blog.likes} likes </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <Button
        variant="contained"
        color="primary"
        onClick={() => onLike(blog.id, blog)}
      >
        like
      </Button>{' '}
      <br />
      added by {blog.user.name} <br />
      <RemoveButton
        user={user}
        blogUser={blog.user.name}
        onDelete={onDelete}
        blog={blog}
      />
      <h3>comments</h3>
      <ul>
        {blog.comments.map((comment, index) => (
          <li key={index}>{comment}</li>
        ))}
      </ul>
      <form onSubmit={handleAddComment}>
        <TextField type="text" name="comment" />
        <Button variant="contained" color="primary" type="submit">
          add comment
        </Button>
      </form>
    </div>
  )
}

export default BlogDetails
