import { GraphQLServer, PubSub } from 'graphql-yoga'
import Query from './resolvers/Query'
import Mutation from './resolvers/Mutation'
import Subscription from './resolvers/Subscription'
import bcrypt from 'bcrypt'
import { IntrospectionFragmentMatcher } from 'apollo-boost'

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
