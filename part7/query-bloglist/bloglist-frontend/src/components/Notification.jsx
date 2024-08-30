import { useNotificationValue } from '../NotificationContext'

const Notification = () => {
  const notification = useNotificationValue()

  if (notification.length === 0) {
    return null
  }

  if (notification[0] === 'wrong username or password') {
    return <div className="error">{notification}</div>
  } else {
    return <div className="info">{notification}</div>
  }
}

export default Notification
