// DEPLOYMENT TIMESTAMP in miliseconds.
// Update all tokens and values before production.
const DEPLOYMENT_TIMESTAMP = Date.now()

const { default: BigNumber } = require('bignumber.js')
const { writeFileSync } = require('fs')
const { join } = require('path')

const Staking = artifacts.require('Staking')

const BYN = artifacts.require('StakingFactory')

const BeyondArt = artifacts.require('BYN')

const data = {
	reward_token: '',
	mock_token_1: '',
	mock_token_2: '',
	staking_factory: '',
	staking_factory_lp: '',
	// Only byn_token needs to be updated. Rest will added by the script.
	byn_token: '0x40177367dE61B6592dc7405f80e67dA5B3Ac48E1',
}

module.exports = async function (deployer, _network, accounts) {
	// Use Beyond artifact here
	const Beyond = new BeyondArt(data.byn_token)
	// console.log(Beyond)

	return deployer.deploy(BYN, data.byn_token, Math.floor(DEPLOYMENT_TIMESTAMP / 1000)).then(async (sf) => {
		data.reward_token = data['byn_token']
		data.mock_token_1 = data['byn_token']
		data.mock_token_2 = data['byn_token']

		data.staking_factory = sf.address
		data.staking_factory_lp = sf.address

		await Beyond.approve(sf.address, new BigNumber(500000 * Math.pow(10, 18)))
		await Beyond.increaseApproval(accounts[0], new BigNumber(500000 * Math.pow(10, 18)))
		await Beyond.increaseApproval(sf.address, new BigNumber(500000 * Math.pow(10, 18)))
		await sf.deploy(data.byn_token, new BigNumber(500000 * Math.pow(10, 18)))
		const staking_address = await sf.stakingContractAddress()
		// const staking_contract_instance = new Staking(staking_address)
		await Beyond.add_allowedAddress(staking_address)
		await Beyond.increaseApproval(staking_address, new BigNumber(500000 * Math.pow(10, 18)))
		return writeFileSync(join(__dirname, '..', 'client', 'src', 'addresses.json'), JSON.stringify(data, undefined, 4))
	})
}
