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

export const SCHEDULE_SUBSCRIPTION = gql`
  subscription Schedule(
    $user: String!
  ) {
    Schedule(user: $user) {
      user
      start
      end
      color
      title
      content
    }

  }
`