const Migrations = artifacts.require('Migrations')
const Mock = artifacts.require('Mock')

contract('Migrations', (accounts) => {
	it('testing', async () => {
		const instance = await Mock.deployed()
		instance.mint(accounts[0], 100000)
		instance.approve(accounts[0], 1000)
	})
})
