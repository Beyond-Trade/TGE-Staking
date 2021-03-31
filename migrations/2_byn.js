const Mock = artifacts.require('Mock')
const Mock2 = artifacts.require('Mock2')
const BYN = artifacts.require('StakingFactory')

module.exports = function (deployer) {
	deployer.deploy(Mock, 'Reward', 'RWD').then((reward) => {
		return deployer.deploy(Mock2, 'Staking', 'STK').then(async (staking) => {
			return deployer.deploy(BYN, reward.address, 1).then((sf) => {
				return sf.deploy(staking.address, 1000).then(async () => {
					// await Mock.mint(accounts[0], 3000000)
					// await Mock.mint(Mock.address, 3000000)
					return
				})
			})
		})
	})
}
