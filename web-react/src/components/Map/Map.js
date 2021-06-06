/* eslint-disable no-unused-vars */
import React, { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  Circle,
} from 'react-leaflet'
import L from 'leaflet'

import { Chip } from '@material-ui/core'

import Icon from './../../svgs/Group.svg'

// import { useState } from 'react'
import 'leaflet/dist/leaflet.css'

// import cities from './../data/cities.json'
import { useQuery, gql } from '@apollo/client'

const ALL_POSTS = gql`
  query allPosts {
    posts {
      postId
      user {
        username
        email
      }
      title
      description
      location {
        latitude
        longitude
      }
      Category {
        name
      }
    }
  }
`
const markerIcon = new L.Icon({
  iconUrl: Icon,
  iconSize: [20, 20],
  className: 'leaflet-div-icon',
})

function LocationMarker() {
  const [position, setPosition] = useState(null)
  const map = useMapEvents({
    click() {
      map.locate()
    },
    locationfound(e) {
      setPosition(e.latlng)
      map.flyTo(e.latlng, map.getZoom())
    },
  })
  const circleRef = useRef()

  useEffect(() => {
    const radius = circleRef.current?.getRadius()
    return radius
  }, [position])

  return position === null ? null : (
    <Marker position={position} icon={markerIcon}>
      <Popup>You are here</Popup>
      <Circle
        pathOptions={{ color: 'green', fillColor: 'green' }}
        ref={circleRef}
        center={position}
        radius={20000}
      />
    </Marker>
  )
}

function Map() {
  const { loading, error, data } = useQuery(ALL_POSTS)

  console.log(data)

  if (loading) return 'loading...'
  if (error) return 'something went wrong'
  // if (data) return console.log(data)

  return (
    <>
      <MapContainer center={[25, 72]} zoom={15} scrollWheelZoom={true}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        <LocationMarker />
        {data.posts &&
          data.posts.map((post) => (
            <Marker
              position={[post.location.latitude, post.location.longitude]}
              key={post.postId}
              icon={markerIcon}
            >
              <Popup>
                <div>
                  {post.Category.name && (
                    <Chip
                      variant="outlined"
                      size="small"
                      label={post.Category.name}
                    />
                  )}
                  <h2>{post.title}</h2>

                  <Link to={'/blog/' + post.postId}>Read more</Link>
                  {post.user.email && <p>Post by {post.user.email}</p>}
                </div>
              </Popup>
            </Marker>
          ))}
      </MapContainer>
    </>
  )
}

export default Map
