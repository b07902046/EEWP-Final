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

// bcrypt
const bcryptHash = '$2a$10$fok18OT0R#cWoR0a.VsjjuuYZV.XrfdYd5CpDWrYkhi1F0i8ABp6e'

if (!process.env.MONGO_URL) {
  console.error('Missing MONGO_URL!!!')
  process.exit(1)
}

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
          let hashedPasswd = await bcrypt.hash(payload.password, bcryptHash)
          let rData = await Register.find({username: payload.username, password: hashedPasswd})
          console.log(hashedPasswd)
          ws.send(JSON.stringify(['loginRes', rData.length]))
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