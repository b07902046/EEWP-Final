import './App.css';
import React, { useEffect, useRef, useCallback, useState } from 'react'
import { useMutation, useQuery } from '@apollo/react-hooks'
import { ELECTIONHASH_QUERY } from './graphql/query'
import { DECIDE_ELECTION } from './graphql/mutation';

const redColor = "rgb(241, 101, 101)"
const greenColor = "rgb(60, 179, 113)"

function VoteJoin({hash, userID, handleOnAccept}) {
  const { loading, error, data } = useQuery(ELECTIONHASH_QUERY, {
    variables: { hash: hash }
  })
  const [decideElection] = useMutation(DECIDE_ELECTION)
  const [startTime, setStartTime] = useState(new Date())
  const [endTime, setEndTime] = useState(new Date())
  const [title, setTitle] = useState("")
  const [starter, setStarter] = useState("")
  const [content, setContent] = useState("")
  const [users, setUsers] = useState([])
  const [idTable, setIdTable] = useState({})
  const [finalStart, setFinalStart] = useState(null)
  const [finalEnd, setFinalEnd] = useState(null)

  const handleReject = () => {
    window.location = "http://localhost:3000/"
  }

  const handleDecide = () => {
    decideElection({
      variables: {
        hash: hash
      }
    })
    let url = window.location.href
    window.location = url
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

          if(newData.finalStart !== null) setFinalStart(parseInt(newData.finalStart))
          if(newData.finalEnd !== null) setFinalEnd(parseInt(newData.finalEnd))
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
            Time range: { (startTime.getHours() < 10)? ("0" + startTime.getHours()) : startTime.getHours()}:
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
            { users.map((user, index) => user + " / ")}
          </div>
          <div className="electionInfoItem" style={{color: "red"}}>
            Final result: {(finalStart === null || finalEnd === null)? "None" : 
            ((new Date(finalStart).getHours() < 10)? ("0" + new Date(finalStart).getHours()) : new Date(finalStart).getHours()
            ) + ":" +
            ((new Date(finalStart).getMinutes() < 10)? ("0" + new Date(finalStart).getMinutes()) : new Date(finalStart).getMinutes()
            ) + " ~ " +
            ((new Date(finalEnd).getHours() < 10)? ("0" + new Date(finalEnd).getHours()) : new Date(finalEnd).getHours()
            ) + ":" +
            ((new Date(finalEnd).getMinutes() < 10)? ("0" + new Date(finalEnd).getMinutes()) : new Date(finalEnd).getMinutes()
            )
            }
          </div>
      </div>
      <div className="choiceBlock">
        {(finalStart !== null && finalEnd !== null)? (
          <></>
        ) : (
          <button id="accept" onClick={handleOnAccept.bind(this, userID, hash)}> Vote </button>
        )}
        {(starter !== userID || (finalStart !== null && finalEnd !== null))? (
          <></>
        ) : (
          <button id="decide" onClick={handleDecide}> Decide </button>
        )}
        <button id="reject" onClick={handleReject}> Go back </button>
      </div>
    </div>
  )
}

export default VoteJoin;
