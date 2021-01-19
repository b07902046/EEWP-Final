const Message = require('../models/message')
const Register = require('../models/register')
const Schedule = require('../models/schedule')
const Election = require('../models/election')

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
        //console.log(123)
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

        pubSub.publish(`Schedule ${schedule.user}`, {
            Schedule: {...schedule}
        })
        
        return schedule
    },
    CreateElection(parent,args,{db,pubSub},info){
        const election = {
            ...args.data
        }
        Election.insertMany(election).catch((err) => console.log(err))
        // for sunscription
        pubSub.publish(`Election ${election.eventStarter}`, {
            Election: {...election}
        })
        return election
    },
    JoinElection: async (parent,args,{db,pubSub},info)=>{
        let election = await Election.findById(args.data.election_id)
        if(election.users.find(e=> e === args.data.user_id) === undefined){
            election.users.push(args.data.user_id)
        }
        election.save()
        // for sunscription
        pubSub.publish(`Election ${election.eventStarter}`, {
            Election: {...election}
        })
        return election
    },
    DecideElection: async (parent,args,{db},info)=>{
        // goal to decide the finalStart and finalEnd
        // get all the schedules and election(decided)
        let election = await Election.findById(args.data.election_id)
        let participants = election.users
        console.log(participants)
        let allRelatedSchedules =[] // [schedules1, schedules2...]
        participants.map( async (user)=>{
            let tmp =  await Schedule.find({user:user})
            allRelatedSchedules.concat(tmp)
        })
        let allRelatedElections = await Election.find({
                users:{$in:participants},
                finalstart : {$ne:undefined}
            })
        console.log(allRelatedElections)
        // start to check
        let fs = 0
        let fe = election.end.getTime()-election.start.getTime()
        let Tstart =[]
        let Tend = []
        let Tuser = []
        allRelatedSchedules.map((s)=>{
            Tstart.push(s.start.getTime()-election.start.getTime())
            Tend.push(s.end.getTime()-election.start.getTime())
        })
        allRelatedElections.map((e)=>{
            Tstart.push(e.finalStart.getTime()-election.start.getTime())
            Tend.push(e.finalEnd.getTime()-election.start.getTime())
        })
        // update election.finalstart final end
        return election

    }
}

export { Mutation as default }
