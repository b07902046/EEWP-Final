import React from 'react'

const containerStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "1px 0px",
    minWidth: "5vw",
    height: "50vh",
    WebkitUserSelect: "none"
}

const barStyle = {
    backgroundColor: "#eee",
    border: "1px solid #ccc",
    padding: "1px 5px",
    borderRadius: "1px",
    width: "100%",
    height: "1vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center"
}

const dotStyle = {
    backgroundColor: "silver",
    width: "3vh",
    height: "3vh",
    borderRadius: "50%",
    marginTop: "-1vh",
}

const timeBlockStyle = {
    width: "5vw",
    height: "54vh",
    marginTop: "3vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "3px 5px"
}

const timeBarStyle = {
    width: "4vw",
    height: "2vh",
    border: "#ccc solid 1px",
    borderRadius: "3px"
}

let isMouseDown = false;

window.addEventListener('mousedown', () => {
    isMouseDown = true
});
window.addEventListener('mouseup', () => {
    isMouseDown = false
})

function mouseFocus(e) {
    if(isMouseDown) e.target.style.backgroundColor = "green";
}

const TimeInfo = ({hour: hour, onMouseOver: onMouseOver}) => (
    <div style={containerStyle}>
      <div style={barStyle}>
        <div style={dotStyle}> {hour} </div>
      </div>
      <div style={timeBlockStyle}>
        <div style={timeBarStyle} onMouseOver={onMouseOver.bind(this)}></div>
        <div style={timeBarStyle} onMouseOver={onMouseOver.bind(this)}></div>
        <div style={timeBarStyle} onMouseOver={onMouseOver.bind(this)}></div>
        <div style={timeBarStyle} onMouseOver={onMouseOver.bind(this)}></div>
        <div style={timeBarStyle} onMouseOver={onMouseOver.bind(this)}></div>
        <div style={timeBarStyle} onMouseOver={onMouseOver.bind(this)}></div>
        <div style={timeBarStyle} onMouseOver={onMouseOver.bind(this)}></div>
        <div style={timeBarStyle} onMouseOver={onMouseOver.bind(this)}></div>
        <div style={timeBarStyle} onMouseOver={onMouseOver.bind(this)}></div>
        <div style={timeBarStyle} onMouseOver={onMouseOver.bind(this)}></div>
        <div style={timeBarStyle} onMouseOver={onMouseOver.bind(this)}></div>
        <div style={timeBarStyle} onMouseOver={onMouseOver.bind(this)}></div>
      </div>
    </div>
)

export default TimeInfo
