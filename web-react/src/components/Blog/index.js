import React from 'react'
import { useQuery, gql } from '@apollo/client'
import { useParams } from 'react-router-dom'
import Chip from '@material-ui/core/Chip'

import ReactMarkdown from 'react-markdown'

import rehypeRaw from 'rehype-raw'

const BLOG_POST = gql`
  query FindingPost($id: String) {
    posts(where: { postId: $id }) {
      title
      description
      date
      postId
      Category {
        name
      }
    }
  }
`

const Blog = () => {
  const { id } = useParams()
  console.log(id)
  const { loading, error, data } = useQuery(BLOG_POST, {
    variables: { id },
  })

  if (loading) return `Loading...`
  if (error) return 'Something went wrong'

  return data ? (
    <div>
      <h1>{data.posts[0].title}</h1>
      <Chip
        variant="outlined"
        size="small"
        label={data.posts[0].Category.name}
      />
      <p>{data.posts[0].date}</p>
      <ReactMarkdown rehypePlugins={[rehypeRaw]}>
        {data.posts[0].description}
      </ReactMarkdown>
    </div>
  ) : (
    <div>loading</div>
  )
}

export default Blog
