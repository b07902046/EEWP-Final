import './App.css';
import React, { useEffect, useState } from 'react'

function VoteJoin({hash, userID, handleOnAccept, client}) {
  const [startTime, setStartTime] = useState(new Date())
  const [endTime, setEndTime] = useState(new Date())
  const [title, setTitle] = useState("")
  const [starter, setStarter] = useState("")
  const [content, setContent] = useState("")
  const [users, setUsers] = useState([])
  const [finalStart, setFinalStart] = useState(null)
  const [finalEnd, setFinalEnd] = useState(null)

  client.onmessage = (message) => {
    const [task, payload] = JSON.parse(message.data)
    switch(task) {
      case "queryElectionHashRes": {
        if(payload === "Fail") {
          alert("Hash not found")
          window.location = "http://localhost:59321/"
        }
        else {
          setStartTime(new Date(payload.start))
          setEndTime(new Date(payload.end))
          setTitle(atob(payload.title))
          setStarter(payload.eventStarter)
          setContent(atob(payload.content))
          setUsers(payload.users)
          if(payload.finalStart !== undefined) setFinalStart(payload.finalStart)
          if(payload.finalEnd !== undefined) setFinalEnd(payload.finalEnd)
        }
        break
      }
      case "decideElection": {
        console.log(payload)
        setFinalStart(payload.finalStart)
        setFinalEnd(payload.finalEnd)
      }
      default: {
        break
      }
    }
    
  }

  const handleReject = () => {
    window.location = "http://localhost:59321/"
  }

  const handleDecide = () => {
    client.send(JSON.stringify(["decideElection", { hash: hash }]))
    let url = window.location.href
    window.location = url
  }

  useEffect(() => {
    if(title === "") {
      client.send(JSON.stringify(["queryElectionHash", { hash: hash }]))
    }
  }, [title])

  return (
    <div className="container">
      <header> ChoChoMeet </header>
      <h1> Election </h1>
      <div className="electionInfoBlock">
          <div className="electionInfoItem">
              Title: {title}
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
