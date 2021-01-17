import React from 'react'

const containerStyle = {
    minWidth: "15vw",
    height: "20vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "1px 0px",
    WebkitUserSelect: "none"
}

const lineStyle = {
    width: "15vw",
    height: "1vh",
    border: "1px solid #bbb",
    backgroundColor: "#ccc",
    borderRadius: "1px",
    display: "flex",
    flexDirection: "column",
}

const dotStyle = {
    maxWidth: "3vh",
    maxHeight: "3vh",
    border: "1px solid gold",
    borderRadius: "50%",
    backgroundColor: "silver",
    textAlign: "center",
    marginTop: "-1vh",
    marginLeft: "-2px"
}

const timeBarContainer = {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginTop: "3vh"
}

const timeBarStyle = {
    width: "1.2vw",
    height: "15vh",
    border: "1px solid #bbb",
    borderRadius: "3px"
}

const timeblockStyle = {
    width: "5vw",
    height: "2vh",
    marginTop: "17vh",
    marginLeft: "-1.9vw",
    fontSize: "1vw",
    color: "gray",
    textAlign: "center",
    visibility: "hidden"
}

const TimeLine = ({year: year, month: month, day: day, hour: hour, onMouseOut: onMouseOut, onMouseOver: onMouseOver}) => (
  <div style={containerStyle}>
    <div style={lineStyle}>
      <div style={dotStyle}> {hour} </div>
    </div>
    <div style={timeBarContainer}>
      <div style={timeBarStyle} onMouseOut={onMouseOut.bind(this, hour * 60)} onMouseOver={onMouseOver}>
        <div style={timeblockStyle}> {hour}:05 </div>
      </div>
      <div style={timeBarStyle} onMouseOut={onMouseOut.bind(this, hour * 60 + 5)} onMouseOver={onMouseOver}>
        <div style={timeblockStyle}> {hour}:10 </div>
      </div>
      <div style={timeBarStyle} onMouseOut={onMouseOut.bind(this, hour * 60 + 10)} onMouseOver={onMouseOver}>
        <div style={timeblockStyle}> {hour}:15 </div>
      </div>
      <div style={timeBarStyle} onMouseOut={onMouseOut.bind(this, hour * 60 + 15)} onMouseOver={onMouseOver}>
        <div style={timeblockStyle}> {hour}:20 </div>
      </div>
      <div style={timeBarStyle} onMouseOut={onMouseOut.bind(this, hour * 60 + 20)} onMouseOver={onMouseOver}>
        <div style={timeblockStyle}> {hour}:25 </div>
      </div>
      <div style={timeBarStyle} onMouseOut={onMouseOut.bind(this, hour * 60 + 25)} onMouseOver={onMouseOver}>
        <div style={timeblockStyle}> {hour}:30 </div>
      </div>
      <div style={timeBarStyle} onMouseOut={onMouseOut.bind(this, hour * 60 + 30)} onMouseOver={onMouseOver}>
        <div style={timeblockStyle}> {hour}:35 </div>
      </div>
      <div style={timeBarStyle} onMouseOut={onMouseOut.bind(this, hour * 60 + 35)} onMouseOver={onMouseOver}>
        <div style={timeblockStyle}> {hour}:40 </div>
      </div>
      <div style={timeBarStyle} onMouseOut={onMouseOut.bind(this, hour * 60 + 40)} onMouseOver={onMouseOver}>
        <div style={timeblockStyle}> {hour}:45 </div>
      </div>
      <div style={timeBarStyle} onMouseOut={onMouseOut.bind(this, hour * 60 + 45)} onMouseOver={onMouseOver}>
        <div style={timeblockStyle}> {hour}:50 </div>
      </div>
      <div style={timeBarStyle} onMouseOut={onMouseOut.bind(this, hour * 60 + 50)} onMouseOver={onMouseOver}>
        <div style={timeblockStyle}> {hour}:55 </div>
      </div>
      <div style={timeBarStyle} onMouseOut={onMouseOut.bind(this, hour * 60 + 55)} onMouseOver={onMouseOver}>
        <div style={timeblockStyle}> {(hour + 1) % 24}:00 </div>
      </div>
      
    </div>
    

  </div>
)

export default TimeLine
