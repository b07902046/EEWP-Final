import { GraphQLServer, PubSub } from 'graphql-yoga'
import Query from './resolvers/Query'
import Mutation from './resolvers/Mutation'
import Subscription from './resolvers/Subscription'
import bcrypt from 'bcrypt'
import { IntrospectionFragmentMatcher } from 'apollo-boost'
import { start } from 'repl'

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
          let base = schedule.start    // to compare date
          let user_id = schedule.user  // to filter

          Schedule.deleteOne({_id:payload.id},async function(err){
            if(err){
              sendData(['fail',err.message])
            }
            let data = await Schedule.find({user:user_id},null).exec();
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
            sendData(["createElection",newElection])
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
          let election = await Election.find({hash:payload.hash})
          if(election.users.find(e=> e === payload.user_id) === undefined){
            election.users.push(payload.user_id)
          }
          election.save()
          sendData(["joinElection",election])
          break
        }
        case "decideElection":{
          let election = await Election.findById(payload.election_id)
          let participants = election.users
          let allRelatedSchedules = await Schedule.find({
                user:{$in:participants}})
          let allRelatedElections = await Election.find({
                users:{$in:participants},
                finalstart : {$ne:undefined}
          })
          const TIME_LINE = 300000
          let fe = election.end.getTime()-election.start.getTime()
          //console.log("slots of fe : ",fe/TIME_LINE)
          let key = {}
          let table = []
          let table2= []
          let table_se = []
          let count = 0
          for(var i = 0 ;i < election.users.length;i++){
            key[election.users[i]] = count;
            count++;
            table.push([])
            table_se.push([])
            table2.push([])
          }
          allRelatedSchedules.map((s)=>{
            //console.log(s.user,key[s.user])
            table[key[s.user]].push((s.start.getTime()-election.start.getTime())/TIME_LINE)
            table[key[s.user]].push((s.end.getTime()-election.start.getTime())/TIME_LINE)

            table_se[key[s.user]].push(0)
            table_se[key[s.user]].push(1)

            table2[key[s.user]].push((s.start.getTime()-election.start.getTime())/TIME_LINE)
            table2[key[s.user]].push((s.end.getTime()-election.start.getTime())/TIME_LINE)
          })
          allRelatedElections.map((e)=>{
            e.map((u)=>{
                table[key[u]].push((e.finalStart.getTime()-election.start.getTime())/TIME_LINE)
                table[key[u]].push((e.finalEnd.getTime()-election.start.getTime())/TIME_LINE)

                table_se.push(0)
                table_se.push(1)

                table2[key[u]].push((e.finalStart.getTime()-election.start.getTime())/TIME_LINE)
                table2[key[u]].push((e.finalEnd.getTime()-election.start.getTime())/TIME_LINE)
            })
          })
          //sorting
          for (var i=0;i<count;i++){ 
            table[i].sort((a, b) => a - b)
          }
          // update election.finalstart final end
          let best_iter = 0,best_count =0
          fe = Math.floor((fe -election.expectedInterval* 60*1000)/TIME_LINE)+1
          let window = Math.ceil(election.expectedInterval*60*1000/TIME_LINE)
          for(var i= 0; i <= fe;i++){
            let tmpcount = 0
            for (var j=0;j<count;j++){
                if(table[j].find(e =>((e >= i) && e <= (i+window-1))) === undefined){
                    let maxmin = -1
                    let minmax = -1
                    for (var k =0;k <table[j].length;k++){
                        if(table[j][k] >= i){break}
                        else{maxmin = table[j][k]}
                    }
                    for (var k = table[j].length-1;k >=0;k--){
                        if(table[j][k] <= (i+window-1)){break}
                        else{minmax = table[j][k]}
                    }
                    if(maxmin === -1 || minmax === -1){
                        tmpcount++;
                        continue
                    }
                    let lr = table_se[j][table2[j].findIndex(e => e === maxmin)]
                    let rl = table_se[j][table2[j].findIndex(e => e === minmax)]
                    if(lr === 1 && rl === 0){
                        tmpcount++
                        continue
                    }
                }
            }
            //console.log(i,tmpcount)
            if(tmpcount > best_count){
                best_count = tmpcount
                best_iter = i
            }
          }
          console.log(best_count)
          let best_start =  election.start.getTime()+best_iter*TIME_LINE
          let best_end = best_start+(window-1)*TIME_LINE
          let st = new Date(best_start)
          let ed = new Date(best_end)
          election["finalStart"]=st
          election["finalEnd"]=ed
          election.save()
          //console.log(best_start)
          //console.log(best_end)
          console.log(st)
          console.log(ed)
          sendData(["decideElection"],election)
          break
        }  
        default: break
      }
    }
  })
})

const PORT = process.env.port || 5000

server.listen(PORT, () => {
  console.log(`Express listen on http://localhost:${PORT}`)
})

const pubSub = new PubSub()

const graphqlServer = new GraphQLServer({
  typeDefs: './server/src/schema.graphql',
  resolvers: {
    Query,
    Mutation,
    Subscription
  },
  context: {
    db,
    pubSub
  }
});


graphqlServer.start({ port: process.env.PORT | 4000 }, () => {
  console.log(`The server is up on port ${process.env.PORT | 4000}!`)
})
