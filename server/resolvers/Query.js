import Schedule from '../models/schedule'
import Election from '../models/election'
const Message = require('../models/message')
const Register = require('../models/register')

const Query = {
  Messages(parent, args, { db }, info) {
    async function getMessage() {
      let data = await Message.find().sort({ _id: 1 })
      if(!args.query) return data
      return data.filter(msg => msg.sender.toLowerCase().includes(args.query.toLowerCase()))
    }
    let data = getMessage()
    
    return data
  },
  Registers: async (parent, args, { db }, info) => {
    let data = await Register.find();
    if(!args.query) return data
    else {
      return data.filter(register => {
        return register.account.includes(args.query)
      })
    }
  },
  Schedules: async (parent, args, { db }, info) => {
    let data = await Schedule.find();
    if(!args.query) return data
    else {
      return data.filter(schedule => {
        return schedule.user === args.query
      })
    }
  },
  Elections: async (parent, args, { db }, info) => {
    let data = await Election.find();
    // 回傳所有election
    // 回傳 election.users 含有此 query 的 election
    if(!args.query) return data
    else {
      return data.filter(election => 
        (election.users.find(user=> user === args.query) !== undefined))
    }
  },
  ElectionHashQuery: async (parent, args, { db }, info) => {
    let data = await Election.find()
    return data.filter(election => {
      return election.hash === args.query
    })
  }
}

export { Query as default }
