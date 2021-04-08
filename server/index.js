const express = require('express')

const app = express()

const port = process.env.PORT || 8080

const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema(
	{
		account: { type: String, unique: true },
		staked_tokens: { type: Number, default: 0 },
	},
	{
		timestamps: true,
	}
)

const UserModel = mongoose.model('User', UserSchema, 'User')

app.post('/add', async (req, res) => {
	const { account } = req.body
	let user = await UserModel.findOne({
		account,
	})
	if (user === null) {
		user = new UserModel({
			account,
		})
	}
	user.staked_tokens += user.staked_tokens
	res.status(200).send()
})

app.listen(port, () => {
	console.log(`Listeining on port ${port}`)
})
