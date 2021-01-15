import './App.css';
import React, { useEffect, useRef, useCallback, useState } from 'react'
import { useQuery, useMutation } from '@apollo/react-hooks'
import { REGISTER_QUERY } from './graphql/query'

function App() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const { loading, error, data, subscribeToMore } = useQuery(REGISTER_QUERY, {
    variables: {query: username}
  })

  const handleLoginInput = (e) => {
    if(e.keyCode === 13 && username !== '' && password !== '') {
      console.log(data.Registers)
    }
  }

  return (
    <div className="container">
	    <p> ChoChoMeet </p>
      <div className="LoginForm">
        <input type="text" onChange={(e) => setUsername(e.target.value)} placeholder="Enter Username" name="username" 
               onKeyUp={handleLoginInput} required/>
        <br/>
        <input type="password" onChange={(e) => setPassword(e.target.value)} placeholder="Enter Password" name="psw" 
               onKeyUp={handleLoginInput} required />
        <div className="LoginButton">
          <button type="submit"> Login </button>
          <button type="submit"> Sign Up </button>
        </div>
      </div>
    </div>
  );
}

export default App;