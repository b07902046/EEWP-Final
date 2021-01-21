import './App.css';
import RegisterPage from './RegisterPage'
import React, { useEffect, useState } from 'react'
import DateBlock from './components/DateBlock'
import ScheduleBox from './components/ScheduleBox'
import ElectionBox from './components/ElectionBox'
import TimeLine from './components/TimeLine'
import VoteJoin from './VoteJoin'
import useSch from './useSch'
import Vote from './Vote'

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
  this.schedules = []
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
  const [hash, setHash] = useState("")
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
  const [dayElection, setDayElection] = useState([])
  const {Schedules,querySchedule,createSchedule,Elections,queryElection,createElection, deleteSchedule,decideElection,joinElection}=useSch()
  // graphql
  //const [addSchedule] = useMutation(CREATE_SCHEDULE_MUTATION)
  //const [addElection] = useMutation(CREATE_ElECTION_MUTATION)


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
        setPassword("")
        let msg = document.getElementById("login-message")
        msg.innerHTML = "wrong account or password!"
        msg.style.display = "inline"
        setTimeout(() => {
          msg.style.display = "none"
        }, 2000)
      }
      else {
        setUserID(account)
        let url = window.location.search
        let urlParam = new URLSearchParams(url)
        if(urlParam.has("event")) {
          setHash(urlParam.get("event"))
          setEvent("voteJoin")
        }
        else {
          querySchedule({ user:account })
          queryElection({user:account})
          setEvent("Calendar")
        }
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
        let msg = document.getElementById("login-message")
        msg.innerHTML = "must fill in account and password!"
        msg.style.display = "inline"
        setTimeout(() => {
          msg.style.display = "none"
        }, 2000)
        
      }
    }
  }

  const handleMessageBox = (msg) => {
    let msgbox = document.getElementById("login-message")
    msgbox.innerHTML = msg
    msgbox.style.display = "inline"
    setTimeout(() => {
      msgbox.style.display = "none"
    }, 2000)
  }

  const handleDragOut = (minute, e) => {
    if(mouseStatus) {
      e.target.style.backgroundColor = color
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
      handleMessageBox("please select intervals")
      return
    }
    if(title === "") {
      handleMessageBox("please fill in the title")
      return 
    }

    let startHour = Math.floor(startTime / 60)
    let endHour = Math.floor(endTime / 60)
    let startMin = startTime % 60
    let endMin = endTime % 60
    
    let tstart = year.toString() + " " + month.toString() + " " + day.toString() + " " + startHour.toString() + ":" + startMin.toString()
    let tend = year.toString() + " " + month.toString() + " " + day.toString() + " " + endHour.toString() + ":" + endMin.toString()

    createSchedule({
      user: userID,
      start: tstart,
      end: tend,
      color: color,
      title: btoa(title),
      content: (content === "")? (null) : (btoa(content))   
    })

    let msgbox = document.getElementById("login-message")
    msgbox.innerHTML = "Successfully adding schedule!!!"
    msgbox.style.color = "green"
    msgbox.style.display = "inline"

    setStartTime(undefined)
    setEndTime(undefined)
    setCursBeg(undefined)
    setCursEnd(undefined)

    setTimeout(() => {
      msgbox.style.display = "none"
      setModifySchedule(true)
      setEvent("schedule")
    }, 1500)

  }

  const handleDeleteScheduleBox = (id, index) => {
    deleteSchedule({id:id})
    setDaySchedule(daySchedule.filter(s => s._id !== id))
  }

  const handleReturn = () => {
    setEvent("Calendar")
    querySchedule({ user:account })
    queryElection({ user:account })
  }

  const handleSchedulingReturn = () => {
    // refetch()
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
    setCursBeg(undefined)
    setCursEnd(undefined)
  }

  const handleAddElection = () => {
    if(startTime === undefined || endTime === undefined) {
      handleMessageBox("please select intervals")
      return
    }
    if(title === "") {
      handleMessageBox("please fill in the title")
      return 
    }

    let startHour = Math.floor(startTime / 60)
    let endHour = Math.floor(endTime / 60)
    let startMin = startTime % 60
    let endMin = endTime % 60
    
    let tstart = year.toString() + " " + month.toString() + " " + day.toString() + " " + startHour.toString() + ":" + startMin.toString()
    let tend = year.toString() + " " + month.toString() + " " + day.toString() + " " + endHour.toString() + ":" + endMin.toString()

    let hashValue = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)

    createElection({
      eventStarter: userID,
      start: tstart,
      end: tend,
      expectedInterval: ((endHour - startHour) * 60 + (endMin - startMin) / 5) + 1,
      color: color,
      title: btoa(title),
      content: (content === "")? (null) : (btoa(content)),
      users: [userID],
      hash: hashValue
    })
    //refetch()
    let msgbox = document.getElementById("login-message")
    msgbox.innerHTML = "Successfully creating election!!!"
    msgbox.style.color = "green"
    msgbox.style.display = "inline"

    setStartTime(undefined)
    setEndTime(undefined)
    setCursBeg(undefined)
    setCursEnd(undefined)
    
    //setEvent("schedule")
    setTimeout(() => {
      msgbox.style.display = "none"
      setModifySchedule(true)
      setEvent("schedule")
    }, 1500)
  }

  const handleOnAccept = (u, h, e) => {
    joinElection({ user_id: u, hash: h})
    setEvent("vote")
  }

  const handleReturnVote = () => {
    setEvent("voteJoin")
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
    for(let i = 0; i < Math.ceil(newDateInfo.length / 7); i++) {
      let tmpDateInfo = newDateInfo.slice(i * 7, i * 7 + 7)
      newDateArrange.push(tmpDateInfo.map((dateinfo, index) => (dateinfo.day === 0)?
      (<DateBlock date="" key={index + i * 7}></DateBlock>) : 
      (<DateBlock date={dateinfo.day} key={index + i * 7} onClick={handleClickDateBlock.bind(this,dateinfo.day)}></DateBlock>)))
    }
    setDateInfo(newDateArrange)
  }, [year, month])

  useEffect(() => {
    let newTimePointer = []
    for(let i = 0; i < 24; i++) {
      let colors = ["", "", "", "", "", "", "", "", "", "", "", ""]
      let titles = ["", "", "", "", "", "", "", "", "", "", "", ""]
      newTimePointer.push(new TimePointer(year, month, day, i, colors, titles))
    }

    if(modifySchedule) {
      let newDaySchedule = []
      Schedules.map((ele,index)=>{
        let tstart = new Date(ele.start)
        let tend = new Date(ele.end)
        if(year === tstart.getFullYear() && month === tstart.getMonth() + 1 && day === tstart.getDate()) {
          newDaySchedule.push(ele)
          for(let j = tstart.getHours() * 60 + tstart.getMinutes(); j <= tend.getHours() * 60 + tend.getMinutes(); j+=5) {
            let h = Math.floor(j / 60)
            let m = Math.floor((j % 60) / 5)
            newTimePointer[h].colors[m] = ele.color + "80"
            newTimePointer[h].titles[m] = ele.title
          }
        }
        
      })
      newDaySchedule.sort((a, b) => { 
        let t1 = new Date(a.start)
        let t2 = new Date(b.start)
        return t1.getTime() - t2.getTime() })
      
      setDaySchedule(newDaySchedule)
      
      // find day election
      let newDayElection = []
      Elections.map((ele)=>{
        let tstart = new Date(ele.start)
        if(year === tstart.getFullYear() && month === tstart.getMonth() + 1 && day === tstart.getDate()) {
          newDayElection.push(ele)
        }
        
      })
      newDayElection.sort((a, b) => { 
          let t1 = new Date(a.start)
          let t2 = new Date(b.start)
          return t1.getTime() - t2.getTime() })
      setDayElection(newDayElection)
    }
    setTimePointer(newTimePointer)
    setModifySchedule(false)
  }, [event, Schedules, Elections])

  useEffect(() => {
    if(mouseStatus === false && cursBeg !== undefined && cursEnd !== undefined) {
      let tbeg = cursBeg
      let tend = cursEnd

      setStartTime(tbeg)
      setEndTime(tend)
    }
  }, [mouseStatus, cursBeg, cursEnd])

  return (
    (event === "login")? (
      <div className="container">
        <header> ChoChoMeet </header>
        <div className="message-box" id="login-message"></div>
        <div className="LoginForm">
          <input type="text" onChange={(e) => setAccount(e.target.value)} placeholder="Enter account" name="account" 
                onKeyUp={handleLoginInput} required/>
          <br/>
          <input type="password" onChange={(e) => setPassword(e.target.value)} placeholder="Enter password" name="psw" 
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
          }}> &#8249; </button>
          {year}. {month}
          <button type="submit" onClick={(e) => {
            if(month === 12) {
              setMonth(1)
              setYear(year + 1)
            }
            else {
              setMonth(month + 1)
            }
          }}> &#8250; </button>
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
            {
              daySchedule.map((s, index) => 
              <ScheduleBox start={s.start} end={s.end} title={s.title} content={s.content} color={s.color} key={index}
               handleDelete={handleDeleteScheduleBox.bind(this, s._id, index)}>
              </ScheduleBox> )
            }
          </div>
          <div className="electionBoxList">
            {
              dayElection.map((e, index) => 
              <ElectionBox start={e.start} end={e.end} title={e.title} content={e.content} color={e.color} 
              key={index} users={e.users} eventStarter={e.eventStarter} hash={e.hash}>
              </ElectionBox> )
            }
          </div>
        </div>
        <div className="scheduleFooter">
          <button type="submit" onClick={handleReturn}> Back </button>
        </div>
      </div>

    ) : (event === "scheduling")? (
      <div className="container">
        <header> ChoChoMeet </header>
        <div className="message-box" id="login-message"></div>
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
        <div className="message-box" id="login-message"></div>
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
            <button type="submit" onClick={handleAddElection}> Add </button>
          </div>
        </div>
        <div className="schedulingFooter">
          <button type="submit" onClick={handleSchedulingReturn}> Back </button>
        </div>
      </div>
    ) : (event === "voteJoin")? (
      <VoteJoin hash={hash} userID={userID} handleOnAccept={handleOnAccept} client={client}></VoteJoin>
      ) : (event === "vote")? (
      <Vote hash={hash} userID={userID} client={client} handleReturnVote={handleReturnVote}></Vote>
    ) : (
      <div> wait... </div>
    )
  )
}

export default App;
