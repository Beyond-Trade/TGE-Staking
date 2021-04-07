import { abi as mock1Abi } from '../../contracts/Mock.json'
import { abi as mock2Abi } from '../../contracts/Mock2.json'
import Web3 from 'web3'
import React from 'react'
import { Card } from '../../components/Card/Card'

import './Main.scss'
import BigNumber from 'bignumber.js'

export class Main extends React.Component {
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
		i_token: 0,
		i_reward: 0,
	}
	stakingRewards = ''
	web3

	keys = ['level1Reward', 'level1Tokens', 'level2Reward', 'level2Tokens', 'level3Reward', 'level3Tokens', 'level4Tokens', 'level4Reward']
	token_value = ['level1Tokens', 'level2Tokens', 'level3Tokens', 'level4Tokens']
	reward_value = ['level1Reward', 'level2Reward', 'level3Reward', 'level4Reward']

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

	stakingFAbi
	stakingAbi
	owner = ''

	async componentWillMount() {
		const { stakingFAbi, stakingAbi } = this.props
		this.stakingFAbi = stakingFAbi
		this.stakingAbi = stakingAbi
		const { rewardContractAddress, stakingTokenAddress, stakingFactoryContractAddress, keys, token_value, reward_value } = this.props
		this.rewardContractAddress = rewardContractAddress
		this.stakingTokenAddress = stakingTokenAddress
		this.keys = keys
		this.token_value = token_value
		this.reward_value = reward_value
		this.stakingFactoryContractAddress = stakingFactoryContractAddress
		try {
			await window.ethereum.enable()
			const web3 = new Web3(Web3.givenProvider || 'http://localhost:8545')
			this.web3 = web3
			const accounts = await web3.eth.getAccounts()
			this.owner = accounts[0]
			window.accounts = accounts
			const stakingFactory = new web3.eth.Contract(this.stakingFAbi, this.stakingFactoryContractAddress)
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

			const staking = new web3.eth.Contract(this.stakingAbi, this.stakingRewards)
			window.staking = staking

			const estimatedReward = await this.calculateReward(staking)
			this.setState(
				{ owner: accounts[0], level, balances, stakingFactory, rewardToken, stakingToken, staking, rewards: estimatedReward },
				() => {
					console.log(this.state)
				}
			)
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
			const staking = new web3.eth.Contract(this.stakingAbi, this.stakingRewards)
			// const stakingToken = new web3.eth.Contract(mock2Abi, this.stakingTokenAddress)
			await staking.methods.withdrawByAmount(new BigNumber(this.state.withdrawAmount)).send({ from: this.state.owner })

			const estimatedReward = await this.calculateReward(this.state.staking)
			await this.updateBalances()
			// console.log(estimatedReward)

			console.log(JSON.stringify(estimatedReward))
			alert('Successfully withdrawn')
			this.setState({
				rewards: estimatedReward,
				withdrawAmount: '',
			})
			this.level()
		} catch (err) {
			try {
				alert('Failed', JSON.stringify(err))
				console.error(err)
			} catch (error) {
				console.error(err)
			}
		}
	}

	async withdraw() {
		try {
			const web3 = this.web3
			const staking = new web3.eth.Contract(this.stakingAbi, this.stakingRewards)
			// const stakingToken = new web3.eth.Contract(mock2Abi, this.stakingTokenAddress)
			await staking.methods.withdraw(this.state.rewardLevel).send({ from: this.state.owner })

			const estimatedReward = await this.calculateReward(this.state.staking)
			await this.updateBalances()
			// console.log(estimatedReward)

			console.log(JSON.stringify(estimatedReward))
			alert('Successfully withdrawn')
			this.setState({
				rewards: estimatedReward,
				rewardLevel: '',
			})
			this.level()
			this.level()
		} catch (err) {
			try {
				alert('Failed', JSON.stringify(err))
				console.error(err)
			} catch (error) {
				console.error(err)
			}
		}
	}

	async deposit() {
		try {
			// const web3 = this.web3
			await this.state.stakingToken.methods
				.increaseAllowance(this.stakingRewards, new BigNumber(this.state.deposit))
				.send({ from: this.state.owner })

			await this.state.staking.methods.deposit(new BigNumber(this.state.deposit)).send({ from: this.state.owner, gas: 3000000 })
			const estimatedReward = await this.calculateReward(this.state.staking)
			await this.updateBalances()
			// console.log(estimatedReward)

			console.log(JSON.stringify(estimatedReward))
			alert('Staked')
			this.setState({
				rewards: estimatedReward,
				deposit: '',
			})
			this.level()
		} catch (error) {
			console.error(error)

			if (error.message) alert(error.message)
			else alert('Something went wrong.')
		}
	}

	async calculateReward(staking) {
		const estimatedReward = await staking.methods.calculateReward().call({
			from: this.owner,
		})
		console.log('calc:', estimatedReward)
		this.tokens(estimatedReward)
		return estimatedReward
	}

	async tokens(estimatedReward) {
		let i_token = 0
		let i_reward = 0
		this.token_value.forEach((elem) => {
			i_token += parseInt(estimatedReward[elem])
		})

		this.reward_value.forEach((elem) => {
			i_reward += parseInt(estimatedReward[elem])
		})

		this.setState({ i_token, i_reward }, () => {
			console.log(this.state)
		})
	}

	render() {
		console.log('reward: ', this.state.i_reward)
		return (
			<div className='App'>
				<header className='App-header'>
					<h1>{this.props.heading}</h1>
					<div className='main'>
						<Card>
							<div className='inner'>
								<h2 style={{ margin: '0rem' }}>Level:{this.state.level}</h2>
								<div className='lower'>
									<h5 style={{ margin: '0rem' }}>
										Tokens: <span className='consolas'>{(this.state.i_token / Math.pow(10, 18)).toFixed(4)}</span>
									</h5>

									<h5 style={{ margin: '0rem' }}>
										Rewards: <span className='consolas'>{(this.state.i_reward / Math.pow(10, 18)).toFixed(4)}</span>
									</h5>

									<h5 style={{ margin: '0rem' }}>
										Withdrwable:{' '}
										<span className='consolas'>{(this.state.rewards['withdrawable'] / Math.pow(10, 18)).toFixed(4)}</span>
									</h5>
								</div>

								{/* <table style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-evenly', margin: '0 auto' }}>
									<tbody style={{ fontSize: '1rem' }}>
										{Object.keys(this.state.rewards).map((key) => {
											const keys = this.keys

											if (keys.includes(key)) {
												return (
													<tr key={key}>
														<td>
															<p style={{ margin: 0 }}>{key}</p>
														</td>
														<td>
															<p style={{ margin: 0 }}>{this.state.rewards[key]}</p>
														</td>
													</tr>
												)
											} else return <React.Fragment></React.Fragment>
										})}
									</tbody>
								</table> */}
								<form autoComplete='off'>
									<label htmlFor='deposit'>
										<input
											type='text'
											autoComplete='off'
											name='deposit'
											onChange={(e) => {
												this.setState({ deposit: e.target.value * Math.pow(10, 18) })
											}}
											placeholder='Deposit Amount'
										/>
									</label>
								</form>
								<div
									className='button'
									style={{ marginTop: '10px' }}
									onClick={() => {
										this.deposit()
									}}
								>
									<span>Deposit</span>
								</div>
							</div>
						</Card>
						<Card>
							<div className='inner'>
								<h2 style={{ margin: 0 }}>Your Balances:</h2>
								<div className='lower'>
									<h5 style={{ margin: 0 }}>
										RWD:
										<span className='consolas'>{Math.round(this.state.balances.reward / Math.pow(10, 18), 4)}</span>
									</h5>
									<h5 style={{ margin: 0 }}>
										STK:
										<span className='consolas'>{Math.round(this.state.balances.staking / Math.pow(10, 18), 4)}</span>
									</h5>
									<h5 style={{ margin: 0 }}>
										<span style={{ visibility: 'hidden' }}>data</span>
									</h5>
								</div>
								<form>
									<label htmlFor='level'>
										<input
											autoComplete='off'
											type='text'
											name='level'
											onChange={(e) => {
												this.setState({ withdrawAmount: e.target.value * Math.pow(10, 18) })
											}}
											placeholder='Amount'
										/>
									</label>
								</form>
								<div
									style={{ marginTop: '10px' }}
									className='button'
									onClick={() => {
										this.withdrawByAmount()
									}}
								>
									<span>Withdraw By Amount</span>
								</div>
							</div>
						</Card>
					</div>
					{/* <div className='flex' style={{ display: 'flex', width: '800px', alignItems: 'center', justifyContent: 'space-evenly' }}>
						<div
							style={{
								width: '400px',
								height: '600px',
								border: '2px solid white',
							}}
						>
							{'Level:' + this.state.level}
							<br />
							
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
					{/* </div> */}

					<p>{`Your Account:${this.state.owner}`}</p>
				</header>
			</div>
		)
	}
}
