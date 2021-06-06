import React from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { Avatar, ListItem, ListItemText, ListItemIcon } from '@material-ui/core'
const Profile = () => {
  const { user, isAuthenticated } = useAuth0()

  return isAuthenticated ? (
    <div>
      <ListItem button>
        <div style={{ display: 'flex' }}>
          <ListItemIcon>
            <Avatar src={user.picture} alt={user.name} />
          </ListItemIcon>
          <ListItemText>{user.email}</ListItemText>
        </div>
      </ListItem>
    </div>
  ) : (
    <p>Please login...</p>
  )
}

export default Profile
