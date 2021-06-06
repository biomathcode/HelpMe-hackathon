/* eslint-disable no-unused-vars */
import React, { useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import TextField from '@material-ui/core/TextField'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import dayjs from 'dayjs'

import { useMutation, useQuery, gql } from '@apollo/client'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import FormHelperText from '@material-ui/core/FormHelperText'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'

import {
  ListItemIcon,
  Avatar,
  ListItemText,
  Button,
  Card,
  CardContent,
  Chip,
  CardActions,
} from '@material-ui/core'

import { makeStyles } from '@material-ui/core/styles'

import uuid from 'react-uuid'
import { Category } from '@material-ui/icons'

const CREATE_POST = gql`
  mutation CreatePost(
    $id: String!
    $title: String
    $description: String
    $date: DateTime
    $longitude: Float
    $latitude: Float
    $email: String
    $category: String
  ) {
    createPosts(
      input: {
        postId: $id
        title: $title
        description: $description
        date: $date
        location: { create: { longitude: $longitude, latitude: $latitude } }
        user: { connect: { where: { email: $email } } }
        Category: { connect: { where: { name: $category } } }
      }
    ) {
      posts {
        postId
      }
    }
  }
`

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}))

const CategoriesData = [
  { value: 'Financial', label: 'Financial' },
  { value: 'Medical', label: 'Medical' },
  { value: 'Find someone', label: 'Find someone' },
  { value: 'Emergency', label: 'Emergency' },
  { value: 'Gig work', label: 'Gig work' },
  { value: 'Travel', label: 'Travel' },
  { value: 'StartUp', label: 'StartUp' },
  { value: 'Education', label: 'Education' },
  { value: 'Cleanliness Drive', label: 'Cleanliness Drive' },
  { value: 'Electricity Shortage', label: 'Electricity Shortage' },
  { value: 'MeetUp', label: 'MeetUp' },
  { value: 'Others', label: 'Others' },
]

const Post = () => {
  const { user, isAuthenticated } = useAuth0()

  const [mylocation, setLocation] = useState({ latitude: '', longitude: '' })

  const [Error, setError] = useState('Please give access to get you location')

  const [showinput, setShowInput] = useState(false)

  const classes = useStyles()

  const [title, setTitle] = useState('')

  const [Categories, setCategories] = useState('')

  const handleChange = (event) => {
    console.log(event.target.value)
    setCategories(event.target.value)
  }

  function getMyLocation() {
    const location = window.navigator && window.navigator.geolocation
    if (location) {
      setError('getting your location info')
      location.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          })
          setError(
            `latitude: ${mylocation.latitude} and longitude: ${mylocation.longitude}`
          )
          console.log(mylocation)
        },
        (error) => {
          setError('Some error took place! please try again')
          setLocation({
            latitude: 'err-latitude',
            longitude: 'err-longitude',
          })
        }
      )
    }
    setShowInput(true)
  }
  let now = dayjs()

  const [value, setValue] = useState('')

  //mutation query
  const [createPosts, mutationdata] = useMutation(CREATE_POST)
  const id = uuid()

  console.log(mutationdata)

  return (
    <div>
      <Card>
        <CardContent>
          <Chip label={now.format('dddd, DD MMMM YYYY')} variant="outlined" />

          <TextField
            id="standard-full-width"
            label="Title"
            style={{ margin: 8 }}
            placeholder="what do you need help with"
            helperText="Be precise!!"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
          />
          <div className="flex-c mb">
            <div className="flex">
              <Button onClick={() => getMyLocation()}>Location</Button>
            </div>
            {showinput && (
              <div className="flex-c">
                <div className="flex">
                  <div>Latitude</div>
                  <input
                    className="input"
                    value={mylocation.latitude}
                    onChange={(e) =>
                      setLocation({
                        longitude: mylocation.longitude,
                        latitude: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="flex">
                  <div>Longitude</div>
                  <input
                    className="input"
                    value={mylocation.longitude}
                    onChange={(e) =>
                      setLocation({
                        latitude: mylocation.latitude,
                        longitude: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            )}
          </div>
          <div>
            <ReactQuill theme="snow" value={value} onChange={setValue} />
          </div>
          <FormControl className={classes.formControl}>
            <InputLabel id="demo-simple-select-label">Categories</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={Categories}
              onChange={handleChange}
            >
              {CategoriesData.map((category) => {
                return (
                  <MenuItem key={category.value} value={category.value}>
                    {category.label}
                  </MenuItem>
                )
              })}
            </Select>
            <FormHelperText>
              your request for help lies in which category
            </FormHelperText>
          </FormControl>

          {isAuthenticated ? (
            <div>
              <div className="flex js">
                <div className="flex js">
                  <ListItemIcon>
                    <Avatar src={user.picture} alt={user.name} />
                  </ListItemIcon>
                  <ListItemText>{user.name}</ListItemText>
                </div>
                <CardActions>
                  <Button
                    onClick={() => {
                      createPosts({
                        variables: {
                          id: id,
                          title: title,
                          description: value,
                          date: now,
                          longitude: parseFloat(mylocation.longitude),
                          latitude: parseFloat(mylocation.latitude),
                          email: user.email,
                          category: Categories,
                        },
                      })
                    }}
                    variant="contained"
                    color="primary"
                  >
                    Send help Request
                  </Button>
                </CardActions>
              </div>
              {mutationdata.data ? (
                <div>
                  Youre post was successfully posted!! with postID{' '}
                  {mutationdata.data.createPosts.posts[0].postId}
                </div>
              ) : null}
            </div>
          ) : (
            <div>Hey, Login to post</div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default Post
