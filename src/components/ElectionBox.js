import React, { useEffect, useRef, useCallback, useState } from 'react'

let container = {
    width: "30vw",
    minHeight: "30vh",
    borderRadius: "1vw",
    marginBottom: "1vh",
    backgroundColor: "#eee",
    padding: "1vh 1.5vw",
    overflow: "scroll"
}

let titleStyle = {
    width: "25vw",
    fontSize: "1.2vw",
    fontFamily: "Lucida Console, Courier, monospace",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
}

let stripStyle = {
    width: "2vw",
    height: "1vh",
    marginTop: "1vh"
}

let contentStyle = {
    width: "25vw",
    fontFamily: "Lucida Console, Courier, monospace"
}

let timeStyle = {
    width: "25vw",
    color: "gray",
    fontFamily: "Lucida Console, Courier, monospace"
}

let userStyle = {
    width: "25vw",
    fontFamily: "Lucida Console, Courier, monospace",
    overflow: "scroll"
}


function ElectionBox({start: start, end: end, title: title, content: content, color: color, users: users, 
                      eventStarter: eventStarter, hash: hash}) {
    const [startTime, setStartTime] = useState(new Date(start))
    const [endTime, setEndTime] = useState(new Date(end))
    const [participants, setParts] = useState(users)
    const [starter, setStarter] = useState("")

    return (
        <div style={container}>
            <div style={titleStyle}>
                Title: {atob(title)}
                <div style={{...stripStyle, backgroundColor: color}}></div>
            </div>
            <div style={titleStyle}>
                Starter: { eventStarter }
            </div>
            <div style={titleStyle}>
                <a href={"http://localhost:3000/?event=" + hash} target="_blank"> URL </a>
            </div>
            <div style={timeStyle}>
                <header style={{fontSize: "1.2vw", color: "black"}}> Interval: </header>
                {(startTime.getHours() < 10)? "0" + startTime.getHours() : startTime.getHours()}:
                {(startTime.getMinutes() < 10)? "0" + startTime.getMinutes() : startTime.getMinutes()}
                {"  ~  "}
                {(endTime.getHours() < 10)? "0" + endTime.getHours() : endTime.getHours()}:
                {(endTime.getMinutes() < 10)? "0" + endTime.getMinutes() : endTime.getMinutes()}

            </div>
            <div style={contentStyle}>
                <header style={{fontSize: "1.2vw"}}> Content: </header>
                <p> {(content === null)? "" : atob(content)} </p>
            </div>
            <div style={userStyle}>
                <header style={{fontSize: "1.2vw"}}> Participants: </header>
                {participants.map((p, index) => <div key={index}> {p} <br/></div>)}
            </div>
        </div>
    )
}

export default ElectionBox
