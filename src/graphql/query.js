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
  query {
    Schedules {
      user
      start
      end
      title
    }
  }
`