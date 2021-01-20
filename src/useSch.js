import { useState } from 'react'
// import { w3cwebsocket as W3CWebSocket } from 'websocket'

// const client = new W3CWebSocket('ws://localhost:4000')
const client = new WebSocket('ws://localhost:4000')

const useChat = () => {
  const [daySchedule, setDaySchedule] = useState([])
  client.onmessage = (message) => {
    const { data } = message
    const [task, payload] = JSON.parse(data)

    switch (task) {
      case "createSchedule":{
        setDaySchedule(()=>payload)
        break
      }
      case "deleteSchedule":{
        setDaySchedule(()=>payload)
        break
      }
      case "querySchedule":{
        setDaySchedule(()=>payload)
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
    let req_msg = ["deleteSchedule",payload]
    sendData(req_msg)
  }
  const deleteSchedule = (payload)=>{
    // paload = {id: schedule_id} e.g. {id: "137difh3829y"}
    let req_msg = ["deleteSchedule",payload]
    sendData(req_msg)
  }

  const querySchedule = (payload)=>{
    // paload = {
    //  year:  year,
    //  month: month,
    //  date:  day,
    //  id:    userid} 
    let req_msg = ["querySchedule",payload]
    sendData(req_msg)
  }

  return {
    createSchedule,
    deleteSchedule,
    querySchedule
  }
}

export default useChat

