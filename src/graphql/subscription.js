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
  subscription onSchedule(
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

export const ELECTION_SUBSCRIPTION = gql`
  subscription onElection(
    $user: String!
  ) {
    Election(user: $user){
      eventStarter
      start
      end
      expectedInterval
      color
      title
      content
      finalStart
      finalEnd
    }
  }
`
