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
export const CREATE_ElECTION_MUTATION = gql`
    mutation CreateElection(
        $eventStarter: String!
        $start: String!
        $end: String !
        $expectedInterval: Int!
        $color: String!
        $title: String!
        $content: String
        $finalStart: String
        $finalEnd: String
        $users: [String!]!
        $hash: String!
    ){
        CreateElection(
            data:{
                eventStarter: $eventStarter
                start: $start
                end: $end
                expectedInterval: $expectedInterval
                color: $color
                title: $title
                content: $content
                finalStart: $finalStart
                finalEnd: $finalEnd
                users: $users
                hash: $hash
            }
        ) {
            users
            start
            hash
        }
    }
`

export const JOIN_ELECTION = gql`
    mutation JoinElection(
        $hash: String!
        $user: String!
    ) {
        JoinElection(data: {
            hash: $hash
            user: $user
        }) {
            users
            hash
            eventStarter
        }
    }
`
