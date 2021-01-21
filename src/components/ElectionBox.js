import React, { useEffect, useRef, useCallback, useState } from 'react'
import COPY from '../images/copy.png'

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
}


function ElectionBox({start: start, end: end, title: title, content: content, color: color, users: users, 
                      eventStarter: eventStarter, hash: hash}) {
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
                {(new Date(start).getHours() < 10)? "0" + new Date(start).getHours() : new Date(start).getHours()}:
                {(new Date(start).getMinutes() < 10)? "0" + new Date(start).getMinutes() : new Date(start).getMinutes()}
                {"  ~  "}
                {(new Date(end).getHours() < 10)? "0" + new Date(end).getHours() : new Date(end).getHours()}:
                {(new Date(end).getMinutes() < 10)? "0" + new Date(end).getMinutes() : new Date(end).getMinutes()}

            </div>
            <div style={contentStyle}>
                <header style={{fontSize: "1.2vw"}}> Content: </header>
                <p> {(content === null)? "" : atob(content)} </p>
            </div>
            <div style={userStyle}>
                <header style={{fontSize: "1.2vw"}}> Participants: </header>
                {participants.map((p, index) => p + " / ")}
            </div>
        </div>
    )
}

export default ElectionBox
