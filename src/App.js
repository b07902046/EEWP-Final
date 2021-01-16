import './App.css';
import RegisterPage from './RegisterPage'
import React, { useEffect, useRef, useCallback, useState } from 'react'
import { useQuery, useMutation } from '@apollo/react-hooks'
import { REGISTER_QUERY } from './graphql/query'
import { unstable_renderSubtreeIntoContainer } from 'react-dom';

const client = new WebSocket('ws://localhost:5000')

function App() {
  const [event, setEvent] = useState('login')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const { loading, error, data, subscribeToMore } = useQuery(REGISTER_QUERY, {
    variables: {query: username}
  })

  client.onmessage = (message) => {
    const [task, payload] = JSON.parse(message.data);
    console.log(task)
    console.log(payload)
  }

  const handleLoginInput = (e) => {
    if(e === "button" || e.keyCode === 13) {
      if(username !== "" && password !== "") {
        console.log(data.Registers)
        let rgtrData = ['login', {username: username, password: password}]
        client.send(JSON.stringify(rgtrData))
      }
      else {
        if(username === "") alert("Username form must be filled")
        else alert("Password form must be filled")
      }
    }
  }

  const handleRegister = () => {
    setEvent("register")
  }

  return (
    (event === "login")? (
      <div className="container">
        <header> ChoChoMeet </header>
        <div className="LoginForm">
          <input type="text" onChange={(e) => setUsername(e.target.value)} placeholder="Enter Username" name="username" 
                onKeyUp={handleLoginInput} required/>
          <br/>
          <input type="password" onChange={(e) => setPassword(e.target.value)} placeholder="Enter Password" name="psw" 
                onKeyUp={handleLoginInput} required />
          <div className="LoginButton">
            <button type="submit" onClick={handleLoginInput.bind(this, 'button')}> Login </button>
            <button type="submit" onClick={handleRegister}> Sign Up </button>
          </div>
        </div>
      </div>
    ) : (event === "register")? (
      <RegisterPage></RegisterPage>
    ) : (
      <div> Hello others </div>
    )
  )
}

export default App;