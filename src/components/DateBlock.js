import { Greengrass } from 'aws-sdk'
import React from 'react'
import '../App.css'

const style = {
  backgroundColor: "#ccc",
  border: "1px solid #bbb",
  padding: "1px 5px",
  borderRadius: "5px",
  width: "9vw",
  height: "6vw",
  marginBottom: "1px",
  textAlign: "right",
  overflow: "scroll",
}

function hoverOnEvent(e) {
  e.target.style.backgroundColor = "#aaa";
}

function hoverOutEvent(e) {
  e.target.style.backgroundColor = "#ccc";
}

const DateBlock = ({date: date, onClick: onClick}) => (
  <div style={style} onMouseOver={hoverOnEvent.bind(this)} onMouseOut={hoverOutEvent.bind(this)} onClick={onClick} value={date}>
    {date}
  </div>
)

export default DateBlock
