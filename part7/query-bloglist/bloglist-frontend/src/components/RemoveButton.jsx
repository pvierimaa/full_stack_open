import { Button } from '@mui/material'

const RemoveButton = ({ user, blogUser, onDelete, blog }) => {
  if (user === blogUser) {
    return (
      <div>
        <Button
          variant="contained"
          color="primary"
          onClick={() => onDelete(blog.id, blog.title, blog.author)}
        >
          remove
        </Button>
      </div>
    )
  }
}

export default RemoveButton
