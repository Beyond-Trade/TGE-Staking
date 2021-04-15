import { abi as mock1Abi } from '../../contracts/Beyond.json'
import { abi as mock2Abi } from '../../contracts/Beyond.json'
import Web3 from 'web3'
import React, { Fragment } from 'react'
import { Card } from '../../components/Card/Card'

import moment from 'moment'

// import logo from '../../logo.png'

import './Main.scss'
// import BigNumber from 'bignumber.js'

const bignum = window.BigNumber

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
		levelsData: {
			alloted: '0',
			allowedForXCoins: '0',
			allowedReward: '0',
			lockedDuration: '0',
			rewardPercentTimes100: '0',
		},
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
		startTime: 0,
		i_token: 0,
		i_reward: 0,
		UserData: {
			allowed: false,
			created: false,
			lastUpdateDate: '0',
			level1Reward: '0',
			level1Tokens: '0',
			level2Reward: '0',
			level2Tokens: '0',
			level3Reward: '0',
			level3Tokens: '0',
			level4Reward: '0',
			level4Tokens: '0',
			rewards: '0',
			tokens: '0',
			withdrawable: '0',
		},
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
			window.this = this
			window.accounts = accounts
			const stakingFactory = new web3.eth.Contract(this.stakingFAbi, this.stakingFactoryContractAddress)
			const rewardToken = new web3.eth.Contract(mock1Abi, this.rewardContractAddress)
			const stakingToken = new web3.eth.Contract(mock2Abi, this.stakingTokenAddress)
			const balances = {
				staking: await stakingToken.methods.balanceOf(accounts[0]).call(),
				reward: await rewardToken.methods.balanceOf(accounts[0]).call(),
			}

			const level = await stakingFactory.methods.level().call()
			const startTime = await stakingFactory.methods.startTime().call()

			window.stakingFactory = stakingFactory

			this.stakingRewards = (await stakingFactory.methods.stakingRewardsInfoByStakingToken(stakingTokenAddress).call()).stakingRewards

			const staking = new web3.eth.Contract(this.stakingAbi, this.stakingRewards)
			window.staking = staking
			window.stakingToken = stakingToken

			const estimatedReward = await this.calculateReward(staking)
			this.setState(
				{ owner: accounts[0], level, balances, stakingFactory, rewardToken, stakingToken, staking, rewards: estimatedReward, startTime },
				() => {
					console.log(this.state)
					this.level()
				}
			)
		} catch (err) {
			console.error(err)
		}
	}

	async level(check_alert = false) {
		const level = await this.state.stakingFactory.methods.level().call()
		const levelsData = await this.state.stakingFactory.methods.levels(level).call()
		let setAlert = false
		if (level !== this.state.level) {
			setAlert = true
		}
		this.setState({ level, levelsData }, () => {
			console.log(levelsData, 'levels')

			if (check_alert && setAlert === true) alert('Level Updated')
		})
	}

	async withdrawByAmount() {
		try {
			const web3 = this.web3
			const staking = new web3.eth.Contract(this.stakingAbi, this.stakingRewards)
			// const stakingToken = new web3.eth.Contract(mock2Abi, this.stakingTokenAddress)
			await staking.methods.withdrawByAmount(new bignum(this.state.withdrawAmount.toString())).send({ from: this.state.owner })
			const estimatedReward = await this.calculateReward(this.state.staking)
			await this.updateBalances()
			// console.log(estimatedReward)

			console.log(JSON.stringify(estimatedReward))
			alert('Successfully withdrawn')
			this.setState(
				{
					rewards: estimatedReward,
					withdrawAmount: '',
				},
				() => {
					alert(`Withdrawable Amount: ${Math.floor(this.state.UserData.withdrawable / Math.pow(10, 18))}`)
				}
			)
			this.level()
		} catch (err) {
			try {
				alert('Failed. Tokens still locked or requested is higher than withdrawable.', JSON.stringify(err))
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
				alert('Failed, Tokens still locked.', JSON.stringify(err))
				console.error(err)
			} catch (error) {
				console.error(err)
			}
		}
	}

	async deposit() {
		try {
			if (this.available_in_level() === '0') {
				alert('All tokens have been staked.')
				return
			}
			if (this.state.balances.reward === 0) {
				alert('Not enough balance.')
				return
			}
			if (this.state.deposit === 0 || !this.state.deposit) {
				alert('Please enter deposit')
			}
			// const web3 = this.web3
			await this.state.stakingToken.methods
				.increaseApproval(this.stakingRewards, new bignum(this.state.deposit.toString()))
				.send({ from: this.state.owner })

			await this.state.staking.methods.deposit(new bignum(this.state.deposit.toString())).send({ from: this.state.owner, gas: 3000000 })
			const estimatedReward = await this.calculateReward(this.state.staking)
			await this.updateBalances()
			// console.log(estimatedReward)

			console.log(JSON.stringify(estimatedReward))
			alert('Staked successfully.')
			this.setState({
				rewards: estimatedReward,
				deposit: '',
			})
			this.level(true)
		} catch (error) {
			console.error(error)

			if (error.message) alert(error.message)
			else alert('Something went wrong.')
		}
	}

	async calculateReward(staking = this.state.staking) {
		this.setState(
			{
				UserData: await staking.methods.getUser().call({
					from: this.owner,
				}),
			},
			() => {
				console.log('userdata:', this.state.UserData)
			}
		)

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

		i_token += parseInt(estimatedReward['tokens'])

		this.reward_value.forEach((elem) => {
			i_reward += parseInt(estimatedReward[elem])
		})

		this.setState({ i_token, i_reward }, () => {
			console.log(this.state)
		})
	}

	get_data_from_string(elem) {
		return (parseInt(elem) / Math.pow(10, 18)).toFixed(0)
	}

	render() {
		const TOKEN_NAME = 'BYN'
		console.log('reward: ', this.state.i_reward)
		return (
			<div className='App'>
				<header className='App-header'>
					<div style={{ margin: '10px' }} className='header'>
						<div className='inner'>
							<p>
								<span className='caseupper'>
									<span className='bold'>{TOKEN_NAME} </span>Staking Program
								</span>
								<br />
							</p>
						</div>
					</div>
					<div className='main'>
						<Card>
							<div className='inner'>
								<h2 style={{ margin: '0rem' }}>Level:{this.state.level}</h2>

								<div className='lower'>
									<div style={{ display: 'flex', justifyContent: 'space-between' }} className='flex'>
										<div className=''>
											<h5 style={{ margin: '0rem' }}>
												Your Total {TOKEN_NAME}:{' '}
												<span className='consolas bold'>{(this.state.balances.reward / Math.pow(10, 18)).toFixed(0)}</span>
											</h5>
										</div>
										<div className=''>
											<h5 style={{ margin: '0rem' }}>
												Currently Staked:{' '}
												<span className='consolas bold'>{(this.state.UserData.tokens / Math.pow(10, 18)).toFixed(0)}</span>
											</h5>
										</div>
									</div>
									{this.state.rewards['withdrawable'] > 0 ? (
										<h5 style={{ margin: '0rem' }}>
											Withdrwable:{' '}
											<span className='consolas bold'>
												{(this.state.rewards['withdrawable'] / Math.pow(10, 18)).toFixed(0)}
											</span>
										</h5>
									) : (
										<></>
									)}
									<p style={{ textAlign: 'center' }}>
										{TOKEN_NAME} available for staking in this level{' '}
										<span className='consolas bold'>{this.available_in_level()}</span>
										{TOKEN_NAME}
									</p>

									{/* 
									<h5 style={{ margin: '0rem' }}>
										Rewards: <span className='consolas'>{(this.state.i_reward / Math.pow(10, 18)).toFixed(0)}</span>
									</h5> */}
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
									{/* <label htmlFor='deposit'> */}
									<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} className=''>
										<input
											className='consolas'
											style={{
												marginTop: '0rem',
												borderRadius: '0',
												height: '1rem',
												border: 0,
												backgroundColor: 'white',
												color: 'black',
												caretColor: 'black',
											}}
											type='text'
											autoComplete='off'
											name='deposit'
											onChange={(e) => {
												this.setState({ deposit: e.target.value * Math.pow(10, 18), meta_deposit: e.target.value })
											}}
											value={this.state.meta_deposit}
											placeholder='Deposit Amount'
										/>
										<span
											className='button'
											style={{
												margin: 0,
												background: '#4b40f9',
												marginTop: '0rem',
												borderRadius: 0,
												height: '1rem',
												minWidth: 'fit-content',
												width: '2rem',
											}}
											onClick={() => {
												this.setState({
													meta_deposit: parseInt(this.available_in_level()),
													deposit: parseInt(this.available_in_level()) * Math.pow(10, 18),
												})
												// this.deposit()
											}}
										>
											MAX
										</span>
									</div>
									{/* </label> */}
								</form>
								<div
									className='button'
									style={{ marginTop: '1rem' }}
									onClick={() => {
										this.deposit()
									}}
								>
									<span>Stake</span>
								</div>

								<form autoComplete='off'>
									{/* <label htmlFor='level'> */}
									<input
										style={{
											marginTop: '0.5rem',
											borderRadius: '8px',
											backgroundColor: 'white',
											color: 'black',
											caretColor: 'black',
										}}
										autoComplete='off'
										type='text'
										name='level'
										onChange={(e) => {
											this.setState({ withdrawAmount: e.target.value * Math.pow(10, 18) })
										}}
										placeholder='Amount'
									/>
									{/* </label> */}
								</form>
								<div
									style={{ marginTop: '10px' }}
									className='button'
									onClick={async () => {
										// await this.calculateReward()
										// if (this.state.UserData.withdrawable === 0 || this.state.UserData.withdrawable < this.state.withdrawAmount) {
										// 	alert(`Tokens locked. Withdrawable Amount: ${this.state.UserData.withdrawable}`)
										// 	return
										// }
										this.withdrawByAmount()
									}}
								>
									<span>Withdraw</span>
								</div>

								<div className='dotted'></div>
								<div style={{ display: 'flex', marginTop: '1rem', justifyContent: 'space-between' }} className='flex'>
									<div className='' style={{}}>
										{this.left_data(TOKEN_NAME).map((elem) => {
											return pragmata(elem)
										})}
									</div>
									<div className='' style={{ textAlign: 'left' }}>
										{this.right_data().map((elem) => {
											return pragmata(elem)
										})}
									</div>
								</div>
								<div
									style={{
										display: 'flex',
										flexDirection: 'column',
										marginTop: '1rem',
										justifyContent: 'flex-start',
										textAlign: 'left',
										alignItems: 'flex-start',
									}}
									className='flex'
								>
									<div className='' style={{}}>
										<span className='bold'>Note 1.</span> The Staked BYN will be locked for the whole durationof the program. On
										the reward date, total staked amount of BYN + staking rewards willbe distributed to this wallet address.
									</div>
									<div className='' style={{ padding: '5px' }}></div>
									<div className=''>
										<span className='bold'>Note 2.</span>Please use a different wallet if have any BYN locked in this wallet.
									</div>
								</div>
							</div>
						</Card>
						{/* <Card>
							<div className='inner'>
								<h2 style={{ margin: 0 }}>Your Balances:</h2>
								<div className='lower'>
									<h5 style={{ margin: 0 }}>
										RWD: <span className='consolas'>{(this.state.balances.reward / Math.pow(10, 18)).toFixed(0)}</span>
									</h5>
									<h5 style={{ margin: 0 }}>
										STK: <span className='consolas'>{(this.state.balances.staking / Math.pow(10, 18)).toFixed(0)}</span>
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
						</Card> */}
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

					<p style={{ fontSize: '1rem' }}>{`Your Account:${this.state.owner}`}</p>
				</header>
			</div>
		)
	}

	available_in_level() {
		return parseInt(this.state.levelsData.allowedForXCoins) - parseInt(this.state.levelsData.alloted) < parseInt(this.state.balances.reward)
			? ((new bignum(this.state.levelsData.allowedForXCoins) - new bignum(this.state.levelsData.alloted)) / Math.pow(10, 18)).toFixed(0)
			: this.get_data_from_string(this.state.balances.reward)
	}

	right_data() {
		return [
			{ name: 'Days of Staking: ', value: `${this.state.levelsData.lockedDuration} Days` },
			{
				name: 'Reward Date: ',
				value: `${moment((parseInt(this.state.startTime) + 24 * 3600 * parseInt(this.state.levelsData.lockedDuration)) * 1000).format(
					'MMM D, YYYY'
				)}`,
			},
		]
	}

	left_data(TOKEN_NAME) {
		return [
			{
				name: 'Total Staked: ',
				value: `${this.get_data_from_string(this.state.UserData.tokens)} ${TOKEN_NAME}`,
			},
			{
				name: 'Total Reward: ',
				value: `${this.get_data_from_string(this.state.UserData.rewards)} ${TOKEN_NAME}`,
			},
		]
	}
}
function pragmata(elem) {
	return (
		<Fragment>
			<div style={{ display: 'flex', padding: '4px 0', lineHeight: '1' }} className=''>
				<div className='name'>{elem.name} </div>
				<div style={{ padding: '0 4px' }} className='value bold consolas'>
					{elem.value}
				</div>
			</div>
		</Fragment>
	)
}
