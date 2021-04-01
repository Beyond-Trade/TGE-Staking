const Mock = artifacts.require('Mock')
const Mock2 = artifacts.require('Mock2')
const BYN = artifacts.require('StakingFactory')
const BYNLP = artifacts.require('StakingFactoryLP')

module.exports = function (deployer) {
	deployer.deploy(Mock, 'Reward', 'RWD').then((reward) => {
		return deployer.deploy(Mock2, 'Staking', 'STK').then(async (staking) => {
			return deployer.deploy(BYN, reward.address, Math.floor(Date.now() / 1000)).then(async (sf) => {
				await reward.approve(sf.address, 50000000)
				await reward.increaseAllowance(sf.address, 50000000)

				return sf.deploy(staking.address, 50000000).then(async () => {
					//
					return deployer.deploy(Mock2, 'StakingLP', 'STL').then(async (staking) => {
						//
						return deployer.deploy(BYNLP, reward.address, Math.floor(Date.now() / 1000)).then(async (sf) => {
							await reward.approve(sf.address, 50000000)
							await reward.increaseAllowance(sf.address, 50000000)

							return sf.deploy(staking.address, 50000000).then(async () => {
								return
							})
						})
					})
				})
			})
		})
	})
}
