// import logo from './logo.svg'
import './App.css'

import { abi as stakingFAbi } from './contracts/StakingFactory.json'
import { abi as stakingAbi } from './contracts/Staking.json'
import { abi as mock1Abi } from './contracts/Mock.json'
import { abi as mock2Abi } from './contracts/Mock2.json'

import Web3 from 'web3'

import React from 'react'

class App extends React.Component {
	state = { owner: '', level: 0 }
	stakingRewards = ''
	web3

	async componentWillMount() {
		try {
			console.log(await window.ethereum.enable())
			const web3 = new Web3(Web3.givenProvider || 'http://localhost:8545')
			this.web3 = web3
			const accounts = await web3.eth.getAccounts()

			// const web3 = new Web3(new Web3.providers.HttpProvider(Web3.givenProvider))
			// const accounts = await web3.eth.getAccounts()

			const m1_ = new web3.eth.Contract(stakingFAbi, '0x86ca79eac0cFD9477216F704d47a7D35d0a1f4D2')
			const reward = new web3.eth.Contract(mock1Abi, '0x5cC735f12A153458697AF255636a9DB3182133b7')
			const stakingToken = new web3.eth.Contract(mock2Abi, '0x4F04e4c62E5017e2B402E2748C8Cd9d6F94d207C')
			// 	window.m1_ = m1_
			// window.mock1 = reward

			// 	window.mock2 = stakingToken
			const level = await m1_.methods.level().call()

			this.stakingRewards = (
				await m1_.methods.stakingRewardsInfoByStakingToken(await m1_.methods.stakingTokens(0).call()).call()
			).stakingRewards
			console.log(this.stakingRewards)
			this.setState({ owner: accounts[0], level })

			// // 	await stakingToken.methods.approve(accounts[0], 1000).send({ from: accounts[0] })
			// await stakingToken.methods.approve(this.stakingRewards, 1000).send({ from: accounts[0] })
			// 	// await stakingToken.methods.increaseAllowance(accounts[0], 1000).call()

			// 	await stakingToken.methods.mint(accounts[0], 1000).send({ from: accounts[0] })

			// 	const staking = new web3.eth.Contract(stakingAbi, this.stakingRewards)
			// 	window.staking = staking
		} catch (err) {
			console.error(err)
		}
	}

	async deposit() {
		try {
			const web3 = this.web3
			const staking = new web3.eth.Contract(stakingAbi, this.stakingRewards)
			const stakingToken = new web3.eth.Contract(mock2Abi, '0x4F04e4c62E5017e2B402E2748C8Cd9d6F94d207C')
			await stakingToken.methods.increaseAllowance(this.stakingRewards, 1000).send({ from: this.state.owner })
			await staking.methods.deposit(1000).send({ from: this.state.owner, gas: 3000000 })
			alert(JSON.stringify(await staking.methods.calculateReward().call()))
		} catch (error) {
			console.error(error)

			if (error.message) alert(error.message)
		}
	}

	render() {
		return (
			<div className='App'>
				<header className='App-header'>
					<div className='flex' style={{ display: 'flex', width: '800px', alignItems: 'center', justifyContent: 'space-evenly' }}>
						<div style={{ width: '250px', height: '400px', border: '2px solid white' }}>
							{'Level:' + this.state.level}
							<br />
							<input
								type='text'
								name='deposit'
								onChange={(e) => {
									this.setState({ deposit: e.target.value })
								}}
							/>
							<button
								onClick={() => {
									this.deposit()
								}}
							>
								Deposit
							</button>
						</div>
						<div style={{ width: '250px', height: '400px', border: '2px solid white' }}></div>
					</div>
					{/* <img src={logo} className='App-logo' alt='logo' /> */}
					<p>{`Your account:${this.state.owner}`}</p>
				</header>
			</div>
		)
	}
}

export default App
