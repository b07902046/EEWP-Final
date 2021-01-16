import './App.css';
import React, { useEffect, useRef, useCallback, useState } from 'react'

const client = new WebSocket('ws://localhost:5000')

function RegisterPage() {
  const [account, setAccount] = useState('')
  const [password, setPassword] = useState('')
  const [checkpwd, setCheckPwd] = useState('')

  client.onmessage = (message) => {
    const [task, payload] = JSON.parse(message.data);
    console.log(task)
    console.log(payload)
  }

  const handleRegisterInput = (e) => {
    if(e === "button" || e.keyCode === 13) {
      if(account !== "" && password !== "" && checkpwd !== "") {
        console.log(account)
        console.log(password)
        console.log(checkpwd)
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
      <div className="RegisterForm">
        <input type="text" onChange={(e) => setAccount(e.target.value)} placeholder="Enter new account" name="account" 
              onKeyUp={handleRegisterInput} required/>
        <br/>
        <input type="password" onChange={(e) => setPassword(e.target.value)} placeholder="Enter new Password" name="psw" 
              onKeyUp={handleRegisterInput} required />
        <br/>
        <input type="password" onChange={(e) => setCheckPwd(e.target.value)} placeholder="Enter new Password again" name="psw" 
              onKeyUp={handleRegisterInput} required />
        <div className="LoginButton">
          <button type="submit"> Sign Up </button>
          <button type="submit"> Back </button>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage;