// import logo from './logo.svg'
import './App.css'

import { abi as stakingFAbi } from './contracts/StakingFactory.json'
import { abi as LpStakingFAbi } from './contracts/LpStakingFactory.json'

import { abi as stakingAbi } from './contracts/Staking.json'
import { abi as LpStakingAbi } from './contracts/LpStaking.json'

import { abi as mock1Abi } from './contracts/Mock.json'
import { abi as mock2Abi } from './contracts/Mock2.json'

import Web3 from 'web3'

import React, { Fragment } from 'react'
import {
	rewardContractAddress,
	stakingTokenAddress,
	stakingFactoryContractAddress,
	stakingTokenAddressLP,
	StakingFactoryContractAddressLP,
} from './config'

class App extends React.Component {
	state = {
		owner: '',
		level: 0,
		rewardLevel: 1,
		balances: {
			staking: 0,
			reward: 0,
		},
		withdrawAmount: 0,
		stakingFactory: null,
		rewardToken: null,
		stakingToken: null,
		staking: null,
		rewards: {
			level1Reward: '0',
			level1Tokens: '0',
			level2Reward: '0',
			level2Tokens: '0',
			level3Reward: '0',
			level3Tokens: '0',
			level4Reward: '0',
			level4Tokens: '0',
		},
	}
	stakingRewards = ''
	web3

	keys = ['level1Reward', 'level1Tokens', 'level2Reward', 'level2Tokens', 'level3Reward', 'level3Tokens', 'level4Tokens', 'level4Reward']

	rewardContractAddress = ''
	stakingTokenAddress = ''
	stakingFactoryContractAddress = ''

	async updateBalances() {
		console.log(this.state)
		const balances = {
			staking: await this.state.stakingToken.methods.balanceOf(this.state.owner).call(),
			reward: await this.state.rewardToken.methods.balanceOf(this.state.owner).call(),
		}
		this.setState({ balances })
	}

	async componentWillMount() {
		const { rewardContractAddress, stakingTokenAddress, stakingFactoryContractAddress, keys } = this.props
		this.rewardContractAddress = rewardContractAddress
		this.stakingTokenAddress = stakingTokenAddress
		this.keys = keys
		this.stakingFactoryContractAddress = stakingFactoryContractAddress
		try {
			await window.ethereum.enable()
			const web3 = new Web3(Web3.givenProvider || 'http://localhost:8545')
			this.web3 = web3
			const accounts = await web3.eth.getAccounts()

			const stakingFactory = new web3.eth.Contract(stakingFAbi, this.stakingFactoryContractAddress)
			const rewardToken = new web3.eth.Contract(mock1Abi, this.rewardContractAddress)
			const stakingToken = new web3.eth.Contract(mock2Abi, this.stakingTokenAddress)
			const balances = {
				staking: await stakingToken.methods.balanceOf(accounts[0]).call(),
				reward: await rewardToken.methods.balanceOf(accounts[0]).call(),
			}

			const level = await stakingFactory.methods.level().call()

			this.stakingRewards = (
				await stakingFactory.methods.stakingRewardsInfoByStakingToken(await stakingFactory.methods.stakingTokens(0).call()).call()
			).stakingRewards

			const staking = new web3.eth.Contract(stakingAbi, this.stakingRewards)
			window.staking = staking

			const estimatedReward = await this.calculateReward(staking)
			this.setState({ owner: accounts[0], level, balances, stakingFactory, rewardToken, stakingToken, staking, rewards: estimatedReward })
		} catch (err) {
			console.error(err)
		}
	}

	async level() {
		const level = await this.state.stakingFactory.methods.level().call()
		this.setState({ level })
	}

	async withdrawByAmount() {
		try {
			const web3 = this.web3
			const staking = new web3.eth.Contract(stakingAbi, this.stakingRewards)
			// const stakingToken = new web3.eth.Contract(mock2Abi, this.stakingTokenAddress)

			await staking.methods.withdrawByAmount(this.state.withdrawAmount).send({ from: this.state.owner })

			const estimatedReward = await this.calculateReward(this.state.staking)
			await this.updateBalances()
			console.log(estimatedReward)

			alert(JSON.stringify(estimatedReward))
			this.setState({
				rewards: estimatedReward,
			})
			this.level()
			this.level()
		} catch (err) {
			alert(err)
		}
	}

	async withdraw() {
		try {
			const web3 = this.web3
			const staking = new web3.eth.Contract(stakingAbi, this.stakingRewards)
			// const stakingToken = new web3.eth.Contract(mock2Abi, this.stakingTokenAddress)

			await staking.methods.withdraw(this.state.rewardLevel).send({ from: this.state.owner })

			const estimatedReward = await this.calculateReward(this.state.staking)
			await this.updateBalances()
			console.log(estimatedReward)

			alert(JSON.stringify(estimatedReward))
			this.setState({
				rewards: estimatedReward,
			})
			this.level()
			this.level()
		} catch (err) {
			alert(err)
		}
	}

	async deposit() {
		try {
			// const web3 = this.web3

			await this.state.stakingToken.methods.increaseAllowance(this.stakingRewards, this.state.deposit).send({ from: this.state.owner })

			await this.state.staking.methods.deposit(this.state.deposit).send({ from: this.state.owner, gas: 3000000 })
			const estimatedReward = await this.calculateReward(this.state.staking)
			await this.updateBalances()
			console.log(estimatedReward)

			alert(JSON.stringify(estimatedReward))
			this.setState({
				rewards: estimatedReward,
			})
			this.level()
		} catch (error) {
			console.error(error)

			if (error.message) alert(error.message)
		}
	}

	async calculateReward(staking) {
		return await staking.methods.calculateReward().call()
	}

	render() {
		return (
			<div className='App'>
				<header className='App-header'>
					<h1>{this.props.heading}</h1>
					<div className='flex' style={{ display: 'flex', width: '800px', alignItems: 'center', justifyContent: 'space-evenly' }}>
						<div
							style={{
								width: '400px',
								height: '600px',
								border: '2px solid white',
							}}
						>
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
							<br />
							<input
								type='text'
								name='level'
								onChange={(e) => {
									this.setState({ rewardLevel: e.target.value })
								}}
								placeholder='Level'
							/>
							<button
								onClick={() => {
									this.withdraw()
								}}
							>
								Withdraw
							</button>
							<br />
							<input
								type='text'
								name='level'
								onChange={(e) => {
									this.setState({ withdrawAmount: e.target.value })
								}}
								placeholder='Amount'
							/>
							<button
								onClick={() => {
									this.withdrawByAmount()
								}}
							>
								Withdraw By Amount
							</button>
							<table style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-evenly', margin: '0 auto' }}>
								<tbody>
									{Object.keys(this.state.rewards).map((key) => {
										const keys = this.keys

										if (keys.includes(key)) {
											return (
												<tr key={key}>
													<td>{key}</td>
													<td>{this.state.rewards[key]}</td>
												</tr>
											)
										} else return <React.Fragment></React.Fragment>
									})}
								</tbody>
							</table>
						</div>
						Your Balances:
						<br />
						RWD:{this.state.balances.reward}
						<br />
						STK:{this.state.balances.staking}
						{/* <div style={{ width: '250px', height: '400px', border: '2px solid white' }}></div> */}
					</div>
					{/* <img src={logo} className='App-logo' alt='logo' /> */}
					<p>{`Your account:${this.state.owner}`}</p>
				</header>
			</div>
		)
	}
}

const DataApp = () => {
	return (
		<Fragment>
			<App
				heading={'Mock Token'}
				rewardContractAddress={rewardContractAddress}
				stakingTokenAddress={stakingTokenAddress}
				stakingFactoryContractAddress={stakingFactoryContractAddress}
				keys={[
					'level1Reward',
					'level1Tokens',
					'level2Reward',
					'level2Tokens',
					'level3Reward',
					'level3Tokens',
					'level4Tokens',
					'level4Reward',
					'withdrawable',
				]}
			/>

			<App
				heading={'LP'}
				rewardContractAddress={rewardContractAddress}
				stakingTokenAddress={stakingTokenAddressLP}
				stakingFactoryContractAddress={StakingFactoryContractAddressLP}
				keys={['level1Reward', 'level1Tokens', 'level2Reward', 'level2Tokens', 'withdrawable']}
			/>
		</Fragment>
	)
}

export default DataApp
