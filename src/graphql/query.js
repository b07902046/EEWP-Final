import { gql } from '@apollo/client'

export const REGISTER_QUERY = gql`
  query Registers($query: String!) {
    Registers(query: $query) {
      account
      password
    }
  }
`

export const SCHEDULE_QUERY = gql`
  query Schedules($query: String!) {
    Schedules(query: $query) {
      user
      start
      end
      color
      title
      content
    }
  }
`
export const ELECTION_QUERY = gql`
  query Elections($query: String!) {
    Elections(query: $query) {
      eventStarter
      start
      end
      expectedInterval
      color
      title
      content
      finalStart
      finalEnd
      users
    }
  }
`

export const SCHEDULE_ELECTION_QUERY = gql`
  query onQuery(
    $scheduleQuery: String!
    $electionQuery: String!
  ) {
    Schedules(query: $scheduleQuery) {
      user
      start
      end
      color
      title
      content
    },
    Elections(query: $electionQuery) {
      eventStarter
      start
      end
      expectedInterval
      color
      title
      content
      finalStart
      finalEnd
      users
    }
  }
`
