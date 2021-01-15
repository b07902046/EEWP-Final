import { gql } from '@apollo/client'

export const POSTS_QUERY = gql`
  query {
      Messages {
          sender
          body
          receiver
      }
  }
`