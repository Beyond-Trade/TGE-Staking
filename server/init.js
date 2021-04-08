require('dotenv').config()

const mongoose = require('mongoose')
const assert = require('assert')

let link
if (process.env.ENV === 'testing') {
	link = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}/${process.env.DB_NAME}`
} else {
	link = `mongodb://${process.env.DB_HOST}/${process.env.DB_NAME}`
	// link = 'mongodb://172.17.0.2/DataBase?retryWrites=true&w=majority'
}

console.log(link)

const connect = async () => {
	let connection = await mongoose.connect(link, {
		useUnifiedTopology: true,
		useNewUrlParser: true,
		useFindAndModify: false,
		useCreateIndex: true,
		//user:"admin",
		//password:"Pass@1234"
	})
	assert(connection === mongoose && 'Failed to connect')
	if (!process.env.test) console.log('Connection OK from TextEdit=>' + process.env.DB_NAME)
	return connection
}

module.exports = connect()
