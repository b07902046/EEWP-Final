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

export const REGISTER_QUERY = gql`
  query Registers($query: String!) {
    Registers(query: $query) {
      username
      password
    }
  }
`