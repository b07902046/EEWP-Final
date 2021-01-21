import './App.css';
import React, { useEffect, useState } from 'react'
import TimeLine from './components/TimeLine';

function VoteInfo(hour, colors, titles) {
    this.hour = hour
    this.colors = colors
    this.titles = titles
}

function Vote({hash, userID, handleReturnVote, client}) {
    const [year, setYear] = useState(new Date().getFullYear())
    const [month, setMonth] = useState(new Date().getMonth() + 1)
    const [day, setDay] = useState(new Date().getDate())

    const [startTime, setStartTime] = useState(new Date())
    const [endTime, setEndTime] = useState(new Date())

    const [voteInfo, setVoteInfo] = useState([])
    const [mouseStatus, setMouseStatus] = useState(false)
    const [cursBeg, setCursBeg] = useState(undefined)
    const [cursEnd, setCursEnd] = useState(undefined)
    const [votes, setVotes] = useState([])
    const [schedules, setSchedules] = useState(undefined) // whole schedules


    document.addEventListener('mousedown', () => {
      setMouseStatus(true)
    })
    
    document.addEventListener('mouseup', () => {
      setMouseStatus(false)
    })

    client.onmessage = (message) => {
      const [task, payload] = JSON.parse(message.data)
      switch(task) {
        case "queryElectionHashRes": {
          if(payload === "Fail") {
            alert("Hash not found")
            window.location = "http://140.112.30.33:6321/"
          }
          else {
            setStartTime(new Date(payload.start))
            setEndTime(new Date(payload.end))
            client.send(JSON.stringify(["querySchedule", { user: userID }]))
          }
          break
        }
        case "querySchedule": {
          setSchedules(payload)
          break
        }
        default: {
          break
        }
      }
    }

    const handleDragOut = (minute, e) => {
      if(mouseStatus) {
        e.target.style.backgroundColor = "#008000"
        if(cursBeg === undefined) {
          setCursBeg(minute)
          setCursEnd(minute)
        }
        if(minute < cursBeg) setCursBeg(minute)
        if(minute > cursEnd) setCursEnd(minute)
      }
      let timeInfo = e.target.firstChild
      let titleInfo = e.target.children[1]
      if(timeInfo && timeInfo.style) timeInfo.style.visibility = "hidden"
      if(titleInfo && titleInfo.style) titleInfo.style.visibility = "hidden"
    }

    const handleDragOver = (e) => {
      let timeInfo = e.target.firstChild
      let titleInfo = e.target.children[1]
      if(timeInfo && timeInfo.style) timeInfo.style.visibility = "visible"
      if(titleInfo && titleInfo.style) titleInfo.style.visibility = "visible"
    }

    const handleAddVote = (e) => {
      votes.push([cursBeg, cursEnd])
      if(cursBeg === undefined || cursEnd === undefined) {
        let msg = document.getElementById("login-message")
        msg.innerHTML = "please select intervals"
        msg.style.display = "inline"
        setTimeout(() => {
          msg.style.display = "none"
        }, 2000)
        return
      }
      let newStarts = []
      let newEnds = []
      for(let i = 0; i < votes.length; i++) {
        let sh = Math.floor(votes[i][0] / 60)
        let sm = votes[i][0] % 60
        let eh = Math.floor(votes[i][1] / 60)
        let em = votes[i][1] % 60
        
        let ss = year.toString() + " " + month.toString() + " " + day.toString() + " " + sh.toString() + ":" + sm.toString()
        let es = year.toString() + " " + month.toString() + " " + day.toString() + " " + eh.toString() + ":" + em.toString()

        newStarts.push(ss)
        newEnds.push(es)

        for(let j = votes[i][0]; j <= votes[i][1]; j+=5) {
          let h = Math.floor(j / 60)
          let m = Math.floor((j % 60) / 5)
          let eid = "timeline" + (h * 60).toString() + m.toString()
          document.getElementById(eid).style.backgroundColor = "green"
        }
      }
      client.send(JSON.stringify(["createVote", { user: userID, hash: hash, starts: newStarts, ends: newEnds }]))
      
      setVotes([])
      setCursBeg(undefined)
      setCursEnd(undefined)
      let msg = document.getElementById("login-message")
      msg.innerHTML = "Vote successfully!!"
      msg.style.color = "green"
      msg.style.display = "inline"
      setTimeout(() => {
        msg.style.display = "none"
      }, 2000)

    }

    const handleCancel = () => {
      if(cursBeg === undefined || cursEnd === undefined) {
        return
      }
      let sh = startTime.getHours()
      for(let i = cursBeg; i <= cursEnd; i++) {
        let h = Math.floor(i / 60)
        let m = Math.floor((i % 60) / 5)
        let eid = "timeline" + (h * 60).toString() + m.toString()
        document.getElementById(eid).style.backgroundColor = voteInfo[h - sh].colors[m]
      }
      setVotes([])
      setCursBeg(undefined)
      setCursEnd(undefined)
    }

    useEffect(() => {
      let cy = startTime.getFullYear()
      let cm = startTime.getMonth() + 1
      let cd = startTime.getDate()

      let sh = startTime.getHours()
      let sm = startTime.getMinutes()
      let eh = endTime.getHours()
      let em = endTime.getMinutes()

      setYear(cy)
      setMonth(cm)
      setDay(cd)

      let newVoteInfo = []
      for(let i = sh; i <= eh; i++) {
        let colors = ["", "", "", "", "", "", "", "", "", "", "", ""]
        let titles = ["", "", "", "", "", "", "", "", "", "", "", ""]
        for(let j = 0; j < 12; j++) {
          if((i < sh && j * 5 <= sm) || (i >= eh && j * 5 >= em)) {
              colors[j] = "#ddd"
          }
        }
        newVoteInfo.push(new VoteInfo(i, colors, titles))
      }

      if(schedules !== undefined) {
          for(let i = 0; i < schedules.length; i++) {
            let sdate = new Date(schedules[i].start)
            let edate = new Date(schedules[i].end)
            
            let ny = sdate.getFullYear()
            let nm = sdate.getMonth() + 1
            let nd = sdate.getDate()

            if(ny === cy && nm === cm && nd === cd) {
                let shash = sdate.getHours() * 60 + sdate.getMinutes()
                let ehash = edate.getHours() * 60 + edate.getMinutes()
                
                for(let j = shash; j <= ehash; j++) {
                    let h = Math.floor(j / 60)
                    let m = Math.floor((j % 60 ) / 5)
                    if(h >= sh && h <= eh) {
                      if(newVoteInfo[h - sh].colors[m] === "") newVoteInfo[h - sh].colors[m] = schedules[i].color + "40"
                      newVoteInfo[h - sh].titles[m] = schedules[i].title
                    } 
                }             
            }
          }
      }
      setVoteInfo(newVoteInfo)

    }, [schedules, startTime, endTime])

    useEffect(() => {
      if(voteInfo.length === 0) {
        client.send(JSON.stringify(["queryElectionHash", { hash: hash }]))
      }
    }, [voteInfo])

    return (
    <div className="container">
      <header> ChoChoMeet </header>
      <div className="message-box" id="login-message"></div>
      <h1> {year}. {month}. {day}. </h1>
      <h3>
        {(startTime.getHours() < 10)? ("0" + startTime.getHours()) : startTime.getHours()}:
        {(startTime.getMinutes() < 10)? ("0" + startTime.getMinutes()): startTime.getMinutes()}
        {" ~ "}
        {(endTime.getHours() < 10)? ("0" + endTime.getHours()) : endTime.getHours()}:
        {(endTime.getMinutes() < 10)? ("0" + endTime.getMinutes()): endTime.getMinutes()}
      </h3>
      <div className="timeline">
        {voteInfo.map((vi, index) => <TimeLine year={year} month={month} day={day} hour={vi.hour} colors={vi.colors}
        titles={vi.titles} onMouseOut={handleDragOut} onMouseOver={handleDragOver} key={index}></TimeLine>)}
      </div>
      <div className="voteFunctional">
        <button className="vote-button" type="submit" onClick={handleCancel}> cancel </button>
        <button className="vote-button" type="submit" onClick={handleReturnVote}> back </button>
        <button className="vote-button" type="submit" onClick={handleAddVote}> vote </button>
      </div>
    </div>
  )
}

export default Vote;
