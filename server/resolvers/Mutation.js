const Message = require('../models/message')
const Register = require('../models/register')
const Schedule = require('../models/schedule')
const Election = require('../models/election')
const Vote = require('../models/vote')

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
    JoinElection: async (parent, args, { db }, info)=>{
        let election = await Election.findOne({hash: args.data.hash})

        if(election.users.find(e => e === args.data.user) === undefined) {
            election.users.push(args.data.user)
        }
        election.save()
        return election
    },
    DecideElection: async (parent, args, { db, pubSub }, info)=>{
        const TIME_SPACE = 300000
        let election = await Election.find({hash:args.data.hash})
        let participants = election[0].users
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

        pubSub.publish(`ElectionDecide ${args.data.hash}`, {
            Election: {
                eventStarter: election[0].eventStarter,
                start: election[0].start,
                end: election[0].end,
                color: election[0].color,
                title: election[0].title,
                content: election[0].content,
                finalStart: election[0].finalStart,
                finalEnd: election[0].finalEnd,
                users: election[0].users,
                hash: election[0].hash,
                expectedInterval: election[0].expectedInterval
            }
        })
        
        return election[0]
    },
    CreateVote(parent, args, { db, pubSub }, info) {
        const vote = {...args.data}
        Vote.insertMany(vote)

        return vote
    }
}

export { Mutation as default }
