import bcrypt from 'bcrypt'

// express and websocket
const http = require('http')
const express = require('express')
const WebSocket = require('ws')

const app = express()
const server = http.createServer(app)
const wss = new WebSocket.Server({ server })

// database and schema
require('dotenv-defaults').config()
const mongoose = require('mongoose')
const Register = require('./models/register')
const Schedule = require('./models/schedule')
const Election = require('./models/election')
const Vote = require('./models/vote')
// bcrypt
const bcryptHash = '$2a$10$fok18OT0R#cWoR0a.VsjjuuYZV.XrfdYd5CpDWrYkhi1F0i8ABp6e'

if (!process.env.MONGO_URL) {
  console.error('Missing MONGO_URL!!!')
  process.exit(1)
}

// Schedule.deleteMany({}, (err) => {
//   console.log("deleted")
// })

// Register.deleteMany({}, (err) => {
//   console.log("deleted")
// })

// Election.deleteMany({}, (err) => {
//   console.log(err)
// })

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

const db = mongoose.connection

db.on('error', (error) => {
  console.error(error)
})

db.once('open', () => {
  console.log('MongoDB connected!')
  wss.on('connection', ws => {
    const sendData = (data) => {
      ws.send(JSON.stringify(data));
    };
    ws.onmessage = async (message) => {
      const { data } = message
      const [task, payload] = JSON.parse(data)
      switch(task) {
        case "login": {
          let rData = await Register.find({account: payload.account})
          let index = -1
          for(let i = 0; i < rData.length; i++) {
            let res = await bcrypt.compare(payload.password, rData[i].password)
            if(res) {
              index = i
              break
            }
          }
          if(index === -1) {
            ws.send(JSON.stringify(['loginRes', "Fail"]))
          }
          else {
            let sid = String(rData[index]._id)
            // let oid = new mongoose.Types.ObjectId(sid)
            // let t = await Register.find({_id: sid})
            ws.send(JSON.stringify(["loginRes", sid]))
          }
          break
        }
        case "register": {
          let hashedPasswd = await bcrypt.hash(payload.password, bcryptHash)
          bcrypt.compare(payload.checkpwd, hashedPasswd, async (err, res) => {
            if(res) {
              let rData = await Register.find({account: payload.account})
              if(rData.length > 0) ws.send(JSON.stringify(['registerRes', 'Duplicate']))
              else {
                Register.insertMany([{account: payload.account, password: hashedPasswd}])
                ws.send(JSON.stringify(['registerRes', 'Success']))
              }
            }
            else {
              ws.send(JSON.stringify(['registerRes', 'Fail']))
            }
          })
          break
        }
        case "createSchedule": {
          // return date schedule
          const info = payload;
          let newSchedule = new Schedule(info)
          newSchedule.save(async function(err){
            if(err){
              sendData(["fail",err.message])
            }
            let data = await Schedule.find({user:payload.user},null).exec();
            sendData(["createSchedule",data])
          })
          break 
        }
        case "querySchedule": {
          let data = await Schedule.find({user:payload.user})
          sendData(["querySchedule",data])
          break
        }
        case "deleteSchedule":{
          // payload = id, user_id
          // return date schedule
          let schedule = await Schedule.find({_id:payload.id})
          Schedule.deleteOne({_id:payload.id},async function(err){
            if(err){
              sendData(['fail',err.message])
            }
            let data = await Schedule.find();
            sendData(["deleteSchedule",data])
          })
          break
        }
        case "createElection": {
          const info = payload;
          let newElection = new Election(info)
          newElection.save(async function(err){
            if(err){
              sendData(["fail",err.message])
            }
            // let data = await Election.find({
            //   users: $in [payload.eventStarter]
            // })
            let data = await Election.find()
            let datelist = data.filter(e=>(e.users.find(u => u === payload.eventStarter)!== undefined))
            sendData(["createElection", datelist])
          })
          break
        }
        case "queryElection": {
          let data = await Election.find({}, null).exec();
          if(payload === undefined){
            sendData(["queryElection",data])
          }
          else{
            let msg =data.filter(election => (election.users.find(user=> user === payload.user) !== undefined))
            sendData(["queryElection",msg])
          }
          break
        }
        case "joinElection": {
          // payload = hash, user_id
          let election = await Election.findOne({hash:payload.hash})
          if(election.users.find(e=> e === payload.user_id) === undefined){
            election.users.push(payload.user_id)
          }
          election.save()
          sendData(["joinElection",election])
          break
        }
        case "decideElection":{
          const TIME_SPACE = 300000
          let election = await Election.find({hash:payload.hash})
          let timeslot = [] // n*x
          let key = {} //user name -> index
          let ts = new Date(election[0].start)
          let te = new Date(election[0].end)
          let feasible = (te.getTime()-ts.getTime())/TIME_SPACE
          let final = []
          for(var i = 0;i < feasible+1;i++){
              timeslot.push([])
          }
          for(var i = 0 ;i < election[0].users.length;i++){
            key[election[0].users[i]] = i;
            let vote = await Vote.find({
                user: election[0].users[i],
                hash: election[0].hash
            })
            let st = []
            let ed = []
            for(var k = 0; k < vote[0].starts.length;k++){
                st.push(vote[0].starts[k])
                ed.push(vote[0].ends[k])
            }
            st.sort((a,b)=>{
                let t1 = new Date(a)
                let t2 = new Date(b)
                return t1.getTime()- t2.getTime()})
            ed.sort((a,b)=>{
                let t1 = new Date(a)
                let t2 = new Date(b)
                return t1.getTime()- t2.getTime()})
            
            for(var k =0;k < st.length;k++){
                let t1 = new Date(st[k])
                let t2 = new Date(ed[k])
                st[k] = (t1.getTime()-ts.getTime())/TIME_SPACE
                ed[k] = (t2.getTime()-ts.getTime())/TIME_SPACE
            }
            
            let iter = 0
            for(var j = 0;j < feasible+1;j++){
                let ok = 0
                if(iter < st.length){
                    while(j > ed[iter]){
                    iter++
                    }
                    if(j >= st[iter]){
                        ok = 1
                    }
                }
                timeslot[j].push(ok)
            }
        }
        //console.log(timeslot)
        for(var i = 0;i < feasible+1;i++){
            final.push(timeslot[i].reduce((a,b)=>(a+b)))
        }
        //console.log(final)
        let max_people = -1
        let max_length = 0
        let count_length = 0
        let count_st = 0
        let max_st = 0
        for(var i = 0;i < feasible+1;i++){
            if(final[i] > max_people){
                max_people = final[i]
                max_length = 0
                count_length= 0
                count_st = i
                max_st = i
            }
            else if(final[i] === max_people) {
                if(final[i-1] < final[i])
                {
                    count_length= 0
                    count_st = i
                }
                count_length++
            }
            else{
                if(count_length > max_length){
                    max_st = count_st
                    max_length = count_length
                }
                count_length  = 0
            }
        } 
        //console.log(max_st,max_length)
        let best_st = ts.getTime()+max_st*TIME_SPACE
        let best_ed = best_st + (max_length-1)*TIME_SPACE
        let st_time = new Date(best_st)
        let ed_time = new Date(best_ed)
        console.log(st_time,ed_time)
        election[0]["finalStart"] = st_time
        election[0]["finalEnd"] = ed_time
        election[0].save()
        sendData(["decideElection",election[0]])
        break
        } 
        case "createVote":{
          Vote.insertMany(payload)
          break
        }
        case "queryElectionHash": {
          let election = await Election.findOne(payload)
          if(!election) {
            ws.send(JSON.stringify(["queryElectionHashRes", "Fail"]))
          }
          else {
            ws.send(JSON.stringify(["queryElectionHashRes", election]))
          }
          break
        }
        default: {
          break
        }
      }
    }
  })
})

const PORT = process.env.port || 5000

server.listen(PORT, () => {
  console.log(`Express listen on http://localhost:${PORT}`)
})
