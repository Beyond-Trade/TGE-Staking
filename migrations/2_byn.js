const Mock = artifacts.require('Mock')
const Mock2 = artifacts.require('Mock2')
const BYN = artifacts.require('StakingFactory')

module.exports = function (deployer) {
	deployer.deploy(Mock, 'Reward', 'RWD').then((reward) => {
		return deployer.deploy(Mock2, 'Staking', 'STK').then(async (staking) => {
			// await staking.mint(accounts[0], 100000)
			return deployer.deploy(BYN, reward.address, 1).then((sf) => {
				return sf.deploy(staking.address, 1000).then(() => {
					console.log(sf.level())
					return
				})
			})
		})
	})
}
