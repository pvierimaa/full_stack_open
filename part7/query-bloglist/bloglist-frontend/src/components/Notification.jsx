import { useNotificationValue } from '../NotificationContext'
import Alert from '@mui/material/Alert'

const Notification = () => {
  const notification = useNotificationValue()

  if (notification.length === 0) {
    return null
  }

  if (notification[0] === 'wrong username or password') {
    return (
      <div>
        <Alert severity="error">{notification}</Alert>
      </div>
    )
  } else {
    return (
      <div>
        <Alert severity="success">{notification}</Alert>
      </div>
    )
  }
}

export default Notification
