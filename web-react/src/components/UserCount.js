import React from 'react'
import { Link } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Title from './Title'
import { useQuery, gql } from '@apollo/client'

const useStyles = makeStyles({
  depositContext: {
    flex: 1,
    textAlign: 'center',
  },
  navLink: {
    textDecoration: 'none',
  },
})

const GET_COUNT_QUERY = gql`
  {
    UserCount
  }
`

export default function Deposits() {
  const classes = useStyles()

  const { loading, error, data } = useQuery(GET_COUNT_QUERY)

  console.log(data)
  if (error) return <p>Error</p>
  return (
    <div className={classes.depositContext}>
      <Title>Total Users</Title>
      <Typography component="p" variant="h4">
        {loading ? 'Loading...' : data.UserCount}
      </Typography>
      <Typography color="textSecondary" className={classes.depositContext}>
        users found
      </Typography>
      <div>
        <Link to="/posts" className={classes.navLink}>
          View users
        </Link>
      </div>
    </div>
  )
}
