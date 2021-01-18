import { gql } from '@apollo/client'

export const CREATE_POST_MUTATION = gql`
    mutation CreateMessage(
        $sender: String!
        $body: String!
        $receiver: String!
    ) {
        CreateMessage(
            data: {
                sender: $sender
                body: $body
                receiver: $receiver
            }
        ) {
            sender
            body
            receiver
        }
    }
`

export const DELETE_POST_MUTATION = gql`
    mutation DeleteMessage(
        $data: String!
    ) {
        DeleteMessage(
            data: $data
        )
    }
`

export const CREATE_SCHEDULE_MUTATION = gql`
    mutation CreateSchedule(
        $user: String!
        $start: String!
        $end: String!
        $color: String!
        $title: String!
        $content: String
    ) {
        CreateSchedule(
            data: {
                user: $user
                start: $start
                end: $end
                color: $color
                title: $title
                content: $content
            }
        ) {
            user
            start
            title
            content
        }
    }
`