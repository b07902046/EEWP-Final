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
    marginTop: "-2vh"
}

function ScheduleBox({start: start, end: end, title: title, content: content, color: color, handleDelete: handleDelete}) {

    return (
        <div style={container} className="schedule-container">
            <div style={titleStyle}>
                Title: {atob(title)}
                <div style={{...stripStyle, backgroundColor: color}}></div>
            </div>
            <img src={XPNG} alt="x" onClick={handleDelete}></img>
            <div style={timeStyle}>
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
        </div>
    )
}

export default ScheduleBox
