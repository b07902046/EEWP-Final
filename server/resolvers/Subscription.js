const Message = require('../models/message')
const Schedule = require('../models/schedule')

const Subscription = {
    Message: {
      subscribe(parent, args, { db, pubSub }, info) {
  
        return pubSub.asyncIterator(`Message`)
      }
    },
    Schedule: {
      subscribe(parent, { user }, { db, pubSub }, info) {
        return pubSub.asyncIterator(`Schedule ${user}`)
      }
    },
    Election: {
      subscribe(parent, { user }, { db, pubSub }, info) {
        return pubSub.asyncIterator(`Election ${user}`)
      }
    },
    ElectionDecide: {
      subscribe(parent, { hash }, { db, pubSub }, info) {
        return pubSub.asyncIterator(`ElectionDecide ${hash}`)
      }
    }
  }
  
  export { Subscription as default }
  