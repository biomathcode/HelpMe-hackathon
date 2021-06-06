/* eslint-disable no-unused-vars */
import React, { useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { Avatar, ListItem, ListItemText, ListItemIcon } from '@material-ui/core'
import TextField from '@material-ui/core/TextField'

import { useMutation, useQuery, gql } from '@apollo/client'

import uuid from 'react-uuid'

const Check_Query = gql`
  query FindingUsers($email: String) {
    users(where: { email: $email }, options: { limit: 1 }) {
      username
    }
  }
`

const ADD_USER = gql`
  mutation CreateUser(
    $id: String!
    $username: String
    $name: String
    $email: String
  ) {
    createUsers(
      input: { id: $id, username: $username, name: $name, email: $email }
    ) {
      users {
        username
      }
    }
  }
`

const Profile = () => {
  const { user, isAuthenticated } = useAuth0()

  const [username, setUsername] = useState('')

  const [able, setAble] = useState()
  const email = user?.email

  const [msg, setMsg] = useState(
    'Please create a unique username, without space'
  )

  const { loading, error, data } = useQuery(Check_Query, {
    variables: { email },
  })

  const [createUsers, mutationdata] = useMutation(ADD_USER, {
    onCompleted({ createUsers }) {
      if (createUsers) {
        console.log(createUsers)
        return setMsg(`Username Created successfully`)
      }
    },
  })
  const id = uuid()

  return isAuthenticated && !loading && !error ? (
    <div>
      <h1>Please complete your registration</h1>
      <ListItem>
        <div style={{ display: 'flex' }}>
          <ListItemIcon>
            <Avatar src={user.picture} alt={user.name} />
          </ListItemIcon>
          <ListItemText>Welcome, {user.name}</ListItemText>
        </div>
      </ListItem>

      {Object.keys(data.users).length > 0 ? (
        `username exists with  ${data.users[0].username}`
      ) : (
        <>
          {msg}
          <div>
            <TextField
              id="outlined-basic"
              label="Username"
              variant="standard"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <button
            disabled={!able}
            onClick={() => {
              createUsers({
                variables: {
                  id: id,
                  username: username,
                  name: user?.name,
                  email: user?.email,
                },
              })
            }}
          >
            Create Profile
          </button>
        </>
      )}
    </div>
  ) : (
    <div>Please login </div>
  )
}

export default Profile
