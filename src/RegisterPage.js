import './App.css';
import React, { useEffect, useRef, useCallback, useState } from 'react'

const client = new WebSocket('ws://localhost:5000')

function RegisterPage({handleClickBack}) {
  const [account, setAccount] = useState('')
  const [password, setPassword] = useState('')
  const [checkpwd, setCheckPwd] = useState('')

  client.onmessage = (message) => {
    const [task, payload] = JSON.parse(message.data);
    let msg = document.getElementById("login-message")
    if(task === "registerRes") {
      if(payload === "Success") {
        msg.innerHTML = "Successfully signing up!!!"
        msg.style.color = "green"
        msg.style.display = "inline"
        setTimeout(() => {
          msg.style.display = "none"
          handleClickBack()
        }, 2000)
      }
      else if(payload === "Duplicate") {
        msg.innerHTML = "this account has been used!"
        msg.style.display = "inline"
        setTimeout(() => {
          msg.style.display = "none"
        }, 2000)
      }
      else {
        msg.innerHTML = "Wrong passwords, please try again!"
        msg.style.display = "inline"
        setTimeout(() => {
          msg.style.display = "none"
        }, 2000)
      }
    }
  }

  const handleRegisterInput = (e) => {
    if(e === "button" || e.keyCode === 13) {
      if(account !== "" && password !== "" && checkpwd !== "") {
        let rgtrData = ['register', {account: account, password: password, checkpwd: checkpwd}]
        client.send(JSON.stringify(rgtrData))
      }
      else {
        if(account === "") alert("account form must be filled")
        else alert("Password form must be filled")
      }
    }
  }

  return (
    <div className="container">
      <header> ChoChoMeet </header>
      <div className="message-box" id="login-message"></div>
      <div className="RegisterForm">
        <input type="text" onChange={(e) => setAccount(e.target.value)} placeholder="Enter new account" name="account" 
              onKeyUp={handleRegisterInput} required/>
        <br/>
        <input type="password" onChange={(e) => setPassword(e.target.value)} placeholder="Enter new password" name="psw" 
              onKeyUp={handleRegisterInput} required />
        <br/>
        <input type="password" onChange={(e) => setCheckPwd(e.target.value)} placeholder="Enter new password again" name="psw" 
              onKeyUp={handleRegisterInput} required />
        <div className="LoginButton">
          <button type="submit" onClick={handleRegisterInput.bind(this, "button")}> Sign Up </button>
          <button type="submit" onClick={handleClickBack}> Back </button>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage;
