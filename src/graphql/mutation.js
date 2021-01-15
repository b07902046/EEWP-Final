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