import React, { Fragment } from 'react'
import { Card } from '../../components/Card/Card'

import Web3 from 'web3'

import { abi as mock1Abi } from '../../contracts/Mock.json'
import { abi as mock2Abi } from '../../contracts/Mock2.json'

import {
	rewardContractAddress,
	stakingTokenAddress,
	stakingFactoryContractAddress,
	// stakingTokenAddressLP,
	// StakingFactoryContractAddressLP,
} from '../../config'

import logo from '../../logo.png'

import { abi as stakingFAbi } from '../../contracts/StakingFactory.json'
// import { abi as LpStakingFAbi } from '../../contracts/StakingFactoryLP.json'

import './Home.scss'
export const Home = () => {
	const [balances, setbalances] = React.useState({
		staking: 0,
		stakingLp: 0,
		reward: 0,
		allowedReward: 0,
		alloted: 0,
		allowedForXCoins: 0,
		levelsData: {
			alloted: '0',
			allowedForXCoins: '0',
			allowedReward: '0',
			lockedDuration: '0',
			rewardPercentTimes100: '0',
		},
		level: 0,
	})
	const [metamask, setMetamask] = React.useState(false)
	async function run() {
		try {
			await window.ethereum.enable()
			const web3 = new Web3(Web3.givenProvider || 'http://localhost:8545')
			// this.web3 = web3
			const accounts = await web3.eth.getAccounts()
			const stakingFactory = new web3.eth.Contract(stakingFAbi, stakingFactoryContractAddress)
			// const stakingFactoryLp = new web3.eth.Contract(LpStakingFAbi, StakingFactoryContractAddressLP)
			const rewardToken = new web3.eth.Contract(mock1Abi, rewardContractAddress)
			const stakingToken = new web3.eth.Contract(mock2Abi, stakingTokenAddress)
			// const stakingTokenLp = new web3.eth.Contract(mock2Abi, stakingTokenAddressLP)
			setMetamask(true)
			window.stakingFactory = stakingFactory
			const level = await stakingFactory.methods.level().call()
			const levels = await stakingFactory.methods.levels(level).call()

			let allowedReward = 0
			let alloted = 0
			let allowedForXCoins = 0
			for (let i = 1; i <= 4; i++) {
				allowedReward += parseInt((await stakingFactory.methods.levels(i).call()).allowedReward)
				allowedForXCoins += parseInt((await stakingFactory.methods.levels(i).call()).allowedForXCoins)
				alloted += parseInt((await stakingFactory.methods.levels(i).call()).alloted)
			}
			//
			let allowedRewardLp = 0
			let allotedLp = 0
			let allowedForXCoinsLp = 0
			// for (let i = 1; i <= 4; i++) {
			// 	allowedRewardLp += parseInt((await stakingFactoryLp.methods.levels(i).call()).allowedReward)
			// 	allowedForXCoinsLp += parseInt((await stakingFactoryLp.methods.levels(i).call()).allowedForXCoins)
			// 	allotedLp += parseInt((await stakingFactoryLp.methods.levels(i).call()).alloted)
			// }
			const balances = {
				staking: await stakingToken.methods.balanceOf(accounts[0]).call(),
				// stakingLp: await stakingTokenLp.methods.balanceOf(accounts[0]).call(),
				reward: await rewardToken.methods.balanceOf(accounts[0]).call(),
				allowedReward,
				alloted,
				levelsData: levels,
				level,
				allowedForXCoins,
				allowedRewardLp,
				allowedForXCoinsLp,
				allotedLp,
			}
			setbalances(balances)

			console.log(balances)
		} catch (err) {
			console.error(err)
			if (err.code === 4001) {
				alert('Please connect wallet.')
			} else if (err.code !== -32002)
				alert(JSON.stringify(err) === '{}' ? 'Cannot find the contract. Are you on correct network? Try refreshing.' : JSON.stringify(err))
		}
	}
	React.useEffect(() => {
		run()
		// eslint-disable-next-line
	}, [rewardContractAddress, stakingTokenAddress])
	return (
		<Fragment>
			{!metamask && (
				<Fragment>
					<div className='' style={{ width: '100%' }}>
						<div
							className=''
							style={{
								position: 'absolute',
								height: '12rem',
								width: '20rem',
								backgroundColor: 'transparent',
								textAlign: 'center',
								display: 'flex',
								top: '50%',
								zIndex: 100,
								transform: 'translateY(-50%)',
								left: 0,
								right: 0,
								margin: '0 auto',
							}}
						>
							<Card>
								<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '1rem' }} className=''>
									<p style={{ margin: 0 }}>Please connect Metamask to continue</p>
								</div>
								<div onClick={() => run()} className='button'>
									Connect
								</div>
							</Card>
						</div>
					</div>
				</Fragment>
			)}
			<div className='home'>
				<div className='header'>
					<div className='inner'>
						<p>
							<span className='caseupper'>
								<span className='bold'>Beyond </span>Staking
							</span>
							<br />
							Welcome to Beyond Finnace Staking Platform! During this limited time period, we are giving the chance for our BYN token
							holders to earn more BYN by staking at different reward levels, with flexible lock period. Stake now!
						</p>
					</div>
				</div>
				<div className='outer'>
					<div className='inner'>
						<Card
							token='BYN'
							token_r='RWD'
							value={balances.staking}
							value_r={balances.reward}
							token_image={logo}
							total_staked='XXX'
							link='/BYNStake'
							allowedReward={balances.allowedReward}
							allowedForXCoins={balances.allowedForXCoins}
							alloted={balances.alloted}
							level={balances.level}
							levelsData={balances.levelsData}
						></Card>
						{/* <Card
							token='BYN/ETH LP'
							token_r='RWD'
							value={balances.stakingLp}
							value_r={balances.reward}
							token_image={logo}
							total_staked='XXX'
							link='/BYNStakeLP'
							allowedReward={balances.allowedRewardLp}
							alloted={balances.allotedLp}
							allowedForXCoins={balances.allowedForXCoinsLp}
						></Card> */}
					</div>
				</div>
			</div>
		</Fragment>
	)
}
