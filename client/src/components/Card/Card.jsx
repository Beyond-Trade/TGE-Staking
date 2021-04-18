import React, { Fragment } from 'react'

import { Link } from 'react-router-dom'

import './Card.scss'
import Utils from '../../Utils/Utils'

import '../../f2style.css'

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
							<div className='logo-area'>
								<img src={token_image} alt='' style={{ marginBottom: 0, paddingBottom: 0 }} />
							</div>
							<div style={{ color: 'white',
								      margin: 0,
								      marginTop: '-1rem',	
								      fontSize: '1.2em'
								      }} className='bold'>
								BYN
							</div>
							<p style={{ marginTop: 0,
								    marginBottom: '3rem' }}>
								Deposit <span className='bold'>BYN</span> &amp; Earn <span className='bold'>BYN</span>{' '}
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
									value: `${Utils.convertGetNumberFormat((parseInt(levels.allowedForXCoins) / Math.pow(10, 18)).toFixed(0))} BYN`,
								},
								{
									name: 'Total Staking reward in this level',
									value: `${Utils.convertGetNumberFormat((parseInt(levels.allowedReward) / Math.pow(10, 18)).toFixed(0))} BYN`,
								},
							].map((elem) => {
								return (
									<div className='row pdl30' style={{height: '2em'}} >
										<div className='inner inner-left'>
											<p>{elem.name}</p>
										</div>
										<div className='inner inner-right'>
											<p>
												<span className='bold invGdT'>{elem.value}</span>
											</p>
										</div>
									</div>
								)
							})}
							<hr style={{ margin: '1rem 0 2rem 0', border: 0, borderBottom: '1px dashed', borderColor: 'white'}} />
							<label htmlFor=''></label>
							{/* <div style={{ fontSize: '1.3rem', marginBottom: '3rem' }} className='tagline'>
								<div
									className='color'
									style={{
										background: 'linear-gradient(to right, #512dff, #2dcfd9)',
										height: '0.813rem',
										width: '100%',
										// top: '0.5rem',
										marginBottom: '-2rem',
										zIndex: 1,
									}}
								></div>
								<span style={{ zIndex: 20, textShadow: '0.5px 0.8886px 2px rgba(0, 0, 0, 0.75)' }}>
									<span className='consolas bold'>
										{(parseInt(levels.allowedForXCoins) / Math.pow(10, 18) - parseInt(levels.alloted) / Math.pow(10, 18)).toFixed(
											0
										)}
									</span>{' '}
									<span className='consolas bold'>BYN&nbsp;</span>
									left for Staking in this level!
								</span>
							</div> */}
							{/* card.scss */}
							<div className='msInfo'>
								<span className='msInfo-text'>
									<span className='consolas bold'>
										{Utils.convertGetNumberFormat((parseInt(levels.allowedForXCoins) / Math.pow(10, 18) - parseInt(levels.alloted) / Math.pow(10, 18)).toFixed(
											0
										))}
									</span>{' '}
									<span className='consolas bold'>BYN&nbsp;</span>
									left for Staking in this level!
									{/* <div className="msInfo-background"></div> */}
								</span>
								
							</div>

							{/*
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
										{(parseInt(levels.allowedForXCoins) / Math.pow(10, 18) - parseInt(levels.alloted) / Math.pow(10, 18)).toFixed(
											0
										)}
									</span>{' '}
									left for Staking in this level
								</span>
								<span style={{ visibility: 'none' }}>
									<span className='consolas bold'>
										{(parseInt(levels.allowedForXCoins) / Math.pow(10, 18) - parseInt(levels.alloted) / Math.pow(10, 18)).toFixed(
											0
										)}
									</span>{' '}
									left for Staking in this level
								</span>
							</div>
							*/}

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
