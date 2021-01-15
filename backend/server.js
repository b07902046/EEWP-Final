import dotenv from 'dotenv'
import GraphQLServer from 'graphql-yoga'
import PubSub from 'graphql-yoga'
import mongoose from 'mongoose'

dotenv.config()
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
})

const pubsub = new PubSub()

const server = new GraphQLServer({
  typeDefs: './server/schema.graphql',
  resolvers: {
  },
  context: {
    db,
    pubsub
  }
});

