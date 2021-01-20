import { useState } from 'react'
// import { w3cwebsocket as W3CWebSocket } from 'websocket'

// const client = new W3CWebSocket('ws://localhost:4000')
const client = new WebSocket('ws://localhost:5000')

const useChat = () => {
  const [Schedules, setSchedules] = useState([])
  const [Elections, setElections] = useState([])
  client.onmessage = (message) => {
    const { data } = message
    const [task, payload] = JSON.parse(data)

    switch (task) {
      case "createSchedule":{
        
        if(payload === null) setSchedules([]); 
        else if(payload === undefined) setSchedules([]); 
        else{
          payload.sort((a, b) => { return parseInt(a.start) - parseInt(b.start) })
          setSchedules(()=>payload)
        }
        break
      }
      case "deleteSchedule":{
        
        if(payload === null) setSchedules([]); 
        else if(payload === undefined) setSchedules([]); 
        else{
          setSchedules(()=>payload)
        }
        break
      }
      case "querySchedule":{
        if(payload === null) setSchedules([]); 
        else if(payload === undefined) setSchedules([]); 
        else{
          setSchedules(()=>payload)
        }
        break
      }
      case "queryElection":{
        if(payload === null) {
          console.log("1") 
          setElections([]); }
        else if(payload === undefined) {
          console.log("2") 
          setElections([]);}
        else{
          setElections(()=>payload)
        }
        break
      }
      case "createElection":{
        if(payload === null) setElections([]); 
        else if(payload === undefined) setElections([]); 
        else{
          setElections(payload)
        }
        break
      }
      default:
        break
    }
  }

  client.onopen = () => {
  }

  const sendData = (data) => {
    // TODO
    client.send(JSON.stringify(data))
  }
  const createSchedule = (payload)=>{
    let req_msg = ["createSchedule",payload]
    sendData(req_msg)
  }
  const createElection = (payload)=>{
    let req_msg = ["createElection",payload]
    sendData(req_msg)
  }
  const deleteSchedule = (payload)=>{
    // paload = {id: schedule_id,user_id: realId} e.g. {id: "137difh3829y"}
    let req_msg = ["deleteSchedule",payload]
    sendData(req_msg)
  }

  const querySchedule = (payload)=>{
    // paload = {
    //  user:    account} 
    let req_msg = ["querySchedule",payload]
    sendData(req_msg)
  }
  const queryElection = (payload)=>{
    // paload = {
    //  user:    account} 
    let req_msg = ["queryElection",payload]
    sendData(req_msg)
  }

  return {
    createSchedule,
    deleteSchedule,
    querySchedule,
    createElection,
    queryElection,
    Elections,
    Schedules,
    setSchedules,
    setElections
  }
}

export default useChat

