import React, { useEffect, useRef, useCallback, useState } from 'react'

let container = {
    width: "30vw",
    minHeight: "15vh",
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
    color: "gray"
}


function ScheduleBox({start: start, end: end, title: title, content: content, color: color}) {
    const [startTime, setStartTime] = useState(new Date(parseInt(start)))
    const [endTime, setEndTime] = useState(new Date(parseInt(end)))

    return (
        <div style={container}>
            <div style={titleStyle}>
                Title: {atob(title)}
                <div style={{...stripStyle, backgroundColor: color}}></div>
            </div>
            <div style={timeStyle}>
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
        </div>
    )
}

export default ScheduleBox
