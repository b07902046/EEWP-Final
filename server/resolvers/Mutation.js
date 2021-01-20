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
    JoinElection: async (parent, args, { db }, info)=>{
        let election = await Election.findOne({hash: args.data.hash})

        if(election.users.find(e => e === args.data.user) === undefined) {
            election.users.push(args.data.user)
        }
        election.save()
        return election
    },
    DecideElection: async (parent,args,{db},info)=>{
        // goal to decide the finalStart and finalEnd
        // get all the schedules and election(decided)
        let election = await Election.findById(args.data.election_id)
        let participants = election.users
        //console.log(election.start.getTime(), election.end.getTime())
        //console.log("participants: ",participants)
        
        let allRelatedSchedules = await Schedule.find({
                user:{$in:participants}})

        let allRelatedElections = await Election.find({
                users:{$in:participants},
                finalstart : {$ne:undefined}
            })
        //console.log("all related schedules : ",allRelatedSchedules)
        //console.log("all related elections : ",allRelatedElections)
        // start to check
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
        //console.log(fe,window)
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
        return election

    }
}

export { Mutation as default }
