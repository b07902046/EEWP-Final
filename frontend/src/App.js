import './App.css';
import React, { useEffect, useRef, useCallback, useState } from 'react'
import { useQuery, useMutation } from '@apollo/react-hooks'

function App() {
  const [isLogin, setLogin] = useState(false);

  return (
    <div className="container">
	    <p> ChoChoMeet </p>
      <div className="LoginForm">
        <input type="text" placeholder="Enter Username" name="username" required />
        <input type="password" placeholder="Enter Password" name="psw" required />
        <div className="LoginButton">
          <button type="submit"> Login </button>
          <button type="submit"> Sign Up </button>
        </div>
      </div>
    </div>
  );
}

export default App;
