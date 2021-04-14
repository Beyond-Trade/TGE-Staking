import React, { Fragment } from 'react'

import { Link } from 'react-router-dom'

import './Card.scss'

//
export const Card = ({
	token_image,
	link,
	children,
	level,
	levelsData,
	// token, token_r, value, value_r,
	// total_staked,
	// allowedReward, alloted, allowedForXCoins,
}) => {
	const levels = levelsData
	return (
		<Fragment>
			<div className={`card ${children ? '' : 'homer'}`}>
				{children ? (
					children
				) : (
					<>
						<div className=''>
							<img src={token_image} alt='' />
							<p>
								Deposit <span className='bold'>BYN</span> and earn <span className='bold'>BYN</span>{' '}
							</p>
							{/* <table> */}
							{/* <tbody> */}
							{[
								{ name: 'Current Reward Level', value: `Level ${level}` },
								{
									name: 'Annual Percentage Yield',
									value: `${get_apy(levels)}%`,
								},
								{ name: 'Days of Staking', value: `${levels.lockedDuration} Days` },
								{
									name: 'Max BYN stake in this level',
									value: `${(parseInt(levels.allowedForXCoins) / Math.pow(10, 18)).toFixed(2)} BYN`,
								},
								{
									name: 'Total Staking reward in this level',
									value: `${(parseInt(levels.allowedReward) / Math.pow(10, 18)).toFixed(2)} BYN`,
								},
							].map((elem) => {
								return (
									<div className='row'>
										<div className='inner inner-left'>
											<p>{elem.name}</p>
										</div>
										<div className='inner inner-right'>
											<p>
												<span className='bold'>{elem.value}</span>
											</p>
										</div>
									</div>
								)
							})}
							<div className='tagline'>
								<span className='consolas bold'>
									{(parseInt(levels.allowedForXCoins) / Math.pow(10, 18) - parseInt(levels.alloted) / Math.pow(10, 18)).toFixed(2)}
								</span>{' '}
								left for Staking in this level
								<br />
							</div>
							{/* </tbody> */}
							{/* </table> */}
							{/* {token === 'BYN' ? (
								<h2>
									Total Reward:
									<span className='consolas text-inner'>{(allowedReward / Math.pow(10, 18)).toFixed(4)}</span>
								</h2>
							) : (
								<h2 style={{ visibility: 'hidden' }}>hidden_field</h2>
							)}
							<h2>
								Alloted Tokens:
								<span className='consolas text-inner'>{(alloted / Math.pow(10, 18)).toFixed(4)}</span>
							</h2> */}
							<Link to={link}>
								<div className='button'>
									<span>Stake</span>
								</div>
							</Link>
						</div>
					</>
				)}
			</div>
		</Fragment>
	)
}
function get_apy(levels) {
	switch (levels.rewardPercentTimes100) {
		case '5000':
			return 304.2
		case '3000':
			return 146.0
		case '2500':
			return 101.4
		default:
			break
	}
	return (levels.rewardPercentTimes100 * (levels.lockedDuration / 365)).toFixed(2)
}
