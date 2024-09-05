import PropTypes from 'prop-types'
import { Button, TextField } from '@mui/material'

const BlogForm = ({ createBlog }) => {
  const handleNewBlog = (event) => {
    event.preventDefault()
    const title = event.target.title.value
    const author = event.target.author.value
    const url = event.target.url.value
    event.target.title.value = ''
    event.target.author.value = ''
    event.target.url.value = ''
    const blogObject = {
      title: title,
      author: author,
      url: url,
    }
    createBlog(blogObject)
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={handleNewBlog}>
        <div>
          <TextField
            label="title"
            data-testid="title"
            type="title"
            name="title"
            id="blog-input-title"
          />
        </div>
        <div>
          <TextField
            label="author"
            data-testid="author"
            type="author"
            name="author"
            id="blog-input-author"
          />
        </div>
        <div>
          <TextField
            label="url"
            data-testid="url"
            type="url"
            name="url"
            id="blog-input-url"
          />
        </div>
        <Button variant="contained" color="primary" type="submit">
          create
        </Button>
      </form>
    </div>
  )
}

BlogForm.propTypes = {
  createBlog: PropTypes.func.isRequired,
}

export default BlogForm
