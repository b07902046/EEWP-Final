import './App.css';
import React, { useEffect, useRef, useCallback, useState } from 'react'

const redColor = "rgb(241, 101, 101)"
const greenColor = "rgb(60, 179, 113)"

function VoteJoin({handleClickBack, hash}) {
  const handleReject = () => {
    window.location = "http://localhost:3000/"
  }

  return (
    <div className="container">
      <header> ChoChoMeet </header>
      <h1> Election </h1>
      <div className="electionInfoBlock">
          <div className="electionInfoItem">
              Title: { "Dinner" }
          </div>
          <div className="electionInfoItem">
            Starter: { "Ken" }
          </div>
          <div className="electionInfoItem">
            Time: 02:10 ~ 03.15
          </div>
          <div className="electionInfoItem">
            Content: { "Go to eat dinner" }
          </div>
          <div className="electionInfoItem">
            Participants: { "Ken" }
          </div>
      </div>
      <div className="choiceBlock">
          <button id="accept"> Accept </button>
          <button id="reject" onClick={handleReject}> Reject </button>
      </div>
    </div>
  )
}

export default VoteJoin;
