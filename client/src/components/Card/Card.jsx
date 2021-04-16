import React, { Fragment } from 'react'

import { Link } from 'react-router-dom'

import './Card.scss'

export function numberWithCommas(x) {
	try {
		return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
	} catch (err) {
		console.error(err)
		return x
	}
}

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
							<div style={{ color: 'white' }} className='bold'>
								BYN
							</div>
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
									value: `${numberWithCommas((parseInt(levels.allowedForXCoins) / Math.pow(10, 18)).toFixed(0))} BYN`,
								},
								{
									name: 'Total Staking reward in this level',
									value: `${numberWithCommas((parseInt(levels.allowedReward) / Math.pow(10, 18)).toFixed(0))} BYN`,
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
							<label htmlFor=''></label>

							<div style={{ fontSize: '1.33rem', position: 'relative' }} className='tagline'>
								<div
									className='color'
									style={{
										background: 'linear-gradient(to right, #4b40f9, #28cedc)',
										height: '1.62rem',
										width: '100%',
										position: 'absolute',
										top: '0.7rem',
										zIndex: 1,
									}}
								></div>
								<span style={{ zIndex: 20, position: 'absolute', top: 0, left: 0, right: 0 }}>
									<span className='consolas bold'>
										{numberWithCommas(
											(
												parseInt(levels.allowedForXCoins) / Math.pow(10, 18) -
												parseInt(levels.alloted) / Math.pow(10, 18)
											).toFixed(0)
										)}
									</span>{' '}
									left for Staking in this level
								</span>
								<span style={{ visibility: 'none' }}>
									<span className='consolas bold'>
										{numberWithCommas(
											(
												parseInt(levels.allowedForXCoins) / Math.pow(10, 18) -
												parseInt(levels.alloted) / Math.pow(10, 18)
											).toFixed(0)
										)}
									</span>{' '}
									left for Staking in this level
								</span>
							</div>

							<label htmlFor=''></label>
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
	return (levels.rewardPercentTimes100 * (levels.lockedDuration / 365)).toFixed(0)
}
