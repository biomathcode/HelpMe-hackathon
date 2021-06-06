import React from 'react'
import { useQuery, gql } from '@apollo/client'
import { withStyles } from '@material-ui/core/styles'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  Paper,
  TableSortLabel,
  TextField,
} from '@material-ui/core'

import Title from './Title'

const styles = (theme) => ({
  root: {
    maxWidth: 700,
    marginTop: theme.spacing(3),
    overflowX: 'auto',
    margin: 'auto',
    padding: theme.spacing(1),
  },
  table: {
    minWidth: 700,
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    minWidth: 300,
  },
  title: {
    textAlign: 'center',
  },
})

const GET_POST = gql`
  query postsPaginateQuery(
    $first: Int
    $offset: Int
    $orderBy: [PostSort]
    $filter: PostWhere
  ) {
    posts(
      options: { limit: $first, skip: $offset, sort: $orderBy }
      where: $filter
    ) {
      postId
      title
      date
      user {
        email
        username
      }
      Category {
        name
      }
    }
  }
`

function UserList(props) {
  const { classes } = props
  const [order, setOrder] = React.useState('ASC')
  const [orderBy, setOrderBy] = React.useState('title')
  const [page] = React.useState(0)
  const [rowsPerPage] = React.useState(10)
  const [filterState, setFilterState] = React.useState({ postFilter: '' })

  const getFilter = () => {
    return filterState.postFilter.length > 0
      ? { title_CONTAINS: filterState.postFilter }
      : {}
  }

  const { loading, data, error } = useQuery(GET_POST, {
    variables: {
      first: rowsPerPage,
      offset: rowsPerPage * page,
      orderBy: { [orderBy]: order },
      filter: getFilter(),
    },
  })

  const handleSortRequest = (property) => {
    const newOrderBy = property
    let newOrder = 'DESC'

    if (orderBy === property && order === 'DESC') {
      newOrder = 'ASC'
    }

    setOrder(newOrder)
    setOrderBy(newOrderBy)
  }

  const handleFilterChange = (filterName) => (event) => {
    const val = event.target.value

    setFilterState((oldFilterState) => ({
      ...oldFilterState,
      [filterName]: val,
    }))
  }

  return (
    <Paper className={classes.root}>
      <Title className={classes.title}>Post List</Title>
      <TextField
        id="search"
        label="Post title  Contains"
        className={classes.textField}
        value={filterState.postFilter}
        onChange={handleFilterChange('postFilter')}
        margin="normal"
        variant="outlined"
        type="text"
        InputProps={{
          className: classes.input,
        }}
      />
      {loading && !error && <p>Loading...</p>}
      {error && !loading && <p>Error</p>}
      {data && !loading && !error && (
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell
                key="title"
                sortDirection={
                  orderBy === 'title' ? order.toLowerCase() : false
                }
              >
                <Tooltip title="Sort" placement="bottom-start" enterDelay={300}>
                  <TableSortLabel
                    active={orderBy === 'title'}
                    direction={order.toLowerCase()}
                    onClick={() => handleSortRequest('title')}
                  >
                    Title
                  </TableSortLabel>
                </Tooltip>
              </TableCell>
              <TableCell key="Username">Category</TableCell>
              <TableCell key="numReviews">Link To Post</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.posts.map((n) => {
              return (
                <TableRow key={n.postId}>
                  <TableCell component="th" scope="row">
                    {n.title}
                  </TableCell>
                  <TableCell>{n.Category.name}</TableCell>
                  <TableCell>
                    <a href={'/blog/' + n.postId}>here</a>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      )}
    </Paper>
  )
}

export default withStyles(styles)(UserList)
