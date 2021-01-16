import './App.css';
import RegisterPage from './RegisterPage'
import React, { useEffect, useRef, useCallback, useState } from 'react'
import { useQuery, useMutation } from '@apollo/react-hooks'
import { REGISTER_QUERY } from './graphql/query'
import { unstable_renderSubtreeIntoContainer } from 'react-dom';
import DateBlock from './components/DateBlock'

const client = new WebSocket('ws://localhost:5000')

function App() {
  const [event, setEvent] = useState('login')
  const [account, setAccount] = useState('')
  const [password, setPassword] = useState('')
  const [userID, setUserID] = useState("")

  const date = new Date()
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const weekday = date.getDay()

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

  const handleClickDateBlock = () => {
    setEvent("schedule")
  }

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
          {year}. {month}
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
          <div className="week-bar">
            <DateBlock date=""></DateBlock>
            <DateBlock date=""></DateBlock>
            <DateBlock date=""></DateBlock>
            <DateBlock date=""></DateBlock>
            <DateBlock date=""></DateBlock>
            <DateBlock date="1" onClick={handleClickDateBlock}></DateBlock>
            <DateBlock date="2"></DateBlock>
          </div>
          <div className="week-bar">
            <DateBlock date="3"></DateBlock>
            <DateBlock date="4"></DateBlock>
            <DateBlock date="5"></DateBlock>
            <DateBlock date="6"></DateBlock>
            <DateBlock date="7"></DateBlock>
            <DateBlock date="8"></DateBlock>
            <DateBlock date="9"></DateBlock>
          </div>
          <div className="week-bar">
            <DateBlock date="10"></DateBlock>
            <DateBlock date="11"></DateBlock>
            <DateBlock date="12"></DateBlock>
            <DateBlock date="13"></DateBlock>
            <DateBlock date="14"></DateBlock>
            <DateBlock date="15"></DateBlock>
            <DateBlock date="16"></DateBlock>
          </div>
          <div className="week-bar">
            <DateBlock date="17"></DateBlock>
            <DateBlock date="18"></DateBlock>
            <DateBlock date="19"></DateBlock>
            <DateBlock date="20"></DateBlock>
            <DateBlock date="21"></DateBlock>
            <DateBlock date="22"></DateBlock>
            <DateBlock date="23"></DateBlock>
          </div>
          <div className="week-bar">
            <DateBlock date="24"></DateBlock>
            <DateBlock date="25"></DateBlock>
            <DateBlock date="26"></DateBlock>
            <DateBlock date="27"></DateBlock>
            <DateBlock date="28"></DateBlock>
            <DateBlock date="29"></DateBlock>
            <DateBlock date="30"></DateBlock>
          </div>
          <div className="week-bar">
            <DateBlock date="31" className="date-block"></DateBlock>
            <DateBlock date=""></DateBlock>
            <DateBlock date=""></DateBlock>
            <DateBlock date=""></DateBlock>
            <DateBlock date=""></DateBlock>
            <DateBlock date=""></DateBlock>
            <DateBlock date=""></DateBlock>
          </div>
        </div>

      </div>
    ) : (
      <div> Hello others </div>
    )
  )
}

export default App;