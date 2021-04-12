// DEPLOYMENT TIMESTAMP in miliseconds.
// Update all tokens and values before production.
const DEPLOYMENT_TIMESTAMP = Date.now()

const { default: BigNumber } = require('bignumber.js')
const { writeFileSync } = require('fs')
const { join } = require('path')

const ERC20 = artifacts.require('ERC20')

const BYN = artifacts.require('StakingFactory')

const data = {
	reward_token: '',
	mock_token_1: '',
	mock_token_2: '',
	staking_factory: '',
	staking_factory_lp: '',
	byn_token: '0x6A1f09B3Afe036D595D5487C911bAd7cE271582B',
}

module.exports = function (deployer) {
	// deployer.deploy(Mock, 'Reward', 'RWD').then((reward) => {
	// return deployer.deploy(Mock2, 'Staking', 'STK').then(async (staking) => {
	const Beyond = new ERC20(data.byn_token)
	return deployer.deploy(BYN, data.byn_token, Math.floor(DEPLOYMENT_TIMESTAMP / 1000)).then(async (sf) => {
		data.reward_token = data['byn_token']
		data.mock_token_1 = data['byn_token']

		data.staking_factory = sf.address

		// return deployer.deploy(Mock2, 'StakingLP', 'STL').then(async (staking) => {
		// 	// 		//
		// 	return deployer.deploy(BYNLP, reward.address, Math.floor(Date.now() / 1000)).then(async (sf) => {
		await Beyond.approve(sf.address, new BigNumber(500000 * Math.pow(10, 18)))
		await Beyond.increaseAllowance(sf.address, new BigNumber(500000 * Math.pow(10, 18)))
		await sf.deploy(data.byn_token, new BigNumber(2000 * Math.pow(10, 18)))
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
