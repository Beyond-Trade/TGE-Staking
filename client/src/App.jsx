import './index.css'
import './index.scss'
import './App.scss'

import { abi as stakingFAbi } from './contracts/StakingFactory.json'
// import { abi as LpStakingFAbi } from './contracts/StakingFactoryLP.json'

import { abi as stakingAbi } from './contracts/Staking.json'
// import { abi as LpStakingAbi } from './contracts/StakingLP.json'

import React, { Fragment, useEffect, useState } from 'react'
import {
	rewardContractAddress,
	stakingTokenAddress,
	stakingFactoryContractAddress,
	// stakingTokenAddressLP,
	// StakingFactoryContractAddressLP,
} from './config'
import { Main } from './pages/Main/Main'

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { Home } from './pages/Home/Home'
// import { Minter } from './Minter'

const DataApp = () => {
	const [isMobile, setIsMobile] = useState(false)

	useEffect(() => {
		function run() {
			const width = window.innerWidth
			if (width < 600) setIsMobile(true)
			else setIsMobile(false)
		}
		window.addEventListener('resize', () => {
			run()
		})
		run()
	}, [])
	return (
		<Fragment>
			<Router>
				<Switch>
					<Route path='/' exact>
						<span style={!isMobile ? { display: 'none' } : {}}>
							<div
								className='flex'
								style={{
									display: 'flex',
									color: 'white',
									justifyContent: 'center',
									alignItems: 'center',
									minHeight: '100vh',
									textAlign: 'center',
									padding: '0 2rem',
								}}
							>
								<div className=''>
									<div className=''>
										<p style={{ margin: 0 }}>
											<span className='caseupper'>
												<span className='bold'>Beyond </span>Staking
											</span>
										</p>
									</div>
									<p style={{ margin: 0 }}>
										Welcome to Beyond Finance Staking Platform! Sorry, we are currently not providing our services on a mobile
										platform. Please use a web browser with your Metamask wallet.
									</p>
								</div>
							</div>
						</span>
						<span style={isMobile ? { display: 'none' } : {}}>
							<Home></Home>
						</span>
					</Route>
					<Route path='/BYNStake' exact>
						<Main
							heading={'BYN'}
							rewardContractAddress={rewardContractAddress}
							stakingTokenAddress={stakingTokenAddress}
							stakingFactoryContractAddress={stakingFactoryContractAddress}
							stakingFAbi={stakingFAbi}
							stakingAbi={stakingAbi}
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
							token_value={['level1Tokens', 'level2Tokens', 'level3Tokens', 'level4Tokens']}
							reward_value={['level1Reward', 'level2Reward', 'level3Reward', 'level4Reward']}
						/>
					</Route>
					<Route path='/BYNStakeLP' exact>
						{/* <Main
							heading={'BYN LP'}
							stakingFAbi={LpStakingFAbi}
							stakingAbi={LpStakingAbi}
							rewardContractAddress={rewardContractAddress}
							stakingTokenAddress={stakingTokenAddressLP}
							stakingFactoryContractAddress={StakingFactoryContractAddressLP}
							keys={['level1Reward', 'level1Tokens', 'level2Reward', 'level2Tokens', 'withdrawable']}
							token_value={['level1Tokens', 'level2Tokens']}
							reward_value={['level1Reward', 'level2Reward']}
						/> */}
					</Route>
					<Route path='/mint'>{/* <Minter></Minter> */}</Route>
				</Switch>
			</Router>
		</Fragment>
	)
}

export default DataApp
