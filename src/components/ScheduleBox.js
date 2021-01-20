import React, { useEffect, useRef, useCallback, useState } from 'react'
import XPNG from "../images/x.png"

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
    fontFamily: "Lucida Console, Courier, monospace",
}

let timeStyle = {
    width: "25vw",
    color: "gray",
    marginTop: "-1vh"
}

let imgStyle = {
    width: "1vw",
    marginLeft: "27vw",
    marginTop: "-9vh",
    

}


function ScheduleBox({start: start, end: end, title: title, content: content, color: color}) {
    const [startTime, setStartTime] = useState(new Date(start))
    const [endTime, setEndTime] = useState(new Date(end))

    return (
        <div style={container} className="schedule-container">
            <div style={titleStyle}>
                Title: {atob(title)}
                <div style={{...stripStyle, backgroundColor: color}}></div>
            </div>
            <img src={XPNG} style={imgStyle}></img>
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
