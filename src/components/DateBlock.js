import { Greengrass } from 'aws-sdk'
import React from 'react'
import '../App.css'
//backgroundColor: "#ccc",
const style = {
  
  border: "1px solid #bbb",
  padding: "1px 5px",
  borderRadius: "5px",
  width: "9vw",
  height: "6vw",
  marginBottom: "1px",
  textAlign: "left",
  overflow: "scroll",
}

function hoverOnEvent(e) {
  e.target.style.backgroundColor = "#aaa";
}

function hoverOutEvent(e) {
  e.target.style.backgroundColor = "#ccc";
}

const DateBlock = ({date: date, onClick: onClick,data}) => (
  <div style={style} onMouseOver={hoverOnEvent.bind(this)} onMouseOut={hoverOutEvent.bind(this)} onClick={onClick} value={date}>
    <p>{date}</p>
    {(data === undefined)?"":data.map((e)=>(<p style={{color:e.color,fontFamily: "Lucida Console, Courier, monospace"}}>{atob(e.title)}</p>))}
  </div>
)

export default DateBlock
