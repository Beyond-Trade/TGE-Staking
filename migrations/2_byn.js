// DEPLOYMENT TIMESTAMP in miliseconds.
// Update all tokens and values before production.
const DEPLOYMENT_TIMESTAMP = Date.now()

const { default: BigNumber } = require('bignumber.js')
const { writeFileSync } = require('fs')
const { join } = require('path')

const Mock = artifacts.require('Mock')
const Mock2 = artifacts.require('Mock2')
const BYN = artifacts.require('StakingFactory')
const BYNLP = artifacts.require('StakingFactoryLP')

const data = {
	reward_token: '',
	mock_token_1: '',
	mock_token_2: '',
	staking_factory: '',
	staking_factory_lp: '',
	byn_token: '0xdC38F1EE45F232578026BF41fd843C543B8F89D1',
}

module.exports = function (deployer) {
	// deployer.deploy(Mock, 'Reward', 'RWD').then((reward) => {
	// return deployer.deploy(Mock2, 'Staking', 'STK').then(async (staking) => {
	return deployer.deploy(BYN, data.byn_token, Math.floor(DEPLOYMENT_TIMESTAMP / 1000)).then(async (sf) => {
		// await reward.approve(sf.address, new BigNumber(2000 * Math.pow(10, 18)))
		// await reward.increaseAllowance(sf.address, new BigNumber(2000 * Math.pow(10, 18)))

		data.reward_token = data['byn_token']
		data.mock_token_1 = data['byn_token']

		data.staking_factory = sf.address

		// return sf.deploy(data.byn_token, new BigNumber(2000 * Math.pow(10, 18))).then(async () => {
		// return deployer.deploy(Mock2, 'StakingLP', 'STL').then(async (staking) => {
		// 	// 		//
		// 	return deployer.deploy(BYNLP, reward.address, Math.floor(Date.now() / 1000)).then(async (sf) => {
		// 		await reward.approve(sf.address, new BigNumber(500000 * Math.pow(10, 18)))
		// 		await reward.increaseAllowance(sf.address, new BigNumber(500000 * Math.pow(10, 18)))
		// 		data.mock_token_2 = staking.address
		// 		data.staking_factory_lp = sf.address
		return writeFileSync(join(__dirname, '..', 'client', 'src', 'addresses.json'), JSON.stringify(data, undefined, 4))
		// return sf.deploy(staking.address, new BigNumber(500000 * Math.pow(10, 18))).then(async () => {
		// return
		// })
		// })
		// })
	})
	// })
}
