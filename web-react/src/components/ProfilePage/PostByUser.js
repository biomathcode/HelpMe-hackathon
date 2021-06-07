import React from 'react'

import { useAuth0 } from '@auth0/auth0-react'
import { useMutation, useQuery, gql } from '@apollo/client'
import { CardContent, Chip, Typography, Card, Button } from '@material-ui/core'
import { Delete as DeleteIcon } from '@material-ui/icons'

const POST_BY_USER = gql`
  query FindingPostByUsers($email: String) {
    users(where: { email: $email }) {
      posts {
        postId
        title
        date
        description
        user {
          username
        }
        Category {
          name
        }
      }
    }
  }
`

const DELETE_POST = gql`
  mutation deletePost($postID: String!) {
    deletePosts(where: { postId: $postID }) {
      nodesDeleted
    }
  }
`

const DeleteButton = (props) => {
  const postid = props.postId
  const [deletePost, mutaData] = useMutation(DELETE_POST, {
    onCompleted() {
      console.log(mutaData)
    },
  })

  return props ? (
    <Button
      key={props.postId}
      onClick={() => {
        deletePost({
          variables: {
            postID: postid,
          },
        })
      }}
      startIcon={<DeleteIcon />}
    >
      Delete
    </Button>
  ) : (
    <div>Nope</div>
  )
}

const PostByUser = () => {
  const { user, isAuthenticated } = useAuth0()

  const email = user?.email

  const { loading, error, data } = useQuery(POST_BY_USER, {
    variables: { email },
  })

  if (loading) return `loading`
  if (error) return `something went wrong`

  // if (data) return console.log(data)

  return isAuthenticated ? (
    data.users[0].posts.map((post) => {
      return (
        <Card key={post.postId} className="card-mx">
          <CardContent>
            <Chip label={post.Category.name} variant="outlined" />
            <div className="flex sb">
              <Typography variant="h6" component="h2">
                {post.title}
              </Typography>
              <DeleteButton postId={post.postId} />
            </div>
          </CardContent>
        </Card>
      )
    })
  ) : (
    <div>Please login</div>
  )
}

export default PostByUser
