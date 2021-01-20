import './App.css';
import React, { useEffect, useRef, useCallback, useState } from 'react'
import { useQuery } from '@apollo/react-hooks'
import { ELECTIONHASH_QUERY } from './graphql/query'

const redColor = "rgb(241, 101, 101)"
const greenColor = "rgb(60, 179, 113)"

function VoteJoin({hash, userID, handleOnAccept}) {
  const { loading, error, data } = useQuery(ELECTIONHASH_QUERY, {
    variables: { hash: hash }
  })
  const [startTime, setStartTime] = useState(new Date())
  const [endTime, setEndTime] = useState(new Date())
  const [title, setTitle] = useState("")
  const [starter, setStarter] = useState("")
  const [content, setContent] = useState("")
  const [users, setUsers] = useState([])
  const [idTable, setIdTable] = useState({})

  const handleReject = () => {
    window.location = "http://localhost:3000/"
  }

  useEffect(() => {
    if(data) {
      if(data.ElectionHashQuery.length === 0) {
        alert("hash not found...")
        window.location = "http://localhost:3000/"
      }
      else {
          let newData = data.ElectionHashQuery[0]
          setTitle(atob(newData.title))
          setStarter(newData.eventStarter)
          setStartTime(new Date(parseInt(newData.start)))
          setEndTime(new Date(parseInt(newData.end)))
          setContent((newData.content)? atob(newData.content) : "")
          setUsers(newData.users)
      }
    }
  }, [data, hash])

  return (
    <div className="container">
      <header> ChoChoMeet </header>
      <h1> Election </h1>
      <div className="electionInfoBlock">
          <div className="electionInfoItem">
              Title: {(loading)? "loading..." : title}
          </div>
          <div className="electionInfoItem">
            Starter: {starter}
          </div>
          <div className="electionInfoItem">
            Date: { startTime.getFullYear() + ". " + (startTime.getMonth() + 1) + ". " + (startTime.getDate())}
          </div>
          <div className="electionInfoItem">
            Time Interval: { (startTime.getHours() < 10)? ("0" + startTime.getHours()) : startTime.getHours()}:
            { (startTime.getMinutes() < 10)? ("0" + startTime.getMinutes()) : startTime.getMinutes()}
            {" ~ "}
            { (endTime.getHours() < 10)? ("0" + endTime.getHours()) : endTime.getHours()}:
            { (endTime.getMinutes() < 10)? ("0" + endTime.getMinutes()) : endTime.getMinutes()}
          </div>
          <div className="electionInfoItem">
            Content: { content }
          </div>
          <div className="electionInfoItem">
            <header> Participants: </header>
            { users.map((user, index) => <p key={index}> {user} </p>)}
          </div>
      </div>
      <div className="choiceBlock">
          <button id="accept" onClick={handleOnAccept.bind(this, userID, hash)}> Accept </button>
          <button id="reject" onClick={handleReject}> Reject </button>
      </div>
    </div>
  )
}

export default VoteJoin;
