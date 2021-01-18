import './App.css';
import React, { useEffect, useRef, useCallback, useState } from 'react'
import { useQuery, useMutation, useSubscription } from '@apollo/react-hooks'
import { SCHEDULE_QUERY } from './graphql/query'
import { CREATE_SCHEDULE_MUTATION } from './graphql/mutation'
import { SCHEDULE_SUBSCRIPTION } from './graphql/subscription'
import TimeInfoBlock from './components/TimeInfo'
import TimeLine from './components/TimeLine'

function Scheduling({userID: userID, year: year, month: month, day: day, handleAddSchedule: handleAddSchedule}) {
    const [color, setColor] = useState("#00FFFF")
    const [content, setContent] = useState("")
    const [title, setTitle] = useState("")

    const [colors, setColors] = useState([])

    const { subscribeToMore, ...result } = useQuery(SCHEDULE_QUERY, {
      variables: {
        query: userID
      }
    })
    const [addSchedule] = useMutation(CREATE_SCHEDULE_MUTATION)

    useEffect(() => {
      if(colors.length === 0) {
        let newColors = []
        for(let i = 0; i < 24; i++) {
        let cc = ["", "", "", "", "", "", "", "", "", "", "", ""]
        newColors.push(cc)
        }
        setColors(newColors)
      }
    }, [colors])

  
    return (
      <div className="container">
        <header> ChoChoMeet </header>
        <h1> {year}. {month}. {day}. </h1>
        <form>
          <input type="color" value={color} onChange={(e) => setColor(e.target.value)}/>
        </form>
        <div className="timeline">
          {colors.map((tp, index) => <TimeLine year={year} month={month} day={day} hour={index} colors={tp} userID={userID} color={color}
          key={index}></TimeLine>)}
        </div>
        <div className="schedularForm">
          <input className="scheduleTitle" placeholder="add title" onChange={(e) => setTitle(e.target.value)}/>
          <textarea className="scheduleContent" placeholder="add contents" rows="5" onChange={(e) => setContent(e.target.value)}/>
          <button type="submit" onClick={handleAddSchedule}> Add </button>
        </div>
      </div>
      
    )
  }
  
  export default Scheduling
  