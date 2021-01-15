const Message = require('../models/message')

const Subscription = {
    Message: {
      subscribe(parent, args, { db, pubSub }, info) {
  
        return pubSub.asyncIterator(`Message`)
      }
    }
  }
  
  export { Subscription as default }
  