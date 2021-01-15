import { gql } from '@apollo/client'

export const POSTS_SUBSCRIPTION = gql`
subscription{
	Message {
    sender
    body
    receiver
  }
}
`