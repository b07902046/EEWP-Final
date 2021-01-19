import React, { useEffect, useRef, useCallback, useState } from 'react'

let containerStyle = {
    minWidth: "15vw",
    height: "20vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "1px 0px",
    WebkitUserSelect: "none"
}

let lineStyle = {
    width: "15vw",
    height: "1vh",
    border: "1px solid #bbb",
    backgroundColor: "#ccc",
    borderRadius: "1px",
    display: "flex",
    flexDirection: "column",
}

let dotStyle = {
    maxWidth: "3vh",
    maxHeight: "3vh",
    border: "1px solid gold",
    borderRadius: "50%",
    backgroundColor: "silver",
    textAlign: "center",
    marginTop: "-1vh",
    marginLeft: "-2px"
}

let timeBarContainer = {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginTop: "5vh"
}

let timeBarStyle = {
    width: "1.2vw",
    height: "15vh",
    border: "1px solid #bbb",
    borderRadius: "3px"
}

let timeblockStyle = {
    width: "5vw",
    height: "2vh",
    marginTop: "15vh",
    marginLeft: "-1.9vw",
    fontSize: "1vw",
    color: "gray",
    textAlign: "center",
    visibility: "hidden"
}

let timeTitleStyle = {
  width: "15vw",
  marginTop: "-20vh",
  color: "gray",
  visibility: "hidden",
  fontSize: "1vw",
  textAlign: "center",
  marginLeft: "-7vw",
}

function TimeLine({year: year, month: month, day: day, hour: hour, colors: colors, onMouseOut: onMouseOut,
                   onMouseOver: onMouseOver, titles: titles}) {

  return (
    <div style={containerStyle}>
      <div style={lineStyle}>
        <div style={dotStyle}> {hour} </div>
      </div>
      <div style={timeBarContainer}>
        {colors.map((c, index) => 
        <div style={{...timeBarStyle, backgroundColor: c}} onMouseOut={onMouseOut.bind(this, hour * 60 + index * 5)} 
             onMouseOver={onMouseOver} key={index} id={"timeline" + (hour * 60).toString() + index.toString()}>
          <div style={timeblockStyle}> {hour}:{(index <= 1)? "0" + (index * 5):(index * 5)} </div>
          <div style={timeTitleStyle}> {atob(titles[index])} </div>
        </div>
        )}
      </div>
      

    </div>
  )
}

export default TimeLine
