import './App.css';
import React, { useEffect, useRef, useCallback, useState } from 'react'
import { useQuery, useMutation } from '@apollo/react-hooks'
import TimeLine from './components/TimeLine';
import { ELECTIONHASH_SCHEDULE_QUERY } from './graphql/query';
import { VOTE_MUTATION } from './graphql/mutation';

function VoteInfo(hour, colors, titles) {
    this.hour = hour
    this.colors = colors
    this.titles = titles
}

function Vote({hash, userID}) {
    const { loading, error, data } = useQuery(ELECTIONHASH_SCHEDULE_QUERY, {
      variables: { hash: hash, user: userID}
    })
    const [year, setYear] = useState(new Date().getFullYear())
    const [month, setMonth] = useState(new Date().getMonth() + 1)
    const [day, setDay] = useState(new Date().getDate())

    const [startTime, setStartTime] = useState(new Date())
    const [endTime, setEndTime] = useState(new Date())

    const [voteInfo, setVoteInfo] = useState([])
    const [mouseStatus, setMouseStatus] = useState(false)
    const [cursBeg, setCursBeg] = useState(undefined)
    const [cursEnd, setCursEnd] = useState(undefined)
    const [votes, setVotes] = useState([])

    const [addVote] = useMutation(VOTE_MUTATION)

    document.addEventListener('mousedown', () => {
      setMouseStatus(true)
    })
    
    document.addEventListener('mouseup', () => {
      setMouseStatus(false)
    })

    const handleDragOut = (minute, e) => {
      if(mouseStatus) {
        e.target.style.backgroundColor = "#008000"
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

    const handleAddVote = (e) => {
      if(votes.length === 0) {
        alert("Please vote")
        return
      }
      let newStarts = []
      let newEnds = []
      for(let i = 0; i < votes.length; i++) {
        let sh = Math.floor(votes[i][0] / 60)
        let sm = votes[i][0] % 60
        let eh = Math.floor(votes[i][1] / 60)
        let em = votes[i][1] % 60
        
        let ss = year.toString() + " " + month.toString() + " " + day.toString() + " " + sh.toString() + ":" + sm.toString()
        let es = year.toString() + " " + month.toString() + " " + day.toString() + " " + eh.toString() + ":" + em.toString()

        newStarts.push(ss)
        newEnds.push(es)
      }
      addVote({
        variables: {
          user: userID,
          hash: hash,
          starts: newStarts,
          ends: newEnds
        }
      })
      setVotes([])
    }

    const handleCancel = () => {
      let sh = startTime.getHours()
      for(let i = 0; i < votes.length; i++) {
        for(let j = votes[i][0]; j <= votes[i][1]; j+=5) {
          let h = Math.floor(j / 60)
          let m = Math.floor((j % 60) / 5)
          let eid = "timeline" + (h * 60).toString() + m.toString()
          document.getElementById(eid).style.backgroundColor = voteInfo[h - sh].colors[m]
        }
      }
      // for(let i = startTime; i <= endTime; i+=5) {
      //   let h = Math.floor(i / 60)
      //   let m = Math.floor((i % 60) / 5)
      //   let eid = "timeline" + (h * 60).toString() + m.toString()
      //   document.getElementById(eid).style.backgroundColor = timePointer[h].colors[m]
      // }
      // setStartTime(undefined)
      // setEndTime(undefined)
    }

    useEffect(() => {
      if(mouseStatus === false && cursBeg !== undefined && cursEnd !== undefined) {
        let beg = cursBeg
        let end = cursEnd
        setVotes([...votes, [beg, end]])
        setCursBeg(undefined)
        setCursEnd(undefined)
      }
    }, [mouseStatus, cursBeg, cursEnd])

    useEffect(() => {
      if(data) {
        if(data.ElectionHashQuery.length === 0) {
          alert("hash not found...")
          window.location = "http://localhost:3000/"
        }
        else {
          let newData = data.ElectionHashQuery[0]
          setStartTime(new Date(parseInt(newData.start)))
          setEndTime(new Date(parseInt(newData.end)))
          
        }
      }
    }, [data])

    useEffect(() => {
      let cy = startTime.getFullYear()
      let cm = startTime.getMonth() + 1
      let cd = startTime.getDate()

      let sh = startTime.getHours()
      let sm = startTime.getMinutes()
      let eh = endTime.getHours()
      let em = endTime.getMinutes()

      setYear(cy)
      setMonth(cm)
      setDay(cd)

      let newVoteInfo = []
      for(let i = sh; i <= eh; i++) {
        let colors = ["", "", "", "", "", "", "", "", "", "", "", ""]
        let titles = ["", "", "", "", "", "", "", "", "", "", "", ""]
        for(let j = 0; j < 12; j++) {
          if((i < sh && j * 5 <= sm) || (i >= eh && j * 5 >= em)) {
              colors[j] = "#ddd"
          }
        }
        newVoteInfo.push(new VoteInfo(i, colors, titles))
      }
      if(data) {
          for(let i = 0; i < data.Schedules.length; i++) {
            let sdate = new Date(parseInt(data.Schedules[i].start))
            let edate = new Date(parseInt(data.Schedules[i].end))
            
            let ny = sdate.getFullYear()
            let nm = sdate.getMonth() + 1
            let nd = sdate.getDate()

            if(ny === cy && nm === cm && nd === cd) {
                let shash = sdate.getHours() * 60 + sdate.getMinutes()
                let ehash = edate.getHours() * 60 + edate.getMinutes()
                
                for(let j = shash; j <= ehash; j++) {
                    let h = Math.floor(j / 60)
                    let m = Math.floor((j % 60 ) / 5)
                    if(h >= sh && h <= eh) {
                      if(newVoteInfo[h - sh].colors[m] === "") newVoteInfo[h - sh].colors[m] = data.Schedules[i].color + "80"
                      newVoteInfo[h - sh].titles[m] = data.Schedules[i].title
                    } 
                }             
            }
          }
      }
      setVoteInfo(newVoteInfo)

    }, [startTime, endTime])

    return (
    <div className="container">
      <header> ChoChoMeet </header>
      <h1> {year}. {month}. {day}. </h1>
      <h3>
        {startTime.getHours()}:{startTime.getMinutes()}
        {" ~ "}
        {endTime.getHours()}:{endTime.getMinutes()}
      </h3>
      <div className="timeline">
        {voteInfo.map((vi, index) => <TimeLine year={year} month={month} day={day} hour={vi.hour} colors={vi.colors}
        titles={vi.titles} onMouseOut={handleDragOut} onMouseOver={handleDragOver} key={index}></TimeLine>)}
      </div>
      <div className="voteFunctional">
        <button className="vote-button" type="submit" onClick={handleCancel}> cancel </button>
        <button className="vote-button" type="submit" onClick={handleAddVote}> vote </button>
      </div>
    </div>
  )
}

export default Vote;
