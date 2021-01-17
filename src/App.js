import './App.css';
import RegisterPage from './RegisterPage'
import React, { useEffect, useRef, useCallback, useState } from 'react'
import { useQuery, useMutation } from '@apollo/react-hooks'
import { REGISTER_QUERY } from './graphql/query'
import { unstable_renderSubtreeIntoContainer } from 'react-dom';
import DateBlock from './components/DateBlock'

const client = new WebSocket('ws://localhost:5000')

function dateBlockInfo(day, onclick) {
  this.day = day
  this.onclick = onclick
}

function App() {
  const [event, setEvent] = useState('login')
  const [account, setAccount] = useState('')
  const [password, setPassword] = useState('')
  const [userID, setUserID] = useState("")

  const date = new Date()
  const [year, setYear] = useState(date.getFullYear())
  const [month, setMonth] = useState(date.getMonth() + 1)

  const [dateInfo, setDateInfo] = useState([])

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

  const handleRegister = () => {
    setEvent("register")
  }

  const handleClickDateBlock = (day, e) => {
    console.log(day)
  }

  useEffect(() => {
    let weekday = new Date(year, month - 1, 1).getDay()
    let numDay = new Date(year, month, 0).getDate()
    let newDateInfo = []
    
    // add spare blocks in front
    for(let i = 0; i < weekday; i++) {
      newDateInfo.push(new dateBlockInfo(0, null))
    }
    
    for(let i = 1; i <= numDay; i++) {
      newDateInfo.push(new dateBlockInfo(i, null))
    }
    // add spare blocks at back
    while(newDateInfo.length % 7 !== 0) {
      newDateInfo.push(new dateBlockInfo(0, null))
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
      <RegisterPage></RegisterPage>
    ) : (event === "Calendar")? (
      <div className="container">
        <header> ChoChoMeet </header>
        <h1> Calendar </h1>
        <div className="time-info">
          <button type="submit" onClick={(e) => setMonth(month - 1)}> {'<<'} </button>
          {year}. {month}
          <button type="submit" onClick={(e) => setMonth(month + 1)}> {'>>'} </button>
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
    ) : (
      <div> Hello others </div>
    )
  )
}

export default App;