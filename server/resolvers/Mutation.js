const Message = require('../models/message')
const Register = require('../models/register')
const Schedule = require('../models/schedule')

const Mutation = {
    CreateMessage(parent, args, { db, pubSub }, info) {
        const msg = {
            ...args.data
        }
        Message.insertMany(msg)

        pubSub.publish(`Message`, {
            Message: {
                sender: msg.sender,
                body: msg.body,
                receiver: msg.receiver
            }
        })

        return msg
    },
    DeleteMessage(parent, args, { db, pubSub }, info) {
        console.log('arg: ' + args.data)
        if(!args.data) {
            Message.deleteMany().then(function() {console.log("Deleted")})
        }
        else {
            Message.deleteMany({sender: args.data}).then(function() {console.log("Deleted")})
            return args.data
        }
    },
    CreateRegister(parent, args, { db, pubSub }, info) {
        const rgtr = {
            ...args.data
        }
        Register.insertMany(rgtr).catch((err) => console.log(err))

        pubSub.publish(`Register`, {
            Register: {
                account: rgtr.account,
                password: rgtr.password
            }
        })
        return rgtr
    },
    CreateSchedule(parent, args, { db, pubSub }, info) {
        const schedule = {
            ...args.data
        }
        Schedule.insertMany(schedule).catch((err) => console.log(err))
        
        return schedule
    }
}

export { Mutation as default }