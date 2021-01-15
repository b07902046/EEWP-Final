const Message = require('../models/message')
const Register = require('../models/register')
const mongoose = require('mongoose')

const Query = {
  Messages(parent, args, { db }, info) {
    async function getMessage() {
      let data = await Message.find().sort({ _id: 1 })
      if(!args.query) return data
      return data.filter(msg => msg.sender.toLowerCase().includes(args.query.toLowerCase()))
    }
    let data = getMessage()
    
    return data

  }
}

export { Query as default }