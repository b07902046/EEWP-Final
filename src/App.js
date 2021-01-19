import './App.css';
import RegisterPage from './RegisterPage'
import React, { useEffect, useRef, useCallback, useState } from 'react'
import { useQuery, useMutation} from '@apollo/react-hooks'
import { SCHEDULE_QUERY } from './graphql/query'
import { CREATE_SCHEDULE_MUTATION } from './graphql/mutation'
import { SCHEDULE_SUBSCRIPTION } from './graphql/subscription'
import { unstable_renderSubtreeIntoContainer } from 'react-dom';
import DateBlock from './components/DateBlock'
import ScheduleBox from './components/ScheduleBox'
import TimeInfoBlock from './components/TimeInfo'
import TimeLine from './components/TimeLine'
import { CloudSearchDomain } from 'aws-sdk';
import { set } from 'mongoose';
import { Timeline } from 'antd';

const client = new WebSocket('ws://localhost:5000')

function DateBlockInfo(day, onclick) {
  this.day = day
  this.onclick = onclick
}

function TimePointer(year, month, day, hour, colors, titles) {
  this.year = year
  this.month = month
  this.day = day
  this.hour = hour
  this.colors = colors;
  this.titles = titles
}

function App() {
  const [event, setEvent] = useState('login')
  const [account, setAccount] = useState('')
  const [password, setPassword] = useState('')
  const [userID, setUserID] = useState("")

  const date = new Date()
  const [year, setYear] = useState(date.getFullYear())
  const [month, setMonth] = useState(date.getMonth() + 1)
  const [day, setDay] = useState(date.getDate())

  const [dateInfo, setDateInfo] = useState([])
  const [timePointer, setTimePointer] = useState([])

  const [mouseStatus, setMouseStatus] = useState(false)
  // cursor begin/end
  const [cursBeg, setCursBeg] = useState(undefined)
  const [cursEnd, setCursEnd] = useState(undefined)
  const [startTime, setStartTime] = useState(undefined)
  const [endTime, setEndTime] = useState(undefined)
  const [modifySchedule,setModifySchedule] = useState(false)
  // schedule
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [color, setColor] = useState("#00FFdd")
  const [daySchedule, setDaySchedule] = useState([])

  // graphql
  const { loading, error, data, subscribeToMore,refetch} = useQuery(SCHEDULE_QUERY, {
    variables: {
      query: userID
    }
  })
  const [addSchedule] = useMutation(CREATE_SCHEDULE_MUTATION)

  document.addEventListener('mousedown', () => {
    setMouseStatus(true)
  })

  document.addEventListener('mouseup', () => {
    setMouseStatus(false)
  })

  client.onmessage = (message) => {
    const [task, payload] = JSON.parse(message.data);
    if(task === "loginRes") {
      if(payload === "Fail") {
        alert("Wrong account or password")
        setPassword("")
      }
      else {
        setUserID(payload)
        setEvent("Calendar")
      }
    }
  }

  const handleLoginInput = (e) => {
    if(e === "button" || e.keyCode === 13) {
      if(account !== "" && password !== "") {
        let rgtrData = ['login', {account: account, password: password}]
        client.send(JSON.stringify(rgtrData))
      }
      else {
        if(account === "") alert("account form must be filled")
        else alert("Password form must be filled")
      }
    }
  }

  const handleDragOut = (minute, e) => {
    if(mouseStatus) {
      e.target.style.backgroundColor = color
      if(cursBeg === undefined) {
        setCursBeg(minute)
      }
      setCursEnd(minute)
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

  const handleRegister = () => {
    setEvent("register")
  }

  const handleClickDateBlock = (day, e) => {
    setModifySchedule(true)
    setEvent("schedule")
    setDay(day)
  }
  const handleRegisterBack = ()=>{
    setEvent("login")
  }
  const handleAddSchedule = () => {
    if(startTime === undefined || endTime === undefined) {
      alert("Please select an interval")
      return
    }
    if(title === "") {
      alert("Must fill in title")
      return 
    }

    let startHour = Math.floor(startTime / 60)
    let endHour = Math.floor(endTime / 60)
    let startMin = startTime % 60
    let endMin = endTime % 60
    
    let tstart = year.toString() + " " + month.toString() + " " + day.toString() + " " + startHour.toString() + ":" + startMin.toString()
    let tend = year.toString() + " " + month.toString() + " " + day.toString() + " " + endHour.toString() + ":" + endMin.toString()

    addSchedule({
      variables: {
        user: userID,
        start: tstart,
        end: tend,
        color: color,
        title: btoa(title),
        content: (content === "")? (null) : (btoa(content))
      }
    })

    refetch()
    setStartTime(undefined)
    setEndTime(undefined)
    setModifySchedule(true)
    setTimeout(() => {
      setEvent("schedule")
    }, 1500)
  }

  const handleReturn = () => {
    setEvent("Calendar")
  }

  const handleSchedulingReturn = () => {
    setStartTime(undefined)
    setEndTime(undefined)
    setEvent("schedule")
  }

  const handleCancel = () => {
    if(startTime === undefined || endTime === undefined) {
      return
    }
    for(let i = startTime; i <= endTime; i+=5) {
      let h = Math.floor(i / 60)
      let m = Math.floor((i % 60) / 5)
      let eid = "timeline" + (h * 60).toString() + m.toString()
      document.getElementById(eid).style.backgroundColor = timePointer[h].colors[m]
    }
    setStartTime(undefined)
    setEndTime(undefined)
  }

  useEffect(() => {
    let weekday = new Date(year, month - 1, 1).getDay()
    let numDay = new Date(year, month, 0).getDate()
    let newDateInfo = []
    
    // add spare blocks in front
    for(let i = 0; i < weekday; i++) {
      newDateInfo.push(new DateBlockInfo(0, null))
    }
    
    for(let i = 1; i <= numDay; i++) {
      newDateInfo.push(new DateBlockInfo(i, null))
    }
    // add spare blocks at back
    while(newDateInfo.length % 7 !== 0) {
      newDateInfo.push(new DateBlockInfo(0, null))
    }
    let newDateArrange = []
    let num = 0
    for(let i = 0; i < Math.ceil(newDateInfo.length / 7); i++) {
      let tmpDateInfo = newDateInfo.slice(i * 7, i * 7 + 7)
      newDateArrange.push(tmpDateInfo.map(dateinfo => (dateinfo.day === 0)?
      (<DateBlock date="" key={num++}></DateBlock>) : 
      (<DateBlock date={dateinfo.day} key={num++} onClick={handleClickDateBlock.bind(this, dateinfo.day)}></DateBlock>)))
    }
    setDateInfo(newDateArrange)
  }, [year, month])

  useEffect(() => {
    // initialize time pointer
    let newTimePointer = []
    for(let i = 0; i < 24; i++) {
      let colors = ["", "", "", "", "", "", "", "", "", "", "", ""]
      let titles = ["", "", "", "", "", "", "", "", "", "", "", ""]
      newTimePointer.push(new TimePointer(year, month, day, i, colors, titles))
    }
    if(modifySchedule) {
      let newDaySchedule = []
      for(let i = 0; i < data.Schedules.length; i++) {
        let tstart = new Date(parseInt(data.Schedules[i].start))
        let tend = new Date(parseInt(data.Schedules[i].end))
        if(year === tstart.getFullYear() && month === tstart.getMonth() + 1 && day === tstart.getDate()) {
          newDaySchedule.push(data.Schedules[i])
          for(let j = tstart.getHours() * 60 + tstart.getMinutes(); j <= tend.getHours() * 60 + tend.getMinutes(); j+=5) {
            let h = Math.floor(j / 60)
            let m = Math.floor((j % 60) / 5)
            newTimePointer[h].colors[m] = data.Schedules[i].color
            newTimePointer[h].titles[m] = data.Schedules[i].title
          }
        }
      }
      newDaySchedule.sort((a, b) => {return parseInt(a.start) - parseInt(b.start)})
      setDaySchedule(newDaySchedule)
    }
    setTimePointer(newTimePointer)
    setModifySchedule(false)
  }, [event, data])

  useEffect(() => {
    if(mouseStatus === false && cursBeg !== undefined && cursEnd !== undefined) {
      let tbeg = cursBeg
      let tend = cursEnd

      setStartTime(tbeg)
      setEndTime(tend)

      setCursBeg(undefined)
      setCursEnd(undefined)
    }
  }, [mouseStatus, cursBeg, cursEnd])

  useEffect(() => {
    subscribeToMore({
      document: SCHEDULE_SUBSCRIPTION,
      variables: { user: userID },
      updateQuery: (prev, { subscriptionData }) => {
        if(!subscriptionData.data) return prev
        const newData = subscriptionData.data.Schedule
        return { ...prev, Schedules: [...prev.Schedules, newData]}
        
      }
    })
  }, [subscribeToMore, userID])

  

  return (
    (event === "login")? (
      <div className="container">
        <header> ChoChoMeet </header>
        <div className="LoginForm">
          <input type="text" onChange={(e) => setAccount(e.target.value)} placeholder="Enter account" name="account" 
                onKeyUp={handleLoginInput} required/>
          <br/>
          <input type="password" onChange={(e) => setPassword(e.target.value)} placeholder="Enter Password" name="psw" 
                onKeyUp={handleLoginInput} value={password} required />
          <div className="LoginButton">
            <button type="submit" onClick={handleLoginInput.bind(this, 'button')}> Login </button>
            <button type="submit" onClick={handleRegister}> Sign Up </button>
          </div>
        </div>
      </div>
    ) : (event === "register")? (
      <RegisterPage handleClickBack={handleRegisterBack}></RegisterPage>
    ) : (event === "Calendar")? (
      <div className="container">
        <header> ChoChoMeet </header>
        <h1> Calendar </h1>
        <div className="time-info">
          <button type="submit" onClick={(e) => {
            if(month === 1) {
              setMonth(12)
              setYear(year - 1)
            }
            else {
              setMonth(month - 1)
            }
          }}> {"<<"} </button>
          {year}. {month}
          <button type="submit" onClick={(e) => {
            if(month === 12) {
              setMonth(1)
              setYear(year + 1)
            }
            else {
              setMonth(month + 1)
            }
          }}> {">>"} </button>
        </div>
        <div className="Calendar">
          <div className="week-bar">
            <div className="week-name"> Sun. </div>
            <div className="week-name"> Mon. </div>
            <div className="week-name"> Tue. </div>
            <div className="week-name"> Wed. </div>
            <div className="week-name"> Thu. </div>
            <div className="week-name"> Fri. </div>
            <div className="week-name"> Sat. </div>
          </div>
          {dateInfo.map(dateinfo => <div className="week-bar" key={dateinfo[0].key}> {dateinfo} </div>)}
        </div>

      </div>
    ) : (event === "schedule")? (
      <div className="container">
        <header> ChoChoMeet </header>
        <h1> {year}. {month}. {day}. </h1>
        <div className="scheduleFunctional">
          <button type="submit" onClick={() => {
            setModifySchedule(true)
            setTitle("")
            setContent("")
            setEvent("scheduling")}}> Add schedule + </button>
          <button type="submit" onClick={() => {
            setModifySchedule(true)
            setEvent("election")}}> Add election + </button>
        </div>
        <div className="scheduleEventList">
          <div className="scheduleBoxList">
            {(loading)? ("loading") : (
              daySchedule.map((s, index) => 
              <ScheduleBox start={s.start} end={s.end} title={s.title} content={s.content} color={s.color} key={index}>
              </ScheduleBox> )
            )}
          </div>
        </div>
        <div className="scheduleFooter">
          <button type="submit" onClick={handleReturn}> Back </button>
        </div>
      </div>

    ) : (event === "scheduling")? (
      <div className="container">
        <header> ChoChoMeet </header>
        <h1> {year}. {month}. {day}. </h1>
        <form>
          <input type="color" value={color} onChange={(e) => setColor(e.target.value)}/>
        </form>
        <div className="timeline">
          {timePointer.map(tp => <TimeLine year={tp.year} month={tp.month} day={tp.day} hour={tp.hour} colors={tp.colors}
          titles={tp.titles} onMouseOut={handleDragOut} onMouseOver={handleDragOver} key={tp.day * 24 + tp.hour}></TimeLine>)}
        </div>
        <div className="schedularForm">
          <input className="scheduleTitle" placeholder="add title" onChange={(e) => setTitle(e.target.value)}/>
          <textarea className="scheduleContent" placeholder="add contents" rows="5" onChange={(e) => setContent(e.target.value)}/>
          <div className="schedularFormFunctional">
            <button type="submit" onClick={handleCancel}> Cancel </button>
            <button type="submit" onClick={handleAddSchedule}> Add </button>
          </div>
        </div>
        <div className="schedulingFooter">
          <button type="submit" onClick={handleSchedulingReturn}> Back </button>
        </div>
      </div>
    ) : (event === "election")? (
      <div className="container">
        <header> ChoChoMeet </header>
        <h1> {year}. {month}. {day}. </h1>
        <div className="timeline">
          {timePointer.map(tp => <TimeLine year={tp.year} month={tp.month} day={tp.day} hour={tp.hour} colors={tp.colors}
          onMouseOut={handleDragOut} onMouseOver={handleDragOver} key={tp.day * 24 + tp.hour}></TimeLine>)}
        </div>
        <div className="schedularForm">
          <input className="scheduleTitle" placeholder="add title" onChange={(e) => setTitle(e.target.value)}/>
          <textarea className="scheduleContent" placeholder="add contents" rows="5" onChange={(e) => setContent(e.target.value)}/>
          <button type="submit" onClick={handleAddSchedule}> Add </button>
        </div>
      </div>
    ) : (
      <div> wait... </div>
    )
  )
}

export default App;
